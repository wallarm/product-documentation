[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-mode
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Istio Ingress için Wallarm Connector (Bant Dışı)

Wallarm, trafiği [bant dışı (OOB)](../oob/overview.md) olarak analiz etmek üzere Istio tarafından yönetilen API’leri korumak için bir connector sağlar. Wallarm node’larını [Istio’nun](https://istio.io/) Envoy proxy’lerinin yanında dağıtarak, connector gelen trafiği yansıtır ve trafiği kesintiye uğratmadan akışın sürmesine izin verirken analize eşzamanlı olmayan şekilde gönderir.

Entegrasyon, trafiğin yansıtılması ve Wallarm node’u ile iletişimi yönetmek için Envoy proxy içerisinde dağıtılan bir Lua eklentisine dayanır.

![Wallarm eklentisi ile Istio](../../images/waf-installation/gateways/istio/traffic-flow-oob.png)

## Kullanım senaryoları

Gerçek zamanlı trafik analizi gereksiz olduğunda ve eşzamanlı olmayan analiz yeterli olduğunda bu çözüm önerilir.

Kubernetes’te Envoy proxy ile çalışan, Istio tarafından yönetilen API’leri korumak için en uygun seçenektir.

## Sınırlamalar

Bu kurulum, Wallarm’ı yalnızca Wallarm Console UI üzerinden ince ayar yapmanıza izin verir. Dosya tabanlı yapılandırma gerektiren bazı Wallarm özellikleri bu uygulamada desteklenmez, örneğin:

* [Çok kiracılılık özelliği][multitenancy-overview]
* [Uygulama yapılandırması][applications-docs]
* [Özel engelleme sayfası ve kod kurulumu][custom-blocking-page-docs]

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Kubernetes kümenizde API trafiğini yöneten Envoy proxy ile Istio
* [Helm v3](https://helm.sh/) paket yöneticisi
* `https://us1.api.wallarm.com` (US Wallarm Cloud) veya `https://api.wallarm.com` (EU Wallarm Cloud) erişimi
* Wallarm Helm chart’ını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlist, denylist veya graylist](../../user-guides/ip-lists/overview.md) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’a **Administrator** erişimi

## Dağıtım

Istio ve Envoy proxy tarafından yönetilen API’leri korumak için şu adımları izleyin:

1. Kubernetes kümenize Wallarm filtreleme node servisini dağıtın.
1. Istio’daki Envoy proxy’yi trafiği yansıtacak ve bant dışı analiz için Wallarm node’una gönderecek şekilde yapılandırın.

### 1. Bir Wallarm Native Node dağıtın

Wallarm node’unu Kubernetes kümenizde ayrı bir servis olarak dağıtmak için [talimatları](../native-node/helm-chart.md) izleyin.

### 2. Envoy'u trafiği Wallarm node'una yansıtacak şekilde yapılandırın

1. Istio için Wallarm Lua eklenti kodunu edinmek üzere [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin. Destek ekibinin sağladığı dosya adları aşağıdaki adımlarda kullanılacaktır.
1. Lua betikleri kullanarak trafiği Wallarm node’una yansıtmak için Envoy filter ve cluster yapılandırmasını uygulayın:

    ```
    kubectl apply -f wallarm-envoy-gw-http-filter.yaml
    kubectl apply -f wallarm-envoy-cluster-svc-endpoint.yaml
    ```
1. Istio Ingress controller namespace’i içinde Wallarm connector’ünü ve Lua bağımlılıklarını bağlamak için ConfigMap’leri oluşturun:

    ```
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-mpack-lib.yaml
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-rrasync.yaml
    ```
1. ConfigMap’leri bağlamak için Istio Ingress Gateway dağıtımınızı güncelleyin. Istio’yu nasıl yönettiğinize (Helm, IstioOperator veya özelleştirilmiş dağıtım) bağlı olarak değişiklikleri uygun şekilde uygulayın.

    Örneğin, Istio IstioOperator kullanılarak kurulduysa, ConfigMap’leri `IstioOperator` kaynağını güncelleyerek bağlayabilirsiniz:

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

## Test

Dağıtılan connector’ün işlevselliğini test etmek için şu adımları izleyin:

1. Wallarm pod’larının çalışır durumda olduğunu doğrulayın:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`, Wallarm node servisinin dağıtıldığı namespace’dir.

    Her pod durumunun **STATUS: Running** veya **READY: N/N** olması gerekir. Örneğin:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Istio Gateway’e test [Yol Geçişi][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Wallarm Console → Attacks bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırının listede görüntülendiğinden emin olun.

    ![Arayüzde Attacks][attacks-in-ui-image]

    Connector [bant dışı](../oob/overview.md) modda çalıştığından ve kötü amaçlı istekleri engellemediğinden, Wallarm node saldırıyı engellemez ancak kaydeder.
1. Gerekirse, ayrı bir konsol penceresinde Wallarm günlüklerini izleyin:

    ```
    kubectl -n gonode logs native-processing-7c487bbdc6-4j6mz --tail 100 -f
    ```

## Wallarm Lua eklentisini yükseltme

Dağıtılmış Wallarm Lua eklentisini [daha yeni bir sürüme](code-bundle-inventory.md#istio) yükseltmek için:

1. Istio Ingress’iniz için güncellenmiş Wallarm Lua eklenti kodunu edinmek üzere support@wallarm.com ile iletişime geçin.
1. Güncellenen eklentiyi [Adım 2](#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)’de açıklandığı şekilde dağıtın.

Eklenti yükseltmeleri, özellikle ana sürüm güncellemelerinde, bir Wallarm node yükseltmesi gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) bakın. Gelecekteki yükseltmeleri basitleştirmek ve kullanım dışı kalmayı önlemek için düzenli node güncellemeleri önerilir.