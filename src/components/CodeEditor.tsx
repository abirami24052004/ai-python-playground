import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div className="h-full w-full border border-border rounded-lg overflow-hidden bg-editor-bg">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={handleEditorChange}
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
