# TCP Trafik Yansıtma Analizi için Düğüm Dağıtımı

Wallarm, TCP trafik yansıtma analizine özel tasarlanmış filtreleme düğümünü dağıtmak için bir artefakt sağlar. Bu kılavuz, Wallarm filtreleme düğümünün bu form faktörde nasıl dağıtılacağını ve yapılandırılacağını açıklar.

## Kullanım senaryoları

Desteklenen tüm [out-of-band dağıtım seçenekleri](../../supported-deployment-options.md#out-of-band) arasında, bu çözüm aşağıdaki senaryolar için önerilir:

* Ağ katmanında yansıtılan TCP trafiğini yakalamayı tercih ediyor ve bu trafiği analiz edecek bir güvenlik çözümüne ihtiyaç duyuyorsunuz.
* NGINX tabanlı dağıtım artefaktları kullanılamıyor, çok yavaş veya çok fazla kaynak tüketiyor. Bu durumda, HTTP trafik yansıtma analizi uygulaması kaynak yoğun olabilir. TCP trafik yansıtma analizi ise web sunucularından bağımsız çalışır ve bu sorunlardan kaçınır.
* Yanıtlara da ayrıştırma uygulayan, buna bağlı olarak [security vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) ve [API Discovery](../../../api-discovery/overview.md) gibi yanıt verisine dayanan özellikleri etkinleştiren bir güvenlik çözümüne ihtiyaç duyuyorsunuz.

## Nasıl çalışır

Bu çözüm bant dışı (OOB) modda çalışır, NGINX gibi web sunucularından bağımsız olarak yansıtılan TCP trafiğini doğrudan ağ arayüzünden yakalar. Yakalanan trafik daha sonra ayrıştırılır, yeniden birleştirilir ve tehditler için analiz edilir.

Bir yansı hedefi olarak çalışır ve birden çok trafik kaynağı arasında sorunsuzca geçiş yapar. Çözüm VLAN (802.1q), VXLAN veya SPAN ile etiketlenmiş trafiği destekler.

Ek olarak, çözüm yanıt yansımasını ayrıştırmayı da etkinleştirir ve yanıt verisine dayanan Wallarm özelliklerini sağlar. Bu özellikler arasında [security vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md), [API Discovery](../../../api-discovery/overview.md) ve daha fazlası bulunur.

![!TCP trafik yansıtma şeması](../../../images/waf-installation/oob/tcp-mirror-analysis.png)

## Gereksinimler

* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim.
* Düğümü çalıştırmayı planladığınız makine aşağıdaki kriterleri karşılamalıdır:

    * Linux OS
    * x86_64/ARM64 mimarisi
    * Tüm komutların süper kullanıcı (ör. `root`) olarak çalıştırılması
    * Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com` adresine giden bağlantılara izin verilmesi
    * US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com`, EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adreslerine giden bağlantılara izin verilmesi
    * Saldırı tespit kurallarına ve [API specifications](../../../api-specification-enforcement/overview.md) güncellemelerini indirmek, ayrıca [allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md) ülke, bölge veya veri merkezlerinizin kesin IP’lerini almak için aşağıdaki IP adreslerine giden bağlantılara izin verilmesi

        --8<-- "../include/wallarm-cloud-ips.md"
* Trafik ve yanıt yansıtma hem kaynak hem hedef ile yapılandırılmış olmalı ve hazırlanan örnek yansı hedefi olarak seçilmelidir. Trafik yansıtma yapılandırmaları için belirli protokollere izin verilmesi gibi belirli ortam gereksinimleri karşılanmalıdır.
* Yansıtılan trafik VLAN (802.1q), VXLAN veya SPAN ile etiketlenmiş olmalıdır. 

## Adım 1: Wallarm token’ını hazırlayın

Düğümü kurmak için, düğümü Wallarm Cloud’a kaydetmek üzere bir token gereklidir. Bir token hazırlamak için:

1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
1. Kullanım türü `Node deployment/Deployment` olan bir API token’ı bulun veya oluşturun.
1. Bu token’ı kopyalayın.

## Adım 2: Wallarm yükleyicisini indirin

Wallarm aşağıdaki işlemciler için yüklemeler sunar:

* x86_64
* ARM64

Wallarm yükleme betiğini indirmek ve çalıştırılabilir yapmak için şu komutları kullanın:

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

## Adım 3: Yapılandırma dosyasını hazırlayın

Örnekte `wallarm-node-conf.yaml` dosyasını oluşturun. Çözümün ağ arayüzünü ve trafik biçimini (ör. VLAN, VXLAN) tanımlayabilmesi için uygun yapılandırma gereklidir. Dosyanın örnek içeriği:

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: 'enp7s0:'
  extra_args:
      - -input-raw-engine
      - vxlan
```

[Makale](../../native-node/all-in-one-conf.md) içinde desteklenen diğer yapılandırma parametrelerinin listesini bulabilirsiniz.

### Modun ayarlanması (zorunlu)

TCP trafik yansıtma analizi için çözümü çalıştırmak üzere ilgili parametreye `tcp-capture` modunu belirtmek zorunludur.

### Dinleme için bir ağ arayüzü seçme

Trafiğin yakalanacağı ağ arayüzünü belirtmek için:

1. Ana makinede mevcut ağ arayüzlerini kontrol edin:

    ```
    ip addr show
    ```

1. `filter` parametresinde ağ arayüzünü belirtin.

    Değerin, ağ arayüzü ve portun iki nokta üst üste (`:`) ile ayrılmış hali olması gerektiğini unutmayın. Filtre örnekleri `eth0:`, `eth0:80` veya (tüm arayüzlerde belirli bir portu yakalamak için) `:80` şeklindedir, örneğin:

    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'eth0:'
    ```

### VLAN yakalama

Yansıtılan trafik VLAN içinde kapsüllenmişse, ek argümanlar sağlayın:

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <ağ arayüzü ve portunuz, ör. 'lo:' veya 'enp7s0:'>
  extra_args:
    - -input-raw-vlan
    - -input-raw-vlan-vid
    # VLAN'ınızın VID değeri, ör.:
    # - 42
```

### VXLAN yakalama

Yansıtılan trafik VXLAN içinde kapsüllenmişse (AWS’de yaygın), ek argümanlar sağlayın:

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <ağ arayüzü ve portunuz, ör. 'lo:' veya 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan
    # Özel VXLAN UDP portu, ör.:
    # - -input-raw-vxlan-port 
    # - 4789
    # Belirli VNI (varsayılan olarak tüm VNI'lar yakalanır), ör.:
    # - -input-raw-vxlan-vni
    # - 1
```

### Özgün istemci IP’sini ve host başlıklarını belirleme

Trafik proxy’lerden veya yük dengeleyicilerden geçtiğinde, bunlar genellikle özgün istemci IP adresini ve `Host` başlığını kendi değerleriyle değiştirir. Özgün bilgiyi korumak için bu tür aracı bileşenler genellikle `X-Forwarded-For`, `X-Real-IP` veya `X-Forwarded-Host` gibi HTTP başlıkları ekler.

Native Node’un özgün istemciyi ve hedef host’u doğru şekilde tanımlaması için [`proxy_headers`](../../native-node/all-in-one-conf.md#proxy_headers) yapılandırma bloğunu kullanın, ör.:

```yaml
version: 4

mode: tcp-capture

proxy_headers:
  # Kural 1: Şirket içi proxy’ler
  - trusted_networks:
      - 10.0.0.0/8
      - 192.168.0.0/16
    original_host:
      - X-Forwarded-Host
    real_ip:
      - X-Forwarded-For

  # Kural 2: Harici edge proxy’ler (ör., CDN, ters proxy)
  - trusted_networks:
      - 203.0.113.0/24
    original_host:
      - X-Real-Host
    real_ip:
      - X-Real-IP
```

## Adım 4: Wallarm yükleyicisini çalıştırın

TCP trafik yansıtma analizi için Wallarm düğümünü kurmak üzere aşağıdaki komutu çalıştırın:

=== "x86_64 sürümü"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64 sürümü"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* `WALLARM_LABELS` değişkeni düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplandırılması için kullanılır).
* `<API_TOKEN>`, `Node deployment/Deployment` kullanım türü için oluşturulan API token’ını belirtir.
* `<PATH_TO_CONFIG>`, önceden hazırlanmış yapılandırma dosyasının yolunu belirtir.

Sağlanan yapılandırma dosyası şu yola kopyalanacaktır: `/opt/wallarm/etc/wallarm/go-node.yaml`.

Gerekirse, kurulum tamamlandıktan sonra kopyalanan dosyayı değiştirebilirsiniz. Değişiklikleri uygulamak için `sudo systemctl restart wallarm` komutuyla Wallarm servisini yeniden başlatmanız gerekir.

## Adım 5: Çözümü test edin

Test amaçlı [Dizin Geçişi](../../../attacks-vulns-list.md#path-traversal) saldırısını, `<MIRROR_SOURCE_ADDRESS>` değerini örneğin gerçek IP adresi veya DNS adıyla değiştirerek yansı kaynağı adresine gönderin:

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

Wallarm’ın TCP trafik yansıtma analizi çözümü bant dışı çalıştığından, saldırıları engellemez, yalnızca kaydeder.

Saldırının kaydedildiğini doğrulamak için Wallarm Console → **Events** bölümüne gidin:

![!Arayüzde saldırılar](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Düğümün çalışmasını doğrulama

* Yakalamaya çalıştığınız ağ arayüzünde trafik olup olmadığını kontrol etmek için makinenizde aşağıdaki komutu çalıştırın:

    ```
    sudo tcpdump -i <INTERFACE_NAME>
    ```
* Düğümün trafiği tespit ettiğini doğrulamak için günlükleri kontrol edebilirsiniz:

    * Native Node günlükleri varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır.
    * Verilerin Wallarm Cloud’a gönderilip gönderilmediği, tespit edilen saldırılar vb. gibi filtreleme düğümünün [standart günlükleri](../../../admin-en/configure-logging.md) `/opt/wallarm/var/log/wallarm` dizininde bulunur.

Ek hata ayıklama için [`log.level`](../../native-node/all-in-one-conf.md#loglevel) parametresini `debug` olarak ayarlayın.

## Yükleyici başlatma seçenekleri

* Hepsi bir arada betiği indirdikten sonra, bununla ilgili **yardımı** şu şekilde alabilirsiniz:

    === "x86_64 sürümü"
        ```
        sudo ./aio-native-0.17.1.x86_64.sh -- --help
        ```
    === "ARM64 sürümü"
        ```
        sudo ./aio-native-0.17.1.aarch64.sh -- --help
        ```
* Yükleyiciyi **etkileşimli** modda da çalıştırabilir ve 1. adımda `tcp-capture` modunu seçebilirsiniz:

    === "x86_64 sürümü"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.x86_64.sh
        ```
    === "ARM64 sürümü"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.17.1.aarch64.sh
        ```
* Düğümü yalnızca API Discovery modunda kullanabilirsiniz (sürüm 0.12.1’den itibaren mevcuttur). Bu modda, düğümün yerleşik mekanizmalarıyla veya ek yapılandırma gerektirenlerle (ör., kimlik bilgisi doldurma, API spesifikasyonu ihlali girişimleri ve brute force) tespit edilen saldırılar yerel olarak [loglanır](../../../admin-en/configure-logging.md) ancak Wallarm Cloud’a aktarılmaz. Cloud’da saldırı verisi olmadığından [Threat Replay Testing](../../../vulnerability-detection/threat-replay-testing/overview.md) çalışmaz.

    Bu sırada, [API Discovery](../../../api-discovery/overview.md), [API session tracking](../../../api-sessions/overview.md) ve [security vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) tamamen işlevseldir; ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud’a yükler.

    Bu mod, önce API envanterlerini gözden geçirmek ve hassas verileri belirlemek isteyenler ve buna göre kontrollü saldırı verisi aktarımı planlayanlar içindir. Ancak saldırı verisi aktarımını devre dışı bırakmak nadirdir, çünkü Wallarm saldırı verisini güvenle işler ve gerekirse [sensitive attack data masking](../../../user-guides/rules/sensitive-data-rule.md) sağlar.

    Yalnızca API Discovery modunu etkinleştirmek için:

    1. `/etc/wallarm-override/env.list` dosyasını oluşturun veya düzenleyin:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        Aşağıdaki değişkeni ekleyin:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. [1. adımdaki düğüm kurulum prosedürünü](#step-1-prepare-wallarm-token) izleyin.

## Yükseltme ve yeniden kurulum

* Düğümü yükseltmek için [talimatları](../../../updating-migrating/native-node/all-in-one.md) izleyin.
* Yükseltme veya yeniden kurulum sürecinde bir sorun varsa:

    1. Mevcut kurulumu kaldırın:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Yukarıdaki kurulum adımlarını izleyerek düğümü her zamanki gibi kurun.

## Sınırlamalar

* Trafiği gerçek akıştan bağımsız analiz eden bant dışı (OOB) çalışma nedeniyle, çözümün bazı doğal sınırlamaları vardır:

    * Kötü amaçlı istekleri anında engellemez. Wallarm yalnızca saldırıları gözlemler ve size [Wallarm Console’daki ayrıntıları](../../../user-guides/events/check-attack.md) sağlar.
    * Hedef sunuculardaki yükü sınırlandırmak mümkün olmadığından [Rate limiting](../../../user-guides/rules/rate-limiting.md) desteklenmez.
    * [IP adreslerine göre filtreleme](../../../user-guides/ip-lists/overview.md) desteklenmez.
* Çözüm yalnızca ham TCP üzerinden şifrelenmemiş HTTP trafiğini analiz eder, şifrelenmiş HTTPS trafiğini analiz etmez.
* Çözüm henüz HTTP keep-alive bağlantıları üzerindeki yanıtların ayrıştırılmasını desteklemez.