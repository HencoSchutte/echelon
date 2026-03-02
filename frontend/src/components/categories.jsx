import phoneImg from "../assets/images/phone_home.webp";
import pcImg from "../assets/images/pc_home.webp";
import laptopImg from "../assets/images/laptop_home.webp";
import audioImg from "../assets/images/audio_home.webp";
import gamingImg from "../assets/images/gaming_home.jpeg";

const categories = [
  { name: "PC", image: pcImg },
  { name: "Smartphones", image: phoneImg },
  { name: "Laptops", image: laptopImg },
  { name: "Audio", image: audioImg },
  { name: "Gaming", image: gamingImg },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1512499617640-c2f999098c01",
  },
];

export default function Categories() {
  return (
    <section className="bg-black px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-[1800px]">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-white text-3xl md:text-4xl font-light tracking-wide">
            Explore Categories
          </h2>
          <button className="border border-neutral-700 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Shop
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  return (
    <div className="relative group rounded-xl overflow-hidden cursor-pointer transform-gpu will-change-transform transition-transform duration-300 hover:scale-105">

      {/* Static silver edge */}
      <div className="absolute inset-0 rounded-xl border border-white/40 pointer-events-none z-20" />

      {/* Neon purple glow on hover */}
      <div className="absolute inset-0 rounded-xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-purple-400/70 via-indigo-400/60 to-purple-500/70 blur-xl animate-pulse" />
      </div>

      {/* Moving shimmer along top-left edge */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl overflow-hidden z-30">
        <div className="absolute -left-32 top-0 w-32 h-full bg-gradient-to-r from-white/60 via-white/20 to-transparent rotate-12 " />
      </div>

      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="h-56 md:h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-20" />

      {/* Text */}
      <div className="absolute bottom-5 left-5 z-30">
        <h3 className="text-white text-lg md:text-xl font-medium tracking-wide">
          {category.name}
        </h3>
        <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Explore →
        </span>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-60 transition-opacity duration-500 blur-3xl bg-purple-600/30" />
    </div>
  );
}