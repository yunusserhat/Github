---
title: 9. Bölüm - Bilgi Sistemlerinin Güvenliğini Sağlama
date: '2022-01-01'
type: book
weight: 110
---

<!--more-->

## Bilgi sistemleri niçin hatalara ve kötü kullanıma açık haldedir?

Bir güvenlik duvarı veya antivirüs yazılımı olmadan İnternet'e bağlanmaya çalışırsanız ne olacağını hayal edebiliyor musunuz? 
Bilgisayarınız hemen bir virüs veya kötü yazılımla karşı karşıya gelebilir ve işlevsiz hale gelebilir. İşinizi yürütmek için bilgisayarı kullanıyorsanız, müşterilerinize satış yapamayabilir veya hizmetiniz kapalıyken tedarikçilerinize sipariş veremeyebilirsiniz. Hatta belki de müşterilerinizden aldığınız ödeme verileri de dahil olmak üzere çok değerli verileri çaldırabilir veya yok edecek hackerlara davetiye çıkarmış olabilirsiniz. 
Kısacası, bugün bir iş yapıyorsanız, güvenliği ve kontrolü birinci öncelik haline getirmeniz gerekir. 
Bilişim sistemlerinde kullandığımız «güvenlik» tabiri, bilgi sistemlerine yetkisiz erişim, değişiklik, hırsızlık veya fiziksel hasarı önlemek için kullanılan politikaları, prosedürleri ve teknik önlemleri ifade eder. 
Kontroller; organizasyonun değerlerinin güvenliğinin, muhasebe kayıtlarının güvenilir ve doğruluğunu, yönetim standartlarına uyumlu olmasını sağlamak için bütün organizasyonel yöntemler, politikalar ve metotlardır.


## Sistemler Neden Savunmasızdır

Elektronik ortamda çok fazla bilgi saklandığı ve işlendiği zaman, el yordamında var olandan çok daha fazla tehdit türü ve güvenlik açığı ile karşı karşıyadır. İletişim ağları boyunca farklı noktalardaki bilgi sistemleri birbiriyle bağlanmıştır. Yetkisiz erişim, kötüye kullanım veya sahtecilik bir nokta ile sınırlı değildir, ağ üzerindeki herhangi bir erişim noktasında meydana gelebilir.
Çağdaş bilgi sistemlerine karşı çok genel tehditler yan taraftaki görselde gösterilmiştir. Bu tehditler; zayıf yönetim kararlarının, teknik, organizasyon ve çevresel faktörlerin birleşmesi ile ortaya çıkabilirler. Sistemlere yapılacak saldırılar sistemin her katmanında meydana gelebilir. Çok katmanlı istemci-sunucu ortamında güvenlik açığı, katmanlar arasındaki iletişimin hepsinde vardır. İstemci düzeyindeki kullanıcılar, bilmeden virüs ve casus yazılım indirme veya sisteme yetkisiz erişim ve giriş hataları nedeniyle zararlara sebep olabilir. Hackerler, çeşitli hileler ile yetkisiz olarak, verilerin iletimi esnasında ağ üzerinde akan mesajları değiştirerek, değerli bilgilere erişebilir ve çalabilirler. İnternetin ve diğer ağların radyasyon yayımından söz edilir. Dışarıdan sisteme girmeye çalışanlar, Web sitelerinin çalışmalarını kesintiye uğratmak için Hizmet Vermeyi Engelleyen Saldırılar (DoS) yapabilirler. Bunların kurumsal sistemlere yaygınlaşması veri tabanında ve dosyalarda saklanan verilerin değiştirilmesi veya tahrip edilmesine neden olabilir.
 
Sistem arızası eğer donanım üzerinde meydana gelirse, sistem tamamen düzeltilemez veya yanlış kullanım veya suça yönelik kullanım nedeniyle zarara uğrar. Programlarda hata, hatalı kurulum, yetkisiz değiştirmeler, bilgisayar yazılımının hataları olarak bilinir. Güç kesintisi, sel baskınları, yangınlar ve diğer doğal afetler sistemleri kesintiye uğratır.
Diğer işletmeler ile yerel veya deniz aşırı ortaklıklarda, eğer değerli bilgiler işletmenin kontrolü dışındaki bilgisayarlarda ve ağlarda bulunuyorsa, sistem savunmasızlığı daha da artar. Güçlü bir koruma olmazsa, değerli bilgiler kaybolabilir, bozulabilir veya kişisel gizliliği ihlal eden bilgiler veya önemli ticari sırlar yanlış ellere geçebilir.

{{< figure src="images/sistem_savunma.jpg" caption="Sistem Savunması" >}}

## İnternet Güvenlik Açıkları

İnternet gibi geniş kamusal ağlar herkese açık olduğundan iç ağlardan daha savunmasızdır. İnternet o kadar büyük ve hızlıdır ki; bir olumsuzluk meydana geldiğinde dakikalar içinde çok yaygın bir etki yapabilir. Kurumsal ağlar internete bağlı olduğu zaman işletmelerin bilgi sistemleri de doğal olarak saldırıya açıktır.
Kablo veya sayısal hatlar ile internete sürekli bağlı bilgisayarlar saldırıya açıktır. Yüksek hızlı erişime sahip bilgisayarlar, genellikle günün büyük bir çoğunluğunda internete bağlıdır ve saldırılar sayısal hatların kullanıcılarına sunduğu sabit IP özelliği nedeniyle daha hızlı olmaktadır. Sabit IP’li bir bilgisayarı tespit etmek çok kolaydır. Sabit IP hackerler için sabit bir hedef demektir. İnternet teknolojisine dayanan telefon hizmetleri, özel ve güvenli bir ağ üzerinden sağlanmıyorsa şebeke anahtarlamalı ses iletişiminden daha çok savunmasızdır. İnternetten IP üzerinden ses gönderme (VoIP) şifreli değildir. Bu yüzden hackerler, komşu sunucular üzerinden veya yerel alan ağlarının birçok noktasından konuşmayı potansiyel olarak dinleyebilirler. Hackerler kredi kartı bilgilerini veya diğer değerli kişisel bilgileri çalmak için konuşmayı dinlerler.

Güvenlik açığı, e-postalarda ve anlık mesajlaşmada da vardır. E-posta, iç ağa yetkisiz erişebilmek veya kötü amaçlı yazılımlar için bir sıçrama tahtası olarak işe yarayan eklenti dosyalar içerebilir. Çalışanlar çok değerli ticari, finansal bilgileri veya gizli müşteri bilgilerini yetkisiz alıcılara ulaştıran e-posta mesajları kullanabilirler. Popüler anlık mesajlaşma uygulamaları metin mesajları için kullanıcılarına güvenlik katmanı sunmamaktadır. Bu yüzden mesajlaşma sırasında internet üzerinden bu mesajlar okunabilir. Buradaki bilgiler de şifrelenmeden gönderilmektedir.







## Kablosuz Güvenlik Zorlukları

