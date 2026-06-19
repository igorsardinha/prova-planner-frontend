"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
	const router = useRouter();

	useEffect(() => {
		// Redireciona o usuário direto para a tela de login ao acessar a raiz
		router.push("/login");
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
			<p className="animate-pulse">Carregando Prova Planner...</p>
		</div>
	);
}
