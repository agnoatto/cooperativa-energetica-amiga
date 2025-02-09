
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  fileName: string;
}

export function UploadProgress({ progress, fileName }: UploadProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{fileName}</span>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
