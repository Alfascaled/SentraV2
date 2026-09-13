import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const FieldInput = ({ field, value, onChange, testId }) => {
  const id = `field-${field.name}`;
  const common = { id, "data-testid": testId };
  let control;
  switch (field.type) {
    case "textarea":
      control = <Textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...common} />;
      break;
    case "number":
      control = <Input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} {...common} />;
      break;
    case "tags":
      control = <Input value={Array.isArray(value) ? value.join(", ") : value ?? ""} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Item 1, Item 2, Item 3" {...common} />;
      break;
    case "select":
      control = (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" {...common}>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case "boolean":
      control = (
        <div className="flex items-center gap-3 pt-1">
          <Switch checked={!!value} onCheckedChange={onChange} {...common} />
          <span className="text-sm text-slate-600">{value ? "Ya" : "Tidak"}</span>
        </div>
      );
      break;
    case "image":
      control = (
        <div className="flex items-center gap-3">
          {value && <img src={value} alt="" className="h-12 w-12 rounded-lg object-cover" />}
          <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." {...common} />
        </div>
      );
      break;
    default:
      control = <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} {...common} />;
  }
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">{field.label}</Label>
      {control}
    </div>
  );
};
