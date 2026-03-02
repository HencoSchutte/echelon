import HeroSearch from "../components/HeroSearch";
import Categories from "../components/Categories";
import Experience from "../components/Experience";

export default function Home() {
  return (
    <main className="flex-1 space-y-24">
      <HeroSearch />
      <Categories />
      <Experience />
    </main>
  );
}