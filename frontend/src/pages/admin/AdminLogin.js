import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

const LOGO = "https://customer-assets-jai6qajn.emergentagent.net/job_2483318e-813e-451f-b1bd-de222c11db79/artifacts/pamxksi8_logo%20sentra%20hitam.png";
const inputCls = "w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] duration-300 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/40";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise grid min-h-screen place-items-center bg-navy-deep px-5" data-testid="admin-login-page">
      <div className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-orange/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-sky/20 blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <img src={LOGO} alt="Sentra Cendekia" className="mx-auto -my-8 h-40 w-auto" />
        <p className="eyebrow mt-6 text-brand-orange">Panel Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-white">Masuk ke Dashboard</h1>
        <form onSubmit={submit} className="mt-8 space-y-4" data-testid="admin-login-form">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email admin" className={inputCls} data-testid="admin-email-input" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputCls} data-testid="admin-password-input" />
          </div>
          {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" data-testid="admin-login-error">{error}</p>}
          <button disabled={loading} className="btn-orange w-full justify-center disabled:opacity-60" data-testid="admin-login-submit">
            {loading ? "Memproses..." : <><LogIn size={16} /> Masuk</>}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs text-slate-400 hover:text-white" data-testid="admin-back-home">← Kembali ke website</a>
      </motion.div>
    </div>
  );
}
