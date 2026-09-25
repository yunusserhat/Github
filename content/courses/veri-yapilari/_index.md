---
title: "Veri Yapıları (Data Structures)"
linkTitle: "Veri Yapıları"
summary: "Algoritmik analiz (Big O), temel ve doğrusal olmayan veri yapıları (bağlı listeler, yığınlar, kuyruklar, ağaçlar, heap'ler, hash tabloları ve graflar)."
type: book
course_codes:
  - "YZM2005"
faculty: "UBF"
faculty_name: "Marmara Üniversitesi Uygulamalı Bilimler Fakültesi"
department: "Yapay Zeka ve Makine Öğrenmesi"
term: "Güz"
archived: false
weight: 30
date: "2026-09-01"
---

## 📌 Ders Künyesi ve Bilgileri

| Özellik | Detay |
| :--- | :--- |
| **Ders Adı** | Veri Yapıları (Data Structures) |
| **Ders Kodu** | `YZM2005.1` |
| **Akademik Birim** | Uygulamalı Bilimler Fakültesi (UBF) |
| **Bölüm** | Yapay Zeka ve Makine Öğrenmesi Bölümü |
| **Dönem** | Güz Dönemi |
| **Ders Dili / Kredi** | Türkçe (Teknik Terimler İngilizce) / 3 Teori + 1 Uygulama |
| **Ön Koşul** | Temel Programlama (Python / C++ / Java) |
| **Öğretim Elemanı** | {{< mention "admin" >}} |

---

## 🎯 Dersin Amacı ve Kapsamı

Bu ders, bilgisayar bilimleri ve yapay zeka mühendisliğinin temel taşı olan verilerin bellekte organize edilmesi, saklanması ve işlenmesi prensiplerini öğretmeyi amaçlar. Öğrenciler farklı algoritmaların zaman ve bellek karmaşıklıklarını matematiksel olarak analiz etmeyi, probleme en uygun veri yapısını seçmeyi ve bunu nesne yönelimli programlama ilkeleriyle sıfırdan kodlamayı öğrenirler.

---

## 🚀 Öğrenme Çıktıları (Kazanımlar)

- Asimptotik notasyonları ($O, \Omega, \Theta$) kullanarak algoritmaların zaman ve bellek karmaşıklığını teorik ve deneysel olarak analiz edebilme.
- Doğrusal veri yapılarını (Diziler, Tek/Çift Yönlü Bağlı Listeler, Yığınlar, Kuyruklar) sıfırdan tasarlayabilme ve uygulama alanlarına entegre edebilme.
- Hiyerarşik ve doğrusal olmayan veri yapılarını (İkili Ağaçlar, BST, AVL Ağaçları, Heap, Hash Tabloları, Graf) kavrama ve verimli arama/ekleme algoritmalarını kodlayabilme.
- Rekürsif (özyinelemeli) algoritmaları analiz edebilme ve çağrı yığını (call stack) işleyişini modelleyebilme.
- Yapay zeka ve büyük veri problemlerinde hesaplama maliyetini minimize eden optimum veri yapısını seçebilme yetkinliği.

---

## 📚 Haftalık Ders İzlencesi (Syllabus)

> ℹ️ **Haftalık Akış:** Ders izlencesi aşağıda özetlenmiştir. Her haftanın detaylı teorik anlatımları, kodları ve uygulama materyalleri ilgili hafta geldiğinde sırayla sol menüde erişime açılacaktır.

