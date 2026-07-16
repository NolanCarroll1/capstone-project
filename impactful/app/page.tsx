import Image from "next/image";

const townIllustration =
  "http://localhost:3845/assets/14bf75ea86aa01748aa388c99139a23bf8093ea4.png";

const metadataItems = ["5 phases", "10+ scenarios", "your path"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f1ec] px-0 py-0 text-[#111111] sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
      <section className="flex min-h-screen w-full flex-col bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] sm:min-h-[852px] sm:max-w-[393px]">
        <header className="flex flex-1 flex-col items-center justify-center gap-8 bg-black px-8 py-12 text-center text-white">
          <Image
            src={townIllustration}
            alt="Town illustration"
            width={220}
            height={220}
            priority
            className="h-[220px] w-[220px] select-none object-contain"
          />

          <div className="space-y-1">
            <p className="font-sans text-[24px] font-semibold tracking-[0.05em] text-[#99a1af]">
              DIGITAL CITIZEN
            </p>
            <p className="font-sans text-[20px] leading-5 text-[#6a7282]">
              Deceptive Design module
            </p>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-between px-8 py-12">
          <div className="space-y-8">
            <div className="inline-flex border-2 border-black px-[17px] py-[6px]">
              <p className="font-sans text-[14px] font-bold tracking-[0.1em] text-black">
                PHASE 1 OF 5
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[220px] font-sans text-[36px] font-bold leading-[1.25] tracking-[-0.03em] text-black">
                Your Story Begins
              </h1>

              <p className="max-w-[318px] font-sans text-[16px] leading-[1.62] text-[#4a5565]">
                You&apos;re in charge of a growing digital town. Every design choice you
                make shapes how your citizens experience their online world. The path
                you choose decides what kind of community this becomes — and every
                decision leads somewhere different.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[12px] font-semibold tracking-[0.06em] text-[#6a7282] sm:flex-nowrap">
              {metadataItems.map((item, index) => (
                <div key={item} className="flex items-center gap-x-4">
                  <span>{item}</span>
                  {index < metadataItems.length - 1 ? <span aria-hidden="true">·</span> : null}
                </div>
              ))}
            </div>

            <a
              href="/tutorial"
              className="flex h-[58px] items-center justify-center border-2 border-black px-6 font-mono text-[16px] font-bold tracking-[0.16em] text-black transition-colors duration-200 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <span>[ BEGIN YOUR STORY ]</span>
              <span aria-hidden="true" className="ml-2 text-[12px] leading-none">
                →
              </span>
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
