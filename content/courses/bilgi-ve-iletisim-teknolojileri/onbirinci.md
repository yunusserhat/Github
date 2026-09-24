---
title: 11. Bölüm - Bulut Bilişim
date: '2022-01-01'
type: book
weight: 130
---

Bu hafta son yıllarda sıkça duyduğumuz belki de farkında olmadan kullandığımız bulut bilişim konusunu inceleyeceğiz. 
Son yıllarda sıkça duymaya başladığımız, mobil teknolojiler ile belki de herkesin farkında olmadan kullandığı bu olgunun ilk örnekleri 2000’li yıllara kadar uzanıyor. Salesforce.com isimli bir girişim, oluşturduğu işletme bilgi sistemini kullanıcılara internet aracılığı ile kullandırma fikri ilk örneklerden birisi olarak tarihe geçiyor. Ancak bu teknolojinin yaygınlaşmasında elbette İnternet teknolojilerinin payı oldukça fazladır. Bulut bilişim ifadesindeki bulut ismini ilk kimin kullandığı hakkında tam bir bilgi bulunmamakta ancak kimi çevrelerde bilgi sistemlerinin gösteriminde kullanılan şemalarda internetin bulut sembolüyle gösterilmesi nedeniyle bu adın kullanıldığı belirtiliyor. Internet ulaşımının yaygınlaşması ve hızının artması ile yaygınlaşan bulut bilişimin görevi bilişim kaynaklarının bulut değer zincirinde yer alan tüketicilere, paydaşlara ya da sağlayıcılara paylaşımının sağlanmasıdır. 
Bu hafta, bulut sisteminin tanımı yapılarak sistemin özellikleri, bileşenleri ve altyapısına yer verilecektir. Kullanıcılara bilişim hizmetlerini ulaştırma modellerine de yer verilecektir. Ünitenin bir diğer amacı da bu yeni teknolojinin iş ve bireysel hayatta kullanım örneklerine yer vermektir. 


<!--more-->

## Bulut Bilişim ve Özellikleri

İnternet üzerinde bir hizmet olarak sanallaştırılmış, ölçeklendirilebilir kaynakları ifade eden bulut bilişim için farklı tanımlar yapılmıştır. Amerika Birleşik Devletleri Ulusal Standartlar ve Teknoloji Enstitüsü’nün (NIST) yaptığı bulut bilişim tanımı yaygın olarak kullanılan tanımdır. 2009 yılında yapılan bu tanıma göre bulut bilişim “en az yönetimsel çaba ve hizmet sağlayıcı etkileşimi ile hızlı bir biçimde sağlanabilen ya da bırakılabilen ayarlanabilir bilişim kaynaklarından oluşan paylaşılabilir bir havuza, uygun koşullarda ve istenildiğinde zaman ve mekân kısıtı olmaksızın ağ erişimi sağlayan bir model” olarak tanımlanır. 
Bulut bilişimin özellik ve yapılanmasından bahsetmeden önce bilişim sistemlerinin gelişim süreçlerine değinmek yerinde olacaktır. Yanda görülen şekilde, bilişim sistemlerinin ortaya çıkışından günümüze kadar altı farklı paradigma yer almaktadır. 
İlk aşama olarak gösterilen dönemde verilerin depolandığı ve uygulamaların çalıştırıldığı tek bir ana bilgisayar ve ona kullanıcıların ulaşımını sağlayan terminaller kullanılmaktaydı. Bunlar maliyeti yüksek ve etkililiği düşük olan bilgisayar sistemleriydi. 1980’li yıllarda teknolojik gelişmeler bilgisayarların boyutunun ve fiyatının küçülmesine neden olmuştur. 

Şekilde ikinci aşama olarak gösterilen o dönemde, PC olarak adlandırılan kişisel bilgisayarlar yaygın olarak kullanılmaya başlandı. 
3. aşamada ise 1990’larda bilgisayarların yerel ağlar üzerinden birbiri ile haberleştiği yeni bir çağa girildi. Ayrıca bilgisayarların programlamasında kullanılmaya başlanan görsel programlama olanakları bilişim alanındaki gelişmelere ivme kazandırmıştır. 
4. aşamada ise kişisel bilgisayarlar, küresel ölçekte bir ağın üyesi olmuşlardır. Internet ismi verilen bu büyük ağ ile yeni bir bilişim ve iletişim çağının başladığını söylemek yanlış olmayacaktır. İnternet kullanıcıların uzaklardaki uygulama ve kaynakları kullanmalarını olanaklı kılmıştır. İnternetin sağladığı olanaklar 
2000’li yıllardan sonra dağıtımlı bilişim sistemleri (grid computing) gibi yaklaşımları ortaya çıkarmıştır. Farklı türdeki donanımların bir araya getirilerek tek bir sistem gibi davranmasını sağlayan bu yaklaşım bilişim sistemlerinin verimliliğini arttırıcı yönde bir rol oynamıştır. Yine aynı yıllarda kamu hizmeti bilişimi (utility computing), barındırma hizmeti (hosting) gibi yaklaşımlar kurumların bilişim hizmetlerini dış kaynaklardan temin etmelerini ve maliyeti azaltmalarını sağlayan gelişimler olmuştur. 

Günümüzde yaygın olarak kullanılan ölçeklenebilir bir şekilde internet üzerinden kaynak paylaşımının sağlandığı bilişim paradigması ise bulut bilişimdir. 
Bilişim sistemlerinin gelişimlerini özetleyen bu altı aşamaya bakıldığında ilk aşamadaki ana bilgisayar ile bulut bilişimin birbirine benzediği görülmektedir. Ancak bu iki paradigma arasından önemli farklılıklar bulunmaktadır. Ana bilgisayarlar sınırlı kapasite sağlarken bulut bilişim sınırsız hesap gücü ve depolama alanı sağlayabilmektedir. Diğer bir fark ise ana bilgisayar sisteminde ilkel terminaller aracılığı ile kullanıcı ara yüzü sağlanırken bulut bilişimde kullanıcılar güçlü kişisel bilgisayarlar ya da mobil cihazlar ile sistemi kullanmaktadırlar. 

Son yıllarda kurum, işletme ve bireylerin bilişim hizmeti olarak faydalandığı bulut bilişimin genel özellikleri aşağıda sıralanmıştır. 
• İstenildiğinde ve kendi kendine hizmet: Tüketicilerin dilediği zaman ihtiyacı olan bilişim hizmetini herhangi bir bireye ihtiyaç olmadan otomatik olarak alabildiği bir hizmettir. 
• Geniş ağ erişimi: Farklı türdeki istemcilerin (PC, tablet, mobil telefon) hizmet almasına olanak sağlayacak ağ yapısına sahiptir. 
• Kaynak havuzu: Bulut hizmeti sağlayan tedarikçiler tüketicinin değişen bilişim ihtiyaçlarının karşılanmasına yönelik alt yapıyı oluştururlar. Bölgesel olarak farklı noktalarda bulunan merkezlerde depolama, işlemci, hafıza ve bant genişliği sağlayan donanımlara kaynak havuzu denilmektedir. 
• Çabukluk ve esneklik: Bilişim sisteminin olası taleplere karşı esnek ve hızlı olması gerekmektedir. Bu sayede günümüzün yüksek tempodaki iş dünyasının ihtiyaçlarına çözüm sağlayabilmektedir. 
• Ölçülebilir hizmet: Bulut sistemlerinin tüketiciye sağladığı hizmetler ölçülebilir olmalıdır. Tüketicinin kullandığı kaynaklar kendisine raporlanarak şeffaf bilişim hizmeti sunulabilir. 


