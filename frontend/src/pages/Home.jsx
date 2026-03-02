import HeroSearch from "../components/heroSearch";
import Categories from "../components/categories";
import Experience from "../components/experience";

export default function Home() {
  return (
    <main className="flex-1 space-y-24">
      <HeroSearch />
      <Categories />
      <Experience />
    </main>
  );
}