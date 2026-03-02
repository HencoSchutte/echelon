import ImageSearch from "../components/ImageSearch";

export default function ImageSearchPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center md:text-left">
        Search Products by Image
      </h1>

      <ImageSearch />
    </section>
  );
}