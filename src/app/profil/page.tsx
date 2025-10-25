"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Target } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { getProfilDesa } from "@/services/profilDesaService";

interface Misi {
  no: string;
  title: string;
  description: string;
}

interface ProfileData {
  id?: number;
  visi: string;
  misi: Misi[];
  tujuan?: string[];
  sejarah: string;
  updated_at?: string;
}

export default function ProfilDesa() {
  const [visiMisi, setVisiMisi] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProfilDesa();
        if (result.success && result.data) {
          setVisiMisi(result.data);
        } else {
          console.error("Error fetching profile data:", result.error);
          // Fallback ke data default jika gagal
          setVisiMisi({
            visi: "Desa Timbukar yang maju, mandiri, dan berkelanjutan dengan pemberdayaan masyarakat dan pelestarian lingkungan.",
            misi: [],
            tujuan: [],
            sejarah: "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Fallback ke data default jika gagal
        setVisiMisi({
          visi: "Desa Timbukar yang maju, mandiri, dan berkelanjutan dengan pemberdayaan masyarakat dan pelestarian lingkungan.",
          misi: [],
          tujuan: [],
          sejarah: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        heroTitle="Profil Desa Timbukar"
        heroSubtitle="Informasi lengkap tentang Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa"
        currentPage="profil"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Memuat data profil...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!visiMisi) {
    return (
      <PageLayout
        heroTitle="Profil Desa Timbukar"
        heroSubtitle="Informasi lengkap tentang Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa"
        currentPage="profil"
      >
        <div className="text-center text-red-600">Gagal memuat data profil</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroTitle="Profil Desa Timbukar"
      heroSubtitle="Informasi lengkap tentang Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa"
      currentPage="profil"
    >
      {/* Visi */}
      <section className="mb-16 sm:mb-20">
        <div className="flex items-start gap-4 mb-8">
          <Target
            size={32}
            className="text-emerald-600 flex-shrink-0 mt-2 hidden sm:block"
          />
          <div className="flex-1">
            <h2 className="section-title">Visi Desa</h2>
            <div className="section-box-emerald">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 italic">
                &quot;{visiMisi.visi}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misi */}
      <section className="mb-16 sm:mb-20">
        <h2 className="section-title">Misi Desa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visiMisi.misi.map((item, index) => (
            <div key={index} className="section-box-emerald">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {item.no}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="mb-8">
        <h2 className="section-title">Sejarah Singkat Desa Timbukar</h2>
        <div className="section-box-blue">
          {visiMisi.sejarah.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
