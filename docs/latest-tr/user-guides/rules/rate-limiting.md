[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Rate Limiting

[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) durumu, [OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) en ciddi API güvenlik riskleri listesinde yer almaktadır. Rate limiting eksikliği, bu riskin ana sebeplerinden biridir. Uygun rate limiting önlemleri olmadan, API'ler hizmet reddi (DoS) saldırıları, brute force ve API aşırı kullanımı gibi saldırılara karşı savunmasızdır. Bu makale, Wallarm'un rate limit düzenleme kuralı ile API'nizi ve kullanıcılarınızı nasıl koruyacağınızı açıklamaktadır.

Wallarm, API'nize aşırı trafiği önlemek için **Set rate limit** [kuralını](../../user-guides/rules/rules.md) sunar. Bu kural, belirli bir kapsam için yapılabilecek maksimum bağlantı sayısını belirtmenize olanak tanır, ayrıca gelen isteklerin eşit şekilde dağıtılmasını sağlar. Tanımlanan limiti aşan bir istek, Wallarm tarafından reddedilir ve kuralda seçtiğiniz kod ile yanıtlanır.

Wallarm, çerezler veya JSON alanları gibi çeşitli istek parametrelerini inceler; bu sayede, yalnızca kaynak IP adresine değil, aynı zamanda oturum tanımlayıcıları, kullanıcı adları veya e-posta adreslerine bağlı olarak bağlantıları sınırlayabilirsiniz. Bu ek ayrıntı seviyesi, herhangi bir orijinal veri temelinde platformun genel güvenliğini artırmanıza olanak tanır.

Bu makalede açıklanan rate limiting, Wallarm tarafından sağlanan yük kontrol yöntemlerinden biridir - alternatif olarak, [brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md) uygulayabilirsiniz. Gelen trafiği yavaşlatmak için rate limiting, saldırganı tamamen engellemek için ise brute-force protection kullanın.

## Kuralların Oluşturulması ve Uygulanması

Rate limit belirlemek ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **Advanced rate limiting** seçeneğini seçin.
1. **If request is** alanında, kuralın uygulanacağı kapsamı [describe](rules.md#configuring) edin.
1. Kapsamınıza yapılacak bağlantılar için istenen bir limit belirleyin:

    * Saniyede veya dakikada yapılacak isteklerin maksimum sayısı.
    * **Burst** - belirli RPS/RPM aşıldığında, tamponlanacak aşırı isteklerin maksimum sayısının, oran normale döndüğünde işlenmesi. Varsayılan değer `0`.

        Değer `0`'dan farklı ise, tamponlanan aşırı isteklerin çalıştırılması sırasında tanımlı RPS/RPM'nin korunup korunmayacağını kontrol edebilirsiniz.
        
        **No delay** tüm tamponlanmış aşırı isteklerin, rate limit gecikmesi olmaksızın eşzamanlı olarak işlenmesini, **Delay** ise belirtilen sayıda aşırı isteğin eşzamanlı işlenmesini, diğerlerinin ise RPS/RPM'de belirlenen gecikme ile işlenmesini ifade eder.
    
    * **Response code** - reddedilen isteklere yanıt olarak döndürülecek kod. Varsayılan `503`.

        Aşağıda, 5 r/s limiti, burst değeri 12 ve delay değeri 8 olan rate limiting davranışı örneği verilmiştir.
        
        ![How rate limiting works](../../images/user-guides/rules/rate-limit-schema.png)

        İlk 8 istek (delay değeri), Wallarm düğümü tarafından gecikme olmaksızın aktarılır. Sonraki 4 istek (burst - delay) tanımlı 5 r/s oranının aşılmaması için geciktirilir. Bir sonraki 3 istek, toplam burst boyutu aşıldığı için reddedilir. Sonraki istekler gecikmeli olarak işlenir.

1. **In this part of request** bölümünde, limit belirlemek istediğiniz istek noktalarını belirtin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri sınırlayacaktır.

    Tüm mevcut noktalar [burada](request-processing.md) açıklanmıştır; örneğin, belirli kullanım senaryonuza uygun olanları seçebilirsiniz:
    
    * `remote_addr` orijin IP'si üzerinden bağlantıları sınırlamak için
    * `json` → `json_doc` → `hash` → `api_key` JSON gövde parametresi `api_key` kullanılarak bağlantıları sınırlamak için

    !!! info "Değer uzunluğu kısıtlamaları"
        Limit ölçümü yapılan parametre değerlerinin izin verilen maksimum uzunluğu 8000 semboldür.
1. [Kural derleme ve filtreleme düğümüne yükleme işleminin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Kural Örnekleri

<!-- ### Limiting IP connections to prevent DoS attacks on API endpoint

Diyelim ki kullanıcı listesini sayfa başına 200 kullanıcı ile döndüren bir UI bölümünüz var. Sayfayı getirmek için, UI şu URL'ye bir istek gönderir: `https://example-domain.com/api/users?page=1&size=200`.

Bununla birlikte, bir saldırgan `size` parametresini aşırı büyük bir değere (ör. 200.000) çevirerek veritabanını aşırı yükleyip performans sorunlarına yol açabilir. Bu, API'nin yanıt vermez hale gelmesi ve herhangi bir istemciden gelen ek istekleri işleyememesi durumuna yol açan DoS (Hizmet Reddi) saldırısı olarak bilinir.

Uç noktaya yapılan bağlantıları sınırlamak böyle saldırıları önlemeye yardımcı olur. Uç noktaya IP başına dakikada 1000 bağlantı limiti getirilebilir. Bu, ortalama olarak her dakika 5 kez talep edilen 200 kullanıcının varsayıldığı durumlar için geçerlidir. Kural, bu limitin dakikada uç noktaya erişmeye çalışan her IP için geçerli olduğunu belirtir. `remote_address` [noktası](request-processing.md) istekte bulunanın IP adresini tanımlamak için kullanılır.

![Example](../../images/user-guides/rules/rate-limit-for-200-users.png)
-->
### Limiting connections by IP to ensure high API availability

Diyelim ki, bir sağlık şirketinin REST API'si, doktorların `https://example-host.com` ana bilgisayarındaki `/patients` uç noktasına POST isteği aracılığıyla hasta bilgisi göndermesine olanak tanıyor. Bu uç noktanın erişilebilirliği kritik önem taşıdığından, aşırı isteklerle boğulmaması gerekmektedir.

Belirli bir süre zarfında `/patients` uç noktasına IP bazında bağlantıları sınırlamak bunu önleyebilir. Bu, uç noktanın tüm doktorlara stabil ve erişilebilir olmasını sağlarken, DoS saldırılarını önleyerek hasta bilgilerinin güvenliğini korur.

Örneğin, her IP adresi için dakikada 5 POST isteğine izin verecek şekilde bir limit belirlenebilir:

![Example](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### Limiting connections by sessions to prevent brute force attacks on auth parameters

Kullanıcı oturumlarına rate limiting uygulayarak, korunan kaynaklara yetkisiz erişim sağlamak amacıyla gerçek JWT'ler veya diğer kimlik doğrulama parametrelerini bulmaya yönelik brute force girişimlerini engelleyebilirsiniz. Örneğin, eğer bir oturum için dakikada yalnızca 10 isteğe izin verecek şekilde rate limit belirlenmişse, geçerli bir JWT keşfetmeye çalışan bir saldırgan, farklı token değerleriyle birçok istek göndererek hızla rate limit'e takılacak ve limit süresi dolana kadar istekleri reddedilecektir.

Diyelim ki uygulamanız, her kullanıcı oturumuna benzersiz bir ID atıyor ve bunu `X-SESSION-ID` başlığında yansıtıyor. `https://example.com/api/login` URL'sindeki API uç noktası, `Authorization` başlığında Bearer JWT içeren POST isteklerini kabul ediyor. Bu senaryo için, oturum bazında bağlantıları sınırlayan kural aşağıdaki gibi görünecektir:

![Example](../../images/user-guides/rules/rate-limit-for-jwt.png)

`Authorization` değeri için kullanılan [regexp](rules.md#condition-type-regex) ``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$`` şeklindedir.

Eğer kullanıcı oturumlarını yönetmek için JWT (JSON Web Tokens) kullanıyorsanız, JWT'yi [decrypt](request-processing.md#jwt) ederek yükünden oturum ID'sini çıkarmak için kuralı ayarlayabilirsiniz:

![Example](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

<!-- ### User-Agent based rate limiting to prevent attacks on API endpoints

Eski bir uygulama sürümüne sahip olduğunuz ve bu sürümde bilinen güvenlik açıkları bulunduğu için saldırganların, savunmasız uygulama sürümü üzerinden `https://example-domain.com/login` API uç noktasında brute force saldırısı gerçekleştirebildiğini varsayalım. Genellikle, `User-Agent` başlığı tarayıcı/uygulama sürümlerini iletmek için kullanılır. Eski uygulama sürümü üzerinden gelecek brute force saldırılarını önlemek için `User-Agent` bazlı rate limiting uygulayabilirsiniz.

Örneğin, her `User-Agent` için dakikada 10 istek limiti koyabilirsiniz. Eğer belirli bir `User-Agent` eşit olarak dakikada 10'dan fazla istek gönderiyorsa, o `User-Agent`'ten gelen istekler yeni bir dönem başına kadar reddedilir.

![Example](../../images/user-guides/rules/rate-limit-by-user-agent.png)

### Endpoint-based rate limiting to prevent DoS attacks

Rate limiting, belirli bir zaman dilimi içerisinde belirli bir uç noktaya yapılabilecek istek sayısının sınırlandırılmasını da içerebilir; örneğin dakikada 60 istek gibi. Bir istemci bu limiti aşarsa, sonraki istekler reddedilir.

Bu, DoS saldırılarının önlenmesine, uygulamanın meşru kullanıcılara karşı erişilebilir olmasına, sunucudaki yükün azaltılmasına, genel uygulama performansının iyileştirilmesine ve diğer kötüye kullanım durumlarının engellenmesine yardımcı olur.

Bu özel durumda, rate limiting kuralı URI bazında bağlantılara uygulanır; bu, Wallarm'un otomatik olarak tek bir uç noktaya yönelik tekrarlanan istekleri tanımlamasını sağlar. İşte `https://example.com` ana bilgisayarındaki tüm uç noktalar için bu kuralın nasıl çalışacağına dair bir örnek:

* Limit: Dakikada 60 istek (saniyede 1 istek)
* Burst: Ani trafik artışları durumunda dakikada 20 isteğe kadar izin verir
* No delay: Rate limit gecikmesi olmaksızın 20 aşırı isteğin eşzamanlı olarak işlenmesi
* Response code: Limit ve burst'i aşan istekler 503 kodu ile reddedilir
* Wallarm, URI [noktası](request-processing.md) ile tek bir uç noktaya yönelik tekrarlanan istekleri tanımlar

    !!! info "Sorgu parametreleri URI'ya dahil edilmez"
        Bu kural, belirtilen etki alanının herhangi bir yolu hedef alan, sorgu parametresi içermeyen istekleri sınırlar.

![Example](../../images/user-guides/rules/rate-limit-by-uri.png) -->

### Limiting connections by customer IDs to prevent server overwhelm

Diyelim ki, online alışveriş platformu için müşteri sipariş verilerine erişim sağlayan bir web servisi bulunmaktadır. Müşteri ID'sine göre rate limiting, müşterilerin kısa süre içerisinde çok fazla sipariş vermelerini önleyerek envanter yönetimi ve sipariş karşılama süreçlerine aşırı yük binmesini engelleyebilir.

Örneğin, `https://example-domain.com/orders` uç noktasına her müşteri için dakikada 10 POST isteği limitini getiren kural aşağıdaki gibi görünebilir. Bu örnekte, müşteri ID'sinin `data.customer_id` JSON gövde nesnesinde [geçirildiği](request-processing.md#json_doc) varsayılmaktadır.

![Example](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## Sınırlamalar ve Özellikler

Rate limit işlevselliğinin aşağıdaki sınırlamaları ve özellikleri bulunmaktadır:

* Rate limiting kuralı, [Wallarm deployment forms](../../installation/supported-deployment-options.md) **dışındaki** tüm dağıtım formları tarafından desteklenir:

    * Envoy tabanlı Docker imajı
    * OOB Wallarm dağıtımı
    * MuleSoft, Amazon CloudFront, Cloudflare, Broadcom Layer7 API Gateway, Fastly konektörleri
* Limit ölçümü yapılan parametre değerlerinin izin verilen maksimum uzunluğu 8000 semboldür.
* Birden fazla Wallarm düğümünüz varsa ve her düğümde gelen trafik rate limit kuralına uyuyorsa, her düğüm bağımsız olarak sınırlama yapar.
* Gelen isteklere birden fazla rate limit kuralı uygulanıyorsa, en düşük rate limit'e sahip kural istekleri sınırlamak için kullanılır.
* Gelen istekte **In this part of request** kural bölümünde belirtilen nokta yoksa, bu kural o istek için sınırlama olarak uygulanmaz.
* Web sunucunuz, bağlantıları sınırlayacak şekilde (örneğin, [`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) NGINX modülü kullanarak) yapılandırılmışsa ve siz de Wallarm kuralını uyguluyorsanız, web sunucusu yapılandırılmış kurallara göre istekleri reddeder ama Wallarm yapmaz.
* Wallarm, rate limit'i aşan istekleri kaydetmez; sadece kuralda seçilen kodu döndürerek reddeder. İstisna olarak, [attack signs](../../about-wallarm/protecting-against-attacks.md) bulunan istekler, rate limiting kuralı tarafından reddedilmiş olsalar bile Wallarm tarafından kaydedilir.