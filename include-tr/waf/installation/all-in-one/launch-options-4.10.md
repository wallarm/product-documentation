Hepsi bir arada betiği indirdikten sonra, aşağıdaki komutla yardım çıktısını alabilirsiniz:

```
sudo sh ./wallarm-4.10.13.x86_64-glibc.sh -- -h
```

Şu çıktıyı döndürür:

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

`--batch` seçeneği, gerekirse `WALLARM_LABELS` ortam değişkeniyle birlikte `--token` ve `--cloud` bayrakları üzerinden yapılandırma seçenekleri gerektiren, betiğin kullanıcıdan varsayılan moddaki gibi adım adım veri girişi istemediği, bunun yerine etkileşim için açık komutlar gerektirdiği, **toplu (etkileşimsiz)** modu tetikler.

Aşağıda, betiği toplu modda düğüm kurulumu için çalıştırmaya ilişkin komut örnekleri verilmiştir; betiğin zaten [indirildiği][download-aio-step] varsayılmaktadır:

=== "ABD Bulutu"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "AB Bulutu"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Düğüm kurulum aşamalarının ayrı ayrı çalıştırılması

Bulut altyapısı için hepsi bir arada yükleyiciyi kullanarak kendi makine imajınızı hazırlarken, bu makalede belirtilen standart kurulum süreci yeterli olmayabilir. Bunun yerine, bir makine imajı oluşturma ve dağıtma gereksinimlerini karşılamak için hepsi bir arada yükleyicinin belirli aşamalarını ayrı ayrı yürütmeniz gerekir:

1. Makine imajını oluşturun: Bu aşamada, filtreleme düğümünün ikili dosyalarını, kütüphanelerini ve yapılandırma dosyalarını indirmek ve bunlara dayalı bir makine imajı oluşturmak gerekir. `--install-only` bayrağını kullanarak, betik gerekli dosyaları kopyalar ve düğümün çalışması için NGINX yapılandırmalarını değiştirir. Manuel ayarlamalar yapmak isterseniz, `--skip-ngx-config` bayrağını kullanarak NGINX dosyası değişikliğini atlayabilirsiniz.
1. cloud-init ile bir bulut örneğini başlatın: Örnek başlatma sırasında, önyükleme aşaması (Cloud kaydı ve servis başlatma) cloud-init betikleri kullanılarak yürütülebilir. Bu aşama, derleme aşamasından bağımsız olarak, derleme aşamasında kopyalanan `/opt/wallarm/setup.sh` betiğine `--register-only` bayrağı uygulanarak çalıştırılabilir.

Bu işlevsellik, hepsi bir arada yükleyicinin 4.10.0 sürümünden itibaren toplu modda desteklenmektedir. Aşağıdaki komutlar, belirtilen adımların sıralı yürütülmesini sağlar:

=== "ABD Bulutu"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "AB Bulutu"
    ```
    # x86_64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [Wallarm'ın trafiği analiz etmesini etkinleştirmeniz][enable-traffic-analysis-step] ve [NGINX'i yeniden başlatmanız][restart-nginx-step] gerekir.

### Filtreleme ve postanalytics düğümlerinin ayrı kurulumu

filtering/postanalytics anahtarı, postanalytics modülünü [ayrı][separate-postanalytics-installation-aio] olarak kurma seçeneği sunar. Bu anahtar olmadığında, varsayılan olarak hem filtreleme hem de postanalytics bileşenleri birlikte kurulur.