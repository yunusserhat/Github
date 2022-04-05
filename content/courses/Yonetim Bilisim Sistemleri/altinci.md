---
title: 6. Bölüm - İşletme Zekasının Temelleri: Veritabanı ve Bilgi Yönetimi 
date: '2022-01-01'
type: book
weight: 80
---

## VERİLERİN ORGANİZASYONU

Etkin bir bilgi sistemi kullanıcılarına doğru, zamanlı ve amaca uygun bilgiler sağlar. Doğruluk bilginin hatasız olması demektir. Bilginin zamanlı olması, karar vericinin ihtiyaç duyduğu anda hazır olması demektir. Amaca uygun olması, karar verilmesinde ihtiyaç duyulan bilginin o olması demektir.
Bazı işletmelerin doğru ve zamanlı bilgi sağlayamamaları, eski bilgi sistemine sahip olmaları veya bilgi sistemlerindeki verilerin iyi şekilde organize edilememesindendir. Veri yönetiminin niçin bu kadar önemli olduğunu anlamak için geleneksel veri yapısına bakmak gerekir.


## Dosya Düzenleme Kabulleri

Bir bilgisayar sistemi verileri bit, bayt, alan, kayıt, dosya ve veri tabanı hiyerarşisinde saklar. Bit; en küçük bilgi parçacığını tanımlar. Bir grup bit (8) baytı oluşturur. Bir bayt; harf, sayı veya sembol gibi bir karakteri temsil eder. Karakterlerin veya sayıların oluşturduğu gurup alan olarak adlandırılır. Bir grup ilişkili alan kayıt, aynı türden kayıtların bir araya gelmesi ise dosya olarak adlandırılır. Bir grup ilişkili dosyaların bir araya gelmesi de veri tabanını oluşturur. 

Bir kayıt bir öğeyi (Entity) tanımlar. Bir öğe ise bir kişi, alan veya bilgiye çevrilip saklanabilecek bir olay olabilir. Her bir karakteristik veya belirli bir öğeyi tanımlayan duruma özellik (Attribute) denir. Bu özelliklerin alabileceği belirli değerler öğenin alanlarında görülmektedir.

{{< figure src="images/veri_1.jpg" caption="Veri Hiyerarşisi" >}}



## Geleneksel Dosya Ortamında Problemler

Birçok organizasyonda veri dosyaları ve sistem; şirket planında olmaksızın bağımsızca büyüme eğilimindedir. Muhasebe, finans, üretim, insan kaynakları, satış ve pazarlama hepsi kendi veri dosyalarını geliştirmektedirler. Geleneksel bilgi işleme yaklaşımı gösterilmiştir.
Her bir uygulama, şüphesiz, kendi dosyalarını ve bilgisayar programlarını gerektirir. Örneğin; insan kaynakları sistemi bir ana personel dosyasına, bir maaş bordro dosyasına, bir emekli dosyasına, posta listesi dosyasına, sigorta dosyasına ve muhtemelen yüzlerce dosya ve programlara sahiptir. Finans birimi de aynı şekilde birçok dosyaya sahiptir. Bir bütün olarak işletmede bu dosyalar birçok ana dosyanın oluşturulmasına, saklanmasına, farklı bölümler ve birimler tarafından işletilmesine gereksinim duyar. Bu dosyaları sürdürmek ve yönetmek son derece zordur. Ortaya çıkan problemler; gereksiz veri tutulması, tutarsızlık, program-veri bağımlılığı, esneksizlik, zayıf veri güvenliği ve uygulamalar arasında veri paylaşımının olmamasıdır.


## Veri Gereksizliği ve Tutarsızlığı

Veri gereksizliği; aynı veriler birden fazla yerde veya alanda saklandığı için birçok veri dosyasında, tekrarlanan verilerin olması durumudur. Veri gereksizliği, bir bilginin farklı gruplar tarafından birbirlerinden bağımsız olarak toplamalarından kaynaklanır. Veri gereksizliği, saklama birimlerinin boşuna kullanılmasına ve veri tutarsızlığına neden olmaktadır. Veri tutarsızlığı; aynı öğe parçacığının farklı değerlere sahip olması durumu (bir kayda ait bir alanın bir diğer dosyada farklı değer taşıması). 
Diğer bir çatışma; farklı kodlama sistemi kullanımından doğabilir. Bir departmanda bir ürün için kullanılan kod ile aynı ürün için satış departmanında kullanılan kodun farklı olması gibi. Pazarlama departmanı giysi beden ölçüsüne XL derken satış departmanının Extra Large demesi gibi.


