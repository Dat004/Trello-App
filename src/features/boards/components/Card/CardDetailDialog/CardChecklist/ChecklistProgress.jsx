import { Progress } from "@/Components/UI";

function ChecklistProgress({ completed, total, percentage }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completed}/{total} hoàn thành
        </span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default ChecklistProgress;
