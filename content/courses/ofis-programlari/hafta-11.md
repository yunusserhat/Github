---
title: "11. Hafta. Veritabanı sistemlerine genel bakış ve SQLite ile ilk tablo"
linkTitle: "11. Hafta. VTYS ve SQLite ile ilk tablo"
summary: "Yaygın veritabanı araçlarını karşılaştırın, DB Browser for SQLite ile ilişkili iki tablo kurun ve ilk kayıtları ekleyin."
date: "2026-12-08"
type: book
weight: 120
---

## Hedef

Farklı veritabanı yönetim sistemlerinin (VTYS) temel özelliklerini karşılaştıracak, ardından açık kaynaklı **SQLite** motoru ve **DB Browser for SQLite** arayüzüyle iki ilişkili tablo oluşturacaksınız. Veri türleri, birincil anahtar, yabancı anahtar ve veri kısıtlarının hatalı veri girişini nasıl önlediğini uygulamalı olarak göreceksiniz.

## Veritabanı araçları neden farklıdır?

İş dünyasında ve yazılım projelerinde ihtiyaca göre farklı veritabanı sistemleri tercih edilir.

| Sistem | Lisans | Çalışma Yapısı | Tipik Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Microsoft Access** | Kapalı kaynak (ücretli) | Masaüstü dosya tabanlı (Windows) | Küçük ofis kayıtları, form ve raporlama |
| **MySQL / MariaDB** | Açık kaynak | İstemci-sunucu | Web siteleri ve çevrimiçi uygulamalar |
| **PostgreSQL** | Açık kaynak | İstemci-sunucu | Kurumsal sistemler, ileri analitik ve büyük veri tabanları |
| **SQLite** | Açık kaynak (kamu malı) | Sunucusuz, tek `.db` dosyası | Mobil uygulamalar, masaüstü araçlar, hızlı veri analizi ve taşınabilir veritabanları |

Dersimizin geri kalanında açık kaynaklı **SQLite** ile ilerleyeceğiz. SQLite sunucu kurulumu gerektirmez, standart SQL sözdizimini destekler ve tüm veritabanını tek bir `.db` dosyasında saklar. Bu sayede her hafta dosyanızı kolayca Google Drive'a yükleyebilirsiniz.

## Temel kavramlar

- **`PRAGMA foreign_keys = ON;`.** SQLite'ta yabancı anahtar denetimini etkinleştiren komuttur. Her oturumun başında çalıştırılır.
- **Veri türleri.** Tam sayılar için `INTEGER`, metinler ve ISO tarihler (`2026-12-01`) için `TEXT` kullanılır.
- **`PRIMARY KEY`.** Tablodaki her satırı benzersiz biçimde tanımlayan birincil anahtardır. Boş bırakılamaz ve tekrar edemez.
- **`NOT NULL`, `UNIQUE`, `CHECK`.** Excel'deki Veri Doğrulama kurallarının veritabanı karşılığıdır. Boş değerleri, tekrar eden katılımcı kodlarını ve izin verilmeyen durum metinlerini doğrudan engeller.
- **`FOREIGN KEY`.** Bir tablodaki kodun, başka bir tablodaki geçerli bir birincil anahtara bağlı olmasını zorunlu kılar.

## Laboratuvar görevi

1. Laboratuvar bilgisayarında **DB Browser for SQLite** programını açın. (Kurulu değilse [sqlitebrowser.org](https://sqlitebrowser.org/) adresinden indirilebilir veya öğretim elemanının yönlendirdiği taşınabilir sürüm kullanılır.)
2. **Yeni Veritabanı (New Database)** düğmesine tıklayın ve yerel çalışma klasörünüzde `etkinlik.db` adıyla yeni bir veritabanı oluşturun. Açılan "Tablo tanımını düzenle" penceresini **İptal** diyerek kapatın, çünkü tabloları SQL ile kuracağız.
3. [Örnek SQL dosyasını](../ornek-kayitlar.sql) indirin ve **SQL Çalıştır (Execute SQL)** sekmesine geçin.
4. Önce `PRAGMA foreign_keys = ON;` satırını ve iki `CREATE TABLE` bloğunu (`oturumlar` ve `etkinlik_kayitlari`) seçip çalıştırın.
5. Ardından iki `INSERT INTO` bloğunu (`4` oturum ve `12` katılımcı kaydı) **bir kez** çalıştırın.
6. Üst araç çubuğundaki **Değişiklikleri Yaz (Write Changes)** düğmesine basın. Bu adımı atladığınızda veriler diske kalıcı olarak kaydedilmez.
7. **Veri Gözat (Browse Data)** sekmesine geçip önce `oturumlar` tablosunda **4 satır**, sonra `etkinlik_kayitlari` tablosunda **12 satır** olduğunu doğrulayın.
8. Şimdi veritabanı kurallarının gerçekten çalıştığını görmek için **SQL Çalıştır** sekmesinde şu üç hatalı komutu sırayla tek tek deneyin ve aldığınız hata mesajlarını inceleyin.

```sql
-- 1. UNIQUE testi (K001 zaten var)
INSERT INTO etkinlik_kayitlari (katilimci_kodu, birim, oturum_kodu, durum, kayit_tarihi, materyal_tl)
VALUES ('K001', 'Muhasebe', 'EXL', 'Onaylandı', '2026-12-06', 200);

-- 2. CHECK testi ('Belirsiz' izin verilen durumlar arasinda degil)
INSERT INTO etkinlik_kayitlari (katilimci_kodu, birim, oturum_kodu, durum, kayit_tarihi, materyal_tl)
VALUES ('K099', 'Muhasebe', 'EXL', 'Belirsiz', '2026-12-06', 200);

-- 3. FOREIGN KEY testi ('XYZ' adinda bir oturum yok)
PRAGMA foreign_keys = ON;
INSERT INTO etkinlik_kayitlari (katilimci_kodu, birim, oturum_kodu, durum, kayit_tarihi, materyal_tl)
VALUES ('K098', 'Muhasebe', 'XYZ', 'Onaylandı', '2026-12-06', 200);
```

9. Tabloları ve ilk kayıtları oluşturan temiz SQL komutlarınızı `01_tablo_olusturma.sql` adıyla kaydedin.
10. Hem `etkinlik.db` hem de `01_tablo_olusturma.sql` dosyasını Google Drive'daki `Ofis_Programlari/04_Veritabani/` klasörüne yükleyin.

## Laboratuvar kontrolü

- `oturumlar` tablosunda 4 satır, `etkinlik_kayitlari` tablosunda 12 satır görünüyor mu?
- Üç kısıt testinde de SQLite hatalı eklemeyi reddetti mi?
- **Değişiklikleri Yaz (Write Changes)** düğmesine basıldı mı ve güncel `etkinlik.db` Drive'a yüklendi mi?

**Google Drive teslimi.** `Ofis_Programlari/04_Veritabani/etkinlik.db` ve `Ofis_Programlari/04_Veritabani/01_tablo_olusturma.sql`.
