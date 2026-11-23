---
title: "14. Hafta. Bütünleşik ofis ve veritabanı uygulaması, final hazırlığı"
linkTitle: "14. Hafta. Bütünleşik uygulama ve final"
summary: "SQLite sorgu özetini Excel grafiğine ve PowerPoint sunusuna aktarın, Google Drive portfolyonuzu son kontrolden geçirin."
date: "2026-12-29"
type: book
weight: 150
---

## Hedef

Dönem boyunca ayrı ayrı çalıştığınız araçları tek bir kurumsal veri akışında birleştireceksiniz. SQLite veritabanından ürettiğiniz özet sorgu sonucunu CSV olarak dışa aktaracak, masaüstü Excel'de grafikleştirecek ve 9. haftada hazırladığınız PowerPoint sunusuna ekleyerek nihai yönetim sunusunu tamamlayacaksınız.

## Laboratuvar görevi

### 1. SQLite özetini dışa aktarma

1. `etkinlik.db` dosyasını **DB Browser for SQLite** ile açın ve 13. haftadaki 5. sorguyu (oturum bazlı `INNER JOIN` ve `GROUP BY` özeti) çalıştırın.
2. Sonuç penceresinin sağ üst köşesindeki dışa aktarma simgesinden **CSV dosyasına aktar (Export to CSV)** seçeneğini kullanarak çıktıyı `sorgu_ozeti.csv` adıyla kaydedin.

### 2. Excel'de tablo ve grafik oluşturma

3. Masaüstü Excel'de boş bir çalışma kitabı açın. Türkçe karakterlerin bozulmaması için dosyayı doğrudan çift tıklamak yerine `Veri → Metinden/CSV'den` yolunu kullanın. Dosya kaynağını `65001: Unicode (UTF-8)` seçerek veriyi yükleyin.
4. Sütun başlıklarını okunaklı biçimde düzenleyin, `toplam_materyal_tl` sütununu para birimi (TL) biçimine alın ve en alt satıra `=TOPLA(...)` formülüyle genel toplamı (**9 katılımcı** ve **1.610 TL**) ekleyin.
5. `oturum_adi` ve `onayli_katilimci` sütunlarını seçerek bir **Sütun Grafiği** oluşturun. Grafik başlığını `Oturumlara Göre Onaylı Katılımcı Dağılımı` yapın.
6. Dosyayı `sorgu_ozeti.xlsx` olarak kaydedin ve Google Drive'daki `Ofis_Programlari/04_Veritabani/` klasörüne yükleyin.

### 3. PowerPoint sunusunu veritabanı verileriyle güncelleme

7. 9. haftada hazırladığınız `Etkinlik_Sunusu.pptx` dosyasını açın ve `Etkinlik_Sunusu_Final.pptx` olarak farklı kaydedin.
8. Sonuç slaydından önce **Kayıt ve Katılım Analizi** başlıklı yeni bir slayt (7. slayt) ekleyin.
9. Excel'de oluşturduğunuz katılımcı dağılımı grafiğini bu slayta aktarın. Grafiğin yanına veya altına veritabanından çıkan iki net bulguyu yazın. En yoğun oturumun **4 katılımcı ile Excel ile Veri Analizi** olduğunu ve toplam onaylı materyal tutarının **1.610 TL** tutarında olduğunu belirtin.
10. Nihai sunuyu hem `Etkinlik_Sunusu_Final.pptx` hem de `Etkinlik_Sunusu_Final.pdf` olarak kaydedin ve `Ofis_Programlari/05_Sunu/` klasörüne yükleyin.

## Google Drive portfolyo son kontrol listesi

Final dönemi öncesinde `Ofis_Programlari` ana klasörünüzün öğretim elemanıyla **Görüntüleyen** yetkisiyle paylaşıldığını ve aşağıdaki dosyaların eksiksiz yer aldığını doğrulayın.

| Klasör | Beklenen Dosyalar |
| :--- | :--- |
| `01_Giris_ve_Dilekce` | `Dilekce_Ornegi.docx` |
| `02_Word` | `Etkinlik_Duyurusu_v1.docx`, `Etkinlik_Duyurusu_v1.pdf`, `Etkinlik_Duyurusu_v2.docx`, `Etkinlik_Is_Yazisi.docx`, `Toplanti_Tutanagi.docx`, `Toplanti_Tutanagi.pdf` |
| `03_Excel` | `Etkinlik_Butcesi.xlsx` |
| `04_Veritabani` | `Form_Yanitlari.xlsx`, `etkinlik.db`, `01_tablo_olusturma.sql`, `02_temel_sorgular.sql`, `03_ozet_ve_iliski.sql`, `sorgu_ozeti.xlsx` |
| `05_Sunu` | `Etkinlik_Sunusu.pptx`, `Etkinlik_Sunusu.pdf`, `Etkinlik_Sunusu_Final.pptx`, `Etkinlik_Sunusu_Final.pdf` |

## Final sınavı bilgilendirmesi

[Marmara 2026-2027 akademik takvimine](https://takvim.marmara.edu.tr/year/2026/summary) göre final sınavları **4-17 Ocak 2027** tarihleri arasındadır. Kesin sınav günü, saati ve salonu ÖBYS'den ilan edilir. Değerlendirme, dönem boyunca Google Drive'da biriktirdiğiniz uygulama ürünlerini ve tüm temel ofis araçlarıyla (Word, Excel, PowerPoint, Google Forms ve SQLite) ilgili kavram ve uygulamaları kapsar.
