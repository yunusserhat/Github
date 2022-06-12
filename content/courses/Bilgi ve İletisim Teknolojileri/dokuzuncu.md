---
title: 9. Bölüm - Dosyalar Veritabanları
date: '2022-01-01'
type: book
weight: 110
---

Elektronik veritabanı, klasörler veya dosya dolaplarının yerine geçen bilgisayar tabanlı sürüm değildir. 
Daha spesifik olarak, belirli bir amaç için tasarlanmış ve oluşturulmuş, ilgili verilerin mantıksal olarak organize edilmiş, işlenmemiş verilerin her türlü şekilde dilimlenmesine, parçalara ayrılmasına, karıştırılmasına ve eşleştirilmesine ve bunları yararlı bilgilere dönüştürmesine olanak tanıyan gerçekleri bir araya getiren bir teknolojidir.
Veritabanı türlerini ve veritabanı yönetimindeki son yenilikleri tartışmadan önce, dosya yönetiminin bazı temel kavramlarına göz atmak gerekir.




<!--more-->

## Veriler Nasıl Düzenlenir: Veri Depolama Hiyerarşisi

BITS: Bilgisayarlar, daha önce de söylediğimiz gibi, elektriğin açık veya kapalı olabileceği ilkesine dayanmaktadır. Bu nedenle bit, bilgisayarın bir veritabanında saklayabileceği en küçük veri birimidir - kapalı için 0 veya açık için 1 ile temsil edilir. 
CHARACTERS: Karakter (bayt) bir harf, sayı veya özel karakterdir. Tek karakterlere örnek olarak A, B, C, 1, 2, 3, #, $ ve% verilebilir. Bir bit kombinasyonu bir karakteri temsil eder. Bitler ve baytlar, işlenmekte, haberleşmekte veya bir veri tabanında depolanmakta olsun, verileri temsil etmek için yapı taşlarıdır. 
FIELD: Alan (sütun), bir veya daha fazla karakterden (bayt) oluşan bir veri birimi veya kategorisidir. Bir veritabanındaki en küçük anlamlı bilgi birimidir. Her alanın, alana girilmesi gereken veri türünü tanımlayan bir alan adı vardır.
RECORD: Bir kayıt (satır), ilgili alanların bir koleksiyonudur; bir tablodaki bir girişi temsil eder. Her kayıt, bir kişi, yer, şey, olay veya fenomen olabilen tek bir varlık hakkındaki verileri depolar. Kayıt örneği, adınız, adresiniz ve Sosyal Güvenlik numaranız olabilir.
FILE: Dosya (genellikle tablo olarak adlandırılır), ilgili kayıtların bir koleksiyonudur. Bir tablo örneği, tüm isimler, adresler ve Sosyal Güvenlik numaraları dahil olmak üzere, bir şirketin aynı departmanında çalışan herkes hakkında toplanan verilerdir. Tablo, veri hiyerarşisinin en üstündedir. Bir şirket veritabanı, tüm bölümlerdeki tüm geçmiş ve mevcut çalışanların tablolarını içerebilir. 

Veri organizasyonunda önemli bir kavram da Primary Key’dir. Birincil anahtar (anahtar alan), genel olarak, bir kaydı benzersiz şekilde tanımlamak için seçilen bir alandır. (veya alanlar)Birincil anahtar genellikle bir kimlik numarası, Sosyal Güvenlik numarası, müşteri hesap numarası veya benzeridir veya anlamlı bir kod olarak ayarlanmış harf ve sayı kombinasyonudur. Anahtar alanın temel özelliği benzersiz olmasıdır. Bu nedenle, rakamlar açıkça birincil anahtar olarak adlara tercih edilir, çünkü kayıtları karıştırılabilecek James Johnson, Susan Williams, Ann Wong veya Roberto Sanchez gibi ortak isimleri olan birçok kişi vardır. Öğrenci kayıtları genellikle birincil anahtar olarak kullanılan öğrenci kimlik numaralarıyla tanımlanır. Yabancı anahtar ise başka bir tablonun birincil anahtarıyla eşleşen bir tablodaki alandır (veya alanlardır); başka bir deyişle, başka bir tablonun birincil anahtarına işaret eder. Yabancı anahtarlar bu nedenle tabloları çapraz referans almak için kullanılabilir. 
Örneğin, bir Öğrenci tablosunda (tüm öğrencilerle ilgili genel verileri içeren) birincil anahtar Öğrenci Kimliği olabilir, çünkü her öğrencinin benzersiz bir kimlik numarası vardır. Ancak Kurslar tablosunda birçok öğrenci birçok kez listelenir çünkü çoğu öğrenci birçok ders alır. Öğrenci Kimlikleri, her öğrenciyi ana Öğrenci tablosundaki birincil anahtara bağlayan yabancı anahtarlar olacaktır.