Havaalanları, kütüphaneler veya diğer kamusal alanlardaki kablosuz internet ağları çok güvenli değildir. Yani herkesin kolayca erişebilmesi için kablosuz aygıt ile sunucu arasında şifreleme yoktur. Hackerler gezerek şifresiz ağları veya kolayca bulunabilecek ağları bulduklarında iletişimi dinlemektedirler. Bluetooth iletişimi bile güvenlik açıklarına sahiptir.
Wi-Fi ağların alanı sadece 50-100 metre olmasına rağmen harici antenler ile yüzlerce metreye kadar arttırılabilir. 802.11 standardını kullanan yerel alan ağlarına, hacking yazılımı ile kablosuz yayın alıcı kartlar, harici anten kullanılarak girilebilir. Hackerler, bu araçları kullanarak güvensiz ağları bulmakta, ağ trafiğini izlemekte ve bazı durumlarda bu ağlar üzerinden internete veya kurumsal ağlara erişim hakkı elde edebilmektedirler.
Wi-Fi iletişim teknolojisi yayın yapan istasyonları bulmak ve onlara kolaylıkla bağlanmak için tasarlanmışlardı. Kablosuz ağlar genellikle birçok bölgede dışarıdan kablosuz ağın yolunu keserek kulak misafiri olmak için gereken temel güvenliğe de sahip değildir.
Bir hacker, yayın hizmet kümesi tanımlayıcısını (SSID) belirlemek için 802.11 standardı analiz araçlarını kullanabilir. Dışarıdan izinsiz giren kişi ağ kaynaklarına erişir ve ağa bağlı olanları tespit edebilir ve onların dosyalarına erişim sağlayabilir.
Hackerler ayrıca kullanıcının fiziksel konumuna çok yakın bir farklı kanaldan (aynı isimle) yayın yapan sahte erişim noktası kullanarak kullanıcının kablosuz aygıtının bu noktadan bağlanmasını sağlar. Bu sahte bağlantı sağlandığında hacker kişinin isim ve şifresini kullanıcı şüphelenmeden çalabilir.



## Kötü Amaçlı Yazılımlar: Virüsler, Solucanlar, Truva Atları ve Casus Yazılımlar

Kötü amaçlı yazılımlar Malware olarak da adlandırılan, virüs, solucan, Truva Atı ve casus yazılımlar gibi yazılımlardır. Bilgisayar Virüsü, genellikle kullanıcının bilgisi ve izni dışında çalıştırılması için kendini başka programlara veya dosyalara ekleyen kötü amaçlı yazılımlardır. Çoğu bilgisayar virüsleri bir yük getirir. Bu yük; ekranda görüntülenen bir mesaj veya resim gibi tehlikesiz olabileceği gibi, bilgisayar sabit diskini formatlayan veya programların hatalı çalışmasına neden olan veya programları tahrip eden yıkıcı sonuçlar da olabilir. Virüsler, genellikle kullanıcının virüs ile bulaşmış bir dosyayı kopyaladığı veya e-postaya eklediği zaman bir bilgisayardan diğer bilgisayarlara yayılır.
Fakat genellikle saldırıların çoğunluğu, kendisini ağ üzerinden bir bilgisayardan diğer bilgisayara kopyalayan bağımsız bilgisayar programları olan solucan şeklindedir. Virüslerin aksine, solucanlar, çalışmak için bir dosyaya eklenmek zorunda değillerdir ve bir bilgisayardan diğerine geçmek için de çok az insan müdahalesine ihtiyaç duyarlar. Bu, solucanların virüslerden niçin daha hızlı yayıldığını açıklamaktadır. Solucanlar, verileri ve programları tahrip ederek zarar verdiği gibi bilgisayar ağ bağlantısını da kesebilir.
Solucanlar ve virüsler genellikle, internetten indirilen, e-postalara eklenen dosyalar ile veya anlık mesajlaşma ile yayılmaktadır. Virüsler, enfekte makine veya hard disklerden gelerek bilgi sistemlerini de istila edebilirler. E-posta solucanları en çok problemli olanlardır.

Solucanlar ve virüsler şimdilerde kablosuz aygıtlara da bulaşabilmektedir. Bunların ilklerinden bir tanesi, 2005 yılı başlarında yayılmaya başlayan Cabir solucanı, Symbian işletim sistemine sahip cep telefonlarını hedef almakta ve Bluetooth bağlantısı ile bulaşmaktadır. Cabir sürekli Bluetooth aygıtlarını tarayarak sonunda bataryayı bitirene kadar devam eder. Mobil aygıt virüsleri kurumsal sistemler için büyük bir tehdit olmaktadır. Çünkü birçok kablosuz aygıt kurumsal sistemlere bağlıdır.
Truva Atı; tehlikesiz gibi görünen bir programdır fakat yapması beklenen işlerden farkı işleri yapmaktadır. Truva Atı bir virüs değildir. Çünkü kendi kendini çoğaltmaz. Fakat diğer tehlikeli programların bilgisayara girmesine sebep olabilir.
Mesela, Truva Atı Microsoft’tan gelmiş gibi görünen sahte bir e-posta ile alıcıyı Microsoft Update Sitesine benzer bir siteye yönlendirmekle yayılmaktadır. Bu Web sitesi ise bilgisayara kötü amaçlı tehlikeli programları indirmekte ve kurmaktadır.

Casus yazılımların bazıları da kötü amaçlı bir yazılım olarak iş görmektedir. Bu küçük programlar, reklam sitelerine hizmet etmek veya kullanıcının Web faaliyetlerini izlemek için kendini bilgisayara gizlice kuran programlardır.
Casus yazılımlar sadece rahatsız edici değil aynı zamanda kişisel bilgilerin çalınması, hesap bilgilerinin ve PIN numaralarının ele geçirilmesi ve gizliğin ihlali gibi işlemler için sistemi dışarıdan saldırılara açmaktadır.
Tuş Kaydedici (keylogger), bir yazılımın seri numaralarını, e-posta şifrelerini, internet hesap şifrelerini veya kişisel bilgilerin ve kredi kartı numaralarını çalmak için bir bilgisayardaki tuş vuruşlarını kaydeder (bu bilgilerin daha sonra bir e-posta adresine gönderilmesi istenebilir). Diğer bir casus yazılım, Web giriş sayfasını değiştirir, arama isteklerini başka sitelere yönlendirir veya yardımcı bellekleri işgal etmekle bilgisayar performansını düşürür.


## Hackerler ve Siber Vandalizm

