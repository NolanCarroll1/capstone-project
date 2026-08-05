"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MOBILE_BASE_WIDTH = 393;
const MOBILE_BASE_HEIGHT = 909;
const DESKTOP_BASE_WIDTH = 1253;
const DESKTOP_BASE_HEIGHT = 866;
const EDGE_PADDING = 16;
const TABLET_BREAKPOINT = 768;

function useViewport() {
	const [viewport, setViewport] = useState({ width: MOBILE_BASE_WIDTH, height: MOBILE_BASE_HEIGHT });

	useEffect(() => {
		const updateViewport = () => {
			setViewport({ width: window.innerWidth, height: window.innerHeight });
		};

		updateViewport();
		window.addEventListener("resize", updateViewport);
		window.addEventListener("orientationchange", updateViewport);

		return () => {
			window.removeEventListener("resize", updateViewport);
			window.removeEventListener("orientationchange", updateViewport);
		};
	}, []);

	return viewport;
}

export default function WelcomePage() {
	const viewport = useViewport();
	const isTabletOrDesktop = viewport.width >= TABLET_BREAKPOINT;
	const baseWidth = isTabletOrDesktop ? DESKTOP_BASE_WIDTH : MOBILE_BASE_WIDTH;
	const baseHeight = isTabletOrDesktop ? DESKTOP_BASE_HEIGHT : MOBILE_BASE_HEIGHT;
	const widthScale = (viewport.width - EDGE_PADDING * 2) / baseWidth;
	const heightScale = (viewport.height - EDGE_PADDING * 2) / baseHeight;
	const scale = isTabletOrDesktop ? Math.min(widthScale, heightScale) : Math.max(widthScale, heightScale);

	return (
			<main className="fixed inset-0 overflow-hidden bg-black text-white">
				<div className="relative min-h-full w-full overflow-hidden" style={{ padding: isTabletOrDesktop ? EDGE_PADDING : 0 }}>
					<div
						className={isTabletOrDesktop ? "absolute left-1/2 top-1/2 origin-center" : "absolute left-1/2 top-0 origin-top"}
						style={{
							width: `${baseWidth}px`,
							height: `${baseHeight}px`,
							transform: isTabletOrDesktop ? `translate(-50%, -50%) scale(${scale})` : "translateX(-50%)",
						}}
					>
						{isTabletOrDesktop ? (
							<section className="relative overflow-hidden bg-black" style={{ height: DESKTOP_BASE_HEIGHT, width: DESKTOP_BASE_WIDTH }}>
								<img
									src="/assets/welcome-desktop-node-638-357.png"
									alt="Impactful welcome screen"
									className="pointer-events-none absolute inset-0 h-full w-full select-none"
									draggable={false}
								/>

								<Link
									href="/login"
									aria-label="Start here"
									className="absolute"
									style={{ left: 510, top: 587, width: 246, height: 56 }}
								>
									<span className="sr-only">[ STARTS HERE ]</span>
								</Link>
							</section>
						) : (
							<section className="relative overflow-hidden bg-black" style={{ height: MOBILE_BASE_HEIGHT, width: MOBILE_BASE_WIDTH }}>
					<div className="absolute inset-0 bg-black" />

					<img
						src="/assets/Top%20left%20corner%20dots.svg"
						alt=""
						className="pointer-events-none absolute select-none"
							style={{ left: 0, top: 10, height: 132, width: 55 }}
						draggable={false}
					/>
					<img
						src="/assets/Top%20right%20corner%20dots.svg"
						alt=""
						className="pointer-events-none absolute select-none"
						style={{ left: 261, top: 11, height: 55, width: 132 }}
						draggable={false}
					/>
					<img
						src="/assets/Bottom%20right%20corner%20dots.svg"
						alt=""
						className="pointer-events-none absolute select-none"
						style={{ left: 326, top: 748, height: 146, width: 48 }}
						draggable={false}
					/>

					<img
						src="/assets/Green%20branches.svg"
						alt=""
						className="pointer-events-none absolute select-none"
						style={{ left: 0, top: 101, height: 707, width: 393 }}
						draggable={false}
					/>

					<div
						className="pointer-events-none absolute bg-[rgba(0,0,0,0.95)]"
						style={{ left: 52, top: 251, height: 370, width: 288, borderRadius: 15 }}
					/>

					<div className="absolute z-10 text-center" style={{ left: 69, top: 411, width: 254 }}>
						<h1 className="whitespace-nowrap font-sans text-[48px] font-semibold leading-none tracking-normal text-white">
							IMPACTFUL
						</h1>
					</div>

						<div className="absolute left-1/2 z-10 -translate-x-1/2 text-center" style={{ top: 485, width: 121 }}>
							<p
								className="whitespace-nowrap font-mono text-[24px] font-normal italic tracking-normal text-[#4ea6c5]"
								style={{
									lineHeight: "normal",
									fontFamily: "var(--font-space-mono), ui-monospace, monospace",
								}}
							>
							Impact
						</p>
					</div>

					<div className="absolute z-10" style={{ left: 71, top: 533, width: 246, height: 56 }}>
						<Link
							href="/login"
								className="absolute left-0 top-0 flex h-[56px] w-[247px] items-center justify-center bg-[#ff8d00] font-mono text-[20px] font-bold tracking-[1.6px] text-white transition-colors hover:bg-[#ff9d1a]"
						>
							[ STARTS HERE ]
						</Link>
					</div>

					<div className="absolute z-10 h-[141px] w-[131px]" style={{ left: 129, top: 266 }}>
						<div className="pointer-events-none absolute inset-0 overflow-hidden">
							<img
								src="/assets/welcome-logo-node-686-16004-latest.png"
								alt=""
								className="pointer-events-none absolute max-w-none select-none"
								style={{ height: "441.38%", width: "711.11%", left: "-19.91%", top: "-100%" }}
								draggable={false}
							/>
						</div>
					</div>
						</section>
						)}
					</div>
				</div>
			</main>
	);
}