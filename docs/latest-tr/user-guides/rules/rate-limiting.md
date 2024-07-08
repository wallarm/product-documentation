# Oran limiti ayarlama

Oran limitinin eksikliği, en ciddi API güvenlik risklerinin listesi olan [OWASP API Top 10 2019](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md)'da yer almaktadır. Doğru bir şekilde oran sınırlama önlemleri olmadan, API'ler hizmet dışı bırakma (DoS), kaba kuvvet ve API aşırı kullanım gibi saldırılara karşı savunmasızdır. Bu makale, Wallarm'ın oran limiti düzenleme kuralıyla API'nizi ve kullanıcılarınızı nasıl koruyacağınızı açıklamaktadır.

Wallarm, API'nize fazla trafik gelmesini önlemek için **Oran limiti belirle** kuralını sağlar. Bu kural, belirli bir kapsama yapılabilecek maksimum bağlantı sayısını belirtmenizi sağlar ayrıca gelen isteklerin eşit olarak dağıtılmasını sağlar. Bir istek, belirlenen limiti aşarsa, Wallarm bunu reddeder ve kuralda seçtiğiniz kodu döndürür.

Wallarm, çerezler veya JSON alanları gibi çeşitli istek parametrelerini inceler, bu da bağlantıları yalnızca kaynak IP adresine dayalı olarak değil, ayrıca oturum tanımlayıcıları, kullanıcı adları veya e-posta adresleri üzerinden sınırlamanıza olanak sağlar. Bu ek detay seviyesi, herhangi bir kaynak veriye dayalı olarak bir platformun genel güvenliğini güçlendirmenizi sağlar. 

## Kuralı oluşturma ve uygulama

Oran limitini ayarlamak ve uygulamak için:

