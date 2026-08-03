import { RequireSession } from "../_components/RequireSession";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
	return <RequireSession>{children}</RequireSession>;
}