## Bulut Bilişim Bileşenleri ve Alt Yapısı

Bulut bilişim yapısal açıdan bakıldığında üç bileşenden oluşur. Yan tarafta yer alan şekilde gösterildiği gibi kullanıcı bilgisayarları, veri merkezleri ve dağıtık sunucular bulut bileşimin temel öğeleridir. 
Bu bileşenler ve özellikleri kısaca anlatılarak daha sonra bilişim sistemleri altyapıları konusuna geçilecektir.

Kullanıcılar: Bulut bilişim mimarisinde kullanıcılar, her gün kullandığımız bilgisayarları ifade etmektedir. Masaüstü bilgisayarlar, istemciler, dizüstü ve tablet bilgisayarlar, cep telefonları ve diğer internete bağlı cihazlar bulut üzerindeki bilgilerinizi yönetmek için kullandığımız aygıtlardır. İstemci olarak da adlandırılan bu cihazlar bulut teknolojilerinin yaygınlaşması ile birlikte giderek daha basit, hafif ve kullanışlı hale gelmektedirler. Günümüzde özel bir kullanım gerekçesi olmadığı sürece daha düşük düzey donanımları kullanmanın faydaları aşağıdaki gibi sıralanabilir. 
• Düşük donanım maliyeti: İnce istemciler, tablet bilgisayarlar masaüstü bilgisayarlara göre daha az donanım içerirler. Daha az hammadde kullanılarak üretilen bu cihazların maliyeti de daha düşük olmaktadır. 
• Güvenlik: Sabit sürücü barındırmayan bu cihazların çalınması, bozulması ya da kaybolması durumunda verinin kaybolması ya da başkalarının eline geçmesi engellenmiş olur. 
• Daha az enerji tüketimi: İnce istemci, tablet ya da yeni nesil cihazların ısı üretimi oldukça azdır. Isı üretim miktarları da enerji tüketimi ile doğru orantılıdır. 
• Daha az gürültü: Sabit disk ve soğutucu fanların kullanılmaması bu cihazların daha sessiz çalışmalarını sağlamaktadır. 
• Bakım ve tamir kolaylığı: Cihazların hafifliği, yedek parçasının az olması bakım ve onarım kolaylığı sağlamaktadır. 

Veri Merkezleri: İçinde çok sayıda sunucuyu barındıran, depoladığı verinin güvenliğini ve sürekliliğini sağlamak amacıyla güçlü ve yedekli elektrik, iklimlendirme ve iletişim alt yapısı bulunan tesislere verilen isimdir. Bir kurumun bilişim ihtiyaçlarının karşılanmasına yönelik kurulan özel veri merkezlerinin yanı sıra internet üzerinden farklı kuruluşlara hizmet veren veri merkezleri bulunmaktadır. Bu merkezler verdikleri hizmetin kalite ve sürekliliğini sağlamak için bir takım standartlara uymak durumundadır. ABD Telekomünikasyon Endüstrisi Birliği (TIA) TIA-942 kodu standartları ile veri merkezlerinin sağlaması gereken minimum gereklilikleri belirlemekte ve veri merkezlerini akredite etmektedir. 
TIA-942 veri merkezlerinin altyapı gereksinimlerini 4 farklı düzey için belirlemiştir. Dört farklı düzeyin gereksinimleri sırası ile %99,671, %99,741, %99,982 ve %99,995 oranında kullanılabilirliği sağlamak üzere belirlenmiştir. Bu oranları bir yıl üzerinden dakika olarak hesaplarsak (365gün*24saat*60dk.=525.600 dk) en fazla kullanım dışı kalma süreleri düzeyler için sırası ile 1729 dk. (525.600*(1-0,99671)), 1361dk., 95 dk. ve 26dk olarak hesaplanır. Örneğin dördüncü düzey standartına uyacak bir veri merkezinin bir yıl içerisinde en fazla toplam 26 dakika hizmet aksaması olacak şekilde tasarlanmalıdır. 

Dağıtık Sunucular: Küresel ölçekte bulut hizmeti veren kuruluşların veri merkezlerinin bir bina ya da bölgede olması mümkün değildir. Bu kuruluşların farklı şehir, bölge ve hatta kıtada veri merkezlerinin olması hem ulaşım hem de erişim açısından önemli bir gerekliliktir. Bu sayede herhangi bir nedenle sorun oluşan veri merkezindeki verilere farklı merkezlerden ulaşabilme olanağı sunulmuş olur. Ayrıca bazı politik nedenler de veri merkezlerinin konumunu belirlemede önemli olabilmektedir. 


## Bulut Bilişim Altyapısı

Görsel, Bulut Bilişimde yer alan donanım (sanallaştırma ve çok çekirdekli çipler), İnternet teknolojileri (Web hizmetleri, hizmet temelli mimariler, Web 2.0), dağıtık bilişim (Grid bilgi işleme) ve sistem yönetimi (otonom bilişim ve veri merkezi otomasyonu) gibi altyapıya ilişkin kavramları göstermektedir. 

Dağıtık Bilişim (Distributed Computing): Dağıtık bilişim sistemlerinin temel amacı farklı sistemlerdeki işlemci güçlerini, ağ kapasitelerini ve depolama alanlarını tek bir büyük sistem olarak yönetilmesini sağlamaktır. Birbirine benzemeyen birçok sayıdaki bilgi sistemi bu yapılar sayesinde tek bir sanal işlem gücü oluşturur. Grid bilgi işleme tekniği olarak da anılan bu yapılar yönettiği alt sistemler arasında iş paylaşımı yaparak tüm sistemlerin verimli olarak kullanılmasını sağlar. Bu amaçla da dağıtık birçok sistem arasında iletişimi sağlayacak iletişim protokolleri bulunur. Dağıtık bilişim sistemlerinin temel üstünlükleri aşağıda sıralanmıştır. 
• Çözülmesi zaman isteyen problemleri kısa sürede çözebilir. 
• Farklı bilgi sistemleri ile kolayca işbirliği yapabilir. 
• Mevcut donanımların verimli olarak kullanılmasını sağlar. 
• İhtiyaçlara göre ölçeklenebilir bir kapasite sunar. 

