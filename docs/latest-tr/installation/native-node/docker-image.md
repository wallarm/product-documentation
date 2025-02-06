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

# Docker Image'dan Native Node Dağıtımı

[Wallarm Native Node](../nginx-native-node-internals.md), NGINX'den bağımsız olarak çalışan, bazı konektörlerle dağıtım için tasarlanmıştır. Native Node'u, container tabanlı servislerinizde resmi Docker image'ı kullanarak çalıştırabilirsiniz.

## Kullanım Durumları

[MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) için Wallarm konektörü kurulumunda ve self-hosted node gereksinimi duyduğunuz durumlarda Native Node'u dağıtın.

Native Node için Docker image'ı, AWS ECS gibi container orkestrasyon platformlarını veya diğer Docker tabanlı ortamları zaten kullanıyorsanız idealdir. Wallarm node, API yönetim platformunuz için güvenlik filtresi ve trafik incelemesi sağlayarak servisinizin içinde bir Docker container olarak çalışır.

## Gereksinimler

* Host sisteminizde yüklü [Docker](https://docs.docker.com/engine/install/)
* API yönetim platformunuzdan container tabanlı ortamınıza gelen trafik erişimi
* Container tabanlı ortamınızdan aşağıdaki adreslere çıkış izni:

    * Dağıtım için gerekli Docker image'larını indirmek üzere `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kurallarına güncellemelerin ve [API specification][api-spec-enforcement-docs] indirilmesinin yanı sıra [izin verilen, engellenen veya gri listelenmiş][ip-list-docs] ülkeler, bölgeler veya veri merkezleri için hassas IP'lerin alınabilmesi amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* ECS instance'ının önündeki load balancer için **güvenilir** bir SSL/TLS sertifikası gereklidir.
* Yukarıdakilere ek olarak, Wallarm Console'da **Administrator** rolüne sahip olmanız gerekmektedir.

## Kısıtlamalar

* Load balancer'ı güvence altına almak için self-signed SSL sertifikaları desteklenmez.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.
* Wallarm kuralı üzerinden [Rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Dağıtım

### 1. Docker image'ını çekin

```
docker pull wallarm/node-native-aio:0.11.0
```

### 2. Konfigürasyon dosyasını hazırlayın

Native Node için aşağıdaki minimal konfigürasyon ile `wallarm-node-conf.yaml` dosyasını oluşturun:

```yaml
version: 2

mode: connector-server

connector:
  address: ":5050"
```

[Tüm konfigürasyon parametreleri](all-in-one-conf.md) (Docker image ile Native Node all-in-one kurulumunda aynı değerler kullanılmaktadır)

### 3. Wallarm token'ını hazırlayın

Node kurulumu için, Wallarm Cloud'a node kaydı yaptırmak üzere bir token gerekmektedir. Token hazırlamak için:

1. Wallarm Console → **Settings** → **API tokens** yolunu izleyerek [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde token oluşturun veya mevcut token'ı bulun.
2. `Deploy` kaynak rolüne sahip API token'ı bulun veya oluşturun.
3. Bu token'ı kopyalayın.

### 4. Docker container'ını çalıştırın

Docker image'ını çalıştırmak için aşağıdaki komutları kullanın. `wallarm-node-conf.yaml` dosyasını container'a mount edin.

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```

Environment Variable | Açıklama | Zorunlu
--- | ---- | ----
`WALLARM_API_TOKEN` | `Deploy` rolüne sahip API token'ı. | Evet
`WALLARM_LABELS` | Node instance gruplaması için `group` etiketini ayarlar, örneğin:<br>`WALLARM_LABELS="group=<GROUP>"` node instance'ını `<GROUP>` grubuna dahil eder (varsa kullanılır, yoksa oluşturulur). | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için: `us1.api.wallarm.com`</li><li>EU Cloud için: `api.wallarm.com`</li></ul>Varsayılan: `api.wallarm.com`. | Hayır
`WALLARM_APID_ONLY` (0.11.0 ve üzeri) | Bu modda, trafiğinizde tespit edilen saldırılar node tarafından yerel olarak engellenir (eğer [etkin](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)) fakat Wallarm Cloud'a aktarılmaz. Bu arada, [API Discovery](../../api-discovery/overview.md) ve bazı diğer özellikler API envanterinizi tespit edip Cloud'a yükleyerek görselleştirme imkânı sağlar. Bu mod, önce API envanterinizi gözden geçirip hassas verileri belirlemek isteyen ve sonrasında kontrollü saldırı veri aktarımı planlamak isteyen kullanıcılar içindir. Ancak, saldırı aktarımını devre dışı bırakmak nadirdir, çünkü Wallarm saldırı verilerini güvenli bir şekilde işler ve gerekirse [hassas saldırı verilerini maskeleme](../../user-guides/rules/sensitive-data-rule.md) sağlayabilir. [Detaylar](../../installation/native-node/all-in-one.md#apid-only-mode)<br>Varsayılan: `false`. | Hayır

* `-p` seçeneği host ve container portlarını eşleştirir:

    * İlk değer (`80`), dış trafiğe açık host portudur.
    * İkinci değer (`5050`), container portudur ve `wallarm-node-conf.yaml` dosyasında belirlenen `connector.address` ayarı ile eşleşmelidir.
* Konfigürasyon dosyası, container içerisinde `/opt/wallarm/etc/wallarm/go-node.yaml` olarak mount edilmelidir.

### 5. Wallarm kodunu API yönetim servisinize uygulayın

Node dağıtıldıktan sonra, bir sonraki adım, API yönetim platformunuz veya servisinize Wallarm kod paketini uygulayarak trafiği dağıtılan node'a yönlendirmektir.

1. sales@wallarm.com adresiyle iletişime geçerek konektörünüz için Wallarm kod paketini edinin.
2. Aşağıdaki platforma özgü talimatları izleyerek paketi API yönetim platformunuzda uygulayın:

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)

## Node İşleyişinin Doğrulanması

Node'un trafikleri tespit ettiğini doğrulamak için logları kontrol edebilirsiniz:

* Native Node logları, varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır; ayrıca stdout üzerinden de çıktı alınabilir.
* Wallarm Cloud'a veri gönderimi, tespit edilen saldırılar vb. gibi filtering node'un [Standart logları](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde yer alır.

Ek hata ayıklama için, [`log.level`](all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

## Güncelleme

Node'u güncellemek için [talimatları](../../updating-migrating/native-node/docker-image.md) izleyin.