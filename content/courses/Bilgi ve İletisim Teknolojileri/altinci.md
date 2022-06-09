---
title: 6. Bölüm - Yazılım
date: '2021-01-01'
type: book
weight: 80
---

Yazılımlar genel olarak ikiye ayrılmaktadır. 

Uygulama yazılımı: Uygulama yazılımı, kullanıcılar için belirli bir sorunu çözmek için, belirli görevler üzerinde yararlı işler gerçekleştirmek veya eğlence sağlamak için geliştirilmiş yazılım türü.
Sistem yazılımı: Sistem yazılımı, bilgisayarınızın en temel seviyesinde çalışan ve uygulama yazılımının bilgisayarla etkileşime girmesini sağlayan ve bilgisayarın iç ve dış kaynaklarını yönetmesinin yanı sıra donanımı yönetmesine yardımcı olan yazılım türü.




<!--more-->

# Sistem yazılımı

İşletim sistemleri: Bir işletim sistemi, herhangi bir bilgi işlem sistemindeki sistem yazılımının temel bileşenidir. 
Aygıt sürücüleri: Aygıt sürücüleri, bilgisayarın çevresel aygıtları kontrol etmesine yardımcı olur. 
Yardımcı programlar: Yardımcı programlar genellikle bir bilgisayar sistemindeki mevcut programları desteklemek, geliştirmek veya genişletmek için kullanılır.


## İşletim sistemleri

İşletim sistemi (operating system=OS), bilgisayarın temel işlemlerini yöneten düşük-seviyeli, ana program sisteminden oluşur. 
Bu programlar, birçok türde kaynak yönetimi hizmetleri sağlar. Özellikle, disk alanı, bellek, işlemci ve çevresel aygıtlar dahil olmak üzere donanım kaynaklarının kontrolünü ve kullanımını idare ederler. Her genel amaçlı bilgisayar, diğer programları çalıştırmak için bir işletim sistemine sahip olmalıdır. İşletim sistemi, arayüzü aracılığıyla, bilgisayarı yönetmenin karmaşıklığı yerine kendi görevlerinize veya uygulamalarınıza konsantre olmanızı sağlar. Her uygulama programı, belirli bir işletim sistemi üzerinde çalışacak şekilde yazılmıştır. 
Farklı boyut ve yapıdaki bilgisayarların kendi işletim sistemleri vardır. Örneğin, PC'ler Windows veya Linux çalıştırır; Apple, Macintosh işletim sistemini çalıştırır; Chromebook'lar ve Chromebox'lar, Chrome OS çalıştırır. 
Akıllı telefonlar ve diğer mobil cihazlar Apple iPhone iOS, Windows Phone, BlackBerryOS ve Android gibi kendi işletim sistemleri vardır. Birkaç istisna dışında, bir tür donanım için yazılmış bir işletim sistemi başka tür bir makinede çalışmayacaktır.

Kişisel bilgisayar satışlarının hızla düşmektedir. Alıcıların bilgisayar ihtiyaçlarını karşılamak için mobil cihazlara (akıllı telefonlara ve tabletlere) yöneldiği de açıktır. Bu eğilim, Microsoft ve Dell gibi bilgisayar yazılımı ve donanımı üreticileri üzerinde büyük mali baskı oluşturmaktadır.  Aynı zamanda, mobil işletim sistemleri evreninde de büyük rekabeti teşvik etmektedir. 
Örneğin, Dünyanın en büyük akıllı telefon pazarı olan Çin, şimdiye kadar Google'ın Android işletim sisteminin hakimiyetindedir. Samsung ve Lenovo, Huawei gibi çok satan telefonlara hizmet vermektedir. Google başkanı Eric Schmidt, "Android ile hedefimiz herkese ulaşmaktır" demiştir. 

Farklı işletim sistemlerini ayrıntılı olarak tartışmadan önce, işletim sistemlerinin ne işe yaradığına dair sunulara bakabiliriz; 
Önyükleme (Booting)
CPU yönetimi 
Dosya yönetimi 
Görev yönetimi 
Güvenlik yönetimi

### Önyükleme

