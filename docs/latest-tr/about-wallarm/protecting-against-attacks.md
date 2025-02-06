```markdown
[rule-creation-options]:    ../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# Saldırı Tespit Süreci

Wallarm platformu, uygulama trafiğini sürekli analiz eder ve kötü amaçlı istekleri gerçek zamanlı olarak önler. Bu makalede, Wallarm'ın saldırılardan koruduğu kaynak türlerini, trafikteki saldırı tespit yöntemlerini ve tespit edilen tehditlerin nasıl izlenip yönetilebileceğini öğreneceksiniz.

## Saldırı Nedir ve Saldırı Bileşenleri Nelerdir?

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.18% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/pmaofaxiwniz?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a name="attack"></a>**Saldırı**, aşağıdaki özelliklere göre gruplanan tek bir hit ya da birden fazla hit'tir:

* Aynı saldırı türü, kötü amaçlı yük içeren parametre ve hit'lerin gönderildiği adres. Hit'ler aynı ya da farklı IP adreslerinden gelebilir ve aynı saldırı türü içinde kötü amaçlı yüklerin farklı değerleri olabilir. Son hit'ten sonra bir saat içerisinde yeni bir hit gelmelidir; aksi halde ayrı bir saldırı olarak değerlendirilecektir.

    Bu hit gruplama yöntemi temel olup tüm hit'lerde uygulanır.

* Eğer [kaynak IP’ye göre hit gruplama](../user-guides/events/grouping-sampling.md#grouping-of-hits) etkinleştirilmişse, aynı kaynak IP adresine sahip hit'ler. Diğer hit parametre değerleri farklı olabilir.

    Bu hit gruplama yöntemi, Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb ve Virtual patch saldırı türleri dışındaki tüm hit'ler için geçerlidir.

    Eğer hit'ler bu yöntemle gruplanırsa, ilgili saldırı için [**Yanlış pozitif olarak işaretle**](../user-guides/events/check-attack.md#false-positives) butonu kullanılamaz.

Listeye alınan hit gruplama yöntemleri birbirini dışlamaz. Eğer hit'ler her iki yöntemin özelliklerine sahipse, hepsi tek bir saldırıda gruplanır.

<a name="hit"></a>**Hit**, seri hale getirilmiş kötü amaçlı bir istektir (orijinal kötü amaçlı istek ve Wallarm düğümü tarafından eklenen meta veriler). Eğer Wallarm, tek bir istekte farklı türde birçok kötü amaçlı yük tespit ederse, her tür için ayrı hit'ler kaydeder.

<a name="malicious-payload"></a>**Kötü Amaçlı Yük**, aşağıdaki öğeleri içeren orijinal bir isteğin parçasıdır:

* Bir istekte tespit edilen saldırı işaretleri. Eğer bir istekte aynı saldırı türünü karakterize eden birden fazla saldırı işareti tespit edilirse, yalnızca ilk işaret kötü amaçlı yüke kaydedilir.
* Saldırı işaretinin bağlamı. Bağlam, tespit edilen saldırı işaretlerinin öncesinde ve sonrasında bulunan sembollerden oluşur. Kötü amaçlı yük uzunluğu sınırlı olduğundan, eğer saldırı işareti tüm yük uzunluğunu kapsıyorsa bağlam atlanabilir.

Saldırı işaretleri [davranışsal saldırıları](#behavioral-attacks) tespit etmek için kullanılmadığından, davranışsal saldırıya ait isteklerin yükleri boştur.

[Learn how to analyze attacks in Wallarm →](../user-guides/events/check-attack.md)

## Korumalı Kaynak Türleri

Wallarm düğümleri, korumalı kaynaklara gönderilen HTTP ve WebSocket trafiğini analiz eder:

* HTTP trafik analizi varsayılan olarak etkinleştirilmiştir.

    Wallarm düğümleri, HTTP trafiğini [girdi doğrulama saldırılarına](#input-validation-attacks) ve [davranışsal saldırılara](#behavioral-attacks) karşı analiz eder.
* WebSocket trafik analizi, [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket) direktifi aracılığıyla ayrıca etkinleştirilmelidir.

    Wallarm düğümleri, WebSocket trafiğini yalnızca [girdi doğrulama saldırılarına](#input-validation-attacks) karşı analiz eder.

Korumalı kaynak API'si, aşağıdaki teknolojiler temel alınarak tasarlanabilir (WAAP [subscription plan](subscription-plans.md#waap-and-advanced-api-security) kapsamında sınırlıdır):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## Saldırı Tespit Süreci

Saldırıları tespit etmek için Wallarm, aşağıdaki süreci kullanır:

1. İstek formatını belirleyin ve her istek parçasını [parse edin](../user-guides/rules/request-processing.md).
2. İsteğin gönderildiği uç noktayı belirleyin.
3. Wallarm Console'da yapılandırılmış [özel](../user-guides/rules/rules.md) istek analiz kurallarını uygulayın.
4. [Varsayılan](#tools-for-attack-detection) ve özel kurallara dayanarak isteğin kötü amaçlı olup olmadığına karar verin.

## Saldırı Türleri

Wallarm çözümü, API'leri, mikroservisleri ve web uygulamalarını [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve [OWASP API Top 10](https://owasp.org/www-project-api-security/) tehditlerine, API kötüye kullanımına ve diğer otomatik tehditlere karşı korur.

Teknik olarak, Wallarm tarafından tespit edilebilen tüm saldırılar şu gruplara ayrılır:

* Girdi doğrulama saldırıları
* Davranışsal saldırılar

Saldırı tespit yöntemi saldırı grubuna bağlıdır. Davranışsal saldırıları tespit etmek için ek Wallarm düğüm yapılandırması gereklidir.

### Girdi Doğrulama Saldırıları

Girdi doğrulama saldırıları, SQL enjeksiyonu, cross‑site scripting, uzaktan kod çalıştırma, Path Traversal ve diğer saldırı türlerini içerir. Her saldırı türü, isteklerde gönderilen belirli sembol kombinasyonları ile karakterize edilir. Girdi doğrulama saldırılarını tespit etmek için, isteklerin sözdizimsel analizinin yapılması – belirli sembol kombinasyonlarını tespit etmek amacıyla parse edilmesi – gereklidir.

Wallarm, listelenen [araçlar](#tools-for-attack-detection) kullanılarak, SVG, JPEG, PNG, GIF, PDF vb. gibi ikili dosyalar dahil her istek parçasında girdi doğrulama saldırılarını tespit eder.

Girdi doğrulama saldırılarının tespiti varsayılan olarak tüm müşteriler için etkinleştirilmiştir.

### Davranışsal Saldırılar

Davranışsal saldırılar, aşağıdaki saldırı sınıflarını içerir:

* [Kaba kuvvet saldırıları](../admin-en/configuration-guides/protecting-against-bruteforce.md) şifre kaba kuvvet denemesi, oturum kimliği kaba kuvvet denemesi, credential stuffing gibi saldırıları içerir. Bu saldırılar, sınırlı bir zaman diliminde tipik bir URI'ye gönderilen, farklı zorlanmış parametre değerlerine sahip çok sayıda istek ile karakterize edilir.

    Örneğin, bir saldırgan şifreyi zorladığında, kullanıcı kimlik doğrulama URL'sine farklı `password` değerlerine sahip birçok benzer istek gönderilebilir:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```
