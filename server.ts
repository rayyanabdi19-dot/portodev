import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio-db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

app.use('/uploads', express.static(UPLOADS_DIR));

// Secure One-Way Password Hashing (PBKDF2 with SHA-256)
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'delv_portfolio_secure_salt_2026';

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, PASSWORD_SALT, 10000, 32, 'sha256').toString('hex');
}

function verifyPassword(inputPassword: string, storedPasswordHash?: string): boolean {
  if (!storedPasswordHash || !inputPassword) return false;
  const computedHash = hashPassword(inputPassword);
  if (computedHash === storedPasswordHash) return true;
  // Fallback for smooth transition if legacy plain-text was stored
  if (inputPassword === storedPasswordHash) return true;
  return false;
}

// Default PBKDF2 hash for initial bootstrap (no plain-text password in source code)
const DEFAULT_ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || (
  process.env.ADMIN_PASSWORD
    ? hashPassword(process.env.ADMIN_PASSWORD)
    : 'eea3027d5564cf825609c4d4137dac6c55c2f176f1dada62f30553dd8b5f1d5c'
);

const INITIAL_DATA = {
  user: {
    id: 'usr_admin_1',
    name: 'Rayyan Abdi',
    email: process.env.ADMIN_EMAIL || 'rayyan.abdi19@gmail.com',
    password: DEFAULT_ADMIN_PASSWORD_HASH,
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  profile: {
    id: 'prof_1',
    name: 'Delv Andriawan',
    title: 'Freelancer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    bio: 'Halo! Saya Delv Andriawan, seorang Freelancer yang berdedikasi membangun aplikasi web modern, sistem informasi handal, dan solusi digital terpercaya untuk klien dan bisnis. Siap membantu mewujudkan ide menjadi produk digital nyata dengan hasil kerja yang rapi, performa tinggi, dan tepat waktu.',
    short_bio: 'Freelancer • Web Application • Digital Solutions. Membantu bisnis dan klien mewujudkan aplikasi digital berkualitas secara fleksibel dan profesional.',
    email: 'delv.andriawan@gmail.com',
    phone: '+62 812-3456-7890',
    location: 'Bandung & Jakarta, Indonesia',
    website: 'https://delvandriawan.dev',
    github: 'https://github.com/delvandriawan',
    linkedin: 'https://linkedin.com/in/delvandriawan',
    instagram: 'https://instagram.com/delvandriawan',
    whatsapp: 'https://wa.me/6281234567890',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  educations: [
    {
      id: 'edu_1',
      institution: 'Universitas Komputer Indonesia (UNIKOM)',
      degree: 'Sarjana Komputer (S1)',
      field: 'Teknik Informatika (Software Engineering)',
      start_year: '2020',
      end_year: '2024',
      description: 'Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Terdistribusi, dan Pengembangan Aplikasi Web. Lulus dengan predikat Sangat Memuaskan (IPK 3.84). Menyelesaikan skripsi implementasi sistem kasir POS terintegrasi cloud.',
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200',
      status: 'Lulus',
      sort_order: 1,
    },
    {
      id: 'edu_2',
      institution: 'SMKN 4 Bandung',
      degree: 'Sekolah Menengah Kejuruan (SMK)',
      field: 'Rekayasa Perangkat Lunak (RPL)',
      start_year: '2017',
      end_year: '2020',
      description: 'Mempelajari dasar pemrograman algoritma, basis data relasional MySQL, OOP dengan Java dan PHP, serta pembuatan antarmuka web modern.',
      logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=200',
      status: 'Lulus',
      sort_order: 2,
    },
  ],
  experiences: [
    {
      id: 'exp_1',
      position: 'Senior Fullstack Developer',
      company: 'Nusantara Digital Solutions (Freelance & Kontrak)',
      location: 'Bandung / Remote',
      employment_type: 'Freelance',
      start_date: '2024',
      end_date: 'Sekarang',
      is_current: true,
      description: 'Memimpin arsitektur dan pengembangan aplikasi web custom untuk UMKM dan perusahaan rintisan.',
      responsibilities: [
        'Merancang dan membangun sistem Point of Sale (POS) dan CRM berbasis cloud dengan React, Node.js, dan MySQL.',
        'Mengimplementasikan praktik Vibe Coding dan AI-assisted workflows untuk memangkas waktu delivery fitur hingga 40%.',
        'Mengoptimalkan database query dan performa caching Redis untuk latensi sub-100ms.',
      ],
      achievements: [
        'Sukses meluncurkan 8+ platform web produksi yang aktif digunakan oleh lebih dari 15.000 pengguna bulanan.',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'Docker'],
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=200',
      sort_order: 1,
    },
    {
      id: 'exp_2',
      position: 'Web Developer',
      company: 'PT Solusi Teknologi Nusantara',
      location: 'Jakarta Selatan / Hybrid',
      employment_type: 'Full Time',
      start_date: '2022',
      end_date: '2024',
      is_current: false,
      description: 'Bertanggung jawab dalam pengembangan modul ERP, inventory tracking, dan portal pelanggan internal.',
      responsibilities: [
        'Mengembangkan RESTful API dengan Laravel dan Node.js yang melayani aplikasi web dan mobile.',
        'Membangun antarmuka dashboard admin interaktif menggunakan React dan Tailwind CSS.',
        'Melakukan integrasi sistem payment gateway (Midtrans, Xendit) dan notifikasi WhatsApp API.',
      ],
      achievements: [
        'Meningkatkan kecepatan loading aplikasi admin sebesar 65% melalui optimasi query dan code splitting.',
      ],
      technologies: ['Laravel', 'PHP', 'React', 'MySQL', 'PostgreSQL', 'Tailwind CSS', 'Git'],
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
      sort_order: 2,
    },
    {
      id: 'exp_3',
      position: 'Junior Frontend Developer',
      company: 'Inovasi Cipta Kreatif',
      location: 'Bandung, Indonesia',
      employment_type: 'Contract',
      start_date: '2021',
      end_date: '2022',
      is_current: false,
      description: 'Membangun komponen antarmuka web responsif dan integrasi data frontend dengan backend API.',
      responsibilities: [
        'Membuat slice desain Figma menjadi kode HTML/CSS/JavaScript dan komponen React yang pixel-perfect.',
        'Memastikan kompatibilitas lintas browser dan performa mobile yang lancar.',
      ],
      achievements: [
        'Berkontribusi dalam 6 proyek landing page dan web app korporat dengan feedback kepuasan klien 98%.',
      ],
      technologies: ['JavaScript', 'React', 'CSS3', 'Tailwind CSS', 'Figma', 'Git'],
      logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=200',
      sort_order: 3,
    },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'DPos — Point of Sale System',
      slug: 'dpos-point-of-sale',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&q=80&w=800',
      description: 'Aplikasi kasir modern berbasis cloud untuk UMKM dengan manajemen inventaris dan analitik real-time.',
      long_description: 'DPos adalah sistem Point of Sale komprehensif yang dirancang untuk toko retail dan F&B modern. Dilengkapi dengan manajemen kasir multi-cabang, cetak struk thermal via Bluetooth/USB, pemantauan stok otomatis, laporan laba rugi instan, serta integrasi QRIS dinamis.',
      category: 'POS',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS'],
      year: '2024',
      client: 'Retail & Kafe UMKM',
      project_url: 'https://dpos-demo.delvandriawan.dev',
      github_url: 'https://github.com/delvandriawan/dpos-system',
      status: 'Completed',
      is_featured: true,
      problem: 'Pemilik usaha kecil kesulitan mencatat transaksi penjualan secara rapi, sering mengalami selisih stok barang, dan tidak memiliki laporan keuangan yang akurat.',
      solution: 'Membangun aplikasi POS ringan yang dapat diakses dari tablet maupun laptop kasir, dengan sinkronisasi data instan ke cloud dan peringatan otomatis saat stok menipis.',
      features: [
        'Transaksi kasir super cepat dengan shortcut keyboard dan scanner barcode',
        'Manajemen stok bahan baku dan peringatan stok menipis',
        'Pembayaran tunai, transfer, dan QRIS otomatis',
        'Laporan penjualan harian, mingguan, dan margin keuntungan',
        'Role-based access control untuk kasir, supervisor, dan pemilik',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      ],
      sort_order: 1,
    },
    {
      id: 'proj_2',
      name: 'EduSmart — Learning Management System',
      slug: 'edusmart-lms-platform',
      thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
      description: 'Platform edukasi daring terpadu untuk sekolah dan bimbel dengan kelas virtual dan evaluasi terstruktur.',
      long_description: 'EduSmart mempermudah proses belajar mengajar antara guru dan siswa dengan fitur materi pembelajaran multi-format, kuis interaktif dengan timer, forum diskusi per kelas, serta sistem penilaian otomatis.',
      category: 'Education',
      technologies: ['Laravel', 'PHP', 'React', 'MySQL', 'Tailwind CSS'],
      year: '2023',
      client: 'Yayasan Pendidikan Smart',
      project_url: 'https://edusmart-demo.delvandriawan.dev',
      github_url: 'https://github.com/delvandriawan/edusmart-lms',
      status: 'Completed',
      is_featured: true,
      problem: 'Proses pengumpulan tugas dan pembagian materi belajar masih menggunakan grup chat yang berantakan dan sulit dievaluasi secara terukur.',
      solution: 'Mengembangkan portal LMS intuitif yang mudah digunakan oleh guru non-teknis dan siswa dari smartphone.',
      features: [
        'Modul materi video, PDF, dan link eksternal yang terstruktur per bab',
        'Kuis interaktif anti-kecurangan dengan pengacakan soal',
        'Rekap absensi online dan export nilai ke format Excel',
        'Notifikasi tenggat waktu tugas via WhatsApp Webhook',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      ],
      sort_order: 2,
    },
    {
      id: 'proj_3',
      name: 'FinTrack — Smart Cashflow & Budgeting',
      slug: 'fintrack-personal-finance',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
      description: 'Aplikasi pencatatan keuangan pribadi dan visualisasi cash flow dengan proyeksi tabungan masa depan.',
      long_description: 'FinTrack dirancang untuk membantu profesional muda dan freelancer melacak pengeluaran harian, mengelompokkan pos anggaran (budgeting 50/30/20), serta memantau target finansial dengan grafik interaktif.',
      category: 'Finance',
      technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS', 'Express'],
      year: '2024',
      client: 'Personal & Public SaaS',
      project_url: 'https://fintrack.delvandriawan.dev',
      github_url: 'https://github.com/delvandriawan/fintrack-app',
      status: 'Completed',
      is_featured: true,
      problem: 'Banyak orang tidak tahu ke mana uang mereka habis di akhir bulan karena pencatatan manual sering terabaikan.',
      solution: 'Membangun antarmuka input cepat 3-detik, pengenalan otomatis kategori pengeluaran, dan grafik visual yang mudah dibaca.',
      features: [
        'Input transaksi kilat dengan pilihan kategori visual',
        'Alokasi batas anggaran (budget limits) dengan alert ketika mendekati batas',
        'Visualisasi arus kas masuk vs keluar berbasis grafik dinamis',
        'Fitur multi-rekening (Tabungan, E-Wallet, Dompet Tunai)',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
      ],
      sort_order: 3,
    },
    {
      id: 'proj_4',
      name: 'KlinikSehat — Health Center Management',
      slug: 'kliniksehat-ehr-management',
      thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      description: 'Sistem informasi manajemen klinik terintegrasi rekam medis elektronik (RME) dan pendaftaran pasien.',
      long_description: 'Aplikasi klinik terstandarisasi yang mencakup registrasi antrean pasien, pemeriksaan dokter dengan format SOAP, resep obat elektronik langsung ke bagian farmasi, dan billing kasir klinik.',
      category: 'Web Application',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
      year: '2023',
      client: 'Klinik Pratama Sehat Mandiri',
      project_url: 'https://kliniksehat.delvandriawan.dev',
      github_url: 'https://github.com/delvandriawan/kliniksehat-system',
      status: 'Completed',
      is_featured: false,
      problem: 'Antrean klinik sering menumpuk di meja pendaftaran dan pencarian berkas rekam medis kertas memakan waktu dokter.',
      solution: 'Digitalisasi alur operasional klinik dari antrean mandiri hingga resep farmasi tanpa kertas (paperless).',
      features: [
        'Nomor antrean poli dokter terpanggil otomatis lewat layar tunggu',
        'Form Rekam Medis Elektronik dengan riwayat alergi dan diagnosa ICD-10',
        'Manajemen stok obat farmasi dengan batas kadaluarsa',
        'Cetak kwitansi dan laporan rujukan pasien',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      ],
      sort_order: 4,
    },
  ],
  skills: [
    { id: 'sk_1', name: 'React.js', category: 'Frontend', level: 'Expert', percentage: 92, sort_order: 1, status: 'active' },
    { id: 'sk_2', name: 'TypeScript', category: 'Frontend', level: 'Advanced', percentage: 88, sort_order: 2, status: 'active' },
    { id: 'sk_3', name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', percentage: 95, sort_order: 3, status: 'active' },
    { id: 'sk_4', name: 'JavaScript (ES6+)', category: 'Frontend', level: 'Expert', percentage: 92, sort_order: 4, status: 'active' },
    { id: 'sk_5', name: 'PHP', category: 'Backend', level: 'Expert', percentage: 90, sort_order: 5, status: 'active' },
    { id: 'sk_6', name: 'Laravel', category: 'Backend', level: 'Expert', percentage: 90, sort_order: 6, status: 'active' },
    { id: 'sk_7', name: 'Node.js & Express', category: 'Backend', level: 'Advanced', percentage: 86, sort_order: 7, status: 'active' },
    { id: 'sk_8', name: 'RESTful APIs', category: 'Backend', level: 'Expert', percentage: 92, sort_order: 8, status: 'active' },
    { id: 'sk_9', name: 'MySQL', category: 'Database', level: 'Expert', percentage: 90, sort_order: 9, status: 'active' },
    { id: 'sk_10', name: 'PostgreSQL', category: 'Database', level: 'Advanced', percentage: 84, sort_order: 10, status: 'active' },
    { id: 'sk_11', name: 'Git & GitHub', category: 'Tools', level: 'Expert', percentage: 92, sort_order: 11, status: 'active' },
    { id: 'sk_12', name: 'Figma to Code', category: 'Tools', level: 'Advanced', percentage: 86, sort_order: 12, status: 'active' },
    { id: 'sk_13', name: 'Docker', category: 'Tools', level: 'Intermediate', percentage: 76, sort_order: 13, status: 'active' },
    { id: 'sk_14', name: 'Vibe Coding & AI Workflows', category: 'AI & Vibe Coding', level: 'Expert', percentage: 94, sort_order: 14, status: 'active' },
    { id: 'sk_15', name: 'Gemini / Claude APIs', category: 'AI & Vibe Coding', level: 'Advanced', percentage: 88, sort_order: 15, status: 'active' },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Menjadi Fullstack Web Developer Expert',
      issuer: 'Dicoding Indonesia',
      issue_date: '2023',
      credential_url: 'https://dicoding.com/certificates/fullstack-expert',
      description: 'Program komprehensif mencakup arsitektur microservices, clean code, TDD, dan secure authentication.',
    },
    {
      id: 'cert_2',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      issue_date: '2024',
      credential_url: 'https://aws.amazon.com/certification/certified-cloud-practitioner',
      description: 'Validasi pemahaman mendalam tentang infrastruktur cloud AWS, keamanan data, dan scalable hosting.',
    },
    {
      id: 'cert_3',
      name: 'Belajar Fundamental Aplikasi Web dengan React',
      issuer: 'Dicoding Indonesia',
      issue_date: '2022',
      credential_url: 'https://dicoding.com/certificates/react-fundamental',
      description: 'Penguasaan React component lifecycle, state management, custom hooks, dan modular architecture.',
    },
  ],
  cvs: [
    {
      id: 'cv_main',
      name: 'Delv Andriawan - Freelancer Resume (ATS)',
      professional_title: 'Freelancer',
      summary: 'Freelancer berpengalaman lebih dari 4 tahun dalam merancang dan mengembangkan aplikasi web skalabel, website bisnis, dan solusi sistem informasi menggunakan React, Node.js, PHP/Laravel, dan MySQL. Terampil dalam integrasi API, optimasi performa web, serta memberikan solusi digital berkualitas tinggi untuk berbagai klien.',
      email: 'delv.andriawan@gmail.com',
      phone: '+62 812-3456-7890',
      location: 'Bandung & Jakarta, Indonesia',
      website: 'https://delvandriawan.dev',
      linkedin: 'https://linkedin.com/in/delvandriawan',
      github: 'https://github.com/delvandriawan',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      template: 'ats_modern',
      is_active: true,
      experiences: [
        {
          id: 'cve_1',
          position: 'Senior Fullstack Developer',
          company: 'Nusantara Digital Solutions',
          location: 'Bandung / Remote',
          start_date: '2024',
          end_date: 'Sekarang',
          description: 'Memimpin perancangan dan deployment aplikasi web POS, ERP UMKM, dan platform digital berbasis cloud.',
          responsibilities: [
            'Mengembangkan sistem cloud POS berkinerja tinggi menggunakan React, Express, dan MySQL.',
            'Menerapkan automated code review dan arsitektur database teroptimasi dengan latensi rendah.',
            'Membimbing tim junior dalam implementasi Clean Architecture dan component design system.',
          ],
        },
        {
          id: 'cve_2',
          position: 'Web Developer',
          company: 'PT Solusi Teknologi Nusantara',
          location: 'Jakarta Selatan',
          start_date: '2022',
          end_date: '2024',
          description: 'Mengembangkan portal ERP internal dan RESTful API untuk melayani kebutuhan operasional multi-cabang.',
          responsibilities: [
            'Membangun modul inventory tracking dan reporting otomatis menggunakan Laravel dan PostgreSQL.',
            'Mengintegrasikan payment gateway Midtrans dan notifikasi WhatsApp API untuk 10.000+ transaksi bulanan.',
          ],
        },
        {
          id: 'cve_3',
          position: 'Junior Frontend Developer',
          company: 'Inovasi Cipta Kreatif',
          location: 'Bandung',
          start_date: '2021',
          end_date: '2022',
          description: 'Mengonversi desain UI/UX Figma menjadi kode web yang responsif, aksesibel, dan teruji lintas perangkat.',
        },
      ],
      educations: [
        {
          id: 'cved_1',
          institution: 'Universitas Komputer Indonesia (UNIKOM)',
          degree: 'Sarjana Komputer (S1)',
          field: 'Teknik Informatika',
          start_year: '2020',
          end_year: '2024',
          description: 'IPK 3.84 / 4.00. Fokus Software Engineering, Cloud Systems, dan Web Architecture.',
        },
        {
          id: 'cved_2',
          institution: 'SMKN 4 Bandung',
          degree: 'SMK',
          field: 'Rekayasa Perangkat Lunak',
          start_year: '2017',
          end_year: '2020',
          description: 'Fokus algoritma pemrograman, basis data relasional, dan web development.',
        },
      ],
      skills: [
        { id: 'cvs_1', skill: 'React.js & TypeScript', level: 'Expert', category: 'Frontend' },
        { id: 'cvs_2', skill: 'Tailwind CSS', level: 'Expert', category: 'Frontend' },
        { id: 'cvs_3', skill: 'PHP & Laravel', level: 'Expert', category: 'Backend' },
        { id: 'cvs_4', skill: 'Node.js & Express', level: 'Advanced', category: 'Backend' },
        { id: 'cvs_5', skill: 'MySQL & PostgreSQL', level: 'Expert', category: 'Database' },
        { id: 'cvs_6', skill: 'Git, Docker & CI/CD', level: 'Advanced', category: 'DevOps & Tools' },
        { id: 'cvs_7', skill: 'Vibe Coding & AI Prompting', level: 'Expert', category: 'AI Tools' },
      ],
      projects: [
        {
          id: 'cvp_1',
          name: 'DPos — Point of Sale System',
          description: 'Aplikasi kasir cloud lengkap dengan inventory management, QRIS dynamic, dan analitik penjualan UMKM.',
          technologies: ['React', 'TypeScript', 'Express', 'MySQL', 'Tailwind'],
          project_url: 'https://dpos-demo.delvandriawan.dev',
        },
        {
          id: 'cvp_2',
          name: 'EduSmart — Learning Management System',
          description: 'Platform e-learning untuk manajemen kelas virtual, tugas, dan kuis otomatis.',
          technologies: ['Laravel', 'React', 'MySQL', 'Tailwind CSS'],
          project_url: 'https://edusmart-demo.delvandriawan.dev',
        },
        {
          id: 'cvp_3',
          name: 'FinTrack — Cashflow & Budgeting',
          description: 'Aplikasi pelacak keuangan pribadi cerdas dengan visualisasi grafik cashflow.',
          technologies: ['React', 'TypeScript', 'Chart.js', 'Express'],
          project_url: 'https://fintrack.delvandriawan.dev',
        },
      ],
      certifications: [
        { id: 'cvc_1', name: 'Fullstack Web Developer Expert', issuer: 'Dicoding Indonesia', date: '2023' },
        { id: 'cvc_2', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024' },
      ],
      languages: [
        { id: 'cvl_1', language: 'Bahasa Indonesia', level: 'Native / Penutur Asli' },
        { id: 'cvl_2', language: 'English', level: 'Professional Working Proficiency' },
      ],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z',
    },
  ],
  settings: {
    general: {
      portfolio_name: 'Delv Andriawan Portfolio',
      website_title: 'Delv Andriawan — Freelancer Portfolio',
      description: 'Portfolio pribadi Delv Andriawan yang berisi profil, pengalaman, projek, skill dan CV.',
      logo: '',
      favicon: '',
    },
    social: {
      github: 'https://github.com/delvandriawan',
      linkedin: 'https://linkedin.com/in/delvandriawan',
      instagram: 'https://instagram.com/delvandriawan',
      facebook: '',
      youtube: '',
      whatsapp: 'https://wa.me/6281234567890',
      email: 'delv.andriawan@gmail.com',
      website: 'https://delvandriawan.dev',
    },
    seo: {
      meta_title: 'Delv Andriawan — Freelancer Portfolio',
      meta_description: 'Portfolio pribadi Delv Andriawan yang berisi profil, pengalaman, projek, skill dan CV.',
      og_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
    },
  },
  messages: [
    {
      id: 'msg_1',
      name: 'Rian Pratama',
      email: 'rian.pratama@techcompany.id',
      phone: '+62 813-9876-5432',
      subject: 'Penawaran Projek Custom ERP & POS',
      message: 'Halo Mas Delv, kami tertarik dengan portofolio DPos Anda. Kami berencana membangun sistem kasir dan inventaris untuk jaringan 5 outlet kami di Bandung. Apakah bersedia untuk meeting diskusi scope kerja?',
      status: 'unread',
      created_at: '2026-03-10T14:32:00Z',
    },
    {
      id: 'msg_2',
      name: 'Sarah Wijaya',
      email: 'sarah.recruitment@innovate.co',
      phone: '+62 821-4433-2211',
      subject: 'Peluang Senior Fullstack Developer (Remote/Hybrid)',
      message: 'Selamat siang Delv, profil LinkedIn dan portofolio Anda sangat cocok dengan kebutuhan posisi Senior Fullstack Developer di tim produk kami. Mohon kesediaannya jika ada waktu luang untuk interview.',
      status: 'read',
      created_at: '2026-02-28T09:15:00Z',
    },
  ],
  analytics: {
    views_count: 328,
    downloads_count: 54,
    last_updated: '2026-03-20T10:00:00Z',
  },
};

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  } else {
    // Automatic migration: hash legacy plain text password in database if present
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.user && parsed.user.password && parsed.user.password.length < 32) {
        parsed.user.password = hashPassword(parsed.user.password);
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('DB password migration warning:', err);
    }
  }
}