Hacker, bilgisayar sistemlerine yetkisiz erişim elde etme niyetinde olan kişidir. Cracker, toplumun baskısına rağmen suça niyetli olduğunu gösteren hacker demektedir. Hacker ve Cracker ifadeleri birbirlerinin yerine kullanılabilmektedir. Hacker ve Crackerlar, bir bilgisayar sistemi veya Web sitesinin kullandığı bir güvenlik önleminin açığını bulmakla sisteme yetkisizce erişim hakkı kazanmaktadır.
Hackerlerin faaliyetleri; sisteme dışarıdan girmenin ötesinde, bilgi çalmak, sisteme zarar vermek ve şirket bilgi sistemini veya Web sitesini kasıtlı bozma ve imha etmek demek olan Siber Vandalizm’e kadar çok geniştir. 
Dolandırmak ve Dinleme Yapmak:
Kimlik Gizleme (Spoofing); Hackerlerin sahte posta adresleri kullanarak veya bir başkasıymış gibi maskeleme yaparak kendi gerçek kimliklerini gizlemeleri, kendilerini yanlış tanıtmalarıdır. Spoofing, Web bağlantılarını gidilmek istenen adresten farklı bir adrese yönlendirmeyi de içerebilir. Örneğin; hackerler, müşterileri gerçek sitenin aynısı görünümündeki bir sahte Web sitesine yönlendirirse, gerçek siteye girdikleri önemli müşteri bilgileri toplayabilirler.
Dinleme (Sniffing); ağ üzerinde taşınan bilgileri kulak misafiri olmakla (dinleme yapmakla) ele geçiren bir program türüdür. Yasal olarak kullanıldığı zaman, bu programlar ağ üzerindeki yasal olmayan faaliyetleri ve potansiyel ağ açıklarını belirlemeye yardım eder. Fakat yasadışı bir amaç için kullanıldığında, zarar verebilir ve tespit edilmesi çok zordur.

Hizmet Vermeyi Engelleyen Saldırılar (DoS Saldırısı)
Hizmet Vermeyi Engelleyen Saldırıda (Denial of Service Attacks: DoS) hacker, ağı çökertmek için bir Web sunucusu veya bir ağ sunucusuna yüz binlerce sahte haberleşme ve hizmet isteği gönderir. Ağ, cevaplayamayacağı yoğunlukta sahte istek aldığı için gerçek istekleri de karşılayamaz ve hizmet vermeyi durdurur. Hizmet Vermeyi Engelleyen Dağıtık Saldırılarda (Distributed Denial of Service Attack: DDoS) ağa birçok noktadan erişerek boğmak ve çökertmek için yüzlerce hatta binlerce bilgisayar kullanılır.
Bu saldırılar şirketin bilgi sisteminin sınırlandırılmış alanlarına erişim sağlamamasına veya bilgiyi tahrip etmemesine rağmen, Web sitesini devre dışı bırakmakla normal kullanıcıların siteye erişimini imkansız hale getirir. Bu saldırılar çok yoğun iş yapan bir e-ticaret sitesine pahalıya mal olur. Özellikle küçük ve orta büyüklükte işletmelerin ağları büyük işletmelere göre daha az korunma eğilimindedir. Hizmet Vermeyi Engelleyen Saldırıların failleri, genellikle sahibinin bilgisi olmadan kötü amaçlı bir program ile enfekte edilmiş Robot Ağ (botnet) içine yerleştirilmiş binlerce “zombi” bilgisayar kullanırlar. Hackerler, bu robot programları diğer insanların bilgisayarlarını, saldırganın vereceği komutları yerine getirmesi kötü amaçlı programlarla enfekte etmek için oluştururlar. Enfekte olan bir bilgisayar artık başkasına ait olan bir bilgisayara hizmet eden bir köledir. Hackerler yeterince bilgisayarı enfekte ettiğinde onları Hizmet Vermeyi Engelleyen Dağıtık Saldırılar, şifre avlama veya spam mailler için kullanır.

## Bilgisayar Suçları ve Siber Terörizm

Birçok hacker faaliyeti suç teşkil eder ve sistemlerin güvenlik açıkları bilgisayar suçları için onları bir hedef haline getirir. Sistemlere izinsiz olarak erişmek ve bilgileri değiştirmek, silmek birer suçtur. Bilgisayar suçları: bilgisayara karşı suç ve bilgisayar ile suç kavramlarından ayrılır. Bir araç olarak bilgisayar kullanılabileceği gibi bir hedef olarak bilgisayar kullanılabilir.
Bilgisayarların hedef olduğu bilgisayar suçları; gizli ve korunmuş bilgilerin çalınması, sisteme yetkisiz erişilmesi, bir bilgisayara kötü işler yapmak için kasten erişmek, isteyerek veya istemeyerek korunan bir bilgisayara erişmek, korunan bir bilgisayara zarar amacıyla bir program veya kod göndermek, korunan bir bilgisayara zarar verecek tehditlerde bulunmak.
Suç aracı olarak bilgisayarlar; telif hakkı ile korunan bir bilgiyi bilgisayar yardımı ile çoğaltmak, tehdit ve zarar amacıyla e-posta göndermek, bilerek ve kasten bir iletişimi bozmak, kesintiye uğratmak, çocuk pornografisi iletmek veya bu sitelere girmek. Bilgisayar suçlarının boyutunu bilmek imkansızdır. Ne kadar sistem işgal edilmiştir? Ekonomik zararı nedir? Birçok şirket bilgisayar suçlarını rapor etmekte isteksizdir. Çünkü bu suçlar çalışanlarını da içine alabilir ve güvenlik açıklarının olması şirketin itibarını zedeleyeceğinden korkmaktadırlar. Bilgisayar suçlarında en önemli ekonomik zararı DoS saldırıları, virüsler, hırsızlık ve sistemlerin tahrip edilmesi vermektedir.
Bilgisayar suçlarının boyutunu bilmek imkansızdır. Ne kadar sistem işgal edilmiştir? Ekonomik zararı nedir? Birçok şirket bilgisayar suçlarını rapor etmekte isteksizdir. Çünkü bu suçlar çalışanlarını da içine alabilir ve güvenlik açıklarının olması şirketin itibarını zedeleyeceğinden korkmaktadırlar. Bilgisayar suçlarında en önemli ekonomik zararı DoS saldırıları, virüsler, hırsızlık ve sistemlerin tahrip edilmesi vermektedir.

Kimlik Hırsızlığı
İnternetin ve e-ticaretin büyümesi ile kimlik hırsızlığı da önemli bir tehdit olmuştur. Kimlik hırsızlığı, sahtekarlıkla sosyal güvenlik numarası, TC kimlik numarası ve kredi kartı numarası gibi bir kişiyi özgün olarak tanımlayabilecek kişisel bilgilerinin önemli bir parçasını ele geçirme suçudur. Bu bilgiler kredi almak, alış veriş, kurbanın adıyla bir müracaatta bulunmak veya hırsızlık yapmak için kullanılabilir.
Kimlik hırsızlığı, internet üzerinden gelişmektedir. Kredi kartı dosyaları, Web site hackerlerinin önemli bir hedefidir. Bundan başka e-ticaret siteleri müşterilerin isim adres ve telefon numaraları gibi kişisel bilgilerini elde etmek için güzel bir kaynaktır.
Artan popülerliğe sahip bir kimlik gizleme şekli, şifre avlamadır (Password Fishing: Phishing). Şifre Avlama; sahte bir Web sitesi kurulması veya gizli kişisel bilgilerin ele geçirilmesi için yasal bir şirketten geliyor gibi görünen e-posta gönderilmesini içerir. Gönderilen e-posta ile alıcının sosyal güvenlik numarasının, banka ve kredi kartı bilgilerinin veya diğer kişisel bilgilerin güncellenmesi veya doğrulanması istenir. Bu işlemin e-postaya cevap verilerek veya sahte Web siteye yönlendirilerek veya bir telefon numarası aranarak yapılması istenir.
Sahte Siteye Yönlendirme (Pharming) ve Şeytani İkiz (Evil Twin) olarak adlandırılan yeni şifre avlama teknikleri tespit edilmesi zor olanlardır. Şeytani İkizler, kafe, hotel, havaalanları bekleme salonlarında güvenilir Wi-Fi internet bağlantısı gibi görünen kablosuz ağlardır. Sahte ağ, normal ve güvenli ağa benzer gibi görünür. Dolandırıcılar, ağa bağlanan habersiz kullanıcıların kredi kartı numaralarını veya şifrelerini ele geçirmeye çalışırlar.
Sahte Siteye Yönlendirme; kullanıcıları Web sayfasının adresini Web tarayıcısının adres satırına doğru yazsa bile sahte Web siteye yönlendirir. Eğer sahte siteye yönlendirme işini yapan kişi internet servis sağlayıcısı tarafından saklanan internet adres bilgilerinin veri tabanına erişim hakkı elde etmişse veya servis sağlayıcısının sunucusunu ele geçirmişse bu yönlendirmeleri yapması mümkündür.

