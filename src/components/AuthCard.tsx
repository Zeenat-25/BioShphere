import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <span className="h-7 w-7 rounded-md bg-accent flex items-center justify-center text-panel text-xs font-semibold">
            B
          </span>
          <span className="serif text-lg">BioSphere AI</span>
        </Link>

        <div className="card p-7">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-xs text-muted">{footer}</div>}
      </div>
    </main>
  );
}

export function AuthField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block mb-4 last:mb-0">
      <span className="block text-xs font-medium text-foreground mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-panel px-3 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none focus:border-accent/60 transition"
      />
    </label>
  );
}
