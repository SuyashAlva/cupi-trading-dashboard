import { useMutation } from "@tanstack/react-query";
import { login } from "../services/marketApi";
import { useAuth } from "../store/authStore";

/** Email login mutation that writes the session into the auth store. */
export function useLogin() {
  const setSession = useAuth((s) => s.setSession);
  return useMutation({
    mutationFn: (email: string) => login(email),
    onSuccess: ({ token, user }) => setSession(token, user.email),
  });
}
