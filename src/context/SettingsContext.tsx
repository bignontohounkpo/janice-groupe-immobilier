"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AGENCY as FALLBACK_AGENCY } from "@/lib/constants";
import { fetchSettings } from "@/lib/api";

interface AgencySettings {
  NAME: string;
  PHONE: string;
  PHONE_LINK: string;
  EMAIL: string;
  ADDRESS: string;
  WHATSAPP: string;
}

interface SettingsContextType {
  agency: AgencySettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [agency, setAgency] = useState<AgencySettings>(FALLBACK_AGENCY);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const dbSettings = await fetchSettings();
      
      const phone = dbSettings.phone || FALLBACK_AGENCY.PHONE;

      setAgency({
        NAME: dbSettings.name || FALLBACK_AGENCY.NAME,
        PHONE: phone,
        PHONE_LINK: `tel:${phone.replace(/\s+/g, "")}`,
        EMAIL: dbSettings.email || FALLBACK_AGENCY.EMAIL,
        ADDRESS: dbSettings.address || FALLBACK_AGENCY.ADDRESS,
        WHATSAPP: dbSettings.whatsapp ? `https://wa.me/${dbSettings.whatsapp}` : FALLBACK_AGENCY.WHATSAPP,
      });
    } catch (error) {
      console.error("Failed to load agency settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value = React.useMemo(() => ({
    agency,
    loading,
    refreshSettings: loadSettings
  }), [agency, loading]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
