# API Abuse Prevention <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Abuse Prevention** modülü, API'larınıza yönelik kimlik bilgisi doldurma, sahte hesap oluşturma, içerik kazıma ve diğer kötü niyetli eylemler gibi API kötüye kullanımını gerçekleştiren botların tespiti ve azaltılmasını sağlar.

## API Abuse Prevention Tarafından Engellenen Otomatik Tehditler

**API Abuse Prevention** modülü, varsayılan olarak aşağıdaki bot tiplerini tespit eder:

* [Suspicious API activity](../attacks-vulns-list.md#suspicious-api-activity)
* [Account takeover](../attacks-vulns-list.md#account-takeover)
* [Security crawlers](../attacks-vulns-list.md#security-crawlers)
* [Scraping](../attacks-vulns-list.md#scraping)

[API abuse profile setup](../api-abuse-prevention/setup.md#creating-profiles) süreci sırasında, **API Abuse Prevention** modülünü tüm bot tiplerinden koruyacak veya korumayı yalnızca belirli tehditlerle sınırlayacak şekilde yapılandırabilirsiniz.

## API Abuse Prevention Nasıl Çalışır?

**API Abuse Prevention** modülü, ML tabanlı yöntemlerin yanı sıra istatistiksel ve matematiksel anomali arama yöntemlerini ve doğrudan kötüye kullanım vakalarını içeren kompleks bir bot tespit modeli kullanır. Modül, normal trafik profilini kendiliğinden öğrenir ve belirgin şekilde farklı davranışları anomali olarak tanımlar.

API Abuse Prevention, kötü niyetli botları [oturumları içinde](../api-sessions/overview.md#api-sessions-and-api-abuse-prevention) tespit etmek için birden fazla dedektör kullanır. Modül, hangi dedektörlerin devreye girdiğine dair istatistikler sağlar.

Aşağıdaki dedektörler devreye girebilir:

* **Bad user-agent**: İsteklere eklenen `User-Agent` başlıklarını analiz eder. Bu dedektör, tarayıcılar, kazıyıcılar ve güvenlik kontrol cihazlarına ait olanlar dahil belirli imzaları kontrol eder.
* **Authentication abuse**: Anormal davranışı tanımlamak için önceden belirlenen bir eşik değerine karşı kimlik doğrulama isteklerinin oranını ve belirli bir zaman dilimindeki istek sayısını analiz eder. Dedektör, yanlış pozitiflerin önüne geçmek için uygulamaya ait toplam kimlik doğrulama istek hacmini de dikkate alır.
* **Request uniqueness**: Bir oturum sırasında ziyaret edilen benzersiz uç noktaların sayısını analiz eder. Bir istemci sürekli olarak benzersiz uç noktaların düşük bir yüzdesini (örneğin %10 veya daha azını) ziyaret ediyorsa, bunun insan kullanıcısı yerine bir bot olma olasılığı yüksektir.
* **Suspicious behavior score**: Bir oturum sırasında gerçekleştirilen yaygın ve alışılmadık iş mantığı API isteklerini analiz eder.
* **Business logic score**: Uygulama davranışınız bağlamında kritik veya hassas API uç noktalarının kullanımını analiz eder.
* **Request rate**: Belirli bir zaman diliminde yapılan istek sayısını analiz eder. Bir API istemcisi sürekli olarak belirli bir eşik değerin üzerinde bir istek yüzdesi yapıyorsa, bunun insan kullanıcısı yerine bir bot olma olasılığı yüksektir.
* **Request interval**: Arka arkaya gelen istekler arasındaki zaman aralıklarını analiz ederek, bot davranışının işareti olan rastgele dağılım eksikliğini tespit eder.
* **Query abuse**: Tanımlı eşik değeri aşan istek hacmini anomali olarak analiz eder. Bir parametreyi değiştiren sorgular için eşik değeri aşan istemciler de anomali olarak kabul edilir. Ayrıca, dedektör bot etkinliğini tespit etmek için istemci sorgu kalıplarını normal davranışla karşılaştırır.
* **Outdated browser**: İsteklerde kullanılan tarayıcı ve platformu analiz eder. Bir istemci eski veya desteklenmeyen bir tarayıcı veya platform kullanıyorsa, bunun insan kullanıcısı yerine bir bot olma olasılığı yüksektir.
* **Wide scope**: IP aktivitesinin genişliğini analiz ederek tarayıcı benzeri botları davranışsal olarak tespit eder.
* **IP rotation**: Saldırganların bir IP havuzu kullandığı [account takeover](../attacks-vulns-list.md#account-takeover) saldırılarında istekleri analiz eder.
* **Session rotation**: Saldırganların bir oturum havuzunu kullandığı [account takeover](../attacks-vulns-list.md#account-takeover) saldırılarında istekleri analiz eder.
* **Persistent ATO**: Zamanla kademeli olarak gerçekleşen [account takeover](../attacks-vulns-list.md#account-takeover) saldırılarında istekleri analiz eder.

!!! info "Confidence"
    Dedektörlerin çalışması sonucunda, her [tespit edilen](../api-abuse-prevention/exploring-bots.md) bot **confidence percentage** (güven yüzdesi) elde eder: bunun bir bot olduğuna ne kadar emin olduğumuzu gösterir. Her bot tipinde, dedektörlerin göreceli önemi/oy sayısı farklıdır. Dolayısıyla, güven yüzdesi, bu bot tipinde çalışan dedektörler tarafından sağlanan tüm olası oyların alındığı oyların oranıdır.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-detectors.png)

Bir veya birden fazla dedektör [bot saldırısı belirtilerini](#automated-threats-blocked-by-api-abuse-prevention) işaret ederse, modül anormal trafiğin kaynağını 1 saat süreyle denylist veya graylist’e ekler. Wallarm, son 30 gün içinde deny ve gray list’e eklenen bot IP’lerini sayar ve bu miktarların önceki 30 günlük döneme göre yüzde kaç arttığını veya azaldığını görüntüler.

Çözüm, trafik anomalilerini kötü niyetli bot eylemleri olarak nitelendirmeden ve kaynaklarını engellemeden önce derinlemesine gözlemler. Metriğin toplanması ve analizi biraz zaman aldığından, modül ilk kötü niyetli istek ortaya çıktığında kötü niyetli botları gerçek zamanlı olarak engellemez, ancak ortalama olarak anormal aktiviteyi önemli ölçüde azaltır.

## Setup

**API Abuse Prevention** modülü ile kötü niyetli bot tespiti ve azaltımını başlatmak için bir veya daha fazla [API abuse profile](../api-abuse-prevention/setup.md#creating-profiles) oluşturun ve yapılandırın.

API Abuse Prevention işlevselliğini daha hassas hale getirmek için, isteklerin [oturumlara](../api-sessions/overview.md) birleştirilirken kimliği doğrulanmamış trafiğin daha iyi tanımlanabilmesi amacıyla [JA3 fingerprinting](../admin-en/enabling-ja3.md) etkinleştirilmesi önerilir.