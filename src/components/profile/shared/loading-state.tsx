import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Đang tải dữ liệu..." }: LoadingStateProps) {
  return (
    <Card className="p-12 bg-secondary/30 border border-dashed border-border text-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </Card>
  );
}