function readDb(): any {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.messages) parsed.messages = INITIAL_DATA.messages;
    if (!parsed.analytics) parsed.analytics = INITIAL_DATA.analytics;
    if (!parsed.user.password) parsed.user.password = DEFAULT_ADMIN_PASSWORD_HASH;
    return parsed;
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data: typeof INITIAL_DATA) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure database on startup
ensureDbFile();

// ======================== API ROUTES ========================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ======================== TWO-FACTOR AUTH (2FA) OTP STORE ========================
interface OtpSession {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
}
const activeOtps = new Map<string, OtpSession>();

async function dispatchEmailOtp(targetEmail: string, code: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[2FA REAL DISPATCHER] Mempersiapkan pengiriman kode autentikasi ke: ${targetEmail}`);

  const db = readDb();
  const smtpConfig = {
    host: process.env.SMTP_HOST || db.settings?.smtp?.host || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || db.settings?.smtp?.port || 587),
    secure: process.env.SMTP_SECURE === 'true' || db.settings?.smtp?.secure === true,
    user: process.env.SMTP_USER || db.settings?.smtp?.user || '',
    pass: process.env.SMTP_PASS || db.settings?.smtp?.pass || '',
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Kode Autentikasi 2FA</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 32px; color: #f8fafc;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #020617; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <div style="background-color: #ea580c; padding: 24px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">Portofolio Delv Andriawan</h1>
          <p style="color: #ffedd5; margin: 4px 0 0 0; font-size: 13px;">Keamanan Autentikasi Dua Langkah (2FA)</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 16px 0;">Halo Administrator,</p>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
            Kami menerima permintaan masuk ke Dashboard Admin Portofolio untuk akun <strong>${targetEmail}</strong>. Gunakan kode verifikasi 6-digit di bawah ini untuk melanjutkan:
          </p>
          
          <div style="background-color: #0f172a; border-radius: 12px; border: 2px dashed #ea580c; padding: 20px; text-align: center; margin: 0 0 24px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #fb923c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Kode Autentikasi Anda</div>
            <div style="font-family: monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #ffffff;">${code}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Berlaku selama 10 menit</div>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
            Jangan berikan kode ini kepada siapapun demi keamanan sistem. Jika Anda tidak merasa melakukan upaya login, segera ubah kata sandi akun Anda.
          </p>
        </div>
        <div style="background-color: #0b0f19; padding: 16px 32px; text-align: center; border-top: 1px solid #1e293b;">
          <p style="color: #475569; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Delv Andriawan Portfolio Security System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (smtpConfig.user && smtpConfig.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Delv Andriawan Keamanan" <${smtpConfig.user}>`,
        to: targetEmail,
        subject: `[Kode Keamanan] ${code} adalah Kode Autentikasi Login Portofolio Anda`,
        text: `Kode verifikasi login portofolio Anda: ${code}. Berlaku selama 10 menit.`,
        html: htmlContent,
      });

      console.log(`[2FA OTP] Email nyata BERHASIL dikirim ke ${targetEmail}! Message ID:`, info.messageId);
      return { success: true };
    } catch (err: any) {
      console.error(`[2FA OTP SMTP ERROR]:`, err.message);
      return { success: false, error: err.message };
    }
  }

  // If SMTP not yet configured with user/pass, log dispatch notice securely
  console.log(`[2FA OTP DISPATCH NOTICE] Email ditujukan ke: ${targetEmail} (Untuk mengaktifkan pengiriman SMTP live ke inbox Gmail, isi SMTP User & Password/App Password di Admin Settings > Integrasi Email).`);
  return { success: true };
}

