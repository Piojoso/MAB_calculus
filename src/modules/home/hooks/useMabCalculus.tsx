import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emptyRow, todayLabel } from "../helpers/helpers";

import { toPng } from "html-to-image";

import {
  clearDraft,
  getDraft,
  getParts,
  getRepairQuoteById,
  saveDraft,
  saveRepairQuote,
  updateRepairQuote,
} from "@/lib/db";
import { useAlert } from "@/providers/AlertDialogProvider";
import { CleanDialog } from "../components/CleanDialog";
import { useRepairParts } from "./useRepairParts";
import { useClientData } from "./useClientData";
import type { RepairQuoteStatus } from "../interfaces";
import { toast } from "sonner";
import { NotCompletedQuoteDialog } from "../components/NotCompletedQuoteDialog";

const filter = (node: HTMLElement) => {
  const exclusionTags = ["BUTTON"];

  return !exclusionTags.some((tagName) => node.tagName === tagName);
};

export const useMabCalculus = () => {
  const { closeDialog, openDialog } = useAlert();
  const [repairQuoteId, setRepairQuoteId] = useState<number | null>(null);

  const repairParts = useRepairParts();
  const clientData = useClientData();

  const [quoteDate, setQuoteDate] = useState(todayLabel());
  const [labor, setLabor] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [warranty, setWarranty] = useState(3);
  const [loading, setLoading] = useState(true);
  const [quoteStatus, setQuoteStatus] = useState<RepairQuoteStatus>(
    !repairQuoteId ? "new" : "saved",
  );

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const initialLoadRef = useRef(false);

  const advanceInputRef = useRef<HTMLInputElement>(null);
  const laborInputRef = useRef<HTMLInputElement>(null);
  const warrantyInputRef = useRef<HTMLInputElement>(null);

  // Load persisted catalog and draft on mount.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) return;

      const catalog = await getParts();
      const draft = await getDraft();

      repairParts.actions.setParts(catalog);

      if (draft) {
        clientData.actions.setClientData(draft.clientData);

        repairParts.actions.setRows(
          draft.parts.length
            ? draft.parts.map((p) => ({
                id: Math.random().toString(36).slice(2),
                partId: p.partId,
                price: p.price,
              }))
            : [emptyRow()],
        );
        setLabor(draft.labor);
        setAdvance(draft.advance);
      }
      setLoading(false);
      initialLoadRef.current = true;
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-save draft whenever the quote changes.
  useEffect(() => {
    if (!initialLoadRef.current) return;

    const timeout = setTimeout(() => {
      const client = {
        name: clientData.state.name,
        address: clientData.state.address,
        phone: clientData.state.phone,
      };

      saveDraft(
        client,
        repairParts.state.rows.map((r) => ({
          partId: r.partId,
          price: r.price,
        })),
        labor,
        advance,
      ).catch(() => {
        // Fail silently — this is a best-effort local save.
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [clientData.state, repairParts.state, labor, advance]);

  const partsSubtotal = useMemo(
    () =>
      repairParts.state.rows.reduce(
        (sum, row) => sum + (Number.isFinite(row.price) ? row.price : 0),
        0,
      ),
    [repairParts],
  );
  const balance = partsSubtotal - advance;
  const total = balance + labor;

  const handleClean = useCallback(() => {
    setQuoteDate(todayLabel());
    setQuoteStatus("new");

    clearDraft().catch(() => {});

    clientData.actions.resetClientData();
    repairParts.actions.resetRepairParts();

    setRepairQuoteId(null);
    setLabor(0);
    setAdvance(0);
    setWarranty(3);

    closeDialog();
  }, [clientData, repairParts, closeDialog]);

  const prepareForPicture = () => {
    closeDialog();
    clientData.actions.setIsEditing(false);
    repairParts.actions.setAddDialogOpen(false);
    repairParts.actions.setIsEditing(false);
  };

  const validateQuoteInformation = useCallback(() => {
    const isClientDataEmpty = clientData.state.isEmpty();
    const isRepairPartsEmpty = repairParts.state.isEmpty();

    const emptyItems = [];

    isClientDataEmpty &&
      emptyItems.push("Nombre, dirección o teléfono del Cliente");

    isRepairPartsEmpty &&
      emptyItems.push(
        "Sin repuestos registrados o al menos uno no tiene precio",
      );

    labor <= 0 && emptyItems.push("Sin mano de obra registrada");
    warranty <= 0 && emptyItems.push("Sin garantía registrada");

    return emptyItems;
  }, [clientData, repairParts, labor, warranty]);

  const handleShare = useCallback(
    async (validate: boolean = true) => {
      if (!receiptRef.current) return;

      if (validate) {
        const emptyItems = validateQuoteInformation();
        if (emptyItems.length > 0) {
          handleOpenNotCompletedQuoteDialog(emptyItems);
          return;
        }
      }

      setIsTakingPicture(true);
      prepareForPicture();

      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: "#eef2ff",
        filter: filter,
      });
      setIsTakingPicture(false);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "presupuesto.png", { type: "image/png" });

      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Presupuesto",
            text: "Te paso el presupuesto de la reparación",
          });
          return;
        }
      } catch {
        // Share failed or cancelled; fall back to download.
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "presupuesto.png";
      link.click();

      await updateRepairQuote(repairQuoteId!, { status: "shared" });
    },
    [validateQuoteInformation, repairQuoteId],
  );

  const handleOpenCleanDialog = useCallback(() => {
    openDialog(<CleanDialog onConfirm={handleClean} onCancel={closeDialog} />);
  }, [closeDialog, openDialog]);

  const handleOpenNotCompletedQuoteDialog = useCallback(
    (emptyItems: string[]) => {
      openDialog(
        <NotCompletedQuoteDialog
          emptyItems={emptyItems}
          onConfirm={() => handleShare(false)}
          onCancel={closeDialog}
        />,
      );
    },
    [closeDialog, handleShare],
  );

  const focusInputReference = (input: "labor" | "advance" | "warranty") => {
    switch (input) {
      case "labor":
        if (!laborInputRef.current) return;
        laborInputRef.current.focus();
        break;

      case "advance":
        if (!advanceInputRef.current) return;
        advanceInputRef.current.focus();
        break;

      case "warranty":
        if (!warrantyInputRef.current) return;
        warrantyInputRef.current.focus();
        break;

      default:
        break;
    }
  };

  const handleSelectOldRepairQuote = async (id: number) => {
    const repairQuote = await getRepairQuoteById(id);
    if (!repairQuote) return;

    setRepairQuoteId(repairQuote.id);
    setQuoteDate(repairQuote.date);
    clientData.actions.setClientData(repairQuote.clientData);
    repairParts.actions.setRows(repairQuote.repairRows);
    setAdvance(repairQuote.advance);
    setLabor(repairQuote.labor);
    setWarranty(repairQuote.warranty);
    setQuoteStatus(repairQuote.status);

    // setIsEditingDisabled(repairQuote.shared);
  };

  const handleSaveRepairQuote = async () => {
    const toastId = toast("Sonner");

    toast.loading("Guardando...", { id: toastId });

    const repairQuote = await saveRepairQuote(
      quoteDate,
      clientData.actions.getClientData(),
      repairParts.state.rows,
      advance,
      labor,
      total,
      warranty,
      false,
      "saved",
    );

    if (repairQuote.id) {
      setQuoteStatus("saved");

      setRepairQuoteId(repairQuote.id);

      toast.success("Guardado", {
        id: toastId,
        description: "Presupuesto de reparación guardado exitosamente.",
      });
    }
  };

  return useMemo(
    () => ({
      repairParts,
      clientData,

      state: {
        loading,
        receiptRef,
        partsSubtotal,
        advance,
        balance,
        labor,
        total,
        isTakingPicture,
        advanceInputRef,
        laborInputRef,
        warranty,
        warrantyInputRef,
        repairQuoteId,
        quoteDate,
        quoteStatus,
      },

      actions: {
        handleClean,
        setAdvance,
        setLabor,
        handleShare,
        setWarranty,

        handleOpenCleanDialog,
        focusInputReference,
        handleSelectOldRepairQuote,
        handleSaveRepairQuote,
      },
    }),
    [
      clientData,
      repairParts,
      loading,
      receiptRef,
      partsSubtotal,
      advance,
      balance,
      labor,
      total,
      isTakingPicture,
      advanceInputRef,
      laborInputRef,
      warranty,
      warrantyInputRef,
      repairQuoteId,
      quoteDate,
      quoteStatus,
    ],
  );
};
