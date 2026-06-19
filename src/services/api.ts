import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para injetar os cabeçalhos dinamicamente a cada requisição
api.interceptors.request.use(
	(config) => {
		// Pegando direto do localStorage NO MOMENTO do disparo da rota
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("@ProvaPlanner:token");
			const tenantSlug = localStorage.getItem("@ProvaPlanner:tenant");

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			if (tenantSlug) {
				config.headers["x-tenant-slug"] = tenantSlug;
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
