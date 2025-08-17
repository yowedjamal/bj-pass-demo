import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TokenData } from "@/types/bjpass"

interface TokenDisplayProps {
  title: string
  tokenData: TokenData | null
}

export function TokenDisplay({ title, tokenData }: TokenDisplayProps) {
  if (!tokenData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucun token disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <pre className="text-sm">{JSON.stringify(tokenData, null, 2)}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
