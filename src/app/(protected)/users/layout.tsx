import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}
