import { createContext, useContext, useState } from "react";

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState(() => {
    const savedItems = localStorage.getItem("melahubSaved");

    return savedItems ? JSON.parse(savedItems) : [];
  });

  const toggleSaved = (id) => {
    setSaved((previous) => {
      let updated;

      if (previous.includes(id)) {
        updated = previous.filter((savedId) => savedId !== id);
      } else {
        updated = [...previous, id];
      }

      localStorage.setItem(
        "melahubSaved",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const isSaved = (id) => {
    return saved.includes(id);
  };

  const clearSaved = () => {
    setSaved([]);
    localStorage.removeItem("melahubSaved");
  };

  return (
    <SavedContext.Provider
      value={{
        saved,
        toggleSaved,
        isSaved,
        clearSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}