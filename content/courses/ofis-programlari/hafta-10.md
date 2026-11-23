---
title: "10. Hafta. Google Forms ile veri toplama ve veritabanına geçiş"
linkTitle: "10. Hafta. Google Forms ve düzenli veri"
summary: "Doğrulama kurallı katılım formu kurun, yanıtları tabloya aktarın ve veritabanı mantığına geçişi inceleyin."
date: "2026-12-01"
type: book
weight: 110
---

## Hedef

Google Forms ile yapılandırılmış veri toplayacak, yanıtları elektronik tabloya aktaracak ve düz bir tablonun veri arttıkça neden yetersiz kaldığını gözlemleyeceksiniz. Bu hafta, gelecek hafta başlayacağımız SQLite veritabanı tasarımının temel kavramlarını (**tablo**, **alan**, **kayıt**, **veri türü** ve **benzersiz anahtar**) doğrudan kendi topladığınız veriler üzerinde göreceksiniz.

## Bilmeniz gerekenler

- **Soru ve yanıt eşleştirmesi.** Bir formdaki her soru tabloda bir **alanı (sütunu)**, gönderilen her form ise bir **kaydı (satırı)** oluşturur.
- **Serbest metin tuzağı.** Birim adını kısa yanıt olarak sorduğunuzda kullanıcılar `Sekreterlik`, `sekreterlik `, `Sekreterlk` gibi farklı yazımlar girer. Bu durum filtreleme ve sayma işlemlerini bozar. Sınırlı seçenekler için her zaman **Açılır menü** veya **Çoktan seçmeli** soru türü kullanılır.
- **Kişisel veri gizliliği.** Gerçek ad, T.C. kimlik numarası, telefon veya kişisel e-posta gibi veriler gerekmedikçe toplanmaz. Uygulamalarımızda katılımcıları ayırt etmek için `K001` biçiminde kurgusal **katılımcı kodu** kullanırız.
- **Düz tablonun sınırları.** Elektronik tablolar (Excel veya Google E-Tablolar) aynı katılımcı kodunun iki kez girilmesini kendiliğinden engellemez. Ayrıca oturum salonu veya kontenjanı değiştiğinde her satırı tek tek düzeltmek gerekir. Veritabanları bu sorunları **birincil anahtar** ve **ilişkili tablolar** ile çözer.

## Laboratuvar görevi

1. Tarayıcınızda [Google Forms](https://docs.google.com/forms/) sayfasını açın ve `Kampüs Ofis Becerileri Günü Katılım Formu` başlıklı yeni bir form oluşturun.
2. Form açıklamasına "Bu form eğitim amaçlı kurgusal veri toplamaktadır. Gerçek kişisel bilgi girmeyiniz." notunu ekleyin.
3. Aşağıdaki dört soruyu ekleyin ve hepsini **Gerekli (Zorunlu)** yapın.
   - **Katılımcı Kodu.** Kısa yanıt türünde olsun. Sağ alttaki üç noktadan **Yanıt doğrulama** açın, **Metin → İçerir** kuralına `K` yazın ve özel hata metnine `Kodu K001 biçiminde giriniz.` yazın.
   - **Birim.** Açılır menü türünde olsun (`Sekreterlik`, `Muhasebe`, `İnsan Kaynakları`, `Bilişim`).
   - **Oturum Tercihi.** Çoktan seçmeli türünde olsun (`Resmi Yazışma`, `Excel ile Veri Analizi`, `Etkili Sunum`, `Veritabanı Temelleri`).
   - **Basılı Materyal Talebi.** Çoktan seçmeli türünde olsun (`Evet`, `Hayır`).
4. Sağ üstteki **Önizleme (göz simgesi)** ile formu açın ve `K001` ile `K006` arasında **6 kurgusal yanıt** gönderin.
5. Bilerek **yedinci bir yanıt** daha gönderin ve bu yanıtta daha önce kullandığınız `K002` kodunu tekrar girin. Formun bu tekrarı engellemediğini gözlemleyin.
6. Formun **Yanıtlar** sekmesine geçin ve **E-Tablolara Bağla** düğmesiyle yeni bir Google E-Tablo oluşturun.
7. Oluşan tabloyu inceleyin. `Zaman damgası` sütununun otomatik eklendiğini, soruların sütunlara ve yanıtların satırlara dönüştüğünü görün.
8. Tabloyu `Dosya → İndir → Microsoft Excel (.xlsx)` adımıyla bilgisayarınıza indirin ve adını `Form_Yanitlari.xlsx` yapın.
9. İndirdiğiniz dosyayı masaüstü Excel'de açın. `Katılımcı Kodu` sütununu seçip `Giriş → Koşullu Biçimlendirme → Hücre Kurallarını Vurgula → Yinelenen Değerler` aracıyla tekrar eden `K002` kaydını işaretleyin. Tablonun altına yeni bir satırda veya ayrı bir `Notlar` sayfasında yinelenen katılımcı kodunun raporlamada nasıl bir hataya yol açtığını tek cümleyle yazın.
10. Kaydettiğiniz `Form_Yanitlari.xlsx` dosyasını Google Drive'daki `Ofis_Programlari/04_Veritabani/` klasörüne yükleyin.

## Laboratuvar kontrolü

- Formda dört soru da zorunlu ve doğru soru türleriyle (açılır menü / çoktan seçmeli) tanımlandı mı?
- `Katılımcı Kodu` sorusunda yanıt doğrulama kuralı çalışıyor mu?
- Excel dosyasında yinelenen `K002` kodu koşullu biçimlendirmeyle vurgulandı mı?
- Dosya `Ofis_Programlari/04_Veritabani/Form_Yanitlari.xlsx` olarak Google Drive'a yüklendi mi?

**Google Drive teslimi.** `Ofis_Programlari/04_Veritabani/Form_Yanitlari.xlsx`. [Google Forms Yardım](https://support.google.com/docs/topic/9055404).
