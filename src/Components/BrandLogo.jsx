import { Link } from "react-router-dom";

import logoSrc from "@/assets/images/logo.png";
import logoFullSrc from "@/assets/images/logo_f.png";
import { cn } from "@/lib/utils";

const VARIANT_CLASS = {
  /** Login / register hero — full lockup */
  auth: "h-28 w-auto max-w-[220px] sm:h-32",
  /** App header — compact mark */
  header: "h-9 w-auto max-h-9",
  /** Sidebar brand — compact mark */
  sidebar: "h-8 w-auto max-h-8",
  /** Compact square in tight spaces */
  mark: "h-8 w-8 rounded-md object-cover",
};

const VARIANT_SRC = {
  auth: logoFullSrc,
  header: logoSrc,
  sidebar: logoSrc,
  mark: logoSrc,
};

/**
 * Official Trell brand mark — use instead of text / third-party SVGs.
 * `logo_f` for large auth surfaces; `logo` for header / sidebar chrome.
 */
function BrandLogo({
  variant = "header",
  className,
  asLink = false,
  to = "/",
  alt = "Trell — Kanban Application",
}) {
  const image = (
    <img
      src={VARIANT_SRC[variant] ?? logoSrc}
      alt={alt}
      className={cn("block object-contain", VARIANT_CLASS[variant], className)}
      draggable={false}
    />
  );

  if (!asLink) return image;

  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      aria-label="Về trang chủ Trell"
    >
      {image}
    </Link>
  );
}

export default BrandLogo;
