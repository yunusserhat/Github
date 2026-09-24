---
title: 14. Bölüm - Veri Madenciliği
date: '2022-01-01'
type: book
weight: 160
---

1947 yılında Eniac ilk kez çalıştırılmaya başladığında, kimse dünyada milyonlarca bilgisayar bulunacağını ve bu bilgisayarların gelişerek onlarca yıl sonra veri sellerine neden olacağını düşünemezdi. Uzun süreli saklamanın ilk örnekleri olan ve birkaç kilobyte verinin saklanabildiği kil tabletler, yerlerini günümüzde giderek petabyte’ların saklandığı ortamlara bırakmıştır. Toplanan verinin bilgisayarlarda daha etkin saklanabilmesi için, bir taraftan saklama ortamları kâğıttan manyetiğe, manyetikten optiğe dönüşürken 1960’lı yılların başlarında gelişmeye başlayan basit dosyalama ortamları yerlerini her türlü verinin saklanabildiği veri tabanlarına bıraktı. 
Hiyerarşik, ağ, ilişkisel veri tabanı sistemleri, B+tree, hashing yöntemleri, sorgulama dilleri (query languages) gelişen saklama modellerinin temellerini oluşturdu. Geliştirilen modeller her türlü verinin daha yoğun olarak toplanmasını sağlarken, bu veri dağlarının saklanması ve sorgulanması ihtiyacı yeni modellerin geliştirilmesine olanak sağladı. Diğer taraftan internet ortamının da sağladığı olanaklarla büyüyen devasa boyutlardaki veri yığınları, daha da yeni modellerin geliştirilmesi ihtiyacını doğurdu. Böylece yeni ortamlar ve teknikler daha fazla verinin toplanmasını sağlarken daha fazla toplanan veri yeni modellerin ve araçların geliştirilmesine neden oldu. 

Enformasyon sağanağının inanılmaz boyutlara ulaştığı günümüzde, işletme yöneticileri hızla değişen pazar koşullarında, veriden yararlanarak etkin stratejiler oluşturmak, belirli analizler sonucu performanslarını ölçmek, bu analizler sonucunda en hızlı ve en iyi (optimum) kararı almak zorundadır. Özellikle geleceği etkin bir şekilde tahmin edebilmenin veride saklı olduğu düşüncesi, verinin analizini gerekli kılmış ve yeni arayışlara yol açmıştır. Bu yeni arayışlar business intelligence, işletme analitiği, veri madenciliği, veri tabanlarında bilgi keşfi gibi isimlerle anılmaya başlanmıştır. 


## Veri Analizi

Günümüzde karar vermede önemli bir rol üstlenen veri analizi, veriden bilgiye giden, yol işaretleri konulmamış, uzun, taşlı çakıllı bir yoldur. Veri analizi en basit tanımı ile verinin toplanması, düzenlenmesi, modellenmesi ve bilgiye erişimin denenmesidir. Veri analizi farklı disiplinlerde, 
•Kimi zaman business intelligence (iş zekâsı) adı altında, işletme enformasyonuna odaklanmış olarak en uygun kararların verilmesinde, 
•Kimi zaman yapay zekâda, makine öğreniminde sınıflandırma, kümeleme ve geleceğin tahmininde, 
•Kimi zaman veri madenciliği adı altında, geleceğin tahmini için enformasyon örüntülerinin çıkarımında veya bu örüntülerin tanımsal veya tahmin amaçlı olarak sınıflandırılmasında, 
•Kimi zaman istatistik cephesinde, 
•Tanımlayıcı istatistikte (descriptive statistics), 
•Verinin içerdiği özelliklere odaklanan keşfedici veri analizinde (exploratory data analysis),
•Mevcut varsayımların doğruluğunu test eden onaylayıcı veri analizinde (confirmatory data analysis), 
•Büyük veri problemleri için önerilen istatistik çıkarımında (statistical inference / inductive statistics) rol oynamaktadır. 

Veri analizinin hedefi etkin kararların verilmesinin sağlanması, diğer bir ifade ile optimum noktanın bulunmasıdır. Ancak her problem bir çözüm içermeyeceği gibi, günümüz hesaplanabilirlik olanakları çerçevesinde, bir problemin bir çözümü olsa bile, bu çözümü her zaman veya kesin doğrularla hesaplayabilmek mümkün olmayabilir. 
Birçok problem için mümkün bir çözüm olup olmadığını belirlemek ve hesaplanan çözümün, o problemin en uygun çözümü olup olmadığını bilebilmek her zaman olası değildir. Bununla birlikte tamamen karanlıkta yaşamaktansa alacakaranlıkta bulunmak veya tamamen kör olmaktansa, körler ülkesinde tek gözlü kral olmak, ancak veri analizi yaklaşımlarının kullanılması ile mümkün olmaktadır. 
90’lı yılların başında günümüz anlamı ile ilk defa Gartner Group tarafından dile getirilen business intelligence kavramı bu amaçları hedeflemektedir. Gartner Group’a göre business intelligence, enformasyona bilgi teknolojileri destekli her türlü erişimi ve karar destek amacıyla enformasyonun analizini gerçekleştiren tüm süreçleri ifade etmektedir. 

