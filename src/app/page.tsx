import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import CategorySection from "@/components/category-section";
import ProductGrid from "@/components/product-grid";
import WhyKomando from "@/components/why-komando";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <ProductGrid />
        <WhyKomando />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
