"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface DemoCardProps {
  title: string
  description: string
  children?: ReactNode
  onInit: () => void
  isLoading?: boolean
  error?: string | null
  disabled?: boolean
}

export function DemoCard({
  title,
  description,
  children,
  onInit,
  isLoading = false,
  error,
  disabled = false
}: DemoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}

        <Button
          onClick={onInit}
          disabled={isLoading || disabled}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initialisation...
            </>
          ) : (
            "Initialiser le Widget"
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}