Business intelligence (iş zekâsı), işletmelerin karar verme süreçlerini etkileyen ve optimize eden tüm araçların kullanımını, verinin toplanmasını, saklanmasını, düzenlenmesini, analiz edilmesini ve görselleştirilmesini, verinin en etkin ve kolay biçimde yönetilmesini sağlayan tüm süreçleri kapsayan bir yaklaşımdır. İş zekâsı, veriden bilgiye geçiş sürecinde bir takım yöntem ve teknolojilerle bütünleşik bir yapı sunmaktadır. 


## Veri Madenciliği

1995 yılında birincisi düzenlenen Knowledge Discovery’in Databases konferansı bildiri kitabı sunuşunda enformasyon teknolojilerinin oluşturduğu veri dağları, 
“Dünyadaki enformasyon miktarının her 20 ayda bir ikiye katlandığı tahmin edilmektedir. Bu ham veri seli ile ne yapmamız gerekmektedir? İnsan gözleri bunun ancak çok küçük bir kısmını görebilecektir. Bilgisayarlar bilgelik pınarı olmayı vaat etmekte, ancak veri sellerine neden olmaktadır.” cümleleri ile vurgulanmaktadır.
Veri tabanı sistemlerinin artan kullanımı ve hacimlerindeki olağanüstü artış, organizasyonları elde toplanan bu verilerden nasıl faydalanılabileceği problemi ile karşı karşıya bırakmıştır. Geleneksel sorgu (query) veya raporlama araçlarının veri yığınları karşısında yetersiz kalması, Veri Tabanlarında Bilgi Keşfi-VTBK (Knowledge Discovery in Databases) adı altında, sürekli ve yeni arayışlara neden olmaktadır. 
Veri madenciliği veya veri tabanlarında bilgi keşfi, veri dizilerinden geçerli, yeni, mümkünse faydalı ve anlaşılır örüntülerin ortaya çıkartılabilmesi için gerçekleştirilen apaçık olmayan bir süreçtir. 

Veri madenciliği yöntemleri; genel olarak istatistik, yapay zekâ ve yapay zekânın uzantısı olan makine öğrenimi olmak üzere iki ana kökten beslenmektedir. Bu iki disiplinin yanında, şekilde görüldüğü gibi veri tabanı yönetim sistemleri, dilbilim, görselleştirme ve coğrafi bilgi sistemleri de veri madenciliği yöntemlerinde önemli rol oynamaktadır. 


## Veri Madenciliği Süreci 

Veri madenciliği veya veri tabanlarında bilgi keşfi konusunda, veriden bilgiye giden yolda geliştirilen çeşitli süreçler bulunmaktadır. Bu kısımda ilk olarak Fayyad ve diğerleri tarafından sunulan akademik bir süreç ve CRISP-DM kısaca anlatılacaktır. Fayyad, Piatetsky-Shapiro ve Smith tarafından 1996 yılında yayımlanan From Data Mining to Knowledge Discovery in Databases isimli makalede okuyucuya sunulan veri madenciliği süreci şekilde görülmektedir. 

Seçim (Selection): Bu adımda önemli olduğu öngörülen veri seçilir veya oluşturulur. Bu adımdan sonra veri madenciliği süreci elde edilen ve hedef veri (target data) olarak isimlendirilen bu veri üzerinde gerçekleştirilir. 
Ön işleme (Preprocessing): Veri madenciliği çalışmalarında iyi bir sonuç elde edilebilmesi başlangıçta hazırlanan verinin uygunluğuna ve kalitesine bağlıdır. Veride ne kadar az parazit (noise) mevcutsa elde edilebilecek sonuçların kalitesi o denli artacaktır. Sorunlu verinin temizlenmesi, eksik verinin bir şekilde tamamlanması ve yeni öz niteliklerin oluşturulması bu aşamanın önemli ögeleridir. 
Dönüştürme (Transformation): Verinin farklı veri madenciliği yöntemleri için uygun formata dönüştürülmesi aşamasıdır. 
Veri madenciliği: Belirlenen amaçlara uygun mevcut veri madenciliği yöntemlerinin kullanılması aşamasıdır. Bu aşamanın sonunda çeşitli örüntüler elde edilir. 
Yorumlama (Interpretation): Veri madenciliği aşamasında belirlenen örüntülerin yeterli bilgi içerip içermediği yorumlanır. Eğer bu inceleme sonucunda elde edilen örüntüler yeterli bulunmazsa önceki adımlar tekrar edilir. 



