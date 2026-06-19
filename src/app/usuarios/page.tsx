"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface Meta {
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

export default function UsersPage() {
	const { signOut } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [meta, setMeta] = useState<Meta | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadAthletes() {
			try {
				// Busca os dados da sua rota paginada do backend
				const response = await api.get("/api/v1/users?page=1&limit=10");

				// Armazena o retorno tratado do seu backend
				setUsers(response.data.data);
				setMeta(response.data.meta);
			} catch (err: any) {
				console.error("Erro ao buscar usuários", err);
				setError(
					err.response?.data?.error || "Erro ao carregar a lista de atletas.",
				);
			} finally {
				setLoading(false);
			}
		}

		loadAthletes();
	}, []);

	return (
		<main className="p-12 max-w-5xl mx-auto flex flex-col gap-6">
			{/* Cabeçalho do Painel */}
			<div className="flex justify-between items-center border-b pb-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Painel de Atletas
					</h1>
					<p className="text-sm text-gray-500">
						Listagem de alunos vinculados à sua assessoria
					</p>
				</div>
				<button
					onClick={signOut}
					className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition text-sm shadow-sm">
					Sair do Sistema
				</button>
			</div>

			{/* Estado de Carregamento */}
			{loading && (
				<p className="text-gray-500 animate-pulse text-center py-12">
					Carregando atletas da assessoria...
				</p>
			)}

			{/* Estado de Erro */}
			{error && (
				<div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-center">
					{error}
				</div>
			)}

			{/* Lista de Atletas vinda do Banco */}
			{!loading && !error && users.length > 0 && (
				<div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 flex flex-col gap-4">
					<ul className="divide-y divide-gray-100">
						{users.map((user) => (
							<li
								key={user.id}
								className="py-4 flex justify-between items-center">
								<div>
									<p className="font-semibold text-gray-800">{user.name}</p>
									<p className="text-sm text-gray-500">{user.email}</p>
								</div>
								<span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">
									{user.role}
								</span>
							</li>
						))}
					</ul>

					{/* Paginação vinda dos metadados do backend */}
					{meta && (
						<div className="text-xs text-gray-400 pt-4 border-t text-right font-mono">
							Total: {meta.totalItems} atletas | Página {meta.currentPage} de{" "}
							{meta.totalPages}
						</div>
					)}
				</div>
			)}

			{/* Caso a assessoria não tenha atletas ainda */}
			{!loading && !error && users.length === 0 && (
				<p className="text-gray-400 text-center py-12">
					Nenhum atleta cadastrado nesta assessoria.
				</p>
			)}
		</main>
	);
}
