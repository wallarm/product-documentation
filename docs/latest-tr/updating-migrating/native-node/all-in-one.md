[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# All-in-One Installer ile Wallarm Native Node'u Yükseltme

Bu talimatlar, [all-in-one yükleyici kullanılarak kurulan Native Node'un](../../installation/native-node/all-in-one.md) nasıl yükseltileceğini açıklar.

[All-in-one yükleyici sürümlerini görüntüleyin](node-artifact-versions.md)

## Gereksinimler

* Linux işletim sistemi.
* x86_64/ARM64 mimarisi.
* Tüm komutların süper kullanıcı olarak (örn. `root`) çalıştırılması.
* Aşağıdakilere giden erişim:

    * Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API tanımları][api-spec-enforcement-docs] güncellemelerini indirmek ve ayrıca [izin verilen, engellenen veya gri listeye alınmış][ip-list-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Bunlara ek olarak, Wallarm Console'da size atanan **Administrator** rolüne sahip olmalısınız.

## 1. Yeni yükleyici sürümünü indirin

Geçerli Native Node'unuzun çalıştığı makineye en son yükleyici sürümünü indirin:

=== "x86_64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.x86_64.sh
    chmod +x aio-native-0.17.1.x86_64.sh
    ```
=== "ARM64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.17.1.aarch64.sh
    chmod +x aio-native-0.17.1.aarch64.sh
    ```

## 2. Yeni yükleyiciyi çalıştırın

Yeni yükleyiciyi aşağıda gösterildiği gibi çalıştırın. Bu işlem, şu anda çalışan Wallarm servislerini durdurur ve ardından yeni sürümün servislerini otomatik olarak başlatır.

Önceden oluşturulmuş [`Node deployment/Deployment` kullanım türü için API token'ını](../../user-guides/settings/api-tokens.md) ve düğüm grup adını yeniden kullanabilirsiniz.

Yapılandırma dosyası için, ilk kurulum sırasında kullanılan dosyayı yeniden kullanabilirsiniz. Yalnızca gerekirse yeni parametreler ekleyin veya mevcutları değiştirin - [desteklenen yapılandırma seçeneklerine](../../installation/native-node/all-in-one-conf.md) bakın.

=== "connector-server"
    `connector-server` modu, self-hosted düğümü MuleSoft [Mule](../../installation/connectors/mulesoft.md) veya [Flex](../../installation/connectors/mulesoft-flex.md) Gateway, [Akamai](../../installation/connectors/akamai-edgeworkers.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM DataPower](../../installation/connectors/ibm-api-connect.md) bağlayıcısı ile dağıttığınızda kullanılır.

    !!! info "Node sürümü 0.12.x veya altından yükseltiliyorsa"
        Node sürümü 0.12.x veya altından yükseltiliyorsa, ilk yapılandırma dosyasındaki (`wallarm-node-conf.yaml`, varsayılan kurulum talimatlarına göre) `version` değerinin güncellendiğinden ve `tarantool_exporter` bölümünün (açıkça belirtilmişse) `postanalytics_exporter` olarak yeniden adlandırıldığından emin olun:

        ```diff
        -version: 2
        +version: 4

        -tarantool_exporter:
        +postanalytics_exporter:
          address: 127.0.0.1:3313
          enabled: true
        
        ...
        ```

    x86_64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "tcp-capture"
    `tcp-capture` modu, [TCP trafiği analizi](../../installation/oob/tcp-traffic-mirror/deployment.md) için self-hosted düğüm dağıttığınızda kullanılır.

    !!! info "Node sürümü 0.12.1 veya altından yükseltiliyorsa"
        Node sürümü 0.12.0 veya altından yükseltiliyorsa, ilk yapılandırma dosyasındaki (`wallarm-node-conf.yaml`, varsayılan kurulum talimatlarına göre) `version` değerinin güncellendiğinden ve daha önce `middleware` bölümünde ayarlanmış parametrelerin `goreplay` bölümüne taşındığından emin olun:

        ```diff
        -version: 2
        +version: 4

        -middleware:
        +goreplay:
          parse_responses: true
          response_timeout: 5s
          url_normalize: true
        
        ...
        ```

    x86_64 yükleyici sürümü için yükseltme komutu:
        
    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64 yükleyici sürümü için yükseltme komutu:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "envoy-external-filter"
    `envoy-external-filter` modu, Istio tarafından yönetilen API'ler için [gRPC tabanlı harici işleme filtresinde](../../installation/connectors/istio.md) kullanılır.

    x86_64 yükleyici sürümü için yükseltme komutu:
        
    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64 yükleyici sürümü için yükseltme komutu:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

* `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'de düğümlerin mantıksal gruplaması için kullanılır).
* `<API_TOKEN>`, `Node deployment/Deployment` kullanım türü için oluşturulmuş API token'ını belirtir.
* `<PATH_TO_CONFIG>`, yapılandırma dosyasının yolunu belirtir.

Geçerli `/opt/wallarm/etc/wallarm/go-node.yaml`, `/opt/wallarm/etc/wallarm/node.yaml` ve günlük dosyalarınız `/opt/wallarm/aio-backups/<timestamp>` dizinine yedeklenecektir.

## 3. Yükseltmeyi doğrulayın

Düğümün doğru çalıştığını doğrulamak için:

1. Günlüklerde herhangi bir hata olup olmadığını kontrol edin:

    * Günlükler varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır. Oradan okuyabilirsiniz.
    * Filtreleme düğümünün [standart günlükleri](../../admin-en/configure-logging.md) (verilerin Wallarm Cloud'a gönderilip gönderilmediği, tespit edilen saldırılar vb.) `/opt/wallarm/var/log/wallarm` dizininde bulunur.
1. Korunan bir kaynak adresine test [Path Traversal][ptrav-attack-docs] saldırısı içeren bir istek gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Trafiğin `example.com`'a proxy'lenmesi yapılandırılmışsa, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Yükseltilen düğümün önceki sürüme kıyasla beklendiği gibi çalıştığını doğrulayın.

## Bir sorunla karşılaşırsanız

Yükseltme veya yeniden kurulum sürecinde bir sorun varsa:

1. Geçerli kurulumu kaldırın:

    ```
    sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
    ```
1. Düğümü [TCP trafiği analizi](../../installation/oob/tcp-traffic-mirror/deployment.md) veya MuleSoft [Mule](../../installation/connectors/mulesoft.md) ya da [Flex](../../installation/connectors/mulesoft-flex.md) Gateway, [Akamai](../../installation/connectors/akamai-edgeworkers.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md) veya [IBM DataPower](../../installation/connectors/ibm-api-connect.md) bağlayıcıları için her zamanki gibi yeniden kurun.

    Ya da yukarıda açıklanan yükseltme prosedürünü izleyin.