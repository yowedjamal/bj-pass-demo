"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { PresetConfig } from "@/types/bjpass"

interface ConfigFormProps {
  config: any
  onConfigChange: (config: any) => void
}

const presetConfigs: PresetConfig[] = [
  {
    name: "Configuration Minimale",
    description: "Configuration de base pour tester rapidement",
    config: {
      environment: "test",
      clientId: "demo-client",
      scope: "openid profile",
      ui: {
        theme: "default",
        language: "fr",
      },
    },
  },
  {
    name: "Configuration Complète",
    description: "Toutes les fonctionnalités activées",
    config: {
      environment: "test",
      clientId: "demo-client",
      authServer: "main-as",
      scope: "openid profile email",
      pkce: true,
      verifyAccessToken: true,
      useBackend: true,
      popupMode: true,
      autoClosePopup: true,
      debug: true,
      analytics: true,
      ui: {
        showEnvSelector: true,
        theme: "modern",
        language: "fr",
        primaryColor: "#6366f1",
      },
    },
  },
  {
    name: "Mode Production",
    description: "Configuration sécurisée pour la production",
    config: {
      environment: "production",
      clientId: "prod-client",
      authServer: "main-as",
      scope: "openid profile",
      pkce: true,
      verifyAccessToken: true,
      useBackend: true,
      popupMode: true,
      autoClosePopup: true,
      ui: {
        showEnvSelector: false,
        theme: "default",
        language: "fr",
      },
    },
  },
]

