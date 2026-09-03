import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { wedding } from "@/lib/wedding-data";

export const metadata = {
  title: `Admin Login · ${wedding.bride.shortName} & ${wedding.groom.shortName}`,
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  await connection();

  if (!isAdminConfigured()) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div
          className="max-w-md text-center rounded-2xl p-8"
          style={{
            background: "var(--cream-soft)",
            border: "1px solid var(--hairline)",
          }}
        >
          <h1 className="text-2xl font-serif mb-3" style={{ color: "var(--ink)" }}>
            Admin not configured
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Set <code className="px-1 rounded bg-black/5">ADMIN_PASSWORD</code> in your
            <code className="px-1 rounded bg-black/5">.env</code> and restart the server.
          </p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  if (isAdminRequest({ cookies: cookieStore })) {
    redirect("/admin");
  }

  const { error, next } = await searchParams;
  return <LoginForm initialError={error} nextPath={next} />;
}
