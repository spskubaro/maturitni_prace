import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { STORAGE_KEYS } from "@/config/constants";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: "Vítej v ClimbFlow! 🎉",
    description: "Jsme rádi, že jsi tady! ClimbFlow ti pomůže sledovat čas a dosahovat cílů pomocí motivace výstupů na hory.",
    icon: <span className="text-6xl">⛰️</span>,
  },
  {
    title: "Sleduj svůj čas ⏱️",
    description: "Spusť časovač pro různé aktivity - studium, práci, cvičení nebo koníčky. Každá minuta se počítá!",
    icon: <span className="text-6xl">⏱️</span>,
  },
  {
    title: "Získávej body 🎯",
    description: "Za každou hodinu aktivity získáš body. Různé aktivity mají různou hodnotu bodů podle obtížnosti.",
    icon: <span className="text-6xl">⭐</span>,
  },
  {
    title: "Zdolávej hory ⛰️",
    description: "Body tě posouvají k vrcholu hory! Začneš na Matterhornu a můžeš se dostat až na Mount Everest.",
    icon: <span className="text-6xl">🏔️</span>,
  },
  {
    title: "Odemykej achievementy 🏆",
    description: "Plň milníky a získávej odznaky. Od prvních kroků až po legendární výkony!",
    icon: <span className="text-6xl">🏆</span>,
  },
  {
    title: "Sleduj statistiky 📊",
    description: "Prohlížej si grafy, heatmapy a detailní přehledy svého pokroku. Data jsou tvůj nejlepší motivátor!",
    icon: <span className="text-6xl">📈</span>,
  },
];

export const OnboardingTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
    setIsOpen(false);
  };

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={handleSkip}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {step.icon}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {step.title}
            </h2>

            <p className="text-lg text-muted-foreground text-center mb-8 max-w-lg mx-auto">
              {step.description}
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-primary"
                      : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center gap-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button onClick={handleComplete} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Začít používat
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  Další
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {currentStep < steps.length - 1 && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={handleSkip} className="text-muted-foreground">
                  Přeskočit tutoriál
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



