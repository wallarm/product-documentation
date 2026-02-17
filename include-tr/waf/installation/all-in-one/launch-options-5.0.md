Hepsi bir arada betiği indirdikten sonra, şu komutla yardımını görebilirsiniz:

```
sudo sh ./wallarm-5.3.19.x86_64-glibc.sh -- -h
```

Şunu döndürür:

```
...
Kullanım: setup.sh [seçenekler]... [argümanlar]... [filtering/postanalytics]

SEÇENEK                   AÇIKLAMA
-b, --batch               Toplu mod, etkileşimsiz kurulum.
    --install-only        Hepsi bir arada kurucunun birinci aşamasını toplu modda başlatır. Dosyalar ve ikililer dahil temel yapılandırmaları kopyalar ve NGINX’i düğüm kurulumu için hazırlar; Cloud kaydı ve etkinleştirmesini atlar. --batch gerektirir.
    --skip-ngx-config     Toplu modda --install-only aşaması sırasında gerçekleşen otomatik NGINX yapılandırma değişikliklerini atlar; daha sonra elle ayarlama yapmak isteyen kullanıcılar için uygundur. --install-only ile birlikte kullanıldığında yalnızca temel yapılandırmaların NGINX ayarlarını değiştirmeden kopyalanmasını sağlar. --batch gerektirir.
    --register-only       Hepsi bir arada kurucunun ikinci aşamasını toplu modda başlatır; düğümü Cloud’da kaydedip servisi başlatarak kurulumu tamamlar. --batch gerektirir.
-t, --token TOKEN         Düğüm belirteci (token); toplu modda zorunludur.
-c, --cloud CLOUD         Wallarm Cloud, US/EU’den biri; varsayılan EU; yalnızca toplu modda kullanılır.
-H, --host HOST           Wallarm API adresi; örneğin, api.wallarm.com veya us1.api.wallarm.com; yalnızca toplu modda kullanılır.
-P, --port PORT           Wallarm API bağlantı noktası (port), örneğin 443.
    --no-ssl              Wallarm API erişimi için SSL’i devre dışı bırakır.
    --no-verify           SSL sertifikası doğrulamasını devre dışı bırakır.
-f, --force               Aynı ada sahip bir düğüm varsa yeni bir örnek oluşturur.
-h, --help
    --version
```

### Toplu mod

`--batch` seçeneği betiği, gerekli yapılandırma seçeneklerinin `--token` ve `--cloud` bayrakları ve gerekirse `WALLARM_LABELS` ortam değişkeni ile sağlandığı toplu (etkileşimsiz) moda geçirir. Bu modda betik, varsayılan moddaki gibi kullanıcıdan adım adım veri istemek yerine etkileşim için açık komutlar gerektirir.

Aşağıda, betiği düğüm kurulumu için toplu modda çalıştırmaya yönelik komut örnekleri yer almaktadır; betiğin daha önce [indirildiği][download-aio-step] varsayılmaktadır:

=== "US Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.19.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Düğüm kurulum aşamalarının ayrı ayrı yürütülmesi

Bulut altyapısı için hepsi bir arada kurucuyu kullanarak kendi makine imajınızı hazırlarken, bu makaledeki standart kurulum süreci yeterli olmayabilir. Bunun yerine, bir makine imajının oluşturulması ve dağıtılmasının gereksinimlerine uyum sağlamak için hepsi bir arada kurucunun belirli aşamalarını ayrı ayrı yürütmeniz gerekir:

