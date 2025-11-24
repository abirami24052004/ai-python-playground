import { Editor, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Add Python syntax validation
    const validatePython = () => {
      const model = editor.getModel();
      if (!model) return;

      const code = model.getValue();
      const markers: editor.IMarkerData[] = [];
      const lines = code.split("\n");

      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Check for tabs (Python prefers spaces)
        if (line.includes("\t")) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            message: "Use spaces instead of tabs for indentation",
          });
        }

        // Check for missing colons in common structures
        const trimmed = line.trim();
        const colonRequired = /^(if|elif|else|for|while|def|class|try|except|finally|with)\s+/;
        if (colonRequired.test(trimmed) && !trimmed.endsWith(":") && !trimmed.endsWith("\\")) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            message: "Missing colon ':' at end of statement",
          });
        }

        // Check for common Python typos
        const typos = {
          'pritn': 'print',
          'reutrn': 'return',
          'slef': 'self',
          'Fasle': 'False',
          'Ture': 'True',
          'esle': 'else',
          'inport': 'import',
        };
        
        Object.entries(typos).forEach(([typo, correct]) => {
          const regex = new RegExp(`\\b${typo}\\b`, 'g');
          let match;
          while ((match = regex.exec(line)) !== null) {
            const startColumn = match.index + 1;
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: lineNumber,
              startColumn,
              endLineNumber: lineNumber,
              endColumn: startColumn + typo.length,
              message: `Did you mean '${correct}'?`,
            });
          }
        });
      });

      monaco.editor.setModelMarkers(model, "python", markers);
    };

    // Validate on content change
    editor.onDidChangeModelContent(() => {
      setTimeout(validatePython, 300);
    });

    // Initial validation
    validatePython();
  };

  return (
    <div className="h-full w-full border border-border rounded-lg overflow-hidden bg-editor-bg">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