## Program-Veri Bağımlılığı 

Program-Veri Bağımlılığı; dosyalarda saklanması için kullanılan bir programın veri düzenleme ve güncellemesi için de kullanılması zorunludur. Bir geleneksel bilgisayar programı, verinin yerini ve yapısını belirleyerek saklar. Verilerde değişiklik için yine bu programın kullanılması gerekir. Örneğin; bir program veri dosyalarındaki posta kodunu 5 haneden 9 haneye değiştirebilir. Eğer bir orijinal veri dosyasındaki posta kodu 5 haneden 9 haneye çıkarılmış ise, uygulama programı posta kodunu 5 hane kabul ettiği için 9 haneli posta kodu programın doğru çalışmasını engelleyecektir. 



## Esnek Olmayış

Geleneksel bir dosya sistemi büyük ve yoğun bir programlama çabası sonrası rutin planlanmış raporlar üretebilir. Ancak anlık veya beklenmedik bir anda bilgi gereksinimini karşılayacak raporlar düzenleyemez. Herhangi bir anda gereken bilgi sistemde bir yerlerdedir, ancak elde edilmesi çok pahalı ve zordur. Birkaç programcı istenen verileri yeni bir dosya olarak elde etmek için haftalarca çalışmak zorundadır.


## Zayıf Güvenlik - Veri Paylaşımı ve Hazır Olma Sorunu

Verilerin yönetimi ve kontrolü az olduğundan bilginin erişimi ve yayılması kontrol dışına çıkabilir. Yönetimin işletmedeki hangi veriye kimin eriştiğini ve değiştirdiğini bilmesi mümkün olmayabilir.

Bilgi parçacıkları organizasyonun farklı birimlerinde ve farklı dosyalarında olduğu için bir diğeri ile ilişkilendirilemez. Bu durumda zamanında bilgiye erişim ve paylaşım imkansızdır. Bilgi organizasyonun farklı birimleri arasında ve fonksiyonel alanlarında serbestçe akmaz. Eğer kullanıcılar iki sistemde aynı bilgiyi farklı değerlerde buluyorlarsa bunu kullanmak istemezler, çünkü doğru olduğundan artık emin değildirler.


## VERİ YÖNETİMİNE VERİ TABANI YAKLAŞIMI

Veri tabanı teknolojisi geleneksel veri organizasyonunda çıkan problemlerin çoğunu çözer. Veri tabanının çok dikkatlice hazırlanmış bir tanımı şudur; «gereksiz verileri kontrol ederek ve veriyi merkezileştirerek birçok uygulamaya etkili bir şekilde hizmet etmek için organize edilmiş veri topluluğudur.» 
Her bir uygulama için ayrı dosyalarda veri saklamak yerine veri sadece bir yerde ve kullanıcıların görebileceği bir şekilde saklanır. Bir veri tabanı farklı uygulamalara hizmet verir. Örneğin, çalışanlarına ait bilgilerin farklı bilgi sistemlerinde personel, bordro, haklar gibi ayrı dosyalarda saklanması yerine tek bir insan kaynakları veri tabanı oluşturulabilir.


## Veri Tabanı Yönetim Sistemleri

Veri tabanı yönetim sistemi (VTYS); bir verinin etkili bir şekilde yönetilmesi ve uygulama programları tarafından erişiminin sağlanması ve merkezileştirilmesine izin veren yazılımlardır. Veri tabanı yönetim sistemi, fiziksel veri dosyaları ile uygulama programları arasında bir arayüz görevi yapar. Bir uygulama programı brüt ödeme gibi bir veriyi çağırdığında veri tabanı yönetim sistemi veri tabanı içinde o veriyi bularak uygulama programına sunar. Geleneksel veri dosyaları kullanılarak programcılar istenilen bir veriye ulaşmak için her bir verinin boyutunu formatını bilmek ve nerede saklandığını bilgisayara bildirmek zorundaydı.
Veri tabanı yönetim sistemi; programcıları ve son kullanıcıları verilerin mantıksal ve fiziksel görünüşlerinin farklılığını ve nerede saklandıklarını ve nasıl saklandıklarını bilmek ve anlamak sıkıntısından kurtarmaktadır. Mantıksal Görünüm; kullanıcılar veya işletme uzmanlarının algılayabileceği veri görüntüsünü ifade eder. Fiziksel Görünüm; verinin fiziksel ortamda gerçekten nasıl yapılandırıldığı ve düzenlediğini gösterir.


