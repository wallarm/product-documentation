[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# Helm Chart ile Native Node Dağıtımı

NGINX’ten bağımsız çalışan [Wallarm Native Node](../nginx-native-node-internals.md), bazı konektörlerle dağıtım için tasarlanmıştır. Helm chart kullanarak Native Node’u Kubernetes kümenizde ayrı bir servis olarak veya bir yük dengeleyici olarak çalıştırabilirsiniz.

## Kullanım senaryoları

Aşağıdaki durumlarda Native Node’u Helm chart ile dağıtın:

* MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) için bir Wallarm konektörü dağıtıyor ve node’un self-hosted olmasını istiyorsanız. Bu, OpenShift, Amazon EKS, Azure AKS veya Google GKE gibi Kubernetes yönetim platformlarını zaten kullanıyorsanız idealdir. Trafik yönlendirmesini kolaylaştırmak için node, genel bir IP’ye sahip bir yük dengeleyici olarak yapılandırılır.

    Node’u `connector-server` modunda kullanın.
* Istio tarafından yönetilen API’ler için satır içi [gRPC tabanlı external processing filter](../connectors/istio.md) gerektiğinde. Trafik yönlendirmesini kolaylaştırmak için node, genel bir IP’ye sahip bir yük dengeleyici olarak yapılandırılır.
    
    Node’u `envoy-external-filter` modunda kullanın.
* [Kong API Gateway](../connectors/kong-api-gateway.md) için bir Wallarm konektörü dağıttığınızda. Node, genel bir IP açığa çıkarmadan dahili trafik için ClusterIP türüyle dağıtılır.
    
    Node’u `connector-server` modunda kullanın.

## Gereksinimler

Native Node’u Helm chart ile dağıtmak için Kubernetes kümeniz aşağıdaki kriterleri karşılamalıdır:

