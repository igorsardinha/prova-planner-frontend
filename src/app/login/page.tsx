"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [tenantSlug, setTenantSlug] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (!email || !password || !tenantSlug) {
			setError("Preencha todos os campos obrigatórios.");
			setLoading(false);
			return;
		}

		try {
			// Passando as 3 credenciais reais que o backend precisa
			await signIn({ email, password, tenantSlug });
		} catch (err: any) {
			setError(
				err.message || "Credenciais inválidas ou assessoria não encontrada.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border flex flex-col gap-4">
				<h1 className="text-2xl font-bold text-center text-indigo-600">
					Acessar Prova Planner
				</h1>

				{error && (
					<p className="text-sm text-red-600 bg-red-50 p-2 rounded text-center font-medium">
						{error}
					</p>
				)}

				{/* Campo Slug */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">
						Slug da Assessoria
					</label>
					<input
						type="text"
						placeholder="Ex: vanguarda-pro"
						value={tenantSlug}
						onChange={(e) => setTenantSlug(e.target.value)}
						className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
					/>
				</div>

				{/* Campo Email */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">E-mail</label>
					<input
						type="email"
						placeholder="seuemail@exemplo.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
					/>
				</div>

				{/* Campo Senha */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">Senha</label>
					<input
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="mt-2 p-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition disabled:bg-gray-400 shadow-sm">
					{loading ? "Autenticando..." : "Entrar no Painel"}
				</button>
			</form>
		</main>
	);
}
