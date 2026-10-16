import { PortalShell } from "./_components/PortalShell";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
