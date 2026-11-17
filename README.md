# Cafe Fari

**Sistem pemesanan dan manajemen kafe berbasis web: pelanggan memindai QR di meja, memesan langsung dari ponsel, lalu kasir dan dapur memproses pesanan dari dashboard masing-masing.**

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success)

## Latar belakang

Pencatatan pesanan kafe secara manual rawan salah catat, antrean kasir menumpuk, dan tiket pesanan sering terlewat antara kasir dan dapur. Cafe Fari memindahkan alur itu ke satu sistem: setiap meja punya QR sendiri, pesanan pelanggan langsung masuk ke antrean kasir dan dapur, dan status masak serta pembayaran diperbarui di tempat.

Aplikasi ini memisahkan tampilan berdasarkan peran — pelanggan, kasir, dapur, dan super admin — sehingga setiap orang hanya melihat pekerjaannya. Data menu, opsi tambahan, meja, staf, dan transaksi dikelola dari panel admin.

## Tangkapan layar

| Login multi-role | Menu pelanggan (scan QR) |
| --- | --- |
| <img src="docs/screenshots/login.jpg" width="420" alt="Halaman login Cafe Fari dengan pilihan akses cepat"> | <img src="docs/screenshots/customer-menu.png" width="260" alt="Menu pelanggan Meja 1 di ponsel"> |

| Manajemen produk | QR code per meja |
| --- | --- |
| <img src="docs/screenshots/admin-products.png" width="460" alt="Tabel manajemen produk di panel admin"> | <img src="docs/screenshots/admin-qr.png" width="420" alt="Modal QR code Meja 1"> |

## Fitur utama

- **Pelanggan** — buka menu lewat QR meja, filter kategori, cari menu, pilih opsi (mis. level pedas) beserta harga tambahan, atur jumlah dan catatan, pilih metode pembayaran, lalu pantau status pesanan. Keranjang tersimpan di `localStorage` dan kedaluwarsa setelah 5 menit tidak aktif.
- **Kasir** — melihat antrean pesanan yang belum dibayar, mengubah item pesanan, memproses pembayaran, dan menelusuri riwayat transaksi.
- **Dapur** — melihat antrean masak, memperbarui status masakan (`QUEUED` → `COOKING` → `DONE`), riwayat, dan stok menu.
- **Super Admin** — CRUD produk beserta upload gambar dan grup opsi, CRUD meja dengan generator QR yang bisa dicetak, CRUD staf, ringkasan transaksi, serta detail pesanan.
- **Akses cepat demo** — tombol di halaman login untuk membuka panel Super Admin, Kasir, Dapur, dan Customer tanpa mengisi kredensial.

## Tech stack

| Lapisan | Teknologi | Versi |
| --- | --- | --- |
| Frontend | React | 19.2.0 |
| | React Router DOM | 7.12.0 |
| | Vite (`rolldown-vite`) | 7.2.5 |
| | Axios | 1.13.2 |
| | html5-qrcode / qrcode.react | 2.3.8 / 4.2.0 |
| Backend aktif | Python + FastAPI | 3.10+ (diuji 3.14.6) / 0.104.1 |
| | SQLAlchemy + Pydantic | 2.1.8 / 2.13.4 |
| | Uvicorn | 0.52.4 |
| Database | PostgreSQL | 14+ (diuji 18.6) |
| Backend alternatif | Express + Prisma (eksperimental) | 4.21.1 / 5.22.0 |

> **Status arsitektur:** frontend saat ini memanggil API FastAPI di `http://127.0.0.1:8000`. Folder `backend-node/` berisi migrasi backend ke Express + Prisma di port `3001`; backend tersebut belum dihubungkan ke frontend. `package.json` di root menjalankan `backend-node` + frontend, jadi jangan pakai `npm run dev` root untuk alur yang didokumentasikan di bawah.

## Struktur repositori

```text
cafe-fari-v1/
├── backend/                  # API aktif: FastAPI, SQLAlchemy, upload gambar
│   ├── app/
│   │   ├── core/             # hashing password
│   │   ├── models/           # tabel SQLAlchemy
│   │   ├── routers/          # endpoint products, users, tables, orders, options
│   │   ├── schemas/          # skema Pydantic
│   │   ├── database.py       # URL PostgreSQL & session
│   │   └── main.py           # entrypoint FastAPI + /login
│   ├── create_admin.py       # seeding akun admin
│   └── requirements.txt
├── backend-node/             # backend Express + Prisma (eksperimental)
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/       # UI per peran
│       ├── layouts/          # guard & shell per peran
│       ├── pages/            # halaman per peran
│       └── services/         # pemanggilan API
├── docs/screenshots/
└── package.json              # script dev monorepo (backend-node + frontend)
```

## Prasyarat

| Software | Versi minimum | Catatan |
| --- | --- | --- |
| Node.js | 20.19+ atau 22.12+ | Diuji pada Node 26.12.1 |
| npm | 10+ | Diuji pada npm 12.2.1 |
| Python | 3.10+ | Diuji pada Python 3.14.6 |
| PostgreSQL | 14+ | Diuji pada PostgreSQL 18.6 |
| Git | 2.40+ | — |

## Instalasi

### 1. Clone repositori

```bash
git clone https://github.com/faridev33/cafe-fari-v1.git
cd cafe-fari-v1
```

