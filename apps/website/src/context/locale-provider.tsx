"use client";

import React from "react";
import { PageEntry } from "../lib/contentful-graphql";

interface LocaleContextType {
  locale: string;
  currentPage: PageEntry | null;
  otherLocalePage: PageEntry | null;
}

const LocaleContext = React.createContext<LocaleContextType | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: string;
  currentPage: PageEntry | null;
  otherLocalePage: PageEntry | null;
}

const LocaleProvider = ({
  children,
  locale,
  currentPage,
  otherLocalePage,
}: LocaleProviderProps) => {
  return (
    <LocaleContext.Provider value={{ locale, currentPage, otherLocalePage }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;

export const useLocale = () => {
  const context = React.useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
