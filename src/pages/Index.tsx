import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Code2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import CustomInput from "@/components/CustomInput";
import OutputConsole from "@/components/OutputConsole";
import AiTutorPanel from "@/components/AiTutorPanel";
import { toast } from "sonner";

const STARTER_CODE = `# Welcome to AI Python Online Compiler
# Type your Python code here and click Run

name = input("Enter your name: ")
print(f"Hello, {name}! 🚀")`;

const Index = () => {
  const [code, setCode] = useState(STARTER_CODE);
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState({
    stdout: "",
    stderr: "",
    status: null as "success" | "runtime_error" | "timeout" | null,
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    toast.info("Running your code...");

    try {
      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          stdin: customInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const data = await response.json();
      setOutput({
        stdout: data.stdout,
        stderr: data.stderr,
        status: data.status,
      });

      if (data.status === "success") {
        toast.success("Code executed successfully!");
      } else if (data.status === "runtime_error") {
        toast.error("Runtime error occurred");
      } else if (data.status === "timeout") {
        toast.warning("Execution timed out");
      }
    } catch (error) {
      toast.error("Backend server not reachable. Please start the API server.");
      console.error("Execution error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput({
      stdout: "",
      stderr: "",
      status: null,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AI Python Online Compiler</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor and Input */}
        <div className="flex-1 flex flex-col p-6 gap-4 overflow-auto">
          <div className="flex-1 min-h-[400px]">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <div className="space-y-4">
            <CustomInput input={customInput} onChange={setCustomInput} />
          </div>
        </div>

        {/* Right Panel - AI Tutor */}
        <div className="w-[400px] border-l border-border bg-background p-6 overflow-auto">
          <AiTutorPanel
            code={code}
            lastRun={output.status ? output : null}
          />
        </div>
      </div>

      {/* Bottom Panel - Output */}
      <div className="h-[300px] border-t border-border bg-background p-6">
        <OutputConsole
          stdout={output.stdout}
          stderr={output.stderr}
          status={output.status}
          onClear={handleClearOutput}
        />
      </div>
    </div>
  );
};

export default Index;