## Veritabanı Yönetim Sistemleri

Veritabanı yönetim sistemi, kullanıcıların bir veritabanından bilgi depolamasını, değiştirmesini ve çıkarmasını sağlayan bir yazılımdır. 
Veritabanı birbiriyle ilişkili dosyaların düzenli bir koleksiyonudur. Bir veritabanı küçük olabilir, tamamen kendi kişisel bilgisayarınızın içinde yer alabilir veya çok büyük olabilir, çevrimiçi bağlantılar veya süper bilgisayarlar aracılığıyla kullanılabilir. Göreceğimiz gibi, bu tür büyük veritabanları özellikle ilgi çekicidir, çünkü yakın zamana kadar çoğu sıradan bilgisayar kullanıcısının erişemediği olağanüstü kaynaklar sunarlar. 
Veritabanı yazılımı veya veritabanı yöneticisi olarak da adlandırılan bir veritabanı yönetim sistemi (DBMS), bir veritabanının yapısını ve verilere erişimi kontrol etmek için özel olarak yazılmış bir yazılımdır. Bir DBMS'de bir adres değişikliğinin yalnızca bir kez girilmesi gerekir ve güncellenen bilgiler daha sonra herhangi bir ilgili tabloda (dosya) kullanılabilir. 


## Veritabanı Yönetim Sistemlerinin Faydaları

Bilgi teknolojisi, veri ve bilgi sistemlerinin oluşturulmasını ve yönetimini önemli ölçüde geliştirmiştir.
Veritabanı yönetim sistemlerinin avantajları şunlardır:
- Veri Yedekliliği
- Hız
- Geliştirilmiş Veri Bütünlüğü
- Zaman Çizelgesi
- Paylaşım Kolaylığı
- Veri Bakım Kolaylığı
- Tahmin Kabiliyetleri
- Yükseltilmiş Güvenlik

VERİ YEDEKLİLİĞİ: Veri yedekliliği veya tekrarı, aynı veri alanlarının (örneğin bir kişinin adresi) farklı dosyalarda ve genellikle farklı formatlarda tekrar tekrar görünmesi anlamına gelir. Eski dosya işleme sisteminde, ayrı dosyalar aynı verileri tekrar eder ve depolama alanını boşa harcar. Bir veritabanı yönetim sisteminde, bilgiler yalnızca bir kez görünür ve daha fazla depolama kapasitesi sağlar. Yinelemeleri ve tutarsızlıkları en aza indirmek için bu veri yapılandırma işlemine normalleştirme denir. 
HIZ: Modern DBMS'ler açıkça manuel veri düzenleme sistemlerinden çok daha hızlıdır ve eski bilgisayar tabanlı veri depolama düzenlemelerinden daha hızlıdır. 
GELİŞTİRİLMİŞ VERİ BÜTÜNLÜĞÜ: Veri bütünlüğü, verilerin doğru, tutarlı ve güncel olduğu anlamına gelir. Eski sistemde, bir dosyada değişiklik yapıldığında, diğer gerekli dosyalarda yapılmamış olabilir. 

