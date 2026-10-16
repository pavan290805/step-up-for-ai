"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
// Import other contexts as they are implemented
// import { StudentProvider } from "./StudentContext";
// import { RecruiterProvider } from "./RecruiterContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {/* Add other providers here */}
      {children}
    </AuthProvider>
  );
};
