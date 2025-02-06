[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [yüklenen API specification](overview.md) dosyanıza dayalı API korumanızı nasıl etkinleştireceğinizi ve yapılandıracağınızı açıklar.

## Adım 1: Specification Yükleme

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/) veya [EU Cloud](https://my.wallarm.com/api-specifications/) üzerindeki **API Specifications** bölümünde **Upload specification** düğmesine tıklayın.
1. Specification yükleme parametrelerini ayarlayın ve yüklemeyi başlatın.

    ![Upload specification](../images/api-specification-enforcement/specificaton-upload.png)

Specification dosyası başarıyla yüklenene kadar API specification enforcement yapılandırmasına başlayamayacağınızı unutmayın.

## Adım 2: Politika İhlallerinde Alınacak Aksiyonları Belirleme

1. **API specification enforcement** sekmesine tıklayın.

    !!! info "Rogue API detection"
        * Güvenlik politikalarını uygulamanın yanı sıra, specification'lar [API Discovery](../api-discovery/overview.md) modülü tarafından [rogue API detection](../api-discovery/rogue-api.md) için de kullanılabilir. API Discovery etkinse bu sekme görüntülenir.
        * Specification'ı güvenlik politikalarını uygulamak için kullanmadan önce, API Discovery ile rogue (gölge, zombi ve yetimsiz) API'leri aramak için kullanmanız tavsiye edilir. Böylece specification'ınızın müşterilerinizin asıl isteklerinden ne kadar farklı olduğunu anlayabilir; bu farklılıklar, güvenlik politikaları uygulandıktan sonra ilgili isteklerin engellenmesine yol açabilir.

1. **Use for API specification enforcement** seçeneğini seçin.
1. Politika ihlali aksiyonlarını etkinleştirmek istediğiniz host veya endpoint'i belirtin.

    * Yüklenen specification'ın uygulanacağı endpoint'leri yanlış belirtirseniz, birçok [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) olayı ortaya çıkabilir.
    * Aynı host için birden fazla specification'a sahipseniz, ancak bunlar farklı endpoint'ler için geçerliyse (örneğin `domain.com/v1/api/users/` ve `domain.com/v1/api/orders/`), specification'ın hangi endpointlere uygulanacağını **belirtmeniz gerekmektedir**.
    * Bir host'a bir specification ekleyip sonra bu host'un belirli endpointlerine ayrı bir specification eklediğinizde, her iki specification da bu endpointlere uygulanacaktır.
    * Bu değer, [URI constructor](../user-guides/rules/rules.md#uri-constructor) veya [advanced edit form](../user-guides/rules/rules.md#advanced-edit-form) aracılığıyla yapılandırılabilir.

1. İstekler specification'ınızı ihlal ederse sistemin nasıl tepki vereceğini ayarlayın.

    ![Specification - use for applying security policies](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    Olası ihlallerle ilgili ayrıntılar:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

Specification'ı ilk kez güvenlik politikaları belirlemek için kullanırken, specification'ın gerekli endpointlerde uygulandığından ve gerçek hataları tespit ettiğinden emin olmak için tepki olarak `Monitor` seçeneğinin ayarlanması tavsiye edilir.

## Devre Dışı Bırakma

API Specification Enforcement, **Use for API specification enforcement** seçeneği etkin olan yüklenen veya birden fazla specification'a dayanmaktadır. Bu seçeneğin bazı specification'lar için kaldırılması veya bir specification'ın silinmesi, bu specification'a dayalı korumanın sonlandırılmasına yol açar.

Ayrıca, API Specification Enforcement işlevselliğini API'nizin sadece belirli bölümleri için devre dışı bırakmanız gerektiğinde şu yöntemlerden yararlanabilirsiniz:

* [all-in-one installer](../installation/nginx/all-in-one.md) dağıtımları için, API Specification Enforcement'ın [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX yönergesinin `off` olarak ayarlandığı herhangi bir `server` bölümünde.
* NGINX tabanlı Docker görüntüsü için, `WALLARM_APIFW_ENABLE` [environment variable](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) değerinin `false` olarak ayarlanması.
* NGINX Ingress Controller için, `enable` değeri `false` olarak ayarlanmış [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) değerler grubunun kullanılması.