---
title: "10. Hafta: PostgreSQL’de ilk tablo"
linkTitle: "10. Hafta — PostgreSQL’de ilk tablo"
summary: "Küçük bir uygulama veritabanında tablo oluşturup kayıt ekleyin."
date: "2026-09-28"
type: book
weight: 110
---

## Hedef

PostgreSQL’de tablo, satır, sütun, veri türü ve **birincil anahtar** kavramlarını göreceksiniz. Öğrenci hesabınız yalnızca size ayrılmış uygulama veritabanına bağlanmalıdır; yönetici hesabı kullanılmaz.

## Başlamadan önce

Öğretim elemanının verdiği bağlantı bilgileriyle pgAdmin’de kendi veritabanınızı açın. Yerel kurulum varsa bilgisayarınızdaki uygulama veritabanını seçin. [Örnek SQL dosyasını](../ornek-kayitlar.sql) indirin; `04_Veritabani` klasörünüzde saklayın. Dosyada gerçek kişi bilgisi yoktur.

## Laboratuvar görevi

1. pgAdmin **Query Tool** penceresinde önce `CREATE TABLE` bölümünü **bir kez** çalıştırın.
2. Ardından `INSERT INTO` bölümünü **bir kez** çalıştırın. Aynı ekleme komutunu tekrar çalıştırırsanız benzersiz kod hatası alırsınız; bu veri kuralının işe yaradığını gösterir.
3. `SELECT * FROM etkinlik_kayitlari ORDER BY kayit_id;` komutunu çalıştırın. Sekiz satır görmelisiniz.
4. `kayit_id` sütununu ve `katilimci_kodu` sütununu karşılaştırın. İlki veritabanının ürettiği birincil anahtar, ikincisi örnekte benzersiz bir iş kodudur.
5. `durum` alanındaki izinli üç değeri bulun: `Onaylandı`, `Bekliyor`, `İptal`.

## Kontrol

Sekiz satır görünmüyorsa önce doğru veritabanını seçtiğinizi, komut sonunda `;` olduğunu ve `INSERT` bölümünün çalıştığını kontrol edin. Tabloyu silmeyin; gelecek hafta aynı veriler kullanılacak.

**Ürün:** Sekiz kayıtlı `etkinlik_kayitlari` tablosu. [PostgreSQL SQL öğreticisi](https://www.postgresql.org/docs/current/tutorial-sql.html), [pgAdmin Query Tool](https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html).
