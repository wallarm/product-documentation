[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md

# AWS AMI ile Native Node Dağıtımı

[NGINX’ten bağımsız çalışan Wallarm Native Node](../nginx-native-node-internals.md), Wallarm connector’ının self-hosted dağıtımı ve TCP trafik yansıtma analizine yönelik tasarlanmıştır. Native Node’u [AWS AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6) kullanarak bir AWS instance’ında çalıştırabilirsiniz.

AMI, Debian 12 tabanlıdır ve all-in-one installer’ı içerir. Bu installer, Node’u dağıtmak ve yapılandırmak için kullanılan Wallarm betiğidir. AMI’den bir instance başlattıktan sonra kurulumu tamamlamak için bu betiği çalıştıracaksınız.

AMI’den AWS üzerinde Wallarm Node dağıtımı genellikle yaklaşık 10 dakika sürer.

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS root hesabını kullanmaktan kaçınmanızı öneririz. Bunun yerine, yalnızca gerekli izinlere sahip IAM kullanıcıları veya rollerini kullanın.

    Dağıtım süreci en az ayrıcalık ilkesini varsayar ve Wallarm bileşenlerini sağlamak ve çalıştırmak için gereken minimum erişimi verir.

Bu dağıtım için AWS altyapı maliyetlerini tahmin etmeye yönelik rehber için [AWS’de Wallarm Dağıtımı için Maliyet Rehberi](../cloud-platforms/aws/costs.md) sayfasına bakın.

## Kullanım senaryoları ve dağıtım modları

* AWS üzerinde MuleSoft [Mule](../connectors/mulesoft.md) Gateway, [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) için bir connector çözümünün parçası olarak bir Wallarm node dağıtırken.

    Görüntüyü `connector-server` modunda çalıştırın.
* [TCP trafik yansıtma analizi](../oob/tcp-traffic-mirror/deployment.md) için bir güvenlik çözümüne ihtiyaç duyduğunuzda ve altyapınız AWS üzerinde olduğunda.
    
    Görüntüyü `tcp-capture` modunda çalıştırın.

    !!! info "`tcp-capture` modunun sınırlamaları"
        * Çözüm yalnızca ham TCP üzerinden şifrelenmemiş HTTP trafiğini analiz eder, şifrelenmiş HTTPS trafiğini analiz etmez.
        * Çözüm henüz HTTP keep-alive bağlantıları üzerinden gelen yanıtlara ait ayrıştırmayı desteklemez.

## Gereksinimler

* Bir AWS hesabı
* AWS EC2, Security Groups hakkında bilgi
* İstediğiniz herhangi bir AWS bölgesi; Wallarm node dağıtımı için bölgeye özel bir kısıtlama yoktur

    Wallarm, tek availability zone (AZ) ve çoklu availability zone dağıtımlarını destekler. Çoklu-AZ kurulumlarında, Wallarm Node’lar ayrı availability zone’larda başlatılabilir ve yüksek erişilebilirlik için bir Load Balancer arkasına yerleştirilebilir.
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* Tüm komutların Wallarm EC2 instance’ında süper kullanıcı (ör. `root`) olarak yürütülmesi
* `connector-server` modunda çalıştırırken, makinenin etki alanı için **güvenilir** bir SSL/TLS sertifikası düzenlenmeli ve özel anahtarla birlikte makineye yüklenmelidir
* `tcp-capture` modunda çalıştırırken:
    
    * Trafik ve yanıt yansıtma hem kaynak hem de hedef ile yapılandırılmalı ve hazırlanan instance yansıtma hedefi olarak seçilmelidir. Trafik yansıtma yapılandırmaları için belirli protokollere izin verilmesi gibi belirli ortam gereksinimleri karşılanmalıdır.
    * Yansıtılan trafik VLAN (802.1q), VXLAN veya SPAN ile etiketlenmelidir.
    * Ham TCP üzerinden şifrelenmemiş HTTP trafiği, şifrelenmiş HTTPS trafiği değil.

## Sınırlamalar

* Node’u `connector-server` modunda kullanırken, makinenin etki alanı için **güvenilir** bir SSL/TLS sertifikası gereklidir. Kendi imzaladığınız sertifikalar henüz desteklenmemektedir.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.
* Wallarm kuralı ile [rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmez.
* [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

<a name="installation"></a>
## Kurulum

### 1. Bir Wallarm Node instance’ı başlatın

[Wallarm Native Node AMI](https://aws.amazon.com/marketplace/pp/prodview-3d5ne4ruxm6j6) kullanarak bir EC2 instance’ı başlatın.

Önerilen yapılandırma:

* En son mevcut [AMI sürümü](../../updating-migrating/native-node/node-artifact-versions.md#amazon-machine-image-ami)
* Herhangi bir tercih edilen AWS bölgesi
* EC2 instance türü: `t3.medium` veya `t3.large`, [ayrıntılar için maliyet rehberine bakın](../cloud-platforms/aws/costs.md)
* Altyapınıza bağlı olarak uygun [VPC ve alt ağ](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) inbound erişimi, [Node yapılandırmasında](#5-prepare-the-configuration-file) tanımlanan porta
* [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) outbound erişimi:

    * Wallarm installer’ını indirmek için `https://meganode.wallarm.com`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API specifications][api-spec-enforcement-docs] güncellemelerini indirmek ve ayrıca [allowlisted, denylisted veya graylisted][ip-list-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak için aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Instance’a erişim için SSH anahtar çifti

### 2. Node instance’ına SSH ile bağlanın

Çalışan EC2 instance’ınıza bağlanmak için [seçtiğiniz SSH anahtarını kullanın](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html):

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

Instance’a bağlanmak için `admin` kullanıcı adını kullanmanız gerekir.

### 3. Wallarm token’ını hazırlayın

Node’u Wallarm Cloud’a kaydetmek için bir API token’ına ihtiyacınız var:

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde Wallarm Console → **Settings** → **API tokens**’ı açın.
1. `Node deployment/Deployment` kullanım türüne sahip API token’ını bulun veya oluşturun.
1. Bu token’ı kopyalayın.

### 4. TLS sertifikalarını yükleyin

`connector-server` modu için, instance’ın etki alanı adına **güvenilir** bir TLS sertifikası ve özel anahtar düzenleyin. Bu dosyalar instance içinde erişilebilir olmalı ve sonraki yapılandırmada referans verilmelidir.

Sertifika ve anahtar dosyalarını `scp`, `rsync` veya başka bir yöntemle EC2 instance’ına yükleyin, örn.:

```
scp -i <your-key.pem> tls-cert.crt tls-key.key admin@<your-ec2-public-ip>:~
```

<a name="5-prepare-the-configuration-file"></a>
### 5. Yapılandırma dosyasını hazırlayın

EC2 instance’ında, aşağıdaki minimal yapılandırmalardan biriyle `wallarm-node-conf.yaml` adlı bir dosya oluşturun:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    `connector.tls_cert` ve `connector.tls_key` içinde, makinenin etki alanı için düzenlenmiş **güvenilir** sertifika ve özel anahtarın yollarını belirtirsiniz.
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

    `goreplay.filter` parametresinde, trafikten yakalama yapılacak ağ arayüzünü belirtirsiniz. Ana makinede mevcut ağ arayüzlerini kontrol etmek için:

    ```
    ip addr show
    ```

[Tüm yapılandırma parametreleri](all-in-one-conf.md)

### 6. Node kurulum betiğini çalıştırın

EC2 instance’ında installer’ı çalıştırın:

=== "connector-server"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```
=== "tcp-capture"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=./wallarm-node-conf.yaml --host api.wallarm.com
    ```

* `WALLARM_LABELS` değişkeni, node’un ekleneceği group’u ayarlar (Wallarm Console UI içinde node’ların mantıksal gruplanması için kullanılır).
* `<API_TOKEN>`, `Node deployment/Deployment` kullanım türü için oluşturulan API token’ını belirtir.
* `--go-node-config`, önceden hazırlanan yapılandırma dosyasının yolunu belirtir.

Sağlanan yapılandırma dosyası şu yola kopyalanacaktır: `/opt/wallarm/etc/wallarm/go-node.yaml`.

Gerekirse, kurulum tamamlandıktan sonra kopyalanan dosyada değişiklik yapabilirsiniz. Değişiklikleri uygulamak için `sudo systemctl restart wallarm` komutuyla Wallarm servisini yeniden başlatmanız gerekir.

### 7. Kurulumu tamamlayın

=== "connector-server"
    Node’u dağıttıktan sonra, bir sonraki adım, trafiği dağıtılan node’a yönlendirmek için Wallarm kodunu API yönetim platformunuza veya hizmetinize uygulamaktır.

    1. Connector’ınız için Wallarm kod paketini edinmek üzere sales@wallarm.com ile iletişime geçin.
    1. Paketi API yönetim platformunuza uygulamak için platforma özel talimatları izleyin:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly) 
=== "tcp-capture"
    [Dağıtım testine geçin](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).

## Node’un çalışmasını doğrulama

Node’un trafiği tespit ettiğini doğrulamak için log’ları kontrol edebilirsiniz:

* Native Node log’ları varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır.
* Verilerin Wallarm Cloud’a gönderilip gönderilmediği, tespit edilen saldırılar vb. [standart log’lar](../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde bulunur.
* Ek hata ayıklama için, [`log.level`](all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

Ayrıca Node’un çalışmasını, `http://<NODE_IP>:9000/metrics.` adresinde sunulan [Prometheus metriklerini](../../admin-en/native-node-metrics.md) kontrol ederek de doğrulayabilirsiniz.

## Installer başlatma seçenekleri

AMI, aşağıdaki başlatma seçeneklerine sahip bir installer betiği içerir:

* Betik hakkında **yardım** alın:

    ```
    sudo ./aio-native-0.14.0.x86_64.sh -- --help
    ```
* Installer’ı **etkileşimli** modda çalıştırın ve 1. adımda gerekli modu seçin:

    ```
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.14.0.x86_64.sh
    ```
* <a name="apid-only-mode"></a>Node’u yalnızca API Discovery modunda kullanabilirsiniz. Bu modda, Node’un yerleşik mekanizmalarıyla tespit edilen ve ek yapılandırma gerektiren (ör. kimlik bilgisi doldurma, API specification ihlali girişimleri ve denylisted ve graylisted IP’lerden gelen kötü amaçlı etkinlik) saldırılar yerel olarak (etkinleştirilmişse) tespit edilir ve engellenir, ancak Wallarm Cloud’a aktarılmaz. Cloud’da saldırı verisi olmadığından [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) çalışmaz. Allowlist’teki IP’lerden gelen trafik izinlidir.

    Bu arada, [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md) ve [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) tam işlevselliklerini korur, ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud’a yükler.

    Bu mod, önce API envanterini gözden geçirmek ve hassas verileri belirlemek, ardından kontrollü saldırı verisi aktarımını planlamak isteyenler içindir. Ancak, Wallarm saldırı verilerini güvenli bir şekilde işlediği ve gerekirse [sensitive attack data masking](../../user-guides/rules/sensitive-data-rule.md) sağladığı için saldırı verisi aktarımını devre dışı bırakmak nadirdir.

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
    
    1. [Node kurulum prosedürünü](#installation) izleyin.

    API Discovery-only modu etkinleştirildiğinde, `/opt/wallarm/var/log/wallarm/wcli-out.log` log’u aşağıdaki mesajı döndürür:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

<!-- ## Upgrade and reinstallation

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/all-in-one.md). -->