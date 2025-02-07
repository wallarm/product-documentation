# TCP Trafik Aynalama Analizi için Node Dağıtımı

Wallarm, TCP trafik aynalama analizi için özel olarak tasarlanmış filtreleme nodunun dağıtımı için bir artefakt sunar. Bu kılavuz, bu form faktöründeki Wallarm filtreleme nodunun nasıl dağıtılacağını ve yapılandırılacağını açıklar.

## Kullanım durumları

Tüm desteklenen [out-of-band deployment options](../../supported-deployment-options.md#out-of-band) arasında, bu çözüm aşağıdaki senaryolar için önerilir:

* Ağ katmanında aynalanan TCP trafiğini yakalamayı tercih ediyor ve bu belirli trafiği analiz edecek bir güvenlik çözümüne ihtiyaç duyuyorsanız.
* NGINX veya Envoy tabanlı dağıtım artefaktları mevcut değil, çok yavaş çalışıyor veya çok fazla kaynak tüketiyorsa. Bu durumda, HTTP trafik aynalama analizi gerçekleştirmek kaynak yoğun olabilir. TCP trafik aynalama analizi, web sunucularından bağımsız olarak çalıştığından bu sorunların önüne geçer.
* Yanıt verilerini temel alan [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) ve [API discovery](../../../api-discovery/overview.md) gibi özelliklere ihtiyaç duyuyorsanız; bu özellikler yanıt verilerine dayalı olarak çalışır.

## Nasıl Çalışır

Bu çözüm, web sunucuları (örneğin, NGINX) gibi sunuculardan bağımsız olarak, ağ arayüzünden doğrudan aynalanan TCP trafiğini yakalayan out-of-band (OOB) modunda çalışır. Yakalanan trafik daha sonra ayrıştırılır, yeniden birleştirilir ve tehditlere karşı analiz edilir.

Çözüm, bir ayna hedefi olarak çalışır ve birden fazla trafik kaynağı arasında sorunsuzca geçiş yapar. Çözüm, VLAN (802.1q), VXLAN veya SPAN ile etiketlenmiş trafiği destekler.

Ayrıca, çözüm, yanıt aynalama ayrıştırmasını etkinleştirerek, yanıt verilerine dayalı Wallarm özelliklerini sunar. Bu özellikler arasında [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md), [API discovery](../../../api-discovery/overview.md) ve daha fazlası bulunur.

![!TCP traffic mirror scheme](../../../images/waf-installation/oob/tcp-mirror-analysis.png)

## Gereksinimler

* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip bir hesaba erişim.
* Node çalıştırılması planlanan makinenin aşağıdaki kriterlere uygun olması gerekir:

    * Linux OS
    * x86_64/ARM64 mimarisi
    * Tüm komutların süper kullanıcı (örneğin, `root`) olarak yürütülmesi.
    * Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com` adresine giden izinli dış bağlantılar
    * US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine giden izinli dış bağlantılar
    * Saldırı tespit kuralları ve [API specifications](../../../api-specification-enforcement/overview.md) güncellemelerini indirmek, ayrıca [allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine izinli dış bağlantılar

        --8<-- "../include/wallarm-cloud-ips.md"
* Trafik ve yanıt aynalama, hem kaynak hem de hedef yapılandırması ile yapılandırılmalı ve ayna hedefi olarak seçilmiş hazır bir örnek kullanılmalıdır. Trafik aynalama yapılandırmaları için belirli protokollerin izin verilmesi gibi spesifik ortam gereksinimleri karşılanmalıdır.
* Aynalanan trafik, VLAN (802.1q), VXLAN veya SPAN ile etiketlenir.

## Adım 1: Wallarm token'ını Hazırlayın

Node'u yüklemek için Wallarm Cloud'a node kaydı yaptırmak amacıyla bir token gereklidir. Bir token hazırlamak için:

1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden açın.
1. `Deploy` source rolüne sahip API token'ı bulun veya oluşturun.
1. Bu token'ı kopyalayın.

## Adım 2: Wallarm Yükleyicisini İndirin

Wallarm, aşağıdaki işlemciler için yükleme önerir:

* x86_64
* ARM64

Wallarm yükleme betiğini indirmek ve çalıştırılabilir hale getirmek için aşağıdaki komutları kullanın:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.x86_64.sh
    chmod +x aio-native-0.11.0.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.11.0.aarch64.sh
    chmod +x aio-native-0.11.0.aarch64.sh
    ```

## Adım 3: Yapılandırma Dosyasını Hazırlayın

Örnekteki içeriğe sahip `wallarm-node-conf.yaml` dosyasını örnekte belirtilen instance üzerinde oluşturun. Çözüm, ağ arayüzünü ve trafik formatını (örneğin, VLAN, VXLAN) belirlemek için uygun yapılandırmayı gerektirir. Dosyanın örnek içeriği:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: 'enp7s0:'
  extra_args:
      - -input-raw-engine
      - vxlan
```

[Makale](../../native-node/all-in-one-conf.md)'de daha fazla desteklenen yapılandırma parametresinin listesini bulabilirsiniz.

### Modu Ayarlama (gerekli)

TCP trafik aynalama analizi için çözümü çalıştırmak adına ilgili parametrede `tcp-capture` modunun belirtilmesi gerekmektedir.

### Dinleme için Ağ Arayüzü Seçimi

Trafiği yakalamak için ağ arayüzünü belirtmek amacıyla:

1. Host üzerinde mevcut ağ arayüzlerini kontrol edin:

    ```
    ip addr show
    ```

1. `filter` parametresinde ağ arayüzünü belirtin.

    Değerin, ağ arayüzü ve portun iki nokta (`:`) ile ayrılması gerektiğine dikkat edin. Filtre örnekleri arasında `eth0:`, `eth0:80` veya `:80` (tüm arayüzlerde belirli bir portu yakalamak için) bulunmaktadır, örneğin:

    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: 'eth0:'
    ```

### VLAN Yakalama

Aynalanan trafik VLAN içerisinde paketlenmişse, ek argümanlar sağlayın:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-vlan
    - -input-raw-vlan-vid
    # VLAN'iniz için VID, örneğin:
    # - 42
```

### VXLAN Yakalama

Aynalanan trafik VXLAN içerisinde (AWS gibi ortamlar için yaygın) paketlenmişse, ek argümanlar sağlayın:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan
    # Özel VXLAN UDP portu, örneğin:
    # - -input-raw-vxlan-port 
    # - 4789
    # Belirli VNI (varsayılan olarak tüm VNI'lar yakalanır), örneğin:
    # - -input-raw-vxlan-vni
    # - 1
```

### Orijinal İstemci IP Adresinin Belirlenmesi

Varsayılan olarak, Wallarm kaynak IP adresini ağ paketlerinin IP başlıklarından okur. Ancak, proxy'ler ve yük dengeleyiciler kendi IP'lerini değiştirebilir.

Gerçek istemci IP'sini korumak için, bu ara katmanlar genellikle orijinal istemci IP'sini çıkarmak amacıyla bir HTTP başlığı ekler (örneğin, `X-Real-IP`, `X-Forwarded-For`). `real_ip_header` parametresi, Wallarm'ın orijinal istemci IP'sini çıkarmak için hangi başlığı kullanacağını belirtir, örneğin:

```yaml
version: 3

mode: tcp-capture

http_inspector:
  real_ip_header: "X-Real-IP"
```

## Adım 4: Wallarm Yükleyicisini Çalıştırın

TCP trafik aynalama analizi için Wallarm node'unu yüklemek adına, aşağıdaki komutu çalıştırın:

=== "x86_64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* `WALLARM_LABELS` değişkeni, node'un Wallarm Console arayüzünde mantıksal gruplama için ekleneceği grubu belirler.
* `<API_TOKEN>`, `Deploy` rolü için oluşturulan API token'ını belirtir.
* `<PATH_TO_CONFIG>`, daha önce hazırlanan yapılandırma dosyasının yolunu belirtir.

Sağlanan yapılandırma dosyası şu yola kopyalanacaktır: `/opt/wallarm/etc/wallarm/go-node.yaml`.

Gerekirse, yükleme tamamlandıktan sonra kopyalanan dosyada değişiklik yapabilirsiniz. Değişiklikleri uygulamak için Wallarm servisini `sudo systemctl restart wallarm` komutu ile yeniden başlatmanız gerekir.

## Adım 5: Çözümü Test Edin

Ayna kaynak adresine gerçek IP adress veya DNS adı ile `<MIRROR_SOURCE_ADDRESS>` yerine değiştirerek test [Path Traversal](../../../attacks-vulns-list.md#path-traversal) saldırısını gönderin:

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

TCP trafik aynalama analizi için Wallarm çözümü out-of-band olarak çalıştığından saldırıları engellemez, sadece kaydeder.

Saldırının kaydedildiğini kontrol etmek için Wallarm Console → **Events** bölümüne gidin:

![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Node İşleyişini Doğrulama

* Yakalamaya çalıştığınız ağ arayüzünde trafik olup olmadığını kontrol etmek için, makinenizde aşağıdaki komutu çalıştırın:

    ```
    sudo tcpdump -i <INTERFACE_NAME>
    ```
* Node'un trafiği tespit ettiğini doğrulamak için logları kontrol edebilirsiniz:

    * Native Node logları varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır.
    * Wallarm Cloud'a veri gönderilip gönderilmediği, saldırıların tespit edilip edilmediği gibi [Standard logs](../../../admin-en/configure-logging.md) filtreleme nodu logları `/opt/wallarm/var/log/wallarm` dizininde bulunur.

Ek hata ayıklama için, [`log.level`](../../native-node/all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

## Yükleyici Başlatma Seçenekleri

* All-in one script indirildikten hemen sonra, aşağıdaki komut ile **yardım** alabilirsiniz:

    === "x86_64 version"
        ```
        sudo ./aio-native-0.11.0.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.11.0.aarch64.sh -- --help
        ```
* Yükleyiciyi **etkileşimli** modda çalıştırabilir ve 1. adımda `tcp-capture` modunu seçebilirsiniz:

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.11.0.aarch64.sh
        ```
* Node'u API Discovery-only modunda kullanabilirsiniz (0.11.0 sürümünden beri mevcut). Bu modda, Node'un yerleşik mekanizmalarıyla tespit edilen saldırılar ve ek yapılandırma gerektiren saldırılar (örneğin, credential stuffing, API specification violation girişimleri ve brute force) tespit edilir ve yerel olarak [logged](../../../admin-en/configure-logging.md) edilir ancak Wallarm Cloud'a aktarılmaz. Bulutta saldırı verisi olmadığından [Threat Replay Testing](../../../vulnerability-detection/threat-replay-testing/overview.md) çalışmaz.

    Bu arada, [API Discovery](../../../api-discovery/overview.md), [API session tracking](../../../api-sessions/overview.md) ve [security vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) eksiksiz olarak çalışır; ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud'a yükler.

    Bu mod, önce API envanterinizi gözden geçirmek ve hassas verileri tanımlamak, ardından kontrollü saldırı veri aktarımı planlamak isteyenler için tasarlanmıştır. Ancak, saldırı verisi aktarımını devre dışı bırakmak nadir bir durumdur, çünkü Wallarm saldırı verilerini güvenli bir şekilde işler ve gerektiğinde [sensitive attack data masking](../../../user-guides/rules/sensitive-data-rule.md) sağlar.

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
    
    1. [node kurulum prosedürünün 1. adımını](#adım-1-prepare-wallarm-token) uygulayın.

## Yükseltme ve Yeniden Kurulum

* Node'u yükseltmek için [talimatları](../../../updating-migrating/native-node/all-in-one.md) takip edin.
* Yükseltme veya yeniden kurulum sürecinde bir sorun oluşursa:

    1. Mevcut kurulumu kaldırın:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Yukarıdaki kurulum adımlarını takip ederek node'u yeniden yükleyin.

## Kısıtlamalar

* Trafiği gerçek akıştan bağımsız olarak analiz eden out-of-band (OOB) çalışması nedeniyle, çözümün bazı doğal kısıtlamaları vardır:

    * Kötü niyetli istekleri anında engellemez. Wallarm saldırıları sadece gözlemler ve [Wallarm Console’daki detayları](../../../user-guides/events/check-attack.md) sunar.
    * Hedef sunucular üzerindeki yükü sınırlamak mümkün olmadığından [Rate limiting](../../../user-guides/rules/rate-limiting.md) desteklenmez.
    * [IP adreslerine göre filtreleme](../../../user-guides/ip-lists/overview.md) desteklenmez.
* Çözüm, yalnızca ham TCP üzerinden şifrelenmemiş HTTP trafiğini analiz eder; şifrelenmiş HTTPS trafiğini analiz etmez.
* Çözüm, halen HTTP keep-alive bağlantıları üzerinden gelen yanıtları ayrıştırmayı desteklememektedir.