İnternet Teknolojileri: Web hizmetleri farklı ortamlardaki uygulamaların birbirleri ile iletişimini sağlamak için ortaya çıkarılmış bir hizmettir. Bu yapı sayesinde internet üzerindeki birçok web sayfası farklı konumlardaki sistemlerle belirli protokoller sayesinde haberleşebilmekte ve veri alış verişi yapabilmektedir. Ancak farklı sistemler arasında haberleşmenin daha etkin gerçekleştirilebilmesi, komutların tekrarlı olarak kullanılabilmesi mümkün değildi. Bu eksiği gidermek üzere hizmet odaklı mimari yapısı kullanılmaya başlandı. 
Hizmet odaklı mimari (SOA - Service Oriented Architecture), uygulamaların modül ve fonksiyonlarını diğer uygulamalarında kullanabileceği şekilde tasarlayan bir mimaridir. WEB 2.0, API (uygulama programlama ara yüzü) gibi bir çok internet teknolojileri bulut mimarisinin oluşturulmasında önemli bir role sahiptir. Örneğin bir web sayfasında ya da bir mobil uygulamada harita üzerinde adres gösterimi için yazılım geliştirici Google Haritalar bulut hizmetinin API desteğini kullanarak bu yapıyı kullanabilmektedir. 

Donanım: Bulut bilişim hizmetlerinin arka planında büyük ölçekli veri merkezlerinde bulunan binlerce sunucu bulunmaktadır. Bu veri merkezleri çok sayıda kullanıcının ya da uygulamanın taleplerini karşılamak üzere yapılandırılmıştır. Veri merkezlerinin bu devasa görevin üstesinden gelebilmesi için yararlanılan teknolojilerin başında sanallaştırma gelir. 
Sanallaştırma işlemci, depolama aygıtı, ağ donanımı, sunucu ve hatta uygulama yazılımı gibi kaynakların gerçek donanımı kullanan sanal bir hizmet olarak kullanıcılara sunulmasını sağlayan bir uygulamadır. Bu sayede bir kaynak birçok parçaya bölünerek daha küçük sanal kaynak olarak kullanılabilmekte ya da dağıtık olan çok sayıdaki kaynak tek bir kaynak olarak birleştirebilmektedir. 
Yan tarafta altta görülen görselde, bir sunucuda birden fazla işletim sisteminin sanallaştırıldığı bir yapı yer almaktadır. Bu yapıda fiziksel bir donanımda çok sayıda farklı işletim sistemi sanal olarak barındırılmaktadır. Sanal olarak barındırılan bu işletim sistemlerine sanal makine adı verilmektedir. Sanal makine işletim sistemleri ile gerçek donanımının arasında sanallaştırma yazılımları görev görmektedir. Hipervizör ismi de verilen sanallaştırma ortamları gerçek fiziksel kaynakları, belirlenen politikalar ve kurallar çerçevesinde sanal makinalar arasında paylaştırır. 
Çok fazla ayrıntısına yer vermeyeceğimiz olan sanallaştırma teknolojilerinin bulut bilişim açısından faydaları aşağıda sıralanmıştır. 
• Sistem kaynaklarının verimli kullanılması ile enerji tasarrufu sağlar ve doğayı korur. 
• Kurumsal kullanıcıların ihtiyacı kadar kaynak kullanımına olanak sağlar. 
• Sunucuların ilk kullanım için daha hızlı hazırlanmasını sağlar. 
• Sanallaştırılmış sistemler geleneksel sistemlere göre daha yüksek performans sağlar. 
• Geleneksel sistemlere göre yüksek kullanılabilirlik oranına sahiptir. 
• Yedekleme ve felaket kurtarmada fiziksel sistemlere göre daha avantajlıdır. 

Sistem Yönetimi: Bulut bilişim gibi karmaşık yapıdaki sistemlerinin yönetilmesini kolaylaştıracak, insanların en az müdahalesini gerektirecek sistem arayışlarının sonucunda otonom bilişim kavramı ortaya çıkmıştır. 
Otonom sözcüğünün kelime anlamından da anlaşılacağı üzere bu sistemler, genel politikaları insanlar tarafından belirlenen kendi kendini yönetebilen sistemlerdir. Otonom bilişim bu faaliyetleri gerçekleştirirken ağ kaynağı, işlemci gücü, enerji tüketimi, açığa çıkan ısı gibi farklı veri kaynaklarından topladığı verileri sistemin yönetiminde kullanabilmektedir. 

## Hizmet Sunum Modelleri

Bulut bilişim kurum ya da bireylerin bilişim hizmetlerinin kullanıcının bilişim kaynaklarında değil internet aracılığı ile özelleştirilmiş merkezlerde yapılması anlayışına dayalıdır. Bu nedenle kullanıcıya sağlanan bilişim olanak ve kaynakları hizmet olarak adlandırılır. Sunulan bilişim kaynakları hizmet olarak üretildiği için adlandırılmalarında ve kısaltmalarında “hizmet olarak” ifadesi yer alır. İngilizce karşılığı olan “as a service” ifadesinin baş harfleri hizmetlerin kısaltmasında yer almaktadır. 
Bulut bilişimin başlıca 3 temel hizmet sunum modeli olan ilk üç hizmeti açıklanacaktır. 
Aşağıdaki başlıca bulut bilişim hizmetleri ve kısaltmaları yer almaktadır. 
• Altyapı hizmeti (IaaS - Infrastructure as a Service) 
• Platform hizmeti (PaaS-Platform as a Service) 
• Yazılım hizmeti (SaaS - Software as a Service) 
• Depolama hizmeti (STaaS - Storage as a Service) 
• Veritabanı hizmeti (DBaaS - Database as a Service) 
• Tümleştirme hizmeti (IaaS - Integration as a Service) 
• Güvenlik hizmeti (SECaaS- Security as a Service) 
• İş Süreci hizmeti (BPaaS - Business Process as a Service) 
• Test hizmeti (TaaS - Testing as a Service) 

Altyapı Hizmeti (IaaS): Kullanıcının talep ettiği oranda işlem gücü, depolama alanı, bant genişliği, hafıza kaynaklarının hizmet olarak sunulmasıdır. Bir diğer deyişle bulut üzerinde sanal olarak çalışan ve kaynak miktarı kullanıcının talebine göre ayarlanmış bir sunucu, kullanıcının hizmetine sunulur. Sanal bir işletim sisteminin yönetilmesi için tüm yetkiye sahip olan kullanıcı, bilişim faaliyetlerine uygun olarak sunucusunun yapılandırması, yazılımların kurulması ve ilgili servislerin kurulumunu gerçekleştirir. Bulut altyapı hizmeti modelinde faturalama genellikle kullanılan sanal sistemin kaynak tüketimine dayalı olarak belirlenir. 
Bulut bilişim alanında dünyada öncü kuruluş olan Amazon, Elastic Compute Cloud (EC2) isimli bulut çözümü ile IaaS modeli ile dünyanın her noktasında bilişim hizmeti sunan önemli bir kuruluş olarak bilinir. 

