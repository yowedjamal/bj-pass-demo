"use client";

import { useEffect, useState } from "react";
import { HeaderDemo } from "@/components/demo/header-demo";
import { DemoCard } from "@/components/demo/demo-card";
import { ConfigForm } from "@/components/demo/config-form";
import { TokenDisplay } from "@/components/demo/token-display";
import type { TokenData } from "@/types/bjpass";

import BjPassAuthWidget from "bj-pass-sdk";

export default function TestWidgetPage() {
  const [basicToken, setBasicToken] = useState<TokenData | null>(null);
  const [advancedToken, setAdvancedToken] = useState<TokenData | null>(null);
  const [isBasicLoading, setIsBasicLoading] = useState(false);
  const [isAdvancedLoading, setIsAdvancedLoading] = useState(false);
  const [basicError, setBasicError] = useState<string | null>(null);
  const [advancedError, setAdvancedError] = useState<string | null>(null);
  const [advancedWidget, setAdvancedWidget] = useState<BjPassAuthWidget | null>(
    null
  );

  // Advanced configuration
  const [advancedConfig, setAdvancedConfig] = useState<any>({
    environment: "test",
    clientId: "",
    scope: "openid profile email",
    authServer: "main-as",
    backendUrl: "http://localhost:8000",
    useBackend: true,
    frontendOrigin: "http://localhost:3000",
    backendOrigin: "http://localhost:8000",
    ui: {
      container: "#bjpass-widget-container",
      theme: "dark",
      showEnvSelector: true,
    },
    onInit: () => {
      setIsAdvancedLoading(true);
      setAdvancedError(null);
    },
    onSuccess: (tokenData: TokenData) => {
      setAdvancedToken(tokenData);
      setIsAdvancedLoading(false);
      setAdvancedError(null);
    },
    onError: (error: any) => {
      setAdvancedError(`${error.error}: ${error.error_description}`);
      setIsAdvancedLoading(false);
    },
  });
  // const advancedWidget = useBjPassWidget();

  const [basicWidget, setBasicWidget] = useState<BjPassAuthWidget | null>(null);

  useEffect(() => {
    const widget = new BjPassAuthWidget({
      environment: "test",
      clientId: "",
      scope: "openid profile email",
      authServer: "main-as",
      backendUrl: "http://localhost:8000",
      useBackend: true,
      ui: {
        container: "#bjpass-widget-container",
        theme: "light",
        showEnvSelector: false,
        language: "en",
        primaryColor: "#4F46E5",
      },
      frontendOrigin: "http://localhost:3000",
      backendOrigin: "http://localhost:8000",
      onSuccess: (tokenData: any) => {
        setBasicToken(tokenData as TokenData);
        setIsBasicLoading(false);
        setBasicError(null);
      },
      onError: (error: any) => {
        setBasicError(`${error.error}: ${error.error_description}`);
        setIsBasicLoading(false);
      },
    });

    const advancedWidget = new BjPassAuthWidget(advancedConfig);

    setBasicWidget(widget);
    setAdvancedWidget(advancedWidget);
  }, []);

  const handleBasicInit = async () => {
    setIsBasicLoading(true);
    setBasicError(null);
    try {
      await basicWidget!.startAuthFlow();
    } catch (error) {
      setBasicError(
        error instanceof Error
          ? error.message
          : "Failed to start authentication"
      );
    } finally {
      setIsBasicLoading(false);
    }
  };

  const handleAdvancedInit = async () => {
    setIsAdvancedLoading(true);
    setAdvancedError(null);
    try {
      await advancedWidget!.startAuthFlow();
    } catch (error) {
      setAdvancedError(
        error instanceof Error
          ? error.message
          : "Failed to start authentication"
      );
    } finally {
      setIsAdvancedLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <HeaderDemo />

          {/* Widget containers (hidden since we're using the SDK's UI) */}
          <div id="bjpass-widget-container" style={{ display: "none" }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DemoCard
              title="🚀 Basic Widget"
              description="Default configuration with essential parameters"
              onInit={handleBasicInit}
              isLoading={isBasicLoading}
              error={basicError}
            >
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Environment:</strong> Test
                </p>
                <p>
                  <strong>Client ID:</strong> demo-client-id
                </p>
                <p>
                  <strong>Scope:</strong> openid profile email
                </p>
              </div>
            </DemoCard>
            <DemoCard
              title="⚙️ Advanced Widget"
              description="Customizable configuration with all parameters"
              onInit={handleAdvancedInit}
              isLoading={isAdvancedLoading}
              error={advancedError}
            />
          </div>

          <div className="mb-8">
            <ConfigForm
              config={advancedConfig}
              onConfigChange={(newConfig) => {
                setAdvancedConfig(newConfig);
                advancedWidget!.updateConfig(newConfig);
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TokenDisplay title="Basic Widget Token" tokenData={basicToken} />
            <TokenDisplay
              title="Advanced Widget Token"
              tokenData={advancedToken}
            />
          </div>
        </div>
      </div>
    </>
  );
}
