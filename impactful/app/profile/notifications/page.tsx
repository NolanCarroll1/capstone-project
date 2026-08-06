"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { MobileBottomNav } from "../../_components/MobileBottomNav";
import { RequireSession } from "../../_components/RequireSession";
import { FullTopMenu } from "../../modules/_components/FullTopMenu";

type NotificationSetting = {
	id: "new-modules" | "play-reminders" | "product-updates";
	title: string;
	description: string;
	defaultEnabled: boolean;
};

const notificationSettings: NotificationSetting[] = [
	{
		id: "new-modules",
		title: "New Modules",
		description: "When a new training module goes live",
		defaultEnabled: true,
	},
	{
		id: "play-reminders",
		title: "Play Reminders",
		description: "Nudges to keep your learning streak",
		defaultEnabled: false,
	},
	{
		id: "product-updates",
		title: "Product Updates",
		description: "News and announcements from the team",
		defaultEnabled: false,
	},
];

type TogglePillProps = {
	enabled: boolean;
	onChange: (nextEnabled: boolean) => void;
	label: string;
};

function TogglePill({ enabled, onChange, label }: TogglePillProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			aria-label={label}
			onClick={() => onChange(!enabled)}
			className={`inline-flex h-6 w-12 items-center rounded-full p-1 transition-colors ${enabled ? "justify-end bg-[#ff8d00]" : "justify-start bg-[#e5e7eb]"}`}
		>
			<span className="h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]" />
		</button>
	);
}

export default function NotificationsPage() {
	const [settings, setSettings] = useState(() =>
		notificationSettings.reduce<Record<NotificationSetting["id"], boolean>>((accumulator, setting) => {
			accumulator[setting.id] = setting.defaultEnabled;
			return accumulator;
		}, {
			"new-modules": true,
			"play-reminders": false,
			"product-updates": false,
		}),
	);

	return (
		<RequireSession>
			<main className="min-h-dvh bg-[#f8f8f8] pb-[calc(96px+env(safe-area-inset-bottom))] text-black sm:flex sm:justify-center">
				<section className="mx-auto min-h-dvh w-full max-w-screen-sm bg-[#f8f8f8]">
					<header className="sticky top-0 z-30 border-b border-[#f3f4f6] bg-[#eef1f4] px-6 py-4">
						<div className="flex items-center justify-between">
							<Image
								src="/assets/figma-capstone/dashboard-impactful-wordmark-node-1115-748.png"
								alt="Impactful"
								width={100}
								height={48}
								unoptimized
								className="h-12 w-[100px] object-contain"
							/>
							<FullTopMenu />
						</div>
					</header>

					<div className="px-6 py-6">
						<div className="flex items-center gap-3">
							<Link
								href="/profile"
								aria-label="Back to profile"
								className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6a7282] transition-colors hover:bg-white"
							>
								<ArrowLeft className="h-4.5 w-4.5" />
							</Link>
							<h1 className="font-sans text-[17px] font-bold leading-[1.5] text-black">Notifications</h1>
						</div>
						<p className="pt-4 font-mono text-xs font-bold tracking-[0.1em] text-[#99a1af]">PREFERENCES</p>

						<div className="space-y-3 pt-2">
							{notificationSettings.map((setting) => {
								const isEnabled = settings[setting.id];
								return (
									<div
										key={setting.id}
										className="flex items-center justify-between rounded-[20px] border-[1.804px] border-[#f1f3f6] bg-white px-[22px] py-[18px] shadow-[0px_4px_0px_#eff1f5]"
									>
										<div className="pr-4">
											<p className="font-sans text-[15px] font-bold leading-[1.5] text-black">{setting.title}</p>
											<p className="pt-0.5 font-sans text-[13px] leading-[1.375] text-[#99a1af]">{setting.description}</p>
										</div>
										<TogglePill
											enabled={isEnabled}
											onChange={(nextEnabled) => {
												setSettings((current) => ({
													...current,
													[setting.id]: nextEnabled,
												}));
											}}
											label={`Toggle ${setting.title}`}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				<MobileBottomNav />
			</main>
		</RequireSession>
	);
}
