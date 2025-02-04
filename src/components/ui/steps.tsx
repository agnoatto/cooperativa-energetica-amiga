import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200">
          <div
            className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors",
                  index <= currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
                )}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    index <= currentStep ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step.title}
                </div>
                <div className="mt-1 text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}