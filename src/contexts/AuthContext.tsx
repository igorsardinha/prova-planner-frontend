"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
	token: string | null;
	tenantSlug: string | null;
	isAuthenticated: boolean;
	// ADICIONADO: Agora o formulário passa o password também
	signIn: (credentials: {
		email: string;
		password: string;
		tenantSlug: string;
	}) => Promise<void>;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [tenantSlug, setTenantSlug] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedToken = localStorage.getItem("@ProvaPlanner:token");
		const storedTenant = localStorage.getItem("@ProvaPlanner:tenant");

		if (storedToken && storedTenant) {
			setToken(storedToken);
			setTenantSlug(storedTenant);
		}
	}, []);

	async function signIn({
		email,
		password, // Recebe a senha vinda do formulário
		tenantSlug,
	}: {
		email: string;
		password: string;
		tenantSlug: string;
	}) {
		try {
			// 1. Envia a requisição para a rota real de login do seu authController
			// Passa email e password no corpo, e o slug no cabeçalho para o seu tenantExtractor
			// 1. Envia para a URL correta do backend passing email e password
			const response = await api.post(
				"/api/v1/auth/login",
				{ email, password },
				{ headers: { "x-tenant-slug": tenantSlug } }, // O tenantExtractor do seu backend vai ler daqui!
			);

			// 2. Extrai o token JWT retornado pelo seu authController
			const { token: backendToken } = response.data;

			if (!backendToken) {
				throw new Error("O backend não retornou um token válido.");
			}

			// 3. Salva no navegador
			localStorage.setItem("@ProvaPlanner:token", backendToken);
			localStorage.setItem("@ProvaPlanner:tenant", tenantSlug);

			// 4. Atualiza o estado global
			setToken(backendToken);
			setTenantSlug(tenantSlug);

			// 5. Redireciona para a listagem
			router.push("/dashboard");
		} catch (error: any) {
			console.error("Erro no login:", error);
			throw new Error(
				error.response?.data?.error ||
					"Falha na autenticação. Verifique os dados.",
			);
		}
	}

	function signOut() {
		localStorage.removeItem("@ProvaPlanner:token");
		localStorage.removeItem("@ProvaPlanner:tenant");
		setToken(null);
		setTenantSlug(null);
		router.push("/login");
	}

	return (
		<AuthContext.Provider
			value={{ token, tenantSlug, isAuthenticated: !!token, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth deve ser usado com um AuthProvider");
	return context;
}
