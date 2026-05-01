import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — QRLinkSpot" }, { name: "description", content: "Sign in to your QRLinkSpot account." }] }),
});

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
          <QrCode className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to manage your QR and links.</p>

        <form onSubmit={submit} className="mt-8 w-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" variant="brand" size="lg" className="w-full">Sign in</Button>
          <p className="text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
