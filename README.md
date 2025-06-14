# QRIS Dinamis REST API

API REST untuk menggenerate QRIS dinamis dengan nominal yang dapat disesuaikan. Sistem ini memungkinkan upload gambar QRIS statis dan mengkonversinya menjadi QRIS dinamis dengan nominal yang ditambahkan digit acak.

## 🚀 Fitur Utama

- **Upload QRIS Statis**: Upload gambar QRIS untuk diproses
- **Generate QRIS Dinamis**: Buat QRIS dengan nominal yang disesuaikan
- **Digit Acak**: Otomatis menambahkan 3 digit acak di belakang nominal
- **Session Management**: Sistem berbasis UUID untuk tracking QRIS
- **Auto Cleanup**: File otomatis terhapus setelah 30 menit
- **Error Handling**: Penanganan error yang komprehensif
- **CORS Support**: Mendukung cross-origin requests

## 📋 Persyaratan

- Node.js 18+ 
- NPM atau Yarn
- Git

## 🛠️ Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/Pendetot/Qris-Dinamis.git
   cd Qris-Dinamis
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Server**
   ```bash
   npm start
   ```

   Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Health Check
```http
GET /api/health
```
Mengecek status server.

**Response:**
```json
{
  "status": "OK",
  "message": "QRIS Dynamic API is running",
  "timestamp": "2025-06-14T14:21:54.482Z"
}
```

### Upload QRIS Statis
```http
POST /api/qris/upload
Content-Type: multipart/form-data
```

**Body:**
- `qris`: File gambar QRIS (JPG, PNG, dll)

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "uuid-string",
    "message": "QRIS berhasil dibaca dan siap untuk generate dinamis"
  }
}
```

### Generate QRIS Dinamis
```http
POST /api/qris/generate
Content-Type: application/json
```

**Body:**
```json
{
  "qrisId": "uuid-dari-upload",
  "nominal": 10000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "uuid-string",
    "nominal": 10000123,
    "expirationTime": 1718374914482,
    "message": "QRIS Dinamis berhasil dibuat dengan nominal Rp 10.000.123"
  }
}
```

### Download QRIS
```http
GET /api/qris/:id
```
Download file QRIS yang sudah di-generate.

### Info QRIS
```http
GET /api/qris/:id/info
```
Mendapatkan informasi QRIS tanpa download file.

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "uuid-string",
    "nominal": 10000123,
    "expirationTime": 1718374914482,
    "generatedAt": 1718374614482,
    "isExpired": false
  }
}
```

### Generate QRIS sebagai Buffer
```http
POST /api/qris/generate-buffer
Content-Type: application/json
```

**Body:**
```json
{
  "qrisId": "uuid-dari-upload",
  "nominal": 10000
}
```

**Response:** File gambar PNG

## 🎯 Cara Penggunaan

1. **Upload QRIS Statis**
   - Kirim gambar QRIS ke endpoint `/api/qris/upload`
   - Simpan `qrisId` yang dikembalikan

2. **Generate QRIS Dinamis**
   - Kirim `qrisId` dan `nominal` ke `/api/qris/generate`
   - Sistem akan menambahkan 3 digit acak di belakang nominal

3. **Download QRIS**
   - Akses `/api/qris/:id` untuk download file
   - Atau gunakan `/api/qris/:id/info` untuk info saja

## 🧪 Testing

Buka `test.html` di browser untuk interface testing yang interaktif, atau gunakan curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Upload QRIS (ganti dengan path file yang sesuai)
curl -X POST -F "qris=@qris-sample.jpg" http://localhost:3000/api/qris/upload

# Generate QRIS dinamis
curl -X POST -H "Content-Type: application/json"   -d '{"qrisId":"your-qris-id","nominal":50000}'   http://localhost:3000/api/qris/generate
```

## 📁 Struktur Project

```
├── server.js              # Server utama Express.js
├── package.json           # Dependencies dan scripts
├── qrDinamis.js           # Logic QRIS original
├── test.html              # Interface testing
├── routes/
│   └── qris.js            # Route handlers API
├── services/
│   ├── qrisService.js     # Business logic QRIS
│   └── qrReaderService.js # Service baca QR code
├── middleware/
│   ├── upload.js          # Handling upload file
│   └── errorHandler.js    # Error handling
└── uploads/               # Temporary file storage
```

## ⚙️ Konfigurasi

### Environment Variables
Buat file `.env` untuk konfigurasi:

```env
PORT=3000
NODE_ENV=production
```

### File Upload
- **Maksimal ukuran**: 5MB
- **Format yang didukung**: JPG, PNG, GIF, BMP
- **Lokasi upload**: `uploads/` directory

## 🔒 Keamanan

- Validasi file upload (hanya gambar)
- Pembatasan ukuran file
- Auto cleanup file temporary
- Error handling yang aman
- CORS protection

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Opsional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 Changelog

### v2.0.0 (2025-06-14)
- ✅ Konversi dari Telegram Bot ke REST API
- ✅ Tambah Express.js server
- ✅ Implementasi file upload dengan multer
- ✅ Session management dengan UUID
- ✅ Auto cleanup expired files
- ✅ Comprehensive error handling
- ✅ Test interface HTML

### v1.0.0
- ✅ Telegram Bot untuk QRIS dinamis
- ✅ QR code reading dan generation
- ✅ Random digit generation

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🆘 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Cek [Issues](https://github.com/Pendetot/Qris-Dinamis/issues) yang sudah ada
2. Buat issue baru jika diperlukan
3. Sertakan detail error dan langkah reproduksi

## 🙏 Acknowledgments

- [QRCode](https://www.npmjs.com/package/qrcode) - QR code generation
- [QRCode-Reader](https://www.npmjs.com/package/qrcode-reader) - QR code reading
- [Jimp](https://www.npmjs.com/package/jimp) - Image processing
- [Express.js](https://expressjs.com/) - Web framework
- [Multer](https://www.npmjs.com/package/multer) - File upload handling

---

**Dibuat dengan ❤️ untuk kemudahan transaksi QRIS dinamis**
