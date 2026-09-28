# Penempatan tur 360°

Di **Admin → Concierge & 360°**, pilih cabang dan panorama. Pada **Penempatan panorama**, pilih:

- **Umum hotel**: tampil pada bagian tur umum halaman hotel.
- **Kamar tertentu**: pilih kamar milik cabang tersebut. Tombol 360° hanya tampil untuk kamar itu, pada carousel kamar dan daftar kamar hotel.
- **Fasilitas tertentu**: pilih fasilitas milik cabang tersebut. Tombol 360° hanya tampil pada kartu fasilitas itu.

Aktifkan **Publikasikan sesuai penempatan dan di beranda**, lalu **Simpan tur**. Seluruh tur yang dipublikasikan juga tersedia di galeri beranda (`/id#virtual-tours` atau `/en#virtual-tours`), dengan pilihan cabang dan kategori. Tombol booking selalu menuju hotel pemilik tur.

Beberapa panorama dapat ditempatkan pada kamar/fasilitas yang sama. Urutan pertama menjadi titik masuk; panorama berikutnya dapat dipilih di viewer. Hotspot hanya aktif di antara panorama dengan penempatan yang sama. Tautan lama ke penempatan lain tetap tersimpan, tetapi disembunyikan dari viewer.

## Data lama

Tidak perlu migrasi SQL tambahan. Penempatan disimpan dalam properti `placement` pada setiap item JSON `hotel_tours.scenes`. Foto di storage, ID panorama, dan pengaturan arah kamera tetap dipertahankan. Panorama lama tanpa properti ini dibaca sebagai **Umum hotel**. Pilih penempatan yang sesuai melalui admin; tidak perlu upload ulang.

```json
{ "type": "hotel" }
{ "type": "room", "targetId": "ID-kamar-dari-tabel-Room" }
{ "type": "facility", "targetId": "ID-fasilitas-dari-tabel-Facility" }
```

Penempatan menggunakan ID tetap dan hotel pemilik, bukan nama. Nama yang sama di dua cabang tidak digabung. Jika kamar/fasilitas dihapus, tur terkait disembunyikan dari halaman publik sampai penempatannya diperbarui. Admin memeriksa ulang tujuan saat menyimpan; pembaca publik juga memvalidasi hubungan ini. Tur draf tidak ditampilkan pada halaman mana pun. Kebijakan RLS dan izin unggah tetap mengikuti migrasi guest experience yang sudah ada.
