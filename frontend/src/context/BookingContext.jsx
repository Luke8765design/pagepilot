import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [presetService, setPresetService] = useState("");

  const openBooking = (service = "") => {
    setPresetService(service);
    setOpen(true);
  };

  return (
    <BookingContext.Provider value={{ open, setOpen, openBooking, presetService }}>
      {children}
    </BookingContext.Provider>
  );
};