* [Helm v3](https://helm.sh/) paket yöneticisi kurulu.
* API’lerinizin çalıştığı API gateway veya CDN’den gelen inbound erişim.
* Şuralara outbound erişim:

    * Wallarm Helm chart’ını indirmek için `https://charts.wallarm.com`
    * Dağıtım için gerekli Docker imajlarını indirmek için `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kurallarına ve [API spesifikasyonlarına][api-spec-enforcement-docs] güncellemeleri indirmek ve [allowlist, denylist veya graylist][ip-list-docs] içindeki ülke, bölge veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* `LoadBalancer` türüyle dağıtım yapıyorsanız bir alan adı ve güvenilir bir SSL/TLS sertifikası gerekir.
* Bunlara ek olarak, Wallarm Console içinde size **Administrator** rolü atanmış olmalıdır.

## Sınırlamalar

* Wallarm servisini `LoadBalancer` türüyle dağıtırken, Node örneğinin alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Self-signed sertifikalar henüz desteklenmemektedir.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmiyor.
* Wallarm kuralı ile [rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmiyor.
* [Çok kiracılı yapı](../multi-tenant/overview.md) henüz desteklenmiyor.

## Dağıtım

### 1. Wallarm token’ını hazırlayın

Node’u kurmak için, node’u Wallarm Cloud’a kaydetmek üzere bir token gerekir. Token hazırlamak için:

1. Wallarm Console → Settings → API tokens’ı [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
1. `Node deployment/Deployment` kullanım türüne sahip bir API token bulun veya oluşturun.
1. Bu token’ı kopyalayın.

### 2. Wallarm Helm chart deposunu ekleyin

```
helm repo add wallarm https://charts.wallarm.com
helm repo update wallarm
```

### 3. Yapılandırma dosyasını hazırlayın

=== "LoadBalancer (connector-server)"
    Genel bir IP ile Native Wallarm node’unu bir LoadBalancer olarak dağıtmak, MuleSoft, Cloudflare, Amazon CloudFront, Broadcom Layer7 API Gateway, Fastly’den bu IP’ye trafiği güvenlik analizi ve filtreleme için yönlendirmenize olanak tanır.

    1. Yük dengeleyici için bir alan adı kaydedin.
    1. **Güvenilir** bir SSL/TLS sertifikası edinin.
    1. Aşağıdaki asgari yapılandırma ile `values.yaml` yapılandırma dosyasını oluşturun. Sertifikayı uygulamak için tercih ettiğiniz yöntemin sekmesini seçin:
    
        === "cert-manager"
            Kümemizde [`cert-manager`](https://cert-manager.io/) kullanıyorsanız, SSL/TLS sertifikasını onunla üretebilirsiniz.

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # cert-manager Issuer veya ClusterIssuer adının belirtilmesi
                      name: letsencrypt-prod
                      # Issuer (namespace kapsamlı) mı yoksa ClusterIssuer (küme genelinde) mı olduğunu belirtir
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            Aynı ad alanındaki mevcut bir Kubernetes secret’ından SSL/TLS sertifikasını çekebilirsiniz.

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # Sertifika ve özel anahtarı içeren Kubernetes secret’ının adı
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret` yapılandırması, bir sertifikayı doğrudan base64 ile kodlanmış değerler olarak tanımlamanıza olanak tanır.

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64 ile kodlanmış CA
                    crt: LS0... # Base64 ile kodlanmış sertifika
                    key: LS0... # Base64 ile kodlanmış özel anahtar
            processing:
              service:
                type: LoadBalancer
            ```
=== "LoadBalancer (envoy-external-filter)"
    Genel bir IP ile Native Wallarm node’unu bir LoadBalancer olarak dağıtmak, MuleSoft, Cloudflare, Amazon CloudFront, Broadcom Layer7 API Gateway, Fastly’den bu IP’ye trafiği güvenlik analizi ve filtreleme için yönlendirmenize olanak tanır.

    1. Yük dengeleyici için bir alan adı kaydedin.
    1. **Güvenilir** bir SSL/TLS sertifikası edinin.
    1. Aşağıdaki asgari yapılandırma ile `values.yaml` yapılandırma dosyasını oluşturun. Sertifikayı uygulamak için tercih ettiğiniz yöntemin sekmesini seçin:
    
        === "cert-manager"
            Kümemizde [`cert-manager`](https://cert-manager.io/) kullanıyorsanız, SSL/TLS sertifikasını onunla üretebilirsiniz.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # cert-manager Issuer veya ClusterIssuer adının belirtilmesi
                      name: letsencrypt-prod
                      # Issuer (namespace kapsamlı) mı yoksa ClusterIssuer (küme genelinde) mı olduğunu belirtir
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            Aynı ad alanındaki mevcut bir Kubernetes secret’ından SSL/TLS sertifikasını çekebilirsiniz.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # Sertifika ve özel anahtarı içeren Kubernetes secret’ının adı
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret` yapılandırması, bir sertifikayı doğrudan base64 ile kodlanmış değerler olarak tanımlamanıza olanak tanır.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64 ile kodlanmış CA
                    crt: LS0... # Base64 ile kodlanmış sertifika
                    key: LS0... # Base64 ile kodlanmış özel anahtar
            processing:
              service:
                type: LoadBalancer
            ```
=== "ClusterIP"
    Wallarm’ı Kong API Gateway veya Istio için bir konektör olarak dağıtırken, bu konektör için Native Node’u genel bir IP açığa çıkarmadan, dahili trafik için ClusterIP türüyle dağıtırsınız.

    Aşağıdaki asgari yapılandırma ile `values.yaml` yapılandırma dosyasını oluşturun:

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```

[Tüm yapılandırma parametreleri](helm-chart-conf.md)

### 4. Wallarm servisini dağıtın

=== "US Cloud"
    ```
    helm upgrade --install --version 0.17.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.17.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Wallarm yük dengeleyicisini alın

`LoadBalancer` türüyle dağıtıyorsanız:

1. Wallarm yük dengeleyicisinin dış IP’sini alın:

    ```
    kubectl get svc -n wallarm-node
    ```

    `native-processing` servisi için dış IP’yi bulun.
1. Alan adınızı dış IP’ye yönlendirecek şekilde DNS sağlayıcınızda bir A kaydı oluşturun.

    DNS yayıldıktan sonra servise alan adı üzerinden erişebilirsiniz.

### 6. Wallarm kodunu bir API yönetim servisine uygulayın

Node’u dağıttıktan sonra, trafiği dağıtılmış node’a yönlendirmek için Wallarm kodunu API yönetim platformunuza veya servisinize uygulamanız gerekir.

1. Konektörünüz için Wallarm kod paketini edinmek üzere sales@wallarm.com ile iletişime geçin.
1. Paketi API yönetim platformunuza uygulamak için platforma özel talimatları izleyin:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio](../connectors/istio.md)

## Yükseltme

Node’u yükseltmek için [talimatları](../../updating-migrating/native-node/helm-chart.md) izleyin.