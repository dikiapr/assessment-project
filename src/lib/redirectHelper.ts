export const getDefaultRoute = (role: string): string => {
  return role === "ADMIN" ? "/products" : "/transactions";
};
