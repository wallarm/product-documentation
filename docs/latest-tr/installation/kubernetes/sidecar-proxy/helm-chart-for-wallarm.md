# Sidecar Helm Tablosunun Wallarm-Specific değerleri

Bu belge, Wallarm'a özgü Helm tablo değerlerini [Wallarm Sidecar'ın dağıtımı](deployment.md) sırasında veya [yükseltme][sidecar-upgrade-docs] sırasında değiştirebileceğinizi tanımlar. Wallarm'a özgü ve diğer tablo değerleri, Sidecar Helm tablosunun küresel yapılandırması içindir.

!!! info "Küresel ve her pod'un ayarlarının öncelikleri."
    Her pod'un notları [ünvana](customization.md#configuration-area) Helm tablosu değerlerine göre öncelikli olmakla beraber.

Wallarm'a özel olan [öntanımlı `values.yaml`]((https://github.com/wallarm/sidecar/blob/main/helm/values.yaml))'ı takip etmek gibi görünüyor:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
```

## config.wallarm.api.token

Filtreleme düğümü jeton değeri. Wallarm API'sine erişim için gereklidir.

Jeton, [bu][node-token-types] tiplerden biri olabilir:

*  **API jetonu (önerilir)** - Dinamik olarak düğüm grupları eklemek/kaldırmak için düğüm grupları eklemek/kaldırmak için veya eklenen güvenlik için jeton döngüsünü kontrol etmek istiyorsanız idealdir.
  
   Bir API jetonu oluşturmak için:

    1. Wallarm Konsolu → **Ayarlar** → **API jetonları**'na gidin, [ABD Bulut](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Bulut](https://my.wallarm.com/settings/api-tokens)'undan birine gitin.
    1. **Dağıtma** kaynak rolüyle bir API jetonu oluşturun.
    1. Düğümün dağıtımı sırasında, oluşturulan jetonu kullanın ve `config.wallarm.api.nodeGroup` parametresini kullanarak grup adını belirtin. Farklı API jetonları başvurarak bir grup halinde birden çok düğüm ekleyebilirsiniz.
*  **Düğüm jetonu** - Düğüm gruplarının zaten kullanımda olduğunu biliyorsanız geçerlidir.
   
   Düğüm jetonu oluşturmak için:
   
    1. Wallarm Konsolu → **Düğümler**'e gidin, [ABD Bulut](https://us1.my.wallarm.com/nodes) veya [AB Bulut](https://my.wallarm.com/nodes)'undan birine gitin.
    1. Düğüm oluşturun ve düğüm grubunu adlandırın. 
    1. Düğümün dağıtımı sırasında, grubun her bir düğümünün grubunu dahil etmek istediğiniz grubun jetonunu kullanın.

Parametre, [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret) ise yoksayılır.

## config.wallarm.api.host

Wallarm API uç noktası. Olabilir:

* `us1.api.wallarm.com` [US cloud][us-cloud-docs] için.
* `api.wallarm.com`[EU cloud][eu-cloud-docs] için (öntanımlı).

## config.wallarm.api.nodeGroup

Bu, yeni dağıtılan düğümlerin eklemek istediğiniz filtreleme düğümlerinin grubunun adını belirtir. Bu tarzda düğüm gruplama, bir API jetonuyla buluta düğüm oluşturma ve bağlama yaptığınızda mevcuttur (değer, `config.wallarm.api.token` parametresinde geçerlidir).

**Öntanımlı değer**: `defaultSidecarGroup`

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Helm tablosu sürümü 4.4.4'ten itibaren Kubernetes sırlarından Wallarm düğüm jeton değerini çeken bu yapılandırma bloğunu kullanabilirsiniz. Ayrı sırlar yönetimine sahip ortamlar için yararlıdır (örn. bir dış sırlar operatörü kullanıyorsunuz).

Düğüm jetonunu K8s sırlarında saklamak ve Helm tablosuna çekmek için:

1. Wallarm düğüm jetonu ile bir Kubernetes sırrı oluşturun:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * Eğer dağıtım talimatlarını değiştirmeden uyguladıysanız, `wallarm-sidecar` Wallarm Sidecar denetleyicisi ile Helm bülteni için oluşturulan Kubernetes ad alanıdır. Farklı bir ad alanı kullanıyorsanız adını değiştirin.
    * `wallarm-api-token` Kubernetes sırrının adıdır.
    * `<WALLARM_NODE_TOKEN>` Wallarm Konsol UI'dan kopyalanan Wallarm düğüm jeton değeridir.

    Eğer bir harici sırlar operatörü kullanıyorsanız, bir sırrı oluşturmak için [uygun belgelere başvurun](https://external-secrets.io).
1. `values.yaml` da aşağıdaki yapılandırmayı ayarlayın:

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**Öntanımlı değer**: `existingSecret.enabled: false` Helm tablosunu `config.wallarm.api.token` dan Wallarm düğüm jetonunu almak için yönlendirir.

## config.wallarm.fallback

Değerin `on` (öntanımlı) olarak ayarlanması ile, NGINX hizmetlerinin acil moda girmesi mümkündür. Proton.db veya özel kurallar Wallarm Bulutundan indirilemediyse, bu ayar Wallarm modülünü devre dışı bırakır ve NGINX'in işlevine devam etmesini sağlar.

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

Küresel [trafik filtreleme modu][configure-wallarm-mode-docs]. Olası değerler:

* `monitoring` (öntanımlı)
* `safe_blocking`
* `block`
* `off`

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Buluttaki ayarlar aracılığıyla `wallarm_mode` değerlerini geçersiz kılma yeteneğini yönetir [filtration-mode-priorities-docs]. Olası değerler:

* `on` (öntanımlı)
* `off`
* `strict`

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

[libdetection][libdetection-docs] kütüphanesiyle SQL Enjeksiyon saldırılarını ayrıca doğrulamak isteyip istemez. Olası değerler:

* `on` (öntanımlı)
* `off`

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

Uygulamaların yanıtlarını saldırılar için analiz etmek. Olası değerler:

* `on` (öntanımlı)
* `off`

Yanıt analizi, [pasif algılama][passive-detection-docs] ve [aktif tehdit doğrulama][active-threat-verification-docs] sırasında zafiyet algılaması için gereklidir.

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

[dendenenmiş][denylist-docs] IP'lerden gelen talepler hakkındaki istatistiklerin düğümden Buluta olan gönderimini `on` ile aktive eder / `off` ile deaktive eder.

* `config.wallarm.aclExportEnable: "on"` (öntanımlı) ile, inkar listesine alınmış IP'lerden gelen talepler hakkındaki istatistikler **Olaylar** bölümünde [görüntülenecektir][denylist-view-events-docs].
* `config.wallarm.aclExportEnable: "off"` ile, inkar listesine alınmış IP'lerden gelen talepler hakkındaki istatistikler görüntülenmeyecektir. 

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

Wallarm, WebSockets'ın tam desteğine sahiptir. Öntanımlı olarak, WebSockets'ın mesajları saldırılar için analiz edilmez. Özelliği zorlamak için, API Güvenlik [abonelik planını][subscriptions-docs] aktive edin ve bu ayarı kullanın.

Olası değerler:

* `on`
* `off` (öntanımlı)

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

Uygulamanın yanıtında döndürülen sıkıştırılmış verileri çözmeniz gerekip gerekmediği:

* `on` (öntanımlı)
* `off`

[**Pod'un notu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## postanalytics.external.enabled

Wallarm postanalitiğini (Tarantool) modülünü ayrı bir host üzerine kurulmuş olanı veya Sidecar çözümünün dağıtımı sırasında kurduğunu kullanıp kullanmamayı belirler.
 
Bu özellik Helm bülteni 4.6.4'ten itibaren desteklenmektedir.

Olası değerler:

* `false` (öntanımlı): Sidecar çözümü tarafından yerinden edilmiş postanalitik modülünü kullanın.
* `true`: Eğer aktifleştirilmişse, `postanalytics.external.host` ve `postanalytics.external.port` değerlerinde postanalitik modülünün dış adresini belirtin.

  `true` olarak ayarlandığında, Sidecar çözümü, postanalitik modülü çalıştırmaz ama belirtilen `postanalytics.external.host` ve `postanalytics.external.port`'ta ona ulaşmayı bekler.
  

## postanalytics.external.host

Ayrı bir şekilde kurulmuş postanalitik modülünün alan adı veya IP adresi. Bu alan, `postanalytics.external.enabled` `true` olarak ayarlanırsa gereklidir.
  
Bu özellik Helm bülteni 4.6.4'ten itibaren desteklenmektedir.

Örnek değerler: `tarantool.domain.external` ya da `10.10.0.100`.

Belirtilen host, Sidecar Helm tablosunun dağıtıldığı Kubernetes kümesinden erişilebilir olmalıdır.

## postanalytics.external.port

Wallarm postanalitik modülünün çalıştığı TCP portu. Öntanımlı olarak, portu 3313 kullanır çünkü Sidecar çözümü modülü bu portta çalıştırır.

Eğer `postanalytics.external.enabled` `true` olarak ayarlanırsa, belirtilmiş olan dış host üzerinde modülün çalıştığı portu belirtin.