1. Makine imajını oluşturma: Bu aşamada filtreleme düğümünün ikililerini, kütüphanelerini ve yapılandırma dosyalarını indirmek ve bunlara dayanarak bir makine imajı oluşturmak gerekir. `--install-only` bayrağını kullanarak, betik gerekli dosyaları kopyalar ve düğümün çalışması için NGINX yapılandırmalarını değiştirir. Elle ayarlama yapmak isterseniz, `--skip-ngx-config` bayrağını kullanarak NGINX dosya değişikliklerini atlayabilirsiniz.
1. Cloud-init ile bir bulut örneğini (instance) başlatma: Örnek başlatma sırasında önyükleme aşaması (Cloud kaydı ve servis başlatma) cloud-init betikleriyle yürütülebilir. Bu aşama, oluşturma (build) aşamasında kopyalanan `/opt/wallarm/setup.sh` betiğine `--register-only` bayrağı uygulanarak oluşturma aşamasından bağımsız olarak çalıştırılabilir.

Bu işlevsellik, hepsi bir arada kurucunun 4.10.0 sürümünden itibaren toplu modda desteklenir. Aşağıdaki komutlar, belirtilen adımların sıralı olarak yürütülmesini sağlar:

=== "US Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.x86_64-glibc.sh
    sudo sh wallarm-5.3.19.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.aarch64-glibc.sh
    sudo sh wallarm-5.3.19.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.x86_64-glibc.sh
    sudo sh wallarm-5.3.19.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.19.aarch64-glibc.sh
    sudo sh wallarm-5.3.19.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [Wallarm’ın trafiği analiz etmesini etkinleştirmeniz][enable-traffic-analysis-step] ve [NGINX’i yeniden başlatmanız][restart-nginx-step] gerekir.

### Filtreleme ve postanalytics düğümlerinin ayrı kurulumu

filtering/postanalytics anahtarı, postanalytics modülünü [ayrı][separate-postanalytics-installation-aio] kurma seçeneği sunar. Bu anahtar kullanılmadığında, filtreleme ve postanalytics bileşenleri varsayılan olarak birlikte kurulur.

### Yalnızca API Discovery modu

Düğümü API Discovery-only modunda kullanabilirsiniz (5.3.7 sürümünden itibaren mevcuttur). Bu modda, Düğüm’ün yerleşik mekanizmalarıyla tespit edilen ve ek yapılandırma gerektirenler (ör. kimlik bilgisi doldurma, API spesifikasyonu ihlali girişimleri ve denylist’e veya graylist’e alınmış IP’lerden gelen kötü amaçlı etkinlik) dahil saldırılar yerelde tespit edilir ve (etkinse) engellenir, ancak Wallarm Cloud’a aktarılmaz. Cloud’da saldırı verisi bulunmadığından, [Threat Replay Testing][threat-replay-testing-docs] çalışmaz. Whitelist’teki IP’lerden gelen trafiğe izin verilir.

Bu arada, [API Discovery][api-discovery-docs], [API oturum takibi][api-sessions-docs] ve [güvenlik zafiyeti tespiti][vuln-detection-docs] tam işlevselliğini korur; ilgili güvenlik varlıklarını tespit eder ve görselleştirme için Cloud’a yükler.

Bu mod, önce API envanterini gözden geçirmek ve hassas verileri belirlemek isteyen, ardından buna göre kontrollü saldırı verisi aktarımı planlayanlar içindir. Ancak saldırı verisi aktarımının devre dışı bırakılması nadirdir; çünkü Wallarm saldırı verilerini güvenli bir şekilde işler ve gerekirse [hassas saldırı verilerinin maskelenmesini][masking-sensitive-data-rule] sağlar.

API Discovery-only modunu etkinleştirmek için:

1. `/etc/wallarm-override/env.list` dosyasını oluşturun veya düzenleyin:

    ```
    sudo mkdir /etc/wallarm-override
    sudo vim /etc/wallarm-override/env.list
    ```

    Aşağıdaki değişkeni ekleyin:

    ```
    WALLARM_APID_ONLY=true
    ```

1. [Düğüm kurulum prosedürünü](#requirements) izleyin.

API Discovery-only modu etkinleştirildiğinde, `/opt/wallarm/var/log/wallarm/wcli-out.log` günlüğü aşağıdaki mesajı döndürür:

```json
{"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
```