Platform Hizmeti (PaaS): Bir önceki kısımda bahsettiğimiz ham bilgisayar ve depolama alanı sunan altyapı yönelimli IaaS bulut hizmetinden farklı olarak PaaS hizmeti kullanıcılara kolay programlama ortamı sunmak için soyutlanma düzeyi yüksek bir ortam sunar. 
Bu hizmet türünde kullanıcılar kendilerine sunulan programlama ortamını kullanarak yazılım gerçekleştirirler. Kullanıcı bu görevi için ne kadar hafıza ya da işlemcinin gerekli olduğunu bilmesi gerekmez. Kullanıcının uygulama yazabileceği kaynaklar (programlama ortamı, veritabanı, depolama alanı) sistem tarafından sağlanmaktadır. 
Yaygın olarak kullanılan Google App Engine hizmeti Google’ın altyapısı üzerinde kullanıcıların uygulama geliştirerek çalıştırabildikleri bir PaaS örneğidir. Geliştiriciler bu platform üzerinde Pyhton, Java, PHP ve Go programlama dillerini kullanma olanağına sahiptir. Platform maliyeti kullanılan kaynak ile ilişkilendirilerek belirlenir. 

Yazılım Hizmeti (SaaS): Bulut uygulama hizmeti ya da SaaS kısaltması ile anılan bulut yazılım hizmeti en yaygın kullanılan ve en hızlı büyüyen pazarlardan birisidir. Bu modelde uygulamalar kullanıcılara web aracılığı ile ulaştırılır. Bu sayede bulut kaynaklarını kullanan yazılım kullanıcıya bir web tarayıcı vasıtası ile ulaşır. 
Google Dokümanlar ve Office 365 kullanıcılara web üzerinden ofis yazılımları olanağı sunan en çok bilinen SaaS uygulamalarındandır. SaleForce.com müşteri ilişkileri yönetimi, gmail ve hotmail web e-posta hizmetlerini yine aynı model ile kullanıcılarına sunan uygulamalardır. 
Bu model kurumların ve yazılım maliyetlerinin yanı sıra sunucu ve donanım giderleri bakımından avantaj sağlamaktadır. Yazılım hizmeti modelinde ücretlendirme “kullandığın kadar öde” ya da periyodik ödeme yöntemleri ile gerçekleştirilmektedir. Son yıllarda hayatımızı kolaylaştıran mobil cihazlarda çalıştırdığımız uygulamalar da SaaS hizmet modeli ile çalışmaktadır. Bu uygulamalar web üzerinden cihaza yüklenmekte, cihazın dahili hafızasında barındırılmakta ancak yazılımın güncellenmesi ve bakımı yine bulut üzerinden yönetilmektedir. 
SaaS modelinin avantajlarını aşağıda gibi sıralamak mümkündür: 
• Kullanıcılar alışkın oldukları Web tarayıcı ara yüzünü kullanırlar. 
• Kullanıcılar ölçeklenebilir hizmetleri tükettikleri ölçüde öderler. 
• Kurumlarda daha az bilişim uzmanı ile daha etkin çalışma imkânı sunar. 
• Organizasyonların ihtiyacına uygun olarak uyarlanabilmektedirler. 
• Uygulama yazılımı üreten girişimler için büyük fırsatlar yaratırlar. 

## Bulut Bilişim Yayılım Türleri

Bulut bilişim hizmetleri onu kullanacak kuruluş ya da işletmenin iş süreçlerine, gizlilik koşullarına, müşteri türüne göre farklı yayılım modelleri ile sunulur. 
Bireysel kullanıcıdan işletmelere, devlet kurumlarından teknoloji üreticilerine bilişim hizmetlerinin yapısı değişebilmektedir. ABD Ulusal Standartlar ve Teknoloji Enstitüsü tarafından dört bulut yayılım türü tanımlanmıştır. 
Kamu Bulutu: Kamu ya da dışsal bulut en yaygın kullanıma sahip bulut türüdür. Herkesin kullanımına açılmış bulut bilişim hizmetleridir. Bu hizmetler bir devlet kurumunun vatandaşlarına hizmetlerini ulaştırması için oluşturabileceği gibi Google, Microsoft ve Amazon gibi şirketlerin bireysel bilişim hizmetleri için oluşturdukları bulut yapılarıdır. 
Özel Bulut: Bir organizasyonun özel kullanımı için oluşturulmuş bulut bilişim türüdür. İç bulut ismi de verilen özel bulutların kurulması, yönetilmesi ve yürütülmesi sahibi tarafından ya da dış hizmetin alındığı kuruluşlar tarafından gerçekleştirilir. Veri merkezi ve sunucular dış ortamdan bir güvenlik mekanizması tarafından korunur. 
Topluluk Bulutu: Bu yapı Grid Bilişim ve Gönüllü Bilişim paradigmalardan türemiş bir buluttur. Ortak noktaları olan bireylerin altyapılarını ortak bir amaç için bir araya getirirler. Bu sayede gerekli olan bilişim maliyetlerini paylaşarak daha verimli bir bilişim sistemi oluştururlar. Bir sosyal toplum kuruluşu, dernek ya da 3.şahış şirketler tarafından oluşturulabilir. 
Melez Bulut: Kamu ve özel bulut karmasından oluşan bulut sistemidir. Görselde gösterildiği gibi iki farklı özellikte bulutun kendi sınır ve özelliklerini koruyarak bağlanması ile oluşturulur. İşletme ya da organizasyonun kritik verileri ve uygulamaları güvenlik duvarının ardındaki özel bulutta, genel erişime sunulan veri ve uygulamalar dış bulutta konumlandırılır. 




## Bulut Bilişimin Üstünlük ve Sınırlılıkları

Bulut bilişimin ortaya çıkışı ve büyümesi bilgi ve iletişim teknolojilerindeki eğilimlerle yakından ilgilidir. Mobil teknolojilerin yaygınlaşması, sosyal medya uygulamaları, akıllı cihaz ve araçların yaygınlaşması son yıllarda üretilen veri miktarını arttırmıştır. 
Bu açıdan bakıldığında bilişim sektöründeki kullanılan geleneksel teknolojilerin yerini neden bulut teknolojilerinin aldığını anlamak zor olmayacaktır. Bulut teknolojileri yukarıda bahsettiğimiz devasa verinin ki buna bilişim dünyası büyük veri (big data) ismini veriyor, saklanması, işlenmesi ve bilgiye dönüştürülmesi için altyapı sağlamaktadır. 
Bilişim alanındaki bu gelişmelerin kurumlara ve bireylere sağladığı faydalardan bahsetmeden önce bu yapıların doğayla olan etkilerine değinmekte fayda vardır. Bulut bilişimin bilgi işleme süreçlerini belirli merkezlere toplamasıyla şüphesiz geleneksel sistemlere oranla daha verimli bilgi sistemleri oluşturulmaktadır. Özellikle bulut bilişimin ölçeklenebilirliği tüketilen enerji miktarında tasarruf sağlayabilecek yapıdadır. Ancak bu sektördeki büyüme düşünüldüğünde tüketilen enerji miktarlarının giderek arttığını tahmin etmek zor değil. Yeşil bilişim kavramı bu sektörün doğaya en az zararı vermesine yönelik bir oluşumdur. Bu alan bilgisayarların merkezi işlemcisinin tükettiği enerjiden, veri merkezlerinin enerji kaynakları kullanımına kadar doğaya verilen zararı en aza indirmesini sağlayacak çabaları kapsamaktadır. 

