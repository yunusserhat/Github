---
title: "9. Hafta: Elektronik Tablolara Giriş ve Veri Düzenleme"
linkTitle: "9. Hafta - Elektronik Tablolara Giriş"
date: "2026-09-01"
type: book
weight: 100
draft: true
---

## 📊 Elektronik Tablo Mantığı (Google Sheets & MS Excel)

Elektronik tablolar, satır ve sütunlardan oluşan hücre ızgaralarında verileri depolamak, hesaplamak ve analiz etmek için kullanılan en yaygın veri aracıdır.

<!--more-->

### Hücre ve Veri Tipleri
- **Metin (String):** Sola hizalı değerler (İsim, Şehir, Ürün Adı).
- **Sayısal (Number):** Sağa hizalı değerler (Fiyat, Miktar, Yaş).
- **Tarih ve Saat:** Sistem tarafından seri numarası olarak tutulan değerler (`GG.AA.YYYY`).
- **Mantıksal (Boolean):** `DOĞRU` (TRUE) / `YANLIŞ` (FALSE).

---

## ⚡ Veri Girişini Hızlandıran Teknikler

- **Otomatik Doldurma Tutamacı (Fill Handle):** Günler, aylar, sayılar ve tarihlerin örüntüye göre sürüklenerek doldurulması.
- **Hücre Kilitleme / Mutlak Başvuru (`$` İşareti):** Formül kopyalanırken hücre koordinatının sabit tutulması (`$A$1`, `$A1`, `A$1`).
- **Veri Doğrulama (Data Validation):** Hücreye hatalı veri girilmesini önlemek amacıyla açılır liste (dropdown) oluşturma.

---

## 🛠️ Laboratuvar Uygulaması

1. 50 satırlık bir çalışan bordro tablosu oluşturunuz.
2. Departman sütununa Veri Doğrulama ile açılır liste ekleyiniz (`Pazarlama`, `İnsan Kaynakları`, `BT`, `Satış`).
3. Para birimi ve tarih hücrelerinin biçimlendirmesini yapınız.