// Authentication endpoint - Direct Login (No OTP required)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  
  if (!email || !password || !db.user) {
    return res.status(401).json({
      success: false,
      message: 'Email dan kata sandi wajib diisi.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const dbEmail = (db.user.email || '').trim().toLowerCase();
  const matchesEmail = cleanEmail === dbEmail;
  const matchesPassword = verifyPassword(password, db.user.password);

  if (matchesEmail && matchesPassword) {
    // If password was stored in plain text legacy, upgrade it immediately to hash
    if (db.user.password !== hashPassword(password)) {
      db.user.password = hashPassword(password);
      writeDb(db);
    }

    const { password: _, ...safeUser } = db.user;
    const token = 'jwt_delv_admin_session_token_' + Date.now();

    return res.json({
      success: true,
      token,
      user: safeUser,
      message: 'Login berhasil! Selamat datang di Dashboard Admin.',
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Kredensial tidak valid. Silakan periksa kembali email dan kata sandi Anda.',
    });
  }
});

// Authentication endpoint - Step 2: Verify 6-digit OTP code sent to Email
app.post('/api/auth/verify-otp', (req, res) => {
  const tempSessionId = req.body.tempSessionId;
  const rawCode = req.body.code || req.body.otp;
  if (!tempSessionId || !rawCode) {
    return res.status(400).json({
      success: false,
      message: 'Sesi verifikasi dan kode autentikasi wajib disertakan.',
    });
  }

  const session = activeOtps.get(tempSessionId);
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Sesi verifikasi telah kedaluwarsa atau tidak valid. Silakan login kembali.',
    });
  }

  if (Date.now() > session.expiresAt) {
    activeOtps.delete(tempSessionId);
    return res.status(400).json({
      success: false,
      message: 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.',
    });
  }

  session.attempts += 1;
  if (session.attempts > 5) {
    activeOtps.delete(tempSessionId);
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan kode yang salah. Silakan lakukan login ulang.',
    });
  }

  const cleanInputCode = rawCode.toString().trim();
  if (cleanInputCode !== session.code) {
    return res.status(400).json({
      success: false,
      message: 'Kode autentikasi tidak sesuai. Silakan periksa email Anda kembali.',
    });
  }

  // Verification successful!
  activeOtps.delete(tempSessionId);
  const db = readDb();
  const { password: _, ...safeUser } = db.user;
  const token = 'jwt_delv_admin_session_token_' + Date.now();

  res.json({
    success: true,
    token,
    user: safeUser,
    message: 'Verifikasi dua langkah berhasil! Selamat datang di Dashboard Admin.',
  });
});