## Crisp Dm Süreç Modeli

CRISP-DM (Cross Industry Standard Process for Data Mining), veri madenciliği problemleri çözümünde takip edilmesi önerilen veri madenciliği süreç modelidir. 
CRISP-DM 1.0 ile ilgili ilk çalışmalar 1996 yılının sonlarında veri madenciliği alanında belli bir olgunluğa erişmiş olan SPSS, NCR (Teradata) ve Daimler-Benz konsorsiyumu tarafından başlatılmıştır. Metodolojinin ilk sürümü Brüksel’de 4. CRISP-DM Workshop’ında 1999 yılı Mart ayında sunulmuştur. 2006-2008 yılları arasında CRISP-DM 2.0 sürümü üzerinde çalışmalar başlatılmakla birlikte, bu çalışmalar sonuçsuz kalmıştır. 
CRISP-DM, veri madenciliği sürecini altı ana aşamaya ayırmaktadır. Aşamaların sırası kesin değildir ve farklı aşamalar arasında ileri ve geri geçişler söz konusu olabilir. 
Şekilde sunulan süreç diyagramı CRISP-DM in farklı aşamaları arasındaki ilişkileri göstermektedir. 

İşin anlaşılması (Business Understanding): Başlangıç aşamasında işletmenin bakış açısına uygun olarak projenin amaç ve gereksinimlerinin anlaşılmasına odaklanılır. Ardından amaç ve gereksinimler bir veri madenciliği problemi olarak tanımlanır ve amaçlara erişebilmek üzere öncü bir plan tasarlanır. 
Verinin anlaşılması (Data Understanding): Bu aşama veri kalitesine ilişkin problemleri tanımlayabilmek, veri hakkında ilk izlenimleri edinebilmek, ilginç alt dizileri belirleyebilmek veya veri dizilerinde gizli bulunan enformasyonun çıkartılması için hipotezlerin geliştirilmesi gibi çeşitli amaçları gerçekleştirecek faaliyetleri içerir. 
Veri hazırlama (Data Preparation): Veri hazırlama aşaması, ham veriden başlayarak nihai veri dizisine erişinceye kadar gerekli tüm faaliyetleri kapsamaktadır. Veri hazırlama işlemleri önceden belirlenemeyen sırada, muhtemelen birçok defa icra edilebilir. İlgili işlemler; tablo, kayıt, öz nitelik seçimi ve modelleme araçları için verinin temizlenmesi ve dönüştürülmesini içermektedir. 
Modelleme (Modeling): Bu aşamada çeşitli modelleme yöntemleri seçilir ve uygulanır. Modelleme yöntemlerinde parametreler optimal değerler elde edilecek şekilde ayarlanmalıdır. Tipik olarak aynı veri madenciliği problem tipi için çok çeşitli yöntemler bulunmaktadır. Bazı yöntemler, verinin düzenlenmesinde özel şartlara sahip olabilir. Bu nedenle veri hazırlama aşamasına sık sık dönülmesi gerekebilir. 

Değerleme (Evaluation): Modelleme aşamasında veri analizi bakış açısına göre yüksek kaliteli olduğu düşünülen model veya modeller kurulmuştur. Projenin bu aşamasında kurulan bu model veya modellerin ilgililerle paylaşılmasından önce, modelin en ince ayrıntısına kadar değerlendirilmesi önem taşımaktadır. Modelin kuruluşunda icra edilmesi gereken adımlar gözden geçirilmeli ve modelin işletme amaçlarını gerçekleştireceğine emin olunmalıdır. Yeterince incelenmemiş bazı önemli işletme konuları var ise anahtar amaç bunların belirlenmesi olacaktır. Bu aşamanın sonunda veri madenciliği sonuçlarının kullanımı konusunda karara varılır. 
Kullanıcılarla paylaşım (Deployment): Modelin oluşturulması ile proje sona ermez. Kazanılan bilginin son kullanıcının faydalanabileceği şekilde düzenlenmesi ve takdimi gerekmektedir. Gereksinimlere bağlı olarak kullanıcılarla paylaşma aşaması bir raporun üretilmesi kadar basit olabileceği gibi, tekrarlanabilir veri madenciliği sürecinin uygulanması kadar karmaşık olabilir. Birçok durumda kullanıcılarla paylaşma aşamasını üstlenecek olan, veri analisti yerine müşterilerin doğrudan kendileri olacaktır. 

## Veri Önİşleme

