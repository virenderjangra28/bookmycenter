import Link from "next/link";
import Image from "next/image";

function PlayIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  );
}

const HeroSection = () => {
  return (
    <section className="bg-[#051224]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Building the workforce of tomorrow
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            BookMyCenter is a global platform for credentialing and skills
            development, helping candidates discover verified test centers and
            organizations scale assessments with confidence across India and
            worldwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/find-your-exam"
              className="inline-flex items-center justify-center rounded-full bg-[#1fe8a3] px-7 py-3 text-sm font-bold text-[#051224] transition-colors hover:bg-[#17d492]"
            >
              Find Your Exam
            </Link>
            <Link
              href="#partner-with-us"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Partner With Us
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#0a1e3d] shadow-2xl">
          <div className="relative aspect-video w-full">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80"
              alt="Professional preparing for an exam"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                type="button"
                aria-label="Play video"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#051224] shadow-lg transition-transform hover:scale-105"
              >
                <PlayIcon className="ml-1 h-7 w-7" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0a1e3d]/95 px-4 py-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-1/3 rounded-full bg-[#1fe8a3]" />
            </div>
            <span className="text-xs text-white/70">0:00 / 2:45</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
