[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Helm Chart ile Wallarm Native Node'u Yükseltme

Bu talimatlar, [Helm chart kullanılarak dağıtılmış Native Node'un](../../installation/native-node/helm-chart.md) nasıl yükseltileceğini açıklar.

[Helm chart sürümlerini görüntüleyin](node-artifact-versions.md)

## Gereksinimler

Helm chart ile Native Node dağıtımı için Kubernetes kümesi aşağıdaki kriterleri karşılamalıdır:

* [Helm v3](https://helm.sh/) paket yöneticisi kurulu olmalıdır.
* API'lerinizin çalıştığı API gateway veya CDN'den gelen (inbound) erişim.
* Aşağıdakilere çıkan (outbound) erişim:

    * Wallarm Helm chart'ını indirmek için `https://charts.wallarm.com`
    * Dağıtım için gereken Docker imajlarını indirmek için `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API spesifikasyonları][api-spec-enforcement-docs] güncellemelerini indirmek ve ayrıca [allowlisted, denylisted veya graylisted][ip-list-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için doğru IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Bunlara ek olarak, Wallarm Console içinde size atanmış **Administrator** rolüne sahip olmalısınız.

## 1. Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## 2. Wallarm Kubernetes servisini yükseltin

Dağıtılmış Kubernetes servisini veya Load Balancer'ı yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-node-native --version 0.17.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: mevcut Helm release adı
* `<NAMESPACE>`: Helm release'ın bulunduğu namespace
* `<PATH_TO_VALUES>`: dağıtılan çözüm yapılandırmasını tanımlayan [`values.yaml` dosyasının](../../installation/native-node/helm-chart-conf.md) yolu

    0.10.1 veya daha yüksek bir sürüme yükseltirken, belirtilmişse `config.connector.log_level` parametresini kaldırın. Daha ayrıntılı günlükleme için [`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog) bölümü ile değiştirilmiştir. Özelleştirme gerekiyorsa `log.*` parametrelerini belirtin.

## 3. Yükseltmeyi doğrulayın

1. Wallarm pod'larının çalışır durumda olduğunu doğrulayın:

    ```
    kubectl -n <NAMESPACE> get pods
    ```

    Her pod durumunun **STATUS: Running** veya **READY: N/N** olması gerekir. Örneğin:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. API gateway'inize test amaçlı [Path Traversal][ptrav-attack-docs] saldırısıyla bir istek gönderin:

    ```
    curl https://<GATEWAY_IP>/etc/passwd
    ```
1. Yükseltilen node'un önceki sürüme kıyasla beklendiği gibi çalıştığını doğrulayın.