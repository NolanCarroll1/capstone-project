"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BASE_WIDTH = 393;
const BASE_HEIGHT = 909;
const EDGE_PADDING = 16;

function useViewportScale() {
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const updateScale = () => {
			const widthScale = (window.innerWidth - EDGE_PADDING * 2) / BASE_WIDTH;
			const heightScale = (window.innerHeight - EDGE_PADDING * 2) / BASE_HEIGHT;
			setScale(Math.min(widthScale, heightScale));
		};

		updateScale();
		window.addEventListener("resize", updateScale);
		window.addEventListener("orientationchange", updateScale);

		return () => {
			window.removeEventListener("resize", updateScale);
			window.removeEventListener("orientationchange", updateScale);
		};
	}, []);

	return scale;
}

export default function WelcomePage() {
	const scale = useViewportScale();

	return (
			<main className="fixed inset-0 overflow-hidden bg-black text-white">
				<div className="relative h-full w-full overflow-hidden" style={{ padding: EDGE_PADDING }}>
					<div
						className="absolute left-1/2 top-1/2 origin-center"
						style={{
							width: `${BASE_WIDTH}px`,
							height: `${BASE_HEIGHT}px`,
							transform: `translate(-50%, -50%) scale(${scale})`,
						}}
					>
						<section className="relative overflow-hidden bg-black" style={{ height: BASE_HEIGHT, width: BASE_WIDTH }}>
					<div className="absolute inset-0 bg-black" />

					<img
						src="/assets/Top%20left%20corner%20dots.svg"
						alt=""
						className="pointer-events-none absolute select-none"
						style={{ left: 0, top: 0, height: 132, width: 55 }}
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

					<div
						className="pointer-events-none absolute rounded-full bg-[#d9d9d9]"
						style={{ left: 141, top: 282, height: 110, width: 111 }}
					/>

					<div className="absolute z-10 text-center" style={{ left: 69, top: 411, width: 254 }}>
						<h1 className="whitespace-nowrap font-sans text-[48px] font-semibold leading-none tracking-tighter text-white">
							IMPACTFUL
						</h1>
					</div>

					<div className="absolute left-1/2 z-10 -translate-x-1/2 text-center" style={{ top: 474 }}>
						<p className="whitespace-nowrap font-sans text-[36px] font-bold tracking-tight text-[#005b80]" style={{ lineHeight: "63px" }}>
							Impact
						</p>
						<Link
							href="/login"
							className="-mt-1 inline-block whitespace-nowrap font-sans text-[36px] font-bold tracking-tight text-[#ff8d00]"
							style={{ lineHeight: "63px" }}
						>
							Starts Here →
						</Link>
					</div>
						</section>
					</div>
				</div>
			</main>
	);
}