Enformasyon ve iletişim teknolojilerinin meşhur ifadesi Garbage In, Garbage Out (çöp girerse çöp çıkar), veri madenciliğinde de kaliteli verinin önemini vurgulamaktadır. Düşük kaliteli veri ile yapılacak olan veri madenciliği çalışmalarının, düşük kaliteli veya hatalı sonuçların elde edilmesine yol açması kaçınılmazdır. 
Verinin çok büyük hacimlerde olması ve çeşitli heterojen kaynaklardan toplanması, parazitli (noisy), eksik (missing) ve tutarsız (inconsistent) verinin ortaya çıkmasında temel rol oynamaktadır. 
Veri ön işleme, veri analizi sürecinin süratle tamamlanabilmesi ve veri analizi sonuçlarının kalitesinin artırılması amacı ile veri üzerinde gerçekleştirilen veri entegrasyonu (data integration), veri temizleme (data cleaning), veri dönüştürme (data transformation) ve veri indirgeme (data reduction) işlemleridir. 

Veri entegrasyonu, verinin bir çok kaynaktan toplanması, seçilmesi ve entegre edilerek tek bir kaynakta bir araya getirilmesi işlemidir. Günümüzde entegre sistemlerin kullanılması önem taşısa da, on yılların birikimi ile gelen çeşitli iç ve dış veri tabanlarının bir araya getirilmesi ve bunların özellikle data warehouse (veri ambarı) veya data mart gibi veri depolarında saklanması, veri ön işlemenin zaman ve işgücü açısından en yoğun işlemidir. 
Veri temizleme, verideki parazitlerin ortadan kaldırılması, eksik verinin tamamlanması ve tutarsızlıkların düzeltilmesi işlemidir. 
Veri dönüştürme, normalleştirme (normalization), kesimlere ayırma (discretization) / birleştirme (aggregation) gibi teknikler kullanılarak verinin modelleme aşamasında kullanılacak veri analizi modelleri / yöntemleri için hazırlanmasıdır. 
Veri İndirgeme, öz nitelik ve/veya nesne sayısının örnekleme (sampling), faktör analizi (factor analysis), boyut indirgeme (dimension reduction) gibi çeşitli tekniklerle azaltılması ile veri hacminin küçültülmesi için gerçekleştirilen işlemlerdir.

## Veri Entegrasyonu 

Veri entegrasyonu farklı veri depolarında bulunan verinin tek bir veri deposunda toplanması veya fiziki olarak bir araya getirilmese de kullanıcıya bütün hâlinde sunulması için gerekli işlemlerin gerçekleştirilmesidir. 
Çeşitli ve muhtemel heterojen veri kaynaklarının entegrasyonu ihtiyacı, 1960’lı yıllarda ilk veri tabanı uygulamalarının kullanılmasından bu yana gündemdedir. 1980’li yılların ortalarından başlayarak ev bilgisayarı kavramının süratle kişisel bilgisayarlara dönüşmesi ve bu bilgisayarların 1990’lı yıllarda iş yerlerinde de yoğun olarak kullanılmaya başlanması, “cam fanus” dönemini sona erdirerek oyunun kurallarının devrim niteliğinde değişmesine neden olmuştur. İşletmelerde artık verinin işlendiği ve saklandığı tek bir merkez yerine, giderek büyüyen bilgisayar ağları merkezkaç bir yapıyı ve dolayısı ile büyük ölçekte donanım ve yazılım çeşitliliğini beraberinde getirmiştir. Bu çeşitlilik aynı zamanda veri entegrasyonu için de başlıca sorun kaynağı olmuştur. 
Günümüzde enformasyon teknolojisinin gelişmesi ve gereksinimlerin farklılaşması, çeşitli yaklaşımların geliştirilmesine neden olmuştur. Bu yaklaşımları veri konsolidasyonu (data consolidation), veri yayınımı (data propagation) ve veri federasyonu (data federation) olmak üzere üç ana başlık altında incelemek mümkündür: 
Veri konsolidasyonu, farklı birçok kaynakta yer alan verinin tek bir fiziki kaynakta entegrasyonu; veri yayınımı farklı konumlardaki farklı veri kaynaklarından verinin kopyasının çıkartılması (replica) süreci; veri federasyonu ise farklı kaynaklarda bulunan verinin sanal olarak entegrasyonudur. 

## Veri Temizleme