## Veri Tabanı Yönetim Sistemleri

Veri tabanı yönetim sistemi fiziksel veri tabanının kullanıcılar için gereken farklı mantıksal görünümlerini sağlar. Örneğin; şekilde gösterildiği gibi bir insan kaynakları veri tabanı, uzmanlara çalışanın ismi, sosyal güvenlik numarası ve sağlık sigortası gibi bilgileri sağlayabilir. Bir bordro birimi aynı veri tabanındaki çalışan ismi, sosyal güvenlik numarası, brüt ödeme ve net ödeme bilgilerine ihtiyaç duyabilir. Bütün bu veriler, işletme tarafından kolaylıkla yönetilebilen tek bir veri tabanında saklanmaktadır.


## Bir Veri Tabanı Yönetim Sistemi Geleneksel Dosya Ortamı Problemlerini Nasıl Çözer?

Bir veri tabanı yönetim sistemi, tekrar eden aynı değerleri bulunduran dosyaları minimize ederek tutarsızlığı ve tekrarı azaltır. Bir veri tabanı yönetim sistemi, bütünüyle veri tutarsızlığını yok edemeyebilir. Fakat tekrarı kontrol etmeye yardımcı olabilir. Organizasyonda gereksiz veriler olsa bile veri tabanı yönetim sistemi gereksiz tekrarları (aynı değerlikli) kontrol ederek tutarsızlığı ortaya çıkarabilir. Verinin tutarlılığı ve erişilebilirliği program geliştirme ve bakım maliyetlerini düşürecek, çünkü kullanıcılar ve programcılar anlık sorgulamalarda veriye ulaşabileceklerdir.


## İlişkisel Veri Tabanı

Çağdaş veri tabanı yönetim sistemi, öğelerin, özelliklerin ve ilişkilerin izlenebilmesi için farklı veri tabanı modelleri kullanır. En popüler veri tabanı yönetim sistemi modeli PC’ler için olduğu kadar büyük bilgisayarlar için de İlişkisel Veri Tabanıdır. 
İlişkisel veri tabanı iki boyutlu tablolar olarak verileri tutar. Tablolar dosyalar olarak da adlandırılabilir. 
Örneğin; Microsoft Access bir masaüstü bilgisayar için ilişkisel veri tabanı yönetim sistemi programıdır. DB2, Oracle, MsSQL Server, MySQL de birer veri tabanı yönetim sistemi yazılımıdır. 

Bir sonraki sunuda ilişkisel bir veri tabanına örnek verilmiştir. Veri tabanı TEDARİKÇİLER ve PARÇA adlı iki tablodan oluşmaktadır. Her bir tablo satır ve sütun gibi iki boyutta sahiptir. Her bir öğe için veri elemanları farklı alanlarda yer alır. Her bir alan bir öğe için bir özelliğe sahiptir. İlişkisel bir veri tabanındaki alanlar Sütun olarak da adlandırılır. TEDARİKÇİLER öğesi için tedarikçi no, tedarikçi adı, tedarikçi adresi, tedarikçi şehri, tedarikçi ülke ve posta kodu TEDARİKÇİLER tablosunda ayrı birer alanda yer alır. Her bir alan TEDARİKÇİLER öğesinin bir özelliğini gösterir. Her bir ayrı tedarikçiyi gösteren satırlarda yer alır ve Kayıt olarak adlandırılır.
Bir kaydı çağırmak, güncellemek ve sıralamak için kullanılan alana Anahtar Alan denir. Her bir tablo, bir Birincil Anahtar (Primary Key) olarak adlandırılan bir alana sahiptir. Bu birincil anahtar özgün (unique) olmalı ve tekrarlanan olmamalıdır. TEDARİKÇİLER tablosu için bu alan Tedarikçi No’sudur. PARÇA tablosu için Birincil Anahtar; Parça Numarasıdır. Bir tabloda Birincil Anahtar olan alan bir diğer tabloda da yer alıyorsa o tablodaki adı Yabancı Anahtar (foreign key) olur. PARÇA tablosundaki Tedarikçi No alanı TEDARİKÇİ tablosunun birincil anahtarı olduğundan bu tablodaki adı Yabancı Anahtardır.

{{< figure src="images/veri_2.jpg" caption="İlişkisel Veri Tabanı" >}}

