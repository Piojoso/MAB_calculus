import { useCallback, useMemo, useState } from "react";

import type { DraftClientData } from "../interfaces";
import * as db from "@/lib/db";

export const useClientData = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const setClientData = useCallback((newClientData: DraftClientData) => {
    setName(newClientData.name);
    setAddress(newClientData.address);
    setPhone(newClientData.phone);
  }, []);

  const handleAddClientData = useCallback(
    async (newClientData: DraftClientData) => {
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
    },
    [setClientData],
  );

  const resetClientData = useCallback(() => {
    setName("");
    setAddress("");
    setPhone("");
    setIsEditing(false);
  }, []);

  const getClientData = useCallback((): DraftClientData => {
    return { name, address, phone };
  }, []);

  return useMemo(
    () => ({
      state: { name, address, phone, isEditing },
      actions: {
        setName,
        setAddress,
        setPhone,
        setIsEditing,

        setClientData,
        handleAddClientData,
        resetClientData,
        getClientData,
      },
    }),
    [
      name,
      address,
      phone,
      isEditing,
      setClientData,
      handleAddClientData,
      resetClientData,
    ],
  );
};
