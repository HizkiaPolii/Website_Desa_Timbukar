"use client";

import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

interface TeamMember {
  id: number;
  name: string;
  nim: string;
  fakultas: string;
  prodi: string;
  image?: string; // Path ke foto, e.g.: "/images/team/nama.jpg"
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Miracle Eukharistia Ampow",
    nim: "221111010017",
    fakultas: "Kesehatan Masyarakat",
    prodi: "Ilmu Kesehatan Masyarakat",
    image: "/images/team/miracle.jpg",
  },
  {
    id: 2,
    name: "Dea Daniella Mandagie",
    nim: "220311040136",
    fakultas: "Pertanian",
    prodi: "Agribisnis",
    image: "/images/team/dea.jpg",
  },
  {
    id: 3,
    name: "Andrea Emailly Sumakul",
    nim: "221011060001",
    fakultas: "Matematika dan Ilmu Pengetahuan Alam",
    prodi: "Sistem Informasi",
    image: "/images/team/andrea.jpg",
  },
  {
    id: 4,
    name: "Hizkia Nathanael Polii",
    nim: "220211060081",
    fakultas: "Teknik",
    prodi: "Teknik Informatika",
    image: "/images/team/hizkia.jpg",
  },
  {
    id: 5,
    name: "Bintang Putra Amin Sirih",
    nim: "220311040048",
    fakultas: "Pertanian",
    prodi: "Agribisnis",
    image: "/images/team/bintang.jpg",
  },
  {
    id: 6,
    name: "Meiqueen Ekklesia Watuseke",
    nim: "221111010107",
    fakultas: "Kesehatan Masyarakat",
    prodi: "Ilmu Kesehatan Masyarakat",
    image: "/images/team/meiqueen.jpg",
  },
  {
    id: 7,
    name: "Reva Felicia Parinding",
    nim: "231111010120",
    fakultas: "Kesehatan Masyarakat",
    prodi: "Ilmu Kesehatan Masyarakat",
    image: "/images/team/reva.jpg",
  },
  {
    id: 8,
    name: "Juvando Marcelino Assa",
    nim: "220211040005",
    fakultas: "Teknik",
    prodi: "Teknik Mesin",
    image: "/images/team/juvando.jpg",
  },
  {
    id: 9,
    name: "Queensy Livi Liud",
    nim: "220811030016",
    fakultas: "Ilmu Sosial dan Ilmu Politik",
    prodi: "Ilmu Pemerintahan",
    image: "/images/team/queensy.jpg",
  },
  {
    id: 10,
    name: "Frengki S Bawoel",
    nim: "19051106033",
    fakultas: "Perikanan dan Ilmu Kelautan",
    prodi: "Agrobisnis",
    image: "/images/team/frengki.jpg",
  },
];

export default function AboutUs() {
  return (
    <PageLayout heroTitle="" heroSubtitle="" currentPage="metadata">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 min-h-screen py-16 sm:py-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container-main max-w-full px-4 sm:px-8 lg:px-12 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16 sm:mb-20 relative">
            {/* Subtle Background Decoration */}
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-transparent to-blue-200 rounded-3xl blur-2xl"></div>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Tim Kami
            </h2>
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-8 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
              <div className="w-8 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="w-8 h-1.5 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"></div>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
              <span className="font-semibold text-emerald-700">
                Kuliah Kerja Terpadu (KKT) 144
              </span>{" "}
              Universitas Sam Ratulangi
              <br />
              <span className="text-gray-600">
                Berdedikasi mengembangkan Website Desa Timbukar untuk kemajuan
                masyarakat
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 mb-16 auto-rows-fr">
            {teamMembers.map((member) => (
              <div key={member.id} className="group relative h-full">
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-400 to-emerald-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Card Content */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-emerald-200">
                  {/* Photo Container */}
                  <div className="relative h-[420px] sm:h-80 md:h-96 w-full bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden border-b-2 border-gray-50">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ objectPosition: "center top" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-6xl sm:text-7xl shadow-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-gray-500 text-sm mt-4">
                            (Foto tidak tersedia)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2 sm:mb-3 line-clamp-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    <div className="space-y-1 sm:space-y-1.5 mb-3 flex-grow">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <span className="text-base sm:text-lg">🎓</span>
                        <div className="flex flex-col text-xs sm:text-sm">
                          <span className="text-emerald-700 text-xs">NIM:</span>
                          <span className="truncate">{member.nim}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                        <span className="text-base sm:text-lg">📚</span>
                        <div className="flex flex-col text-xs sm:text-sm">
                          <span className="text-blue-700 text-xs">
                            Fakultas:
                          </span>
                          <span className="truncate">{member.fakultas}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-purple-600 font-semibold">
                        <span className="text-base sm:text-lg">🎯</span>
                        <div className="flex flex-col text-xs sm:text-sm">
                          <span className="text-purple-700 text-xs">
                            Prodi:
                          </span>
                          <span className="truncate">{member.prodi}</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Thank You Banner with Image */}
          <div className="mt-20 sm:mt-24 mb-16 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/bannerthankyou.jpg"
                alt="Terima Kasih Banner"
                width={1200}
                height={400}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 hover:from-emerald-700 hover:via-blue-700 hover:to-emerald-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-500/50"
            >
              <span className="text-xl">←</span>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
