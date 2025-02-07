[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Broadcom Layer7 API Gateways

Broadcom'un [Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways), bir kuruluşun API trafiğini kontrol etmek ve güvence altına almak için sağlam bir çözüm sunar. Wallarm, Broadcom Layer7 API Gateways üzerinden yönetilen API'lerin güvenliğini artırmak için bir bağlantı noktası (connector) olarak çalışabilir.

Wallarm'ı, Broadcom Layer7 API Gateway için bir bağlantı noktası olarak kullanmak istiyorsanız, **Wallarm Node'u dışarıda dağıtmalı** ve trafiğin analiz edilmek üzere Wallarm Node'a yönlendirilmesi için ağ geçidinde Wallarm politikalarını **yapılandırmalısınız**.

Broadcom bağlantı noktası, yalnızca [in-line](../inline/overview.md) trafik akışını desteklemektedir.

<!-- The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png) -->

## Kullanım Senaryoları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, API'lerinizi Broadcom Layer7 API Gateways ile yönetiyorsanız bu çözüm tavsiye edilmektedir.

## Sınırlamalar

* Wallarm kuralı tarafından [Rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Gereksinimler

Dağıtıma devam edebilmek için, aşağıdaki gereksinimlerin karşılandığından emin olun:

* Broadcom Layer7 API Gateways ürününü anlama.
* Uygulamanız ve API'niz Broadcom Layer7 API Gateways üzerinde bağlantılı ve çalışır durumda olmalıdır.
* Broadcom Policy Manager kurulmuş ve Broadcom Gateway'e bağlı olmalıdır.

## Dağıtım

### 1. Wallarm Node'u Dağıtın

Wallarm Node, dağıtmanız gereken Wallarm platformunun temel bileşenidir. Gelen trafiği inceler, kötü amaçlı etkinlikleri tespit eder ve tehditleri azaltmak üzere yapılandırılabilir.

Bunu, kendi altyapınızda ayrı bir servis olarak aşağıdaki artifact'lardan biriyle dağıtmanız gerekmektedir:

* Linux altyapıları için bare metal veya VM'lerde [All-in-one installer](../native-node/all-in-one.md)
* Konteynerleştirilmiş dağıtımları kullanan ortamlar için [Docker image](../native-node/docker-image.md)
* Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Node'un SSL/TLS sertifikasını Policy Manager'a ekleyin

Broadcom Gateway'in HTTPS üzerinden trafiği Wallarm Node'a yönlendirebilmesi için, Node'un SSL/TLS sertifikasını Policy Manager'a ekleyin:

1. Broadcom Policy Manager'ı açın → **Tasks** → **Certificates, Keys and Secrets** → **Manage Certificates**.
1. **Add** → **Retrieve via SSL** seçeneğine tıklayın ve [Wallarm Node'un adresini](#1-deploy-a-wallarm-node) belirtin.

### 3. Wallarm politikalarını edinin ve dağıtın

Broadcom Gateway'in, trafiği Wallarm Node üzerinden yönlendirmesi için yapılandırılması adına:

1. Wallarm politika kod paketlerini almak için sales@wallarm.com ile iletişime geçin.
1. Broadcom Policy Manager'ı açın → Broadcom Gateway menünüz → **Create Policy** seçeneğini kullanarak 2 politika ekleyin:

    * **Request forwarding policy**: `Global Policy Fragment` tipi ve `message-received` etiketi atayın.

        ![](../../images/waf-installation/gateways/layer7/request-policy.png)
    
    * **Response forwarding policy**: `Global Policy Fragment` tipi ve `message-completed` etiketi atayın.
    
        ![](../../images/waf-installation/gateways/layer7/response-policy.png)
1. <a name="import-new-broadcom-policies"></a>Request forwarding policy için (`forward-requests-to-wallarm` örneğinde):

    1. `wallarm-request-blocking.xml` dosyasını içe aktarın.
    1. `wlrm-node-addr` parametresine [Wallarm Node instance](#1-deploy-a-wallarm-node) adresini belirtin.
    1. Politikayı **Save and Active** yapın.

    ![](../../images/waf-installation/gateways/layer7/request-policy-assertion.png)
1. Response forwarding policy için (`forward-responses-to-wallarm` örneğinde):

    1. `wallarm-response.xml` dosyasını içe aktarın.
    1. Politikayı **Save and Active** yapın.

## Test Etme

Dağıtılan politikanın işlevselliğini test etmek için şu adımları izleyin:

1. API gateway adresinize [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<YOUR_GATEWAY_ADDRESS>/etc/passwd
    ```
1. Wallarm Console'u açın → **Attacks** bölümüne gidin ve [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde saldırının listelendiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm Node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlıysa, istek ayrıca engellenecektir.

## Wallarm politikalarının güncellenmesi

Broadcom üzerinde dağıtılan Wallarm politikalarını [yeni bir sürüme](code-bundle-inventory.md#broadcom-layer7-api-gateway) güncellemek için:

1. Güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
1. Güncellenmiş politika dosyalarını, [dağıtım adımlarında](#import-new-broadcom-policies) açıklandığı gibi Policy Manager'da mevcut politika örneklerine içe aktarın.
1. Politika parametrelerini doğru değerlerle yapılandırın.
1. Güncellenmiş politikaları **Save and Activate** yapın.

Politika güncellemeleri, özellikle büyük sürüm güncellemelerinde, bir Wallarm Node güncellemesini de gerektirebilir. Sürüme ilişkin güncellemeler ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) belgesine bakın. Gelecekteki yükseltmeleri kolaylaştırmak ve eskimeyi önlemek için düzenli node güncellemeleri önerilmektedir.