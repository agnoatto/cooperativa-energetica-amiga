
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-6">
      <Loader2 className="h-6 w-6 animate-spin opacity-50" />
    </div>
  );
}