## Nesneye Yönelik Veri Tabanı Yönetim Sistemi (NYVTYS)

Bugün çoğu uygulamalar sadece metin ve sayısal karakterlerin saklanmasını gerektirmemekte aynı zamanda resim, ses, video, grafik gibi nesneleri de gerektirmektedir. Veri tabanı yönetim sistemi, satır ve sütun yapısında tasarlandığından grafik tabanlı multimedya uygulamalarının işlenmesi için çok iyi değildir. Nesneye yönelik veri tabanı yönetim sistemi bu durum için iyi bir çözüm olabilir.
Nesneye yönelik veri tabanı yönetim sistemi multimedya objelerini otomatik olarak döndüren ve paylaşan veri ve prosedürleri saklar. Nesneye yönelik veri tabanı yönetim sistemi giderek popüler olmaya başlamıştır. Çünkü Web uygulamaları, Java nesnelerini kullanabilmektedir. Nesneye yönelik veri tabanı yönetim sistemi ilişkisel veri tabanından daha karmaşık bilgiler saklayabilmesine rağmen çok sayıda işlemi veya kaydı işlemeleri ilişkisel veri tabanı yönetim sistemlerine göre daha yavaştır. Hibrid nesne tabanlı veri tabanı yönetim sistemleri, hem ilişkisel hem de nesneye yönelik veri tabanı yönetim sistemlerinin yeteneklerini ve imkanlarını sağlayabilmektedir.


## Veritabanı Yönetim Sistemlerinin Yetenekleri

Bir veri tabanı yönetim sistemi veri tabanındaki verilere erişmek, düzenlemek ve yönetmek için çeşitli araçlara ve özelliklere sahiptir. En önemlisi ise veri tabanı yönetim sistemlerinin veri işleme (manipulation), veri sözlüğü ve veri tanımlayabilme özelliklerine sahip olmasıdır.
Veri tabanı yönetim sistemi bir veri tabanını içeriğinin yapısını belirlemek için Veri Tanımlama yeteneğine sahiptir. Bu yetenek her bir tabloda alanların karakteristiklerini tanımlamak ve veri tabanı tablolarında kullanmaktır. Bu bilgi ayrıca veri sözlüğünde yazılı halde de bulunur. Bir Veri Sözlüğü veri elemanlarının karakteristiklerini ve özelliklerinin yazılı olduğu el ile veya otomatik olarak oluşturulan dosyalardır.
Microsoft Access basit bir veri sözlüğüne sahiptir. Bu sözlük verinin adını, boyutunu, tipini ve formatını her bir alandaki elemanlar için belirtmektedir. Veri sözlükleri büyük kurum veri tabanları için verinin elde edilmesinden kimin sorumlu olduğunu gösteren sahiplik, yetki, güvenlik, bu veri elemanını kullanacak işletme fonksiyonunun neler olduğu gibi ilave bilgileri de saklar.


### Bilgisayar Donanım Platformları

İş bilgisayarlarının çoğu, Intel Corporation ve daha az bir ölçüde AMD Corporation tarafından üretilen veya tasarlanan mikroişlemci yongaları kullanılarak gerçekleştirilmiştir. 
Intel ve AMD işlemciler genellikle "i86" işlemciler olarak anılır çünkü orijinal IBM bilgisayarları bir Intel 8086 işlemci kullanır ve bunu izleyen tüm Intel (ve AMD) yongaları bu işlemciyle aşağı doğru uyumludur. (Örneğin, dün satın aldığınız yeni bir bilgisayarda 10 yıl önce tasarlanmış bir yazılım uygulamasını çalıştırabilmelisiniz.)
2001'de iPod, 2007'de iPhone ve 2010’da iPad ile bilgisayar platformu önemli ölçüde değişmiştir. Bu cihazlar, tüketici cihazlarına dayalı ikinci bir bilgisayar donanımı platformu olarak düşünebilirsiniz. Mobil cihazların, ilk bilgisayar donanımı platformundaki bilgisayarlar kadar çok görevi yerine getirmeleri gerekmediğinden, daha az güç tüketirler ve daha az ısı üretirler. Mobil cihazlar için işlemciler, ARM Holdings tarafından tasarlanan bir mimari kullanılarak Apple, Samsung ve Qualcomm dahil olmak üzere çok çeşitli firmalar tarafından üretilmektedir. Büyük hacimli işlemleri güvenilir ve emniyetli bir şekilde idare ederek, çok büyük miktarlarda veriyi analiz etmek ve bulut bilgi işlem merkezlerinde büyük iş yüklerini işlemek için kullanılabiliyorlar. 