Önyükleme Bir bilgisayarı açtığınızda, önyükleme yaparsınız, yani işletim sistemi yüklenmeye başlar. İşletim sisteminin çalışması, bilgisayarı açtığınız veya "önyüklediğiniz" anda başlar. Önyükleme ("önyüklemeden"), bir işletim sistemini bilgisayarın ana belleğine yükleme işlemidir. Bu yükleme, bilgisayarın elektronik devresinde kalıcı olarak depolanan programlar tarafından otomatik olarak gerçekleştirilir. Makineyi açtığınızda, tanılama rutinleri adı verilen programlar, düzgün çalıştıklarından emin olmak için ana belleği, merkezi işlem birimini ve sistemin diğer parçalarını test eder. Daha sonra, BIOS ("temel giriş / çıkış sistemi" için) programları ana belleğe kopyalanır ve bilgisayarın klavye karakterlerini yorumlamasına veya karakterleri görüntüleme ekranına veya diske aktarmasına yardımcı olur. Daha sonra önyükleme programı, işletim sistemini genellikle sabit diskten alır ve onu, siz bilgisayarı kapatana kadar kaldığı bilgisayarın ana belleğine yükler.

### İşlemci Yönetimi 

CPU, merkezi işlem birimidir. İşletim sisteminin temel bileşenidir. 
İşletim sistemi aynı zamanda belleği de yönetir. Programların ve verilerin depolandığı ana bellekteki konumların kaydını tutar. Bilgisayarınızın sabit diskinin bir bölümü gibi, ana bellek ile ikincil depolama arasında veri ve program bölümlerini sözde sanal bellek olarak değiştirebilir. Bu özellik, bir bilgisayarın yalnızca en acil ihtiyaç duyulan verileri ve programları ana bellekte tutmasına izin verir

### Dosya Yönetimi

Her işletim sistemi veya program, dosyaları düzenlemek ve izlemek için bir dosya yönetim sistemi kullanır. 
Dosya, veri dosyası veya sabit disk gibi bir bilgisayarın ikincil depolamasında bulunan bir program dosyasıdır. Veri dosyalarının örnekleri, kelime işlem belgeleri, elektronik tablolar, resimler, şarkılar ve benzerleridir. Program dosyalarının örnekleri, bir kelime işlemci programı veya bir elektronik tablo programıdır. 
DOSYALARI BULMA VE İŞLEME: İşletim sistemi tüm dosyaların saklama konumunu kaydeder. Bir dosyayı taşır, yeniden adlandırır veya silerseniz, işletim sistemi bu tür değişiklikleri yönetir ve onu bulmanıza ve ona erişmenize yardımcı olur. Örneğin, dosyaları ve programları bir diskten diğerine kopyalayabilir veya çoğaltabilirsiniz. Bir diskin içeriğini yedekleyebilir veya bunun bir kopyasını oluşturabilirsiniz. Artık kullanışlı olmayan herhangi bir dosya veya programı bir diskten silebilir veya kaldırabilirsiniz. Diskteki dosyaları yeniden adlandırabilir veya yeni dosya adları verebilirsiniz. 
DOSYALARI DÜZENLEME: KLASÖRLER, ALT KLASÖRLER & YOLLAR İşletim sisteminin dosya sistemi dosyaları hiyerarşik bir şekilde düzenler, önce klasörler (dizinler de denir) ve sonra alt klasörler (alt dizinler) halinde düzenler. En üstteki klasör / dizine kök dizin adı verilir; başka bir klasörün altındaki bir klasöre alt klasör (alt dizin) adı verilir; bir alt klasörün üzerindeki herhangi bir klasör, üst klasörü (ana dizin) olarak adlandırılır. Bir işletim sisteminin dosya sistemindeki belirli bir dosyayı bulmak için dosyanın yol adını yazarsınız. Örneğin: C:/mydocuments/dersler/bilgi/hafta5.pptx şeklindedir.


### Görev Yönetimi

İşletim sistemi, bilgisayarın gerçekleştirdiği görevlerin yöneticisidir. Bir bilgisayarın aynı anda birçok farklı görevi (çoklu görev) gerçekleştirmesi gerekir. Örneğin kelime işlemede, girdi verilerini kabul eder, verileri bir diskte depolar ve görünüşte eşzamanlı olarak bir belgeyi yazdırır. Çoğu masaüstü ve dizüstü işletim sistemi, aynı anda birden fazla programı idare edebilen tek kullanıcılı sistemlerdir. Her program, ekranda ayrı bir pencerede görüntülenir. 

### Güvenlik yönetimi

