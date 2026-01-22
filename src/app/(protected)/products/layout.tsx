import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}