## Veri Tabanlarının Tasarımı

Bir veritabanı oluşturmak için veri tabanını oluşturacak verilerin türlerinin, veriler arasındaki ilişkilerin, verinin nasıl kullanılacağının, kurumsal bakış açısıyla verinin nasıl değiştirilebileceğinin ve yönetilebileceğinin anlaşılması gerekir. Veri tabanı hem kavramsal tasarım hem de fiziksel tasarım aşamalarını gerektirir. Kavramsal veya mantıksal tasarım işletme bakış açısından verilere bir soyut bakış açısını gösterir. Veri tabanını fiziksel tasarımı ise saklama aygıtlarında verinin gerçekten nasıl saklanacağının tasarlanmasıdır.



## İlişkisel Olmayan Veritabanları, Bulut Veritabanları ve Blokzincir

30 yılı aşkın süredir ilişkisel veritabanı teknolojisi altın standart olmuştur. 
Bulut bilişim, benzeri görülmemiş veri büyüklükleri ve iş yüklerine web hizmetleri sunabilmek geleneksel ilişkisel veritabanı modeline alternatif oluşturmaktadır. Şirketler bu amaçla ilişkisel olmayan "NoSQL" veritabanı teknolojilerine yöneliyor. İlişkisel olmayan veritabanı yönetim sistemleri daha esnek bir veri modeli kullanır ve birçok dağıtılmış makinede büyük veri kümelerini yönetmek ve kolayca ölçeklendirmek veya büyütmek için tasarlanmıştır. 
Her biri kendi teknik özelliklerine ve davranışına sahip birkaç farklı türde NoSQL veritabanı vardır. Oracle NoSQL Veritabanı, bulutta çalışan Amazon Web Hizmetlerinden biri olan Amazon'un SimpleDB'si gibi bir örnektir. SimpleDB, birden çok veri kümesi oluşturmak ve depolamak, verileri kolayca sorgulamak ve sonuçları döndürmek için basit bir web hizmetleri arabirimi sağlar. Resmi bir veritabanı yapısını önceden tanımlamaya veya daha sonra yeni veriler eklenirse bu tanımı değiştirmeye gerek yoktur. 


## Bulut Veritabanları ve Dağıtılmış Veritabanları

Amazon ve diğer bulut bilişim satıcılarının sağladığı hizmetler arasında ilişkisel veritabanı motorları vardır. Amazon Relational Database Service (Amazon RDS), veritabanı motorları olarak MySQL, Microsoft SQL Server, Oracle Database, PostgreSQL veya Amazon Aurora'yı sunar. Oracle, ilişkisel Oracle Veritabanını kullanan kendi Veritabanı Bulut Hizmetlerine sahiptir ve Microsoft Azure SQL Veritabanı, Microsoft SQL Server DBMS tabanlı bulut tabanlı bir ilişkisel veritabanı hizmetidir. Bulut tabanlı veri yönetimi hizmetleri, kurum içi veritabanı ürünlerinden daha düşük bir maliyetle veritabanı yetenekleri arayan web odaklı girişimler veya küçük ve orta ölçekli işletmeler için özel bir çekiciliğe sahiptir.
Dağıtılmış bir veritabanı, birden çok fiziksel konumda depolanan bir veritabanıdır. Veritabanının parçaları veya kopyaları fiziksel olarak bir yerde saklanır ve diğer kısımlar veya kopyalar başka yerlerde saklanır. Spanner, verileri tüm konumlarında tam olarak senkronize etmek ve verilerin her zaman tutarlı olmasını sağlamak için özel zaman tutma araçlarıyla dünyanın dört bir yanındaki yüzlerce veri merkezindeki milyonlarca makinede bilgi depolamayı mümkün kılar. Google, Google Fotoğraflar, AdWords (Google'ın çevrimiçi reklam sistemi) ve Gmail dahil olmak üzere çeşitli bulut hizmetlerini desteklemek için Spanner'ı kullanıyor ve şu anda bu teknolojiyi küresel bir işletmeyi yürütmek için bu tür yeteneklere ihtiyaç duyabilecek diğer şirketlerin kullanımına sunuyor.


{{< youtube 8T3Y1F7d5DU&t=320s >}}

