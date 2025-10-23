import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface PageLayoutProps {
  heroTitle: string;
  heroSubtitle?: string;
  children: ReactNode;
  currentPage:
    | "home"
    | "profil"
    | "apb"
    | "kontak"
    | "aparatur"
    | "galeri"
    | "pemerintahan-desa"
    | "lembaga-masyarakat"
    | "data-desa"
    | "metadata"
    | "bumdes"
    | "apbdes"
    | "apbdesa"
    | "rkpdesa";
  backgroundColor?: string;
  includeNavigation?: boolean;
  includeFooter?: boolean;
}

export default function PageLayout({
  heroTitle,
  heroSubtitle,
  children,
  currentPage,
  backgroundColor = "bg-gradient-to-br from-gray-50 to-gray-100",
  includeNavigation = true,
  includeFooter = true,
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${backgroundColor}`}>
      {/* Navigation */}
      {includeNavigation && <Navigation currentPage={currentPage} />}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-main">
          <h1 className="hero-title">{heroTitle}</h1>
          {heroSubtitle && <p className="hero-subtitle">{heroSubtitle}</p>}
        </div>
      </section>

      {/* Main Content */}
      <main className="container-main section-padding flex-grow">
        {children}
      </main>

      {/* Footer */}
      {includeFooter && <Footer />}
    </div>
  );
}
