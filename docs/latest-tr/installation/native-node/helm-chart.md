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

[Wallarm Native Node](../nginx-native-node-internals.md), NGINX'den bağımsız olarak çalışacak şekilde tasarlanmış olup bazı bağlayıcılarla dağıtım için öngörülmüştür. Native Node'u, Helm chart kullanarak Kubernetes kümeniz içerisinde ayrı bir servis olarak veya bir yük dengeleyici olarak çalıştırabilirsiniz.

## Kullanım Durumları

Aşağıdaki durumlarda Helm chart ile Native Node dağıtın:

* [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) için Wallarm bağlayıcısını dağıttığınız ve node'un self-hosted olmasını istediğiniz durumlarda. Bu, OpenShift, Amazon EKS, Azure AKS veya Google GKE gibi Kubernetes yönetim platformlarını zaten kullanıyorsanız idealdir. Node, trafik yönlendirmesini kolaylaştırmak için halka açık IP ile bir yük dengeleyici olarak yapılandırılmıştır.
* [Kong API Gateway](../connectors/kong-api-gateway.md) veya [Istio](../connectors/istio.md) için Wallarm bağlayıcısını dağıttığınız durumlarda. Node, halka açık IP açığa çıkarmadan, dahili trafik için ClusterIP tipiyle dağıtılır.

## Gereksinimler

Native Node'u Helm chart ile dağıtmak için Kubernetes kümenizin aşağıdaki kriterleri karşılaması gerekmektedir:

* [Helm v3](https://helm.sh/) paket yöneticisinin kurulmuş olması.
* API'lerinizin çalıştığı API geçidi veya CDN'den gelen erişime izin verilmiş olması.
* Aşağıdakilere giden dış erişim:
  
    * Wallarm Helm chart'ını indirmek için `https://charts.wallarm.com`
    * Dağıtım için gerekli Docker imajlarını indirmek için `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kurallarının güncellemelerini ve [API specification][api-spec-enforcement-docs] indirmek, ayrıca [izin verilen, reddedilen veya gri listeye alınan][ip-list-docs] ülke, bölge veya veri merkezleri için kesin IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* `LoadBalancer` tipiyle dağıtım yapıyorsanız, bir alan adı ve güvenilir SSL/TLS sertifikasına sahip olmanız gerekmektedir.
* Yukarıdakilere ek olarak, Wallarm Console'da **Administrator** rolünün atanmış olması gerekmektedir.

## Sınırlamalar

* Wallarm servisini `LoadBalancer` tipiyle dağıtırken, alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Self-signed sertifikalar henüz desteklenmemektedir.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.
* Wallarm kuralı tarafından [rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Dağıtım

### 1. Wallarm Token'ınızı Hazırlayın

Node'u yüklemek için, Wallarm Cloud'da node kaydı yapabilmeniz için bir tokena ihtiyacınız olacaktır. Token hazırlamak için:

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içerisindeki Wallarm Console → **Settings** → **API tokens** bölümünü açın.
2. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
3. Bu token'ı kopyalayın.

### 2. Wallarm Helm Chart Deposunu Ekleyin

```
helm repo add wallarm https://charts.wallarm.com
helm repo update wallarm
```

### 3. Konfigürasyon Dosyasını Hazırlayın

=== "LoadBalancer"
    Halka açık IP ile LoadBalancer olarak yerleştirilen native Wallarm node, MuleSoft, Cloudflare, Amazon CloudFront, Broadcom Layer7 API Gateway ve Fastly'den gelen trafiği güvenlik analizi ve filtreleme amacıyla bu IP'ye yönlendirmenize olanak tanır.

    1. Yük dengeleyici için bir alan adı kaydedin.
    1. **Güvenilir** bir SSL/TLS sertifikası edinin.
    1. Aşağıdaki minimal konfigürasyon ile `values.yaml` dosyasını oluşturun. Sertifikayı uygulamak için tercih ettiğiniz yöntemi gösteren sekmeye geçin:
    
        === "cert-manager"
            Cluster'ınızda [`cert-manager`](https://cert-manager.io/) kullanıyorsanız, bununla SSL/TLS sertifikasını oluşturabilirsiniz.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # The name of the cert-manager Issuer or ClusterIssuer
                      name: letsencrypt-prod
                      # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            Aynı namespace içerisindeki mevcut Kubernetes secret'tan SSL/TLS sertifikasını alabilirsiniz.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # The name of the Kubernetes secret containing the certificate and private key
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret` konfigürasyonu ile sertifikayı doğrudan base64 kodlanmış değerler olarak tanımlayabilirsiniz.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64-encoded CA
                    crt: LS0... # Base64-encoded certificate
                    key: LS0... # Base64-encoded private key
            processing:
              service:
                type: LoadBalancer
            ```
=== "ClusterIP"
    Wallarm'i Kong API Gateway veya Istio bağlayıcısı olarak dağıtırken, bu bağlayıcı için Native Node'u, halka açık IP açığa çıkarmadan dahili trafik için ClusterIP tipiyle dağıtırsınız.

    Aşağıdaki minimal konfigürasyon ile `values.yaml` dosyasını oluşturun:

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```

[All configuration parameters](helm-chart-conf.md)

### 4. Wallarm Servisini Dağıtın

=== "US Cloud"
    ```
    helm upgrade --install --version 0.11.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.11.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Wallarm Load Balancer'ı Alın

Eğer `LoadBalancer` tipiyle dağıtım yapıyorsanız:

1. Wallarm load balancer için dış IP'yi alın:

    ```
    kubectl get svc -n wallarm-node
    ```

    `native-processing` servisi için dış IP'yi bulun.
1. DNS sağlayıcınızda, alan adınızı bu dış IP'ye işaret eden bir A kaydı oluşturun.

    DNS yayılımı tamamlandıktan sonra, servise alan adı üzerinden erişebilirsiniz.

### 6. Wallarm Kodunu Bir API Yönetim Servisine Uygulayın

Node dağıtıldıktan sonra, bir sonraki adım dağıtılan node'a trafiği yönlendirmek amacıyla Wallarm kodunu API yönetim platformunuza veya servisinize uygulamaktır.

1. Bağlayıcınız için Wallarm kod paketini almak üzere sales@wallarm.com ile iletişime geçin.
1. Paketi API yönetim platformunuza uygulamak için platforma özgü talimatları izleyin:

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio](../connectors/istio.md#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)

## Yükseltme

Node'u yükseltmek için, [talimatları](../../updating-migrating/native-node/helm-chart.md) izleyin.