1. Wallarm Konsolu'na gidin → **Kurallar** → **Kural ekle**.
1. **Eğer istek şu ise**, [tanımlayın](rules.md#branch-description) kuralın uygulanacağı kapsamı.
1. **Sonra**, **Oran limiti belirle**'yi seçin ve kapsamınıza olan bağlantılar için istediğiniz limiti ayarlayın:

    * Saniye başına veya dakika başına taleplerin maksimum sayısı.
    * **Patlama** - Belirtilen RPS/RPM aşıldığında tamponlanacak aşırı isteklerin maksimum sayısı ve oran normalle döndüğünde işlem yapılacak. Varsayılan olarak `0`.

        Değer `0`'dan farklıysa, tamponlanmış aşırı isteklerin yürütülmesi arasındaki belirlenen RPS/RPM'yi sürdürüp sürdürmeyeceğinizi kontrol edebilirsiniz.

        **Gecikme Yok** tüm tamponlanmış aşırı isteklerin eşzamanlı işlem görmesi anlamına gelir, oran limiti gecikmesi olmadan. **Gecikme** belirtilen sayıdaki aşırı isteklerin eşzamanlı işlem görmesi anlamına gelir, diğerleri RPS/RPM'de ayarlanan gecikmeyle işlem görür.

    * **Yanıt kodu** - Reddedilen isteklere yanıt olarak döndürülen kod. Varsayılan olarak `503`.
1. **Bu istek bölümünde**, sınırlar koymak istediğiniz istek noktalarını belirleyin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri kısıtlayacaktır.

    Tüm mevcut noktalar [burada](request-processing.md) tarif edilmiştir, belirli bir kullanım durumunuza uyanları seçebilirsiniz, örneğin:
    
    * Kaynak IP'ye bağlantıları sınırlamak için `remote_addr`
    * `api_key` JSON gövde parametresiyle bağlantıları sınırlamak için `json` → `json_doc` → `hash` → `api_key`

    !!! info "Değer uzunluğu üzerindeki kısıtlamalar"
        Sınırları ölçmek için kullandığınız parametre değerlerinin en fazla uzunluğu 8000 semboldür.
1. [Kural derlemesinin tamamlanmasını](rules.md) bekleyin.

## Kural örnekleri

<!-- ### API endpoint üzerindeki DoS saldırılarını önlemek için IP bağlantılarını sınırlamak

Kullanıcıların bir listesini döndüren bir UI bölümünüz olduğunu varsayalım, sayfa başına 200 kullanıcı sınırlaması ile. Sayfayı almak için UI, aşağıdaki URL'yi kullanarak sunucuya bir istekte bulunur: `https://example-domain.com/api/users?page=1&size=200`.

Bununla birlikte, bir saldırgan bunu `size` parametresini aşırı büyük bir sayıya (ör. 200,000) değiştirerek sömürebilir, bu da veritabanının yükünü artırabilir ve performans sorunlarına neden olabilir. Bu, API'nin yanıt veremeyecek hale geldiği ve herhangi bir istemciden daha fazla istekte bulunamadığı bir DoS (Hizmet Dışı Bırakma) saldırısı olarak bilinir.

Endpoint'e olan bağlantıları sınırlamak, bu tür saldırıları önlemeye yardımcı olur. Endpoint'e dakikada 1000 bağlantıya kadar olan bağlantıları sınırlayabilirsiniz. Bu, her bir IP'nin dakikada endpoint'e erişmeye çalışan her bir IP'ye uygulandığı anlamına gelir. `remote_address` [noktası](request-processing.md), isteği yapanın IP adresini belirlemek için kullanılır.

![Örnek](../../images/user-guides/rules/rate-limit-for-200-users.png) -->

### Yüksek API kullanılabilirliğini sağlamak için IP tarafından bağlantıları sınırlamak

Bir sağlık hizmetleri şirketinin, doktorların hastaların bilgilerini `https://example-host.com` hostunun `/patients` uç noktasına bir POST isteği ile göndermesine olanak sağladığını varsayalım. Bu uç nokta, önemli kişisel sağlık bilgilerini içerir ve büyük miktarda istekle kötüye kullanılmaması veya aşırı yüklenmemesini sağlamak önemlidir.

Belirli bir süre içinde IP tarafından `/patients` uç noktası için bağlantıları sınırlamak, bunu önleyebilir. Bu, uç noktanın tüm doktorlara karşı istikrarını ve kullanılabilirliğini sağlar, aynı zamanda DoS saldırılarını önleyerek hasta bilgilerinin güvenliğini korur.

Örneğin, her bir IP adresi için dakika başına 5 POST isteği sınırlaması şu şekilde belirlenebilir:

![Örnek](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### Kimlik doğrulama parametrelerindeki kaba kuvvet saldırılarını önlemek için oturumları sınırlama

Kullanıcı oturumlarına oran sınırlaması uygulayarak, gerçek JWT'leri veya diğer kimlik doğrulama parametrelerini bulmak için kaba kuvvet girişimlerini sınırlayabilirsiniz. Örneğin, bir oturum altında dakikada yalnızca 10 isteğe izin veren bir oran sınırı belirlenirse, farklı token değerleriyle birden fazla istekte bulunarak geçerli bir JWT bulmaya çalışan bir saldırgan hızlı bir şekilde oran limitine ulaşır ve istekleri, oran limit süresi dolana kadar reddedilir.

Uygulamanızın her kullanıcı oturumuna benzersiz bir ID atadığını ve bunu `X-SESSION-ID` başlığında yansıttığını varsayalım. `https://example.com/api/login` URL'sindeki API uç noktası, `Authorization` başlığındaki Bearer JWT'yi içeren POST isteklerini kabul eder. Bu senaryo için, oturumları sınırlayan kural aşağıdaki gibi görünür:

![Örnek](../../images/user-guides/rules/rate-limit-for-jwt.png)

`Authorization` değeri için kullanılan [regex](rules.md#condition-type-regex) ''^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$''dir.

Kullanıcı oturumlarını yönetmek için JWT (JSON Web Tokens) kullanıyorsanız, kuralı JWT'yi [deşifre etmek](request-processing.md#jwt) ve yükünden oturum ID'sini çıkarmak için ayarlayabilirsiniz:

![Örnek](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

### API uç noktalarındaki saldırıları önlemek için User-Agent tabanlı oran sınırlaması

Eski bir uygulama sürümünüzün, saldırganların `https://example-domain.com/login` API endpointini kırılgan uygulama sürümünü kullanarak kaba kuvvet saldırısına uğratmasına olanak sağlayan bazı bilinen güvenlik açıklarını olduğunu varsayalım. Genellikle, `User-Agent` başlığı tarayıcı/uygulama sürümlerini geçmek için kullanılır. Eski uygulama sürümü üzerinden kaba kuvvet saldırısını önlemek için, `User-Agent` tabanlı oran sınırlaması uygulayabilirsiniz.

Örneğin, her bir `User-Agent` için dakikada 10 istek sınırlamasını ayarlayabilirsiniz. Spesifik bir `User-Agent`, dakikada 10'dan fazla istek yaparsa, yeni bir süre başlayana kadar o `User-Agent`'i rededilir.

![Örnek](../../images/user-guides/rules/rate-limit-by-user-agent.png)

<!-- ### DoS saldırılarını önlemek için endpoint tabanlı oran sınırlaması

Oran sınırlaması ayrıca belirli bir süre zarfında belirli bir endpointe yapılabilecek isteklerin sayısı için bir eşik belirlemeyi de içerebilir, örneğin dakikada 60 istek. Bir istemci bu limiti aşırsa, ilave istekler reddedilir.

Bu, DoS saldırılarını önlemeyi ve uygulamanın meşru kullanıcılar için kullanılabilir kalmasını sağlar. Ayrıca, sunucuda yükü azaltabilir, genel uygulama performansını iyileştirebilir ve uygulamanın suistimal veya kötüye kullanılmasını önleyebilir.

Bu belirli durumda, oran sınırlama kuralı, URI tarafından bağlantılara uygulanır, bu da Wallarm'ın otomatik olarak tek bir endpointe yönelen tekrarlanan istekleri tanımasını sağlar. İşte bu kuralın `https://example.com` hostunun bütün endpointlere nasıl çalışacağına dair bir örnek:

* Limit: Dakikada 60 istek (saniye başına 1 istek)
* Patlama: dakikada en fazla 20 isteğe izin ver (bu, trafikte ani bir artış olursa yararlı olabilir)
* Gecikme Yok: 20 fazla isteği eşzamanlı olarak süreci, istekler arasında oran sınırlaması gecikmesi olmaksızın.
* Yanıt kodu: limiti ve patlamayı aşan istekleri 503 kodu ile reddet
* Wallarm, bir tek endpointe hedeflenen tekrarlanan istekleri `uri` [noktası](request-processing.md) ile belirler.

    !!! info "URI'ye sorgu parametreleri dahil edilmez"
        Bu kural, belirtilen alanın herhangi bir yoluna yönelen istekleri sınırlar, herhangi bir sorgu parametresi içermez.

![Örnek](../../images/user-guides/rules/rate-limit-by-uri.png) -->

### Sunucunun ezilmesini önlemek için müşteri kimlikleriyle bağlantıları sınırlama

Bir çevrimiçi alışveriş platformu için müşteri siparişlerine erişimi olan bir web hizmeti olduğunu düşünelim. Müşteri Kimliği tarafından yapılan oran sınırlaması, müşterilerin kısa bir süre içinde çok sayıda sipariş vermesini önleyebilir, bu stok yönetimine ve sipariş hazırlama süreçlerine yük getirebilir.

Örneğin, her müşteriyi dakikada 10 POST isteği ile `https://example-domain.com/orders`a sınırlayan bir kural aşağıdaki gibi görünebilir. Bu örnekte, bir müşteri Kimliği'nin `data.customer_id` JSON gövde nesnesinde [geçtiği](request-processing.md#json_doc) kabul edilir.

![Örnek](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## Kısıtlamalar ve özellikler

Oran limiti işlevi aşağıdaki kısıtlamalar ve özelliklere sahiptir:

* Oran limiti kuralı, Envoy tabanlı Docker imajı dışındaki tüm [Wallarm dağıtım şekillerinde](../../installation/supported-deployment-options.md) desteklenmektedir.
* Sınırları ölçmek için kullandığınız parametre değerlerinin maksimum uzunluğu 8000 semboldür.
* Eğer birden fazla Wallarm düğümüne sahipseniz ve her düğümde gelen trafik oran sınırlamasını karşılarsa, bunlar bağımsız olarak sınırlanır.
* Birden fazla oran sınırlaması kuralı gelen isteklere uygulanırsa, en düşük oran sınırlaması olan kural istekleri sınırlamak için kullanılır.
* Gelen bir istekte **Bu istek bölümünde** kural bölümünde belirtilen nokta yoksa, bu kural bir sınırlama olarak uygulanmaz.
* Web sunucunuz bağlantıları sınırlamak için yapılandırılmışsa (ör. NGINX modülü olan [`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)'yi kullanarak) ve Wallarm kuralını da uygularsanız, web sunucu istekleri yapılandırılmış kurallara göre reddeder ancak Wallarm reddetmez.
* Wallarm oran sınırını aşan requestleri kaydetmez, yalnızca onları kuralda seçilen kodu döndürerek reddeder. İstisna, [saldırı belirtileri](../../about-wallarm/protecting-against-attacks.md) bulunan isteklerdir - bu istekler, oran sınırlaması kuralı tarafından reddedilseler bile Wallarm tarafından kaydedilir.