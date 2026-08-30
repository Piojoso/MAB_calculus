import { useState } from "react";

export const useClientData = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return {
    // State
    name,
    address,
    phone,

    // Actions
    setName,
    setAddress,
    setPhone,
  };
};
