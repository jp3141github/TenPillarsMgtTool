import React, { createContext, useContext, useState, useEffect } from "react";

export type LayoutMode = "desktop" | "mobile";

interface LayoutContextType {
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
  toggleLayout: () => void;
}

const STORAGE_KEY = "layout-mode";

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

function getInitialLayout(): LayoutMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "desktop" || stored === "mobile") return stored;
  } catch { /* ignore */ }
  // Auto-detect on first visit
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutMode>(getInitialLayout);

  const setLayout = (mode: LayoutMode) => {
    setLayoutState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch { /* ignore */ }
  };

  const toggleLayout = () => {
    setLayout(layout === "desktop" ? "mobile" : "desktop");
  };

  // Keep body data attribute in sync for any CSS hooks
  useEffect(() => {
    document.documentElement.dataset.layout = layout;
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout, toggleLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}
