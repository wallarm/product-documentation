[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/waf-installation/gateways/ibm/test-attack-ui.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# IBM API Connect için Wallarm Bağlayıcısı

[IBM API Connect](https://www.ibm.com/products/api-connect), API’lerin oluşturulması, güvence altına alınması, yönetilmesi ve izlenmesi için araçlar içeren, API yaşam döngüsünün tamamını kapsayan bir çözümüdür. Wallarm, IBM API Connect üzerinden yönetilen API’leri korumak için API trafiğini inceleyip kötü amaçlı istekleri azaltarak bir bağlayıcı olarak kullanılabilir.

Wallarm’ı IBM API Connect ile entegre etmek için, **Wallarm Node’u harici olarak dağıtın** ve **inceleme için IBM API Gateway’i trafiği Node’a proxy’leyecek şekilde yapılandırın**.

IBM API Connect için Wallarm bağlayıcısı yalnızca [in-line](../inline/overview.md) trafik analizini destekler:

![](../../images/waf-installation/gateways/ibm/ibm-traffic-flow-inline.png)

!!! info "API belirtimiyle eşleşen istekler"
    IBM API Connect davranışına göre, yalnızca tanımlı OpenAPI yollarıyla eşleşen istekler Wallarm Node tarafından incelenecektir.

## Kullanım senaryoları

Bu çözüm, IBM API Connect üzerinden yayımlanan API’lerin güvence altına alınması için önerilir.

## Sınırlamalar

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Gereksinimler

Dağıtıma devam etmeden önce aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* IBM API Connect ve IBM DataPower Gateway hakkında bilgi sahibi olmak.
* Çalışır durumda bir IBM API Connect ortamı (yerel veya bulut yönetimli).
* IBM API Connect içinde yayımlanmış bir API.
* Komut satırı etkileşimi için kurulmuş IBM API Toolkit (`apic` veya `apic-slim`).
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim.
* 0.13.x serisinde 0.13.3 veya üzeri, ya da 0.14.1 veya üzeri sürümde Wallarm Node.

## Dağıtım

### 1. Bir Wallarm Node’u dağıtın

Wallarm Node, dağıtmanız gereken Wallarm platformunun çekirdek bileşenidir. Gelen trafiği inceler, kötü amaçlı etkinlikleri tespit eder ve tehditleri azaltacak şekilde yapılandırılabilir.

İhtiyaç duyduğunuz kontrol seviyesine bağlı olarak Wallarm tarafından barındırılan ya da kendi altyapınızda barındırılan şekilde dağıtabilirsiniz.

!!! info "Gerekli Wallarm Node sürümü"
    IBM API Connect entegrasyonu, 0.13.x serisinde 0.13.3 veya üzeri ya da 0.14.1 veya üzeri Wallarm Node [sürümünü](../../updating-migrating/native-node/node-artifact-versions.md) gerektirir. Daha eski sürümler bu bağlayıcıyı desteklemez.

=== "Edge node"
    Bağlayıcı için Wallarm tarafından barındırılan bir Node dağıtmak üzere [talimatları](../security-edge/se-connector.md) izleyin.
=== "Kendi barındırılan Node"
    Kendi barındırılan Node dağıtımı için bir yapıt seçin ve ekli talimatları izleyin:

    * Yalın metal veya sanal makinelerdeki Linux altyapıları için [All-in-one installer](../native-node/all-in-one.md)
    * Konteyner tabanlı dağıtımlar kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    <!-- * AWS altyapıları için [AWS AMI](../native-node/aws-ami.md) -->
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm ilkelerini edinin ve IBM API Connect içindeki API’lere uygulayın

Wallarm, API Connect içindeki API’lere eklenebilen özel ilkeler sağlar. Bu ilkeler, API istek ve yanıtlarını inceleme ve tehdit tespiti için Wallarm Node üzerinden proxy’ler.

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyin ve platformunuz için bir code bundle indirin.

    Kendi barındırılan Node çalıştırıyorsanız, code bundle almak için sales@wallarm.com ile iletişime geçin.
1. İstek inceleme ilkesini kaydedin:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. Yanıt inceleme ilkesini kaydedin:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

Çoğu durumda `configured-gateway-service` adı `datapower-api-gateway`’dir.

### 3. Wallarm inceleme adımlarını assembly işlem hattına entegre edin

API belirtiminizde, `x-ibm-configuration.assembly.execute` bölümünde, trafiği Wallarm Node üzerinden yönlendirmek için aşağıdaki adımları ekleyin veya güncelleyin:

1. `invoke` adımından önce, gelen istekleri Wallarm Node’a proxy’lemek için `wallarm_pre` adımını ekleyin.
1. `invoke` adımının aşağıdaki şekilde yapılandırıldığından emin olun:
    
    * `target-url` şu biçimi izlemelidir: `$(target-url)$(request.path)?$(request.query-string)`. Bu, isteklerin orijinal arka uç yoluna tüm sorgu parametreleriyle birlikte proxy’lenmesini sağlar.
    * `header-control` ve `parameter-control` tüm başlık ve parametrelerin geçmesine izin verir. Bu, Wallarm Node’un tüm isteği analiz etmesine, isteğin herhangi bir bölümündeki saldırıları tespit etmesine ve API envanterini doğru biçimde oluşturmasına olanak tanır.
1. `invoke` adımından sonra, yanıtları inceleme için Wallarm Node’a proxy’lemek üzere `wallarm_post` adımını ekleyin.

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

Wallarm ilkelerinde desteklenen özellikler:

| Parametre | Adım adı | Açıklama | Gerekli mi? |
| --------- | --------- | -------- | ----------- |
| `wallarmNodeAddress` | `wallarm_pre`, `wallarm_post` | Wallarm Node örneği URL’si. | Evet |
| `failSafeBlock` | `wallarm_pre`, `wallarm_post` | `true` (varsayılan) ise, Wallarm Node kullanılamaz olduğunda veya istek/yanıt iletiminde hata döndürdüğünde istek veya yanıtı engeller. | Hayır |

### 4. Güncellenmiş API ile ürününüzü yayımlayın

Trafik akışına yönelik değişiklikleri uygulamak için, değiştirilen API’yi içeren ürünü yeniden yayımlayın:

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```

## Örnek: Wallarm ilkeleriyle API ve ürün

Bu örnek, assembly içine eklenmiş Wallarm istek ve yanıt inceleme adımlarını (`wallarm_pre`, `invoke`, `wallarm_post`) içeren temel bir API ve ürün yapılandırmasını gösterir. Wallarm Node üzerinden trafik incelemesini test etmek için dağıtabilirsiniz.

* API belirtimi:

```yaml
openapi: 3.0.3
info:
  title: Hello API
  version: 1.0.0
  x-ibm-name: hello-api
servers:
  - url: /
paths:
  /hello:
    get:
      summary: Say Hello
      responses:
        '200':
          description: OK
          content:
            text/plain:
              schema:
                type: string
x-ibm-configuration:
  properties:
    target-url:
      value: https://httpbin.org
      description: Filtreden geçen trafiğin proxy’lendiği yer
      encoded: false
  type: rest
  phase: realized
  enforced: true
  testable: true
  cors:
    enabled: true
  gateway: datapower-api-gateway
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
  activity-log:
    enabled: true
    success-content: activity
    error-content: payload
```

* Ürün belirtimi:

```yaml
product: 1.0.0
info:
  name: hello-product
  title: Hello Product
  version: 1.0.0
  description: Hello API’yi sunan temel bir ürün
apis:
  hello-api:
    $ref: ./api.yaml
plans:
  default:
    title: Default Plan
    description: Açık erişim planı
    approval: false
    rate-limit:
      value: unlimited
    apis:
      hello-api: {}
visibility:
  view:
    enabled: true
    type: public
  subscribe:
    enabled: true
    type: authenticated
gateways:
  - datapower-api-gateway
```

## Test

Dağıtılan ilkelerin işlevselliğini test etmek için şu adımları izleyin:

1. API’nize test [Path Traversal][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl -k --request GET --url https://localhost:9444/<PATH ALLOWED BY SPEC> \
      --header 'X-IBM-Client-Id: <YOUR IBM CLIENT ID>' \
      --header 'accept: /etc/passwd'
    ```

    IBM API Connect davranışına göre, yalnızca tanımlı OpenAPI yollarıyla eşleşen istekler Wallarm Node tarafından incelenecektir.

1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırının listede göründüğünden emin olun.
    
    ![Arayüzde Attacks][attacks-in-ui-image]

    Wallarm node modu [engelleme](../../admin-en/configure-wallarm-mode.md) olarak ayarlanmışsa ve trafik in-line akıyorsa, istek ayrıca engellenecektir (ekran görüntüsü bu durumu göstermektedir).

## İlkeleri yükseltme

Dağıtılmış Wallarm ilkelerini [daha yeni bir sürüme](code-bundle-inventory.md#ibm-api-connect) yükseltmek için:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** üzerinden IBM için güncellenmiş Wallarm ilkelerini indirin.

    Kendi barındırılan Node çalıştırıyorsanız, güncellenmiş code bundle için sales@wallarm.com ile iletişime geçin.
1. Her bir ilkeyi `policies:create` komutunu kullanarak yeniden kaydedin ve güncellenmiş `.zip` dosyalarını belirtin:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. `wallarm-post.zip` için tekrarlayın.
1. API belirtiminizde, `x-ibm-configuration.assembly.execute` içinde ilke sürümlerini güncelleyin:

    ```yaml
    ...
    x-ibm-configuration:
      ...
      assembly:
        execute:
          - wallarm_pre:
              version: <NEW_VERSION>
          ...
          - wallarm_post:
              version: <NEW_VERSION>
    ...
    ```

    Her iki ilke de aynı sürüm numarasını kullanır.
1. İlgili ürünü `products:publish` komutunu kullanarak yeniden yayımlayın.

    ```
    apic products:publish \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        <PATH TO THE UPDATED PRODUCT YAML>
    ```

İlke yükseltmeleri, özellikle ana sürüm güncellemelerinde bir Wallarm Node yükseltmesi gerektirebilir. Kendi barındırılan Node sürüm notları ve yükseltme talimatları için [Native Node değişiklik günlüğüne](../../updating-migrating/native-node/node-artifact-versions.md) veya [Edge connector yükseltme prosedürüne](../security-edge/se-connector.md#upgrading-the-edge-node) bakın. Eskimeyi önlemek ve gelecekteki yükseltmeleri kolaylaştırmak için düzenli Node güncellemeleri önerilir.