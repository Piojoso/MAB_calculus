import { useEffect, useMemo, useRef, useState } from "react";
import { emptyRow } from "../helpers/helpers";
import type { RepairPart, Row } from "../interfaces";

// import { toPng } from "html-to-image";

import { addPart, clearDraft, getDraft, getParts, saveDraft } from "@/lib/db";
import { useAlert } from "@/providers/AlertDialogProvider";
import { CleanDialog } from "../components/CleanDialog";

const ADD_NEW = "__add_new__";
const EMPTY_PART = "__empty__";

export const useMabCalculus = () => {
  const { closeDialog, openDialog } = useAlert();

  const [parts, setParts] = useState<RepairPart[]>([]);
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [labor, setLabor] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPartName, setNewPartName] = useState("");
  const [newPartPrice, setNewPartPrice] = useState("");
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  // Load persisted catalog and draft on mount.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const catalog = await getParts();
      const draft = await getDraft();
      if (cancelled) return;

      setParts(catalog);
      if (draft) {
        setRows(
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
      saveDraft(
        rows.map((r) => ({ partId: r.partId, price: r.price })),
        labor,
        advance,
      ).catch(() => {
        // Fail silently — this is a best-effort local save.
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [rows, labor, advance]);

  const partsSubtotal = useMemo(
    () =>
      rows.reduce(
        (sum, row) => sum + (Number.isFinite(row.price) ? row.price : 0),
        0,
      ),
    [rows],
  );

  const balance = partsSubtotal - advance;
  const total = balance + labor;

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handlePartSelect(rowId: string, value: string) {
    if (value === ADD_NEW) {
      setPendingRowId(rowId);
      setAddDialogOpen(true);
      return;
    }

    const partId = value === EMPTY_PART ? null : Number(value);
    const part = partId ? parts.find((p) => p.id === partId) : null;

    updateRow(rowId, {
      partId,
      price: part
        ? part.defaultPrice
        : (rows.find((r) => r.id === rowId)?.price ?? 0),
    });
  }

  function handleAddPart() {
    const name = newPartName.trim();
    const price = Number.parseFloat(newPartPrice);
    if (!name || !Number.isFinite(price)) return;

    addPart(name, price).then((part) => {
      setParts((prev) =>
        [...prev, part].sort((a, b) => a.name.localeCompare(b.name)),
      );
      if (pendingRowId) {
        updateRow(pendingRowId, {
          partId: part.id,
          price: part.defaultPrice,
        });
      }
      setNewPartName("");
      setNewPartPrice("");
      setPendingRowId(null);
      setAddDialogOpen(false);
    });
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.length ? next : [emptyRow()];
    });
  }

  function handleClean() {
    clearDraft().catch(() => {});
    setRows([emptyRow()]);
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
    // Props
    loading,
    rows,
    receiptRef,
    parts,
    partsSubtotal,
    advance,
    balance,
    labor,
    total,
    addDialogOpen,
    newPartName,
    newPartPrice,
    handleAddPart,

    // Actions
    handlePartSelect,
    handleClean,

    updateRow,
    removeRow,
    addRow,
    setAdvance,
    setLabor,
    setAddDialogOpen,
    setNewPartName,
    setNewPartPrice,
    handleShare,

    handleOpenCleanDialog,
  };
};
