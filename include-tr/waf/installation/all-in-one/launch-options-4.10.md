As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-4.10.13.x86_64-glibc.sh -- -h
```

Which returns:

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

### Batch mode

`--batch` seçeneği, **batch (non-interaktif)** modu tetikler. Bu modda script, gerekirse `WALLARM_LABELS` ortam değişkeni ile birlikte, `--token` ve `--cloud` bayrakları aracılığıyla yapılandırma seçeneklerini ister. Script, standart modda olduğu gibi kullanıcının adım adım veri girişi yapmasını istemez; bunun yerine, etkileşim için açık komutlar gerektirir.

Aşağıda, script'in nod kurulumu için batch modda çalıştırılmasına ilişkin örnek komutlar verilmiştir. Bu örnekler, script'in daha önce [downloaded][download-aio-step] edildiği varsayımına dayanmaktadır:

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh -- --batch -t <TOKEN>

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Separate execution of node installation stages

Kendi makine imajınızı oluşturmak için all-in-one installer'ı kullanırken, bu makalede özetlenen standart kurulum süreci yeterli olmayabilir. Bunun yerine, makine imajı oluşturma ve dağıtım gereksinimlerini karşılamak amacıyla all-in-one installer'ın belirli aşamalarını ayrı ayrı çalıştırmanız gerekir:

1. Makine imajı oluşturma: Bu aşamada, filtering nodunun binary'leri, kütüphaneleri ve yapılandırma dosyaları indirilir ve bunlara dayalı bir makine imajı oluşturulur. Script, gereken dosyaları kopyalamak ve nod operasyonu için NGINX yapılandırmalarını değiştirmek amacıyla `--install-only` bayrağını kullanır. Manuel ayarlamalar yapmak isterseniz, NGINX dosya değişikliklerini `--skip-ngx-config` bayrağıyla atlamayı tercih edebilirsiniz.
1. cloud-init ile bir cloud instance başlatma: Instance başlatma sırasında, bootstrap aşaması (cloud kaydı ve servis başlatma) cloud-init script'leri kullanılarak gerçekleştirilebilir. Bu aşama, imaj oluşturma aşamasından bağımsız olarak, build aşamasında kopyalanan `/opt/wallarm/setup.sh` script'ine `--register-only` bayrağının uygulanmasıyla tek başına çalıştırılabilir.

Bu işlevsellik, batch modda all-in-one installer'ın 4.10.0 sürümünden itibaren desteklenmektedir. Aşağıdaki komutlar, bahsedilen adımların sıralı olarak yürütülmesini sağlar:

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.x86_64-glibc.sh
    sudo sh wallarm-4.10.13.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.13.aarch64-glibc.sh
    sudo sh wallarm-4.10.13.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [enable Wallarm to analyze traffic][enable-traffic-analysis-step] ve [restart NGINX][restart-nginx-step] adımlarını gerçekleştirmeniz gerekiyor.

### Separate installation of filtering and postanalytics nodes

Filtering/postanalytics anahtarı, postanalytics modülünün [separately][separate-postanalytics-installation-aio] kurulması seçeneğini sunar. Bu anahtar kullanılmazsa, varsayılan olarak filtering ve postanalytics bileşenleri birlikte kurulmaktadır.