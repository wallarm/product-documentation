[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# Docker imajından Native Node’u dağıtma

[Wallarm Native Node](../nginx-native-node-internals.md), NGINX’ten bağımsız çalışır ve bazı connector’larla birlikte dağıtım için tasarlanmıştır. Native Node’u, resmi Docker imajından container’laştırılmış servisleriniz üzerinde çalıştırabilirsiniz.

## Kullanım senaryoları

* MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) için bir connector çözümünün parçası olarak Wallarm düğümünü, self-hosted bir Linux OS makinesinde dağıtmak istediğinizde.

    Yükleyiciyi `connector-server` modunda kullanın.
* Istio tarafından yönetilen API’ler için [gRPC tabanlı harici işleme filtresine](../connectors/istio.md) ihtiyaç duyduğunuzda.
    
    Yükleyiciyi `envoy-external-filter` modunda kullanın.

Native Node için Docker imajı, AWS ECS veya diğer Docker tabanlı ortamlar gibi container orkestrasyon platformlarını zaten kullanıyorsanız idealdir. Wallarm düğümü, servisinize bir Docker container’ı olarak çalışır ve API yönetim platformunuz için güvenlik filtreleme ve trafik inceleme sağlar.

## Gereksinimler

* Ana sisteminizde [Docker](https://docs.docker.com/engine/install/) kurulu olmalı
* API yönetim platformunuzdan container’laştırılmış ortamınıza gelen erişim
* Container’laştırılmış ortamınızdan aşağıdakilere giden erişim:

    * Dağıtım için gereken Docker imajlarını indirmek üzere `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API spesifikasyonları][api-spec-enforcement-docs] güncellemelerini indirmek, ayrıca [allowlist’e, denylist’e veya graylist’e][ip-list-docs] alınmış ülke, bölge veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Native Node bulunan ECS örneğinizin önündeki yük dengeleyici için güvenilir bir SSL/TLS sertifikası gereklidir
* Bunlara ek olarak, Wallarm Console içinde Administrator rolüne sahip olmalısınız

## Sınırlamalar

* Yük dengeleyiciyi güvenceye almak için öz-imzalı (self‑signed) SSL sertifikaları desteklenmez.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmiyor.
* Wallarm kuralı ile [hız sınırlama](../../user-guides/rules/rate-limiting.md) desteklenmiyor.
* [Çok kiracılık](../multi-tenant/overview.md) (multitenancy) henüz desteklenmiyor.

## Dağıtım

### 1. Docker imajını çekin

```
docker pull wallarm/node-native-aio:0.17.1
```

### 2. Yapılandırma dosyasını hazırlayın

Native Node için aşağıdaki asgari yapılandırma ile `wallarm-node-conf.yaml` dosyasını oluşturun:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
    ```
=== "envoy-external-filter"
    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5080"
      tls_cert: "/path/to/cert.crt"
      tls_key: "/path/to/cert.key"
    ```

[Tüm yapılandırma parametreleri](all-in-one-conf.md) (Docker imajı ile Native Node all-in-one yükleyicisi için aynıdır)

### 3. Wallarm token’ını hazırlayın

Düğümü kurmak için, düğümü Wallarm Cloud’a kaydetmekte kullanılacak bir token’a ihtiyacınız olacak. Token’ı hazırlamak için:

1. Wallarm Console → Settings → API tokens bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
1. `Node deployment/Deployment` kullanım türüne sahip bir API token bulun veya oluşturun.
1. Bu token’ı kopyalayın.

### 4. Docker container’ını çalıştırın

Docker imajını çalıştırmak için aşağıdaki komutları kullanın. `wallarm-node-conf.yaml` dosyasını container’a bağlayın.

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```

Ortam değişkeni | Açıklama| Gerekli
--- | ---- | ----
`WALLARM_API_TOKEN` | `Node deployment/Deployment` kullanım türüne sahip API token. | Evet
`WALLARM_LABELS` | Düğüm örneklerini gruplaştırmak için `group` etiketini ayarlar, örneğin:<br>`WALLARM_LABELS="group=<GROUP>"` düğüm örneğini `<GROUP>` örnek grubuna yerleştirir (varsa mevcut olan, yoksa oluşturulacaktır). | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul>Varsayılan: `api.wallarm.com`. | Evet
`WALLARM_APID_ONLY` (0.12.1 ve üzeri) | Bu modda, trafiğinizde tespit edilen saldırılar düğüm tarafından yerel olarak engellenir ([etkinleştirildiyse](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)) ancak Wallarm Cloud’a aktarılmaz. Bu arada, [API Discovery](../../api-discovery/overview.md) ve bazı diğer özellikler tam işlevsel kalır, API envanterinizi tespit eder ve görselleştirme için Cloud’a yükler. Bu mod, önce API envanterini gözden geçirmek ve hassas verileri belirlemek, ardından kontrollü saldırı verisi aktarımını planlamak isteyenler içindir. Ancak, saldırı aktarımının devre dışı bırakılması nadirdir; çünkü Wallarm saldırı verilerini güvenle işler ve gerekirse [hassas saldırı verisi maskeleme](../../user-guides/rules/sensitive-data-rule.md) sağlar. [Daha fazla bilgi](../../installation/native-node/all-in-one.md#apid-only-mode)<br>Varsayılan: `false`. | Hayır

* `-p` seçeneği ana makine ve container portlarını eşler:

    * İlk değer (`80`), dış trafiğe açılan ana makinenin portudur.
    * İkinci değer (`5050`), container’ın portudur ve `wallarm-node-conf.yaml` dosyasındaki `connector.address` veya `envoy_external_filter.address` ayarıyla eşleşmelidir.
* Yapılandırma dosyası, container içinde `/opt/wallarm/etc/wallarm/go-node.yaml` olarak bağlanmalıdır.

### 5. Wallarm kodunu bir API yönetim hizmetine uygulayın

Düğüm dağıtıldıktan sonra, trafiği dağıtılan düğüme yönlendirmek için Wallarm kodunu API yönetim platformunuza veya hizmetinize uygulamanız gerekir.

1. Connector’ünüz için Wallarm kod paketini almak üzere sales@wallarm.com ile iletişime geçin.
1. Paketi API yönetim platformunuza uygulamak için platforma özel talimatları izleyin:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Envoy/Istio](../connectors/istio.md)
    * [IBM DataPower](../connectors/ibm-api-connect.md)

## Düğüm çalışmasını doğrulama

Düğümün trafiği algıladığını doğrulamak için günlükleri kontrol edebilirsiniz:

* Native Node günlükleri varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır, ayrıca stdout’a ek çıktı verilir.
* Verilerin Wallarm Cloud’a gönderilip gönderilmediği, tespit edilen saldırılar vb. gibi filtreleme düğümünün [standart günlükleri](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde bulunur.
* Ek hata ayıklama için, [`log.level`](all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

Ayrıca, `http://<NODE_IP>:9000/metrics` adresinde sunulan [Prometheus metriklerini](../../admin-en/native-node-metrics.md) kontrol ederek düğümün çalışmasını doğrulayabilirsiniz.

## Yükseltme

Düğümü yükseltmek için [talimatları](../../updating-migrating/native-node/docker-image.md) izleyin.