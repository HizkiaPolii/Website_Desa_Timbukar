"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  MessageSquare,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Card from "@/components/Card";

export default function DesaTimbukar() {
  const [expandedProfil, setExpandedProfil] = useState(false);

  const features = [
    {
      title: "Homestay Timbukar",
      description: "Penginapan nyaman dengan suasana desa yang asri",
      image: "🏠",
    },
    {
      title: "Air Terjun 3 Tingkat",
      description: "Destinasi wisata alam yang memukau",
      image: "🏞️",
    },
    {
      title: "Wisata Arung Jeram",
      description: "Petualangan seru di sungai Timbukar",
      image: "🚣",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-32 min-h-screen flex items-center mt-20 sm:mt-24 md:mt-28"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/headerweb.jpg"
            alt="Desa Timbukar"
            fill
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Selamat Datang di
              <span className="block text-emerald-300 mt-2">
                Desa Timbukar
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-10 leading-relaxed drop-shadow-lg">
              Melalui website ini Anda dapat menjelajahi segala hal yang terkait
              dengan desa. Aspek pemerintahan, penduduk, demografi, potensi
              desa, dan juga berita tentang desa.
            </p>
          </div>
        </div>
      </section>

      {/* Sambutan Hukum Tua Section */}
      <section
        id="sambutan-hukum-tua"
        className="section-padding bg-gradient-to-br from-emerald-50 to-white flex-grow"
      >
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Foto Hukum Tua - Di Kiri */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-600">
                  <Image
                    src="/images/hukumtua.png"
                    alt="Hukum Tua Desa Timbukar"
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority={false}
                  />
                </div>
                {/* Decorative element */}
                <div className="hidden sm:block absolute -bottom-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 bg-emerald-200 rounded-full opacity-50 -z-10"></div>
              </div>
            </div>

            {/* Teks Sambutan - Di Kanan */}
            <div className="order-1 md:order-2">
              <h2 className="title-section text-emerald-600 mb-6">
                Sambutan Hukum Tua Desa
              </h2>
              <Card className="bg-white border-l-4 border-emerald-600">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                  Website ini hadir sebagai wujud transformasi desa Timbukar
                  menjadi desa yang mampu memanfaatkan teknologi informasi dan
                  komunikasi, terintegrasi kedalam sistem online. Keterbukaan
                  informasi publik, pelayanan publik dan kegiatan perekonomian
                  di desa, guna mewujudkan desa Timbukar sebagai desa wisata
                  yang berkelanjutan, adaptasi dan mitigasi terhadap perubahan
                  iklim serta menjadi desa yang mandiri.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                  Terima kasih kepada semua pihak yang telah banyak memberi
                  dukungan dan kontribusi baik berupa tenaga, pikiran dan
                  semangat.
                </p>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    DENNY ENGKA
                    <br />
                    <span className="text-gray-700 text-xs sm:text-sm">
                      HUKUM TUA DESA TIMBUKAR
                    </span>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="wisata" className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="title-section text-emerald-600 mb-4">
              Potensi Wisata
            </h2>
            <p className="subtitle-section max-w-2xl mx-auto">
              Desa Timbukar memiliki berbagai destinasi wisata alam yang
              menakjubkan
            </p>
          </div>

          <div className="grid-responsive gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="overflow-hidden">
                <div className="h-40 sm:h-48 bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl">{feature.image}</span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section
        id="profil"
        className="section-padding bg-gradient-to-br from-gray-50 to-emerald-50"
      >
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="title-section text-emerald-600 mb-6">
                Tentang Desa Timbukar
              </h2>
              <p className="subtitle-section mb-6">
                Desa Timbukar adalah sebuah desa yang kaya akan keindahan alam
                dan potensi wisata. Dengan berbagai destinasi menarik seperti
                air terjun bertingkat, arung jeram, dan homestay yang nyaman,
                kami siap menyambut Anda untuk merasakan pengalaman tak
                terlupakan.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-emerald-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">
                    Lokasi strategis dan mudah diakses
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-emerald-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">
                    Masyarakat yang ramah dan hospitality
                  </span>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-8 sm:p-12">
              <h3 className="text-xl sm:text-2xl font-bold mb-6">Informasi Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Telepon</p>
                    <p className="text-emerald-100 text-sm sm:text-base">081340798030</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Email</p>
                    <p className="text-emerald-100 text-sm sm:text-base">
                      infodesatimbukar@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