ZAMAN ÇİZELGESİ: DBMS'lerin hızı ve verimliliği genellikle, verilerin zamanında - insanlar ihtiyaç duyduğunda sağlanabilmesini sağlar. 
PAYLAŞIM KOLAYLIĞI: Bir veritabanındaki veriler, genellikle bir ağ üzerinden tüm kuruluşa aittir ve bu veriler paylaşılır. Veriler, verileri işleyen programlardan bağımsızdır ve teknik bilgisi olmayan kullanıcıların verilere erişmesi kolaydır (yetkileri varsa). Bireysel bilgisayar kullanıcıları, bir veritabanı uygulama paketi kullanarak kendi küçük veritabanlarını da geliştirebilirler.
VERİ BAKIMI KOLAYLIĞI: Veritabanı yönetim sistemleri, kayıtların eklenmesi, düzenlenmesi ve silinmesine yönelik standart prosedürlerin yanı sıra, her alan türüne uygun veri türünün doğru ve eksiksiz olarak girildiğinden emin olmak için doğrulama kontrolleri sunar. Veri yedekleme yardımcı programları, birincil sistem arızası durumunda verilerin kullanılabilirliğini sağlar. 
TAHMİN ÖZELLİKLERİ: DBMS'ler, piyasalardaki ve diğer alanlardaki davranışları tahmin etmek için manipüle edilebilen, üzerinde çalışılabilen ve karşılaştırılabilen büyük miktarda veri tutabilir. Bu tür iyileştirilmiş tahmin, satış ve pazarlama yöneticilerinin kararlarının yanı sıra eğitim kurumlarının, hastanelerin ve diğer kuruluşların yöneticilerinin kararlarını etkileyebilir. 
ARTIRILMIŞ GÜVENLİK Çeşitli departmanlar verileri paylaşabilse de, belirli bilgilere erişim yetkilendirme kontrolü adı verilen seçili kullanıcılarla sınırlandırılabilir. Bu nedenle, örneğin, şifrelerin kullanılması yoluyla, bir öğrencinin bir üniversite veri tabanındaki mali, tıbbi ve sınıf bilgileri, yalnızca yasal olarak bilmesi gerekenlerin kullanımına sunulur.


## Veritabanı modelleri

Bir veritabanı modeli, bir veritabanının içereceği bilgileri ve bunların nasıl kullanılacağını ve veritabanındaki öğelerin birbiriyle nasıl ilişkili olduğunu belirler. 
Veritabanı modelleri; 
- Hiyerarşik
- Ağ
- İlişkisel
- Nesneye Yönelik
- Çok-boyutlu olmak üzere beş farklı modele ayrılabilir. 




## Hiyerarşik veritabanı modeli

Hiyerarşik veritabanı modeli, yaygın olarak kullanılan ilk modellerden biriydi. Hiyerarşik bir veritabanında, alanlar veya kayıtlar, bir soy ağacına benzeyen ilişkili gruplar halinde düzenlenir; alt (alt düzey) kayıtlar, üst (üst düzey) kayıtlara bağımlıdır. Veritabanının en üstündeki ana kayda, kök kayıt veya kök ana kayıt denir. 
Hiyerarşik veritabanı, beş modelden en eski ve en basitidir. 1960'lar ve 1970'lerde anabilgisayarlar tarafından kullanılan teyp depolama sistemlerine çok iyi uyum sağlamıştır. Hala birçok banka, sigorta şirketi, hastane ve devlet daireleri tarafından bazı yolcu rezervasyon sistemlerinde ve envanter ve muhasebe sistemlerinde kullanılmaktadır. 
Hiyerarşik veri tabanlarında, verilere erişmek veya verileri güncellemek çok hızlıdır, çünkü ilişkiler önceden tanımlanmıştır. Ancak yapının önceden tanımlanması gerektiği için oldukça katıdır. Veri fazlalığı ve karmaşık veri ilişkileri sorunlarını çözmek için yeni bir veritabanı modeline ihtiyaç duyulmuştur.


## Ağ veritabanı modeli

