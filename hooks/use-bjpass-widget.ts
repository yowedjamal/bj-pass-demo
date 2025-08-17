"use client";

import { useEffect, useRef, useState } from "react";
import type { BjPassConfig, BjPassWidget } from "@/types/bjpass";

export function useBjPassWidget(config: BjPassConfig) {
  const widgetRef = useRef<BjPassWidget | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const initializeWidget = () => {
      try {
        if (typeof window !== "undefined" && window.BjPassAuthWidget) {
          widgetRef.current = new window.BjPassAuthWidget({
            ...config,
            ui: {
              ...config.ui,
              container: "#bjpass-widget-container",
            },
          });
          setIsLoaded(true);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize widget");
        setIsLoaded(false);
      }
    };

    if (window.BjPassAuthWidget) {
      initializeWidget();
    } else {
      window.addEventListener("bjpass-sdk-loaded", initializeWidget);
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
      window.removeEventListener("bjpass-sdk-loaded", initializeWidget);
    };
  }, [config]);

  const updateConfig = (newConfig: Partial<BjPassConfig>) => {
    if (widgetRef.current) {
      widgetRef.current.updateConfig(newConfig);
    }
  };

  const startAuth = async () => {
    if (!widgetRef.current) {
      throw new Error("Widget not initialized");
    }
    return widgetRef.current.startAuthFlow();
  };

  const logout = async () => {
    if (widgetRef.current) {
      return widgetRef.current.logout();
    }
  };

  return {
    isLoaded,
    error,
    updateConfig,
    startAuth,
    logout,
  };
}