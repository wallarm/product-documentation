[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# All-in-One Yükleyici ile Native Node’u Dağıtma

[Wallarm Native Node](../nginx-native-node-internals.md), NGINX’ten bağımsız çalışır, Wallarm bağlayıcılarının self-hosted dağıtımı ve TCP trafik yansıtma analizine yönelik tasarlanmıştır. Native Node’u, all-in-one yükleyici kullanarak Linux işletim sistemine sahip bir sanal makinede çalıştırabilirsiniz.

## Kullanım durumları ve dağıtım modları

* MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) için bir bağlayıcı çözümün parçası olarak Wallarm düğümünü self-hosted Linux OS makinesine dağıtmak istediğinizde.

    Yükleyiciyi `connector-server` modunda kullanın.
* [TCP trafik yansıtma analizi](../oob/tcp-traffic-mirror/deployment.md) için bir güvenlik çözümüne ihtiyaç duyduğunuzda.
    
    Yükleyiciyi `tcp-capture` modunda kullanın.
* Istio tarafından yönetilen API’ler için [gRPC tabanlı harici işleme filtresine](../connectors/istio.md) ihtiyaç duyduğunuzda.
    
    Yükleyiciyi `envoy-external-filter` modunda kullanın.

## Gereksinimler

All-in-one yükleyici ile Native Node’u çalıştırmak için kullanılan makine aşağıdaki kriterleri karşılamalıdır:

* Linux işletim sistemi.
* x86_64/ARM64 mimarisi.
* Tüm komutların yetkili kullanıcı olarak çalıştırılması (ör. `root`).
* Şu adreslere giden bağlantı:

    * Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kurallarının ve [API spesifikasyonlarının][api-spec-enforcement-docs] güncellemelerini indirmek ve [allowlisted, denylisted veya graylisted][ip-list-docs] ülkelerinizin, bölgelerinizin veya veri merkezlerinizin kesin IP’lerini almak için aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Düğüm `connector-server` veya `envoy_external_filter` modunda çalıştırıldığında, makinenin alan adı için bir **güvenilir** SSL/TLS sertifikası çıkartılmalı ve özel anahtarıyla birlikte makineye yüklenmelidir.
* Düğüm `tcp-capture` modunda çalıştırıldığında:
    
    * Trafik ve yanıt yansıtma, hem kaynak hem hedef ayarlanarak yapılandırılmalı ve hazırlanan örnek yansıtma hedefi olarak seçilmelidir. Trafik yansıtma yapılandırmaları için belirli protokollere izin verilmesi gibi özel ortam gereksinimleri karşılanmalıdır.
    * Yansıtılan trafik VLAN (802.1q), VXLAN veya SPAN ile etiketlenmelidir.
* Bunlara ek olarak, Wallarm Console’da **Administrator** rolüne sahip olmalısınız.

## Sınırlamalar

