# API Abuse Prevention <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Abuse Prevention** modülü, API’lerinizi hedef alan kimlik bilgisi doldurma, sahte hesap oluşturma, içerik kazıma (scraping) ve diğer kötü amaçlı eylemleri gerçekleştiren botların tespitini ve etkisizleştirilmesini sağlar.

## API Abuse Prevention tarafından engellenen otomatik tehditler

**API Abuse Prevention** modülü varsayılan olarak aşağıdaki bot türlerini tespit eder:

* [Şüpheli API etkinliği](../attacks-vulns-list.md#suspicious-api-activity)
* [Hesap ele geçirme](../attacks-vulns-list.md#account-takeover)
* [Güvenlik tarayıcıları](../attacks-vulns-list.md#security-crawlers)
* [Scraping](../attacks-vulns-list.md#scraping)
* [Sınırsız kaynak tüketimi](../attacks-vulns-list.md#unrestricted-resource-consumption) (en az [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 gerektirir ve şu an için [Native Node](../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmemektedir)

[API kötüye kullanım profili kurulumu](../api-abuse-prevention/setup.md#creating-profiles) sırasında, **API Abuse Prevention** modülünü tüm bot türlerine karşı koruma sağlayacak şekilde yapılandırabilir veya yalnızca belirli tehditlerle sınırlayabilirsiniz.

## API Abuse Prevention nasıl çalışır?

**API Abuse Prevention** modülü, ML tabanlı yöntemlerin yanı sıra istatistiksel ve matematiksel anomali arama tekniklerini ve doğrudan kötüye kullanım vakalarını içeren karmaşık bir bot algılama modeli kullanır. Modül, normal trafik profilini kendi kendine öğrenir ve belirgin şekilde farklı davranışları anomali olarak tanımlar.

API Abuse Prevention, kötü amaçlı botları [oturumları içinde](../api-sessions/overview.md#api-sessions-and-api-abuse-prevention) belirlemek için birden çok dedektör kullanır. Modül, hangilerinin işaretlenmesinde hangi dedektörlerin rol oynadığına dair istatistikler sağlar.

Aşağıdaki dedektörler devreye girebilir:

* **Kötü user-agent** isteklerde yer alan `User-Agent` başlıklarını analiz eder. Bu dedektör; tarayıcılar, kazıyıcılar (scraper) ve güvenlik denetleyicilerine ait olanlar dahil belirli imzaları kontrol eder.
* **Kimlik doğrulama kötüye kullanımı** anormal davranışı belirlemek için önceden tanımlı eşik ile kimlik doğrulama isteklerinin oranını ve bir aralıktaki istek sayısını analiz eder. Yanlış pozitifleri önlemek için uygulamanın toplam kimlik doğrulama istek hacmini de dikkate alır.
* **İstek benzersizliği** bir oturum sırasında ziyaret edilen benzersiz uç noktaların sayısını analiz eder. Bir istemci sürekli olarak örneğin %10 veya daha az benzersiz uç noktayı ziyaret ediyorsa, insan kullanıcıdan ziyade bot olma olasılığı yüksektir.
* **Şüpheli davranış puanı** bir oturum sırasında gerçekleştirilen olağan ve olağan dışı iş mantığı API isteklerini analiz eder.
* **İş mantığı puanı** uygulamanızın davranışı bağlamında kritik veya hassas API uç noktalarının kullanımını analiz eder.
* **İstek oranı** belirli bir zaman aralığında yapılan istek sayısını analiz eder. Bir API istemcisi, belirli bir eşiğin üzerinde sürekli olarak yüksek oranda istek yapıyorsa, insan kullanıcıdan ziyade bot olma olasılığı yüksektir.
* **İstek aralığı** ardışık istekler arasındaki zaman aralıklarını analiz ederek bot davranışının göstergesi olan rastgelelik eksikliğini bulur.
* **Sorgu kötüye kullanımı** önceden tanımlanmış bir eşiği aşan istek hacmini anomali olarak analiz eder. Bir parametreyi değiştirerek yapılan sorgularda eşiği aşan istemciler de anomali sayılır. Ayrıca dedektör, bot etkinliğini belirlemek için istemci sorgu kalıplarını normal davranışla karşılaştırır.
* **Eski tarayıcı** isteklerde kullanılan tarayıcı ve platformu analiz eder. İstemci güncel olmayan veya desteklenmeyen bir tarayıcı ya da platform kullanıyorsa, insan kullanıcıdan ziyade bot olma olasılığı yüksektir.
* **Geniş kapsam** IP etkinliğinin genişliğini analiz ederek davranışsal olarak tarayıcı benzeri botları belirler.
* **IP rotasyonu** saldırganların bir IP havuzu kullandığı [hesap ele geçirme](../attacks-vulns-list.md#account-takeover) saldırılarının parçası olan istekleri analiz eder.
* **Oturum rotasyonu** saldırganların bir oturum havuzu kullandığı [hesap ele geçirme](../attacks-vulns-list.md#account-takeover) saldırılarının parçası olan istekleri analiz eder.
* **Kalıcı ATO** uzun bir zaman dilimine yayılıp kademeli gerçekleşen [hesap ele geçirme](../attacks-vulns-list.md#account-takeover) saldırılarının parçası olan istekleri analiz eder.
* **Kimlik bilgisi doldurma** farklı kimlik bilgileriyle yinelenen oturum açma denemelerini, istek özniteliklerini sabit tutarak içeren [hesap ele geçirme](../attacks-vulns-list.md#account-takeover) saldırılarının parçası olan istekleri analiz eder ([kimlik bilgisi doldurma](../attacks-vulns-list.md#credential-stuffing)).
* **Düşük frekanslı kimlik bilgisi doldurma** tespit edilmekten kaçınmak için oturum veya istemci başına giriş denemelerini kasten sınırlayan, ardından API etkileşimi olmayan izole ya da minimal kimlik doğrulama denemeleriyle karakterize [hesap ele geçirme](../attacks-vulns-list.md#account-takeover) saldırılarının parçası olan istekleri analiz eder ([kimlik bilgisi doldurma](../attacks-vulns-list.md#credential-stuffing)).
* **Yanıt süresi anomalisi** otomatik kötüye kullanım veya arka uç sömürü girişimlerini işaret edebilecek API yanıt gecikmesindeki anormal kalıpları tanımlar (bir varyantı olarak [sınırsız kaynak tüketimi](../attacks-vulns-list.md#unrestricted-resource-consumption) saldırısı olarak işaretlenir).
* **Aşırı istek tüketimi** arka uç işlem kaynaklarının kötüye kullanımı/maksadını aşan kullanımını gösterebilecek şekilde API’ye anormal derecede büyük istek yükleri gönderen istemcileri tanımlar (bir varyantı olarak [sınırsız kaynak tüketimi](../attacks-vulns-list.md#unrestricted-resource-consumption) saldırısı olarak işaretlenir).
* **Aşırı yanıt tüketimi** yaşam döngüleri boyunca aktarılan toplam yanıt verisi hacmine göre şüpheli oturumları işaretler. Bireysel isteklere odaklanan dedektörlerden farklı olarak, bu dedektör yavaş damlatma veya dağıtık scraping saldırılarını belirlemek için [tüm bir oturum](../api-sessions/overview.md) boyunca yanıt boyutlarını toplar (bir varyantı olarak [sınırsız kaynak tüketimi](../attacks-vulns-list.md#unrestricted-resource-consumption) saldırısı olarak işaretlenir).

!!! info "Güven"
    Dedektörlerin çalışması sonucunda, her [tespit edilen](../api-abuse-prevention/exploring-bots.md) bot için bir **güven yüzdesi** oluşur: bunun bir bot olduğundan ne kadar emin olduğumuz. Her bot türünde dedektörlerin göreli önemi / oy sayısı farklıdır. Dolayısıyla güven yüzdesi, bu bot türündeki tüm olası oylardan (çalışan dedektörlerin sağladığı) alınan oyların oranıdır.

![API kötüye kullanım önleme istatistikleri](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-detectors.png)

Bir veya birden fazla dedektör [bot saldırı işaretlerine](#automated-threats-blocked-by-api-abuse-prevention) işaret ederse, modül anomali trafiğinin kaynağını 1 saatliğine deny listesine veya gri listeye ekler. Wallarm, son 30 gün içinde deny ve gri listeye alınan bot IP’lerini sayar ve bu miktarların bir önceki 30 günlük döneme kıyasla yüzde olarak ne kadar arttığını veya azaldığını gösterir.

Çözüm, kötü amaçlı bot eylemleri olarak atfetmeden ve kaynaklarını engellemeden önce trafik anomalilerini derinlemesine gözlemler. Metrik toplama ve analiz zaman aldığından, modül ilk kötü amaçlı istek geldiği anda kötü amaçlı botları gerçek zamanlı olarak engellemez, ancak ortalamada anormal etkinliği önemli ölçüde azaltır.

## Kurulum

**API Abuse Prevention** modülü ile kötü amaçlı bot tespiti ve azaltımına başlamak için bir veya daha fazla [API kötüye kullanım profili](../api-abuse-prevention/setup.md#creating-profiles) oluşturup yapılandırın.

API Abuse Prevention işlevselliğini daha hassas hale getirmek için, istekleri [oturumlar](../api-sessions/overview.md) halinde birleştirirken kimliği doğrulanmamış trafiğin daha iyi tanımlanması amacıyla [JA3 fingerprinting](../admin-en/enabling-ja3.md) özelliğini etkinleştirmeniz önerilir.