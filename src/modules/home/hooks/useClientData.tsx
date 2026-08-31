import { useState } from "react";
import type { DraftClientData } from "../interfaces";
import * as db from "@/lib/db";

export const useClientData = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const setClientData = (newClientData: DraftClientData) => {
    setName(newClientData.name);
    setAddress(newClientData.address);
    setPhone(newClientData.phone);
  };

  const handleAddClientData = async (newClientData: DraftClientData) => {
    const newName = newClientData.name.trim();
    const newAddress = newClientData.address.trim();
    const newPhone = newClientData.phone.trim();

    if (!newName || !newAddress || !newPhone) return;

    const draftData = await db.getDraft();

    await db.saveDraft(
      newClientData,
      draftData?.parts ?? [],
      draftData?.labor ?? 0,
      draftData?.advance ?? 0,
    );

    setClientData({ name: newName, address: newAddress, phone: newPhone });
    setIsEditing(false);
  };

  return {
    // State
    name,
    address,
    phone,
    isEditing,

    // Actions
    setName,
    setAddress,
    setPhone,
    setIsEditing,

    setClientData,
    handleAddClientData,
  };
};