* All-in-one yükleyici `connector-server` veya `envoy_external_filter` modunda kullanıldığında, makinenin alan adı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Self-signed sertifikalar henüz desteklenmemektedir.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.
* Wallarm kuralı ile [oransal sınırlama (rate limiting)](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Kurulum

### 1. Wallarm token’ını hazırlayın

Düğümü Wallarm Cloud’da kaydetmek için bir token’a ihtiyacınız olacak. Token’ı hazırlamak için:

1. Wallarm Console → **Settings** → **API tokens**’ı [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutu](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
1. `Node deployment/Deployment` kullanım türüne sahip bir API token’ı bulun veya oluşturun.
1. Bu token’ı kopyalayın.

### 2. Wallarm yükleyicisini indirin

Wallarm kurulum betiğini indirin ve çalıştırılabilir yapın:

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

### 3. Yapılandırma dosyasını hazırlayın

Makinede aşağıdaki asgari yapılandırma ile `wallarm-node-conf.yaml` dosyasını oluşturun:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    `connector.tls_cert` ve `connector.tls_key` alanlarında, makinenin alan adı için çıkarılmış **güvenilir** sertifika ve özel anahtarın yollarını belirtirsiniz.
=== "tcp-capture"
    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    `goreplay.filter` parametresinde, trafğin yakalanacağı ağ arayüzünü belirtirsiniz. Ana makinede mevcut ağ arayüzlerini kontrol etmek için:

    ```
    ip addr show
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

    `envoy_external_filter.tls_cert` ve `envoy_external_filter.tls_key` alanlarında, makinenin alan adı için çıkarılmış **güvenilir** sertifika ve özel anahtarın yollarını belirtirsiniz.

[Tüm yapılandırma parametreleri](all-in-one-conf.md)

### 4. Yükleyiciyi çalıştırın

=== "connector-server"
    x86_64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    x86_64 yükleyici sürümü için:
        
    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "envoy-external-filter"
    x86_64 yükleyici sürümü için:
        
    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64 yükleyici sürümü için:

    ```bash
    # ABD Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # AB Bulutu
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI’da düğümlerin mantıksal gruplaması için kullanılır).
* `<API_TOKEN>`, `Node deployment/Deployment` kullanım türüne sahip oluşturulmuş API token’ını belirtir.
* `<PATH_TO_CONFIG>`, önceden hazırlanan yapılandırma dosyasının yolunu belirtir.

Sağlanan yapılandırma dosyası şu yola kopyalanacaktır: `/opt/wallarm/etc/wallarm/go-node.yaml`.

Gerekirse, kurulum tamamlandıktan sonra kopyalanan dosyayı değiştirebilirsiniz. Değişiklikleri uygulamak için `sudo systemctl restart wallarm` komutu ile Wallarm servisinin yeniden başlatılması gerekir.

### 5. Kurulumu tamamlayın

=== "connector-server"
    Düğümü dağıttıktan sonra, trafiği dağıtılan düğüme yönlendirmek amacıyla API yönetim platformunuza veya servisinize Wallarm kodunu uygulamak bir sonraki adımdır.

    1. Bağlayıcınız için Wallarm kod paketini almak üzere sales@wallarm.com ile iletişime geçin.
    1. Paketi API yönetim platformunuza uygulamak için platforma özel talimatları izleyin:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
=== "tcp-capture"
    [Dağıtım testine geçin](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).
=== "envoy-external-filter"
    Düğümü dağıttıktan sonra, bir sonraki adım [trafiği düğüme iletmek için Envoy ayarlarını güncellemektir](../connectors/istio.md#2-configure-envoy-to-proxy-traffic-to-the-wallarm-node).

## Düğümün çalışmasını doğrulama

Düğümün trafiği algıladığını doğrulamak için logları kontrol edebilirsiniz:

* Native Node logları varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır.
* Verilerin Wallarm Cloud’a gönderilip gönderilmediği, algılanan saldırılar vb. gibi filtreleme düğümünün [standart logları](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde bulunur.
* Ek hata ayıklama için, [`log.level`](all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

Ayrıca, `http://<NODE_IP>:9000/metrics` adresinde sunulan [Prometheus metriklerini](../../admin-en/native-node-metrics.md) kontrol ederek de Düğümün çalışmasını doğrulayabilirsiniz.

## Yükleyici başlatma seçenekleri

* All-in-one betiği indirildiği anda, betik hakkında **yardım** almak için:

    === "x86_64 sürümü"
        ```
        sudo ./aio-native-0.17.1.x86_64.sh -- --help
        ```
    === "ARM64 sürümü"
        ```
        sudo ./aio-native-0.17.1.aarch64.sh -- --help
        ```
* Yükleyiciyi **etkileşimli** modda da çalıştırabilir ve ilk adımda gerekli modu seçebilirsiniz:

    === "x86_64 sürümü"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh
        ```
    === "ARM64 sürümü"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh
        ```
* <a name="apid-only-mode"></a>Düğümü yalnızca API Discovery modunda kullanabilirsiniz (sürüm 0.12.1’den itibaren mevcuttur). Bu modda, Düğümün yerleşik mekanizmalarıyla tespit edilen ve ek yapılandırma gerektiren (örn. kimlik bilgisi doldurma, API spesifikasyonu ihlal girişimleri ve denylisted ile graylisted IP’lerden gelen kötü amaçlı etkinlik) saldırılar tespit edilir ve yerelde engellenir (etkinleştirilmişse), ancak Wallarm Cloud’a aktarılmaz. Cloud’da saldırı verisi bulunmadığından [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) çalışmaz. Whitelist’teki IP’lerden gelen trafik ise izinlidir.

    Bu arada, [API Keşfi](../../api-discovery/overview.md), [API oturum takibi](../../api-sessions/overview.md) ve [güvenlik açığı tespiti](../../about-wallarm/detecting-vulnerabilities.md) tamamen işlevsel olmaya devam eder, ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud’a yükler.

    Bu mod, önce API envanterlerini gözden geçirmek ve hassas verileri belirlemek, ardından kontrollü saldırı verisi aktarımı planlamak isteyenler içindir. Ancak, saldırı aktarımını devre dışı bırakmak nadirdir; zira Wallarm saldırı verilerini güvenli bir şekilde işler ve gerekirse [hassas saldırı verisi maskelemesi](../../user-guides/rules/sensitive-data-rule.md) sağlar.

    API Discovery-only modunu etkinleştirmek için:

    1. `/etc/wallarm-override/env.list` dosyasını oluşturun veya değiştirin:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        Aşağıdaki değişkeni ekleyin:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [Düğüm kurulum prosedürünü](#installation) izleyin.

    API Discovery-only modu etkinleştirildiğinde, `/opt/wallarm/var/log/wallarm/wcli-out.log` logu aşağıdaki mesajı döndürür:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

## Yükseltme ve yeniden kurulum

* Düğümü yükseltmek için [talimatları](../../updating-migrating/native-node/all-in-one.md) izleyin.
* Yükseltme veya yeniden kurulum sürecinde bir sorun varsa:

    1. Mevcut kurulumu kaldırın:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Yukarıdaki kurulum adımlarını izleyerek düğümü normal şekilde kurun.