Ağ veritabanı modeli, daha karmaşık bir veri ilişkisini etkin bir şekilde temsil etmek, veritabanı performansını iyileştirmek ve bir veritabanı standardı empoze etmek için oluşturulmuştur. Ağ veritabanı kısmen hiyerarşik veritabanı modelinin bazı problemlerini çözmek için geliştirilmiştir. Bir ağ veritabanı, hiyerarşik bir veritabanına benzer, ancak her alt kayıt birden fazla ana kayda sahip olabilir.
Böylece, ağ veritabanı terminolojisinde üye olarak adlandırılan bir alt kayda, sahip adı verilen birden fazla ebeveyn aracılığıyla erişilebilir. 1971'de kurulan ve aynı zamanda esas olarak ana bilgisayarlarla da kullanılan ağ veritabanı, hiyerarşik düzenlemeden daha esnektir, çünkü farklı veri dalları arasında farklı ilişkiler kurulabilir. Bununla birlikte, yine de yapının önceden tanımlanmasını gerekmektedir. Böylece hiyerarşik modelde olduğu gibi, kullanıcının veri tabanının yapısına aşina olması gerekmektedir. Ayrıca, kayıtlar arasındaki olası bağlantıların sayısı sınırlıdır ve bir alanı incelemek için tüm kaydın geri alınması gerekir. Ağ veritabanı hiyerarşik veritabanına göre bir gelişme olsa da, veritabanı topluluğundaki bazı insanlar büyük miktarda veriyi yönetmenin daha iyi bir yolu olması gerektiğine inanıyordu.



## İlişkisel veritabanı modeli

İlişkisel veritabanı modeli, hiyerarşik ve ağ veritabanı modellerinden doğmuştur. İlişkisel veritabanı, IBM'de bir araştırmacı olan E.F.Codd’un 1970 yılında bu modele ilişkin ana hatlarını belirleyen makalesi ile doğdu. 
O zamandan beri, ilişkisel veritabanları popülerlik kazanarak bugün standart olarak kullanılır hale geldi. Hiyerarşik ve ağ veritabanı modellerinden daha esnek olan ilişkisel veritabanı, birincil anahtarların veya ortak veri öğelerinin kullanımıyla farklı satır ve sütun tablolarındaki verileri ilişkilendirir veya birbirine bağlar.
Farklı tablolardaki veriler, veritabanı tablolarını yeniden düzenlemeye gerek kalmadan birçok farklı yolla birleştirilebilir. 



## Nesneye Yönelik veritabanı modeli

Nesneye yönelik veritabanı yönetim sistemi, verilerin nesneler olarak modellenmesini ve oluşturulmasını destekler. İlişkisel model dahil olmak üzere geleneksel veritabanı modelleri, geleneksel iş durumlarında hala iyi çalışmaktadır. Ancak, mühendislik tasarımı ve üretimi, bilimsel deneyler, telekomünikasyon, coğrafi bilgi sistemleri ve multimedya gibi alanlarda yetersiz kalmaktadırlar.
Nesneye yönelik veritabanı modeli, bu uygulamaların ihtiyaçlarını karşılamak için geliştirilmiştir. Nesne yönelimli bir veritabanı, veritabanı dosyalarının içindeki öğeler olarak küçük, yeniden kullanılabilir parçalar halinde yazılmış yazılım olan “nesneleri” kullanır. 
Bir nesne şunlardan oluşur: 
• Metin, sayılar, grafikler, ses ve video dahil olmak üzere herhangi bir biçimdeki veriler. 
• Veriler üzerinde yapılacak işlemlere ilişkin talimatlar. 
Bu tür DBMS'de, bilgi öğeleri (veri nesneleri) üzerinde gerçekleştirilen işlemler, tanımlarının bir parçası olarak kabul edilir. 

## çok-boyutlu veritabanı modeli

Karar verme amacıyla büyük miktarda veriyi işlemek için çok boyutlu bir veritabanı kullanılır. Çok boyutlu bir veritabanı, verileri karar verme amacıyla büyük miktarda verinin etkileşimli analizinde kullanılmak üzere gerçekler, boyutlar veya sayısal ölçüler olarak modeller. 
Çok boyutlu veritabanları sıklıkla mevcut ilişkisel veritabanlarından gelen girdiler kullanılarak oluşturulur. Çok boyutlu veritabanı 1990'larda çevrimiçi işlemler yerine verileri analiz etmek için geliştirildi.

## Veri Madenciliği

