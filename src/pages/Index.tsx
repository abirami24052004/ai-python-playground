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
    status: null as "success" | "runtime_error" | "timeout" | "syntax_error" | "io_error" | null,
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    toast.info("Running your code...");

    try {
      // Using Piston API for code execution (free, no setup required)
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "python",
          version: "3.10.0",
          files: [
            {
              content: code,
            },
          ],
          stdin: customInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute code");
      }

      const data = await response.json();
      
      const stdout = data.run.stdout || "";
      const stderr = data.run.stderr || "";
      const signal = data.run.signal;
      const exitCode = data.run.code;
      
      // Categorize error types based on stderr content and exit code
      let status: "success" | "runtime_error" | "timeout" | "syntax_error" | "io_error" = "success";
      
      // Check if execution timed out
      if (signal === "SIGTERM" || signal === "SIGKILL") {
        status = "timeout";
      } else if (stderr) {
        // Categorize specific error types
        if (stderr.includes("SyntaxError") || stderr.includes("IndentationError") || 
            stderr.includes("TabError") || (exitCode === 1 && stderr.includes("Error: expected"))) {
          status = "syntax_error";
        } else if (stderr.includes("IOError") || stderr.includes("FileNotFoundError") || 
                   stderr.includes("PermissionError") || stderr.includes("OSError")) {
          status = "io_error";
        } else {
          status = "runtime_error";
        }
      }

      // Format stderr with appropriate prefix
      let formattedStderr = stderr;
      if (status === "syntax_error") {
        formattedStderr = "⚠️ Syntax Error - Fix your code before running:\n\n" + stderr;
      } else if (status === "io_error") {
        formattedStderr = "⚠️ I/O Error:\n\n" + stderr;
      } else if (status === "runtime_error") {
        formattedStderr = "⚠️ Runtime Error:\n\n" + stderr;
      } else if (status === "timeout") {
        formattedStderr = stderr + "\n[Execution timed out]";
      }

      setOutput({
        stdout,
        stderr: formattedStderr,
        status,
      });

      if (status === "success") {
        toast.success("Code executed successfully!");
      } else if (status === "syntax_error") {
        toast.error("Syntax error in your code");
      } else if (status === "runtime_error") {
        toast.error("Runtime error occurred");
      } else if (status === "io_error") {
        toast.error("I/O error occurred");
      } else if (status === "timeout") {
        toast.warning("Execution timed out");
      }
    } catch (error) {
      toast.error("Failed to execute code. Please try again.");
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
