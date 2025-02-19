[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Kong Ingress Controller için Wallarm Connector

Kong Ingress Controller tarafından yönetilen API'leri güvence altına almak için [Kong Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/latest/) ile sorunsuz entegrasyon sağlayan bir Wallarm connector sunuyoruz. Wallarm filtreleme düğümünü dağıtıp, Kong ile özel bir Lua eklentisi aracılığıyla bağlayarak, gelen trafik gerçek zamanlı olarak analiz edilir ve Wallarm, kötü niyetli isteklerin hizmetlerinize ulaşmadan önce etkisiz hale getirilmesini sağlar.

Kong Ingress Controller için Wallarm connector yalnızca [in-line](../inline/overview.md) modu ile desteklenmektedir:

![Kong with Wallarm plugin](../../images/waf-installation/gateways/kong/traffic-flow-inline.png)

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm Kong API Gateway’i çalıştıran Kong Ingress Controller tarafından yönetilen API’lerin güvenliğini sağlamak için önerilen çözümdür.

## Kısıtlamalar

Bu kurulum, Wallarm’ı sadece Wallarm Console UI üzerinden ince ayar yapmaya olanak tanır. Dosya tabanlı yapılandırma gerektiren bazı Wallarm özellikleri bu uygulamada desteklenmemektedir, örneğin:

* [Multitenancy feature][multitenancy-overview]
* [Application configuration][applications-docs]
* [Custom blocking page and code setup][custom-blocking-page-docs]

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimlerin karşılandığından emin olun:

* Kubernetes kümenizde API trafiğinizi yöneten Kong Ingress Controller’ın dağıtılmış olması
* [Helm v3](https://helm.sh/) paket yöneticisi
* `https://us1.api.wallarm.com` (US Wallarm Cloud) veya `https://api.wallarm.com` (EU Wallarm Cloud) erişimi
* Wallarm Helm chart’ını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub üzerindeki Wallarm depolarına erişim: `https://hub.docker.com/r/wallarm`
* Saldırı tespit kuralları için güncellemeleri indirmek ve [allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’a **Yönetici** erişimi

## Dağıtım

Kong Ingress Controller tarafından yönetilen API’leri güvence altına almak için aşağıdaki adımları izleyin:

1. Kubernetes kümenizde Wallarm filtreleme düğüm servisini dağıtın.
1. Gelen trafiği analiz için Kong Ingress Controller’dan Wallarm filtreleme düğümüne yönlendirmek üzere Wallarm Lua eklentisini edinin ve dağıtın.

### 1. Wallarm Native Node Dağıtımı

Kubernetes kümenizde Wallarm düğümünü ayrı bir servis olarak dağıtmak için [talimatları](../native-node/helm-chart.md) izleyin.

### 2. Wallarm Lua eklentisini edinin ve dağıtın

1. Kong Ingress Controller için Wallarm Lua eklenti kodunu edinebilmek amacıyla [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Eklenti kodunu içeren bir ConfigMap oluşturun:

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```

    `<KONG_NS>`, Kong Ingress Controller’ın dağıtıldığı namespace’tir.
1. Wallarm Lua eklentisini yükleyecek şekilde Kong Ingress Controller için `values.yaml` dosyanızı güncelleyin:

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
1. Wallarm düğüm servisi adresini belirterek bir `KongClusterPlugin` kaynağı oluşturarak Wallarm Lua eklentisini etkinleştirin:

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

    `wallarm-node`, Wallarm düğüm servisi dağıtılan namespace’tir.
1. Seçili servisler için eklentiyi etkinleştirmek amacıyla Ingress veya Gateway API rotanıza aşağıdaki anotasyonları ekleyin:

    ```
    konghq.com/plugins: kong-lua
    kubernetes.io/ingress.class: kong
    ```

## Test Etme

Dağıtılan connector’un işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. Wallarm pod’larının çalışır durumda olduğunu doğrulayın:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`, Wallarm düğüm servisi dağıtılan namespace’tir.

    Her pod’un durumu **STATUS: Running** veya **READY: N/N** şeklinde olmalıdır. Örneğin:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Genellikle `LoadBalancer` servisi olarak yapılandırılan Kong Gateway IP’sini alın:

    ```
    export PROXY_IP=$(kubectl get svc --namespace <KONG_NS> <KONG_RELEASE_NAME>-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```
1. Test [Path Traversal][ptrav-attack-docs] saldırısı ile dengeleyiciye istek gönderin:

    ```
    curl -H "Host: kong-lua-test.wallarm" $PROXY_IP/etc/passwd
    ```

    Düğüm varsayılan olarak [monitoring mode][available-filtration-modes] da çalıştığı için Wallarm düğümü saldırıyı engellemez; yalnızca kaydeder.
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açarak saldırının listede göründüğünden emin olun.

    ![Attacks in the interface][attacks-in-ui-image]

## Wallarm Lua eklentisinin Güncellenmesi

Dağıtılan Wallarm Lua eklentisini [yeni bir sürüme](code-bundle-inventory.md#kong-api-gateway) güncellemek için:

1. Kong Ingress Controller için güncellenmiş Wallarm Lua eklenti kodunu edinebilmek amacıyla [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. ConfigMap’i eklenti kodu ile güncelleyin:

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```
    
    `<KONG_NS>`, Kong Ingress Controller’ın dağıtıldığı namespace’tir.

Eklenti güncellemeleri, özellikle büyük sürüm yükseltmeleri için Wallarm düğüm güncellemesini gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) belgesine bakın. Gelecekteki yükseltmeleri kolaylaştırmak ve kullanım dışı kalmayı önlemek için düzenli düğüm güncellemeleri yapılması önerilmektedir.