Tıklama Sahteciliği
Bir arama motoru tarafından görüntülenen bir reklama tıklandığı zaman, reklamı verenler reklama tıklayanı, ürünün potansiyel müşterisi varsayarak her bir tıklama için siteye para öder. Tıklama Sahteciliği, ürünü satın alma veya reklam veren işletme ile ilgili daha çok bilgi edinme niyetinde olmaksızın bir reklama hileli şekilde tıklama yapan programlar ile ortaya çıkar. Tıklama sahteciliği, tıklama başına para ödenen reklam alan Web sitelerinin ve Google’ın büyük bir problemidir.
Bazı şirketler, pazarlama maliyetlerini arttırıp onları zayıflatmak için rakiplerin reklamlarına sahte tıklamalar yapmak üzere üçüncü şahıslar kiralarlar (muhtemelen düşük ücretli ülkelerden). Tıklama sahteciliği tıklama yapan programlar ile yazılımlar ile de yaygınlaştırılabilir. 

Sanal Terörizm ve Siber Savaş
İnternetin ve diğer ağların güvenlik açıklarının teröristler, yabancı gizli servisler veya geniş çaplı tahribat ve zarar oluşturmak isteyen diğer gruplar tarafından kullanılabilecek olması, endişelerin temelini oluşturmaktadır. Böyle sanal saldırılar, elektrik şebekesi, hava trafik kontrol sistemleri veya önemli banka ve finansal kurumların ağlarını işleten yazılımları hedef alabilir. 


## İç Tehditler: Çalışanlar

İşletmelerde çalışanlar da ciddi güvenlik problemlerine neden olabilirler. Çalışanlar özel bilgilere erişim hakkına sahiptir ve yeterli güvenlik yöntemlerinin olmaması durumunda çalışanlar izlenmeksizin organizasyonun sistemleri arasında dolaşabilirler.
Çalışmalar ağ güvenlik ihlallerinin tek büyük nedeninin kullanıcıların bilgi eksikliği olduğunu göstermiştir. Çoğu çalışanlar bilgisayar sistemlerine erişim şifrelerini unuturlar, şifrelerin ortak kullanılmasına izin verirler. Sisteme erişim arayan kötü niyetli kişiler zaman zaman işletmenin yetkili kullanıcılarına rol yaparak şifrelerini elde etmek için kandırmaya çalışmaktadırlar. Bu uygulama Sosyal Mühendislik olarak adlandırılır.
Hem son kullanıcılar hem de bilgi sistemleri uzmanları bilgi sistemlerindeki önemli hataların kaynağıdır. Son kullanıcılar yanlış veri girişi veya bilgisayar donanımı kullanımında ve veri girişinde prosedürlere uymamakla hatalara neden olmaktadırlar. Bilgi sistemleri uzmanları yeni bir yazılım tasarım veya geliştirme aşamasında veya mevcut programın kullanılması sırasında hatalara neden olabilirler.



## İLETİŞİM AĞLARISinyaller: Dijital ve Analog

İletişim ağlarındaki en önemli ayrım, analog ve dijital sinyaller arasındadır. Bir mesajın iletilmesinde iki yol vardır, Analog ve dijital sinyaller. 
Analog sinyaller klasik telefon bağlantılarındaki sesli iletişimde olduğu gibi iletişim kanalı üzerinden sürekli bir dalga şeklinde ilerler. Sabit telefonlar, kişisel bilgisayarların ses çıkış aygıtları, kulaklıklar, bir analog aygıttır.
Dijital sinyaller ise kesikli, ikili dalga formundadır. Dijital sinyaller bilgiyi, var-yok mantığındaki elektrik iletiminde sadece 1 ve 0 bitler ile iki farklı durumda iletir. Bilgisayarlar dijital sinyaller üretir; ancak dijital bir sinyal göndermek için telefon hattı kullanılmak gerekirse, bu sinyallerin dijitalden analoga dönüştürülmesi için modem (Modulator ve Demodulator) olarak adlandırılan bir aygıt kullanılması gerekir. 



## Yazılımların Güvenlik Açıkları

Yazılım hataları bilgi sistemlerinde sürekli tehditlere ve işletmelerde sayısız verimlilik kayıplarına neden olmaktadır. Ticari yazılımlar genellikle sadece performans ile ilgili değil aynı zamanda ağı dışarıdan izinsiz girişlere açan güvenlik açıkları da içerir. Bu açıklar kötü amaçlı yazılımların bilgisayara girişlerine imkan sağlar. Kötü amaçlı yazılımların büyük bir kısmı Windows işletim sistemi ve diğer Microsoft ürünlerinin açıklarını kullanmaya çalışır. Ancak Linux işletim sistemini hedef alan kötü amaçlı yazılımlarda da artışlar olmaktadır.
Belirlenen yazılım güvenlik açıklarını düzeltmek için yazılım satıcılar, programın çalışmasını bozmadan açıkları gideren ve yama (patch) olarak adlandırılan küçük yazılım parçacıkları oluştururlar. 
İşletmenin bilgi teknolojileri altyapısı genellikle farklı uygulamalar ve işletim sistemleri ve hizmetler ile yüklüdür. İşletmenin kullandığı bütün hizmet ve aygıtların sağlıklı çalışması ve sürdürülebilmesi çoğunlukla zaman alıcı ve maliyetlidir. Kötü amaçlı yazılımlar o kadar hızlı gelişir ki, güvenlik açığını fark etme ile yama oluşturma zamanı arasında süre çok kısadır. Yama yayınladığında kötü amaçlı yazlımın programdaki güvenlik açıklarını kullanmış olduğu görülür.




## Güvenlik ve Kontrolün İşletme Değeri

