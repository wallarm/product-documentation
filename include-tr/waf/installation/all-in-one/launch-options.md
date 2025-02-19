```markdown
Tüm bileşenleri içeren script'i indirdikten kısa süre sonra, yardım almak için aşağıdaki komutu çalıştırabilirsiniz:

```
sudo sh ./wallarm-5.3.0.x86_64-glibc.sh -- -h
```

Bu komut aşağıdakini döndürür:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Toplu mod, etkileşimsiz kurulum.
    --install-only          Tüm bileşenleri içeren kurulucunun ilk aşamasını toplu modda başlatır. Gerekli yapılandırmaların, dosyaların ve ikili dosyaların (binary) kopyalanmasını sağlar ve node kurulumu için NGINX’i ayarlar. Cloud kaydı ve aktivasyonu atlanır. --batch gerektirir.
    --skip-ngx-config       --install-only aşamasında toplu modda gerçekleşen otomatik NGINX yapılandırma değişikliklerini engeller. Daha sonra manuel ayarlamaları tercih eden kullanıcılar için uygundur. --install-only ile birlikte kullanıldığında, yalnızca temel yapılandırmaların kopyalanmasını sağlar ve NGINX ayarları değiştirilmez. --batch gerektirir.
    --register-only         Tüm bileşenleri içeren kurulucunun ikinci aşamasını toplu modda başlatır; node’u Cloud’da kaydederek kurulumu tamamlar ve servisini başlatır. --batch gerektirir.
-t, --token TOKEN           Toplu modda gerekli olan node token.
-c, --cloud CLOUD           Wallarm Cloud, US/EU seçeneklerinden biri; varsayılan EU’dur. Sadece toplu modda kullanılır.
-H, --host HOST             Wallarm API adresi, örneğin api.wallarm.com veya us1.api.wallarm.com; sadece toplu modda kullanılır.
-P, --port PORT             Wallarm API portu, örneğin 443.
    --no-ssl                Wallarm API erişimi için SSL’i devre dışı bırakır.
    --no-verify             SSL sertifikalarının doğrulanmasını devre dışı bırakır.
-f, --force                 Aynı isimde bir node varsa, yeni bir örnek oluşturur.
-h, --help
    --version
```

### Toplu mod

`--batch` seçeneği, betiğin **toplu (etkileşimsiz)** modunu etkinleştirir. Bu modda, betik yapılandırma seçeneklerini --token ve --cloud bayraklarıyla, gerektiğinde WALLARM_LABELS ortam değişkeniyle alır. Standart modda adım adım kullanıcıdan veri girişi istenirken, bu modda etkileşim için açık komutlar verilmesi gerekmektedir.

Aşağıda, script'in zaten [downloaded][download-aio-step] varsayılarak node kurulumu için toplu modda çalıştırılması örnek komutları verilmiştir:

=== "US Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Node Kurulum Aşamalarının Ayrı Ayrı Çalıştırılması

Cloud altyapısı için all-in-one installer kullanarak kendi makine imajınızı hazırlarken, bu makalede özetlenen standart kurulum süreci yeterli olmayabilir. Bunun yerine, makine imajı oluşturma ve dağıtım gereksinimlerini karşılamak için all-in-one installer'ın belirli aşamalarını ayrı ayrı çalıştırmanız gerekecektir:

1. Makine imajı oluşturma: Bu aşamada, filtering node'un ikili dosyalarını, kütüphanelerini ve yapılandırma dosyalarını indirip bunlara dayalı bir makine imajı oluşturmanız gerekir. `--install-only` bayrağını kullanarak, betik gerekli dosyaları kopyalar ve node işletimi için NGINX yapılandırmalarını değiştirir. Manuel ayarlama yapmak isterseniz, NGINX dosya değişikliklerini `--skip-ngx-config` bayrağı ile atlayabilirsiniz.
2. cloud-init ile bir cloud örneği başlatma: Örnek başlatma sırasında, bootstrap aşaması (cloud kaydı ve servis başlatma) cloud-init script’leri kullanılarak gerçekleştirilebilir. Bu aşama, imaj oluşturma aşamasından bağımsız olarak, imaj oluşturma aşamasında kopyalanan `/opt/wallarm/setup.sh` script’ine `--register-only` bayrağı uygulanarak çalıştırılabilir.

Bu işlevsellik, toplu modda all-in-one installer'ın 4.10.0 sürümünden itibaren desteklenmektedir. Aşağıdaki komutlar, belirtilen adımların sıralı çalıştırılmasını sağlar:

=== "US Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.x86_64-glibc.sh
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64 sürümü kullanılıyorsa:
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.0.aarch64-glibc.sh
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [Wallarm'ın trafiği analiz etmesini etkinleştirmeniz][enable-traffic-analysis-step] ve [NGINX'i yeniden başlatmanız][restart-nginx-step] gerekmektedir.

### Filtering ve postanalytics Node'larının Ayrı Ayrı Kurulumu

Filtering/postanalytics anahtarı, postanalytics modülünü [ayrı olarak][separate-postanalytics-installation-aio] kurma seçeneği sunar. Bu anahtar kullanılmadığında, filtering ve postanalytics bileşenleri varsayılan olarak birlikte kurulur.
```