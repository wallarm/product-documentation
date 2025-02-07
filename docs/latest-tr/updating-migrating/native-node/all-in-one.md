[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# All-in-One Yükleyici ile Wallarm Native Node Yükseltme

Bu talimatlar, [all-in-one yükleyici kullanılarak kurulan Native Node'un](../../installation/native-node/all-in-one.md) nasıl yükseltileceğini adım adım açıklar.

[Tüm all-in-one yükleyici sürümlerini görüntüleyin](node-artifact-versions.md)

## Gereksinimler

* Linux OS.
* x86_64/ARM64 mimarisi.
* Tüm komutların süper kullanıcı olarak (örneğin `root`) çalıştırılması.
* Aşağıdakilere outbound erişim:

    * Wallarm yükleyiciyi indirmek için `https://meganode.wallarm.com`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kurallarının güncellemelerini ve [API spesifikasyonlarını][api-spec-enforcement-docs] indirmek, ayrıca [izin verilen, yasaklanan veya gri listeye alınan][ip-list-docs] ülke, bölge veya veri merkezleriniz için kesin IP’leri almak üzere aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Bunlara ek olarak, Wallarm Console'da **Administrator** rolüne sahip olmalısınız.

## 1. Yeni yükleyici sürümünü indirin

Mevcut Native Node'unuzun çalıştığı makinede en son yükleyici sürümünü indirin:

=== "x86_64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64 sürümü"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

## 2. Yeni yükleyiciyi çalıştırın

Aşağıda gösterildiği gibi yeni yükleyiciyi çalıştırın. Bu, mevcut Wallarm servislerini durduracak ve ardından yeni sürümün servislerini otomatik olarak başlatacaktır.

Daha önce oluşturduğunuz [Deploy rolü için API tokenı](../../user-guides/settings/api-tokens.md) ve node grup adını yeniden kullanabilirsiniz.

Yapılandırma dosyası olarak, ilk kurulum sırasında kullanılan dosyayı yeniden kullanabilirsiniz. Yalnızca gerekliyse yeni parametreler ekleyin veya mevcut olanları değiştirin - [desteklenen yapılandırma seçeneklerine](../../installation/native-node/all-in-one-conf.md) bakın.

=== "connector-server"
    `connector-server` modu, [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) ve [Fastly](../../installation/connectors/fastly.md) konektörleri ile kendin barındırdığınız node'u dağıttığınızda kullanılır.

    x86_64 yükleyici sürümü için:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64 yükleyici sürümü için:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "tcp-capture"
    `tcp-capture` modu, [TCP trafik analizi](../../installation/oob/tcp-traffic-mirror/deployment.md) için kendin barındırdığınız node'u dağıttığınızda kullanılır.

    !!! info "Node 0.11.0 veya daha sonraki sürüme yükseltiyorsanız"
        Node 0.11.0 veya daha yüksek bir sürüme yükseltme yapıyorsanız, varsayılan kurulum talimatlarına göre (`wallarm-node-conf.yaml`) ilk yapılandırma dosyasında `version` değerinin güncellendiğinden ve önceden `middleware` bölümünde ayarlanan parametrelerin `goreplay` bölümüne taşındığından emin olun:

        ```diff
        -version: 2
        +version: 3

        -middleware:
        +goreplay:
          parse_responses: true
          response_timeout: 5s
          url_normalize: true
        ```

    x86_64 yükleyici sürümü için yükseltme komutu:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    ARM64 yükleyici sürümü için yükseltme komutu:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

* `WALLARM_LABELS` değişkeni, node'un ekleneceği grubu ayarlar (Wallarm Console UI'da node'ların mantıksal gruplandırılması için kullanılır).
* `<API_TOKEN>`, `Deploy` rolü için oluşturulan API token'ını belirtir.
* `<PATH_TO_CONFIG>`, yapılandırma dosyasının yolunu belirtir.

Mevcut `/opt/wallarm/etc/wallarm/go-node.yaml`, `/opt/wallarm/etc/wallarm/node.yaml` ve log dosyalarınız `/opt/wallarm/aio-backups/<timestamp>` dizinine yedeklenecektir.

## 3. Yükseltmeyi doğrulayın

Node'un doğru çalıştığını doğrulamak için:

1. Loglarda herhangi bir hata olup olmadığını kontrol edin:

    * Loglar varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır. Bu dosyayı oradan okuyabilirsiniz.
    * Filtreleme node'una ait, verinin Wallarm Cloud'a gönderilip gönderilmediği, tespit edilen saldırılar vb. [standart loglar](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde yer almaktadır.
1. Korumalı bir kaynak adresine test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Eğer trafik `example.com`'a proxy ile yönlendirildiyse, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Yükseltilmiş node'un bir önceki sürüme göre beklenildiği şekilde çalıştığını doğrulayın.

## Bir sorunla karşılaşırsanız

Yükseltme veya yeniden kurulum işlemi sırasında bir sorun yaşanırsa:

1. Mevcut kurulumu kaldırın:

    ```
    sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
    ```
1. Node'u, [TCP trafik analizi](../../installation/oob/tcp-traffic-mirror/deployment.md) veya [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) ya da [Fastly](../../installation/connectors/fastly.md) konektörleri için olduğu gibi yeniden kurun.

    Veya yukarıda anlatılan yükseltme prosedürünü takip edin.