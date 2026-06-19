"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function Sidebar() {
	const { signOut } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	const menuItems = [
		{ name: "Visão Geral", path: "/dashboard" },
		{ name: "Cadastrar Assessoria", path: "/dashboard/tenants/new" },
	];

	return (
		<aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6 flex flex-col justify-between hidden md:flex shrink-0">
			<div className="flex flex-col gap-8">
				{/* Logo da Marca */}
				<div className="flex items-center gap-2">
					<span className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse-slow"></span>
					<h2 className="text-xl font-black text-slate-900 tracking-tight">
						Prova Planner
					</h2>
				</div>

				{/* Itens de Navegação */}
				<nav className="flex flex-col gap-1.5">
					{menuItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<button
								key={item.path}
								onClick={() => router.push(item.path)}
								className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
									isActive
										? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50"
										: "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
								}`}>
								{item.name}
							</button>
						);
					})}
				</nav>
			</div>

			{/* Rodapé do Menu */}
			<button onClick={signOut} className="btn-secondary w-full">
				Sair do Sistema
			</button>
		</aside>
	);
}
