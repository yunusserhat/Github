---
title: "Veri Yapıları (Data Structures)"
title_en: "Data Structures in Python"
linkTitle: "Veri Yapıları"
summary: "Python ile algoritma analizi (Big O), PRIMM aktif öğrenme notebook'ları ve temel veri yapıları (diziler, bağlı listeler, yığınlar, kuyruklar, hash tabloları, ağaçlar, heap'ler ve graflar)."
summary_en: "14-week undergraduate course designed from scratch with seven learning outcomes, PRIMM active-learning notebooks, Big O analysis and core data structures implemented in Python."
type: book
course_codes:
  - "YZM2005"
faculty: "UBF"
faculty_name: "Marmara Üniversitesi Uygulamalı Bilimler Fakültesi"
department: "Yapay Zeka ve Makine Öğrenmesi"
department_en: "Department of Artificial Intelligence and Machine Learning"
term: "Güz"
term_en: "Autumn"
archived: false
weight: 30
date: "2026-09-01"
---

> **English overview.** YZM2005 Data Structures in Python is a 14-week undergraduate course designed from scratch for Marmara University's new Department of Artificial Intelligence and Machine Learning. Taught in Turkish with bilingual technical terminology, it uses seven learning outcomes, weekly conceptual readings, live Jupyter notebooks and PRIMM (predict, run, investigate, modify, make) exercises. Topics progress from Big O cost analysis and dynamic arrays to linked lists, stacks, queues, recursion, sorting, hash tables, binary search trees, heaps and graphs, with assessment prioritising algorithmic reasoning alongside working Python code.

## 📌 Ders Künyesi ve Bilgileri

| Özellik | Detay |
| :--- | :--- |
| **Ders Adı** | Veri Yapıları (Data Structures in Python) |
| **Ders Kodu** | `YZM2005` |
| **Akademik Birim** | Uygulamalı Bilimler Fakültesi (UBF) |
| **Bölüm** | Yapay Zeka ve Makine Öğrenmesi Bölümü |
| **Dönem** | Güz Dönemi |
| **Ders Dili / Kredi** | Türkçe (İngilizce teknik terim eşleştirmeli) / 3 Teori + 1 Uygulama |
| **Programlama Dili** | Python 3 (standart kütüphane ve Jupyter Notebook) |
| **Öğretim Elemanı** | {{< mention "admin" >}} |

---

## 🎯 Dersin Amacı ve Kapsamı

Bu ders temel veri yapılarını ve bu yapılar üzerinde çalışan temel algoritmaları Python ile öğretir. Öğrenciler her yapının bellekte nasıl durduğunu görselleştirerek öğrenir, işlemlerinin neden hızlı ya da yavaş olduğunu Big O gösterimiyle açıklar ve bir problem için uygun yapıyı seçip gerekçelendirir. Her ders gerçek hayattan bir soruyla açılır, canlı Jupyter notebook uygulamaları ve PRIMM (tahmin et, çalıştır, incele, değiştir, üret) alıştırmalarıyla ilerler.

---

## 🚀 Öğrenme Çıktıları (Kazanımlar)

- Bir algoritmanın zaman ve bellek maliyetini Big O gösterimiyle ifade edebilme ve kısa Python kodlarının Big O sınıfını belirleyebilme.
- Dizinin ve bağlı listenin bellekte nasıl durduğunu açıklayabilme, okuma, ekleme ve silme maliyetlerini karşılaştırabilme.
- Yığın, kuyruk ve öncelik kuyruğunu Python ile gerçekleştirebilme ve uygun problemlerde kullanabilme.
- Özyinelemeli fonksiyonlar yazabilme ve bir özyinelemeli çağrının adımlarını izleyebilme.
- Temel arama ve sıralama algoritmalarını uygulayabilme ve maliyetlerine göre karşılaştırabilme.
- Hash tablosu, ikili arama ağacı, heap ve graf yapılarının çalışma mantığını açıklayabilme ve temel işlemlerini Python ile yazabilme.
- Bir problemde sık yapılan işlemlere bakarak uygun veri yapısını seçebilme ve seçimini gerekçelendirebilme.

---

