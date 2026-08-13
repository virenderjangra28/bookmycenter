import Image from "next/image";

const TrustedPartnerSection = () => {
  return (
    <section className="bg-[#eef2ff] py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl shadow-lg lg:max-w-none">
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=80"
            alt="Healthcare professional with clipboard"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="max-w-lg">
          <h2 className="text-2xl font-bold leading-tight text-[#0b1a33] sm:text-3xl lg:text-4xl">
            Your trusted partner in success and growth
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#4a5568] sm:text-lg">
            We combine AI-powered assessment technology with a global network of
            verified test centers to deliver reliable, secure, and scalable exam
            experiences. Whether you are a candidate booking your next exam or an
            organization managing high-stakes assessments, BookMyCenter helps you
            achieve your goals with confidence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnerSection;
