# Wallarm Sidecar Tarafından Desteklenen Yapıların Açıklamaları

[Wallarm Sidecar çözümü](deployment.md) pod-bazında açıklamalar aracılığıyla yapılandırılabilir. Bu çözümde desteklenen açıklamaların listesi bu belgede anlatılmıştır.

!!! info "Global ve pod-bazında ayarların öncelikleri "
    Pod-bazında açıklamalar, Helm chart değerlerine [üstün gelir](customization.md#configuration-area).

## Açıklama listesi

| Açıklama ve karşılık gelen chart değeri                          | Açıklama                                                      | 
|-------------------------------------|------------------------------------------------------------------|
| **Açıklama:** `sidecar.wallarm.io/sidecar-injection-schema`<br><br>`config.injectionStrategy.schema` | [Wallarm konteyner dağıtım şeması](customization.md#single-and-split-deployment-of-containers): `single` (varsayılan) veya `split`. |
| **Açıklama:** `sidecar.wallarm.io/sidecar-injection-iptables-enable`<br><br>`config.injectionStrategy.iptablesEnable` | [`iptables` başlangıç ​​konteynerini başlatılıp başlatmayacağını](customization.md#incoming-traffic-interception-port-forwarding): `true` (varsayılan) veya `false`. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-application`<br><br>No chart value      | [Wallarm uygulama ID][applications-docs]. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-block-page`<br><br>No chart value | Engellenen isteklere iade edilecek [engelleme sayfası ve hata kodu][custom-blocking-page-docs]. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-enable-libdetection`<br><br>`config.wallarm.enableLibDetection`                         | [libdetection][libdetection-docs] kütüphanesini kullanarak SQL Enjeksiyon saldırılarını ek olarak doğrulama: `on` (varsayılan) veya `off`.
| **Açıklama:** `sidecar.wallarm.io/wallarm-fallback`<br><br>`config.wallarm.fallback`                                          | [Wallarm fallback modu][fallback-mode-docs]: `on` (varsayılan) veya  `off`. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-mode`<br><br>`config.wallarm.mode`                                              | [Trafik filtreleme modu][wallarm-modes-docs]: `monitoring` (varsayılan), `safe_blocking`, `block` veya `off`. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-mode-allow-override`<br><br>`config.wallarm.modeAllowOverride`                                 | Bulut ayarlarındaki `wallarm_mode` değerlerinin [üstün gelme yeteneğini yönetir][filtration-mode-priorities-docs]: `on` (varsayılan), `off` veya `strict`. |
| <a name="wallarm-node-group"></a>**Açıklama:** `sidecar.wallarm.io/wallarm-node-group`<br><br>`config.wallarm.api.nodeGroup`                                 | Yeni dağıtılan düğümleri eklemek istediğiniz filtreleme düğümü grubunun adını belirtir. Bu şekilde düğüm gruplaması, sadece bir API belirteci kullanarak Buluta düğümler oluşturduğunuzda ve bağladığınızda mevcuttur (değer, `config.wallarm.api.token` parametresine geçirilir).<br>Bu değer, Tarantool podları üzerinde etkiye sahip değildir, onlar her zaman `config.wallarm.api.nodeGroup` Helm chart değerinde belirtilen düğüm gruplarına bağlıdır. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-parser-disable`<br><br>No chart value                                                               | [Ayrıştırıcıları][parsers-docs] devre dışı bırakmayı sağlar. Direktif değerleri, devre dışı bırakılacak olan ayrıştırıcının adına karşılık gelir, örneğin `json`. Birden çok ayrıştırıcı belirtilebilir, noktalı virgül ile bölünerek, örneğin `json;base64`. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-parse-response`<br><br>`config.wallarm.parseResponse`                                     | Uygulama yanıtlarının saldırılar için analiz edilip edilmeyeceği: `on` (varsayılan) veya `off`. Yanıt analizi, [pasif tespit][passive-detection-docs] ve [aktif tehdit doğrulama][active-threat-verification-docs] sırasında zafiyet tespit için gereklidir. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-acl-export-enable`<br><br>`config.wallarm.aclExportEnable`                                     | [Reddedilenler listesi][denylist-docs] IP'lerinden gelen istatistikleri düğümden Buluta göndermeyi etkinleştirir `on` / devre dışı bırakır `off`.<ul><li>`"on"` değeri (varsayılan) ile, reddedilen IP'lerden gelen istekler hakkındaki istatistikler,  **Events** bölümünde [görüntülenir][denylist-view-events-docs].</li><li>`"off"` değeri ile, reddedilen IP'lerden gelen istekler hakkındaki istatistikler görüntülenmez.</li></ul> |
| **Açıklama:** `sidecar.wallarm.io/wallarm-parse-websocket`<br><br>`config.wallarm.parseWebsocket`                                    | Wallarm tam WebSocket desteğine sahiptir. Varsayılan olarak, WebSocket'lerin mesajları saldırılar için analiz edilmez. Bu özelliği zorlamak için, API Güvenliği [abonelik planını][subscriptions-docs] etkinleştirin ve bu açıklamayı kullanın: `on` veya `off` (varsayılan). |
| **Açıklama:** `sidecar.wallarm.io/wallarm-unpack-response`<br><br>`config.wallarm.unpackResponse`                                    | Uygulama yanıtında döndürülen sıkıştırılmış verilerin açılmasını sağlar: `on` (varsayılan) veya `off`. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-upstream-connect-attempts`<br><br>`config.wallarm.upstream.connectAttempts`                          | Tarantool veya Wallarm API'ye hemen yeniden bağlanma sayısını tanımlar. |
| **Açıklama:** `sidecar.wallarm.io/wallarm-upstream-reconnect-interval`<br><br>`config.wallarm.upstream.reconnectInterval`                        | Tarantool veya Wallarm API'ye hemen yeniden bağlanma sayısının eşiğini aştıktan sonra yeniden bağlanma girişimleri arasındaki süreyi tanımlar. |
| **Açıklama:** `sidecar.wallarm.io/application-port`<br><br>`config.nginx.applicationPort`                                     | Wallarm konteyneri, [hiçbir açık uygulama pod portu bulunamadıysa](customization.md#application-container-port-auto-discovery), gelen isteklerin bu porta gitmesini bekler. |
| **Açıklama:** `sidecar.wallarm.io/nginx-listen-port`<br><br>`config.nginx.listenPort`                                          | Wallarm konteyneri tarafından dinlenen port. Bu port, Wallarm yan çözüm tarafından kullanılmak üzere ayrılmıştır, `application-port` ile aynı olamaz. |
| **Açıklama:** `sidecar.wallarm.io/nginx-http-include`<br><br>No chart value                                                               | NGINX yapılandırma dosyalarının yollarını içerir and this path should point to the file in the container. bu dosyalar, NGINX yapılandırmanın `http` seviyesinde [dahil edilir](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-http-snippet`<br><br>No chart value                                                               | `http` seviyesinde NGINX yapılandırmasına dahil edilmesi gereken [ek inline config](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-server-include`<br><br>No chart value                                                               | NGINX yapılandırma dosyalarının yollarını içerir and this path should point to the file in the container. bu dosyalar, NGINX yapılandırmanın `server` seviyesinde [dahil edilir](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-server-snippet`<br><br>No chart value                                                               | `server` seviyesinde NGINX yapılandırmasına dahil edilmesi gereken [ek inline config](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-location-include`<br><br>No chart value                                                               | NGINX yapılandırma dosyalarının yollarını içerir and this path should point to the file in the container. bu dosyalar, NGINX yapılandırmanın `location` seviyesinde [dahil edilir](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-location-snippet`<br><br>No chart value                                                               | `location` seviyesinde NGINX yapılandırmasına dahil edilmesi gereken [ek inline config](customization.md#using-custom-nginx-configuration). |
| **Açıklama:** `sidecar.wallarm.io/nginx-extra-modules`<br><br>No chart value                                                               | Etkinleştirilecek [ek NGINX modülleri](customization.md#enabling-additional-nginx-modules) dizisi. |
| **Açıklama:** `sidecar.wallarm.io/proxy-extra-volumes`<br><br>No chart value                                                               | Pod'a eklenecek [özel birimler](customization.md#include)(dizi). Açıklama değeri tek tırnaklar `''` içinde olmalıdır.  |
| **Açıklama:** `sidecar.wallarm.io/proxy-extra-volume-mounts`<br><br>No chart value                                                               | `sidecar-proxy` konteynerine eklenecek [özel birim bağlantıları](customization.md#include)(JSON nesnesi). Açıklama değeri tek tırnaklar `''` içinde olmalıdır. |
| **Açıklama:** `sidecar.wallarm.io/proxy-cpu`<br><br>`config.sidecar.containers.proxy.resources.requests.cpu`           | `sidecar-proxy` konteyneri için istenen [CPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/proxy-memory`<br><br>`config.sidecar.containers.proxy.resources.requests.memory`        | 'sidecar-proxy' konteyneri için istenen [memory](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/proxy-cpu-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.cpu`             | `sidecar-proxy` konteyneri için [CPU sınırı](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/proxy-memory-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.memory`          | `sidecar-proxy` konteyneri için [memory limit](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/helper-cpu`<br><br>`config.sidecar.containers.helper.resources.requests.cpu`          | `sidecar-helper` konteyneri için istenen [CPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/helper-memory`<br><br>`config.sidecar.containers.helper.resources.requests.memory`       | `sidecar-helper` konteyneri için istenen [memory](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/helper-cpu-limit`<br><br>`config.sidecar.containers.helper.resources.limits.cpu`            | `sidecar-helper` konteyneri için [CPU sınırı](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/helper-memory-limit`<br><br>`config.sidecar.containers.helper.resources.limits.memory`         | `sidecar-helper` konteyneri için [memory limit](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-iptables-cpu`<br><br>`config.sidecar.initContainers.iptables.resources.requests.cpu`    | `sidecar-init-iptables` konteyneri için istenen [CPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-iptables-memory`<br><br>`config.sidecar.initContainers.iptables.resources.requests.memory` | `sidecar-init-iptables` konteyneri için istenen [memory](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-iptables-cpu-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.cpu`      | `sidecar-init-iptables` konteyneri için [CPU sınırı](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-iptables-memory-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.memory`   | `sidecar-init-iptables` konteyneri için [memory limit](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-helper-cpu`<br><br>`config.sidecar.initContainers.helper.resources.requests.cpu`      | `sidecar-init-helper` konteyneri için istenen [CPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-helper-memory`<br><br>`config.sidecar.initContainers.helper.resources.requests.memory`   | `sidecar-init-helper` konteyneri için istenen [memory](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-helper-cpu-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.cpu`        | `sidecar-init-helper` konteyneri için [CPU sınırı](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/init-helper-memory-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.memory`     | `sidecar-init-helper` konteyneri için [memory limit](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **Açıklama:** `sidecar.wallarm.io/profile`<br><br>No chart value | Bu açıklama belirli bir TLS profili bir uygulama poduna atamak için kullanılır [TLS/SSL termination](customization.md#ssltls-termination).<br><br>Bu açıklama ve TLS/SSL termination, Helm chart 4.6.1'den itibaren desteklenmektedir. |

Doğrudan açıklamalarla kapsanmayan daha çok [Wallarm tarafından desteklenen NGINX direktifleri][nginx-directives-docs] vardır. Yine de, onları da [`nginx-*-snippet` ve `nginx-*-include` açıklamalarını](customization.md#using-custom-nginx-configuration) kullanarak yapılandırabilirsiniz.

## Açıklamaları nasıl kullanılır

Bir açıklamanın bir poda uygulanması için, uygun uygulama yapılandırmasının `Deployment` nesnesi ayarlarında belirtin, örneğin:


```bash
kubectl edit deployment -n <UYGULAMA_ADI_ALANI> <UYGULAMA_ETIKETI_DEGERI>
```

```yaml hl_lines="17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```