* [Zorunlu tarama saldırıları](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md), sınırlı bir zaman diliminde farklı URI'lere yapılan isteklere dönen çok sayıda 404 yanıt kodu ile karakterizedir.

    Örneğin, bu saldırının amacı, gizli kaynakları (örneğin uygulama bileşenleri hakkında bilgi içeren dizinler ve dosyalar) numaralandırmak ve erişmek, böylece bu bilgileri diğer saldırı türlerini gerçekleştirmek için kullanmaktır.
* [BOLA (IDOR) saldırıları](../admin-en/configuration-guides/protecting-against-bola-trigger.md), aynı adı taşıyan açığı kullanır. Bu açık, bir saldırgana API isteği yoluyla bir nesneye tanımlayıcısı üzerinden erişip, yetkilendirme mekanizmasını atlayarak verilerine ulaşma veya verilerini değiştirme imkânı sağlar.

    Örneğin, bir saldırgan, gerçek bir mağaza tanımlayıcısını bulmak ve karşılık gelen mağaza finansal verilerini elde etmek için mağaza tanımlayıcılarını zorlayabilir:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    Eğer bu tür API istekleri için yetkilendirme gerekmiyorsa, saldırgan gerçek finansal verileri elde edebilir ve bunları kendi amaçları için kullanabilir.

#### Tespit

