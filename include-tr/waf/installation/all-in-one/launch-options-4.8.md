Hepsi-bir-arada betiği indirir indirmez, aşağıdaki komutla yardım alabilirsiniz:

```
sudo sh ./wallarm-4.8.10.x86_64-glibc.sh -- -h
```

Şu çıktıyı verir:

```
...
Kullanım: setup.sh [options]... [arguments]... [filtering/postanalytics]

SEÇENEK                    AÇIKLAMA
-b, --batch                 Toplu mod, etkileşimsiz kurulum.
    --install-only          Toplu modda hepsi-bir-arada yükleyicinin ilk aşamasını başlatır. Dosyalar ve ikililer dahil olmak üzere temel yapılandırmaları kopyalar ve Cloud kaydı ile etkinleştirmeyi atlayarak düğüm kurulumu için NGINX'i hazırlar. --batch gerektirir.
    --skip-ngx-config       Toplu modda --install-only aşaması sırasında gerçekleşen otomatik NGINX yapılandırma değişikliklerini yapmaz; daha sonra manuel ayar yapmayı tercih eden kullanıcılar için uygundur. --install-only ile birlikte kullanıldığında, NGINX ayarlarını değiştirmeden yalnızca temel yapılandırmaların kopyalanmasını sağlar. --batch gerektirir.
    --register-only         Toplu modda hepsi-bir-arada yükleyicinin ikinci aşamasını başlatır; düğümü Cloud'da kaydedip servisi başlatarak kurulumu tamamlar. --batch gerektirir.
-t, --token TOKEN           Düğüm jetonu; toplu modda gereklidir.
-c, --cloud CLOUD           Wallarm Cloud, US/EU'den biri; varsayılan EU, yalnızca toplu modda kullanılır.
-H, --host HOST             Wallarm API adresi; örneğin, api.wallarm.com veya us1.api.wallarm.com, yalnızca toplu modda kullanılır.
-P, --port PORT             Wallarm API portu; örneğin 443.
    --no-ssl                Wallarm API erişimi için SSL'i devre dışı bırakır.
    --no-verify             SSL sertifikası doğrulamasını devre dışı bırakır.
-f, --force                 Aynı ada sahip bir düğüm varsa yeni bir örnek oluştur.
-h, --help
    --version
```

### Toplu mod

`--batch` seçeneği, betiğin gerektiğinde `--token` ve `--cloud` bayrakları ile ve gerekiyorsa `WALLARM_LABELS` ortam değişkeni üzerinden yapılandırma seçeneklerini aldığı toplu (etkileşimsiz) modu tetikler. Bu modda betik, varsayılan modda olduğu gibi kullanıcıdan adım adım veri istemez; bunun yerine etkileşim için açık komutlar gerektirir.

Betiği toplu modda düğüm kurulumu için çalıştırma komutlarına ilişkin örnekler aşağıdadır; betiğin [indirildiği][download-aio-step] varsayılmaktadır:

=== "US Cloud"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh -- --batch -t <TOKEN>

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Düğüm kurulum aşamalarının ayrı ayrı yürütülmesi

Bulut altyapısı için hepsi-bir-arada yükleyiciyi kullanarak kendi makine imajınızı hazırlarken, bu makalede belirtilen standart kurulum süreci yeterli olmayabilir. Bunun yerine, bir makine imajı oluşturma ve dağıtma gereksinimlerini karşılamak için hepsi-bir-arada yükleyicinin belirli aşamalarını ayrı ayrı yürütmeniz gerekir:

1. Makine imajı oluşturma: Bu aşamada, filtreleme düğümünün ikililerini, kütüphanelerini ve yapılandırma dosyalarını indirip bunlara dayalı bir makine imajı oluşturmak gerekir. `--install-only` bayrağını kullanarak, betik gerekli dosyaları kopyalar ve düğüm çalışması için NGINX yapılandırmalarını değiştirir. Manuel ayar yapmak isterseniz, `--skip-ngx-config` bayrağını kullanarak NGINX dosya değişikliklerini atlayabilirsiniz.
1. Cloud-init ile bir bulut örneğini ilklendirme: Örnek ilklendirme sırasında, önyükleme aşaması (Cloud kaydı ve servis başlatma) cloud-init betikleri ile yürütülebilir. Bu aşama, derleme aşamasında kopyalanan `/opt/wallarm/setup.sh` betiğine `--register-only` bayrağı uygulanarak derleme aşamasından bağımsız olarak çalıştırılabilir.

Bu işlevsellik, toplu modda hepsi-bir-arada yükleyicinin 4.8.8 sürümünden itibaren desteklenir. Aşağıdaki komutlar belirtilen adımların sıralı yürütülmesini sağlar:

=== "US Cloud"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # ARM64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # x86_64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.x86_64-glibc.sh
    sudo sh wallarm-4.8.10.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # ARM64 sürümünü kullanıyorsanız:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.10.aarch64-glibc.sh
    sudo sh wallarm-4.8.10.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Son olarak, kurulumu tamamlamak için [Wallarm'ın trafiği analiz etmesini etkinleştirmeniz][enable-traffic-analysis-step] ve [NGINX'i yeniden başlatmanız][restart-nginx-step] gerekir.

### Filtreleme ve postanalytics düğümlerinin ayrı kurulumu

Filtering/postanalytics anahtarı, postanalytics modülünü [ayrı][separate-postanalytics-installation-aio] kurma seçeneği sunar. Bu anahtar olmadan, filtreleme ve postanalytics bileşenleri varsayılan olarak birlikte kurulur.