İşletim sistemleri, kullanıcıların bilgisayarlarına erişimi kontrol etmelerine olanak tanır. Özellikle birkaç kişi bir bilgisayarı veya aynı bilgisayar ağını paylaştığında bu güvenlik için önemli bir konudur. 
Kullanıcılar, e-postalarına erişirken olduğu gibi, bir kullanıcı adı (kullanıcı kimliği) ve bir parola aracılığıyla erişim kazanır. İş yerinde bilgisayar kullanıyorsanız, kendini bir şifre oluşturabilirsiniz. Yeni bir kişisel bilgisayarı ilk kez başlattığınızda, işletim sistemi sizden bir kullanıcı adı ve şifre seçmenizi isteyecektir. Ardından, her seferinde bilgisayarınızı başlattığınızda, kullanıcı adınızı ve şifrenizi yazmanız istenecektir. Bazı işletim sistemleri, ayrı dosyaları ayrı erişim parolalarıyla korumanıza bile izin verir. 


## Diğer sistem yazılımları

- Sürücüler
- Yardımcı Programlar

Sürücüler ve yardımcı programlar, bilgisayarınıza işlevsellik ekler ve daha iyi performans göstermesine yardımcı olur. Sistem yazılımının üç ana parçasının işletim sistemi, aygıt sürücüleri ve yardımcı programlar olduğunu söylemiştik. Şimdi son ikisini ele alalım. 


### Aygıt Sürücüleri

Aygıt Sürücüleri: Aygıt sürücüleri çevre birimlerle iletişim kurar. Aygıt sürücüleri, giriş ve çıkış aygıtlarının bilgisayar sisteminin geri kalanıyla iletişim kurmasına izin veren özel yazılım programlarıdır. Her cihazın markası ve modeli, yalnızca tek bir işletim sistemiyle çalışan farklı bir sürücü tarafından desteklenir. Bir bilgisayar satın aldığınızda birçok temel aygıt sürücüsü sistem yazılımıyla birlikte gelir (önceden yüklenmiş olarak gelir) ve sistem yazılımı, gerekli sürücüleri seçme ve yükleme konusunda size rehberlik edecektir. Çoğu yeni işletim sistemi, birçok yeni donanım aygıtını kendi başlarına tanır ve bunları otomatik olarak kurar. İşletim sisteminiz yeni donanımınızı tanımazsa, bir mesaj görüntüler ve sizden donanımınızı sürücüyü yüklemenizi ister. 



### Yardımcı programlar

Yardımcı Programlar: Yardımcı programlar, destekleyici roller oynayan küçük programlardır. Hizmet programları olarak da bilinen yardımcı programlar, bilgisayar kaynaklarının kontrolü, tahsisi ve bakımı ile ilgili görevleri gerçekleştirir. Mevcut işlevleri geliştirirler veya diğer sistem yazılım programları tarafından sağlanmayan hizmetleri sağlarlar. Çoğu bilgisayar, sistem yazılımının bir parçası olarak yerleşik yardımcı programlarla birlikte gelir. Ancak, harici yardımcı program olarak ayrı olarak da satın alınabilir. Yardımcı programlar tarafından gerçekleştirilen görevler arasında verileri yedekleme, dosyaları sıkıştırma, kayıp verileri kurtarma ve donanım sorunlarını tanımlama yer alır. 


## İşletim sistemlerinde Ortak özellikler

- Özel amaçlı tuşlar (Esc, Ctrl, Alt, Del, Ins, Home, End, PgUp, PgDn, Num Lock ve diğerleri)
- İşlev Tuşları (F1, F2, …)
- Makrolar
- Fare 

## Yaygın İşletim sistemleri

Genel bilgisayar kullanıcıları için ana işletim sistemleri Windows, Mac OS ve Unix / Linux'tur. Platform, bir bilgisayar sisteminin dayandığı belirli işlemci modeli ve işletim sistemidir. Apple Macintosh bilgisayarlar “Mac platformlarıdır”; Microsoft Windows çalıştıran kişisel bilgisayarlar (Dell, Hewlett-Packard, Lenovo) "Windows platformları" veya "PC platformları" dır. Büyük bilgisayar sistemleri genellikle "Unix / Linux platformları" dır. İşletim sistemleri üç prensip ile ayrışabilir; 

- Bağımsız çalışan
- Ağ
- Gömülü

Bağımsız İşletim Sistemleri: Genellikle masaüstü işletim sistemi olarak adlandırılan bağımsız bir işletim sistemi, tek bir masaüstü veya dizüstü (dizüstü) bilgisayarda çalışan bir işletim sistemidir. Bazı bağımsız işletim sistemleri ayrıca ağ (veya sunucu) işletim sistemleriyle birlikte çalışır ve bu nedenle istemci işletim sistemleri olarak adlandırılır. Pazarın% 90'ına sahip olan Microsoft Windows, günümüzde özellikle ofislerde kullanılan en popüler bağımsız işletim sistemidir. Bununla birlikte, üniversite öğrencileri arasında Apple Macintosh OS en popülerden birisidir. 

