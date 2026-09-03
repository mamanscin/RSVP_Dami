import "../globals.css";
import { wedding } from "@/lib/wedding-data";

// Admin section — single-locale dashboard, separate root layout so it does
// not inherit the i18n layout used by the public invitation.
export const metadata = {
  title: `Admin · ${wedding.bride.shortName} & ${wedding.groom.shortName}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