Bulut teknolojilerinin kullanıcılara, işletmelere ve kurumlara sağladığı faydalar aşağıda belirtilmektedir;
Düşük Maliyet: Bilişim hizmetlerini bulut bilişime aktarmak kurumların bilişim hizmetlerine yönelik yaptıkları yönetim ve bakım maliyetlerini düşürmektedir. Kurumun bilgi sistemlerinin kurulmasında harcanan tesis, donanım ve altyapı harcamaları en aza inecektir. Ayrıca bilişim sistemini yürütmekle ilgili aşağıdaki maliyet kalemlerinde tasarruf sağlanabilecektir. 
• Sistem güncellemeleri, yeni donanım ve yazılım 
• Uzman personel için ödenecek ücretler 
• Tüketilen enerji miktarı 
• Sistemin duraklamalarının neden olduğu maliyetler   


Ölçeklenebilirlik: Kurumun bilişim ihtiyaçlarının değişken olması işlemci ya da depolama alanına olan ihtiyacın artmasına ya da azalmasına neden olabilir. Kurumun kendi bilişim donanımlarını barındırması durumunda ek bilişim kaynaklarını (işlemci, hafıza, depolama alanı, bant genişliği) satın alması gerekirken bulut bilişimde bu ihtiyacı bulut sistemi otomatik olarak arttırıp azaltabilecektir. 
Devamlılık: Kurumların veri ve bilgi sistemlerinin koruması iş süreklilik planlarının önemli bir parçasıdır. Kurumlar doğal afet, güç kesintileri veya kriz durumları konusunda ne kadar tecrübeli olsalar da verilerin ve yazılımların bulut üzerinde bulunması güvenliğinin sağlanması ve kolayca geri getirebilmeye olanak verir. 
Birlikte Çalışma: Bulut bilişimin sağladığı birlikte çalışma olanakları geleneksel bilgi sistemlerine oranla kurum faaliyetlerinde iletişim ve paylaşımı kolay hale getirmektedir. Bulut bilişim coğrafi olarak farklı merkezlere yayılmış organizasyonların iş süreçlerinin verimliliğine önemli katkı sağlayabilmektedir. 
İş Uygulamalarında Esneklik: Bulut bilişim çalışanlara iş uygulamalarında esneklik sağlar. Çalışanlara ihtiyacı oldukları verilere evlerinden, tatilden ya da herhangi bir konumdan internete bağlanmak koşulu ile anında ulaşma imkânı sağlamaktadır. 
Yenileme ve Güncelleme: Bulut hizmetlerinin satın alındığı sağlayıcılarla yapılan anlaşmalarda yazılım ve donanım güncelleme seçeneklerinin göz önüne alınması uzun dönem için oldukça önemlidir. Yeni yazılım ve donanımla çalışmak kuruluşlara yeni fırsatları da beraberinde getirecektir. 

Bulut bilişimin faydalarını özetlediğimiz bu uzun liste birçok birey ve kuruluşu bulut bilişim fikri konusunda heveslendirmektedir. Ancak bulut bilişimin kullanılabilmesinde bazı sınırlılıklar bulunmaktadır.
Bu sınırlılıklar aşağıda maddeler halinde sıralanmıştır. 
• Ağ bağlantısı bağımlılığı: İnternet bağlantısı bulut bilişim ile çalışacak kurumlar için hayati öneme sahiptir. İnternet ağlarındaki yavaşlama bile hizmetlerin yavaşlamasına neden olacak kurum veya işletmenin hizmet kalitesinin düşmesine neden olabilecektir. 
• Güvenlik: Bulut hizmeti sağlayıcılarının en yüksek güvenlik standartlarını sağlamalarına rağmen depolanan verinin ve önemli dosyaların kurum dışında olması her zaman riske açık bir durumdur. Hacker olarak isimlendirilen bilgisayar korsanları bulut sistemlerindeki güvenlik açıklarını kötüye kullanarak kurumların değerli bilgilerini ele geçirebilmekte, değiştirebilmekte ve silebilmektedir. Bilişim dünyasında önemli kuruluşların müşteri bilgilerinin çalındığı haberleri güvenlik sorununun önemli kanıtlarından sayılabilir. 
• Çevre birimler: Yazıcı, tarayıcı ve benzeri çevre birimleri bulut yapısı ile uyum göstermeyebilir. Yerel bilgisayarlarda bu tür cihazların bulut uygulamaları ile kullanımını sağlamak üzere ek yazılımlara ihtiyaç olabilir. Yeni tasarlanan çevre birimlerinde kablosuz bağlantı ve mobil cihaz etkileşimi bu sorunu çözebilmektedir. 
• Maliyet: Küçük hacimli bilişim faaliyetlerinin bulut hizmetlerine transfer edilmesi maliyet açısından dezavantajlı olabilmektedir. Girişimcilerin iş hacimlerine göre doğru bulut hizmetini seçmelerini ya da bulut dışı çözümleri tercih etmelerini gerektirebilir. Ayrıca bulut bilişim yatırımlarının uzun dönemde kârlı hale gelebileceği hesaba katılmalıdır. 
• Sağlayıcıya bağımlılık: Bulut hizmet sağlayıcılar müşterilerinin mevcut bilişim hizmetlerinin bulut ortamına kolayca aktarılacağı ya da dönüştürüleceği sözünü verseler de bazı durumlarda bu kolay olmamaktadır. Teknolojik engeller sistemlerin dönüşümünde önemli sorunlar çıkarabilmektedir. 
• Yasal sorunlar: Bulut bilişimle ilgili bir diğer önemli boyut ise yasal konulardır. Bu konudaki en önemli tartışmalardan biri bulut ortamında depolanan verinin sahibinin kim olduğudur. Verinin sahibi yükleyen mi yoksa veriyi barındıran bulut bilişim sağlayıcı mı? Bu sorun hala bulut bilişim sağlayıcı ve hizmet alan arasında düzenlenen sözleşmelerde belirsizlik taşıyabilmektedir. 


## Son Kullanıcılar ve Bulut Uygulamaları