Ağ İşletim Sistemleri (NetworkOperatingSystems): OES, Windows Server, Unix ve Linux, kısaca NOSlar, bir ağ işletim sistemleri, bilgisayarları ve cihazları bir yerel alan ağına (LAN) bağlamak için özel işlevler içeren sistemlerdir. Şimdiye kadar açıklanan işletim sistemleri, esas olarak bağımsız masaüstü ve dizüstü bilgisayar makinelerinde kullanılmak üzere tasarlanmıştır. 
NOS sistemler büyük ağlarla çalışmak üzere tasarlanmıştır. 

Gömülü İşletim Sistemleri; genelde cep telefonu gibi küçük veya özel cihazlarda kullanılmaktadır. Gömülü bir işletim sistemi, ROM (salt okunur bellek) yongası adı verilen bir CPU yongasında bulunur ve akıllı telefonlar ve tabletler dahil olmak üzere tüketici elektronik cihazlarında kullanılan işletim sistemlerdir. Taşınabilir cihazlarda kullanılan gömülü işletim sistemlerine mobil işletim sistemleri de denir. 
Bu işletim sistemlerinden en iyi bilinenlerinden bazıları; Google Android, iOS ve Windows Phone'dur. 

# Uygulama Yazılımları

Uygulama yazılımı, kullanıcılar için belirli bir sorunu çözmek, belirli görevler üzerinde yararlı işler gerçekleştirmek için geliştirilmiş yazılımdır. 
İnsanlar, esas olarak, bilgisayarla etkileşime giren sistem yazılımıyla etkileşime giren uygulama yazılımıyla etkileşime girerler.

Uygulama yazılımlarını zaten her gün, bir akıllı telefonda, bir tablette, bir dizüstü bilgisayarda kullanıyoruz. 
Bu tür bir yazılımın çeşitli kullanımları vardır. İş amaçlı kullanım, kişisel ve eğitim amaçlı kullanımlar, iletişim için kullanım, oyun için kullanım gibi. Uygulama yazılımların kaynakları; 
- Özel yazılımlar, 
- Paketlenmiş yazılımlar, 
- Kamu lisanslı yazılımlar, 
- Ücretsiz yazılımlar, 
- Paylaşımlı yazılımlar, 
- Kiralık yazılımlar,
- Web uygulaması

## Özel yazılımlar

Zaman zaman şirketler veya bireyler, benzersiz ihtiyaçları karşılamak için kendileri için özel olarak yazılmış yazılıma ihtiyaç duyarlar. Özel yazılım, daha sonra açıklanacağı gibi hazır veya paketli yazılım satın alarak hizmet verilemeyen belirli bir işlev veya iş amacı için bir kişi veya programcı ekibi tarafından hazırlanmış özel olarak tasarlanmış bir yazılımdır.


## Paketlenmiş yazılımlar 

Özel mülk yazılım veya ticari yazılım olarak da adlandırılan paketli yazılım, çeşitli kullanıcılara mağazalarda veya web'de satışa sunulan, telif hakkıyla korunan, toplu üretilen yazılımdır. Örnek olarak; müşterilere genellikle yeni bilgisayarlarına önceden yüklenmiş olarak gelen Microsoft Office veya Adobe Reader'dır. Paketlenmiş yazılımlarda dört farklı lisanslama olabilir. Bunlar; 
- Yer lisansı 
- Eşzamanlı kullanım lisansı 
- Çoklu kullanıcı lisansı 
- Tek-kullanıcı lisansı 

## Kamu Lisanslı yazılımlar

Telif hakkı ile korunmayan ve bu nedenle herhangi bir kişi tarafından yasal korku olmaksızın çoğaltılabilen yazılımlardır. Bazen devlet kurumları veya üniversiteler tarafından geliştirilen ve genellikle web'den indirilebilen bu tür programlar, yazılımı oluşturanlar tarafından halka bağışlanmıştır.

## Ücretsiz yazılımlar 

Genellikle İnternet üzerinden dağıtılan, yazılım telif hakkıyla korunan yazılımlardır. Kullanıcıların ihtiyaçlarına cevap verme, bazı bilimsel veya insani yardım amacıyla veya kullanıcıları çekerel reklamlardan para kazanmayı umarlar.  Örneğin: web tarayıcıları; Internet Explorer ve Mozilla Firefox ücretsiz yazılımdır.

