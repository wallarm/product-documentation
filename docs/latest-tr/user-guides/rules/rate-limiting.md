[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Hız Sınırlama

[Unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), en ciddi API güvenlik risklerinin listelendiği [OWASP API Top 10 2023](../../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesinde yer almaktadır. Hız sınırlamanın olmaması, bu riskin başlıca nedenlerinden biridir. Uygun hız sınırlama önlemleri olmadan, API’ler hizmet engelleme (DoS), kaba kuvvet (brute force) ve API’nin aşırı kullanımına yönelik saldırılara karşı savunmasızdır. Bu makale, Wallarm’ın hız sınırlama düzenleme kuralı ile API’nizi ve kullanıcılarınızı nasıl koruyacağınızı açıklar.

Wallarm, API’nize aşırı trafiği önlemeye yardımcı olmak için **Advanced rate limiting** [kuralını](../../user-guides/rules/rules.md) sağlar. Bu kural, belirli bir kapsama yapılabilecek maksimum bağlantı sayısını belirtmenizi ve gelen isteklerin eşit şekilde dağıtılmasını sağlar. Bir istek tanımlanan limiti aşarsa, Wallarm isteği reddeder ve kuralda seçtiğiniz kodu döndürür.

Wallarm, çerezler veya JSON alanları gibi çeşitli istek parametrelerini inceler; bu sayede bağlantıları yalnızca kaynak IP adresine göre değil, aynı zamanda oturum tanımlayıcıları, kullanıcı adları veya e-posta adreslerine göre de sınırlayabilirsiniz. Bu ek ayrıntı düzeyi, herhangi bir kaynak verisine dayanarak platformun genel güvenliğini artırmanızı sağlar.

Bu makalede açıklanan hız sınırlamanın Wallarm tarafından sağlanan yük kontrolü yöntemlerinden sadece biri olduğunu unutmayın - alternatif olarak [brute force korumasını](../../admin-en/configuration-guides/protecting-against-bruteforce.md) uygulayabilirsiniz. Gelen trafiği yavaşlatmak için hız sınırlamayı, saldırganı tamamen engellemek için ise brute force korumasını kullanın.

## Kuralı oluşturma ve uygulama

Hız limitini ayarlamak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **Advanced rate limiting** seçin.
1. **If request is** içinde, kuralın uygulanacağı kapsamı [tanımlayın](rules.md#configuring).
1. Kapsamınıza yapılacak bağlantılar için istenen limiti belirleyin:

    * Saniye başına veya dakika başına istekler için maksimum sayı.
    * **Burst** - belirtilen RPS/RPM aşıldığında arabelleğe alınacak aşırı isteklerin maksimum sayısı ve oran normale döndüğünde işlenecek olanlar. Varsayılan olarak `0`.

        Değer `0`’dan farklıysa, arabelleğe alınmış aşırı isteklerin yürütülmesi sırasında tanımlanan RPS/RPM’in korunup korunmayacağını kontrol edebilirsiniz.
        
        **No delay**, tüm arabelleğe alınmış aşırı isteklerin, hız limiti gecikmesi olmaksızın eşzamanlı olarak işlenmesini ifade eder. **Delay**, belirtilen sayıda aşırı isteğin eşzamanlı işlenmesini, diğerlerinin ise RPS/RPM’de ayarlanan gecikme ile işlenmesini ifade eder.
    
    * **Response code** - reddedilen isteklere yanıt olarak döndürülecek kod. Varsayılan `503`.

        Aşağıda limitin 5 r/s, burst 12 ve delay 8 olduğu hız sınırlama davranışı örneği yer almaktadır.
        
        ![Hız sınırlamanın çalışma şekli](../../images/user-guides/rules/rate-limit-schema.png)

        İlk 8 istek (Delay değerinin) Wallarm düğümü tarafından gecikme olmadan iletilir. Sonraki 4 istek (burst - delay), tanımlı 5 r/s oranı aşılmayacak şekilde geciktirilir. Sonraki 3 istek, toplam burst boyutu aşıldığı için reddedilir. Takip eden istekler geciktirilir.

1. **In this part of request** içinde, limit uygulamak istediğiniz istek noktalarını belirtin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri kısıtlayacaktır.

    Tüm mevcut noktalar [burada](request-processing.md) açıklanmıştır, belirli kullanım senaryonuza uyanları seçebilirsiniz, örn.:
    
    * `remote_addr` ile bağlantıları kaynak IP’ye göre sınırlamak
    * `api_key` JSON gövde parametresine göre bağlantıları sınırlamak için `json` → `json_doc` → `hash` → `api_key`

    !!! info "Değer uzunluğuna ilişkin kısıtlamalar"
        Limitleri ölçtüğünüz parametre değerlerinin izin verilen azami uzunluğu 8000 karakterdir.
1. [Kuralın derlenmesinin ve filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Kural örnekleri

<!-- ### Limiting IP connections to prevent DoS attacks on API endpoint

Suppose you have a section in the UI that returns a list of users, with a limit of 200 users per page. To fetch the page, the UI sends a request to the server using the following URL: `https://example-domain.com/api/users?page=1&size=200`.

However, an attacker could exploit this by changing the `size` parameter to an excessively large number (e.g. 200,000), which could overload the database and cause performance issues. This is known as a DoS (Denial of Service) attack, where the API becomes unresponsive and unable to handle further requests from any clients.

Limiting connections to the endpoint helps to prevent such attacks. You can limit the number of connections to the endpoint to 1000 per minute. This assumes that, on average, 200 users are requested 5 times per minute. The rule specifies that this limit applies to each IP trying to access the endpoint within minute. The `remote_address` [point](request-processing.md) is used to identify the IP address of the requester.

![Example](../../images/user-guides/rules/rate-limit-for-200-users.png)
-->
### API yüksek erişilebilirliğini sağlamak için IP’ye göre bağlantıları sınırlama

Bir sağlık şirketinin, doktorların `https://example-host.com` ana makinesinin `/patients` uç noktasına POST isteği ile hasta bilgilerini göndermesine izin veren bir REST API’si olduğunu varsayalım. Bu uç noktanın erişilebilirliği kritik önemdedir, dolayısıyla çok sayıda istekle boğulmamalıdır.

Özellikle `/patients` uç noktası için belirli bir zaman dilimi içinde IP’ye göre bağlantıları sınırlamak bunu önleyebilir. Bu, uç noktanın tüm doktorlar için stabilitesini ve erişilebilirliğini sağlar, ayrıca DoS saldırılarını engelleyerek hasta bilgilerinin güvenliğini korur.

Örneğin, her IP adresi için dakikada 5 POST isteği olarak aşağıdaki gibi bir limit belirlenebilir:

![Örnek](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### Kimlik doğrulama parametrelerine yönelik kaba kuvvet (brute force) saldırılarını önlemek için oturuma göre bağlantıları sınırlama

Kullanıcı oturumlarına hız sınırlama uygulayarak, korunan kaynaklara yetkisiz erişim sağlamak için gerçek JWT’leri veya diğer kimlik doğrulama parametrelerini bulmaya yönelik brute force girişimlerini kısıtlayabilirsiniz. Örneğin, hız limiti bir oturum altında dakikada yalnızca 10 isteğe izin verecek şekilde ayarlanırsa, farklı jeton değerleriyle çoklu istekler yaparak geçerli bir JWT bulmaya çalışan bir saldırgan hız limitine hızla takılır ve hız limiti süresi dolana kadar istekleri reddedilir.

Uygulamanızın her kullanıcı oturumuna benzersiz bir kimlik atadığını ve bunu `X-SESSION-ID` başlığında yansıttığını varsayalım. `https://example.com/api/login` URL’sindeki API uç noktası, `Authorization` başlığında Bearer JWT içeren POST isteklerini kabul eder. Bu senaryoda, oturuma göre bağlantıları sınırlayan kural aşağıdaki gibi görünecektir:

![Örnek](../../images/user-guides/rules/rate-limit-for-jwt.png)

`Authorization` değeri için kullanılan [düzenli ifade](rules.md#condition-type-regex) ``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$` şeklindedir.

Kullanıcı oturumlarını yönetmek için JWT (JSON Web Tokens) kullanıyorsanız, oturum kimliğini yükünden çıkarmak için JWT’nin [şifresini çözmek](request-processing.md#jwt) üzere kuralı aşağıdaki gibi ayarlayabilirsiniz:

![Örnek](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

<!-- ### User-Agent based rate limiting to prevent attacks on API endpoints

Let's say you have an old version of your application has some known security vulnerabilities allowing attackers to brute force API endpoint `https://example-domain.com/login` using the vulnerable application version. Usually, the `User-Agent` header is used to pass browser/application versions. To prevent the brute force attack via the old application version, you can implement `User-Agent` based rate limiting.

For example, you can set a limit of 10 requests per minute for each `User-Agent`. If a specific `User-Agent` is making more than 10 requests evenly distributed per minute, further requests from that `User-Agent` are rejected till a new period start.

![Example](../../images/user-guides/rules/rate-limit-by-user-agent.png)

### Endpoint-based rate limiting to prevent DoS attacks

Rate limiting can also involve setting a threshold for the number of requests that can be made to a particular endpoint within a specified time frame, such as 60 requests per minute. If a client exceeds this limit, further requests are rejected.

It helps to prevent DoS attacks and ensure that the application remains available to legitimate users. It can also help to reduce the load on the server, improve overall application performance, and prevent other forms of abuse or misuse of the application.

In this specific case, the rate limiting rule is applied to connections by URI, meaning that Wallarm automatically identifies repeated requests targeting a single endpoint. Here's an example of how this rule would work for all endpoints of the `https://example.com` host:

* Limit: 60 requests per minute (1 request per second)
* Burst: allow up to 20 requests per minute (which could be useful if there is a sudden spike in traffic)
* No delay: process 20 excessive requests simultaneously, without the rate limit delay between requests
* Response code: reject requests exceeding the limit and the burst with the 503 code
* Wallarm identifies repeated requests targeted at a single endpoint by the `uri` [point](request-processing.md)

    !!! info "Query parameters are not included into URI"
        This rule limits requests targeted at any path of the specified domain which does not contain any query parameters.

![Example](../../images/user-guides/rules/rate-limit-by-uri.png) -->

### Sunucunun aşırı yüklenmesini önlemek için müşteri kimliklerine göre bağlantıları sınırlama

Bir web servisinin, bir e-ticaret platformu için müşteri sipariş verilerine erişim sağladığını düşünelim. Müşteri kimliğine göre hız sınırlaması, müşterilerin kısa sürede çok fazla sipariş vermesini önlemeye yardımcı olabilir; bu da stok yönetimi ve sipariş karşılama üzerinde baskı oluşturabilir.

Örneğin, her müşteri için `https://example-domain.com/orders` adresine dakikada 10 POST isteği ile sınırlayan kural aşağıdaki gibi görünebilir. Bu örnekte, müşteri kimliğinin `data.customer_id` JSON gövde nesnesinde [iletildiği](request-processing.md#json_doc) varsayılmaktadır.

![Örnek](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## Sınırlamalar ve özellikler

Hız sınırlama işlevinin aşağıdaki sınırlamaları ve özellikleri vardır:

* Hız sınırlama kuralı, aşağıdakiler **hariç** olmak üzere tüm [Security Edge](../../installation/security-edge/overview.md) ve [kendi barındırılan](../../installation/supported-deployment-options.md) dağıtım biçimleri tarafından desteklenir:

    * OOB Wallarm dağıtımı
    * MuleSoft, Amazon CloudFront, Cloudflare, Broadcom Layer7 API Gateway, Fastly bağlayıcıları
* Limitleri ölçtüğünüz parametre değerlerinin izin verilen azami uzunluğu 8000 karakterdir.
* Birden fazla Wallarm düğümünüz varsa ve her düğüme gelen trafik hız sınırlama kuralını sağlıyorsa, bunlar birbirinden bağımsız olarak sınırlandırılır.
* Gelen isteklere birden fazla hız sınırlama kuralı uygulanıyorsa, istekleri sınırlamak için en düşük hız limitine sahip kural kullanılır.
* Gelen bir istek, kuralın **In this part of request** bölümünde belirtilen noktayı içermiyorsa, bu kural o istek için bir sınırlama olarak uygulanmaz.
* Web sunucunuz bağlantıları sınırlayacak şekilde yapılandırılmışsa (ör. [`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) NGINX modülünü kullanarak) ve ayrıca Wallarm kuralını da uygularsanız, web sunucusu yapılandırılmış kurallara göre istekleri reddeder ancak Wallarm reddetmez.
* Wallarm, hız limitini aşan istekleri kaydetmez; yalnızca kuralda seçilen kodu döndürerek bunları reddeder. İstisna, [saldırı işaretleri](../../about-wallarm/protecting-against-attacks.md) taşıyan isteklere yöneliktir - bunlar, hız sınırlama kuralı tarafından reddedilmiş olsalar bile Wallarm tarafından kaydedilir.

## Rate abuse protection ile farkı

Kaynak kullanımını kısıtlamak ve çok sayıda istek kullanılarak gerçekleştirilen saldırıları önlemek için, burada açıklanan hız sınırlamanın yanı sıra Wallarm [rate abuse protection](../../api-protection/dos-protection.md) sağlar.

Hız sınırlama, oran çok yüksek olduğunda bazı istekleri geciktirir (arabelleğe alır) ve arabellek dolduğunda kalanları reddeder; oran normale döndüğünde arabelleğe alınan istekler teslim edilir, IP veya oturuma göre bir engelleme uygulanmaz; **oysa** rate abuse protection saldırganları bir süreliğine IP’lerine veya oturumlarına göre engeller.