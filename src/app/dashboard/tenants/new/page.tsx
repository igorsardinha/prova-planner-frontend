"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { Sidebar } from "@/components/Sidebar";

export default function NewTenantPage() {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Função para gerar o slug automaticamente enquanto o admin digita o nome
	function handleNameChange(text: string) {
		setName(text);
		const generatedSlug = text
			.toLowerCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") // Remove acentos
			.replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
			.replace(/[\s_]+/g, "-") // Substitui espaços por hifens
			.replace(/-+/g, "-"); // Evita hifens duplicados
		setSlug(generatedSlug);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMessage(null);
		setLoading(true);

		if (!name || !slug) {
			setMessage({ type: "error", text: "Todos os campos são obrigatórios." });
			setLoading(false);
			return;
		}

		try {
			// Bate exatamente na sua rota pública global do backend
			await api.post("/api/v1/tenants", { name, slug });

			setMessage({
				type: "success",
				text: `Assessoria "${name}" cadastrada com sucesso!`,
			});
			setName("");
			setSlug("");
		} catch (error: any) {
			console.error("Erro ao cadastrar assessoria:", error);
			setMessage({
				type: "error",
				text:
					error.response?.data?.error ||
					"Falha ao cadastrar assessoria. Verifique se o slug já existe.",
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			<Sidebar />

			<div className="flex-1 p-6 md:p-12 max-w-2xl mx-auto flex flex-col gap-8 w-full">
				<div className="border-b border-slate-200 pb-6">
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
						Nova Assessoria
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Cadastre um novo parceiro comercial no ecossistema do Prova Planner.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="dashboard-card flex flex-col gap-5">
					{message && (
						<div
							className={`p-3 rounded-xl text-sm font-medium text-center border ${
								message.type === "success"
									? "bg-emerald-50 text-emerald-800 border-emerald-200"
									: "bg-rose-50 text-rose-800 border-rose-200"
							}`}>
							{message.text}
						</div>
					)}

					{/* Campo Nome */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Nome da Assessoria
						</label>
						<input
							type="text"
							placeholder="Ex: Vanguarda Assessoria Esportiva"
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							className="p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium text-sm bg-slate-50/50"
						/>
					</div>

					{/* Campo Slug (Auto-gerado) */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Identificador Único (Slug da URL)
						</label>
						<input
							type="text"
							placeholder="Ex: vanguarda-assessoria"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							className="p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium text-sm bg-slate-100 cursor-not-allowed"
							disabled
						/>
						<p className="text-xs text-slate-400">
							Este identificador será usado pelos alunos no cabeçalho de login.
						</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn-primary mt-2 py-3">
						{loading ? "Processando Registro..." : "Confirmar Cadastro"}
					</button>
				</form>
			</div>
		</div>
	);
}