Birçok firma güvenlik ve kontroller için büyük harcamalar yapma konusunda isteksizdirler. Çünkü bu harcamalar satış gelirleri ile doğrudan ilişkili değildir. Bununla birlikte bilgi sistemlerini korumak, işletme işlemleri için çok önemlidir.
İşletmeler, korumaları gereken çok değerli bilgilere sahiptir. Sistemler genellikle kişisel vergiler, finansal bilgiler, hastane kayıtları, iş performansları gibi gizli kişisel bilgilere ev sahipliği yapar. Ayrıca sistemler ticari sırlar, şirket işlemleri, yeni ürün geliştirme planları, pazarlama stratejileri gibi bilgiler de içerir. Devlete ait bilgi sistemleri silah sistemleri, gizli servis operasyonları, askeri hedefler gibi bilgiler içerebilir. Bu bilgiler çok büyük değere sahiptir. Kaybedildiklerinde veya tahrip edildiklerinde ve yanlış ellere geçtiklerinde büyük bir kayıp ve yan etkilere neden olacaktır.
Yetersiz güvenlik ve kontrol, ciddi yasal bazı sorumluluklar gerektirir. İşletmeler sadece kendi bilgilerini değil müşterilerin, çalışanların ve işletme ortaklıklarına ait bilgilerin korunmasından da sorumludur. Korumada yaşanacak bir hata işletmeye büyük davalar açılmasına neden olabilir. İşletme bu gizli bilgilerin kaybolmaması için uygun koruma önlemleri almada başarılı olmazsa oluşan zararlar için yükümlülük altına girebilir.



## Elektronik Kayıt Yönetimi İçin Yasal Düzenleme Gereksinimi

Ülkeler, işletmeleri sahip oldukları gizli bilgilerin korunması, kötüye kullanımı ve yetkisiz erişilmesinin önlenmesi için ciddi önlemler almaya zorlamaktadır. İşletmeler gizliliğin korunmasında olduğu gibi elektronik kayıtların ve dokümanların saklanması konusunda yeni yasal zorunluklarla karşı karşıyadır. Elektronik Kayıt Yönetimi, elektronik kayıtların saklanması, korunması ve yok edilmesi ile ilgili araçlar, yöntemler ve uygulamaları içerir.
Örneğin; ABD’de bir sağlık endüstrisi, Sağlık Sigortası Taşınabilirliği ve Sorumluluğu Yasası (HIPAA) ile belirtilen şartları sağlamak zorundadır. Bu yasa, sağlık hizmeti sağlayanlar arasında veri ve bilgilerin transferi ve faturalandırılmasını, otomatikleştirilmesini ve yönetilmesini basitleştirmek için prosedürler ve medikal gizlilik ve güvenlik için kurallar tanımlar.
ABD’de bir finansal şirket, Gramm-Leach-Bliley (ABD’de üç senato temsilcisinin soyadlarıdır) yasasına uymak zorundadır. Bu yasaya göre, veriler güvenli ortamlarda saklanmalıdır, bu güvenli ortamlarda saklanan bilginin iletim süresince özel güvenlik önlemleri ile korunması gerekmektedir.
ABD’de halka açık bir işletme, Sarbanes-Oxley (ABD’de iki senato temsilcisinin soyadlarıdır) yasasına uymak zorundadır. Bu yasa, Enron, WorldCom gibi şirket skandallarından sonra yatırımcıların korunması için düzenlenmiştir. Buna göre içeride kullanılan veya dışarıya verilen finansal bilgilerin bütünlüğü ve doğruluğunun sağlanması ve yönetimi için işletmelere yasal zorunluluk getirmiştir.

## Elektronik Kanıt ve Adli Bilişim

Güvenlik, kontrol ve elektronik kayıt yönetimi, yasal durumlarda çok önemlidir. Zimmete para geçirme, hisse senedi sahtekarlığı, ticari sırların çalınması, bilgisayar suçları gibi birçok suçlarda kanıtların çoğu bilgisayar ve dijital ortamlardadır. Yazılı deliller yanında CD, flash bellek, hard diskler, e-posta, anlık mesajlaşmalar gibi elektronik ortamda kaydedilmiş bilgiler de delil olarak kabul edilmektedir. E-postalar elektronik kanıtın en çok yaygın olanıdır.
Hukuki bir durumda işletme, kanıt olarak kullanılabilecek olan bilgiye erişim izni sağlamak zorundadır. Bu kanıtları sağlama maliyeti, bilgiler kaybolmuş veya tahrip olmuş ise fazla olabilir. Aynı şekilde bu kanıtları sağlayamamanın maliyeti de çok yüksektir.
Etkili bir doküman koruma politikası, e-posta ve diğer kayıtların iyi organize edilmesini, erişilebilmesini, ne çok uzun süre saklanmasını ne de çok erken yok edilmemesini düzenler. Ayrıca bu politikalar bilgisayar adli bilimi için potansiyel kanıtların nasıl korunacağının farkında olunmasını sağlar. Adli Bilişim (Computer Forensics), mahkeme tarafından kanıt olarak kullanılabilecek, bilgisayar saklama birimlerinde saklanan bilgilerin bilimsel olarak elde edilmesi, toplanması, analizi, korunması, kontrol edilmesidir ve aşağıdaki problemler ile ilgilidir.
• Bütünlüğü bozulmadan bilgilerin bilgisayarlardan kurtarılması ve elde edilmesi,
• Elde edilen elektronik kanıtların saklanması ve işlenmesi,
• Büyük miktardaki bilgilerin içinden önemli bilgilerin bulunması,
• Bilgilerin mahkemeye sunulması,
Elektronik kanıt, bilgisayar saklama ünitelerinde bir dosya olarak kalabilir ve ortalama düzeyde bilgiye sahip kullanıcı tarafından kolaylıkla bulunamaz. Örneğin, bir hard diskten silinen bir dosya çeşitli tekniklerle kurtarılabilir.





## Güvenlik ve Kontrol için Bir Çatı Oluşturmak

Teknoloji, bilgi sistemlerinin güvenlik ve kontrolünde temel bir konu değildir. Teknoloji, bir altyapı sağlar, ancak akıllı bir yönetim politikasının yokluğunda en iyi teknoloji bile kolaylıkla alt edilebilir. Örneğin; uzmanlar, sanal saldırıların %90’dan fazlasının güncel teknoloji ile önlenebileceğini belirtmektedirler. Bilgi sistemlerinin korunması bir takım güvenlik politikaları ve kontrollerin geliştirilmesini gerektirir. ISO 17799 güvenlik ve kontrol için uluslararası standartlar kümesidir. Bu standartlar, fiziksel güvenlik, güvenlik sürekliliği, erişim kontrolü, organizasyon içinde bir güvenlik fonksiyonu oluşturulmasının kurallarını belirler.




## Güvenlik Politikası

