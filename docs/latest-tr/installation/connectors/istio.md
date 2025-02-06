[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Wallarm Connector for Istio Ingress

Wallarm, Istio tarafından yönetilen API'leri güvence altına almak ve trafiği [out-of-band (OOB)](../oob/overview.md) analiz etmek için bir connector sağlar. Wallarm node'larını, [Istio'nun](https://istio.io/) Envoy proxy'leri ile birlikte dağıtarak, connector gelen trafiği aynalar; analiz için asenkron olarak gönderirken, trafiğin kesintisiz akmasına izin verir.

Entegrasyon, Envoy proxy içerisinde dağıtılan ve trafik aynalama ile Wallarm node ile iletişimi sağlayan bir Lua eklentisine dayanır.

![Istio with Wallarm plugin](../../images/waf-installation/gateways/istio/traffic-flow-oob.png)

## Use cases

Gerçek zamanlı trafik analizinin gerekli olmadığı, asenkron analizin yeterli olduğu durumlarda bu çözüm tavsiye edilir.

Desteklenen tüm [Wallarm deployment options](../supported-deployment-options.md) arasında, Kubernetes'te Envoy proxy ile çalışan Istio tarafından yönetilen API'leri güvence altına almak için en optimal seçenektir.

## Limitations

Bu yapılandırma, Wallarm'ı yalnızca Wallarm Console UI aracılığıyla ince ayarlamanıza imkan tanır. Dosya tabanlı yapılandırma gerektiren bazı Wallarm özellikleri bu uygulamada desteklenmemektedir, örneğin:

* [Multitenancy feature][multitenancy-overview]
* [Application configuration][applications-docs]
* [Custom blocking page and code setup][custom-blocking-page-docs]

## Requirements

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Kubernetes kümenizde API trafiğini yöneten Istio ve Envoy proxy
* [Helm v3](https://helm.sh/) paket yöneticisi
* `https://us1.api.wallarm.com` (US Wallarm Cloud) veya `https://api.wallarm.com` (EU Wallarm Cloud) erişimi
* Wallarm Helm chart'ını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'a **Administrator** erişimi

## Deployment

Istio ve Envoy proxy tarafından yönetilen API'leri güvence altına almak için, aşağıdaki adımları izleyin:

1. Kubernetes kümenizde Wallarm filtering node servisini dağıtın.
1. Envoy proxy'yi, trafiği aynalayıp Wallarm node'una asenkron analiz için gönderecek şekilde Istio'da yapılandırın.

### 1. Deploy a Wallarm Native Node

Kubernetes kümenizde Wallarm node'unu ayrı bir servis olarak dağıtmak için, [talimatları](../native-node/helm-chart.md) izleyin.

### 2. Configure Envoy to mirror traffic to the Wallarm node

1. Istio için Wallarm Lua eklenti kodunu temin etmek üzere [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin. Destek ekibi tarafından sağlanan dosya adları aşağıdaki adımlarda kullanılacaktır.
1. Lua betikleri kullanarak trafiği Wallarm node'una aynalamak için Envoy filter ve cluster yapılandırmasını uygulayın:

    ```
    kubectl apply -f wallarm-envoy-gw-http-filter.yaml
    kubectl apply -f wallarm-envoy-cluster-svc-endpoint.yaml
    ```
1. Istio Ingress controller namespace'i içerisinde Wallarm connector ve onun Lua bağımlılıklarını monte etmek için ConfigMap'ler oluşturun:

    ```
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-mpack-lib.yaml
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-rrasync.yaml
    ```
1. ConfigMap'leri monte etmek için Istio Ingress Gateway dağıtımınızı güncelleyin. Istio'yu nasıl yönettiğinize bağlı olarak (Helm, IstioOperator veya özel dağıtım), değişiklikleri uygun şekilde uygulayın.

    Örneğin, Istio IstioOperator kullanılarak yüklendiyse, `IstioOperator` kaynağını güncelleyerek ConfigMap'leri monte edebilirsiniz:

    ```yaml
    apiVersion: install.istio.io/v1alpha1
    kind: IstioOperator
    spec:
      components:
        ingressGateways:
          - name: istio-ingressgateway
            enabled: true
            k8s:
              volumes:
                - name: lua-mpack
                  configMap:
                    name: lua-msgpack-lib
                - name: lua-rrasync
                  configMap:
                    name: rr-async-packed
              volumeMounts:
                - name: lua-mpack
                  mountPath: /usr/local/share/lua/5.1/msgpack
                  container: istio-proxy
                - name: lua-rrasync
                  mountPath: /usr/local/share/lua/5.1/rrasync
                  container: istio-proxy
    ```

    ```
    kubectl apply -f istio-operator.yaml
    ```

## Testing

Dağıtılan connector'ün işlevselliğini test etmek için, aşağıdaki adımları izleyin:

1. Wallarm pod'larının çalıştığından emin olun:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`, Wallarm node servisinin dağıtıldığı namespace'tir.

    Her pod durumu **STATUS: Running** veya **READY: N/N** olmalıdır. Örneğin:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Test [Path Traversal][ptrav-attack-docs] saldırısını kullanarak Istio Gateway'e istek gönderin:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Wallarm Console'u açın → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içerisindeki **Attacks** bölümüne gidin ve saldırının listede göründüğünden emin olun.

    ![Attacks in the interface][attacks-in-ui-image]

    Connector, [out-of-band](../oob/overview.md) modunda çalıştığından ve kötü niyetli istekleri engellemediğinden, Wallarm node saldırıyı engellemez ancak kaydeder.
1. Gerekirse, ayrı bir konsol penceresinde Wallarm loglarını izleyin:

    ```
    kubectl -n gonode logs native-processing-7c487bbdc6-4j6mz --tail 100 -f
    ```

## Upgrading the Wallarm Lua plugin

Dağıtılan Wallarm Lua eklentisini [yeni bir sürüme](code-bundle-inventory.md#istio) yükseltmek için:

1. Güncellenmiş Wallarm Lua eklenti kodunu elde etmek üzere support@wallarm.com ile iletişime geçin.
1. Güncellenmiş eklentiyi [Adım 2](#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node) açıklamasında belirtildiği şekilde dağıtın.

Eklenti yükseltmeleri, özellikle ana sürüm güncellemeleri için Wallarm node yükseltmesini gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)'a bakın. Gelecekteki yükseltmeleri basitleştirmek ve kullanım dışı bırakmaları önlemek için düzenli node güncellemeleri önerilir.