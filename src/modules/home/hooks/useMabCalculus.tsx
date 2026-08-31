import { useEffect, useMemo, useRef, useState } from "react";
import { emptyRow } from "../helpers/helpers";

// import { toPng } from "html-to-image";

import { clearDraft, getDraft, getParts, saveDraft } from "@/lib/db";
import { useAlert } from "@/providers/AlertDialogProvider";
import { CleanDialog } from "../components/CleanDialog";
import { useRepairParts } from "./useRepairParts";
import { useClientData } from "./useClientData";

export const useMabCalculus = () => {
  const { closeDialog, openDialog } = useAlert();

  const repairParts = useRepairParts();
  const clientData = useClientData();

  const [labor, setLabor] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [loading, setLoading] = useState(true);

  const receiptRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  // Load persisted catalog and draft on mount.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const catalog = await getParts();
      const draft = await getDraft();
      if (cancelled) return;

      repairParts.setParts(catalog);
      if (draft) {
        clientData.setClientData(draft.clientData);

        repairParts.setRows(
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
        name: clientData.name,
        address: clientData.address,
        phone: clientData.phone,
      };

      saveDraft(
        client,
        repairParts.rows.map((r) => ({ partId: r.partId, price: r.price })),
        labor,
        advance,
      ).catch(() => {
        // Fail silently — this is a best-effort local save.
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [repairParts.rows, labor, advance]);

  const partsSubtotal = useMemo(
    () =>
      repairParts.rows.reduce(
        (sum, row) => sum + (Number.isFinite(row.price) ? row.price : 0),
        0,
      ),
    [repairParts.rows],
  );

  const balance = partsSubtotal - advance;
  const total = balance + labor;

  function handleClean() {
    clearDraft().catch(() => {});
    repairParts.setRows([emptyRow()]);
    setLabor(0);
    setAdvance(0);
    closeDialog();
  }

  async function handleShare() {
    if (!receiptRef.current) return;

    // const dataUrl = await toPng(receiptRef.current, {
    //   pixelRatio: 2,
    //   backgroundColor: "#ffffff",
    // });

    // const blob = await (await fetch(dataUrl)).blob();
    // const file = new File([blob], "presupuesto.png", { type: "image/png" });

    // try {
    //   if (navigator.canShare && navigator.canShare({ files: [file] })) {
    //     await navigator.share({
    //       files: [file],
    //       title: "Presupuesto",
    //       text: "Te paso el presupuesto de la reparación",
    //     });
    //     return;
    //   }
    // } catch {
    //   // Share failed or cancelled; fall back to download.
    // }

    // const link = document.createElement("a");
    // link.href = dataUrl;
    // link.download = "presupuesto.png";
    // link.click();
  }

  const handleOpenCleanDialog = () => {
    openDialog(<CleanDialog onConfirm={handleClean} onCancel={closeDialog} />);
  };

  return {
    repairParts,
    clientData,

    // Props
    loading,
    receiptRef,
    partsSubtotal,
    advance,
    balance,
    labor,
    total,

    // Actions

    handleClean,
    setAdvance,
    setLabor,
    handleShare,

    handleOpenCleanDialog,
  };
};