## 📚 Haftalık Ders İzlencesi (Syllabus)

> ℹ️ **Haftalık Akış:** Ders izlencesi aşağıda özetlenmiştir. Her haftanın detaylı teorik anlatımları, kodları ve uygulama materyalleri ilgili hafta geldiğinde sırayla sol menüde erişime açılacaktır.

| Hafta | Konu Başlığı | Odak Konular ve Algoritmik Beceriler | Durum / Materyal |
| :---: | :--- | :--- | :---: |
| **Giriş** | [Derse Giriş & Algoritmik Düşünme](giris) | Ders Akışı, PRIMM Yöntemi, Bellek Modeli ve Python / Jupyter Ortamı | 🟢 Açık |
| **1** | [Veri Yapılarına Giriş ve Algoritma Analizi](hafta-01) | Asimptotik Notasyonlar (Big O, $\Omega$, $\Theta$), Zaman ve Bellek Karmaşıklığı | 🟢 Açık · [Slayt (PDF)](/courses/veri-yapilari/hafta-01-slayt.pdf) |
| **2** | [Diziler (Arrays) ve Dinamik Diziler](hafta-02) | Bellek Yerleşimi, Sabit ve Dinamik Diziler, Amortized Zaman Analizi | 🟢 Açık · [Slayt (PDF)](/courses/veri-yapilari/hafta-02-slayt.pdf) |
| **3** | [Bağlı Listeler I: Tek Yönlü Bağlı Liste](hafta-03) | Düğüm (Node) Yapısı, Başa/Sona/Araya Ekleme, Silme ve Arama | 🟢 Açık · [Slayt (PDF)](/courses/veri-yapilari/hafta-03-slayt.pdf) |
| **4** | [Yığınlar (Stacks) ve LIFO Mimarisi](hafta-04) | LIFO Mantığı, Dizi ve Bağlı Liste İle Yığın Gerçekleme, Parantez Doğrulama | 🟢 Açık · [Slayt (PDF)](/courses/veri-yapilari/hafta-04-slayt.pdf) |
| **5** | [Kuyruklar (Queues) ve Çift Uçlu Kuyruk (Deque)](hafta-05) | FIFO Mantığı, Dairesel Kuyruk (Circular Queue), Deque ve İş Akışları | 🟢 Açık · [Slayt (PDF)](/courses/veri-yapilari/hafta-05-slayt.pdf) |
| **6** | Özyineleme (Recursion) ve Böl-Yönet | Rekürsif Fonksiyonlar, Base Case, Çağrı Yığını, Master Teoremi | ⏳ Hazırlanıyor |
| **7** | Arama ve Basit Sıralama | Doğrusal ve İkili Arama, Seçerek/Eklemeli Sıralama, $O(n^2)$ Sıralamalar | ⏳ Hazırlanıyor |
| **8** | Ara Sınav (Vize) & Algoritmik Değerlendirme | Dönem İçi Değerlendirme ve Karmaşıklık Analizi Sınavı | ⏳ Dönem İçi |
| **9** | Böl ve Yönet ile Sıralama | Birleştirmeli (Merge) ve Hızlı (Quick) Sıralama, $O(n \log n)$ Karmaşıklık | ⏳ Hazırlanıyor |
| **10** | Karma Tabloları (Hash Tables) ve Çakışma Yönetimi | Hashing Prensipleri, Çakışma Çözümü (Chaining & Open Addressing) | ⏳ Hazırlanıyor |
| **11** | Ağaçlar (Trees) ve İkili Ağaç Mimarisi | Ağaç Terminolojisi, İkili Ağaçlar, Ağaç Gezinmeleri (Pre/In/Postorder) | ⏳ Hazırlanıyor |
| **12** | İkili Arama Ağaçları (Binary Search Trees - BST) | BST Özelliği, Arama, Ekleme, Düğüm Silme ($O(h)$ Karmaşıklık) | ⏳ Hazırlanıyor |
| **13** | Yığınlar (Heaps) ve Öncelikli Kuyruklar | Max-Heap, Min-Heap, Heapify İşlemi, Priority Queue ve Heapsort | ⏳ Hazırlanıyor |
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
