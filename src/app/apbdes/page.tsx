"use client";

import PageLayout from "@/components/PageLayout";

interface BudgetItem {
  description: string;
  amount: number;
}

interface BudgetCategory {
  category: string;
  items: BudgetItem[];
  total: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function ApbdesPage() {
  // Data Pendapatan
  const pendapatan: BudgetCategory[] = [
    {
      category: "Pendapatan Asli Desa (PAD)",
      items: [
        { description: "Pajak Desa", amount: 50000000 },
        { description: "Retribusi Desa", amount: 35000000 },
        { description: "Hasil Usaha Desa", amount: 40000000 },
        { description: "Hasil Kekayaan Desa", amount: 25000000 },
      ],
      total: 150000000,
    },
    {
      category: "Dana Transfer",
      items: [
        { description: "Dana Alokasi Umum (DAU)", amount: 800000000 },
        { description: "Dana Alokasi Khusus (DAK)", amount: 300000000 },
        { description: "Dana Desa", amount: 1200000000 },
        { description: "Bagi Hasil Pajak & Retribusi", amount: 150000000 },
      ],
      total: 2450000000,
    },
    {
      category: "Lain-lain Pendapatan",
      items: [
        { description: "Hibah", amount: 100000000 },
        { description: "Pinjaman", amount: 50000000 },
        { description: "Pendapatan Bunga", amount: 25000000 },
      ],
      total: 175000000,
    },
  ];

  const totalPendapatan = pendapatan.reduce((sum, cat) => sum + cat.total, 0);

  // Data Belanja
  const belanja: BudgetCategory[] = [
    {
      category: "Belanja Aparatur Desa",
      items: [
        { description: "Gaji & Tunjangan Kepala Desa", amount: 120000000 },
        { description: "Gaji & Tunjangan Perangkat Desa", amount: 280000000 },
        { description: "Asuransi Kesehatan Aparatur", amount: 60000000 },
        { description: "Pelatihan Aparatur Desa", amount: 50000000 },
      ],
      total: 510000000,
    },
    {
      category: "Belanja Pelayanan Publik",
      items: [
        { description: "Pendidikan & Pelatihan Masyarakat", amount: 200000000 },
        { description: "Kesehatan Masyarakat", amount: 250000000 },
        { description: "Puskesmas/Polindes", amount: 150000000 },
        { description: "Program Kesejahteraan Sosial", amount: 300000000 },
      ],
      total: 900000000,
    },
    {
      category: "Belanja Pembangunan Infrastruktur",
      items: [
        { description: "Pembangunan Jalan Desa", amount: 500000000 },
        { description: "Pembangunan Irigasi", amount: 300000000 },
        { description: "Pembangunan Gedung Pertemuan", amount: 250000000 },
        { description: "Pembangunan Sanitasi & Air Bersih", amount: 200000000 },
        { description: "Pembangunan Listrik Desa", amount: 150000000 },
      ],
      total: 1400000000,
    },
    {
      category: "Belanja Pemberdayaan Masyarakat",
      items: [
        { description: "Program Pemberdayaan Ekonomi", amount: 150000000 },
        { description: "Pelatihan Keterampilan", amount: 120000000 },
        { description: "Dukungan UMKM", amount: 180000000 },
        { description: "Program Pertanian Modern", amount: 140000000 },
      ],
      total: 590000000,
    },
    {
      category: "Belanja Penyelenggaraan Pemerintahan",
      items: [
        { description: "Operasional Kantor Desa", amount: 80000000 },
        { description: "Pemeliharaan Aset Desa", amount: 100000000 },
        { description: "Perjalanan Dinas", amount: 60000000 },
        { description: "Rapat & Pertemuan", amount: 40000000 },
      ],
      total: 280000000,
    },
    {
      category: "Belanja Lain-lain",
      items: [
        { description: "Cadangan Umum", amount: 150000000 },
        { description: "Koreksi Kesalahan Tahun Sebelumnya", amount: 25000000 },
      ],
      total: 175000000,
    },
  ];

  const totalBelanja = belanja.reduce((sum, cat) => sum + cat.total, 0);
  const surplus = totalPendapatan - totalBelanja;

  return (
    <PageLayout
      heroTitle="APBDES"
      heroSubtitle="Anggaran Pendapatan dan Belanja Desa Timbukar Tahun Anggaran 2024"
      currentPage="apbdes"
    >
      {/* Ringkasan APBDES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Total Pendapatan
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalPendapatan)}
          </p>
          <p className="text-xs text-gray-600 mt-2">Tahun Anggaran 2024</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💰 Total Belanja
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalBelanja)}
          </p>
          <p className="text-xs text-gray-600 mt-2">Tahun Anggaran 2024</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ✅ Surplus/Defisit
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(surplus)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {surplus >= 0 ? "Surplus" : "Defisit"}
          </p>
        </div>
      </div>

      {/* Pendapatan */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📈 PENDAPATAN
        </h2>
        <div className="space-y-4">
          {pendapatan.map((category, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <h3 className="text-lg font-bold text-white">
                  {category.category}
                </h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 font-semibold text-gray-700">
                        Uraian
                      </th>
                      <th className="text-right py-2 font-semibold text-gray-700">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 text-gray-700">
                          {item.description}
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t-2 border-gray-300 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">
                    Total {category.category}:
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(category.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">TOTAL PENDAPATAN</span>
              <span className="text-3xl font-bold">
                {formatCurrency(totalPendapatan)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Belanja */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📉 BELANJA
        </h2>
        <div className="space-y-4">
          {belanja.map((category, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <h3 className="text-lg font-bold text-white">
                  {category.category}
                </h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 font-semibold text-gray-700">
                        Uraian
                      </th>
                      <th className="text-right py-2 font-semibold text-gray-700">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 text-gray-700">
                          {item.description}
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t-2 border-gray-300 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">
                    Total {category.category}:
                  </span>
                  <span className="font-bold text-red-600 text-lg">
                    {formatCurrency(category.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">TOTAL BELANJA</span>
              <span className="text-3xl font-bold">
                {formatCurrency(totalBelanja)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ringkasan Akhir */}
      <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📋 Ringkasan APBDES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700 font-semibold">
                    Total Pendapatan:
                  </td>
                  <td className="py-2 text-right font-bold text-green-600">
                    {formatCurrency(totalPendapatan)}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700 font-semibold">
                    Total Belanja:
                  </td>
                  <td className="py-2 text-right font-bold text-red-600">
                    {formatCurrency(totalBelanja)}
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="py-2 text-gray-900 font-bold">
                    Surplus/Defisit:
                  </td>
                  <td className="py-2 text-right font-bold text-blue-600 text-lg">
                    {formatCurrency(surplus)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-700">
                <strong>Catatan:</strong> Data APBDES di atas adalah contoh
                untuk tahun anggaran 2024. Untuk informasi detail dan dokumen
                resmi APBDES, silakan hubungi Kantor Desa Timbukar atau periksa
                papan informasi publik desa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Foto APBDES Baliho */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📸 Foto APBDES
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">
            Berikut adalah dokumentasi APBDES yang dicetak sebagai baliho dan
            ditampilkan di masyarakat Desa Timbukar
          </p>

          {/* Placeholder untuk foto - akan ditampilkan jika ada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📋</span>
                  <p className="text-gray-500 text-sm">
                    Foto APBDES akan ditampilkan di sini
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Info:</strong> Admin dapat menambahkan foto APBDES
              (baliho) melalui halaman Edit APBDes di admin dashboard.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