Sistemdeki temel risklerin değerlendirilmesinden sonra şirketin dijital varlıklarını korumak için bir güvenlik politikası belirlemek gerekir. Bir Güvenlik Politikası, bilgi risk sıralaması, kabul edilebilir güvenlik hedefleri ve bu hedeflere ulaşmak için mekanizmalarından oluşur. Firmanın en önemli bilgileri nedir? İşletmedeki bu bilgileri kim üretir ve kontrol eder? Bunları korumak için politikalar nelerdir? Bu varlıkların her biri için yönetimin kabul edebileceği risk düzeyi nedir? Her on yılda bir müşteri kredi kartı bilgilerinin kaybedilmesi kabul edilebilir mi? Yoksa yüz yılın felaketinde bile kredi kart bilgilerinin korunabileceği bir güvenlik sistemi mi oluşturulacaktır? Yönetim bu kabul edilebilir risk düzeylerinin sağlanmasının ne kadara mal olacağını tahmin etmelidir.
Büyük işletmelerde bu politikaları oluşturmaktan sorumlu bir Güvenlik Grubu Yöneticisi (Chief Security Officer: CSO) vardır. Güvenlik grubu kullanıcıları eğitir, yöneticilerin tehditler ve kesintilerin farkında olmalarını sağlar. Güvenlik yöneticisi, işletmenin güvenlik politikalarının uygulanmasından sorumludur.
Yetkilendirme Politikası; farklı düzeydeki kullanıcıların bilgilere farklı düzeylerde erişimini belirler. Yetkilendirme Yönetim Sistemleri, bir kullanıcının bir Web sitesi veya kurumsal veri tabanının belirli kısımlarına erişimine ne zaman ve nerede izin verileceğini belirler. Böyle sistemler, her bir kullanıcıya sadece erişim kurallarına dayalı olarak bilgilere erişimine izin verir.
Yetkilendirme Yönetim sistemleri, her bir kullanıcının erişimine izin verilen bilginin ne olduğunu tam olarak bilir. 

## İşletmenin Sürekliliğini Sağlamak

İşletmeler, gelir elde etmek ve işletme işlemleri için artan bir şekilde dijital ağlara dayandıkları için sistemlerinin ve uygulamalarının her zaman hazır ve sürekli olabilmesi için ilave adımlar atmalıdırlar. Kritik online işlemler yapan hava yolları ve finansal hizmet endüstrisi gibi endüstriler yüzde yüz hazır olma ve kesintisiz hizmet için yıllardır hata tolere sistemlerine sahiptirler. Online İşlemler; ağdan girilen işlemlerin anında bilgisayarda işlenmesidir.
Hata Tolere Bilgisayar Sistemleri: (Aksaklığa Dayanıklı, Bozulmaya Dayanıklı): Kesintisiz ve sürekli bir hizmet sağlayan bir ortam oluşturmak için yedek güç kaynağı, donanım ve yazılım bileşenlerini içerir. Hata tolere bilgisayarları özel bir yazılım veya otomatik olarak yedek sisteme geçiş yapabilecek ve kendi kendine donanım hatalarını tespit eden yerleşik devreler kullanırlar. Bu bilgisayarların parçaları bilgisayar sistemleri kesintiye uğramadan tamir edilebilir veya değiştirilebilir.
Hata tolere sistemli bilgisayar sistemleri; Yüksek Erişilebilirlik Çözümlerinden farklıdır (High Availability Computing). Her ikisi de kesinti zamanını düşürmek içindir. Kesinti Zamanı: sistemin çalışmadığı zaman periyodunu ifade eder. Ancak hata tolere sistemleri kesinti zamanını sıfıra indirerek süreklilik sağlamayı vaat ederken, yüksek erişilebilirlik çözümleri, sistemi çökmüş durumdan hızlı kurtarmaya yöneliktir. Hata tolere sistemleri yoğun elektronik ticaret işleri yapan veya içerideki işlemleri dijital ağlara bağımlı olan bir işletme için asgari bir gereksinimdir.
Yüksek erişilebilirlik çözümleri yedek sunuculara, farklı sunucular arasında bilgi işlem dağıtımına, yüksek kapasiteli saklama birimlerine, iyi bir felaket kurtarma planına ve işletme süreklilik planlarına ihtiyaç duyar. İşletmenin bilgi işleme platformları işlem gücü, saklama kapasiteleri ve bant genişliği açısından geliştirilebilir olmalıdır.
Araştırmacılar çok hızlı gelişen bir aksilik meydana geldiğinde bile bilgi işleme sistemini kurtaran Kurtarmaya Yönelik Çözümler (Recovery Oriented Computing) olarak adlandırılan bir yaklaşımdan söz etmektedirler. Bu işlem, hataları kolaylıkla düzeltmek ve çok bileşenli sistemlerin hatalarının kaynaklarını belirlemek ve hızlıca kurtarmak için tasarlanan sistemleri içerir.

Felaketten Kurtulma ve İşletme Sürekliği Planlaması:
Deprem, sel bakını veya terörist saldırısı gibi bir felaket anında çöken sistemin iletişim ve hesaplama yeteneklerinin yeniden kazandırılmasının planlanması Felaketten Kurtulma Planlamasıdır. Felaketten kurtulma planı genellikle bilgisayar sistemlerinin ve dosyalarının yedeklenmesinin sağlanması, sistemin çalışır halde tutulması gibi teknik konulara odaklanır.
İşletme Sürekliliğinin Planlanması: bir felaket sonrasında işletmenin faaliyetlerinin nasıl düzeltileceği üzerine odaklanır. Bu faaliyetler, kritik işlemlerin belirlenmesi sistemin çökmesi halinde yerine getirilecek faaliyet planlarının belirlenmesini içerir.
İşletme yöneticileri ve bilgi teknolojileri uzmanları, hangi iş süreçlerin ve bilgi sistemlerinin en kritik olduğunu belirlemek için planlar üzerinde birlikte çalışmalıdırlar. Yöneticiler sistemin çalışmaz hale gelmesinin etkilerinin ve işletmenin kritik sistemlerin analizlerini yapmalıdırlar. Ayrıca yöneticiler, sistemler çöktüğünde ilk olarak hangi birimin kurtarılacağı ve ne kadar süre hayatta kalınabileceğini belirlemek zorundadırlar.
Güvenlik Dış Edinimi:
Bazı işletmeler özellikle küçük işletmeler, yüksek erişilebilirlikli bir ortam sağlamak için yeterli deneyim ve kaynağa sahip değildirler. Bu durumda ağ güvenlik durumlarını ve saldırıya açıklık durumlarını gözlemek için Yönetilen Güvenlik Hizmet Sağlayıcılarından (Managed Security Service Provider) dış kaynak edinimi yapmaktadırlar.

Denetimin Rolü
Bilgi sistemlerinin güvenlik ve kontrollerinin etkin olduğunu yönetici nasıl bilir? Bu sorunun cevabı için; organizasyonlar çok amaçlı ve sistematik bir denetim yapmalıdır. Bir Yönetim Bilgi Sistemi Denetimi; firmanın bütün güvenlik ortamlarının olduğu kadar bilgi sistemlerinin yönetimlerinin kontrollerini de içerir. Denetimci, sistemin işlem akışını izlemeli ve eğer uygun ise otomatikleştirilmiş denetleme yazılımları kullanarak test etmelidir.
Güvenlik denetimleri, teknolojiler, prosedürler, dokümantasyon, eğitim ve personelin gözlemlerini de içerir. Güvenlik denetimi teknolojik araçların, bilgi sistemi görevlilerinin ve işletme çalışanlarının tepkilerini test etmek için bir iç ve dış saldırının canlandırılmasını da içerebilir. Denetim sistemdeki zayıflıkları ve meydana gelme olasılıklarını listeler ve sıralar. Ayrıca her bir tehdidin ekonomik ve organizasyonel etkisi de değerlendirilmelidir. Yönetim, bulunan açıklarının hemen düzeltilmesini de belirli bir plan çerçevesinde gerçekleştirmeli ve etkinliklerini de kontrol etmelidir.

