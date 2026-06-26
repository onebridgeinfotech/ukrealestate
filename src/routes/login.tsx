import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Chrome, Shield, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/database.types";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — MarketUK" }] }),
  component: LoginPage,
});

type Tab = "signin" | "register";

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: "buyer", label: "Buyer", desc: "Search & save properties" },
  { value: "seller", label: "Seller", desc: "List your property" },
  { value: "agent", label: "Agent", desc: "Manage client listings" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sign-in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("buyer");
  const [regRics, setRegRics] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    // Redirect based on role after sign-in
    const { data: { user } } = await (await import("@/lib/supabase")).supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? "buyer";
    if (role === "agent") navigate({ to: "/dashboard/agent" });
    else if (role === "seller") navigate({ to: "/dashboard/seller" });
    else navigate({ to: "/dashboard/buyer" });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreeTerms) { setError("You must agree to the Terms & Conditions."); return; }
    if (regPass.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { error } = await signUp(regEmail, regPass, {
      firstName: regFirst,
      lastName: regLast,
      role: regRole,
      ricsNumber: regRole === "agent" ? regRics : undefined,
    });
    setLoading(false);
    if (error) { setError(error); return; }
    setSuccess("Account created! Check your email to confirm, then sign in.");
    setTab("signin");
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient shadow-gold">
              <span className="font-display text-lg font-extrabold text-white">M</span>
            </div>
            <span className="font-display text-xl font-extrabold text-primary">Market<span className="text-gold">UK</span></span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">
            {forgotMode ? "Reset your password" : tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {forgotMode ? "Enter your email and we'll send a reset link." : tab === "signin" ? "Sign in to your MarketUK account" : "Join 38,000+ buyers and sellers"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{success}</div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
          )}

          {forgotMode ? (
            <form onSubmit={(e) => { e.preventDefault(); setSuccess("If that email exists, a reset link is on its way."); setForgotMode(false); }}>
              <div className="space-y-4">
                <div><Label>Email address</Label><Input className="mt-1" type="email" placeholder="you@example.com" required /></div>
                <Button type="submit" className="w-full bg-primary text-white">Send Reset Link</Button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-2">Back to sign in</button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1">
                {(["signin", "register"] as Tab[]).map((t) => (
                  <button key={t} type="button" onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                    className={`rounded-md py-2 text-sm font-medium transition-all ${tab === t ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    {t === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="mb-4 w-full gap-2"
                onClick={async () => {
                  setError(null);
                  const { error } = await signInWithGoogle();
                  if (error) setError(error);
                }}
              >
                <Chrome className="h-4 w-4" />Continue with Google
              </Button>
              <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex-1 border-t border-border" />or continue with email<div className="flex-1 border-t border-border" />
              </div>

              {tab === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div><Label>Email address</Label><Input className="mt-1" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Password</Label>
                      <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-gold hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative mt-1">
                      <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-white shadow-gold">
                    {loading ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label className="mb-2 block">I am a…</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map((r) => (
                        <button key={r.value} type="button" onClick={() => setRegRole(r.value)}
                          className={`rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${regRole === r.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                          <div className="font-semibold">{r.label}</div>
                          <div className="mt-0.5 text-[10px] opacity-70">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>First name</Label><Input className="mt-1" placeholder="Jane" value={regFirst} onChange={(e) => setRegFirst(e.target.value)} required /></div>
                    <div><Label>Last name</Label><Input className="mt-1" placeholder="Smith" value={regLast} onChange={(e) => setRegLast(e.target.value)} required /></div>
                  </div>
                  <div><Label>Email</Label><Input className="mt-1" type="email" placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required /></div>
                  <div><Label>Phone <span className="text-xs text-muted-foreground">(optional)</span></Label><Input className="mt-1" type="tel" placeholder="07700 900000" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} /></div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative mt-1">
                      <Input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {regRole === "agent" && (
                    <div><Label>RICS Number <span className="text-xs text-muted-foreground">(optional)</span></Label><Input className="mt-1" placeholder="e.g. 1234567" value={regRics} onChange={(e) => setRegRics(e.target.value)} /></div>
                  )}
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border" />
                    <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                      I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-white shadow-gold">
                    {loading ? "Creating account…" : "Create Account"}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />SSL Secured</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />38,000+ Members</span>
          <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" />RICS Affiliated</span>
        </div>
      </div>
    </div>
  );
}