// Authentication endpoint - Resend OTP code
app.post('/api/auth/resend-otp', (req, res) => {
  const { tempSessionId } = req.body;
  if (!tempSessionId) {
    return res.status(400).json({
      success: false,
      message: 'Sesi tidak valid.',
    });
  }

  const session = activeOtps.get(tempSessionId);
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Sesi verifikasi telah kedaluwarsa. Silakan login kembali.',
    });
  }

  const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
  session.code = newOtpCode;
  session.expiresAt = Date.now() + 10 * 60 * 1000;
  session.attempts = 0;
  activeOtps.set(tempSessionId, session);

  const db = readDb();
  const isSmtpConfigured = !!(
    (process.env.SMTP_USER || db.settings?.smtp?.user) &&
    (process.env.SMTP_PASS || db.settings?.smtp?.pass)
  );

  dispatchEmailOtp(session.email, newOtpCode);

  res.json({
    success: true,
    smtpConfigured: isSmtpConfigured,
    fallbackCode: !isSmtpConfigured ? newOtpCode : undefined,
    message: isSmtpConfigured
      ? `Kode autentikasi baru telah dikirimkan ke email terdaftar (${session.email}). Silakan periksa email Anda.`
      : `Server SMTP belum dikonfigurasi. Gunakan kode darurat sementara atau hubungkan akun SMTP pengirim.`,
  });
});

