import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/schemas/auth";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
      toast.success(`Bem-vindo, ${user.name}!`);
      router.push(user.role === "admin" ? "/admin" : "/customer");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error);
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterInput) => authApi.register(userData),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
      toast.success("Conta criada com sucesso!");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error);
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Até logo!");
      router.push("/sign-in");
    },
    onError: () => {
      queryClient.clear();
      router.push("/sign-in");
    },
  });
}

export function useAuth() {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isGuest: !user && !isLoading,
  };
}