Bulut bilişimde kullanıcı ve kurumların tüketeceği çok çeşitte ve sayıda hizmet yer almaktadır. Bunların bir kısmı uzmanlık gerektiren uygulama geliştirme, sanal sunucu yapılandırma, web sayfası oluşturma ve yönetme, e-posta hizmetleri yönetimi gibi geliştirme ve yönetme yönlü hizmetler olabilmektedir. Diğer taraftan bulut depolama, medya depolama ve yayını, bilimsel hesaplama olanağı, verimlilik araçları hizmetlerini bulut bilişim hizmetlerde bireysel kullanıcıların beğenisine sunulan hizmetler olmaktadır. 
Bu bölümde ise son kullanıcıların bilişim ihtiyaçları için geliştirilen çözümlere yer verilerek öğrenci, ya da farklı meslek alanlarında çalışanların bu hizmetlerden yararlanmasını sağlayabilecek bilgilere yer verilecektir. 



## Bulut Tabanlı Depolama

Günümüz bilişim dünyasında veri depolama için doyumsuz bir açlık vardır. Bu açlık fotoğraf ve video çekimi, sayısal iletişim, web sayfaları gibi çok sayıda kaynak tarafından beslenir. 
Günümüzde üretilen verinin büyük bir çoğunluğu bulut tabanlı sistemlerde depolanmaktadır. Bulut tabanlı depolama (bulut depolama) yazılımlar yoluyla oluşturulmuş mantıksal havuzlardır. Gerçekte veriler birden çok sayıda farklı konumlardaki veri merkezlerinde saklanır. Servis sağlayıcı bu verilerin korunmasından, saklanmasından ve erişilebilirliğinden sorumludur. Bulut depolama sistemleri genellikle yönetimli ve yönetimli olmayan depolama olarak iki grupta kategorize edilir. Yönetimli depolama sanal geliştirme ortamları veya ve sanal makinelere bir disk gibi konumlandırılabilen depolama çözümleridir. Yönetimli depolamada kullanıcılar depolama alanını sistemlerinde bir disk olarak kullanabilirler. Yönetimli olmayan depolama ise kullanıcıların web üzerinde ya da yardımcı yazılımlar ile ulaşabildikleri nispeten ucuz ve kullanımı oldukça kolay bulut depolama hizmetleridir. 
Henüz bulut depolama terimi kullanılmazken 1990’lı yıların sonunda internet üzerinden disk alanı sağlayan hizmetler kullanılmaya başlanmıştır. Depolama Hizmet Sağlayıcı (SSP- Storage Service Provider) adıyla yeni bir hizmet olarak ortaya çıkan çevrimiçi depolama, şirketlerin veri merkezlerine yatırım yapmasını sağlamıştır. 
Son kullanıcılar bu hizmetlere önce ftp (dosya transfer protokolü) hizmeti aracılığı ile çevrimiçi birimler olarak kullanmış ve daha sonra da web sayfaları ile verilere ulaşma imkânı bulmuşlardır. Günümüzde çok sayıda bulut depolama hizmeti kullanıcı ve işletmeler tarafından kullanılmaktadır. Yan tarafta yer alan görselde en yaygın kullanıma sahip bulut depolama hizmetleri ve özellikleri yer almaktadır. Tabloda belirtilen kullanım sınırları teknolojik gelişme ve şirket politikalarına göre değişebilmektedir. 

Bulut depolama araçlarının bireysel kullanımı için uygulanması gereken adımlar hemen hemen aynıdır. Öncelikle ihtiyacınıza göre bir bulut depolama hizmeti seçilmelidir. Seçim yapıldıktan sonra hizmeti sunan şirketin sayfasındaki talimatları izlemek gerekmektedir. 
Aşağıda bir bulut paylaşımının kullanımına yönelik adımlar geneli kapsayacak şekilde hazırlanmıştır. 
• İlgili bulut hizmet sağlayıcının web sayfasına gidilir. 
• Bulut depolama için bir hesap oluşturulur. 
• Hesap oluşturma bir e-posta ile doğrulanıyorsa e- postanıza gelen onaylama linkine tıklanır. 
• Kişisel bilgisayar için senkronizasyon aracı yüklenerek kurulur. 
• Mobil cihazlar için ilgili uygulama market den kurulur. 

Bulut depolama hesabı oluşturulduktan sonra kullanıcılar depolama hesaplarına farklı yöntemlerle ulaşabilmektedir. Web tarayıcılar bunun en kolay ve hızlı yöntemidir. Web tarayıcı kullanılarak ulaşılan depolama hizmetlerini bilgisayarındaki herhangi bir dosyayı ya da klasörü web tarayıcı ekranına taşıyarak yüklemeniz ya da web tarayıcıda görüntülenen dosyalarınızı bilgisayarınıza taşıyarak indirmeniz mümkündür. 
Herhangi bir kurulum gerektirmeyen bu basit yöntem özellikle kişisel bilgisayarınız dışındaki bilgisayarlarda uygulanabilecek bir kullanım şeklidir. 
Bulut depolama araçlarının bir kullanım türü de ilgili servis sağlayıcının uygulamasının indirilerek kişisel bilgisayara kurulmasıdır. Bu yazılımlar kullanıcı bilgisayarındaki bir klasör ile kullanıcının bulut hesabındaki depolama alanını birbiriyle eşit hale getirir. Bu işlemi yaparken dosyaların en son güncellenen sürümü asıl dosya olarak kabul eder. Bu sayede birden fazla bilgisayar ya da mobil cihazdan dosyaların son sürümüne ulaşmak söz konusu olmaktadır. 

Kullanıcılara mekân bağımsız olarak çalışma olanağı sunan bulut depolamanın üstünlükleri aşağıda sıralanmıştır. 
Maliyet: Yedekleme çözümleri oldukça gelişmiştir. Özellikle taşınabilir depolama araçlarının kaybolma riski büyüktür ve veri kaybının maliyeti oldukça yüksektir. 
Güvenlik: Yerel veri depolamaya göre daha güvenlidir. Verilerin depolanması ve transferi sırasında veriler şifrelenerek güven altına alınır. 
Erişilebilirlik: Dosyalara internet erişimi olan her cihazdan ulaşma imkânı sağlar. Akıllı telefonlar, tabletler ile mobil ortamlarda dosyalara erişim sağlanabilir. 
Senkronizasyon: Belgede yapılan değişiklikler tüm bilgisayarlara anında senkronize edilir. 
Birlikte çalışma: Dosyaların paylaşılması ve aynı dosya üzerinde çalışma olanağı sağlar. 

Bulut depolama araçları birçok bulut hizmeti ile uyumlu çalışmaktadır. 
Örneğin Google e-postası ile gelmiş bir belgeyi bulut depolama alanınıza kaydetmeniz mümkün olabilmektedir. Bulut depolama hizmetlerinin kullanıldığı bir alan da dosya transfer hizmetleridir. 
Özellikle e-posta ile gönderilme sınırının üstündeki fotoğraf, video vb. dosyaların transferi için kullanılan bir hizmettir. 
Dosya kullanımı için özelleştirilmiş bu hizmetlerde dosyalar belirli süre sonra (gönderdiğiniz kullanıcının dosyayı alması için tanınan sürenin sonunda) buluttan silinmektedir. 