Veri madenciliği, örüntüleri ortaya çıkarmak ve ilişkiler kurmak için büyük miktarda veriyi işlemektedir. 
Kişisel bilgisayarlarınızda kuracağınız bir veritabanı genellikle küçüktür. Ancak bazı veritabanları neredeyse hayal edilemeyecek kadar büyüktür, trilyonlarca bayt veri içerir ve her biri 1 milyon ABD Doları veya daha fazla maliyete sahip, büyük ölçüde paralel veritabanı bilgisayarlarının kullanılmasını gerektirir. 
Bu veritabanları aracılığıyla sorgulamalar yapmak, gizli kalıpları ve örüntüleri çıkarmak, anlam çıkarmak ve yeni bilgileri keşfetmek için bilgisayar destekli büyük miktarda veriyi eleme ve analiz etme sürecine veri madenciliği (DM) olarak adlandırılır. Veri madenciliği teknikleri matematik, sibernetik, genetik ve pazarlama dahil birçok araştırma alanında kullanılmaktadır. Bunların amacı geçmiş eğilimleri tanımlamak ve gelecekleri tahmin etmektir.

## Veri Madenciliği Süreci

Veri madenciliğinde, veriler aşağıdaki adımlarla elde edilir;
- Veri Kaynakları
- Veri Birleştirme Ve Temizleme
- Veri Ve Meta Veriler
- Veri Deposuna Veri Taşıma

VERİ KAYNAKLARI: Veriler bir dizi kaynaktan gelebilir: (a) ana bilgisayarlardaki dosya yönetim sistemleri tarafından yönetilen dosyalardaki işlemler, (b) her türden veritabanları ve (c) diğer - örneğin haberler haberler veya İnternet gibi çevrimiçi kaynaklar üzerinden iletilen makaleler. (d) veri ambarlarından elde edilen veriler de eklenebilir. 
VERİ BİRLEŞTİRME VE TEMİZLEME Şirket içinden (dahili veriler) veya şirket dışından satın alınmış (harici veriler) çeşitli kaynaklardan gelen veriler bir araya getirilmeli ve ardından veri temizleme veya temizleme olarak bilinen bir işlemden geçirilmelidir. Veriler, bir şirketin ana bilgisayarı gibi tek bir kaynaktan gelse bile, veriler düşük kaliteli, hatalarla ve tutarsızlıklarla dolu olabilir. Bu nedenle, veri madenciliğinin doğru sonuçlar üretmesi için, kaynak verilerin "temizlenmesi" gerekir - yani, hatalardan arındırılmış ve formatların tutarlılığı kontrol edilmelidir. 
VERİ VE META VERİLER Temizleme işlemi, hem temizlenmiş verileri hem de meta veri adı verilen bir varyasyonunu verir. Meta veriler esasen verilerle ilgili verilerdir; belirli bir veri setinin nasıl ve ne zaman ve kim tarafından toplandığını ve verilerin nasıl biçimlendirildiğini açıklar. Veri ambarlarında depolanan bilgileri anlamak için meta veriler çok önemlidir. Meta veriler, verilerin kökenlerini, geçirdiği dönüşümleri ve onunla ilgili özet bilgileri gösterir, bu da onu temizlenmiş ancak bütünleştirilmemiş, özetlenmemiş verilerden daha yararlı kılar. Meta veriler ayrıca veri ambarının içeriğini de açıklar. 
VERİ DEPOSUNA VERİ TAŞIMA Hem veriler hem de meta veriler, veri ambarına gönderilir. Veri ambarı, temizlenmiş veriler ve meta verilerden oluşan özel bir veritabanıdır. Bir ana bilgisayar verilerinin bir kopyası veya yakın bir kopyasıdır. Veri ambarı, RAID (yedekli bağımsız disk dizileri) gibi depolama teknolojisi kullanılarak diskte depolanır. Küçük veri ambarları 100 gigabayt veya daha az veri tutabilir; büyük olanlar terabaytlarca veri depolayabilir.

Depodaki veriler genellikle iki popüler algoritmadan biri veya adım adım problem çözme prosedürleri kullanılarak analiz edilir veya çıkarılır: 
• Regresyon analizi: Temel olarak, regresyon analizi bir belirli bir sayısal veri kümesi ve verilere uyan matematiksel bir formül geliştirir. Bu formül daha sonra gelecekteki durumları tahmin etmek için aynı türdeki yeni veri kümelerine uygulanır. 
• Sınıflandırma analizi: Sınıflandırma analizi, sayısal verilerden daha fazlasını içeren veri setlerine uygulanan bir istatistik örüntü tanıma sürecidir. 

