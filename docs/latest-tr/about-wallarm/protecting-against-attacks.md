# Saldırıları Algılama

Wallarm platformu, uygulama trafiğini sürekli olarak analiz eder ve kötü niyetli talepleri gerçek zamanlı olarak hafifletir. Bu makaleden, Wallarm'ın saldırılardan koruduğu kaynak türlerini, trafikte saldırıları tespit etme yöntemlerini ve tespit edilen tehditleri nasıl izleyebileceğinizi ve yönetebileceğinizi öğreneceksiniz.

## Saldırı nedir ve saldırı bileşenleri nelerdir?

<a name="attack"></a>**Saldırı**, aşağıdaki özelliklerle gruplandırılan tek bir hit veya birden fazla hit'tir:

* Aynı saldırı türü, kötü niyetli yük ile parametre ve hit'lerin gönderildiği adres. Hit'ler aynı veya farklı IP adreslerinden gelebilir ve bir saldırı türü içinde kötü niyetli yüklerin farklı değerlerine sahip olabilir.

    Bu hit gruplama yöntemi temeldir ve tüm hit'lere uygulanır.
* Etkinse aynı kaynak IP adresi, uygun [tetikleyici](../user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack). Diğer hit parametre değerleri farklı olabilir.

    Bu hit gruplama yöntemi, Brüt güç, Zorla göz atma, BOLA (IDOR), Kaynak aşımı, Veri bombası ve Sanal yama saldırı türlerinin hariç olması koşuluyla tüm hit'ler için çalışır.

    Hit'ler bu yöntemle gruplandırıldığında, [**Yanıltıcı pozitif olarak işaretle**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) düğmesi ve [aktif doğrulama](detecting-vulnerabilities.md#active-threat-verification) seçeneği saldırı için kullanılamaz.

Belirtilen hit gruplama yöntemleri birbirini dışlamaz. Hit'ler her iki yöntemin özelliklerine sahipse, hepsi tek bir saldırıya gruplanır.

<a name="hit"></a>**Hit**, Wallarm düğümü tarafından eklenen orijinal kötü niyetli istek ve metaveri olan seri hale getirilmiş kötü niyetli bir istektir. Wallarm, bir istekte farklı türlerde birkaç kötü niyetli yük algılarsa, her birinde bir tür yükle birkaç hit kaydeder.

<a name="malicious-payload"></a>**Kötü niyetli yük**, aşağıdaki öğeleri içeren bir orijinal isteğin bir parçasıdır:

