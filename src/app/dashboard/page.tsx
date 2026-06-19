"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";

interface DashboardStats {
	totalAthletes: number;
	nextTargetRace: string;
	daysToRace: number;
	pendingLogisticsAlerts: number;
}

interface RaceSummary {
	id: string;
	name: string;
	date: string;
	athletesCount: number;
}

interface EventDashboardDetail {
	id: string;
	name: string;
	date: string;
	hotelName?: string;
	stats: {
		totalPresences: number;
		withLodging: number;
		withTransport: number;
	};
}

export default function DashboardPage() {
	const { stats, setStats } = useState<DashboardStats | null>(null);
	const [races, setRaces] = useState<RaceSummary[]>([]);
	const [loading, setLoading] = useState(true);

	const [selectedEvent, setSelectedEvent] =
		useState<EventDashboardDetail | null>(null);
	const [loadingDetail, setLoadingDetail] = useState(false);

	useEffect(() => {
		async function loadDashboardData() {
			try {
				setLoading(true);

				const [usersRes, eventsRes] = await Promise.all([
					api.get("/api/v1/users"),
					api.get("/api/v1/events"),
				]);

				const totalAtletas = usersRes.data.length || 0;
				const eventos = eventsRes.data || [];

				const hoje = new Date();
				const proximasProvas = eventos
					.filter((e: any) => new Date(e.date) >= hoje)
					.sort(
						(a: any, b: any) =>
							new Date(a.date).getTime() - new Date(b.date).getTime(),
					);

				const proximaProva = proximasProvas[0];
				let diasRestantes = 0;

				if (proximaProva) {
					const diferenca =
						new Date(proximaProva.date).getTime() - hoje.getTime();
					diasRestantes = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
				}

				setStats({
					totalAthletes: totalAtletas,
					nextTargetRace: proximaProva
						? proximaProva.name
						: "Nenhum evento agendado",
					daysToRace: diasRestantes,
					pendingLogisticsAlerts: 0,
				});

				setRaces(
					eventos.map((e: any) => ({
						id: e.id,
						name: e.name,
						date: e.date,
						athletesCount: e._count?.presences || e.presences?.length || 0,
					})),
				);
			} catch (err) {
				console.error("Erro ao carregar dados", err);
			} finally {
				setLoading(false);
			}
		}

		loadDashboardData();
	}, []);

	async function handleOpenEventDashboard(eventId: string) {
		try {
			setLoadingDetail(true);
			const response = await api.get(`/api/v1/events/${eventId}/dashboard`);
			setSelectedEvent(response.data);
		} catch (err) {
			console.error("Erro ao buscar detalhes do evento no backend:", err);
			alert("Não foi possível carregar os detalhes logísticos desta prova.");
		} finally {
			setLoadingDetail(false);
		}
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Menu Lateral Injetado aqui */}
			<Sidebar />

			{/* Conteúdo Principal Flexível */}
			<div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto flex flex-col gap-8 w-full">
				{/* Header Simplificado (O botão Sair foi para a Sidebar) */}
				<div className="flex justify-between items-center border-b border-slate-200 pb-6">
					<div>
						<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
							Dashboard
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Visão geral da sua assessoria e pendências.
						</p>
					</div>
				</div>

				{loading ? (
					<p className="text-center text-slate-400 animate-pulse-slow py-24 font-medium">
						Sincronizando dados...
					</p>
				) : (
					<>
						{/* Cards de Indicadores */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="dashboard-card border-l-4 border-l-slate-400">
								<span className="text-xs font-semibold text-slate-400 uppercase block">
									Atletas Ativos
								</span>
								<span className="text-4xl font-extrabold text-slate-900 mt-2 block">
									{stats?.totalAthletes}
								</span>
							</div>
							<div className="dashboard-card border-l-4 border-l-indigo-500">
								<span className="text-xs font-semibold text-slate-400 uppercase block">
									Próximo Alvo
								</span>
								<span className="text-lg font-bold text-slate-900 mt-2 block truncate">
									{stats?.nextTargetRace}
								</span>
								<span className="text-xs text-indigo-600 font-medium mt-1 block">
									{stats?.daysToRace && stats.daysToRace > 0
										? `Faltam ${stats.daysToRace} dias`
										: "Sem contagem"}
								</span>
							</div>
							<div className="dashboard-card border-l-4 border-l-amber-500">
								<span className="text-xs font-semibold text-slate-400 uppercase block">
									Alertas Pendentes
								</span>
								<span className="text-4xl font-extrabold text-amber-600 mt-2 block">
									{stats?.pendingLogisticsAlerts}
								</span>
							</div>
						</div>

						{/* Layout de Exibição */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Lista de Provas */}
							<div className="dashboard-card h-fit flex flex-col gap-5">
								<h2 className="text-lg font-bold text-slate-900">
									Provas da Assessoria
								</h2>
								<p className="text-xs text-slate-400 -mt-3">
									Clique em uma prova para inspecionar a logística real.
								</p>
								<div className="flex flex-col gap-3">
									{races.length === 0 ? (
										<p className="text-sm text-slate-400 text-center py-4">
											Nenhuma prova cadastrada.
										</p>
									) : (
										races.map((race) => (
											<button
												key={race.id}
												onClick={() => handleOpenEventDashboard(race.id)}
												className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 flex justify-between items-center text-left transition-all duration-200 hover:bg-slate-100 active:scale-[0.99] w-full group">
												<div>
													<h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition">
														{race.name}
													</h3>
													<p className="text-xs text-slate-400 mt-0.5">
														{new Date(race.date).toLocaleDateString("pt-BR")}
													</p>
												</div>
												<span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-indigo-100">
													{race.athletesCount} inscritos
												</span>
											</button>
										))
									)}
								</div>
							</div>

							{/* Painel Lateral / Detalhes */}
							<div className="lg:col-span-2 dashboard-card flex flex-col gap-6 justify-center">
								{loadingDetail ? (
									<p className="text-center text-slate-400 animate-pulse font-medium py-12">
										Buscando dados da logística no banco...
									</p>
								) : selectedEvent ? (
									<div className="animate-fadeIn flex flex-col gap-6">
										<div className="border-b border-slate-100 pb-4">
											<span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
												Resumo do Evento
											</span>
											<h2 className="text-2xl font-extrabold text-slate-900 mt-3">
												{selectedEvent.name}
											</h2>
											<p className="text-sm text-slate-400 mt-1">
												Data da Prova:{" "}
												{new Date(selectedEvent.date).toLocaleDateString(
													"pt-BR",
												)}
											</p>
											{selectedEvent.hotelName && (
												<p className="text-sm text-slate-600 mt-2">
													🏨 Hotel Oficial:{" "}
													<span className="font-semibold">
														{selectedEvent.hotelName}
													</span>
												</p>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
												<span className="text-xs font-semibold text-slate-400 block uppercase">
													Confirmados
												</span>
												<span className="text-3xl font-extrabold text-slate-800 mt-1 block">
													{selectedEvent.stats?.totalPresences || 0}
												</span>
											</div>
											<div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl text-center">
												<span className="text-xs font-semibold text-amber-700 block uppercase">
													No Hotel Oficial
												</span>
												<span className="text-3xl font-extrabold text-amber-800 mt-1 block">
													{selectedEvent.stats?.withLodging || 0}
												</span>
											</div>
											<div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl text-center">
												<span className="text-xs font-semibold text-blue-700 block uppercase">
													Precisam de Transporte
												</span>
												<span className="text-3xl font-extrabold text-blue-800 mt-1 block">
													{selectedEvent.stats?.withTransport || 0}
												</span>
											</div>
										</div>
									</div>
								) : (
									<div className="text-center py-16">
										<p className="text-base font-medium text-slate-400">
											Nenhuma prova selecionada.
										</p>
										<p className="text-xs text-slate-400 mt-1">
											Selecione uma prova ativa ao lado para checar a contagem
											de hospedagem e translado.
										</p>
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
