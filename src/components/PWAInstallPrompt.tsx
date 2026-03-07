import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export const PWAInstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("climbflow_pwa_dismissed") === "true";
  });

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("climbflow_pwa_dismissed", "true");
  };

  return (
    <Card className="fixed bottom-4 right-4 max-w-sm z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Nainstalovat ClimbFlow</h3>
            <p className="text-sm text-muted-foreground mb-3">
              přidej si aplikaci na plochu pro rychly přistup a offline rezim
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Nainstalovat
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                Pozdeji
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


