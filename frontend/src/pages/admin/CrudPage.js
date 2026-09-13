import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatApiError } from "@/lib/api";
import { CRUD_CONFIG } from "./crudConfig";
import { FieldInput } from "./FieldInput";

export default function CrudPage() {
  const { collection } = useParams();
  const cfg = CRUD_CONFIG[collection];
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get(`/${collection}`).then((r) => setItems(r.data));
  useEffect(() => { setItems([]); load(); }, [collection]); // eslint-disable-line

  if (!cfg) return <p>Koleksi tidak ditemukan.</p>;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) await api.put(`/${collection}/${editing.id}`, editing);
      else await api.post(`/${collection}`, editing);
      toast.success(`${cfg.singular} berhasil disimpan`);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/${collection}/${deleting.id}`);
      toast.success(`${cfg.singular} dihapus`);
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <div data-testid={`crud-page-${collection}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-orange">Konten</p>
          <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">{cfg.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{items.length} item · perubahan langsung tampil di website</p>
        </div>
        <Button onClick={() => setEditing({ ...cfg.empty, order: items.length })} className="rounded-full bg-brand-orange hover:bg-[#ff7a26]" data-testid="crud-add-button">
          <Plus size={16} className="mr-1" /> Tambah {cfg.singular}
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Table data-testid="crud-table">
          <TableHeader>
            <TableRow className="bg-slate-50">
              {cfg.columns.map((c) => <TableHead key={c.key} className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</TableHead>)}
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={cfg.columns.length + 1} className="py-10 text-center text-sm text-slate-500">Belum ada data.</TableCell></TableRow>}
            {items.map((item, i) => (
              <TableRow key={item.id} data-testid={`crud-row-${i}`}>
                {cfg.columns.map((c) => <TableCell key={c.key} className="max-w-xs truncate text-sm text-slate-700">{c.render ? c.render(item[c.key]) : String(item[c.key] ?? "")}</TableCell>)}
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(item)} data-testid={`crud-edit-${i}`}><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => setDeleting(item)} data-testid={`crud-delete-${i}`}><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl" data-testid="crud-dialog">
          <DialogHeader><DialogTitle className="font-serif text-2xl text-navy">{editing?.id ? "Edit" : "Tambah"} {cfg.singular}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-4">
              {cfg.fields.map((f) => (
                <FieldInput key={f.name} field={f} value={editing[f.name]} onChange={(v) => setEditing({ ...editing, [f.name]: v })} testId={`crud-field-${f.name}`} />
              ))}
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} data-testid="crud-cancel-button">Batal</Button>
                <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90" data-testid="crud-save-button">{saving ? "Menyimpan..." : "Simpan"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent data-testid="crud-delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {cfg.singular}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan. Data akan langsung hilang dari website.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="crud-delete-cancel">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-red-600 hover:bg-red-700" data-testid="crud-delete-confirm">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