Davranışsal saldırıları tespit etmek için, isteklerin sözdizimsel analizinin yanı sıra, istek sayısı ve istekler arasındaki zamanın korelasyon analizi yapılmalıdır.

Korelasyon analizi, kullanıcı kimlik doğrulama, kaynak dosya dizini veya belirli bir nesne URL'sine gönderilen istek sayısı eşiği aşıldığında gerçekleştirilir. İstek sayısı eşiği, meşru isteklerin engellenme riskini azaltacak şekilde ayarlanmalıdır (örneğin, kullanıcının hesabına birkaç kez yanlış şifre girdiği durumlarda).

* Korelasyon analizi, Wallarm postanalytics modülü tarafından gerçekleştirilir.
* Alınan istek sayısı ile eşik değerinin karşılaştırılması ve isteklerin engellenmesi Wallarm Cloud'da gerçekleştirilir.

Davranışsal saldırı tespit edildiğinde, istek kaynakları engellenir; yani, isteklerin gönderildiği IP adresleri denylist'e eklenir.

#### Koruma

Kaynağı davranışsal saldırılara karşı korumak için, korelasyon analizi eşiğini ve davranışsal saldırılara karşı savunmasız URL'leri ayarlamak gereklidir:

* [Kaba kuvvet koruması yapılandırma talimatları](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Zorunlu tarama koruması yapılandırma talimatları](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA (IDOR) koruması yapılandırma talimatları](../admin-en/configuration-guides/protecting-against-bola-trigger.md)

## Saldırı Tespit Araçları

