"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/src/services/api";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(authAPI.getCurrentUser());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  return { user, loading };
};
