import { useEffect, useState } from "react";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { STORAGE_KEYS } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    title: "Vítej v ClimbFlow! 🎉",
    description:
      "Jsme rádi, že jsi tady! ClimbFlow ti pomůže sledovat čas a dosahovat cílů pomocí motivace výstupů na hory.",
    icon: <span className="text-6xl">⛰️</span>,
  },
  {
    title: "Sleduj svůj čas ⏱️",
    description:
      "Spusť časovač pro různé aktivity - studium, práci, cvičení nebo koníčky. Každá minuta se počítá!",
    icon: <span className="text-6xl">⏱️</span>,
  },
  {
    title: "Získávej body 🎯",
    description:
      "Za každou hodinu aktivity získáš body. Různé aktivity mají různou hodnotu bodů podle obtížnosti.",
    icon: <span className="text-6xl">⭐</span>,
  },
  {
    title: "Zdolávej hory ⛰️",
    description:
      "Body tě posouvají k vrcholu hory! Začneš na Matterhornu a můžeš se dostat až na Mount Everest.",
    icon: <span className="text-6xl">🏔️</span>,
  },
  {
    title: "Odemykej úspěchy 🏆",
    description:
      "Plň milníky a získávej odznaky. Od prvních kroků až po legendární výkony!",
    icon: <span className="text-6xl">🏆</span>,
  },
  {
    title: "Sleduj statistiky 📊",
    description:
      "Prohlížej si grafy, heatmapy a detailní přehledy svého pokroku. Data jsou tvůj nejlepší motivátor!",
    icon: <span className="text-6xl">📈</span>,
  },
];

export const OnboardingTutorial = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const onboardingStorageKey = user
    ? `${STORAGE_KEYS.ONBOARDING_COMPLETED}_${user.id}`
    : STORAGE_KEYS.ONBOARDING_COMPLETED;

  useEffect(() => {
    if (!user) return;

    const hasSeenOnboarding = localStorage.getItem(onboardingStorageKey);
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [user, onboardingStorageKey]);

  const handleComplete = () => {
    localStorage.setItem(onboardingStorageKey, "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(onboardingStorageKey, "true");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      return;
    }
    handleSkip();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
    handleComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100%-1rem)] md:w-full max-h-[90vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={handleSkip}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="p-5 sm:p-8 md:p-12">
            <div className="flex justify-center mb-6">{step.icon}</div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
              {step.title}
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground text-center mb-8 max-w-lg mx-auto">
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="w-full sm:flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button onClick={handleComplete} className="w-full sm:flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Začít používat
                </Button>
              ) : (
                <Button onClick={handleNext} className="w-full sm:flex-1">
                  Další
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {currentStep < steps.length - 1 && (
              <div className="text-center mt-4">
                <Button
                  variant="link"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
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