export function ConfigForm({ config, onConfigChange }: ConfigFormProps) {
  const [formData, setFormData] = useState<any>(config)

  const handleChange = (field: string, value: any) => {
    const keys = field.split(".")
    const newConfig = { ...formData }

    if (keys.length === 1) {
      newConfig[keys[0] as keyof any] = value
    } else if (keys.length === 2) {
      const [parent, child] = keys
      newConfig[parent as keyof any] = {
        ...(newConfig[parent as keyof any] as any),
        [child]: value,
      }
    }

    setFormData(newConfig)
    onConfigChange(newConfig)
  }

  const applyPreset = (preset: PresetConfig) => {
    const newConfig = { ...formData, ...preset.config }
    setFormData(newConfig)
    onConfigChange(newConfig)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Avancée du Widget BjPass</CardTitle>

        <div className="space-y-2">
          <Label>Configurations Prédéfinies</Label>
          <div className="flex flex-wrap gap-2">
            {presetConfigs.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="base">Base</TabsTrigger>
            <TabsTrigger value="oauth">OAuth</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="ui">Interface</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value="base" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="environment">Environnement</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.environment}
                    onValueChange={(value: "test" | "production") => handleChange("environment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test (test-tx-pki.gouv.bj)</SelectItem>
                      <SelectItem value="production">Production (tx-pki.gouv.bj)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant={formData.environment === "production" ? "destructive" : "secondary"}>
                    {formData.environment?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID *</Label>
                <Input
                  id="clientId"
                  value={formData.clientId || ""}
                  onChange={(e) => handleChange("clientId", e.target.value)}
                  placeholder="your-client-id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authServer">Serveur d'authentification</Label>
                <Input
                  id="authServer"
                  value={formData.authServer || ""}
                  onChange={(e) => handleChange("authServer", e.target.value)}
                  placeholder="main-as"
                />
                <p className="text-sm text-muted-foreground">Identifiant du serveur (défaut: "main-as")</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Scope OAuth</Label>
                <Input
                  id="scope"
                  value={formData.scope || ""}
                  onChange={(e) => handleChange("scope", e.target.value)}
                  placeholder="openid profile email"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="oauth" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pkce"
                  checked={formData.pkce || false}
                  onCheckedChange={(checked) => handleChange("pkce", checked)}
                />
                <Label htmlFor="pkce">Activer PKCE</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="verifyAccessToken"
                  checked={formData.verifyAccessToken || false}
                  onCheckedChange={(checked) => handleChange("verifyAccessToken", checked)}
                />
                <Label htmlFor="verifyAccessToken">Vérifier les tokens d'accès</Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tokenVerificationScopes">Scopes de vérification des tokens</Label>
                <Textarea
                  id="tokenVerificationScopes"
                  value={formData.tokenVerificationScopes?.join("\n") || ""}
                  onChange={(e) => handleChange("tokenVerificationScopes", e.target.value.split("\n").filter(Boolean))}
                  placeholder="urn:safelayer:eidas:oauth:token:introspect"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="popupMode"
                  checked={formData.popupMode !== false}
                  onCheckedChange={(checked) => handleChange("popupMode", checked)}
                />
                <Label htmlFor="popupMode">Mode popup</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoClosePopup"
                  checked={formData.autoClosePopup !== false}
                  onCheckedChange={(checked) => handleChange("autoClosePopup", checked)}
                />
                <Label htmlFor="autoClosePopup">Fermeture automatique du popup</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backend" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="useBackend"
                checked={formData.useBackend || false}
                onCheckedChange={(checked) => handleChange("useBackend", checked)}
              />
              <Label htmlFor="useBackend">Utiliser l'intégration backend</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backendUrl">URL du backend</Label>
                <Input
                  id="backendUrl"
                  value={formData.backendUrl || ""}
                  onChange={(e) => handleChange("backendUrl", e.target.value)}
                  placeholder="https://your-backend.com"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Endpoints Backend</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint-start">Endpoint de démarrage</Label>
                  <Input
                    id="endpoint-start"
                    value={formData.backendEndpoints?.start || ""}
                    onChange={(e) => handleChange("backendEndpoints.start", e.target.value)}
                    placeholder="/auth/start"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint-status">Endpoint de statut</Label>
                  <Input
                    id="endpoint-status"
                    value={formData.backendEndpoints?.status || ""}
                    onChange={(e) => handleChange("backendEndpoints.status", e.target.value)}
                    placeholder="/auth/api/status"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint-user">Endpoint utilisateur</Label>
                  <Input
                    id="endpoint-user"
                    value={formData.backendEndpoints?.user || ""}
                    onChange={(e) => handleChange("backendEndpoints.user", e.target.value)}
                    placeholder="/auth/api/user"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint-logout">Endpoint de déconnexion</Label>
                  <Input
                    id="endpoint-logout"
                    value={formData.backendEndpoints?.logout || ""}
                    onChange={(e) => handleChange("backendEndpoints.logout", e.target.value)}
                    placeholder="/auth/api/logout"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={formData.ui?.theme || "default"}
                  onValueChange={(value) => handleChange("ui.theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Défaut</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="modern">Moderne</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={formData.ui?.language || "fr"}
                  onValueChange={(value) => handleChange("ui.language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Couleur primaire</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.ui?.primaryColor || "#0066cc"}
                    onChange={(e) => handleChange("ui.primaryColor", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.ui?.primaryColor || "#0066cc"}
                    onChange={(e) => handleChange("ui.primaryColor", e.target.value)}
                    placeholder="#0066cc"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="container">Conteneur CSS</Label>
                <Input
                  id="container"
                  value={formData.ui?.container || ""}
                  onChange={(e) => handleChange("ui.container", e.target.value)}
                  placeholder="#bjpass-auth-container"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showEnvSelector"
                  checked={formData.ui?.showEnvSelector !== false}
                  onCheckedChange={(checked) => handleChange("ui.showEnvSelector", checked)}
                />
                <Label htmlFor="showEnvSelector">Afficher le sélecteur d'environnement</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frontendOrigin">Origine Frontend</Label>
                <Input
                  id="frontendOrigin"
                  value={formData.frontendOrigin || ""}
                  onChange={(e) => handleChange("frontendOrigin", e.target.value)}
                  placeholder="https://your-frontend.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backendOrigin">Origine Backend</Label>
                <Input
                  id="backendOrigin"
                  value={formData.backendOrigin || ""}
                  onChange={(e) => handleChange("backendOrigin", e.target.value)}
                  placeholder="https://your-backend.com"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Headers personnalisés</Label>
              <Textarea
                value={JSON.stringify(formData.header || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    handleChange("header", headers)
                  } catch (error) {
                    // Ignore invalid JSON
                  }
                }}
                placeholder='{\n  "Authorization": "Bearer token",\n  "Custom-Header": "value"\n}'
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="debug"
                  checked={formData.debug || false}
                  onCheckedChange={(checked) => handleChange("debug", checked)}
                />
                <Label htmlFor="debug">Mode debug</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="analytics"
                  checked={formData.analytics || false}
                  onCheckedChange={(checked) => handleChange("analytics", checked)}
                />
                <Label htmlFor="analytics">Analytics</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRetries">Nombre max de tentatives</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  value={formData.maxRetries || 0}
                  onChange={(e) => handleChange("maxRetries", Number.parseInt(e.target.value) || 0)}
                  placeholder="3"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
