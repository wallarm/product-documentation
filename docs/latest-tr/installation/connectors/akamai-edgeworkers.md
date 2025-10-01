[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Akamai için Wallarm Bağlayıcısı

API’lerini [Akamai CDN](https://www.akamai.com/solutions/content-delivery-network) özellikleri üzerinden sunan müşteriler için Wallarm, özel bir EdgeWorker kod paketi sağlar. Bu EdgeWorker’ı dağıttığınızda, istekler origin’e ulaşmadan önce denetim ve koruma için bir Wallarm node’una yönlendirilir. Bu yaklaşım, origin altyapısında değişiklik yapmadan API trafiğini doğrudan edge üzerinde güvence altına almanıza imkân tanır.

Wallarm’ı Akamai için bir bağlayıcı olarak kullanmak için, **Wallarm node’unu harici olarak dağıtmanız** ve trafiği analiz için Wallarm node’una yönlendirmek üzere **Akamai’de Wallarm tarafından sağlanan kod paketini uygulamanız** gerekir.

Akamai için Wallarm bağlayıcısı hem [senkron (in-line)](../inline/overview.md) hem de [asenkron (out‑of‑band)](../oob/overview.md) trafik analizini destekler:

=== "Senkron trafik akışı"
    ![!Wallarm EdgeWorker ile Akamai senkron trafik akışı](../../images/waf-installation/gateways/akamai/traffic-flow-sync.png)
=== "Asenkron trafik akışı"
    ![!Wallarm EdgeWorker ile Akamai asenkron trafik akışı](../../images/waf-installation/gateways/akamai/traffic-flow-async.png)

## Kullanım durumları

Bu çözüm, Akamai CDN üzerinden sunulan API’lerin güvence altına alınması için önerilir.

## Sınırlamalar

Akamai için Wallarm bağlayıcısının bazı sınırlamaları vardır:

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

Buna ek olarak, aşağıdaki [EdgeWorkers platform kısıtlamaları](https://techdocs.akamai.com/edgeworkers/docs/limitations) bağlayıcı tasarımını etkiler:

* **httpRequest alan adı kısıtı** – Bir EdgeWorker’dan yapılan alt istekler, zaten Akamai tarafından sunulan bir alan adını (yani yapılandırılmış bir property) hedeflemelidir
* **Yalnızca HTTPS alt istekleri** – Başka bir protokol belirtilirse, EdgeWorkers bunu otomatik olarak HTTPS’e dönüştürür
* **Olay modeli kısıtı** – İstek ve yanıt gövdelerine yalnızca `responseProvider` olayı içinde erişilebilir

Bu kısıtlamalar nedeniyle, Wallarm EdgeWorker, aynı property’ye geri bir alt istek yapan bir `responseProvider` fonksiyonu olarak uygulanmıştır. Bu alt istek, sonsuz döngüleri önleyen ve trafiğin Wallarm node’una yönlendirilmesine imkân tanıyan `x-wlrm-checked` özel başlığını içerir.

## Gereksinimler

Wallarm EdgeWorker’ı Akamai üzerinde dağıtmak için aşağıdaki gereksinimlerin karşılandığından emin olun:

* Akamai teknolojilerine hâkimiyet
* Sözleşmenizde Akamai EdgeWorkers’ın [etkinleştirilmiş](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) olması
* Origin backend’in mevcut olması

    * API servislerinizin erişilebilir bir origin sunucusunda çalışıyor olması
    * Origin alan adının, bir CNAME kaydı üzerinden Akamai property ana bilgisayar adına çözünmesi
* Korumalı origin’e trafiği iletecek şekilde yapılandırılmış Akamai property

    * Property, **Default Rule** içinde **Origin Server** davranışını içermelidir
    * Property, sunulan host için geçerli bir TLS sertifikasına sahip olmalıdır
* Bir DNS bölgesi (ör. `customer.com`) üzerinde kontrol ve Wallarm Node property’si için adanmış bir alt alan adı (ör. `node.customer.com`) ayırma hazırlığı

    Property oluşturulduktan sonra Akamai bir Edge Hostname döndürecektir (ör. `node.customer.com.edgesuite.net`). DNS’inizde, seçtiğiniz alt alan adını bu Edge Hostname’e işaret eden bir **CNAME kaydı** oluşturmalısınız.

## Dağıtım

### 1. Bir Wallarm node’u dağıtın

Wallarm node’u, dağıtmanız gereken Wallarm platformunun çekirdek bileşenidir. Gelen trafiği inceler, kötü niyetli aktiviteleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Akamai bağlayıcısı için node’u yalnızca kendi altyapınızda dağıtabilirsiniz. 

Self-hosted node dağıtımı için bir yapıt (artifact) seçin ve ilgili talimatları izleyin:

* Bare metal veya VM’lerdeki Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
* Konteynerleştirilmiş dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
* Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

!!! info "Gerekli Node sürümü"
    Akamai bağlayıcısının yalnızca Native Node’un [0.16.3+ sürümü](../../updating-migrating/native-node/node-artifact-versions.md) tarafından desteklendiğini lütfen unutmayın.

### 2. Wallarm kod paketini edinin ve EdgeWorker’lar oluşturun

Wallarm kod paketini Akamai EdgeWorkers üzerinde edinmek ve çalıştırmak için şu adımları izleyin:

1. Wallarm kod paketini edinmek için [support@wallarm.com](mailto:support@wallarm.com) adresiyle iletişime geçin.
1. Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID** öğesine gidin, ardından `wallarm-main` kod paketini içe aktarın.

    Bu, istekleri Wallarm node’u üzerinden yönlendiren ana EdgeWorker’dır.
1. Başka bir EdgeWorker ID oluşturun ve `wallarm-sp` paketini içe aktarın.

    Bu, spoofing önleme için önerilen EdgeWorker’dır. Bir property gerektirmez.

### 3. Wallarm Node property’sini oluşturun

1. Akamai Property Manager’da yeni bir property oluşturun:

    * **Property name / hostname**: ayrılmış Node hostname’i (ör. `node.customer.com`). Bu hostname, kontrol ettiğiniz bir DNS bölgesine ait olmalıdır.
    * **Property type**: `Dynamic Site Accelerator`.
    * **Origin type**: `Web server`.
    * **Origin Hostname**: [dağıttığınız Wallarm Node’un gerçek adresi](#1-deploy-a-wallarm-node).
1. Property için TLS yapılandırın:

    * Ya **Akamai Managed Certificate** seçin (Akamai, `node.customer.com` için bir sertifika düzenler ve yönetir) ya da
    * Gerekirse kendi sertifikanızı yükleyin.
1. Property’yi kaydedin. Akamai aşağıdakine benzer bir Edge Hostname üretecektir:

    ```
    node.customer.com.edgesuite.net
    ```
1. DNS bölgenizde, Node hostname’inizi Edge Hostname’e işaret eden bir CNAME kaydı oluşturun, ör.:

    ```
    node.customer.com → node.customer.com.edgesuite.net
    ```
1. [Property’yi staging’de etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-stage), işlevselliği doğrulayın, ardından [production’da etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

![!Akamai'de Wallarm Node Property](../../images/waf-installation/gateways/akamai/wallarm-property.png)

### 4. Origin property’de değişkenleri yapılandırın

Mevcut origin property’nizi açın → **Edit New Version** ve aşağıdaki değişkenleri yapılandırın:

| Değişken | Açıklama | Gerekli mi? |
| -------- | -------- | ----------- |
| `PMUSER_WALLARM_NODE` | `wallarm-main` EdgeWorker’ı için oluşturduğunuz property adı. | Evet |
| `PMUSER_WALLARM_HEADER_SECRET` | Spoofing önleme için rastgele bir gizli değer, ör. `aj8shd82hjd72hs9`. `wallarm-main` EdgeWorker, bir isteği aynı property’ye geri yönlendirdiğinde bu değeri içeren `x-wlrm-checked` başlığını ekler. `wallarm-sp` EdgeWorker bu başlığı doğrular: eşleşme yoksa istek engellenir. Bu, sonsuz döngüleri önler ve istemcilerin Wallarm kontrollerini atlamak için sahte bir başlık eklemesini engeller.<br>Gizli tutun ve başka yerde yeniden kullanmayın. | Evet |
| `PMUSER_WALLARM_ASYNC` | Trafik işleme modunu belirler: `false`, trafiği doğrudan Wallarm Node üzerinden işler (senkron), `true` ise trafiğin [kopyasını](../oob/overview.md) orijinal akışı etkilemeden analiz eder (asenkron). Varsayılan: `false`. | Hayır |
| `PMUSER_WALLARM_INSPECT_REQ_BODY` | İstek gövdelerinin analiz için Wallarm node’una gönderilip gönderilmeyeceğini kontrol eder. Varsayılan: `true`. | Hayır |
| `PMUSER_WALLARM_INSPECT_RSP_BODY` | Yanıt gövdelerinin analiz için Wallarm node’una gönderilip gönderilmeyeceğini kontrol eder. Yanıt şeması keşfini ve gelişmiş saldırı ile zafiyet tespit kabiliyetlerini etkinleştirir. Varsayılan: `true`. | Hayır |

![!Akamai origin property için Wallarm değişkenleri](../../images/waf-installation/gateways/akamai/origin-property-variables.png)

Bağlayıcı modunu ve gövde inceleme ayarlarını rota bazında veya dosya türüne göre **Set Variable** davranışını kullanarak ince ayar yapabilirsiniz.

### 5. Wallarm EdgeWorker kuralını ekleyin

Origin property’de yeni bir boş kural oluşturun:

* Kriter:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Davranış: EdgeWorkers → `wallarm-main` EdgeWorker

Daha karmaşık kurulumlarda, bu koşulu yol kontrolleriyle birleştirerek (örneğin kuralı yalnızca `/api/*` yollarına uygulayarak) yalnızca API trafiğinin Wallarm tarafından işlenmesini sağlayabilirsiniz.

### 6. Spoofing önleme kuralını ekleyin

Origin property’de başka bir yeni boş kural oluşturun:

* Kriter:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Davranış: EdgeWorkers → `wallarm-sp` EdgeWorker

Bu kural, `x-wlrm-checked` başlığının `PMUSER_WALLARM_HEADER_SECRET` değerine eşit olmasını sağlar. Başka herhangi bir değer engellenir; bu, istemcilerin Wallarm kontrollerini atlamasını engeller.

Daha karmaşık kurulumlarda, bu koşulu yol kontrolleriyle birleştirerek (örneğin kuralı yalnızca `/api/*` yollarına uygulayarak) yalnızca API trafiğinin Wallarm tarafından işlenmesini sağlayabilirsiniz.

### 7. Property’yi kaydedin ve etkinleştirin

1. Yeni origin property sürümünü kaydedin.
1. [Staging ortamında etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-stage).
1. Doğrulamanın ardından [production’da etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

## Test

Dağıtılan EdgeWorker’ların işlevselliğini test etmek için şu adımları izleyin:

1. Akamai CDN’inize test [Dizin Geçişi][ptrav-attack-docs] saldırısıyla bir istek gönderin:

    ```
    curl http://<AKAMAI_CDN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzdeki Attacks][attacks-in-ui-image]

    Wallarm node modu engelleme olarak ayarlıysa, istek de engellenir.

## Wallarm EdgeWorker’larını yükseltme

Dağıtılan Wallarm EdgeWorker’larını [daha yeni bir sürüme](code-bundle-inventory.md#akamai) yükseltmek için:

1. `wallarm-main` için [oluşturduğunuz](#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers) EdgeWorker’a gidin.
1. **Create Version**’a basın ve yeni `wallarm-main` kod paketini yükleyin.
1. [Staging ortamında etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-stage).
1. Doğrulamanın ardından [production’da etkinleştirin](https://techdocs.akamai.com/property-mgr/docs/activate-prod).
1. Sürümü değiştiyse `wallarm-sp` kod paketi için de aynı adımları tekrarlayın.

EdgeWorker yükseltmeleri, özellikle majör sürüm güncellemelerinde, bir Wallarm node yükseltmesi gerektirebilir. Self-hosted Node sürüm notları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) bakın. Eskimeyi önlemek ve gelecekteki yükseltmeleri basitleştirmek için düzenli node güncellemeleri önerilir.