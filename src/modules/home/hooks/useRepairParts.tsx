import { useState } from "react";
import { emptyRow } from "../helpers/helpers";
import type { RepairPart, Row } from "../interfaces";
import { addPart } from "@/lib/db";

const ADD_NEW = "__add_new__";
const EMPTY_PART = "__empty__";

export const useRepairParts = () => {
  const [parts, setParts] = useState<RepairPart[]>([]);
  const [rows, setRows] = useState<Row[]>([emptyRow()]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [pendingRowId, setPendingRowId] = useState<string | null>(null);
  const [newPartName, setNewPartName] = useState("");
  const [newPartPrice, setNewPartPrice] = useState("");

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

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.length ? next : [emptyRow()];
    });
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function handleAddNewPart() {
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

  return {
    rows,
    parts,
    addDialogOpen,
    newPartName,
    newPartPrice,
    pendingRowId,

    setParts,
    setRows,
    setAddDialogOpen,
    setNewPartName,
    setNewPartPrice,
    setPendingRowId,

    handlePartSelect,
    updateRow,
    removeRow,
    addRow,
    handleAddNewPart,
  };
};
