---
title: "13. Hafta: Karma Tabloları (Hash Tables) ve Çakışma Yönetimi"
linkTitle: "13. Hafta - Hash Tabloları"
date: "2026-09-01"
type: book
weight: 140
draft: true
---

## 🔑 Anahtar-Değer (Key-Value) İlişkisi ve Hashing

Hash Tablosu, anahtarları (Key) değerlerle (Value) eşleştiren ve ortalama durumda $O(1)$ sürede arama, ekleme ve silme sunan veri yapısıdır (Python `dict`, Java `HashMap`).

<!--more-->

### Hash Fonksiyonunun Görevi
Herhangi bir boyuttaki anahtarı (örn. "Yunus", "YZM2005") sabit boyutlu bir tam sayıya (indekse) dönüştürür:
$$\text{İndeks} = \text{hash}(\text{anahtar}) \pmod{\text{Tablo Boyutu}}$$

İyi bir hash fonksiyonu:
- Deterministik olmalıdır (aynı anahtar hep aynı çıktıyı verir).
- Çıktıları tabloya homojen (üniform) dağıtmalıdır.
- Hızlı hesaplanmalıdır.

---

## 💥 Çakışma (Collision) Çözüm Yöntemleri

Farklı iki anahtar aynı hash indeksini ürettiğinde çakışma meydana gelir.

### 1. Ayrı Zincirleme (Separate Chaining)
Tablonun her hücresi bir bağlı listenin başlangıcıdır. Çakışan elemanlar aynı indeksteki bağlı listeye eklenir.

### 2. Açık Adresleme (Open Addressing)
Tüm elemanlar doğrudan tablonun içinde saklanır. İndeks doluysa boş bir yer aranır:
- **Doğrusal Sondalama (Linear Probing):** $i + 1, i + 2, \dots$ (Kümelenme problemi yaratır).
- **Karesel Sondalama (Quadratic Probing):** $i + 1^2, i + 2^2, i + 3^2, \dots$
- **Çift Karma (Double Hashing):** İkinci bir hash fonksiyonu ile adım büyüklüğü belirlenir.

---

## ⚖️ Yük Faktörü (Load Factor - $\alpha$)
$$\alpha = \frac{n (\text{Eleman Sayısı})}{m (\text{Tablo Kapasitesi})}$$
$\alpha > 0.7$ olduğunda tablo boyutu genellikle 2 katına çıkarılır (Rehashing).
