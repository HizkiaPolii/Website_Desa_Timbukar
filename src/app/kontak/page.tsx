"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import MapComponent from "@/components/MapComponent";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import "leaflet/dist/leaflet.css";

export default function KontakDesa() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    subjek: "",
    pesan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi submit
    setTimeout(() => {
      toast.success("Terima kasih! Pesan Anda telah terkirim.");
      setFormData({
        nama: "",
        email: "",
        telepon: "",
        subjek: "",
        pesan: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const infoKontak = [
    {
      icon: MapPin,
      label: "Alamat",
      value:
        "Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa, Sulawesi Utara",
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "081340798030",
    },
    {
      icon: Mail,
      label: "Email",
      value: "infodesatimbukar@gmail.com",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: "Senin - Jumat: 08:00 - 16:00 WIT",
    },
  ];

  // Koordinat Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa, Sulawesi Utara
  // Latitude: 1.2872985° LU, Longitude: 124.7235670° BT (dari Google Maps)
  const mapCenter = {
    lat: 1.2872985, // Latitude Desa Timbukar
    lng: 124.723567, // Longitude Desa Timbukar
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "1rem",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation currentPage="kontak" />

      {/* Hero Section */}
      <section className="hero-section mt-20 sm:mt-24 md:mt-28">
        <div className="container-main">
          <h1 className="hero-title text-white mb-2 sm:mb-4">Hubungi Kami</h1>
          <p className="hero-subtitle">
            Kami siap membantu Anda dengan pertanyaan atau informasi apapun
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-main section-padding flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Informasi Kontak */}
          <section>
            <h2 className="title-section text-emerald-600 mb-8">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              {infoKontak.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    hover
                    className="border-l-4 border-emerald-600 bg-gradient-to-br from-emerald-50 to-blue-50"
                  >
                    <div className="flex items-start gap-4">
                      <Icon
                        className="text-emerald-600 flex-shrink-0 mt-1"
                        size={24}
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                          {info.label}
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="mt-12">
              <h3 className="title-section text-emerald-600 mb-4">
                Media Sosial
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors text-sm font-bold"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors text-sm font-bold"
                  title="WhatsApp"
                >
                  W
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors text-lg"
                  title="Instagram"
                >
                  📷
                </a>
              </div>
            </div>
          </section>

          {/* Form Kontak */}
          <section>
            <h2 className="title-section text-emerald-600 mb-8">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama */}
              <div>
                <label
                  htmlFor="nama"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                  placeholder="Nama Anda"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                  placeholder="email@example.com"
                />
              </div>

              {/* Telepon */}
              <div>
                <label
                  htmlFor="telepon"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-2"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                  placeholder="0812345678"
                />
              </div>

              {/* Subjek */}
              <div>
                <label
                  htmlFor="subjek"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-2"
                >
                  Subjek
                </label>
                <input
                  type="text"
                  id="subjek"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                  placeholder="Subjek pesan Anda"
                />
              </div>

              {/* Pesan */}
              <div>
                <label
                  htmlFor="pesan"
                  className="block text-xs sm:text-sm font-medium text-gray-900 mb-2"
                >
                  Pesan
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none text-sm"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-white flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send size={20} />
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </section>
        </div>

        {/* Map Section */}
        <section className="mt-16 sm:mt-20">
          <h2 className="title-section text-emerald-600 mb-8">Lokasi Kami</h2>
          <MapComponent
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            title="Desa Timbukar"
            subtitle="Kecamatan Sonder, Kabupaten Minahasa, Sulawesi Utara"
          />
          <div className="mt-6 p-6 bg-green-50 rounded-2xl border-l-4 border-green-600">
            <p className="text-gray-700">
              <strong>📍 Lokasi Desa Timbukar</strong>
              <br />
              Kecamatan Sonder, Kabupaten Minahasa, Sulawesi Utara
              <br />
              <strong>✅ Peta 100% GRATIS</strong> - Menggunakan{" "}
              <a
                href="https://www.openstreetmap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                OpenStreetMap
              </a>{" "}
              tanpa biaya API selamanya
              <br />� Klik marker untuk melihat informasi lokasi
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