Veri temizleme (data cleaning / cleansing), bir veri dizisinde, tablosunda veya herhangi bir veri deposunda bulunan hatalı veya bozuk kayıtların tespit edilmesi, düzeltilmesi veya ortadan kaldırılması işlemidir. 
Eksik veri veya değer (missing data / value) bir veya daha fazla gözlem / öz nitelik değerinin, sistematik olmayan bir veri giriş hatası veya cevap vericinin özellikle cevap vermemesi gibi nedenlerle veri dizisinde eksik kalmasıdır. 
Eksik veri hatalı veya yetersiz araştırma tasarımı, sorulan soruya cevap vermekten kaçınma, cevaplayıcının motivasyon eksikliği, soruları yönelten kişilerin yeterli özeni göstermemesi ve veri toplama cihazlarındaki sorunlar gibi birçok nedenden dolayı ortaya çıkabilir. Bilgisayar aracılığı ile gerçekleştirilen bir ankette, kullanılan yazılımın bir soru cevaplanmadan diğerine geçilmesine izin vermemesi, katılımcıların tüm soruları cevaplaması için ödül uygulamaları ile teşvik edilmesi önlemler arasında sayılabilir. 

Veri madenciliği temel olarak veri yığını içerisinde yoğun bir şekilde ortaya çıkan örüntülerin keşfedilmesine odaklanmıştır. Buna karşılık sıra dışı değer analizi, genellikle parazit olarak değerlendirilen, ender olarak ortaya çıkan ve çoğu zaman bir girdi hatasından kaynaklanan verinin belirlenmesini amaçlamaktadır. Ancak kimi zaman sıra dışı değer olarak görülen bu nesneler çok önemli vakaların teşhis edilmesine olanak sağlamaktadır. Bir kişinin parazit olarak nitelendirdiği bir değer, bir başkası için bir sinyal niteliği taşıyabilmektedir (Knorr, Ng, & Tucakov, 2000). 
Sıra dışılık, birçok yazar tarafından birbirine oldukça benzeyen ifadelerle tanımlanmıştır. Grubbs’a göre sıra dışılık “İçinde bulunduğu örnek kütlenin diğer üyelerinden önemli düzeyde farklılık gösteren gözlemdir.” (Grubb, 1974) Barnett ve Lewis ise sıra dışılığı, “Bir veri kümesinin geri kalanı ile uyuşmazlık gösteren bir gözlem veya gözlemlerin alt kümesi” olarak tanımlamaktadır.” (Barnett & Lewis, 1994). Hawkins’e göre ise sıra dışılık, “Başka bir mekanizma tarafından üretildiği şüphesine kaynaklık edecek şekilde diğer gözlemlerden çok farklı olan gözlemdir.” (Hawkins, 1980). 

## Veri Dönüştürme

Veri dönüştürme normalleştirme (normalization), kesimlere ayırma (discretization) / birleştirme (aggregation) gibi teknikler kullanılarak verinin modelleme aşamasında kullanılacak veri analizi modelleri / yöntemleri için hazırlanmasıdır. 
Veri dönüştürme (data transformation), daha sağlıklı sonuçların elde edilebilmesi veya verinin kullanılan algoritmalarla uyumlu olabilmesi için, verinin tanımlanan bir fonksiyona uygun olarak farklı değer veya ölçeklere dönüştürülmesi işlemidir. 

## Veri İndirgeme

Veri depoları, enine ve boyuna büyümesini sürdürmektedir. Sürekli güçlenen veri toplama araçları, diğer taraftan yeni öz niteliklerin de (boyut) veri deposuna kazandırılmasını sağlamaktadır. 
Veri depolarındaki bu şekilde enine büyüme ise mizahi bir şekilde boyut laneti (curse of dimensionality) olarak isimlendirilmektedir. Boyut laneti, yüzlerce boyuta sahip olan bir veri tabanında işlem yapmanın giderek imkânsızlaşmasını ve veri hacminin olağanüstü düzeyde artışını ifade etmektedir. Bu şekilde hacimlerdeki olağanüstü artışlar, büyük veri (big data) başlığı altında yeni araştırma alanlarının oluşmasına neden olmaktadır. Boyut laneti, nümerik analiz, örnekleme, kombinatorik, makine öğrenimi ve veri madenciliği gibi çeşitli disiplinlerde işlenmektedir. Artan boyut sayısının yol açtığı ortak sorun, boyut sayısı arttıkça uzay hacminin artması, bunun paralelinde mevcut verinin giderek uzayda seyrekleşmesi ve istatistik anlamda elde edilen sonuçların güvenilirliğinin azalmasıdır. Bu sorunun önüne geçebilmek ancak boyut sayısı arttıkça, mevcut verinin de aynı oranda artması ile veya ikisi arasında belirli bir oranın sağlanması ile mümkün olacaktır. 

