
import { NavigationButton } from "./NavigationButton";
import { MonthDisplay } from "./MonthDisplay";

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ currentDate, onPreviousMonth, onNextMonth }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <NavigationButton direction="previous" onClick={onPreviousMonth} />
      <MonthDisplay currentDate={currentDate} />
      <NavigationButton direction="next" onClick={onNextMonth} />
    </div>
  );
}
