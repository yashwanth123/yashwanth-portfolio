import Link from "next/link";

type GhostButtonProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export function GhostButton({
  href,
  children,
  external = false,
  variant = "primary",
}: GhostButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full border px-7 py-3 text-xs tracking-[0.16em] uppercase transition-all duration-300 ${
    variant === "primary"
      ? "border-white/80 text-white hover:bg-white hover:text-[#030712]"
      : "border-white/30 text-white/60 hover:border-white/60 hover:text-white"
  }`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
