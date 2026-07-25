import Link from "next/link";

export default function WelcomePage() {
	return (
		<main className="min-h-screen bg-black text-white sm:flex sm:items-center sm:justify-center sm:p-6">
			<section className="relative mx-auto h-[909px] w-[393px] overflow-hidden bg-black">
				<div className="absolute inset-0 bg-black" />

				<img
					src="/assets/Top%20left%20corner%20dots.svg"
					alt=""
					className="pointer-events-none absolute left-0 top-0 h-[132px] w-[55px] select-none"
					draggable={false}
				/>
				<img
					src="/assets/Top%20right%20corner%20dots.svg"
					alt=""
					className="pointer-events-none absolute left-[261px] top-[11px] h-[55px] w-[132px] select-none"
					draggable={false}
				/>
				<img
					src="/assets/Bottom%20right%20corner%20dots.svg"
					alt=""
					className="pointer-events-none absolute left-[326px] top-[748px] h-[146px] w-[48px] select-none"
					draggable={false}
				/>

				<img
					src="/assets/Green%20branches.svg"
					alt=""
					className="pointer-events-none absolute left-0 top-[101px] h-[707px] w-[393px] select-none"
					draggable={false}
				/>

				<div className="pointer-events-none absolute left-[52px] top-[251px] h-[370px] w-[288px] rounded-[15px] bg-[rgba(0,0,0,0.95)]" />

				<div className="pointer-events-none absolute left-[141px] top-[282px] h-[110px] w-[111px] rounded-full bg-[#d9d9d9]" />

				<div className="absolute left-[69px] top-[411px] z-10 w-[254px] text-center">
					<h1 className="whitespace-nowrap font-sans text-[48px] font-semibold leading-[1] tracking-[-0.05em] text-white">
						IMPACTFUL
					</h1>
				</div>

				<div className="absolute left-1/2 top-[474px] z-10 -translate-x-1/2 text-center">
					<p className="whitespace-nowrap font-sans text-[36px] font-bold leading-[63px] tracking-[-0.02em] text-[#005b80]">
						Impact
					</p>
					<Link
						href="/tutorial"
						className="-mt-1 inline-block whitespace-nowrap font-sans text-[36px] font-bold leading-[63px] tracking-[-0.02em] text-[#ff8d00]"
					>
						Starts Here →
					</Link>
				</div>
			</section>
		</main>
	);
}