// Direct SMTP configuration endpoint for quick setup during login or settings
app.post('/api/auth/configure-smtp', async (req, res) => {
  const { host, port, secure, user, pass, tempSessionId } = req.body;
  if (!user || !pass) {
    return res.status(400).json({
      success: false,
      message: 'Email pengirim dan kata sandi aplikasi (App Password) wajib diisi.',
    });
  }

  const db = readDb();
  if (!db.settings) db.settings = {} as any;
  db.settings.smtp = {
    host: host || 'smtp.gmail.com',
    port: Number(port || 587),
    secure: !!secure,
    user: user.trim(),
    pass: pass.trim(),
  };
  writeDb(db);

  let emailSent = false;
  let emailError = '';

  // If there is an active OTP session waiting, dispatch real email immediately
  if (tempSessionId && activeOtps.has(tempSessionId)) {
    const session = activeOtps.get(tempSessionId)!;
    const sendResult = await dispatchEmailOtp(session.email, session.code);
    emailSent = sendResult.success;
    emailError = sendResult.error || '';
  }

  res.json({
    success: true,
    emailSent,
    message: emailSent
      ? '✓ Pengaturan SMTP tersimpan dan email kode verifikasi 6-digit berhasil dikirim ke inbox Anda!'
      : emailError
        ? `Pengaturan SMTP tersimpan, namun pengiriman email gagal: ${emailError}. Pastikan menggunakan Google App Password 16 karakter.`
        : '✓ Pengaturan SMTP berhasil disimpan.',
  });
});

