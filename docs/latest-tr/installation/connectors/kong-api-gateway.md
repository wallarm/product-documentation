[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Kong Ingress Controller için Wallarm Connector

[Kong Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/latest/) tarafından yönetilen API’leri korumak için Wallarm, Kubernetes ortamınıza sorunsuzca entegre olan bir connector sağlar. Wallarm filtreleme düğümünü dağıtıp özel bir Lua eklentisi aracılığıyla Kong’a bağlayarak, gelen trafik gerçek zamanlı analiz edilir ve istekler hizmetlerinize ulaşmadan önce Wallarm kötü amaçlı istekleri engelleyebilir.

Kong Ingress Controller için Wallarm connector yalnızca [in-line](../inline/overview.md) modunu destekler:

![Wallarm eklentisi ile Kong](../../images/waf-installation/gateways/kong/traffic-flow-inline.png)

## Kullanım senaryoları

Bu çözüm, Kong API Gateway çalıştıran Kong Ingress Controller tarafından yönetilen API’lerin güvenliğini sağlamak için önerilir.

## Sınırlamalar

Bu kurulum, Wallarm’ın yalnızca Wallarm Console UI üzerinden ince ayar yapılmasına izin verir. Dosya tabanlı yapılandırma gerektiren bazı Wallarm özellikleri bu uygulamada desteklenmez, örneğin:

* [Multitenancy özelliği][multitenancy-overview]
* [Uygulama yapılandırması][applications-docs]
* [Özel engelleme sayfası ve kod kurulumu][custom-blocking-page-docs]

## Gereksinimler

Dağıtıma devam etmeden önce aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Kubernetes kümesinde dağıtılmış ve API trafiğinizi yöneten Kong Ingress Controller
* [Helm v3](https://helm.sh/) paket yöneticisi
* `https://us1.api.wallarm.com` (US Wallarm Cloud) veya `https://api.wallarm.com` (EU Wallarm Cloud) erişimi
* Wallarm Helm chart’ını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlisted, denylisted veya graylisted](../../user-guides/ip-lists/overview.md) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’a **Administrator** erişimi
* Node örneği alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Öz imzalı sertifikalar henüz desteklenmemektedir.

## Dağıtım

Kong Ingress Controller tarafından yönetilen API’leri güvenceye almak için şu adımları izleyin:

1. Kubernetes kümenizde Wallarm filtreleme düğümü servisini dağıtın.
1. Gelen trafiği analiz için Kong Ingress Controller’dan Wallarm filtreleme düğümüne yönlendirmek üzere Wallarm Lua eklentisini edinin ve dağıtın.

### 1. Wallarm Native Node dağıtın

Wallarm düğümünü Kubernetes kümenizde ayrı bir servis olarak dağıtmak için [talimatları](../native-node/helm-chart.md) izleyin.

### 2. Wallarm Lua eklentisini edinin ve dağıtın

1. Kong Ingress Controller’ınız için Wallarm Lua eklenti kodunu edinmek amacıyla [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Eklenti kodu ile bir ConfigMap oluşturun:

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```

    `<KONG_NS>`, Kong Ingress Controller’ın dağıtıldığı ad alanıdır.
1. Wallarm Lua eklentisini yüklemek için Kong Ingress Controller’a ait `values.yaml` dosyanızı güncelleyin:

    ```yaml
    gateway:
      plugins:
        configMaps:
        - name: kong-lua
          pluginName: kong-lua
    ```
1. Kong Ingress Controller’ı güncelleyin:

    ```
    helm upgrade --install <KONG_RELEASE_NAME> kong/ingress -n <KONG_NS> --values values.yaml
    ```
1. Bir `KongClusterPlugin` kaynağı oluşturarak ve Wallarm düğüm servis adresini belirterek Wallarm Lua eklentisini etkinleştirin:

    ```yaml
    echo '
    apiVersion: configuration.konghq.com/v1
    kind: KongClusterPlugin
    metadata:
      name: kong-lua
      annotations:
        kubernetes.io/ingress.class: kong
    config:
      wallarm_node_address: "http://native-processing.wallarm-node.svc.cluster.local:5000"
    plugin: kong-lua
    ' | kubectl apply -f -
    ```

    `wallarm-node`, Wallarm düğüm servisinin dağıtıldığı ad alanıdır.
1. Seçili servisler için eklentiyi etkinleştirmek üzere Ingress’inize veya Gateway API rotanıza aşağıdaki anotasyonları ekleyin:

    ```
    konghq.com/plugins: kong-lua
    kubernetes.io/ingress.class: kong
    ```

## Test

Dağıtılan connector’ün işlevselliğini test etmek için şu adımları izleyin:

1. Wallarm pod’larının çalışır durumda olduğunu doğrulayın:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`, Wallarm düğüm servisinin dağıtıldığı ad alanıdır.

    Her pod durumunun **STATUS: Running** veya **READY: N/N** olması gerekir. Örneğin:

    ```
    NAME                                  READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Kong Gateway IP’sini alın (genellikle bir `LoadBalancer` servisi olarak yapılandırılır):

    ```
    export PROXY_IP=$(kubectl get svc --namespace <KONG_NS> <KONG_RELEASE_NAME>-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```
1. Test [Path Traversal][ptrav-attack-docs] saldırısıyla balancera istek gönderin:

    ```
    curl -H "Host: kong-lua-test.wallarm" $PROXY_IP/etc/passwd
    ```

    Düğüm varsayılan olarak [monitoring mode][available-filtration-modes] modunda çalıştığından, Wallarm düğümü saldırıyı engellemez ancak kaydeder.
1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki **Attacks** bölümünü açın ve saldırının listede görüntülendiğinden emin olun.

    ![Arayüzde Attacks][attacks-in-ui-image]

## Wallarm Lua eklentisini yükseltme

Dağıtılmış Wallarm Lua eklentisini [daha yeni bir sürüme](code-bundle-inventory.md#kong-api-gateway) yükseltmek için:

1. Kong Ingress Controller’ınız için güncellenmiş Wallarm Lua eklenti kodunu edinmek üzere support@wallarm.com ile iletişime geçin.
1. Eklenti kodu ile ConfigMap’i güncelleyin:

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```
    
    `<KONG_NS>`, Kong Ingress Controller’ın dağıtıldığı ad alanıdır.

Eklenti yükseltmeleri, özellikle ana sürüm güncellemelerinde, bir Wallarm düğüm yükseltmesi gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) bakın. Kullanımdan kaldırmaları önlemek ve gelecekteki yükseltmeleri kolaylaştırmak için düzenli düğüm güncellemeleri önerilir.