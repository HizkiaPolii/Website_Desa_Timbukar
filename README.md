# Web Desa Timbukar

Website resmi Desa Timbukar yang dibangun dengan Next.js 14 dan Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Font**: Google Fonts (Inter)

## Fitur

- Server-side rendering dengan Next.js
- Responsive design dengan Tailwind CSS
- TypeScript untuk type safety
- ESLint configuration

## Instalasi

1. Clone atau extract folder ini
2. Masuk ke direktori project:

   ```bash
   cd Web-Desa-Timbukar
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Menjalankan Project

### Development Mode

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Production Build

```bash
npm run build
npm start
```

## Struktur Folder

```
Web-Desa-Timbukar/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout utama
│   │   ├── page.tsx        # Halaman home
│   │   └── globals.css     # Global styles
│   └── components/         # Komponen reusable
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Pengembangan Lebih Lanjut

Anda dapat menambahkan:

- Komponen baru di folder `src/components/`
- Halaman baru di folder `src/app/`
- Mengubah styling di file `src/app/globals.css`
- Konfigurasi Tailwind di `tailwind.config.ts`

## License

MIT