| Hafta | Konu Başlığı | Odak Konular ve Algoritmik Beceriler | Durum |
| :---: | :--- | :--- | :---: |
| **Giriş** | [Derse Giriş & Algoritmik Düşünme](giris) | Ders Kuralları, Bellek Modeli, Geliştirme Ortamı (VS Code / Python / C++) | 🟢 Açık |
| **1** | Veri Yapılarına Giriş ve Algoritma Analizi | Asimptotik Notasyonlar (Big O, $\Omega$, $\Theta$), Zaman ve Bellek Karmaşıklığı | ⏳ Hazırlanıyor |
| **2** | Diziler (Arrays) ve Dinamik Diziler | Bellek Yerleşimi, Sabit ve Dinamik Diziler, Amortized Zaman Analizi | ⏳ Hazırlanıyor |
| **3** | Bağlı Listeler I: Tek Yönlü Bağlı Liste | Düğüm (Node) Yapısı, Başa/Sona/Araya Ekleme, Silme ve Arama | ⏳ Hazırlanıyor |
| **4** | Bağlı Listeler II: Çift Yönlü ve Dairesel Listeler | Doubly Linked List, Dairesel Liste Mimarisi, Sentinel Düğümler | ⏳ Hazırlanıyor |
| **5** | Yığınlar (Stacks) ve LIFO Mimarisi | LIFO Mantığı, Dizi ve Bağlı Liste İle Yığın Gerçekleme, Parantez Doğrulama | ⏳ Hazırlanıyor |
| **6** | Kuyruklar (Queues) ve Çift Uçlu Kuyruk (Deque) | FIFO Mantığı, Dairesel Kuyruk (Circular Queue), Deque ve İş Akışları | ⏳ Hazırlanıyor |
| **7** | Özyineleme (Recursion) ve Böl-Yönet | Rekürsif Fonksiyonlar, Base Case, Çağrı Yığını, Master Teoremi | ⏳ Hazırlanıyor |
| **8** | Ara Sınav (Vize) & Algoritmik Değerlendirme | Dönem İçi Değerlendirme ve Karmaşıklık Analizi Sınavı | ⏳ Dönem İçi |
| **9** | Ağaçlar (Trees) ve İkili Ağaç Mimarisi | Ağaç Terminolojisi, İkili Ağaçlar, Ağaç Gezinmeleri (Pre/In/Postorder) | ⏳ Hazırlanıyor |
| **10** | İkili Arama Ağaçları (Binary Search Trees - BST) | BST Özelliği, Arama, Ekleme, Düğüm Silme ($O(h)$ Karmaşıklık) | ⏳ Hazırlanıyor |
| **11** | Dengeli Ağaçlar (Balanced Trees: AVL) | Denge Faktörü, Sol/Sağ Rotasyonlar, $O(\log n)$ Arama Garantisi | ⏳ Hazırlanıyor |
| **12** | Yığınlar (Heaps) ve Öncelikli Kuyruklar | Max-Heap, Min-Heap, Heapify İşlemi, Priority Queue ve Heapsort | ⏳ Hazırlanıyor |
| **13** | Karma Tabloları (Hash Tables) ve Çakışma Yönetimi | Hashing Prensipleri, Çakışma Çözümü (Chaining & Open Addressing) | ⏳ Hazırlanıyor |
| **14** | Çizgelere Giriş (Graphs) ve Temel Gezinmeler | Graf Gösterimleri (Adjacency Matrix/List), BFS ve DFS Algoritmaları | ⏳ Hazırlanıyor |

---

## ⚖️ Değerlendirme Kriterleri

| Değerlendirme Türü | Katkı Oranı | Açıklama |
| :--- | :---: | :--- |
| **Ara Sınav (Vize)** | %30 | Teorik analiz ve kod yazma sınavı |
| **Laboratuvar & Programlama Ödevleri** | %20 | Algoritma ve veri yapısı gerçekleme projeleri |
| **Yarıyıl Sonu Sınavı (Final)** | %50 | Kapsamlı teorik ve pratik dönem sonu sınavı |
| **Toplam** | **%100** | |

---

## 📖 Başvuru Kitapları ve Kaynaklar

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. *Introduction to Algorithms (CLRS)*. MIT Press.
- Weiss, M. A. *Data Structures and Algorithm Analysis*. Pearson.
- Sedgewick, R., & Wayne, K. *Algorithms*. Addison-Wesley.

{{< cta cta_text="📖 Derse Başla (Giriş & Algoritmik Düşünme)" cta_link="giris" >}}
