Hepsi bir arada betiği indirdiğiniz anda, aşağıdaki komutla yardım alabilirsiniz:

```
sudo sh ./wallarm-6.5.1.x86_64-glibc.sh -- -h
```

Bu da şunu döndürür:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
    --install-only          Initiates the first stage of the all-in-one installer in batch mode. Copies essential configurations, including files and binaries, and sets up NGINX for node installation, bypassing Cloud registration and activation. Requires --batch.
    --skip-ngx-config       Avoids automatic NGINX configuration changes that occur during the --install-only stage in batch mode, suitable for users who prefer manual adjustments later. When used with --install-only, it ensures only essential configurations are copied without altering NGINX settings. Requires --batch.
    --register-only         Initiates the second stage of the all-in-one installer in batch mode, completing the setup by registering the node in the Cloud and starting its service. Requires --batch.
-t, --token TOKEN           Node token, required in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

### Toplu mod

`--batch` seçeneği, betiğin gerekli yapılandırma seçeneklerini `--token` ve `--cloud` bayrakları ile, gerekirse `WALLARM_LABELS` ortam değişkeni üzerinden aldığı toplu (etkileşimsiz) modu tetikler. Bu modda, betik varsayılan modda olduğu gibi kullanıcıdan adım adım veri istemez; bunun yerine etkileşim için açık komutlar gerektirir.

Aşağıda, betiği düğüm kurulumu için toplu modda çalıştırmaya yönelik komut örnekleri verilmiştir; betiğin daha önce [indirilmiş][download-aio-step] olduğu varsayılmaktadır:

=== "ABD Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "AB Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Düğüm kurulum aşamalarının ayrı ayrı yürütülmesi

Bulut altyapısı için hepsi bir arada yükleyiciyi kullanarak kendi makine imajınızı hazırlarken, bu makalede açıklanan standart kurulum süreci yeterli olmayabilir. Bunun yerine, makine imajı oluşturma ve dağıtım gereksinimlerini karşılamak için hepsi bir arada yükleyicinin belirli aşamalarını ayrı ayrı yürütmeniz gerekir:

1. Makine imajını oluşturun: Bu aşamada, filtreleme düğümünün ikili dosyalarını, kütüphanelerini ve yapılandırma dosyalarını indirip bunlara dayalı bir makine imajı oluşturmak gerekir. `--install-only` bayrağını kullanarak, betik gerekli dosyaları kopyalar ve düğüm çalışması için NGINX yapılandırmalarını değiştirir. Elle düzenleme yapmak isterseniz, `--skip-ngx-config` bayrağıyla NGINX dosyası değişikliğini atlayabilirsiniz.
1. cloud-init ile bir bulut örneğini başlatın: Örnek başlatma sırasında, önyükleme aşaması (Cloud kaydı ve servisin başlatılması) cloud-init betikleri kullanılarak gerçekleştirilebilir. Bu aşama, oluşturma aşamasında kopyalanan `/opt/wallarm/setup.sh` betiğine `--register-only` bayrağı uygulanarak oluşturma aşamasından bağımsız olarak çalıştırılabilir.

Bu işlevsellik, toplu modda hepsi bir arada yükleyicinin 4.10.0 sürümünden itibaren desteklenmektedir. Aşağıdaki komutlar, belirtilen adımların sıralı olarak yürütülmesini sağlar:

=== "ABD Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.x86_64-glibc.sh
    sudo sh wallarm-6.5.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.aarch64-glibc.sh
    sudo sh wallarm-6.5.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "AB Cloud"
    ```
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.x86_64-glibc.sh
    sudo sh wallarm-6.5.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/6.5/wallarm-6.5.1.aarch64-glibc.sh
    sudo sh wallarm-6.5.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [Wallarm'ın trafiği analiz etmesini etkinleştirmeniz][enable-traffic-analysis-step] ve [NGINX'i yeniden başlatmanız][restart-nginx-step] gerekir.

### Filtreleme ve postanalytics düğümlerinin ayrı kurulumu

filtering/postanalytics anahtarı, postanalytics modülünü [ayrı][separate-postanalytics-installation-aio] kurma seçeneği sunar. Bu anahtar kullanılmadığında, varsayılan olarak filtreleme ve postanalytics bileşenleri birlikte kurulur.

### Yalnızca API Discovery modu

Düğümü Yalnızca API Discovery modunda (sürüm 5.3.7'den itibaren kullanılabilir) kullanabilirsiniz. Bu modda, saldırılar - Düğümün yerleşik mekanizmalarıyla tespit edilenler ve ek yapılandırma gerektirenler (ör. kimlik bilgisi doldurma, API spesifikasyonu ihlali girişimleri ve denylisted ile graylisted IP'lerden gelen kötü amaçlı etkinlik) - yerel olarak (etkinse) tespit edilir ve engellenir, ancak Wallarm Cloud'a aktarılmaz. Cloud'da saldırı verisi olmadığından, [Threat Replay Testing][threat-replay-testing-docs] çalışmaz. Whitelisted IP'lerden gelen trafik izinlidir.

Bu arada, [API Discovery][api-discovery-docs], [API oturum takibi][api-sessions-docs] ve [güvenlik zafiyeti tespiti][vuln-detection-docs] tamamen işlevsel kalır, ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud'a yükler.

Bu mod, önce API envanterini gözden geçirmek ve hassas verileri belirlemek, ardından kontrollü saldırı verisi aktarımı planlamak isteyenler içindir. Ancak saldırı aktarımını devre dışı bırakmak nadirdir; çünkü Wallarm saldırı verilerini güvenli şekilde işler ve gerekirse [hassas saldırı verilerinin maskelemesini][masking-sensitive-data-rule] sağlar.

Yalnızca API Discovery modunu etkinleştirmek için:

1. `/etc/wallarm-override/env.list` dosyasını oluşturun veya değiştirin:

    ```
    sudo mkdir /etc/wallarm-override
    sudo vim /etc/wallarm-override/env.list
    ```

    Aşağıdaki değişkeni ekleyin:

    ```
    WALLARM_APID_ONLY=true
    ```

1. [düğüm kurulum prosedürünü](#requirements) izleyin.

Yalnızca API Discovery modu etkinleştirildiğinde, `/opt/wallarm/var/log/wallarm/wcli-out.log` günlüğü aşağıdaki mesajı verir:

```json
{"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
```