[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# MuleSoft Flex Gateway için Wallarm Connector

Bu kılavuz, Wallarm connector kullanarak [MuleSoft Flex Gateway](https://docs.mulesoft.com/gateway/latest/) tarafından yönetilen Mule ve Mule olmayan API'larınızı nasıl güvence altına alacağınızı açıklar.

Flex Gateway için Wallarm'ı bir connector olarak kullanmak için, **Wallarm node'u harici olarak dağıtmanız** ve trafiği analiz için Wallarm node'una yönlendirmek amacıyla **MuleSoft içinde Wallarm tarafından sağlanan policy'yi uygulamanız** gerekir.

Flex Gateway için Wallarm connector, hem [eşzamanlı (in-line)](../inline/overview.md) hem de [eşzamansız (out‑of‑band)](../oob/overview.md) trafik analizini destekler:

=== "Eşzamanlı trafik akışı"
    ![Wallarm policy ile MuleSoft](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-inline.png)
=== "Eşzamansız trafik akışı"
    ![Wallarm policy ile MuleSoft](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-oob.png)

## Kullanım senaryoları

Bu çözüm, Flex Gateway tarafından yönetilen API'ların güvenliğini sağlamak için önerilen çözümdür.

## Sınırlamalar

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Gereksinimler {#requirements}

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* MuleSoft platformunu anlama.
* Uygulamanız ve API'niz Flex Gateway üzerinde ilişkilendirilmiş ve çalışır durumda.

    !!! info "Kısmi istekler notu"
        Policy engelleme [modunda](../../admin-en/configure-wallarm-mode.md) çalışan connector için, upstream'inizin kısmi istekleri güvenli şekilde işleyebildiğinden emin olun. Bunun nedeni `proxy wasm` policy'lerinin akış doğasıdır - tam doğrulama tamamlanmadan önce bazı gövde verileri upstream'e ulaşabilir. [Daha fazla bilgi](https://docs.mulesoft.com/pdk/latest/policies-pdk-configure-features-stop)
* MuleSoft kullanıcınızın MuleSoft Anypoint Platform hesabına artifact yükleme yetkisi olması.
* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** hesabına erişim.
* Ana sisteminizde yüklü [Node.js](https://nodejs.org/en/download) 16.0.0+ ve `npm` 7+.
* Ana sisteminizde yüklü [`make`](https://formulae.brew.sh/formula/make).
* Ana sisteminizde yüklü [Anypoint CLI 4.x](https://docs.mulesoft.com/anypoint-cli/latest/install).
* Ana sisteminizde yüklü [PDK CLI ön koşulları](https://docs.mulesoft.com/pdk/latest/policies-pdk-prerequisites).
* Ana sisteminizde yüklü ve çalışan [Docker](https://docs.docker.com/engine/install/).
* Native Node [0.16.0 veya üzeri](../../updating-migrating/native-node/node-artifact-versions.md).

## Dağıtım

### 1. Bir Wallarm node dağıtın {#1-deploy-a-wallarm-node}

Wallarm node, dağıtmanız gereken Wallarm platformunun temel bileşenidir. Gelen trafiği inceler, kötü amaçlı etkinlikleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Flex Gateway connector için node'u yalnızca kendi altyapınızda dağıtabilirsiniz. 

Kendi kendine barındırılan node dağıtımı için bir yapıt seçin ve ekli talimatları izleyin:

* Bare metal veya VM'lerde Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
* Container tabanlı dağıtımları kullanan ortamlar için [Docker image](../native-node/docker-image.md)
* Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

!!! info "Gerekli Node sürümü"
    Lütfen MuleSoft Flex Gateway connector'ünün yalnızca Native Node'un [0.16.0+ sürümü](../../updating-migrating/native-node/node-artifact-versions.md) tarafından desteklendiğini unutmayın.

### 2. Wallarm policy'sini MuleSoft Exchange'e edinin ve yükleyin {#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange}

Wallarm policy'sini edinmek ve MuleSoft Exchange'e yüklemek için şu adımları izleyin:

1. Kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. Policy'yi yayınlamak için kullanacağınız makinenin [gerekli tüm gereksinimleri](#requirements) karşıladığından emin olun.
1. Policy arşivini çıkarın.
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → kuruluşunuzu seçin → **business group ID** değerini kopyalayın.
1. Çıkardığınız policy dizininde → `Cargo.toml` → `[package.metadata.anypoint]` → `group_id` alanına kopyaladığınız grup ID'sini girin:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. Policy ile çalıştığınız aynı terminal oturumunda [Anypoint CLI ile kimlik doğrulayın](https://docs.mulesoft.com/anypoint-cli/latest/auth):

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. Policy'yi derleyin ve yayınlayın:

    ```bash
    make setup      # Bağımlılıkları ve PDK CLI'yi kurar
    make build      # Policy'yi derler
    make release    # Policy'nin yeni üretim sürümünü Anypoint'e yayınlar
    # veya
    # make publish  # Policy'nin bir geliştirme sürümünü Anypoint'e yayınlar
    ```

Özel policy'niz artık MuleSoft Anypoint Platform Exchange'de kullanılabilir.

![Wallarm policy ile MuleSoft](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Wallarm policy'sini API'nize ekleyin

Wallarm policy'yi tek bir API'ya veya tüm API'lara ekleyebilirsiniz.

1. Policy'yi tek bir API'ya uygulamak için Anypoint Platform → **API Manager** → istenen API'yı seçin → **Policies** → **Add policy** yolunu izleyin.
1. Policy'yi tüm API'lara uygulamak için Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy** yolunu izleyin.
1. Exchange'den Wallarm policy'yi seçin.
1. `wallarm_node` parametresinde `http://` veya `https://` dahil Wallarm node URL'sini belirtin.
1. Gerekirse, [diğer parametreleri](#configuration-options) değiştirin.
1. Policy'yi uygulayın.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup-flex.png)

## Yapılandırma seçenekleri {#configuration-options}

Flex Gateway için Wallarm policy ayarlarında aşağıdaki parametreleri belirtebilirsiniz:

| Parametre | Açıklama | Gerekli mi? |
| --------- | ----------- | --------- |
| `wallarm_node` | [Wallarm Node örneğinizin](#1-deploy-a-wallarm-node) adresini ayarlar. | Evet |
| `real_ip_header` | Proxy veya yük dengeleyici arkasındayken orijinal istemci IP adresini belirlemek için hangi başlığın kullanılacağını belirtir. Varsayılan: `X-Forwarded-For`. | Evet |
| `wallarm_mode` | Trafik işleme modunu belirler: `sync`, trafiği doğrudan Wallarm Node üzerinden işler, `async` ise trafiğin [kopyasını](../oob/overview.md) orijinal akışı etkilemeden analiz eder. Varsayılan: `sync`. | Evet |
| `fallback_action` | Wallarm node kapalıyken istek işleme davranışını tanımlar. `pass` (tüm istekler geçirilir) veya `block` (tüm istekler 403 kodu ile engellenir) olabilir. Varsayılan: `pass`. | Evet |
| `parse_responses` | Yanıt gövdelerinin analiz edilip edilmeyeceğini kontrol eder. Yanıt şeması keşfini ve gelişmiş saldırı ve zafiyet tespit yeteneklerini etkinleştirir. Varsayılan: `true`. | Evet |
| `response_body_limit` | Wallarm node'una gönderilen yanıt gövdesinin boyutunu sınırlar. Varsayılan: `4096` bayt. | Hayır |

## Test

Dağıtılan policy'nin işlevselliğini test etmek için şu adımları izleyin:

1. API'nize test amaçlı [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki **Attacks** bölümünü açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzde Attacks][attacks-in-ui-image]

    Wallarm node modu [engelleme](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmışsa ve trafik in-line akıyorsa, istek de engellenecektir.

## Sorun giderme

Çözüm beklenildiği gibi çalışmıyorsa, MuleSoft Anypoint Platform → **Runtime Manager** → uygulamanız → **Logs** yolunu izleyerek API'nizin günlüklerine bakın.

Ayrıca **API Manager** içinde API'nize gidip **Policies** sekmesinde uygulanan policy'leri inceleyerek policy'nin API'ya uygulanıp uygulanmadığını doğrulayabilirsiniz. Otomatik policy'ler için, kapsanan API'ları ve hariç tutulma nedenlerini görmek amacıyla **See covered APIs** seçeneğini kullanabilirsiniz.

## Policy'yi yükseltme

Dağıtılmış Wallarm policy'yi [daha yeni bir sürüme](code-bundle-inventory.md#mulesoft-flex-gateway) yükseltmek için:

1. Güncellenmiş Wallarm policy'yi indirin ve [Adım 2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)'de açıklandığı gibi MuleSoft Exchange'e yükleyin.
1. Yeni sürüm Exchange'de göründüğünde, **API Manager** → API'niz → **Policies** → Wallarm policy → **Edit configuration** → **Advanced options** yolunu izleyin ve açılır menüden yeni policy sürümünü seçin.
1. Yeni sürüm ek parametreler getiriyorsa, gerekli değerleri sağlayın.
1. Değişiklikleri kaydedin.

Wallarm policy otomatik policy olarak uygulanıyorsa, doğrudan yükseltmeler mümkün olmayabilir. Bu gibi durumlarda mevcut policy'yi kaldırın ve yeni sürümü manuel olarak yeniden uygulayın.

Policy yükseltmeleri, özellikle büyük sürüm güncellemeleri için bir Wallarm node yükseltmesi gerektirebilir. Kendi kendine barındırılan Node sürüm notları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) bakın. Gelecekteki yükseltmeleri basitleştirmek ve kullanımdan kaldırmayı önlemek için düzenli node güncellemeleri önerilir.

## Policy'yi kaldırma

Wallarm policy'yi kaldırmak için, otomatik policy listesinde veya tek bir API'ya uygulanmış policy'lerin listesinde **Remove policy** seçeneğini kullanın.