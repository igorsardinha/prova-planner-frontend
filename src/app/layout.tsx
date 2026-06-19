import "./globals.css"; // 🚨 ESSA LINHA ADICIONADA CONECTA O TAIWIND AO SISTEMA
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