## Paylaşımlı yazılımlar

Birincil olarak İnternet üzerinden dağıtılan paylaşımlı yazılımlar, deneme süresi boyunca ücretsiz olarak dağıtılan telif hakkıyla korunan bir yazılımdır. Ancak kullanıcıların kullanmaya devam edebilmesi için yazılım geliştiricisine ödeme yapması gerekir. Diğer bir deyişle, satın almadan önce deneyebilirsiniz. Ücreti ödedikten sonra, genellikle destekleyici belgeler, güncellenmiş sürümlere erişim ve belki de bazı teknik destek alırsınız. 

## Kiralık yazılımlar

Kullanıcıların bir ücret karşılığında kiraladıkları ve istedikleri zaman indirdikleri çevrimiçi yazılımlardır. Örneğin Microsoft, Office 365 olarak bilinen ofis programları paketini bir abonelik sistemi haline getirdi. Abone avantajlarıyla birlikte, düzenli olarak güncellemeler ve eklenen özellikler gelir. 

## Web uygulaması

Bir web uygulaması, bir kişinin kendi kişisel bilgisayarı yerine uzak bir İnternet sunucusunda çalışan bir yazılımdır. Bir web uygulamasına her zaman olmamakla birlikte genellikle bir web tarayıcısı kullanılarak erişilir. Bulut bilişim geliştikçe web uygulamaları da popülaritesini arttırmaktadır.


# Veri Dosyaları ve Program Dosyaları 

Veri dosyaları, veri içerir. 
Program dosyaları, çalıştırılabilir yazılım talimatları içerir. 
Uygulama yazılımına sahip olmanın nedeni, ham verileri aldıktan sonra bunları yararlı bilgi dosyasına dönüştürmek. 

Veri dosyaları, sözcükler, sayılar, resimler veya sesler gibi verileri içeren dosyalardır. Veri dosyaları bilgisayara herhangi bir şey yapma talimatı vermez. Program dosyalarına göre hareket etmek için var olurlar.  
Örneğin; kelime işlemcisi olarak oluşturulan bir ödev ‘bilgiveiletisimodev’ adı verilirse buna o belgenin hangi program tarafından tanımlandığını ifade eden bir uzantı eklenir. Bu Word için .doc veya .docx olmaktadır. 

Bazı örnek dosya çeşitleri; 
Belge dosyaları: Sözcük işlem programları tarafından oluşturulan bu veri dosyaları belgelerden oluşur: Dosya adları genellikle .doc veya .docx ile biter.
Çalışma kitabı dosyaları: Elektronik tablolar tarafından oluşturulan bu veri dosyaları genellikle bütçeler, satış tahminleri ve programlar gibi sayısal veri koleksiyonlarından oluşur. Microsoft Excel elektronik tablo dosyalarının dosya adları .xls veya .xlsx ile biter.
Veritabanı dosyaları: Veritabanı yönetim programları tarafından oluşturulan bu veri dosyaları, öğrenci adları, adresler, not ortalamaları vb. gibi çeşitli yararlı yollarla analiz edilebilen ve görüntülenebilen organize verilerden oluşur.  Veritabanı programı Microsoft Access için dosya adları .mdb,. accdb veya mdbx. 
Grafik dosyaları: Bazı önemli dosyaların uzantı adları .bmp, .tiff (tif.), .gif, .jpeg ve .png'dir.
Ses dosyaları: En çok karşılaştığınız uzantı adları .mp3, .wav ve .mid'dir.
Animasyon / video dosyaları: Yaygın dosya uzantıları .qt, .mpg, .wmv, .avi ve .rm'dir. 
Diğer dosyalar: Grafik içermeyen ve kalın veya italik gibi biçimlendirme içermeyen salt metin dosyaları, bu tür dosyalar .txt (metin için) uzantısını kullanabilir. World Wide Web üzerinden taşınan dosyalar. Uzantılar arasında .html, .htm, .xml ve .asp (etkin sunucu sayfası) bulunur. PDF (Portable Document Format; Taşınabilir Belge Biçimi) dosyaları: Her tür belge değişimi için ve ayrıca HTML sayfalarından bağımsız olarak indirilen ve okunan belgeleri web üzerinde yayınlamak için kullanılan dosyalar. Bu dosyalar .pdf uzantısını kullanır. 