* Bir istekte tespit edilen saldırı belirtileri. Eğer bir istekte aynı saldırı tipini karakterize eden birkaç saldırı belirtisi tespit edilirse, yüke yalnızca ilk belirti kaydedilir.
* Saldırı belirtisinin bağlamı. Bağlam, tespit edilen saldırı belirtilerini önceden ve sonrayı kapatmak için bir dizi semboldür. Bir yük uzunluğu sınırlı olduğundan, bağlam, bir saldırı belirtisi yük tam uzunluğunda olduğunda atlanabilir.

    Saldırı işaretleri [davranışsal saldırıları](#behavioral-attacks) tespit etmek için kullanılmadığından, davranışsal saldırıların bir parçası olarak gönderilen isteklerin boş yükleri vardır.

## Saldırı türleri

Wallarm çözümü, OWASP API Top 10 tehditlerinden, API suiistimalinden ve diğer otomatik tehditlerden API'leri, mikro hizmetleri ve web uygulamalarını korur.

Teknik olarak, Wallarm tarafından tespit edilebilen [tüm saldırılar](../attacks-vulns-list.md) gruplara ayrılır:

* Giriş doğrulama saldırıları
* Davranışsal saldırılar

Saldırı tespit yöntemi saldırı grubuna bağlıdır. Davranışsal saldırıları tespit etmek için ek Wallarm düğümü yapılandırması gereklidir.

### Giriş doğrulama saldırıları

Giriş doğrulama saldırıları, SQL enjeksiyonu, çapraz site yazılımı, uzaktan kod yürütme, Yol Gezintisi ve diğer saldırı türlerini içerir. Her saldırı tipi, isteklerde gönderilen belirli simgelerin kombinasyonları tarafından karakterize edilir. Giriş doğrulama saldırılarını tespit etmek için, isteklerin sözdizimi çözümlemesi yapmak gerekir - belirli sembol kombinasyonlarını tespit etmek için onları ayrıştırın.

Wallarm, JPEG, PNG, GIF, PDF, vb. SVG, dahil olmak üzere herhangi bir talep parçasındaki giriş doğrulama saldırılarını yukarıda listelenen [araçlarla](#tools-for-attack-detection) tespit eder.

Giriş doğrulama saldırılarının tespiti varsayılan olarak tüm müşteriler için etkindir.

### Davranışsal saldırılar

Davranışsal saldırılar aşağıdaki saldırı sınıflarını içerir:

* Kaba kuvvet saldırıları: şifreler ve oturum tanımlayıcılarına kaba kuvvet, zorla dosya ve dizinlere göz atma, kimlik bilgileri. Davranışsal saldırılar, belirli bir URL'ye gönderilen farklı zorlanmış parametre değerlerinin büyük sayısı ile karakterize edilebilir.

    Örneğin, bir saldırganın şifreyi zorlaması durumunda, kullanıcı kimlik doğrulama URL'sine farklı `şifre` değerlerine sahip birçok benzer istek gönderilebilir:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```

* Aynı adlı güvenlik açığını istismar eden BOLA (IDOR) saldırıları. Bu güvenlik açığı, bir saldırganın bir API isteği aracılığıyla bir nesneye erişmesine ve yetkilendirme mekanizmasını atlayarak veri almasına veya değiştirmesine izin verir.

    Örneğin, bir saldırganın gerçek bir tanımlayıcıyı bulmak ve karşılık gelen mağaza finansal verilerini almak için dükkan tanımlayıcılarını zorlaması durumunda:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    Bu tür API istekleri için yetkilendirme gerekmese, bir saldırgan gerçek finansal verileri alabilir ve kendi amaçları için kullanabilir.

#### Davranışsal saldırı tespiti

Davranışsal saldırıları tespit etmek için, isteklerin sözdizimi analizini yapmalı ve istek sayısı ve istekler arasındaki zamanın korelasyon analizini yapmalıyız.

Kullanıcı kimlik doğrulamasına veya kaynak dosya dizinine veya belirli bir nesne URL'sine gönderilen istek sayısı eşiğinin aşıldığında korelasyon analizi yapılır. İsteğin sayısının eşiğini, meşru bir isteğin engellenmesini azaltmak için (örneğin, kullanıcının hesabına birkaç kez yanlış parola girilirse) ayarlamalısınız.

* Korelasyon analizi, Wallarm postanalitik modülü tarafından yürütülür.
* Alınan istek sayısı ve istek sayısı için eşiği karşılaştırma ve isteklerin engellenmesi, Wallarm Bulut'ta gerçekleştirilir.

Davranışsal saldırı tespit edildiğinde, istek kaynakları engellenir, yani isteklerin gönderildiği IP adresleri engelleme listesine eklenir.

#### Davranışsal saldırı koruması yapılandırması

Kaynağı davranışsal saldırılara karşı korumak için, korelasyon analizi için eşiği ve davranışsal saldırılara karşı savunmasız olan URL'leri belirlemek gerekir:

* [Brüt güç koruması yapılandırma talimatları](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA (IDOR) koruması yapılandırma talimatları](../admin-en/configuration-guides/protecting-against-bola.md)

!!! warning "Davranışsal saldırı koruması kısıtlamaları"
    Davranışsal saldırı belirtileri ararken, Wallarm düğümleri yalnızca diğer saldırı türlerinin belirtilerini içermeyen HTTP isteklerini analiz eder. Örneğin, aşağıdaki durumlarda istekler, davranışsal saldırının bir parçası olarak kabul edilmez:

    * Bu istekler [giriş doğrulama saldırılarının](#input-validation-attacks) belirtilerini içerir.
    * Bu istekler, [**Düzenli ifadeye dayalı saldırı göstergesi oluştur**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) kuralında belirtilen düzenli ifadeye uyar.

## Korunan kaynak türleri

Wallarm düğümleri korunan kaynaklara gönderilen HTTP ve WebSocket trafiğini analiz eder:

* HTTP trafik analizi varsayılan olarak etkindir.

    Wallarm düğümleri HTTP trafiği [giriş doğrulama saldırıları](#input-validation-attacks) ve [davranışsal saldırılar](#behavioral-attacks) için analiz eder.
* WebSocket trafik analizi ek olarak [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket) direktifi üzerinden etkinleştirilmelidir.

    Wallarm düğümleri WebSocket trafiğini sadece [giriş doğrulama saldırıları](#input-validation-attacks) için analiz eder.

Korunan kaynak API'si aşağıdaki teknolojiler üzerine kurulduğunda tasarlanabilir (WAAP [abonelik planı](subscription-plans.md#subscription-plans) ile sınırlıdır):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## Saldırı tespit süreci

Saldırıları tespit etmek için Wallarm aşağıdaki süreci kullanır:

1. İstek formatını belirleyin ve [istek ayrıştırma belgesinde](../user-guides/rules/request-processing.md) açıklandığı gibi her istek parçasını ayrıştırın.
2. İsteklerin hitap ettiği uç noktayı belirleyin.
3. Wallarm Konsolunda yapılandırılan [özel istek analiz kurallarını](#custom-rules-for-request-analysis) uygulayın.
4. [Varsayılan ve özel tespit kuralları](#tools-for-attack-detection)na dayanarak isteğin kötü niyetli olup olmadığına karar verin.

## Saldırı tespiti için araçlar

Kötü niyetli talepleri tespit etmek için Wallarm düğümleri, korunan kaynağa gönderilen tüm talepleri aşağıdaki araçları kullanarak analiz eder:

* **libproton** Kütüphanesi
* **libdetection** Kütüphanesi
* Özel talep analizi kuralları

### **libproton** Kütüphanesi

**libproton** kütüphanesi, kötü niyetli talepleri tespit etme konusunda birincil araçtır. Kütüphane, farklı saldırı türlerinin belirtilerini belirleyen **proton.db** bileşenini kullanır, örneğin: `birlikte seç` [SQL enjeksiyon saldırı türü](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1) için. İstek, **proton.db**'den alınan sıra ile eşleşen bir belirteç sırasını içeriyorsa, bu istek ilgili türün saldırısı olarak kabul edilir.

Wallarm, yeni saldırı türleri ve zaten tanımlanan saldırı türleri için **proton.db**'yi belirteç sıralarıyla düzenli olarak günceller.

### **libdetection** Kütüphanesi

#### **libdetection** genel bakış

[**libdetection**](https://github.com/wallarm/libdetection) kütüphanesi, **libproton** kütüphanesi tarafından tespit edilen saldırıları şu şekilde ek olarak doğrular:

* **libdetection** **libproton** tarafından tespit edilen saldırı belirtilerini onaylarsa, saldırı engellenir (eğer filtreleme düğümü `block` modunda çalışıyorsa) ve Wallarm Bulut'a yüklenir.
* **libdetection** **libproton** tarafından tespit edilen saldırı belirtilerini onaylamazsa, istek meşru olarak kabul edilir, saldırı Wallarm Bulut'a yüklenmez ve engellenmez (eğer filtreleme düğümü `block` modunda çalışıyorsa).

**libdetection** kullanarak, saldırıların çift tespitini sağlar ve yanlış pozitiflerin sayısını azaltır.

!!! info "libdetection kütüphanesi tarafından doğrulanan saldırı türleri"
    Şu anda, **libdetection** kütüphanesi sadece SQL Enjeksiyon saldırılarını doğrular.

#### **libdetection** nasıl çalışır

**libdetection**'un belirgin özelliği, istekleri saldırı türlerine özgü belirteç sıralarının yanı sıra, belirteç sırasının gönderildiği bağlam için de analiz etmesidir.

Kütüphane, farklı saldırı türlerinin sözdizimlerinin karakter dizilerini içerir (şimdilik SQL Enjeksiyonu). Dize bağlam olarak adlandırılır. SQL enjeksiyon saldırı türü için bağlam örneği:

```curl
SELECT example FROM table WHERE id=
```

Kütüphane, saldırının sözdizimi analizini, bağlamlara eşleme için yapar. Saldırı bağlamlara uymuyorsa, istek bir kötü niyetli olan olarak tanımlanmayacak ve engellenmeyecek (eğer filtreleme düğümü `block` modunda çalışıyorsa).

#### **libdetection** test etme

**libdetection**'ın çalışmasını kontrol etmek için, aşağıdaki meşru isteği korunan kaynağa gönderebilirsiniz:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* **libproton** kütüphanesi, `UNION SELECT`'i SQL Enjeksiyon saldırısının belirtisi olarak algılar. `UNION SELECT` diğer komutlar olmadan SQL enjeksiyon saldırısının bir belirtisi olmadığından, **libproton** bir yanlış pozitif algılar.
* Eğer **libdetection** kütüphanesi kullanarak isteklerin analiz edilmesi etkinse, istekte SQL Enjeksiyon saldırısının belirtisi onaylanmayacaktır. İstek meşru olarak kabul edilir, saldırı Wallarm Bulut'a yüklenmez ve engellenmez (eğer filtreleme düğümü `block` modunda çalışıyorsa).

#### **libdetection** modunu yönetme

!!! info "**libdetection** varsayılan modu"
    **libdetection** kütüphanesinin varsayılan modu `on/true` (etkin) durumda olan tüm [dağıtım seçenekleri](../installation/supported-deployment-options.md) için kullanılır.

**libdetection** modunu şunları kullanarak kontrol edebilirsiniz:

* NGINX için [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) direktifi.
* Envoy için [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) parametresi.
* Wallarm NGINX Ingress denetleyicisi için [seçeneklerden biri](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode):

    * Ingress kaynağına `nginx.ingress.kubernetes.io/server-snippet` eklemesi.
    * Helm grafiğinin `controller.config.server-snippet` parametresi.

* Wallarm Yan Araba çözümü için `wallarm-enable-libdetection` [pod eklemesi](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list).
* [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module) dağıtımı için `libdetection` değişkeni.

### Özel talep analizi kuralları

Wallarm'ın varsayılan talep analizini, korunan uygulamanın özelliklerine uyacak şekilde düzeltmek için, Wallarm müşterileri aşağıdaki türlerde özel kurallar kullanabilir:

* [Sanal bir yama oluşturun](../user-guides/rules/vpatch-rule.md)
* [RegEx tabanlı saldırı göstergesi oluşturun](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [RegEx tabanlı saldırı tespitini devre dışı bırakın](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* [Belirli saldırı türlerini yoksayın](../user-guides/rules/ignore-attack-types.md)
* [İkili verileri ve dosya türlerini izin verin](../user-guides/rules/ignore-attacks-in-binary-data.md)
* [Analizcileri devre dışı bırakın/etkinleştirin](../user-guides/rules/disable-request-parsers.md)
* [Aşırı sınır_sal planlanan saldırı tespitini ince ayarlayın](../user-guides/rules/configure-overlimit-res-detection.md)

[Derlenmiş](../user-guides/rules/rules.md) özel kurallar seti, isteklerin analizi sırasında **proton.db**'den standart kurallarla birlikte uygulanır.

## Saldırıları İzleme ve Engelleme

Wallarm saldırıları aşağıdaki modlarda işleyebilir:

* İzleme modu: saldırıları algılar ancak engellemez.
* Güvenli engelleme modu: saldırıları algılar ancak yalnızca [gri listeye alınmış IP'lerden](../user-guides/ip-lists/graylist.md) kaynaklananları engeller. Gri listeye alınmış IP'lerden gelen meşru istekler engellenmez.
* Engelleme modu: saldırıları algılar ve engeller.

Wallarm kaliteli istek analizi ve düşük yanlış pozitif seviyesi sağlar. Ancak korunan her uygulamanın kendi özellikleri vardır, bu yüzden engelleme modunu etkinleştirmeden önce Wallarm'ın izleme modunda çalışmasını analiz etmenizi öneririz.

Filtreleme modunu kontrol etmek için `wallarm_mode` direktifi kullanılır. Filtreleme modu yapılandırması hakkında daha ayrıntılı bilgi [bağlantıda](../admin-en/configure-wallarm-mode.md) mevcuttur.

Davranışsal saldırılar için filtreleme modu, belirli bir [tetikleyici](../admin-en/configuration-guides/protecting-against-bruteforce.md) aracılığıyla ayrı ayrı yapılandırılır.

## Yanlış pozitifler

**Yanlış pozitif**, meşru bir istekte saldırı belirtilerinin tespit edildiği veya meşru bir varlığın bir güvenlik açığı olarak nitelendirildiği durumda meydana gelir. [Daha ayrıntılı bilgi için güvenlik açığı taramasında yanlış pozitiflere bakınız →](detecting-vulnerabilities.md#false-positives)

Saldırılar için isteklerin analiz edilmesi sırasında Wallarm, ultra düşük yanlış pozitiflerle optimal uygulama koruması sağlayan standart bir kural setini kullanır. Korunan uygulamanın özelliklerine bağlı olarak, standart kurallar meşru isteklerde yanıltıcı olarak saldırı belirtilerini tanıyabilir. Örneğin: Veritabanı Yöneticisi Forumu'na kötü niyetli SQL sorgusu açıklaması ekleyen bir istekle SQL enjeksiyonu saldırısı tespit edilebilir.

Bu gibi durumlarda, standart kuralların korunan uygulamanın özelliklerine uyması için aşağıdaki yöntemleri kullanarak ayarlanması gerekir:

* Potansiyel yanlış pozitifleri analiz edin (tüm saldırıları [etiket `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits) ile filtreleyin) ve yanlış pozitifleri onaylarsanız, belirli saldırıları veya hit'leri uygun şekilde [işaretleyin](../user-guides/events/false-attack.md). Wallarm, aynı isteklerin analizini tespit edilen saldırı belirtileri için devre dışı bırakan kuralları otomatik olarak oluşturacaktır.
* Belirli bir istekteki [belirli saldırı türlerinin tespitini devre dışı bırakın](../user-guides/rules/ignore-attack-types.md).
* İkili verilerde ve dosya türlerinde [belirli saldırı belirtilerinin tespitini devre dışı bırakın](../user-guides/rules/ignore-attacks-in-binary-data.md).
* [Hatalı bir şekilde uygulanan analizcileri devre dışı bırakın](../user-guides/rules/disable-request-parsers.md).

Yanlış pozitifleri belirleme ve ele alma, uygulamalarınızı korumak için Wallarm'ın ince ayarlanmasıdır. Wallarm'ın ilk düğümünü izleme [modunda](#monitoring-and-blocking-attacks) yayınlamanızı ve algılanan saldırıları analiz etmenizi öneririz. Eğer bazı saldırılar hatalı bir şekilde saldırı olarak tanımlanırsa, onları yanlış pozitif olarak işaretleyin ve filtreleme düğümünü engelleme moduna geçirin.

## Tespit Edilen Saldırıları Yönetme

Tüm tespit edilen saldırılar Wallarm Konsolu → **Etkinlikler** bölümünde `saldırılar` filtresi ile gösterilir. Arayüz üzerinden saldırıları aşağıdaki şekillerde yönetebilirsiniz:

* Saldırıları görüntüleyin ve analiz edin
* Saldırının yeniden kontrol kuyruğundaki önceliğini artırın
* Saldırıları veya ayrı hit'leri yanıltıcı pozitif olarak işaretleyin
* Ayrı hit'lerin özel işlenmesi için kurallar oluşturun

Saldırıları yönetme ile ilgili daha fazla bilgi için, [saldırılarla çalışma talimatlarına](../user-guides/events/analyze-attack.md) bakın.

![Saldırıları görüntüleme](../images/user-guides/events/check-attack.png)

Ayrıca, Wallarm, sisteminizin güvenlik duruşunun üstünde durmanıza yardımcı olacak kapsamlı panolar sağlar. Wallarm'ın [Tehdit Önleme](../user-guides/dashboards/threat-prevention.md) panelindeki genel ölçümleri, sisteminizin güvenlik duruşu hakkında bilgi verirken, [OWASP API Güvenlik İlk 10](../user-guides/dashboards/owasp-api-top-ten.md) panelindeki OWASP API İlk 10 tehditlerine karşı sisteminizin güvenlik duruşu hakkında detaylı görülebilir.

![OWASP API İlk 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Tespit edilen saldırılar, hit'ler ve kötü niyetli yükler hakkında bildirimler

Wallarm size tespit edilen saldırılar, hit'ler ve kötü niyetli yükler hakkında bildirimler gönderebilir. Sisteminize saldırı girişimlerinden haberdar olmanıza ve tespit edilen kötü niyetli trafiği hızlıca analiz etmenize izin verir. Kötü niyetli trafiğin analizi, yanlış pozitifleri bildirmeyi, meşru talepleri olan IP'leri izin vermeyi ve saldırı kaynaklarının IP'lerini engelleme listesine eklemeyi içerir.

Bildirimleri yapılandırmak için:

1. Bildirimlerin gönderileceği sistemlerle [yerel entegrasyonları](../user-guides/settings/integrations/integrations-intro.md) yapılandırın (örneğin, PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Bildirimlerin gönderilmesi için koşulları belirleyin:

    * Her tespit edilen hit için bildirim almak istiyorsanız, entegrasyon ayarlarında uygun seçeneği belirtin.

        ??? info "JSON formatında tespit edilen hit hakkında bildirimin örneğini görün"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * Saldırı, hit veya kötü niyetli yük sayısı için eşiği ayarlayın ve eşiğin aşıldığında bildirim almak için uygun [tetikleyicileri](../user-guides/triggers/triggers.md) yapılandırın.

        [Yapılandırılmış tetiği ve bildirimi görün →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)

## Demo videoları

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>