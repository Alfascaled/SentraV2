import { useEffect, useState } from "react";
import { Trash2, MessageCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, formatApiError, waLink } from "@/lib/api";

export default function RegistrationsPage() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/registrations").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (r, status) => {
    try { await api.patch(`/registrations/${r.id}`, { status }); load(); } catch (e) { toast.error(formatApiError(e)); }
  };
  const remove = async (r) => {
    if (!window.confirm(`Hapus pendaftaran ${r.name}?`)) return;
    try { await api.delete(`/registrations/${r.id}`); toast.success("Dihapus"); load(); } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div data-testid="registrations-page">
      <p className="eyebrow text-brand-orange">Leads</p>
      <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Pendaftaran</h1>
      <p className="mt-2 text-sm text-slate-500">{items.length} pendaftar · {items.filter((i) => i.status === "baru").length} belum dihubungi</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <Table data-testid="registrations-table">
          <TableHeader>
            <TableRow className="bg-slate-50">
              {["Tanggal", "Nama", "WhatsApp", "Jenjang / Program", "Paket", "Pesan", "Status", "Aksi"].map((h) => <TableHead key={h} className="text-xs font-bold uppercase tracking-wider text-slate-500">{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500">Belum ada pendaftaran.</TableCell></TableRow>}
            {items.map((r, i) => (
              <TableRow key={r.id} data-testid={`registration-row-${i}`}>
                <TableCell className="whitespace-nowrap text-xs text-slate-500">{new Date(r.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
                <TableCell className="font-semibold text-navy">{r.name}</TableCell>
                <TableCell><a href={waLink(r.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-[#128C7E] hover:underline"><MessageCircle size={14} /> {r.phone}</a></TableCell>
                <TableCell className="text-sm">{r.level || "-"} / {r.program || "-"}</TableCell>
                <TableCell className="text-sm">{r.package || "-"}</TableCell>
                <TableCell className="max-w-[16rem] truncate text-sm text-slate-600" title={r.message}>{r.message || "-"}</TableCell>
                <TableCell><span className={`rounded-full px-3 py-1 text-xs font-bold ${r.status === "baru" ? "bg-brand-yellow text-navy" : "bg-slate-100 text-slate-600"}`} data-testid={`registration-status-${i}`}>{r.status}</span></TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {r.status === "baru"
                    ? <Button variant="ghost" size="icon" title="Tandai sudah dihubungi" onClick={() => setStatus(r, "dihubungi")} data-testid={`registration-mark-${i}`}><CheckCircle2 size={16} className="text-green-600" /></Button>
                    : <Button variant="ghost" size="icon" title="Kembalikan ke baru" onClick={() => setStatus(r, "baru")} data-testid={`registration-reset-${i}`}><RotateCcw size={16} /></Button>}
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => remove(r)} data-testid={`registration-delete-${i}`}><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