## Güvenlik için Teknolojiler ve Araçlar

Veri ve sistem güvenliği için birçok araç ve teknoloji vardır. Bunlar; yetkilendirme, ateş duvarı, zorla giriş tespit sistemleri, antivirüs, casus yazılım koruması ve şifrelemedir.
Erişim Kontrolü
Erişim Kontrolü; sisteme içeriden ve dışarıdan yetkisiz erişimleri engellemek için bir işletmenin kullandığı politikalar ve prosedürlerin tümüne denir. Sisteme erişim hakkı kazanmak için kullanıcılar mutlaka yetkilendirilmiş olmalıdır. Yetkilendirme, sisteme giriş yapmak isteyen kişinin kim olduğunu belirlemektir. Erişim kontrol yazılımları bazı yetkilendirme metotları kullanarak, sadece yetkilendirilmiş kullanıcıların sistemi kullanmasına veya verilere erişimine izin vermek için düzenlenmiştir.
Yetkilendirme genellikle sadece yetkili kişinin bildiği bir şifre kullanılarak yapılır. Kullanıcılar da bilgisayar sistemine giriş yapmak için ve belirli sistemlere ve dosyalara erişim için şifre kullanabilirler. Bununla birlikte kullanıcılar genellikle şifrelerini unuturlar ve paylaşırlar veya kolayca tahmin edilebilen zayıf bir şifre seçerler. Çalışanların şifrelerini sık sık değişmeleri gerektiğinde kolay tahmin edilebilen şifreler seçmekte veya şifrelerini çalışma masalarında bir kağıda yazmaktadırlar. Şifreler bir ağ üzerinden iletiliyorsa dinleme yazılımları ile veya Sosyal Mühendislik ile çalınabilir.
Şifre üreticiler, akıllı kartlar, biyometrik yetkilendirme gibi yeni yetkilendirme teknolojileri, problemlerin bazılarını çözebilir. Şifre Üreticiler (Token); tek bir kullanıcının kimliğini doğrulamak için şifre üretir. Anahtarlık halkasına takılabilen kullanıcı için hızla şifre üretip gösteren küçük aygıtlardır. Akıllı Kartlar; erişim izinlerinin ve yetkilendirmelerin çip içine yazıldığı kredi kartı boyutundaki kartlardır. Bir okuyucu bu kart üzerindeki bilgileri okuyarak erişime izin verir veya engeller.
Biyometrik Doğrulama; parmak izi, retina, ses gibi kişisel biyolojik özelliklerin okunması ve incelenmesi ile yetkilendirme yapan sistemler kullanır. Biyometrik doğrulama her kişiye özgü olan davranışsal veya fiziksel özelliklerin ölçülmesi ile yapılır. Kişilere özgü parmak izi, yüz, retina izler gibi karakteristiklerini karşılaştırmak için saklar. Saklanan profil ile taranan profil uyumlu olduğunda erişim izni verilir. Bu teknoloji oldukça pahalıdır. Parmak izi ve yüz tanıma teknolojileri bilgi sistemleri güvenlik uygulamalarında kullanılmaya başlanmıştır.

## Ateş Duvarları (Firewall), İzinsiz Giriş Tespit Sistemleri ve Anti Virüsler

Ateş Duvarları, İzinsiz Giriş Tespit Sistemleri ve Anti Virüsler
Kötü yazılımlara ve izinsiz girişlere karşı koruma olmaksızın internete bağlanmak çok tehlikelidir. Ateş duvarları, izinsiz giriş tespit sistemleri ve antivirüs yazılımları işletmelerin temel koruma araçlarıdır.
Ateş Duvarları
Ateş duvarları, gelen ve giden ağ trafiğini kontrol eden donanım ve yazılımların bir birleşimidir. Güvenlik sistemi iç ağ ile internet gibi dışarı çıkış noktası arasında konumlandırılır. Ayrıca bir ateş duvarı işletmenin ağının bir kısmını diğer kısımlarından gelebilecek tehlikelere karşı da korur. 
Ateş duvarı bir ağa giriş sağlamadan önce her bir kullanıcı için kimlik bilgilerini kontrol eden bir bekçi görevi görür. Ateş duvarı, isimleri, IP adreslerini, uygulamaları ve diğer gelen trafik karakteristiklerini tanımlar. Bu bilgileri, ağ yöneticisi tarafından sisteme erişim kurallarına karşı kontrol eder.

Büyük işletmelerde ateş duvarı, doğrudan iç ağa ulaşma isteğinde bulunmayı engelleyen özel bir şekilde tasarlanmaktadırlar. Statik paket filtreleme, ağ adresi değiştirme, proxy filtreleme gibi çok sayıda ateş duvarı izleme teknolojisi bulunmaktadır.
Paket Filtreleme: Gönderilen paketleri, internet ile ağ arasında iletilen önceki ve sonraki paketlerin başlık bilgilerini kontrol eder. Ancak bu tür bir kontrolde bazı saldırılar fark edilemeyebilir. Durum Denetimi (Stateful Inspection); paketlerin gönderici ve alıcı arasındaki devam eden iletişimin parçası olup olmadığını belirleyerek ilave bir güvenlik sağlar. Paketler, onaylanmış bir iletişimin parçası olup olmadığı veya kurulan bağlantının güvenli olup olmadığına bağlı olarak kabul veya ret edilir.
Ağ Adresi Değiştirme: (Network Address Translation: NAT) Statik paket filtrelemesi ve durum denetimi yapıldığında bir güvenlik katmanı oluşturabilir. Ağ adresi değiştirme, gönderilen bilgilerin ateş duvarı dışından izlenilmesinin önlenmesi için içerideki makinelerin IP adreslerinin gizlenmesidir.
Uygulama Proxy Filtreleme; paketlerin içeriklerinin kontrol edilmesidir. Vekil sunucu (Proxy Server) veri paketlerini sistem dışında başka bir ortamda durdurur ve inceler, daha sonra ateş duvarının diğer tarafında bulunan bir vekil (Proxy) makineye gönderir. Eğer işletme dışındaki bir kullanıcı işletme içindeki bir kullanıcı ile iletişim kurmak isterse dışarıdaki kullanıcı ilk olarak, vekil uygulama ile bağlantı kurar, vekil uygulama da işletme içindeki bilgisayar ile iletişim kurar. Benzer şekilde işletme içindeki bir bilgisayar kullanıcısı dışarıdaki bilgisayar ile “konuşmak” için vekil kullanır. İyi bir ateş duvarı oluşturmak için, bir yönetici kullanıcılar için kabul edilen veya reddedilen iç kuralları, uygulamaları ayrıntılı olarak belirlemelidir. Ateş duvarları caydırıcıdır ancak ağın dış kullanıcılara açılmasını tamamen engelleyemez, sistemin güvenliğinde ise sadece bir öğe olarak görülmelidir.

