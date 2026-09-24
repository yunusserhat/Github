---
title: "14. Hafta: Çevrim İçi Formlar ve Otomasyonlu Veri Toplama"
linkTitle: "14. Hafta - Anket & Formlar"
date: "2026-09-01"
type: book
weight: 150
draft: true
---

## 📝 Çevrim İçi Veri Toplama: Google Forms & Microsoft Forms

Ofis süreçlerinde personel memnuniyeti, etkinlik kaydı, müşteri geri bildirimi ve sipariş toplama işlemleri dijital formlar ile otomatikleştirilir.

<!--more-->

### Dinamik Form Tasarım İlkeleri
- **Soru Tipleri:** Çoktan seçmeli, onay kutuları, Likert ölçeği (Doğrusal ölçek), dosya yükleme.
- **Koşullu Yönlendirme (Mantıksal Dallanma):** Kullanıcının bir soruya verdiği yanıta göre farklı bir bölüme veya soruya aktarılması (örn. "Mezun musunuz?" -> Evet ise mezuniyet yılı, Hayır ise sınıfı sorulsun).
- **Zorunlu Sorular ve Veri Doğrulama:** E-posta, telefon ve sayısal alanlar için geçerlilik kuralları (Regex).

---

## 🔄 Form Yanıtlarının Elektronik Tabloya Canlı Akışı

Form gönderildiği anda yanıtların otomatik olarak Google Sheets veya Excel tablosuna yeni bir satır olarak eklenmesi:
- Zaman Damgası (Timestamp) ile kayıt alma.
- Form yanıt sayfası üzerine Pivot Tablo ve Dashboard bağlayarak anlık canlı raporlama oluşturma.

---

## 🛠️ Laboratuvar Uygulaması & Dönem Sonu Projesi

1. "2026 Güz Dönemi Öğrenci Memnuniyet Anketi" adında çok bölümlü bir Google Form hazırlayınız.
2. En az bir soruya koşullu bölüme atlama mantığı ekleyiniz.
3. Form yanıtlarını yeni bir e-tabloya bağlayınız.
4. Gelen yanıtlar üzerine otomatik özet grafikler ve istatistik sayfası kurunuz.
