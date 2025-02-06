[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Wallarm Native Node'u Helm Chart ile Yükseltme

Bu talimatlar, Helm chart kullanılarak dağıtılmış [Native Node](../../installation/native-node/helm-chart.md)'nun nasıl yükseltileceğini açıklar.

[Helm chart sürümlerini görüntüleyin](node-artifact-versions.md)

## Gereksinimler

Helm chart ile Native Node'u dağıtmak için kullanılan Kubernetes kümesinin aşağıdaki kriterleri karşılaması gerekir:

* [Helm v3](https://helm.sh/) paket yöneticisi yüklü olmalı.
* API'lerinizin çalıştığı API gateway veya CDN'den gelen erişime izin verilmeli.
* Aşağıdaki dışa yönelik erişim sağlanmalı:

    * Wallarm Helm chart'ını indirmek için `https://charts.wallarm.com`
    * Dağıtım için gerekli Docker imajlarını indirmek amacıyla `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları güncellemelerini ve [API specifications][api-spec-enforcement-docs] indirmek, ayrıca [allowlisted, denylisted, or graylisted][ip-list-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Yukarıdakilere ek olarak, Wallarm Console'da **Administrator** rolünün atanmış olması gerekir.

## 1. Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## 2. Wallarm Kubernetes servisini yükseltin

Dağıtılmış Kubernetes servisini veya Load Balancer'ı yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-node-native --version 0.11.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: mevcut Helm sürümünün adı
* `<NAMESPACE>`: Helm sürümünün bulunduğu namespace
* `<PATH_TO_VALUES>`: dağıtılmış çözüm yapılandırmasını tanımlayan [`values.yaml` dosyasının](../../installation/native-node/helm-chart-conf.md) yolu

    0.10.1 veya daha yüksek bir sürüme yükseltilirken, belirtilmişse `config.connector.log_level` parametresi kaldırılmalıdır. Daha ayrıntılı günlük kaydı için [`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog) bölümü ile değiştirilmiştir. Özelleştirme gerektiğinde `log.*` parametreleri belirtilmelidir.

## 3. Yükseltmeyi doğrulayın

1. Wallarm pod'larının çalışır durumda olduğunu doğrulayın:

    ```
    kubectl -n <NAMESPACE> get pods
    ```

    Her bir pod'un durumu **STATUS: Running** veya **READY: N/N** olmalıdır. Örneğin:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. API gateway'inize test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl https://<GATEWAY_IP>/etc/passwd
    ```
1. Yükseltmenin, önceki sürüme kıyasla node'un beklenen şekilde çalıştığını doğrulayın.