Bu örneklerden hareketle giderek artan veri büyüklüğü etkin analiz olanaklarını yok etmektedir. Bu nedenle veri büyüklüğünün bir şekilde azaltılması kaçınılmazdır. Genel olarak veri indirgeme başlığı altında toplanan bu yöntemleri, 
•Öz nitelik / boyut sayısının azaltılması (dimensionality reduction), 
•Nesne / gözlem sayısının azaltılması (numerosity reduction), 
•Çeşitli sıkıştırma teknikleri ile veri hacminin azaltılması (data reduction), olmak üzere üç ana başlık altında incelemek mümkündür. 
Öz nitelik / boyut sayısının azaltılmasında kullanılan en etkin analiz yöntemi faktör analizidir. Faktör analizi kendi içerisinde birçok farklı algoritma içermektedir. Bu algoritmalar içerisinde de en çok tercih edilen temel bileşenler analizidir. (Principal Component Analysis) 

## Veri Madencliği Modelleri

Özellikle çok değişkenli istatistik analiz ve makine öğreniminde geliştirilen çeşitli yöntemler, geleneksel olarak; 
•Sınıflandırma (classification), 
•Kümeleme (clustering), 
•Örüntü madenciliği başlığı altında sık gerçekleşen örüntülerin (frequent pattern mining) , ardışık zamanlı örüntülerin (sequential patterns) ve birliktelik kurallarının (association rules) analizi olmak üzere üç ana grupta toplanmaktadır. 
Bu üç veri madenciliği yaklaşımında günümüze kadar yüzlerce algoritma geliştirilmiştir. 

### Sınıflandırma

Veri madenciliği içerisinde üç ana gruptan biri olan sınıflandırma, veri dizisinin istatistik ve/veya makine öğrenimi yöntemleri kullanılarak önceden belirlenen sınıflara atanması işlemidir. Sınıflandırma yöntemleri makine öğrenimi terminolojisinde denetimli öğrenme (supervised learning) başlığı altında toplanmıştır. 
Gerek istatistik gerekse makine öğrenimi temelli çeşitli sınıflandırma yöntemleri geliştirilmiştir. İstatistik yöntemler içerisinde lineer ve lineer olmayan başlıca yöntemler lineer regresyon analizi, lojistik regresyon analizi, diskriminanz analizi, Bayes sınıflandırma yöntemleridir. Makine öğrenimi yöntemleri içerisinde ise karar ağaçları, en yakın komşu yöntemi, yapay sinir ağları, destek vektör makineleri başlıca yöntemlerdir. Son dönemlerde fuzzy temelli sınıflandırma yöntemleri önemli bir araştırma alanıdır. 
Karar ağaçları: Bir karar ağacı, doğal bir ağaçta olduğu gibi kök (root), dal (branch) ve yapraklardan (leaf) meydana gelmektedir. Bir karar ağacında bu oluşum, kök düğüm, yaprak olmayan veya ara düğüm (non-leaf node / internal node) ve bir karar ağacının sona erdiği noktalar olan yaprak düğüm (leaf node) kavramları ile ifade edilir. Şekilde tipik bir karar ağacı çıktısı görülmektedir. Şekilden izlenebileceği gibi kök düğümden başlayarak her hiyerarşide veri dizisinin belirli kriterlere göre bölünmesi (split) gerçekleşmektedir. Seçilen karar ağacı algoritmasına göre bölünme işlemi, her aşamada ikili (binary), üçlü (tertiary) veya çoklu olabilir. 
Karar ağaçları öğreniminde iki ana hedef söz konusudur. Sınıflandırma ağaçları (classification tree) olarak isimlendirilen birinci grupta, veri dizisinin olabildiğince homojen olarak sınıflandırılması; regresyon ağaçları (regression tree) olarak isimlendirilen ikinci grupta ise tahmin modellerinin kurulması hedeflenmektedir. 
k-en yakın komşu algoritması: k-en yakın komşu (k-nearest neighbor) algoritması, makine öğrenme yöntemleri içerisinde en basit sınıflandırma yaklaşımlarından biridir. Bu algoritmada sınıflandırılmak istenilen nesne, öz nitelik değerlerine göre kendisine en yakın komşu veya komşuların sınıfına atanır. Sınıflandırmada aktif rol alan komşuların sayısı k ile gösterildiği için, algoritma k-en yakın komşu algoritması olarak isimlendirilmektedir. Algoritma, son derece basit olmakla birlikte k değerinin belirlenmesi algoritmanın etkinliği açısından önemlidir. 
Yapay sinir ağları: Yapay sinir ağı (YSA) modelleri (artificial neural net models), connectionist modeller, paralel dağıtılmış işleme modelleri (parallel distributed processing models) veya neuronorphic sistem gibi değişik şekillerde isimlendirilmektedir. (Lippmann, 1987) Ancak ismi ne olursa olsun tüm bu modeller, biyolojik sinir sisteminin bilinen yapısını göz önüne alarak yüksek bir performansın elde edilmesini sağlayacak şekilde basit hesaplama elemanlarının yoğun bağlantılarından meydana gelmiştir. YSA modelleri, paralel ve yüksek hesaplama hızlarının gerekli olduğu özellikle konuşma ve görüntü algılama başta olmak üzere çeşitli sahalarda büyük bir potansiyele sahiptir. Von Neumann bilgisayarlarında olduğu gibi program komutlarının sırasal olarak icra edilmesi yerine, YSA modelleri birçok hesaplama elemanının değişken ağırlıklarla birbirlerine bağlanmasını ve yoğun paralel işlemlerin yapılmasını öngören çeşitli varsayımlara dayandırılmaktadır. 
Genel olarak bir YSA modeli şekilde görüldüğü gibi, n adet katman (layer), her katmanda biyolojik sinir hücrelerine benzer işlevi yerine getiren ve değişik sayılarda olabilen hesaplama elemanları, katmanlar boyunca bu hesaplama elemanları arasındaki yoğun bağlantılardan meydana gelmektedir. Çeşitli YSA modellerinde kullanılan hesaplama elemanları, yapay sinir hücresi (artificial neuron), düğüm (node), birim (unit) veya işlem elemanı (processing element) olarak isimlendirilmektedir. 

