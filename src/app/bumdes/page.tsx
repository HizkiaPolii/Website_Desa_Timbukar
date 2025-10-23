"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";

interface BusinessUnit {
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
}

interface BumdesData {
  businessUnits: BusinessUnit[];
}

export default function BumdesPage() {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bumdes");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result: BumdesData = await response.json();
        setBusinessUnits(result.businessUnits);
      } catch (error) {
        console.error("Error fetching bumdes data:", error);
        // Fallback ke data default jika gagal
        setBusinessUnits([
          {
            icon: "⛏️",
            title: "Tambang Batu Alam",
            description:
              "Usaha tambang batu alam berkualitas tinggi yang diproduksi dengan standar keselamatan internasional. Batu alam kami digunakan untuk konstruksi, dekorasi, dan keperluan industri.",
            features: [
              "Batu alam premium berkualitas tinggi",
              "Pengiriman ke seluruh wilayah",
              "Harga kompetitif",
            ],
            color: "blue",
          },
          {
            icon: "🚣",
            title: "Arung Jeram",
            description:
              "Paket petualangan arung jeram yang menarik dengan dipandu oleh pemandu berpengalaman. Nikmati sensasi mengarungi sungai dengan pemandangan alam yang memukau.",
            features: [
              "Pemandu profesional berpengalaman",
              "Peralatan keselamatan lengkap",
              "Paket group dan private tersedia",
            ],
            color: "green",
          },
          {
            icon: "💧",
            title: "Air Terjun",
            description:
              "Destinasi wisata air terjun alami dengan keindahan alam yang spektakuler. Tempat ideal untuk rekreasi keluarga, fotografi, dan menikmati kesegaran alam.",
            features: [
              "Akses mudah dan aman",
              "Fasilitas pendukung lengkap",
              "Pemandangan alam yang menakjubkan",
            ],
            color: "cyan",
          },
          {
            icon: "🏠",
            title: "Homestay",
            description:
              "Akomodasi homestay yang nyaman dan ramah dengan sentuhan budaya lokal. Menginap bersama keluarga lokal dan rasakan pengalaman autentik desa.",
            features: [
              "Ruangan bersih dan nyaman",
              "Sarapan tradisional lokal",
              "Harga terjangkau dan bersahabat",
            ],
            color: "amber",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        heroTitle="BUMDES"
        heroSubtitle="Badan Usaha Milik Desa Timbukar"
        currentPage="bumdes"
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroTitle="BUMDES"
      heroSubtitle="Badan Usaha Milik Desa Timbukar"
      currentPage="bumdes"
    >
      {/* Business Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {businessUnits.map((unit, index) => {
          const bgColorMap: { [key: string]: string } = {
            blue: "section-box-blue",
            green: "section-box-green",
            cyan: "section-box-blue",
            amber: "section-box-amber",
          };

          return (
            <div key={index} className={bgColorMap[unit.color]}>
              <div className="text-3xl sm:text-4xl mb-4">{unit.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                {unit.title}
              </h3>
              <p className="text-gray-700 mb-4 text-xs sm:text-sm leading-relaxed">
                {unit.description}
              </p>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                {unit.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