### 2. Siapkan backend FastAPI

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> `bcrypt` dikunci ke `4.0.1` karena `passlib 1.7.4` belum kompatibel dengan `bcrypt` 5.x.

### 3. Siapkan database PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE cafe_db;"
```

Sesuaikan kredensial pada [`backend/app/database.py`](backend/app/database.py#L6):

```python
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0909@127.0.0.1/cafe_db"
```

Formatnya `postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE`. Backend ini **tidak** membaca file `.env`; konfigurasi database ada di file tersebut.

### 4. Buat tabel dan akun admin

Tabel dibuat otomatis oleh `Base.metadata.create_all()` saat aplikasi pertama kali dijalankan — tidak ada langkah migrasi terpisah.

```bash
# masih di folder backend, virtualenv aktif
python create_admin.py
python -m uvicorn app.main:app --reload --port 8000
```

- API: <http://127.0.0.1:8000>
- Dokumentasi Swagger: <http://127.0.0.1:8000/docs>

### 5. Jalankan frontend

Buka terminal baru dari root repositori:

```bash
cd frontend
npm install
npm run dev
```

Buka <http://localhost:5173>.

> Frontend belum memakai variabel environment. URL API di-hardcode ke `http://127.0.0.1:8000` di `src/lib/axios.js`, `src/services/*.js`, dan beberapa halaman di `src/pages/`. Jika port backend diubah, semua referensi tersebut harus ikut diubah.

## Akun demo dan URL lokal

| Peran | Username | Password | Cara mendapatkan |
| --- | --- | --- | --- |
| Super Admin | `admin` | `admin123` | Dibuat oleh `python create_admin.py` |
| Kasir / Dapur / Waiter | — | — | Login sebagai admin → **Pengguna (Staff)** → tambah pengguna dan pilih role |
| Customer | — | — | Tanpa login; buka `/customer/menu/1` atau scan QR meja |

Halaman login juga menyediakan tombol **Akses Cepat (Demo/Dev)** untuk masuk ke panel Super Admin, Kasir, Dapur, dan Customer tanpa kredensial.

| Layanan | URL |
| --- | --- |
| Frontend | <http://localhost:5173> |
| Login | <http://localhost:5173/> |
| Menu pelanggan (Meja 1) | <http://localhost:5173/customer/menu/1> |
| API FastAPI | <http://127.0.0.1:8000> |
| Swagger / OpenAPI | <http://127.0.0.1:8000/docs> |
| Backend Express (eksperimental) | <http://127.0.0.1:3001> |

Ganti password bawaan sebelum aplikasi dipakai di luar lingkungan pengembangan.

## Environment variables

### Backend FastAPI (aktif)

Tidak memakai `.env`. Variabel yang relevan:

| Lokasi | Nilai default | Keterangan |
| --- | --- | --- |
| `backend/app/database.py` | `postgresql://postgres:0909@127.0.0.1/cafe_db` | Koneksi PostgreSQL |
| `backend/app/main.py` | port `8000` | Port diatur lewat argumen `uvicorn --port` |
| `backend/app/routers/product.py` | `static/images` | Folder upload gambar produk |
| `backend/app/routers/user.py` | `static/images` | Folder upload foto pengguna |

### Backend Express + Prisma (eksperimental)

Backend ini memakai `.env`. Salin contohnya:

```bash
cd backend-node
cp .env.example .env
```

| Variabel | Contoh | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:0909@127.0.0.1:5432/cafe_db?schema=public` | Koneksi PostgreSQL untuk Prisma |
| `PORT` | `3001` | Port server Express |
| `NODE_ENV` | `development` | Mode runtime |
| `UPLOAD_DIR` | `static/images` | Folder upload |
| `MAX_FILE_SIZE` | `5242880` | Batas ukuran upload (5 MB) |

Setup database untuk backend ini:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

`prisma/seed.ts` membuat akun `admin`/`admin123`, `cashier`/`cashier123`, `kitchen`/`kitchen123`, 10 meja, dan 8 produk contoh. Endpoint-nya berbeda dari FastAPI (mis. login di `POST /users/login`, bukan `POST /login`), sehingga tidak kompatibel langsung dengan frontend saat ini.

## Keamanan

- File `.env` dan `.env.*` sudah masuk [`.gitignore`](.gitignore) root; hanya `.env.example` yang ikut ter-commit.
- Password disimpan sebagai hash bcrypt (passlib). Jangan pernah commit kredensial database asli.
- **Batasan saat ini:** belum ada JWT/session token; backend tidak memverifikasi peran pada endpoint, dan frontend menyimpan peran di `localStorage`. Cocok untuk demo/internal, bukan untuk produksi publik.
- CORS FastAPI masih `allow_origins=["*"]` dan kredensial database masih hardcoded. Persempit origin dan pindahkan kredensial ke environment variable sebelum deploy.

## Verifikasi

```bash
# backend
curl http://127.0.0.1:8000/
curl -X POST http://127.0.0.1:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# frontend
cd frontend
npm run build
```

Respons login yang benar berisi `{"message":"Login Berhasil","username":"admin","role":"admin",...}`.

## Lisensi dan kontak

Belum ada lisensi open-source di repositori ini; kode berstatus **proprietary, all rights reserved** sampai lisensi resmi ditambahkan.

- Pembuat: **faridev33**
- Email: [faridev33@gmail.com](mailto:faridev33@gmail.com)
- GitHub: <https://github.com/faridev33>