İzinsiz Giriş Tespit Sistemleri
Ateş duvarlarına ilaveten, ticari güvenlik uygulamaları satıcıları artık şüpheli ağ trafiğini ve veri tabanı ile dosyalara erişim teşebbüslerini engellemek için izinsiz girişleri önleme sistemleri ve araçları sağlamaktadırlar. İzinsiz Girişleri Önleme (Intrusion Protection System: IPS); işletme ağına izinsiz girişleri belirlemek ve caydırmak için savunmasız noktaları veya belirli noktaları tam zamanlı olarak izleme özelliğine sahiptir. Sistem şüpheli veya anormal bir durum saptadığında bir uyarı verir. Tarayıcı yazılım, yanlış şifre girişleri gibi bilinen bir bilgisayar saldırısı türlerini inceler ve önemli bir takım dosyalar silinmiş veya değiştirilmiş ise sistem yönetim hatası veya vandalizm uyarısı verir. Zorla yetkisiz bir giriş olduğunda alarm vererek uyarıda bulunur. İzleme yazılımı devam etmekte olan bir saldırıyı tespit amacıyla olayları ve değişiklikleri kontrol eder. İzinsiz giriş tespit araçları, yetkisiz bir trafiği tespit ettiğinde, ağ üzerindeki belirli hassas bölgeleri kapatacak şekilde ayarlanabilir.
Antivirüs ve Anti Casus Yazılımlar
Antivirüs Yazılımları; virüslerin varlığını tespit etmek için bilgisayar sistemlerini ve sürücüleri kontrol etmek üzere tasarlanmıştır. Genellikle bu yazılımlar bulaşmış olan alanları temizler. Ancak çoğu anti virüs yazılımları yazılım üretildiği zamana kadar bilinen virüslere karşı etkilidir. Etkili kalmak için anti virüs yazılımı sürekli güncellenmelidir. McAfee, Symantec ve Trend Micro gibi anti virüs yazılımları satıcı liderlerinin ürünleri casus yazılımlara karşı da koruma sağlamaktadır. Ad-Aware, Spybot ve Spyware Doctor gibi casus yazılım temizleyici araçları oldukça kullanışlıdır.

## Kablosuz Ağların Güvenliği

Birçok açığına rağmen Kabloya Eşdeğer Gizlilik (Wired Equivalent Privacy: WEP) kullanıcı tarafından aktifleştirilmişse Wi-Fi’lerde bir parça koruma sağlar. İşletmeler kurumsal bilgilere ulaşmada Sanal Özel Ağ (Virtual Private Network: VPN) teknolojisi ile WEP’i birlikte kullanarak güvenliği geliştirebilirler.
2004 yılı Haziran ayında Wi-Fi Birliği Endüstri Ticaret Grubu kablosuz LAN ürünleri için 802.11i standardını tamamladı. Buna göre önceden var olan statik şifreleme anahtarının yerine kırılması daha zor olan sürekli değişen daha uzun bitlerden oluşan şifreleme kullanılmaya başlandı.
Etkili bir koruma için, kablosuz güvenlik teknolojisi, kablosuz aygıtları için uygun politikalar ve yöntemler ile birlikte kullanılmalıdır.

## Şifreleme ve Genel Anahtar Altyapısı

Birçok işletme internet üzerinden gönderdikleri, fiziksel olarak transfer ettikleri, sakladıkları dijital bilgileri korumak için şifreleme kullanırlar. Şifreleme; düz bir metin veya verinin gönderen ve alıcının dışında hiç kimse tarafından okunamayacak şekilde şifreli bir metin haline dönüştürülmesi işlemidir. Veri, şifreleme anahtarı olarak adlandırılan gizli bir nümerik algoritma ile kodlanmakta ve düz metin şifreli hale getirilmektedir. Mesajın alıcı tarafından çözülmesi gerekmektedir.
Web’de ağ trafiğini şifrelemede 2 metot; Güvenli Yuva Katmanı (Secure Sockets Layer: SSL) ve Güvenli Hipermetin Aktarma İletişim Kuralı (Secure-HTTP)’dir. Güvenli Yuva Katmanı ve Taşıma Katmanı Güvenliği (Transport Layer Security: TLS), güvenli Web oturumu boyunca istemci ve sunucu arasında şifreleme ve çözme işlemini yönetirler. S-HTTP ise internet üzerinden bilgi akışını şifrelemek için kullanılan bir diğer protokoldür. SSL ve TLS iki bilgisayar arasında güvenli bir bağlantı kurmak için tasarlanmış iken S-HTTP kişisel mesajlarla sınırlıdır.
Güvenli bir oturum oluşturma özelliği istemcinin internet tarayıcısı yazılımı ile sunucu arasında kurulur. İstemci ve sunucu güvenli bir iletişim konusunda anlaştıklarında hangi anahtarı ve hangi düzeyi kullanacaklarını belirlerler. Bu şekilde kurulan güvenli bir oturum süresince gönderilen ve alınan tüm bilgiler şifrelenerek gönderilir.
Simetrik Anahtar Şifreleme ve Genel Anahtar Şifreleme olmak üzere 2 alternatif şifreleme metodu vardır. Simetrik Şifrelemede, güvenli oturum açan iki istemci ve sunucu tek bir anahtar ile gönderme ve alma yaparlar alıcı da gönderici de aynı anahtarı kullanır. Şifrelerin zorluğu bit sayısı ile ölçülür. 128 bit ile şifreleme yapılmaktadır. Simetrik anahtar kullanımında alıcı ve gönderici anahtarı paylaştıkları sırada dışarıdan bir dinleme ile anahtar ele geçirilebilir.
Daha güvenli bir şifreleme formu olan Genel (Açık) Anahtar Şifreleme (Public Key) birisi paylaşılan (public) diğeri ise tamamen özel (private) olan iki anahtar kullanır. Anahtarlar biri ile şifreleme yapmak diğeri ile çözmek için birbiriyle matematiksel olarak ilişkilidir. Mesajları göndermek ve almak için iletişim kuracaklar öncelikle özel ve genel anahtar çiftlerini üretirler. Genel anahtar bir dizinde saklanır ancak özel anahtar gizli olmalıdır. Gönderici mesajı karşı tarafın genel anahtarı ile şifreler, alıcı ise kendi özel anahtarı ile mesajı çözer.

Dijital imza ve dijital sertifikalar yetkilendirmeye yardımcı olan diğer araçlardır. Dijital İmza; göndericinin özel anahtarını kullanılarak şifrelenmiş bir mesajdır. Dijital imza mesajın içeriğinin orijinalliğini doğrulamak için kullanılır.
Dijital Sertifikalar ise online işlemlerin korunması ve kullanıcının kimliğini doğrulamak için kullanılan veri dosyalarıdır. Bu sertifikayı sağlayan kurumlar o sitenin kimliğini doğrular. VeriSign, IdenTrust, Australia’s KeyPost firmaları bu sertifikaları verir. Dijital Sertifikaların kullanımı gösterilmiştir.


