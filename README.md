# QRIS Dinamis API

API REST untuk mengubah QRIS Statis menjadi QRIS Dinamis dengan nominal yang dapat disesuaikan. Cocok untuk UMKM, e-commerce, atau aplikasi yang membutuhkan pembayaran QRIS dengan nominal yang fleksibel.

## ✨ Fitur

- 🔄 Mengubah QRIS Statis menjadi QRIS Dinamis melalui REST API
- 💰 Mengatur nominal pembayaran sesuai kebutuhan
- 📱 Mendukung upload gambar QRIS dalam berbagai format
- 🖼️ Menghasilkan QRIS dalam bentuk file gambar atau buffer
- ⏰ Otomatis mengelola masa berlaku QRIS Dinamis
- 🔍 Endpoint untuk memeriksa informasi QRIS yang telah dibuat
- 🌐 CORS enabled untuk integrasi frontend

## 🚀 Instalasi dan Penggunaan

### Prasyarat
- Node.js versi 16 atau lebih baru
- npm atau yarn

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd qris-dinamis-api
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dan konfigurasi environment variables:
```env
PORT=3000
```

4. Jalankan server:
```bash
# Mode development (dengan auto-reload)
npm run dev

# Mode production
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 Dokumentasi API

### Base URL
```
http://localhost:3000/api
```

### 1. Health Check
Memeriksa status server API.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "OK",
  "message": "QRIS Dynamic API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Upload QRIS Statis
Upload gambar QRIS statis untuk diproses.

**Endpoint:** `POST /api/qris/upload`

**Content-Type:** `multipart/form-data`

**Body:**
- `qris` (file): File gambar QRIS statis (JPG, PNG, dll.)

**Contoh Request:**
```bash
curl -X POST \
  http://localhost:3000/api/qris/upload \
  -F "qris=@path/to/qris-image.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "uuid-generated-id",
    "qrisString": "00020101021126...",
    "message": "QRIS statis berhasil diproses"
  }
}
```

### 3. Generate QRIS Dinamis (File)
Membuat QRIS dinamis dengan nominal tertentu dan menyimpannya sebagai file.

**Endpoint:** `POST /api/qris/generate`

**Content-Type:** `application/json`

**Body:**
```json
{
  "qrisId": "uuid-from-upload-response",
  "nominal": 50000
}
```

**Contoh Request:**
```bash
curl -X POST \
  http://localhost:3000/api/qris/generate \
  -H "Content-Type: application/json" \
  -d '{
    "qrisId": "your-qris-id",
    "nominal": 50000
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "generated-qris-id",
    "nominal": 50000,
    "expirationTime": 1704110400000,
    "message": "QRIS dinamis berhasil dibuat"
  }
}
```

### 4. Generate QRIS Dinamis (Buffer)
Membuat QRIS dinamis dan langsung mengembalikan file gambar.

**Endpoint:** `POST /api/qris/generate-buffer`

**Content-Type:** `application/json`

**Body:**
```json
{
  "qrisId": "uuid-from-upload-response",
  "nominal": 75000
}
```

**Response:** File gambar PNG (binary data)

**Contoh Request:**
```bash
curl -X POST \
  http://localhost:3000/api/qris/generate-buffer \
  -H "Content-Type: application/json" \
  -d '{
    "qrisId": "your-qris-id",
    "nominal": 75000
  }' \
  --output qris-dinamis.png
```

### 5. Download QRIS File
Mengunduh file QRIS yang telah dibuat sebelumnya.

**Endpoint:** `GET /api/qris/:id`

**Response:** File gambar QRIS

**Contoh Request:**
```bash
curl -X GET \
  http://localhost:3000/api/qris/your-qris-id \
  --output downloaded-qris.png
```

### 6. Informasi QRIS
Mendapatkan informasi QRIS tanpa mengunduh file.

**Endpoint:** `GET /api/qris/:id/info`

**Response:**
```json
{
  "success": true,
  "data": {
    "qrisId": "your-qris-id",
    "nominal": 50000,
    "expirationTime": 1704110400000,
    "generatedAt": 1704108600000,
    "isExpired": false
  }
}
```

## 🔧 Contoh Penggunaan Lengkap

### Menggunakan cURL

1. **Upload QRIS Statis:**
```bash
curl -X POST \
  http://localhost:3000/api/qris/upload \
  -F "qris=@qris-statis.jpg"
```

2. **Generate QRIS Dinamis:**
```bash
curl -X POST \
  http://localhost:3000/api/qris/generate \
  -H "Content-Type: application/json" \
  -d '{
    "qrisId": "hasil-dari-upload",
    "nominal": 100000
  }'
```

### Menggunakan JavaScript (Frontend)

```javascript
// Upload QRIS Statis
const uploadQRIS = async (file) => {
  const formData = new FormData();
  formData.append('qris', file);
  
  const response = await fetch('/api/qris/upload', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};

// Generate QRIS Dinamis
const generateDynamicQRIS = async (qrisId, nominal) => {
  const response = await fetch('/api/qris/generate-buffer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ qrisId, nominal })
  });
  
  return await response.blob(); // Untuk mendapatkan gambar
};
```

### Menggunakan Python

```python
import requests

# Upload QRIS Statis
def upload_qris(file_path):
    with open(file_path, 'rb') as f:
        files = {'qris': f}
        response = requests.post('http://localhost:3000/api/qris/upload', files=files)
    return response.json()

# Generate QRIS Dinamis
def generate_dynamic_qris(qris_id, nominal):
    data = {'qrisId': qris_id, 'nominal': nominal}
    response = requests.post('http://localhost:3000/api/qris/generate', json=data)
    return response.json()
```

## 📘 Tentang Modul qrDinamis.js

File `qrDinamis.js` adalah modul inti yang menyediakan fungsi-fungsi untuk mengubah QRIS statis menjadi dinamis:

### Fungsi Utama:
- `qrisDinamis(qrstring, nominal, path)`: Membuat QRIS dinamis dan menyimpan sebagai file
- `qrisDinamisBuffer(qrstring, nominal)`: Membuat QRIS dinamis dalam bentuk buffer
- `toCRC16(str)`: Fungsi helper untuk menghitung checksum CRC16

### Cara Kerja:
1. Mengambil string QRIS statis
2. Mengubah format dari statis (010211) menjadi dinamis (010212)
3. Menambahkan informasi nominal ke dalam string QRIS
4. Menghitung ulang checksum CRC16
5. Menghasilkan QR Code baru dengan nominal yang ditentukan

## ⚠️ Catatan Penting

- **Format Input**: Pastikan gambar QRIS yang diupload jelas dan tidak blur
- **Nominal**: Masukkan nominal dalam bentuk angka (contoh: 50000 untuk Rp 50.000)
- **Masa Berlaku**: QRIS dinamis memiliki masa berlaku sesuai konfigurasi server
- **File Management**: Server akan otomatis membersihkan file temporary yang sudah kadaluarsa
- **Error Handling**: Semua endpoint dilengkapi dengan error handling yang informatif

## 🔒 Keamanan

- Validasi input pada semua endpoint
- Sanitasi file upload untuk mencegah malicious files
- Rate limiting (dapat dikonfigurasi)
- CORS configuration untuk kontrol akses

## 🚀 Deployment

### Menggunakan PM2
```bash
npm install -g pm2
pm2 start server.js --name "qris-api"
```

### Menggunakan Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -am 'Menambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

## 📝 Lisensi

[MIT License](LICENSE)

## 📞 Dukungan

Jika mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.
