import { redirect } from "next/navigation";

export default function RootIndex() {
  // The proxy normally redirects "/" to a localised URL before this
  // page renders. This fallback covers edge cases (proxy disabled,
  // direct hit during a build, etc.).
  redirect("/ms");
}
