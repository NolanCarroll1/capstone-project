import { redirect } from "next/navigation";

export default function ModulesPage() {
	const dashboardHref = "/dashboard";
	redirect(dashboardHref);
}