## Verimlilik Yazılımları

Ofis araçları ya da verimlik yazılımları günümüzün en önemli yazılım kategorilerinden biridir. 
Çevrimiçi verimlilik yazılımları ya da ofis yazılımlarının kullanıcı bilgisayarında çalışan geleneksel ofis yazılımına göre faydaları aşağıda sıralanmıştır. 
• Genellikle kullanıcılar için daha düşük maliyetlidir. 
• Web tarayıcı üzerinde çalıştığı için platform bağımsızdır (tüm işletim sistemlerinde çalışır). 
• Yazılımların güncellenmesi ve düzeltilmesi merkezi olarak yapıldığından kullanıcı sürekli güncel sürüm kullanır. 
• Belge paylaşımı aynı bulut sistemi kullananlar için çok kolaydır. 
• Aynı belge üzerinde aynı anda birçok kullanıcı birlikte çalışma olanağına sahiptir. 
• Mobil cihazlarla kullanım için uygundur. 
• Yedekleme ve sürüm saklama özellikleri veri kaybını engeller. 

Belgelere erişimde internet bağlantısının zorunlu olması, yazılım sürüm değişiminin kullanıcının tercihinin bulunmaması, kullanım hızının daha düşük olması bulut ortamındaki yazılımların sınırlılıkları olarak görülmektedir. Online verimlilik araçları kullanıcıların bireysel olarak kullanabileceği ya da üyesi oldukları organizasyonların sağlayacağı çevrimiçi hizmetleri kullanabilmektedir. Devam eden bölümde yaygın olarak kullanılan bulut ortamındaki verimlilik araçları kısaca tanıtılacaktır. Sizler de bu araçları iş ve günlük hayatınızda işlerinizi kolaylaştırması amacıyla kullanabilirsiniz. 

## Google Verimlilik Araçları 