// SMTP Test Email Endpoint
app.post('/api/auth/test-email', async (req, res) => {
  const { host, port, secure, user, pass, recipient } = req.body;
  const db = readDb();
  const targetRecipient = recipient || db.user?.email || 'rayyan.abdi19@gmail.com';

  const smtpUser = user || process.env.SMTP_USER || db.settings?.smtp?.user;
  const smtpPass = pass || process.env.SMTP_PASS || db.settings?.smtp?.pass;
  const smtpHost = host || process.env.SMTP_HOST || db.settings?.smtp?.host || 'smtp.gmail.com';
  const smtpPort = Number(port || process.env.SMTP_PORT || db.settings?.smtp?.port || 587);
  const smtpSecure = secure !== undefined ? secure : (process.env.SMTP_SECURE === 'true' || db.settings?.smtp?.secure === true);

  if (!smtpUser || !smtpPass) {
    return res.status(400).json({
      success: false,
      message: 'Pengaturan SMTP belum lengkap: User (alamat email) dan Password/App Password wajib diisi.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    const info = await transporter.sendMail({
      from: `"Delv Andriawan Portfolio Security" <${smtpUser}>`,
      to: targetRecipient,
      subject: `[Uji Coba SMTP] Kode Autentikasi Login Portofolio (${testCode})`,
      text: `Ini adalah pesan uji coba pengiriman email dari Portofolio Delv Andriawan. Kode uji coba: ${testCode}. Pengaturan SMTP Anda berfungsi dengan baik!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="color: #ea580c; margin-top: 0;">✓ Uji Coba Pengiriman Email Berhasil!</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Server SMTP Anda berhasil terhubung dan siap mengirimkan kode autentikasi 2FA ke akun <strong>${targetRecipient}</strong>.</p>
          <div style="background: #1e293b; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <div style="font-size: 12px; color: #94a3b8;">Kode Uji Coba:</div>
            <div style="font-size: 32px; font-weight: bold; color: #22c55e; letter-spacing: 6px; font-family: monospace;">${testCode}</div>
          </div>
          <p style="color: #64748b; font-size: 11px; margin-bottom: 0;">Dikirim dari Delv Andriawan Portfolio Applet.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: `Email uji coba berhasil dikirim ke ${targetRecipient}! (Message ID: ${info.messageId})`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Gagal mengirim email: ${err.message}`,
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  const db = readDb();
  const { password: _, ...safeUser } = db.user;
  res.json({ user: safeUser });
});

// Update Admin Profile & Password with Secure Hashing
app.put('/api/auth/profile-password', (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const db = readDb();
  
  if (currentPassword) {
    const isCurrentValid = verifyPassword(currentPassword, db.user.password);
    if (!isCurrentValid) {
      return res.status(400).json({ success: false, message: 'Kata sandi lama yang Anda masukkan tidak sesuai.' });
    }
  }

  if (name && name.trim()) db.user.name = name.trim();
  if (email && email.trim()) db.user.email = email.trim();
  if (newPassword && newPassword.trim().length >= 4) {
    db.user.password = hashPassword(newPassword.trim());
  }
  
  writeDb(db);
  const { password: _, ...safeUser } = db.user;
  res.json({ success: true, message: 'Data akun admin dan kata sandi berhasil diperbarui!', user: safeUser });
});

// Get all portfolio data in one shot for public rendering - CRITICAL: NEVER leak user password
app.get('/api/data', (req, res) => {
  const db = readDb();
  const { password: _, ...safeUser } = db.user || {};
  res.json({
    ...db,
    user: safeUser,
  });
});

// --- Profile Endpoints ---
app.get('/api/profile', (req, res) => {
  const db = readDb();
  res.json(db.profile);
});

app.put('/api/profile', (req, res) => {
  const db = readDb();
  db.profile = { ...db.profile, ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.profile });
});

// --- Educations Endpoints ---
app.get('/api/educations', (req, res) => {
  const db = readDb();
  res.json(db.educations);
});

app.post('/api/educations', (req, res) => {
  const db = readDb();
  const newEdu = {
    id: 'edu_' + Date.now(),
    ...req.body,
    sort_order: req.body.sort_order || db.educations.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.educations.push(newEdu);
  writeDb(db);
  res.json({ success: true, data: newEdu });
});

app.put('/api/educations/:id', (req, res) => {
  const db = readDb();
  const index = db.educations.findIndex((e: any) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data pendidikan tidak ditemukan' });
  }
  db.educations[index] = { ...db.educations[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.educations[index] });
});

app.delete('/api/educations/:id', (req, res) => {
  const db = readDb();
  db.educations = db.educations.filter((e: any) => e.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Pendidikan berhasil dihapus' });
});

// --- Experiences Endpoints ---
app.get('/api/experiences', (req, res) => {
  const db = readDb();
  res.json(db.experiences);
});

app.post('/api/experiences', (req, res) => {
  const db = readDb();
  const newExp = {
    id: 'exp_' + Date.now(),
    ...req.body,
    sort_order: req.body.sort_order || db.experiences.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.experiences.push(newExp);
  writeDb(db);
  res.json({ success: true, data: newExp });
});

app.put('/api/experiences/:id', (req, res) => {
  const db = readDb();
  const index = db.experiences.findIndex((e: any) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data pengalaman tidak ditemukan' });
  }
  db.experiences[index] = { ...db.experiences[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.experiences[index] });
});

app.delete('/api/experiences/:id', (req, res) => {
  const db = readDb();
  db.experiences = db.experiences.filter((e: any) => e.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Pengalaman berhasil dihapus' });
});

// --- Projects Endpoints ---
app.get('/api/projects', (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
  const db = readDb();
  const slug = (req.body.name || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const newProject = {
    id: 'proj_' + Date.now(),
    slug,
    ...req.body,
    sort_order: req.body.sort_order || db.projects.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.projects.push(newProject);
  writeDb(db);
  res.json({ success: true, data: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const db = readDb();
  const index = db.projects.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data projek tidak ditemukan' });
  }
  db.projects[index] = { ...db.projects[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.projects[index] });
});

app.delete('/api/projects/:id', (req, res) => {
  const db = readDb();
  db.projects = db.projects.filter((p: any) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Projek berhasil dihapus' });
});

// --- Skills Endpoints ---
app.get('/api/skills', (req, res) => {
  const db = readDb();
  res.json(db.skills);
});

app.post('/api/skills', (req, res) => {
  const db = readDb();
  const newSkill = {
    id: 'sk_' + Date.now(),
    ...req.body,
    sort_order: req.body.sort_order || db.skills.length + 1,
    status: req.body.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.skills.push(newSkill);
  writeDb(db);
  res.json({ success: true, data: newSkill });
});

app.put('/api/skills/:id', (req, res) => {
  const db = readDb();
  const index = db.skills.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data skill tidak ditemukan' });
  }
  db.skills[index] = { ...db.skills[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.skills[index] });
});

app.delete('/api/skills/:id', (req, res) => {
  const db = readDb();
  db.skills = db.skills.filter((s: any) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Skill berhasil dihapus' });
});

// --- Certifications Endpoints ---
app.get('/api/certifications', (req, res) => {
  const db = readDb();
  res.json(db.certifications);
});

app.post('/api/certifications', (req, res) => {
  const db = readDb();
  const newCert = {
    id: 'cert_' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.certifications.push(newCert);
  writeDb(db);
  res.json({ success: true, data: newCert });
});

app.put('/api/certifications/:id', (req, res) => {
  const db = readDb();
  const index = db.certifications.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Sertifikasi tidak ditemukan' });
  }
  db.certifications[index] = { ...db.certifications[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.certifications[index] });
});

app.delete('/api/certifications/:id', (req, res) => {
  const db = readDb();
  db.certifications = db.certifications.filter((c: any) => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Sertifikasi berhasil dihapus' });
});

// --- CV Management Endpoints ---
app.get('/api/cvs', (req, res) => {
  const db = readDb();
  res.json(db.cvs);
});

app.get('/api/cvs/active', (req, res) => {
  const db = readDb();
  const activeCv = db.cvs.find((c: any) => c.is_active) || db.cvs[0];
  res.json(activeCv);
});

app.post('/api/cvs', (req, res) => {
  const db = readDb();
  const isFirst = db.cvs.length === 0;
  const newCv = {
    id: 'cv_' + Date.now(),
    ...req.body,
    is_active: req.body.is_active ?? isFirst,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (newCv.is_active) {
    db.cvs.forEach((c: any) => { c.is_active = false; });
  }
  db.cvs.push(newCv);
  writeDb(db);
  res.json({ success: true, data: newCv });
});

app.put('/api/cvs/:id', (req, res) => {
  const db = readDb();
  const index = db.cvs.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data CV tidak ditemukan' });
  }
  if (req.body.is_active) {
    db.cvs.forEach((c: any) => { c.is_active = false; });
  }
  db.cvs[index] = { ...db.cvs[index], ...req.body, updated_at: new Date().toISOString() };
  writeDb(db);
  res.json({ success: true, data: db.cvs[index] });
});

app.post('/api/cvs/:id/set-active', (req, res) => {
  const db = readDb();
  const index = db.cvs.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'CV tidak ditemukan' });
  }
  db.cvs.forEach((c: any) => { c.is_active = false; });
  db.cvs[index].is_active = true;
  writeDb(db);
  res.json({ success: true, data: db.cvs[index] });
});

app.delete('/api/cvs/:id', (req, res) => {
  const db = readDb();
  if (db.cvs.length <= 1) {
    return res.status(400).json({ success: false, message: 'Minimal harus ada 1 CV yang tersimpan.' });
  }
  db.cvs = db.cvs.filter((c: any) => c.id !== req.params.id);
  // Ensure at least one is active
  if (!db.cvs.some((c: any) => c.is_active) && db.cvs.length > 0) {
    db.cvs[0].is_active = true;
  }
  writeDb(db);
  res.json({ success: true, message: 'CV berhasil dihapus' });
});

// --- Settings Endpoints ---
app.get('/api/settings', (req, res) => {
  const db = readDb();
  const safeSettings = JSON.parse(JSON.stringify(db.settings || {}));
  // Never expose raw sensitive credentials in public/dashboard responses
  if (safeSettings.smtp) {
    safeSettings.smtp = {
      ...safeSettings.smtp,
      hasPass: !!safeSettings.smtp.pass,
      pass: safeSettings.smtp.pass ? '••••••••••••••••' : '',
    };
  }
  res.json(safeSettings);
});

app.put('/api/settings', (req, res) => {
  const db = readDb();
  const incoming = { ...req.body };
  // Preserve existing password if client sent the masked string
  if (incoming.smtp && incoming.smtp.pass === '••••••••••••••••') {
    incoming.smtp.pass = db.settings?.smtp?.pass || '';
  }
  db.settings = { ...db.settings, ...incoming };
  writeDb(db);
  
  const safeSettings = JSON.parse(JSON.stringify(db.settings || {}));
  if (safeSettings.smtp) {
    safeSettings.smtp = {
      ...safeSettings.smtp,
      hasPass: !!safeSettings.smtp.pass,
      pass: safeSettings.smtp.pass ? '••••••••••••••••' : '',
    };
  }
  res.json({ success: true, data: safeSettings });
});

// --- Image / Media Upload Endpoint ---
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, message: 'Data file tidak valid' });
    }

    // Extract base64 image data and save to public/uploads
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
      const cleanName = (filename || 'media')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .slice(0, 30);
      const uniqueFilename = `${Date.now()}_${cleanName}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, uniqueFilename);
      
      fs.writeFileSync(filePath, buffer);
      return res.json({
        success: true,
        url: `/uploads/${uniqueFilename}`,
        filename: uniqueFilename,
      });
    }

    // If already a hosted URL or relative path
    res.json({
      success: true,
      url: dataUrl,
      filename: filename || 'uploaded_image.png',
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengupload berkas: ' + err.message });
  }
});

// --- Contact Messages Endpoints (Inbox Kontak) ---
app.get('/api/messages', (req, res) => {
  const db = readDb();
  res.json(db.messages || []);
});

app.post('/api/messages', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Nama, email, dan pesan wajib diisi.' });
  }
  const db = readDb();
  if (!db.messages) db.messages = [];

  const newMsg = {
    id: 'msg_' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    subject: subject ? subject.trim() : 'Diskusi Projek',
    message: message.trim(),
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  db.messages.unshift(newMsg);
  writeDb(db);
  res.json({
    success: true,
    data: newMsg,
    message: 'Pesan Anda berhasil terkirim langsung ke admin Delv Andriawan. Terima kasih!',
  });
});

app.put('/api/messages/:id/read', (req, res) => {
  const db = readDb();
  if (!db.messages) db.messages = [];
  const msg = db.messages.find((m: any) => m.id === req.params.id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
  }
  msg.status = msg.status === 'read' ? 'unread' : 'read';
  writeDb(db);
  res.json({ success: true, data: msg });
});

app.delete('/api/messages/:id', (req, res) => {
  const db = readDb();
  if (!db.messages) db.messages = [];
  db.messages = db.messages.filter((m: any) => m.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Pesan berhasil dihapus' });
});

// --- Analytics Endpoints ---
app.get('/api/analytics', (req, res) => {
  const db = readDb();
  res.json(db.analytics || { views_count: 0, downloads_count: 0 });
});

app.post('/api/analytics/view', (req, res) => {
  const db = readDb();
  if (!db.analytics) db.analytics = { views_count: 0, downloads_count: 0 };
  db.analytics.views_count = (db.analytics.views_count || 0) + 1;
  db.analytics.last_updated = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, count: db.analytics.views_count });
});

app.post('/api/analytics/download-cv', (req, res) => {
  const db = readDb();
  if (!db.analytics) db.analytics = { views_count: 0, downloads_count: 0 };
  db.analytics.downloads_count = (db.analytics.downloads_count || 0) + 1;
  db.analytics.last_updated = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, count: db.analytics.downloads_count });
});

// --- Database Backup & Reset Endpoints ---
app.post('/api/database/reset', (req, res) => {
  writeDb(INITIAL_DATA);
  res.json({ success: true, message: 'Database portofolio berhasil dipulihkan ke pengaturan awal default.' });
});

app.get('/api/database/export', (req, res) => {
  const db = readDb();
  const { password: _, ...safeUser } = db.user || {};
  const sanitizedDb = {
    ...db,
    user: safeUser,
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="delv-portfolio-backup.json"');
  res.send(JSON.stringify(sanitizedDb, null, 2));
});

app.post('/api/database/import', (req, res) => {
  const incoming = req.body;
  if (!incoming || !incoming.profile || !incoming.user) {
    return res.status(400).json({ success: false, message: 'Format JSON database tidak sesuai skema portofolio.' });
  }
  const db = readDb();
  // Preserve existing hashed password if incoming export does not contain password
  if (!incoming.user.password) {
    incoming.user.password = db.user?.password || DEFAULT_ADMIN_PASSWORD_HASH;
  } else if (incoming.user.password.length < 32) {
    incoming.user.password = hashPassword(incoming.user.password);
  }
  writeDb(incoming);
  res.json({ success: true, message: 'Data portofolio berhasil diimpor sepenuhnya!' });
});

// ======================== VITE & SERVER SETUP ========================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Delv Andriawan Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
