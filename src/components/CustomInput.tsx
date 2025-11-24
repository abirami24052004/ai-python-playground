import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomInputProps {
  input: string;
  onChange: (value: string) => void;
}

const CustomInput = ({ input, onChange }: CustomInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="custom-input" className="text-sm font-medium">
        Custom Input (stdin)
      </Label>
      <Textarea
        id="custom-input"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter input for your program (one value per line)..."
        className="min-h-[100px] font-mono text-sm resize-none"
      />
    </div>
  );
};

export default CustomInput;
