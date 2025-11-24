import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OutputConsoleProps {
  stdout: string;
  stderr: string;
  status: "success" | "runtime_error" | "timeout" | null;
  onClear: () => void;
}

const OutputConsole = ({ stdout, stderr, status, onClear }: OutputConsoleProps) => {
  const getStatusBadge = () => {
    if (!status) return null;
    
    const variants: Record<string, { label: string; className: string }> = {
      success: { label: "Success", className: "bg-success text-success-foreground" },
      runtime_error: { label: "Runtime Error", className: "bg-destructive text-destructive-foreground" },
      timeout: { label: "Timeout", className: "bg-warning text-warning-foreground" },
    };

    const config = variants[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Output</h3>
          {getStatusBadge()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3 font-mono text-sm">
          {stdout && (
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase">stdout</div>
              <pre className="whitespace-pre-wrap text-foreground">{stdout}</pre>
            </div>
          )}
          {stderr && (
            <div className="space-y-1">
              <div className="text-xs font-semibold text-destructive uppercase">stderr</div>
              <pre className="whitespace-pre-wrap text-destructive">{stderr}</pre>
            </div>
          )}
          {!stdout && !stderr && (
            <div className="text-muted-foreground text-center py-8">
              No output yet. Run your code to see results.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OutputConsole;