Kötü amaçlı istekleri tespit etmek için, Wallarm düğümleri korumalı kaynağa gönderilen tüm istekleri aşağıdaki araçları kullanarak [analiz eder](#attack-detection-process):

* **libproton** Kütüphanesi
* **libdetection** Kütüphanesi
* İstek analizi için özel kurallar

### libproton Kütüphanesi

**libproton** kütüphanesi, kötü amaçlı istekleri tespit etmede birincil araçtır. Kütüphane, farklı saldırı türü işaretlerini belirlemek için token dizileri olarak işleyen **proton.db** bileşenini kullanır; örneğin, [SQL enjeksiyonu saldırı türü](../attacks-vulns-list.md#sql-injection) için `union select`. Eğer istek, **proton.db** dizisinden eşleşen bir token dizisi içeriyorsa, bu istek ilgili saldırı türü olarak değerlendirilir.

Wallarm, yeni saldırı türleri ve halihazırda tanımlanmış saldırı türleri için **proton.db**'yi düzenli olarak token dizileriyle günceller.

### libdetection Kütüphanesi

#### libdetection Genel Bakış

[**libdetection**](https://github.com/wallarm/libdetection) kütüphanesi, **libproton** tarafından tespit edilen saldırıları ek olarak şu şekilde doğrular:

* Eğer **libdetection**, **libproton** tarafından tespit edilen saldırı işaretlerini onaylarsa, saldırı engellenir (filtreleme düğümü `block` modunda çalışıyorsa) ve Wallarm Cloud'a yüklenir.
* Eğer **libdetection**, **libproton** tarafından tespit edilen saldırı işaretlerini onaylamazsa, istek meşru kabul edilir; saldırı Wallarm Cloud'a yüklenmez ve engellenmez (filtreleme düğümü `block` modunda çalışıyorsa).

**libdetection** kullanmak, saldırıların çift tespitini sağlar ve yanlış pozitif sayısını azaltır.

!!! info "libdetection kütüphanesi tarafından doğrulanan saldırı türleri"
    Şu anda, **libdetection** kütüphanesi yalnızca SQL Enjeksiyonu saldırılarını doğrular.

#### libdetection Nasıl Çalışır

**libdetection**'ın belirgin özelliği, istekleri yalnızca saldırı türlerine özgü token dizileri için değil, aynı zamanda token dizisinin gönderildiği bağlam için de analiz etmesidir.

Kütüphane, farklı saldırı türü sözdizimlerinin karakter dizilerini içerir (şimdilik SQL Enjeksiyonu). Bu dizi bağlam olarak adlandırılır. SQL enjeksiyonu saldırı türü için bağlam örneği:

```curl
SELECT example FROM table WHERE id=
```

Kütüphane, bağlamlarla eşleşme için saldırı sözdizimi analizini gerçekleştirir. Eğer saldırı bağlamlarla eşleşmezse, istek kötü amaçlı olarak tanımlanmaz ve engellenmez (filtreleme düğümü `block` modunda çalışıyorsa).

#### libdetection Test Etme

**libdetection**'ın çalışmasını kontrol etmek için, korumalı kaynağa aşağıdaki meşru isteği gönderebilirsiniz:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* **libproton** kütüphanesi, `UNION SELECT` ifadesini SQL Enjeksiyonu saldırı işareti olarak tespit edecektir. Diğer komutlar olmadan `UNION SELECT` ifadesi SQL enjeksiyonu saldırısının işareti olmadığından, **libproton** yanlış pozitif tespit eder.
* Eğer isteklerin **libdetection** kütüphanesi ile analizi etkinse, SQL Enjeksiyonu saldırı işareti istek içinde onaylanmayacaktır. İstek meşru kabul edilir, saldırı Wallarm Cloud'a yüklenmez ve engellenmez (filtreleme düğümü `block` modunda çalışıyorsa).

#### libdetection Modunun Yönetilmesi

!!! info "**libdetection** varsayılan modu"
    **libdetection** kütüphanesinin varsayılan modu, tüm [deployment options](../installation/supported-deployment-options.md) için `on/true` (etkin) durumdadır.

**libdetection** modunu şu yollarla kontrol edebilirsiniz:

* NGINX için [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) direktifi.
* Envoy için [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) parametresi.
* Wallarm NGINX Ingress kontrolcüsü için [seçeneklerden](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode) biri:

    * Ingress kaynağına `nginx.ingress.kubernetes.io/server-snippet` etiketi.
    * Helm chart'ının `controller.config.server-snippet` parametresi.

* Wallarm Sidecar çözümü için `wallarm-enable-libdetection` [pod etiketi](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list).
* [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module) dağıtımı için `libdetection` değişkeni.

## Belirli Saldırı Türlerini Yoksayma

**Belirli saldırı türlerini yoksay** kuralı, belirli istek öğelerindeki belirli saldırı türlerinin tespitini devre dışı bırakmanıza olanak tanır.

Varsayılan olarak, Wallarm düğümü, herhangi bir istek öğesinde herhangi bir saldırı türü işareti tespit ederse isteği saldırı olarak işaretler. Ancak, saldırı işaretleri içeren bazı istekler aslında meşru olabilir (örneğin, Database Administrator Forum'da gönderi yayınlayan isteğin gövdesi, [kötü amaçlı SQL komutu](../attacks-vulns-list.md#sql-injection) açıklaması içerebilir).

Eğer Wallarm düğümü, isteğin standart yükünü kötü amaçlı olarak işaretlerse, [yanlış pozitif](#false-positives) durum ortaya çıkar. Yanlış pozitifleri önlemek için, korumalı uygulama özelliklerine uyum sağlamak amacıyla standart saldırı tespit kuralları, belirli türlerin özel kuralları kullanılarak ayarlanmalıdır. Wallarm, bunu yapmak için **Belirli saldırı türlerini yoksay** [kuralını](../user-guides/rules/rules.md) sunar.

**Kural Oluşturma ve Uygulama**

--8<-- "../include/rule-creation-initial-step.md"
1. **Saldırı tespitinin ince ayarları** → **Belirli saldırıları yoksay** seçeneğini seçin.
2. **If request is** alanında, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring).
3. Yalnızca belirli saldırıların işaretlerini (seçerek) mi yoksa tüm saldırıların işaretlerini mi yoksayacağını ayarlayın.
4. **In this part of request** alanında, kuralı uygulamak istediğiniz istek noktalarını belirtin.

    Tüm mevcut noktalar [burada](../user-guides/rules/request-processing.md) açıklanmıştır; kullanım durumunuza uygun olanları seçebilirsiniz.

5. [Kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

**Kural Örneği**

Diyelim ki, kullanıcı database administrator forumunda gönderinin yayınlanmasını onayladığında, istemci `https://example.com/posts/` uç noktasına POST isteği gönderiyor. Bu isteğin aşağıdaki özellikleri vardır:

* Gönderi içeriği, istek gövdesi parametresi `postBody` içinde iletilir. Gönderi içeriği, Wallarm tarafından kötü amaçlı olarak işaretlenebilecek SQL komutlarını içerebilir.
* İstek gövdesi `application/json` tipindedir.

[SQL injection](../attacks-vulns-list.md#sql-injection) içeren cURL isteği örneği:

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

Dolayısıyla, `https://example.com/posts/` adresine gönderilen isteklerin `postBody` parametresindeki SQL enjeksiyonlarını yoksaymanız gerekir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Belirli saldırı türlerini yoksay** kuralını ayarlayın:

![Example of the rule "Ignore certain attack types"](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## İkili Verideki Belirli Saldırı İşaretlerini Yoksayma

Varsayılan olarak, Wallarm düğümü gelen istekleri bilinen tüm saldırı işaretleri için analiz eder. Analiz sırasında, Wallarm düğümü saldırı işaretlerini normal ikili semboller olarak değerlendirmeyip, ikili veri içinde yanlışlıkla kötü amaçlı yükleri tespit edebilir.

**Allow binary data** [kuralını](../user-guides/rules/rules.md) kullanarak, ikili veri içeren istek öğelerini açıkça belirtebilirsiniz. Belirtilen istek öğesi analizinde, Wallarm düğümü asla ikili veri içinde iletilemeyecek saldırı işaretlerini yoksayar.

* **Allow binary data** kuralı, ikili veri içeren istek öğeleri (örneğin arşivlenmiş veya şifrelenmiş dosyalar) için saldırı tespitinin ince ayarını sağlar.

**Kural Oluşturma ve Uygulama**

--8<-- "../include/rule-creation-initial-step.md"
1. **Saldırı tespitinin ince ayarları** → **Binary data processing** seçeneğini seçin.
2. **If request is** alanında, kuralın uygulanacağı kapsamı [tanımlayın](../user-guides/rules/rules.md#configuring).
3. **In this part of request** alanında, kuralı uygulamak istediğiniz istek noktalarını belirtin.

    Tüm mevcut noktalar [burada](../user-guides/rules/request-processing.md) açıklanmıştır; kullanım durumunuza uygun olanları seçebilirsiniz.

4. [Kural derlemesinin tamamlanmasını](../user-guides/rules/rules.md#ruleset-lifecycle) bekleyin.

**Kural Örneği**

Diyelim ki, kullanıcı site üzerindeki form aracılığıyla bir resim içeren ikili dosya yüklediğinde, istemci `multipart/form-data` tipinde bir POST isteğini `https://example.com/uploads/` adresine gönderiyor. İkili dosya, `fileContents` gövde parametresi içinde iletilir ve buna izin vermeniz gerekir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Allow binary data** kuralını ayarlayın:

![Example of the rule "Allow binary data"](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## Saldırıları İzleme ve Engelleme

**Girdi doğrulama saldırıları**

Wallarm, [girdi doğrulama saldırılarını](#input-validation-attacks) aşağıdaki modlarda işleyebilir:

* İzleme modu: saldırıları tespit eder ancak engellemez.
* Güvenli engelleme modu: saldırıları tespit eder ancak sadece [graylisted IP'lerden](../user-guides/ip-lists/overview.md) kaynaklananları engeller. Graylisted IP'lerden gelen meşru istekler engellenmez.
* Engelleme modu: saldırıları tespit eder ve engeller.

Farklı filtreleme modlarının nasıl çalıştığı ve genel veya belirli uygulamalar, alanlar ya da uç noktalar için filtreleme modunun nasıl yapılandırılacağı hakkında ayrıntılı bilgi [burada](../admin-en/configure-wallarm-mode.md) mevcuttur.

**Davranışsal saldırılar**

Wallarm'ın, [davranışsal saldırıları](#behavioral-attacks) nasıl tespit ettiği ve tespit durumunda nasıl davrandığı, filtreleme modundan ziyade bu saldırı türü korumasının [belirli yapılandırması](#protection) tarafından tanımlanır.

## Yanlış Pozitifler

**Yanlış pozitif**, meşru bir istekte saldırı işaretleri tespit edildiğinde veya meşru bir varlık güvenlik açığı olarak nitelendirildiğinde meydana gelir. [Güvenlik açığı taramasında yanlış pozitifler hakkında daha fazla bilgi →](detecting-vulnerabilities.md#false-positives)

Saldırı isteklerini analiz ederken, Wallarm ultra-düşük yanlış pozitiflerle optimal uygulama koruması sağlayan standart kural setini kullanır. Korumalı uygulama özellikleri nedeniyle, standart kurallar meşru isteklere saldırı işaretlerini yanlışlıkla tanıyabilir. Örneğin, bir gönderi eklenirken kötü amaçlı SQL sorgu açıklaması içeren istek nedeniyle SQL enjeksiyonu saldırısı tespit edilebilir.

Bu tür durumlarda, korumalı uygulama özelliklerine uyum sağlamak amacıyla standart kurallar, aşağıdaki yöntemler kullanılarak ayarlanmalıdır:

* Tüm saldırıları [etiket `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits) ile filtreleyerek potansiyel yanlış pozitifleri analiz edin ve eğer yanlış pozitifler doğrulanırsa, ilgili saldırıları veya hit'leri uygun şekilde [işaretleyin](../user-guides/events/check-attack.md#false-positives). Wallarm, tespit edilen saldırı işaretlerine sahip aynı isteklerin analizini devre dışı bırakacak kuralları otomatik olarak oluşturur.
* Belirli isteklere yönelik [belirli saldırı türlerinin tespitini devre dışı bırakın](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types).
* İkili veride [belirli saldırı işaretlerinin tespitini devre dışı bırakın](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data).
* İsteklere yanlışlıkla uygulanan [parçacıkları devre dışı bırakın](../user-guides/rules/request-processing.md#managing-parsers).

Yanlış pozitiflerin belirlenmesi ve ele alınması, Wallarm'in uygulamalarınızı korumak için yaptığı ince ayarın bir parçasıdır. İlk Wallarm düğümünü izleme [modunda](#monitoring-and-blocking-attacks) dağıtmanızı, tespit edilen saldırıları analiz etmenizi ve eğer bazı saldırılar yanlışlıkla saldırı olarak tanımlanırsa, bunları yanlış pozitif olarak işaretleyerek filtreleme düğümünü engelleme moduna geçirmenizi öneririz.

## Tespit Edilen Saldırıları Yönetme

Tespit edilen tüm saldırılar, Wallarm Console → **Attacks** bölümünde `attacks` filtresi ile görüntülenir. Saldırıları arayüz üzerinden şu şekilde yönetebilirsiniz:

* Saldırıları görüntüleyip analiz edin
* Yeniden kontrol kuyruğunda bir saldırının önceliğini artırın
* Saldırıları veya ayrı hit'leri yanlış pozitif olarak işaretleyin
* Ayrı hit'lerin özel işlenmesi için kurallar oluşturun

![Attacks view](../images/user-guides/events/check-attack.png)

## Saldırı Panelleri

Wallarm, sisteminizin güvenlik durumunu yakından takip etmenize yardımcı olmak için kapsamlı paneller sunar.

Wallarm'ın [Threat Prevention](../user-guides/dashboards/threat-prevention.md) paneli, sisteminizin güvenlik durumu hakkında genel metrikler sağlar; bu metrikler saldırıların kaynakları, hedefleri, türleri ve protokolleri gibi çok yönlü bilgileri içerir.

![Threat Prevention dashboard](../images/user-guides/dashboard/threat-prevention.png)

[OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md) paneli, OWASP API Top 10 tehditlerine karşı sisteminizin güvenlik durumu hakkında, saldırı bilgileri de dahil olmak üzere detaylı görünürlük sağlar.

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Tespit Edilen Saldırılar, Hit'ler ve Kötü Amaçlı Yükler Hakkında Bildirimler

Wallarm, tespit edilen saldırılar, hit'ler ve kötü amaçlı yükler hakkında size bildirimler gönderebilir. Bu, sisteminizi hedef alan saldırı girişimlerinin farkında olmanızı ve tespit edilen kötü amaçlı trafiği hızlıca analiz etmenizi sağlar. Kötü amaçlı trafik analizi, yanlış pozitiflerin raporlanması, meşru isteklerin kaynağı olan IP'lerin allowlist'e eklenmesi ve saldırı kaynaklarına ait IP'lerin denylist'e eklenmesini içerir.

Bildirimleri yapılandırmak için:

1. Bildirim göndermek için sistemlerle [yerel entegrasyonları](../user-guides/settings/integrations/integrations-intro.md) yapılandırın (örneğin, PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Bildirim gönderme koşullarını ayarlayın:

    * Her tespit edilen hit için bildirim almak adına, entegrasyon ayarlarında uygun seçeneği belirleyin.

        ??? info "Tespit edilen hit hakkında JSON formatında bildirimin örneğine bakın"
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
    
    * Saldırı, hit veya kötü amaçlı yük sayısı için eşik değeri ayarlayıp, eşik aşıldığında bildirim almak için uygun [tetikleyicileri](../user-guides/triggers/triggers.md) yapılandırın.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
```