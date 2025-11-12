"use client";

import appStore from "@/store";
import { useEffect } from "react";

/**
 * Component to initialize session from cookies on app load
 * Place this in the root layout to ensure session is restored
 */
export default function SessionInitializer() {
  useEffect(() => {
    // Initialize session from cookies
    appStore.getState().initializeSession();
  }, []);

  return null;
}