Google’ın sunduğu ofis ve verimlilik araçları hem birey hem de kurumsal ihtiyaçları karşılamaya yönelik bütünleşik bulut çözümleridir. Kullanıcıların Google hizmetlerinden faydalanabilmesi için öncelikle bir Google hesabı oluşturması gerekmektedir. Google hesabını oluşturan kullanıcılar aşağıda sıralanan hizmetleri çevrimiçi olarak kullanabilmektedirler (http://www.google.com/about/products/). 
Aşağıdaki uygulamalara ek olarak mobil cihazlar için geliştirilmiş ek çözümler de Google tarafından kullanıcılara sunulmaktadır.  
• Ofis uygulamaları: 
Dokümanlar: MS Word ya da pdf olarak düzenlenmiş belgelerle çalışabilen Dokümanlar gelişmiş özellikler içeren bulut tabanlı bir kelime işlemci hizmetidir. Yazılan belgelerde sürüm geçmişlerini saklayabilme, birçok farklı dosya türüne çevirebilme ve en önemlisi aynı anda birçok kişi ile birlikte çalışabilme imkânı sunan ofis bileşenidir. 
- E-Tablolar: Çevrimiçi hesap tablosu çözümü olan e-tabloların birçok kişi tarafından eşzamanlı olarak erişilebilmesi ve düzenlenebilmesi bu hizmeti oldukça önemli hale getirmiştir. Diğer işlem tabloları dosyaları ile veri alışverişi yapabilen bu hizmet diğer google ofis uygulamaları ile nesne paylaşımı yapabilmektedir. 
- Slaytlar: Google Slaytlar, kullanıcıların etkili sunular hazırlamasına yönelik sunu temaları, yazı tipi, videolar, animasyonları kullanabilir hale getirmiştir. MS Powerpoint ile birlikte çalışabilen bu hizmet de diğer Google ofis hizmetlerindeki gibi kulanım için sürekli internete bağlı olmayı zorunlu kılmamaktadır. 
- Formlar: Formlar google ofis yazılımlarının en önemli araçlarından biridir. Farklı amaçlar için kullanıcılardan veri toplamanın en kolay ve etkili yöntemidir. Şekil 7.8’de online olarak oluşturulmuş bir form örneğini görebilirsiniz. Formlarda farklı veri araçları (metin kutusu, açılır liste, onay kutusu, çoktan seçmeli vd.) kullanarak kullanıcılardan veri toplamak mümkündür. Form oluşturulduktan sonra formun internet linki ilgili gruba mail ya da farklı iletişim araçlarıyla ulaştırılır. Kullanıcının formu doldurup gönder tuşuna basmasıyla ilgili veri form tasarlanırken otomatik olarak oluşturulan bir google e-tabloya bir satır olarak kaydolur. Bu araç bireylerin görüşlerini toplamak üzere bir anket tasarlamak için kullanılabileceği gibi iş süreçlerinin yönetilmesinde oldukça kullanışlı bir araç olarak kullanılmaktadır. Bireysel ücretsiz kullanımlarda bir e-tabloya toplayabileceğiniz veri 400 bin hücre ile sınırlanmıştır. 

Google’ın sunduğu ofis ve verimlilik araçları hem birey hem de kurumsal ihtiyaçları karşılamaya yönelik bütünleşik bulut çözümleridir. Kullanıcıların Google hizmetlerinden faydalanabilmesi için öncelikle bir Google hesabı oluşturması gerekmektedir. Google hesabını oluşturan kullanıcılar aşağıda sıralanan hizmetleri çevrimiçi olarak kullanabilmektedirler (http://www.google.com/about/products/). 
Aşağıdaki uygulamalara ek olarak mobil cihazlar için geliştirilmiş ek çözümler de Google tarafından kullanıcılara sunulmaktadır.  
• Ofis uygulamaları: 
Dokümanlar: MS Word ya da pdf olarak düzenlenmiş belgelerle çalışabilen Dokümanlar gelişmiş özellikler içeren bulut tabanlı bir kelime işlemci hizmetidir. Yazılan belgelerde sürüm geçmişlerini saklayabilme, birçok farklı dosya türüne çevirebilme ve en önemlisi aynı anda birçok kişi ile birlikte çalışabilme imkânı sunan ofis bileşenidir. 
- E-Tablolar: Çevrimiçi hesap tablosu çözümü olan e-tabloların birçok kişi tarafından eşzamanlı olarak erişilebilmesi ve düzenlenebilmesi bu hizmeti oldukça önemli hale getirmiştir. Diğer işlem tabloları dosyaları ile veri alışverişi yapabilen bu hizmet diğer google ofis uygulamaları ile nesne paylaşımı yapabilmektedir. 
- Slaytlar: Google Slaytlar, kullanıcıların etkili sunular hazırlamasına yönelik sunu temaları, yazı tipi, videolar, animasyonları kullanabilir hale getirmiştir. MS Powerpoint ile birlikte çalışabilen bu hizmet de diğer Google ofis hizmetlerindeki gibi kulanım için sürekli internete bağlı olmayı zorunlu kılmamaktadır. 

- Formlar: Formlar google ofis yazılımlarının en önemli araçlarından biridir. Farklı amaçlar için kullanıcılardan veri toplamanın en kolay ve etkili yöntemidir. Formlarda farklı veri araçları (metin kutusu, açılır liste, onay kutusu, çoktan seçmeli vd.) kullanarak kullanıcılardan veri toplamak mümkündür. Form oluşturulduktan sonra formun internet linki ilgili gruba mail ya da farklı iletişim araçlarıyla ulaştırılır. Kullanıcının formu doldurup gönder tuşuna basmasıyla ilgili veri form tasarlanırken otomatik olarak oluşturulan bir google e-tabloya bir satır olarak kaydolur. Bu araç bireylerin görüşlerini toplamak üzere bir anket tasarlamak için kullanılabileceği gibi iş süreçlerinin yönetilmesinde oldukça kullanışlı bir araç olarak kullanılmaktadır. Bireysel ücretsiz kullanımlarda bir e-tabloya toplayabileceğiniz veri 400 bin hücre ile sınırlanmıştır. 
- Google Sites: Google üzerinde hızlı ve basit olarak web sayfası hazırlamak için oluşturulmuş bir hizmettir. Kodlama bilmeye gerek olmadan doküman yazmak kadar basit bir ara yüzle web sayfaları oluşturulabilir. 
- Çizimler: Google Çizimler çevrimiçi diyagram, tablo ya da resim oluşturmaya olanak sağlayan bir çizim araçlacıdır. 

• İletişim: 
Gmail: Google’ın diğer verimlilik araçları ile etkin çalışan web üzerinden hizmet veren e-posta hizmetidir. Bireysel e-posta ihtayaçlarının yanı sıra kurumsal çözümler sunan Google e-Posta hizmeti gmail, e-postaları otomatik olarak sınıflama, spam ve virüs çözümleri, mail etiketleme, mobil cihazlar ile entegrasyon gibi bir çok özellik barındırmaktadır. 
- Hangouts: Anlık haberleşme için hizmet veren Hangouts, bireylerle ya da bir çalışma ekibi ile mesaj, sesli mesaj ya da görüntülü iletişim kurmayı sağlar. Gmail web ara yüzü, Chrome uygulaması ya da mobil cihaz uygulamaları ile kullanılabilmektedir. Arıca akıllı telefon uygulamalarında bireyin SMS mesajları yönetiminde kullanılabilmektedir. 
- Takvim: Google Takvim hizmeti verimlilik araçlarının önemli bir ögesidir. Bireyin ya da organizasyonların faaliyetlerinin zamanlanması, takibinin yapılması ve paylaşılması için kullanılan bir hizmettir. Mobil araçlarla senkronize çalışan bu hizmet özellikle iş dünyasında çok yaygın kullanılan bir hizmettir. Örneğin bir kullanıcının e-postasına gelen adına düzenlenmiş bir elektronik uçak bileti bilgileri sistem tarafından otomatik olarak bireyin takvimine işlenebilmektedir. 
- Google+: Google sosyal medya uygulamasıdır. Bireylerin paylaşımları ve ilgi alanlarını takip etmelerine olanak sağalayan yeni nesil iletişim aracı olarak tanımlanabilir. 
- Blogger: Bireylerin düşünce ve yorumlarını bir günce biçminde web üzerinde yazarak yayınladıkları yapıya blog adı verilmektedir. Bu hizmet kullanıcılara oldukça kolay bir şekilde yazılarını yayınlamalarına olanak sağlar. 
- Google Grupları: Bireylerin toplu haberleşmesi için kullanılan bir hizmettir. Günümüzde sosyal medyanın daha yaygın kullanılması ile daha az kullanılır hale gelmiştir. 

• Araçlar: 
Drive: Bulut depolama hizmeti olarak daha önce bahsettiğimiz Drive hizmeti ofis yazılımlarındaki tüm belgelerin saklanması için hizmet veren çevrimiçi depolama hizmetidir. 
- Google Çeviri: Farklı dillerdeki metinleri bir diğer dile çevirmek için kullanılan çevrimiçi araçtır. Sadece metin değil web sayfalarının da istenilen dile çevrilerek görüntülenmesi mümkündür. Çeviri hizmetinin yanında metinlerin ilgili dillerde seslendirilmesi ve sözlük hizmeti de aynı sayfada gerçekleştirilebilmektedir. 
- Google Haritalar: Harita hizmetide verimlilik araçları arasında yer alması gereken araçlardan birisidir. Birey ve organizasyonların günümüzde yoğun olarak kullandığı hizmettir. 

## Diğer Verimlilik Araçları

Microsoft Office 365: Microsoft Ofis yazılım ailesinin bulut üzerinden çevrimiçi olarak hizmet veren sürümüdür. Ofis 365 birey ve kurumların Word, Excel, PowerPoint, Outlook, OneNote gibi ofis yazılımlarını mekân ve cihaz bağımsız olarak kullanılmasına olanak sağlamaktadır. Microsoft’un OneDrive bulut depolama çözümü bulut üzerinde çalışan bu uygulamaların dosya depolama alanı olarak kullanılabilmektedir. 
ZOHO: Zoho iş ortamları için tasarlanmış genel amaçlı bir bulut yazılımdır. İşletmelerin bilgi sistemi ihtiyacını karşılamaya yönelik onlarca yazılım barındıran Zoho ofis yazılımları, insan kaynakları, pazarlama ve satış, kurumsal iletişim, finans ve iş süreçlerini yönetmeye ilişkin yazılım modüllerini içermektedir. Mobil yazılım desteği de olan yazılımın büyük bir kullanıcı kitlesi bulunmaktadır. (https://www.zoho.com/) 
Evernote: Başlangıçta not alma ve arşivleme için tasarlanmış sonrasında sunum ve birlikte çalışma işlevlerinin de eklendiği bulut üzerinden çalışan kullanışlı bir araçtır. Mobil telefon, tablet ve kişisel bilgisayar uygulamaları ile alınan notlar ses, görüntü ve video nesneleri içerebilmekte ve tüm veri merkezi olarak bulut ortamından senkronize edilebilmektedir. (https://evernote.com) 
Prezi: Bulut tabanlı sunum hazırlama aracı olan Prezi yenilikçi ve başarılı tasarımı ile dikkat çeken bir uygulamadır. Web sayfası üzerinden ya da mobil uygulamalar üzerinden tasarlanan ilgi çekici sunuların indirilerek çevrimdışı sunulması mümkündür. Akademik ücretsiz kullanımı da destekleyen Prezi, marmara.edu.tr uzantılı e-posta adresiniz ile deneyimleyebilirsiniz. (https://prezi.com) Bulut üzerinde çalışan yüzlerce verimlilik yazılımı bulmak mümkündür. Kullanıcının ihtiyacına uygun açık ya da kapalı kaynak kodlu, ücretli ve ücretsiz birçok farklı yazılım bulmak mümkündür. 