### Kümeleme

Küme analizi (cluster analysis) veya kümeleme (clustering), en basit tanımı ile veri dizisinde yer alan benzer nesnelerin aynı gruplarda yer alacak şekilde ayrıştırılmasıdır. Küme analizinde, aynı küme içerisinde yer alan nesnelerin olabildiğince birbirleri ile bağdaşık (homojen – homogeneous / benzer), farklı kümelerde yer alan nesnelerle ise olabildiğince ayrışık (heterojen – heterogeneous / benzemez) olması hedeflenir. 
Küme analizi, nesnelerin belirlenen öz niteliklerine ve dolayısı ile öz nitelik değerlerine göre alt gruplara, kümelere ayrılabilmesi için istatistik ve makine öğrenimi alanlarında geliştirilen çeşitli yöntemler ve süreçlerdir. 
Algılama ve öğrenmenin temel ögesi, nesnelerin benzerliklerine göre sınıflandırılmasıdır. Makine öğreniminde denetimsiz öğrenmenin (unsupervised learning) temel araçlarından biri olan küme analizi, nesneleri benzerlik ilişkilerine göre gruplandırması ile insan beyninin tipik bir akıl yürütme işlevini taklit etmektedir. Bu bakış açısına göre küme analizi gizli örüntülerin (hidden pattern) denetimsiz öğrenme yaklaşımı ile aranmasıdır. Örneğin bitkilerin hayvanlardan, köpeklerin kedilerden ayırt edilebilmesi çocukluğun erken dönemlerinde geliştirilen bilinçaltı öğrenme mekanizmaları ile gerçekleştirilen kümeleme sürecidir. Küme analizi makine öğrenimi, istatistik ve veri tabanı yönetim sistemleri gibi alanlarda farklı yöntemler ve kavramlar kullanılarak geliştirildiği için, özellikle kavram birliğinin sağlanması büyük önem taşımaktadır. 

Küme analizinin ilk fikirleri, 1932 yılında antropolojide Harold Edson Driver ve Alfred Louis Kroeber’in Quantitative Expression of Cultural Relationships (Kültürel İlişkilerin Sayısal İfadesi) (Driver & Kroeber, 1932) çalışması ile başlamış, 1938 yılında psikolojide Joseph Zubin’in çalışmaları ile filizlenmiştir. Robert Tryon küme analizinin öncülerinden olup 1939 yılında yayımladığı Cluster Analysis isimli çalışması küme analizi yöntemini anlatan ilk eserdir. Robert Tyron ve Raymond Cattell’in 1943 yılında psikolojide kişisel özelliklerin sınıflandırılması çalışmaları, gözlenen benzerliği temel alarak nesnelerin düzenlenmesi için matematik süreçlerin geliştirilmesini sağlamıştır (Gore, 2000). Bununla birlikte kümeleme yöntemleri ancak R.R. Sokal ve P.H.A. Sneath tarafından 1963 yılında yayımlanan Principles of Numerical Taxonomy isimli eser ile bilimsel kullanımda geniş ölçekte yer bulmaya başlamıştır. 
Küme analizi yöntemleri, aynı yıllarda hiyerarşik ve bölümleyici (partitioning) ana başlıkları altında iki farklı yaklaşımla geliştirilmeye başlanmıştır. İlk dönem geliştirilen hiyerarşik yöntemler durum uzayını arama (state space search) veya kapsamlı arama (exhaustive search) yaklaşımlarını kullanırken bölümleyici algoritmalarda heuristic yaklaşımlar ön plana çıkmıştır. 

