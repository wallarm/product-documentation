[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Kurulumu <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [yüklediğiniz API spesifikasyonuna](overview.md) dayalı API korumanızı nasıl etkinleştireceğinizi ve yapılandıracağınızı açıklar.

## Adım 1: Spesifikasyonu yükleyin

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/) veya [EU Cloud](https://my.wallarm.com/api-specifications/) içindeki **API Specifications** bölümünde **Upload specification** öğesine tıklayın.
1. Spesifikasyon yükleme parametrelerini belirleyin ve yüklemeyi başlatın.

    ![Spesifikasyon yükleme](../images/api-specification-enforcement/specificaton-upload.png)

Spesifikasyon dosyası, API spesifikasyonu sözdizimine uygunluk açısından kontrol edilir; geçerli değilse yüklenmez. Spesifikasyon dosyası başarıyla yüklenene kadar API specification enforcement yapılandırmasını başlatamayacağınızı unutmayın.

Spesifikasyonu bir URI’den yüklemeyi ve **Regularly update the specification** (saatte bir) seçeneğini seçerseniz, düzenli güncelleme sırasında hatalar olabilir: URI kullanılamaz olabilir veya güncellenen spesifikasyon dosyası API spesifikasyonu sözdizimine uymayabilir. Bu tür hatalara ilişkin bildirimler almak için, yapılandırdığınız [**Integrations**](../user-guides/settings/integrations/integrations-intro.md) içinde **System related** olaylarını seçin—spesifikasyon yükleme hatalarıyla ilgili bildirimler bu kategoriye dahildir.

## Adım 2: İlkeler ihlalleri için eylemleri belirleyin

1. **API specification enforcement** sekmesine tıklayın.

    !!! info "Rogue API tespiti"
        * Güvenlik politikalarını uygulamanın yanı sıra, spesifikasyonlar [API Discovery](../api-discovery/overview.md) modülü tarafından [rogue API tespiti](../api-discovery/rogue-api.md) için de kullanılabilir. API Discovery etkinse sekme görüntülenir.
        * Spesifikasyonu güvenlik politikalarını uygulamak için kullanmadan önce, API Discovery kullanarak rogue (gölge, zombi ve yetim) API’leri aramak için kullanmanız önerilir. Bu şekilde, spesifikasyonunuzun istemcilerinizin gerçek isteklerinden ne kadar farklı olduğunu anlayabilirsiniz—bu farklar, güvenlik politikaları uygulandıktan sonra ilgili isteklerin engellenmesine büyük olasılıkla neden olacaktır.

1. **Use for API specification enforcement** seçeneğini belirleyin.
1. İlke ihlali eylemlerini etkinleştirmek istediğiniz host veya endpoint’i belirtin.

    * Yüklenen spesifikasyonun hangi endpoint’lere uygulanacağını yanlış belirtirseniz, çok sayıda [yanlış pozitif](../about-wallarm/protecting-against-attacks.md#false-positives) olay oluşacaktır.
    * Aynı host’a uygulanan ancak farklı endpoint’lere ait birden fazla spesifikasyonunuz varsa (örneğin `domain.com/v1/api/users/` ve `domain.com/v1/api/orders/`), spesifikasyonun hangi endpoint’lere uygulanması gerektiğini belirtmeniz **zorunludur**.
    * Bir host’a bir spesifikasyon ekleyip ardından bu host’un belirli endpoint’lerine başka bir spesifikasyon eklerseniz, her iki spesifikasyon da bu endpoint’lere uygulanacaktır.
    * Değer, [URI constructor](../user-guides/rules/rules.md#uri-constructor) veya [advanced edit form](../user-guides/rules/rules.md#advanced-edit-form) üzerinden yapılandırılabilir.

1. İstekler spesifikasyonunuzu ihlal ederse sistemin nasıl tepki vereceğini ayarlayın.

    ![Spesifikasyon - güvenlik politikalarını uygulamak için kullanım](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    Olası ihlallerle ilgili ayrıntılar:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    Spesifikasyonu güvenlik politikalarını ayarlamak için ilk kez kullanırken, spesifikasyonun gerekli endpoint’lere uygulandığından ve gerçek hataları tespit ettiğinden emin olmak için tepki olarak `Monitor` ayarlanması önerilir.

## Devre dışı bırakma

API Specification Enforcement’ın çalışması, yüklenmiş ve her biri için **Use for API specification enforcement** seçeneği işaretli bir veya birden fazla spesifikasyona dayanır. Bu seçeneğin bazı spesifikasyonlar için işaretinin kaldırılmasının veya bu spesifikasyonun silinmesinin, o spesifikasyona dayalı korumayı durduracağını dikkate alın.

Ayrıca, bazı durumlarda API Specification Enforcement işlevselliğini API’nizin yalnızca bazı bölümleri için devre dışı bırakmanız gerekebilir. Bu şu şekilde yapılabilir:

* [all-in-one installer](../installation/nginx/all-in-one.md) kurulumları için, API Specification Enforcement kullanılan herhangi bir `server` bölümünde [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX yönergesini `off` olarak ayarlayarak.
* NGINX tabanlı Docker imajı için, `WALLARM_APIFW_ENABLE` [ortam değişkenini](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `false` olarak ayarlayarak.
* NGINX Ingress Controller için, [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) değer grubunda `enable` değerini `false` olarak ayarlayarak.