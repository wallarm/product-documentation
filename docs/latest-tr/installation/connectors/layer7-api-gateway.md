[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Broadcom Layer7 API Gateways

Broadcom'un [Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways) ürünleri, bir kuruluşun API trafiğini kontrol etmek ve güvence altına almak için sağlam bir çözüm sunar. Wallarm, Broadcom Layer7 API Gateways üzerinden yönetilen API'lerin güvenliğini artırmak için bir bağlayıcı (connector) olarak çalışabilir.

Wallarm'ı Broadcom Layer7 API Gateway için bir bağlayıcı olarak kullanmak üzere, **Wallarm Node'u harici olarak dağıtmanız** ve trafiği analiz için Wallarm Node'a yönlendirmek amacıyla **ağ geçidi üzerinde Wallarm politikalarını yapılandırmanız** gerekir.

Broadcom bağlayıcısı yalnızca [hat içi](../inline/overview.md) trafik akışını destekler.

<!-- The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png) -->

## Kullanım senaryoları

API'lerinizi Layer7 API Gateways ile yönettiğiniz durumlarda bu çözüm önerilir.

## Sınırlamalar

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Broadcom Layer7 API Gateways ürünü hakkında bilgi sahibi olmak.
* Uygulamanız ve API'niz Broadcom Layer7 API Gateways üzerinde bağlı ve çalışır durumda olmalıdır.
* Broadcom Policy Manager kurulu ve Broadcom Gateway'e bağlı olmalı.

## Dağıtım

<a name="1-deploy-a-wallarm-node"></a>
### 1. Bir Wallarm Node dağıtın

Wallarm Node, dağıtmanız gereken Wallarm platformunun temel bir bileşenidir. Gelen trafiği inceler, kötü niyetli etkinlikleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

Aşağıdaki artifaktlardan birini kullanarak kendi altyapınızda ayrı bir servis olarak dağıtmanız gerekir:

* Bare metal veya VM'lerdeki Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
* Konteynerize dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
* AWS altyapıları için [AWS AMI](../native-node/aws-ami.md)
* Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Node'un SSL/TLS sertifikasını Policy Manager'a ekleyin

Broadcom Gateway'in trafiği HTTPS üzerinden Wallarm Node'a yönlendirebilmesi için, Node'un SSL/TLS sertifikasını Policy Manager'a ekleyin:

1. Broadcom Policy Manager'ı açın → **Tasks** → **Certificates, Keys and Secrets** → **Manage Certificates**.
1. **Add** → **Retrieve via SSL**'e tıklayın ve [Wallarm Node'un adresini](#1-deploy-a-wallarm-node) belirtin.

### 3. Wallarm politikalarını edinin ve dağıtın

Broadcom Gateway'in trafiği Wallarm Node üzerinden yönlendirmesi için yapılandırmak üzere:

1. Wallarm politika kod paketlerini almak için sales@wallarm.com ile iletişime geçin.
1. Broadcom Policy Manager'ı açın → Broadcom Gateway'inizin menüsü → **Create Policy** ve 2 politika ekleyin:

    * **İstek iletme politikası**: `Global Policy Fragment` türünü ve `message-received` etiketini atayın.

        ![](../../images/waf-installation/gateways/layer7/request-policy.png)
    
    * **Yanıt iletme politikası**: `Global Policy Fragment` türünü ve `message-completed` etiketini atayın.
    
        ![](../../images/waf-installation/gateways/layer7/response-policy.png)
1. <a name="import-new-broadcom-policies"></a>İstek iletme politikası için (bu örnekte `forward-requests-to-wallarm`):

    1. `wallarm-request-blocking.xml` dosyasını içe aktarın.
    1. `wlrm-node-addr` parametresinde [Wallarm Node örneğinin](#1-deploy-a-wallarm-node) adresini belirtin.
    1. Politikayı **Save and Active** edin.

    ![](../../images/waf-installation/gateways/layer7/request-policy-assertion.png)
1. Yanıt iletme politikası için (bu örnekte `forward-responses-to-wallarm`):

    1. `wallarm-response.xml` dosyasını içe aktarın.
    1. Politikayı **Save and Active** edin.

## Test

Dağıtılan politikanın işlevselliğini test etmek için şu adımları izleyin:

1. Gateway adresinize test [Dizin Geçişi][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<YOUR_GATEWAY_ADDRESS>/etc/passwd
    ```
1. Wallarm Console'u açın → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki Attacks bölümüne gidin ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzdeki Attacks][attacks-in-ui-image]

    Wallarm Node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmışsa, istek ayrıca engellenecektir.

## Wallarm politikalarını yükseltme

Broadcom üzerinde dağıtılmış Wallarm politikalarını [daha yeni bir sürüme](code-bundle-inventory.md#broadcom-layer7-api-gateway) yükseltmek için:

1. Güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. [Dağıtım adımlarında](#import-new-broadcom-policies) açıklandığı gibi, güncellenmiş politika dosyalarını Policy Manager'daki mevcut politika örneklerine içe aktarın.
1. Politika parametrelerini doğru değerlerle yapılandırın.
1. Güncellenmiş politikaları **Save and Activate** edin.

Politika yükseltmeleri, özellikle büyük sürüm güncellemelerinde, Wallarm Node yükseltmesi gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) bakın. Eskimeyi önlemek ve gelecekteki yükseltmeleri basitleştirmek için düzenli node güncellemeleri önerilir.