Bölümleyici algoritmalar içerisinde en bilineni olan k-means algoritması ise 1957 yılında basılmamış Bell laboratuvarları teknik dokümanları içerisinde S. Lloyd’un (Lloyd, 1982) ve 1967 yılında J. MacQueen’in (Macqueen, 1967) çalışmaları ile gündeme gelmiştir. 
Enformasyon ve iletişim teknolojilerindeki olağanüstü gelişmelerden, küme analizi yöntemleri de önemli ölçüde payını almıştır. Günümüzde terabytelarla ifade edilen veri tabanlarının gerek nesne gerekse öz nitelik sayıları açısından yönetimi, sürekli olarak daha etkin sistemlerin geliştirilmesini zorunlu kılmaktadır. Bu boyutlardaki verinin işlenmesine olanak sağlayacak yeni kümeleme algoritmalarının geliştirilmesi, veri madenciliği alanında küme analizi araştırmalarının önemli bir yere sahip olmasını sağlamıştır. Özellikle 1990’lı yılların ortalarından başlayarak çok çeşitli algoritmalar geliştirilmiştir. 
Çeşitli işletme ve devlet yönetimi uygulamalarının yanı sıra, küme analizi antropoloji, telekomünikasyon, uzay araştırmaları, uzaktan algılama (remote sensing), biyoenformatik, tıp, kimya, sosyoloji ve jeoloji gibi alanlarda önemini giderek artırmaktadır. Özellikle makine öğrenimi kapsamında geliştirilen kümeleme algoritmaları, örüntü tanıma (pattern recognition), konuşma tanıma (speech recognition), görüntü işleme (image processing), görüntü işlemede vektör nicemleme (vector quantization) olarak da bilinen veri sıkıştırmada kullanılan özellikli uygulamalarda, tıbbi görüntüleme, suç (crime) ve sosyal ağ (social networks) analizlerinde rol oynamaktadır. 

### Örüntü Madencliği

Pazar sepeti analizi (market basket analysis), örüntü madenciliğinin (pattern mining) en eski uygulamasıdır. Alışveriş yapan her müşterinin hangi mal veya hizmetleri satın almaya eğilimli olduğu bu müşteriye ilişkin bir satın alma örüntüsünün oluşmasını sağlamaktadır. Elektronik satış noktası araçlarındaki gelişmeler, pazar sepeti analizinin giderek daha büyük önem kazanmasına ve etkinleşmesine neden olmuştur. Özellikle müşterilerin sadakat kartı (loyalty card) kullanması durumunda, müşterinin kişisel özelliklerine uygun olarak satış taktiklerinin geliştirilebilmesi söz konusu olabilmektedir. Pazar sepeti analizi ile satışların artırılabilmesi için ürünlerin raf konumlarının belirlenebilmesi, müşteriye özel uygulamaların geliştirilmesi, stok kontrol uygulamalarının etkinliğinin artırılabilmesi sağlanmaktadır. 
Her alışveriş sırasında müşterilerin şarküteri ürünlerini tercih etmesi veya sebze yoğun alışveriş yapması bu müşterilerin satın alma örüntülerini oluşturacaktır. Bu örüntülerin birçok müşteride benzerlik taşıması, bir ürünü alan bir müşterinin başka bir ürünü de alacağının tahmin edilmesini sağlamaktadır. Bu yaklaşım yazında birliktelik kuralları (association rule) olarak isimlendirilmektedir. 
•Müşterilerin yumurta satın alması durumunda, %75 ihtimalle ekmek de alması, 
•Düşük yağlı peynir ve yağsız yoğurt alan müşterilerin, %85 ihtimalle diyet süt de satın alması, pazar sepeti analizi sonucunda elde edilen bazı birliktelik kurallarıdır. 

Müşterilerin satın alma örüntülerinin tarih kayıtlarının da tutulması durumunda, müşterinin bir sonraki alışverişinde hangi ürünleri satın alacağının tahmin edilmesi için kullanılan örüntüler, ardışık zamanlı (sequential) olarak isimlendirilir. Ardışık zamanlı örüntülere ilişkin bazı birliktelik kuralları aşağıda sunulmuştur. 
•X ameliyatı yapıldığında, 15 gün içinde %45 ihtimalle Y enfeksiyonu oluşacaktır, 
•İMKB endeksi düşerken A hisse senedinin değeri %15’ten daha fazla artacak olursa üç iş günü içerisinde B hisse senedinin değeri %60 ihtimalle artacaktır, 
•Çekiç satın alan bir müşteri, ilk üç ay içerisinde %15, bu dönemi izleyen üç ay içerisinde %10 ihtimalle çivi satın alacaktır. 
Birliktelik kurallarının araştırılması için çeşitli algoritmalar geliştirilmiştir. Bunların içerisinde özellikle Apriori, Eclat (equivalence class transformation) ve Fp- Growth (frequent pattern) vurgulanabilir. 


