```markdown
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# Native Node'un All-in-One Yükleyicisi ile Dağıtımı

[Wallarm Native Node](../nginx-native-node-internals.md), NGINX'den bağımsız olarak çalışan, Wallarm konektörünün kendi kendine barındırılan kurulumu ve TCP trafik aynalama analizi için tasarlanmıştır. Native Node'u, all-in-one yükleyici kullanarak Linux işletim sistemine sahip bir sanal makinede çalıştırabilirsiniz.

## Kullanım Durumları ve Dağıtım Modları

* Bir Wallarm node'unu, kendi kendine barındırılan Linux OS makinesinde, [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md) veya [Fastly](../connectors/fastly.md) için bir konektör çözümünün parçası olarak dağıtırken:

    Yükleyici'yi `connector-server` modunda kullanın.
* [TCP trafik aynalama analizi](../oob/tcp-traffic-mirror/deployment.md) için bir güvenlik çözümüne ihtiyaç duyduğunuzda:
    
    Yükleyici'yi `tcp-capture` modunda kullanın.

## Gereksinimler

Native Node'u, all-in-one yükleyici ile çalıştırmak için kullanılacak makine aşağıdaki kriterleri karşılamalıdır:

* Linux işletim sistemi.
* x86_64/ARM64 mimarisi.
* Tüm komutların süper kullanıcı (örn. `root`) olarak çalıştırılması.
* Aşağıdaki adreslere giden çıkış erişimi:

    * Wallarm yükleyicisini indirmek için: `https://meganode.wallarm.com`
    * US/EU Wallarm Cloud için: `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API specifications][api-spec-enforcement-docs] güncellemelerini indirmek ile [izin verilen, yasaklanmış veya gri listede olan][ip-list-docs] ülkeler, bölgeler ya da veri merkezlerine ait doğru IP'leri almak için aşağıda belirtilen IP adreslerine

        --8<-- "../include/wallarm-cloud-ips.md"
* Node'u `connector-server` modunda çalıştırırken, makinenin alanı için **güvenilir** bir SSL/TLS sertifikası düzenlenmeli ve özel anahtarıyla birlikte makineye yüklenmelidir.
* Node'u `tcp-capture` modunda çalıştırırken:
    
    * Trafik ve yanıt aynalama, hem kaynak hem de hedef yapılandırması ile ayarlanmalı ve hazırlanan örnek ayna hedefi olarak seçilmelidir. Trafik aynalama yapılandırmaları için belirli protokollere izin verilmesi gibi özel ortam gereksinimleri karşılanmalıdır.
    * Aynalanan trafik, VLAN (802.1q), VXLAN veya SPAN ile etiketlenir.
* Yukarıdakilere ek olarak, Wallarm Console'da **Administrator** rolüne sahip olmalısınız.

## Sınırlamalar

* All-in-one yükleyici `connector-server` modunda kullanılırken, makinenin alanı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Self-signed sertifikalar henüz desteklenmemektedir.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.
* Wallarm kuralı tarafından [rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Kurulum

### 1. Wallarm Token'ınızı Hazırlayın

Node'u kurmak için, Wallarm Cloud'da node kaydı oluşturmak adına bir token gereklidir. Token hazırlamak için:

1. Wallarm Console'u açın → **Settings** → **API tokens** bölümüne gidin ([US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)).
2. `Deploy` kaynak rolüne sahip bir API token'ı bulun ya da oluşturun.
3. Bu token'ı kopyalayın.

### 2. Wallarm Yükleyicisini İndirin

Wallarm kurulum script'ini indirin ve çalıştırılabilir hale getirin:

=== "x86_64 versiyonu"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64 versiyonu"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

### 3. Yapılandırma Dosyasını Hazırlayın

Makinede aşağıdaki minimal yapılandırma ile `wallarm-node-conf.yaml` dosyasını oluşturun:

=== "connector-server"
    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    Burada `connector.tls_cert` ve `connector.tls_key` alanlarında, makinenin alanı için düzenlenmiş **güvenilir** sertifika ve özel anahtarın yolunu belirtirsiniz.
=== "tcp-capture"
    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    `goreplay.filter` parametresinde, trafiğin yakalanacağı ağ arabirimini belirtirsiniz. Ana makinede mevcut ağ arabirimlerini kontrol etmek için:

    ```
    ip addr show
    ```

[All configuration parameters](all-in-one-conf.md)

### 4. Yükleyiciyi Çalıştırın

=== "connector-server"
    x86_64 yükleyici versiyonu için:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64 yükleyici versiyonu için:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    x86_64 yükleyici versiyonu için:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    ARM64 yükleyici versiyonu için:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* WALLARM_LABELS değişkeni, node'un eklenmesi gereken grubu ayarlar (Wallarm Console UI'da node'ların mantıksal gruplandırılması için kullanılır).
* `<API_TOKEN>`, `Deploy` rolü için oluşturulan API token'ını belirtir.
* `<PATH_TO_CONFIG>`, daha önce hazırlanan yapılandırma dosyasının yolunu belirtir.

Sağlanan yapılandırma dosyası, `/opt/wallarm/etc/wallarm/go-node.yaml` yoluna kopyalanacaktır.

Gerekirse, kurulumu tamamladıktan sonra kopyalanan dosyayı değiştirebilirsiniz. Değişiklikleri uygulamak için Wallarm servisini `sudo systemctl restart wallarm` komutuyla yeniden başlatmanız gerekmektedir.

### 5. Kurulumu Tamamlayın

=== "connector-server"
    Node dağıtımından sonra, Wallarm kod paketini API yönetim platformunuza veya servisinize uygulayarak trafiği dağıtılan node'a yönlendirmeniz gerekmektedir.

    1. Konektörünüz için Wallarm kod paketini temin etmek üzere sales@wallarm.com ile iletişime geçin.
    2. Paket'i API yönetim platformunuzda uygulamak için platforma özel talimatları izleyin:

        * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly) 
=== "tcp-capture"
    [Dağıtım testine geçin](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).

## Node'un Çalışmasını Doğrulama

Node'un trafiği algıladığını doğrulamak için log dosyalarını kontrol edebilirsiniz:

* Native Node logları varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır.
* Wallarm Cloud'a veri gönderilip gönderilmediği, tespit edilen saldırılar vb. gibi filtreleme node'unun [standart logları](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizinindedir.

Ek hata ayıklama için, [`log.level`](all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

## Yükleyici Başlatma Seçenekleri

* All-in-one script'ini indirir indirmez, hakkında **yardım** bilgisini şu komutla alabilirsiniz:

    === "x86_64 versiyonu"
        ```
        sudo ./aio-native-0.11.0.x86_64.sh -- --help
        ```
    === "ARM64 versiyonu"
        ```
        sudo ./aio-native-0.11.0.aarch64.sh -- --help
        ```
* Ayrıca, yükleyiciyi **etkileşimli** modda çalıştırarak ilk adımda gerekli modu seçebilirsiniz:

    === "x86_64 versiyonu"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh
        ```
    === "ARM64 versiyonu"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh
        ```
* <a name="apid-only-mode"></a>Node'u API Discovery-only modunda kullanabilirsiniz (0.11.0 sürümünden itibaren kullanılabilir). Bu modda, Node'un yerleşik mekanizmaları tarafından tespit edilen ve ek yapılandırma gerektiren saldırılar (örneğin, kimlik bilgisi doldurma, API specification ihlali denemeleri ve denylisted ile graylisted IP'lerden gelen kötü amaçlı etkinlikler) yerel olarak tespit edilip (etkinse) engellenir, ancak Wallarm Cloud'a aktarılmaz. Bulutta saldırı verisi bulunmadığından, [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) çalışmaz. Beyaz listeye alınmış IP'lerden gelen trafik izin verilir.

    Bu esnada, [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md) ve [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) tamamen işlevsel kalır, ilgili güvenlik öğelerini tespit eder ve görselleştirme için buluta yükler.

    Bu mod, API envanterinizi gözden geçirip önce hassas verileri belirlemek ve ardından kontrollü saldırı verisi aktarımını planlamak isteyenler içindir. Ancak, saldırı verisi aktarımını devre dışı bırakmak nadirdir, çünkü Wallarm saldırı verilerini güvenli bir şekilde işler ve gerekiyorsa [hassas saldırı verisi maskeleme](../../user-guides/rules/sensitive-data-rule.md) sağlar.

    API Discovery-only modunu etkinleştirmek için:

    1. `/etc/wallarm-override/env.list` dosyasını oluşturun veya düzenleyin:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim env.list
        ```

        Aşağıdaki değişkeni ekleyin:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [Node kurulumu prosedürünü](#installation) izleyin.

    API Discovery-only modu etkinleştirildiğinde, `/opt/wallarm/var/log/wallarm/wcli-out.log` dosyası aşağıdaki mesajı döndürecektir:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

## Yükseltme ve Yeniden Kurulum

* Node'u yükseltmek için, [talimatları](../../updating-migrating/native-node/all-in-one.md) izleyin.
* Yükseltme veya yeniden kurulum sürecinde bir problem yaşanırsa:

    1. Mevcut kurulumu kaldırın:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Yukarıdaki kurulum adımlarını takip ederek node'u yeniden kurun.
```