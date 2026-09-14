import { useRef, useState } from "react";
import { Upload, Loader2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api, API, formatApiError } from "@/lib/api";

const ImageField = ({ value, onChange, testId, id }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const base = API.replace(/\/api$/, "");
  const preview = value ? (value.startsWith("/api/") ? `${base}${value}` : value) : "";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(`${base}${data.url}`);
      toast.success("Gambar berhasil diunggah");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt="preview" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" data-testid={`${testId}-preview`} />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400"><Link2 size={18} /></div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-slate-50 disabled:opacity-60"
          data-testid={`${testId}-upload-button`}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Mengunggah..." : "Unggah Gambar"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} data-testid={`${testId}-file-input`} />
      </div>
      <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="atau tempel URL gambar https://..." data-testid={testId} />
    </div>
  );
};

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
      control = <ImageField value={value} onChange={onChange} testId={testId} id={id} />;
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
