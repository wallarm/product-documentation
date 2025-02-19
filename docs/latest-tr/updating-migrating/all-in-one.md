[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[tarantool-status]:                         ../images/tarantool-status.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# Tümü Bir Arada Yükleyici ile Wallarm NGINX Düğümünü Güncelleme

Bu talimatlar, [all-in-one installer](../installation/nginx/all-in-one.md) kullanılarak kurulan Wallarm düğüm 4.x'in 5.0 sürümüne nasıl güncelleneceğini açıklamaktadır.

!!! info "Wallarm Servislerinin Yeniden Kurulması Gerekmektedir"
    4.x sürümünden, tümü bir arada yükleyici kullanılarak güncelleme yapılırken, düğümün temiz bir kurulumunun gerçekleştirilmesi önerilir. Güvenli bir prosedür için, yeni düğümü yeni bir makineye kurun, trafiği yeni makineye yönlendirin ve ardından eski makineyi kaldırın.
    
    Alternatif olarak, mevcut makinenizdeki servisleri durdurup kaldırabilir ve sonrasında düğümü yeniden kurabilirsiniz. Ancak bu, önerilmeyen bir kesinti süresine neden olabilir.

    Bu makale, en güvenli geçiş yöntemini açıklamaktadır.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

<!-- ## Upgrade procedure

Güncelleme prosedürü, filtreleme düğümü ve postanalytics modüllerinin nasıl yüklendiğine bağlı olarak farklılık gösterir:

* [Aynı sunucuda](#filtering-node-and-postanalytics-on-the-same-server): modüller birlikte güncellenir
* [Farklı sunucularda](#filtering-node-and-postanalytics-on-different-servers): **önce** postanalytics modülü, **sonra** filtreleme modülü güncellenir -->

<!-- ## Filtering node and postanalytics on the same server

Aynı sunucuda, tümü bir arada yükleyici kullanılarak kurulan filtreleme düğümü ve postanalytics modüllerini birlikte güncellemek için aşağıdaki prosedürü kullanın. -->

## Adım 1: Temiz Bir Makinede Yeni Düğüm Sürümünü Yükleyin

Yeni düğümün en güncel sürümünü, en son NGINX ile birlikte **yeni bir makineye** aşağıdaki kılavuzlardan birini izleyerek yükleyin. Kılavuz aynı zamanda makine için gereksinimleri de kapsamaktadır.

* [Aynı sunucuda filtreleme ve postanalytics modülleri](../installation/nginx/all-in-one.md)
* [Farklı sunucularda filtreleme ve postanalytics modülleri](../admin-en/installation-postanalytics-en.md)

Yükleme sırasında, önceki düğüm için kullandığınız yapılandırma dosyalarını aktarabilir ve kullanabilirsiniz – düğüm yapılandırmasında herhangi bir değişiklik yapılmamıştır.

Ardından, trafiği yeni makineye yönlendirerek yeni düğümün bu trafiği işlemesini sağlayın.

## Adım 2: Eski Düğümü Kaldırın

1. Trafik yeni makineye yönlendirildikten ve Wallarm Cloud'da saklanan verileriniz (kurallar, IP listeleri) senkronize edildikten sonra, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin.
2. Wallarm Console → **Düğümler** bölümünde, düğümünüzü seçip **Sil** butonuna tıklayarak eski düğümü kaldırın.
3. İşlemi onaylayın.
    
    Düğüm Cloud'dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesi duracaktır. Filtreleme düğümünün silinmesi geri alınamaz. Düğüm, düğümler listesinden kalıcı olarak kaldırılır.

4. Eski düğüm içeren makineyi silin veya sadece Wallarm düğüm bileşenlerini temizleyin:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```

<!-- ### Adım 1: Wallarm Jetonu Hazırlayın

Düğümü güncellemek için [bu türlerden](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) bir Wallarm jetonuna ihtiyacınız olacak. Bir jeton hazırlamak için:

=== "API jetonu"

    1. Wallarm Console → **Ayarlar** → **API jetonları** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden açın.
    1. `Deploy` kaynak rolüne sahip API jetonunu bulun veya oluşturun.
    1. Bu jetonu kopyalayın.

=== "Düğüm jetonu"

    Güncelleme için, kurulum sırasında kullanılan aynı düğüm jetonunu kullanın:

    1. Wallarm Console → **Düğümler** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden açın.
    1. Mevcut düğüm grubunuzda, düğüm menüsünden → **Jetonu Kopyala** seçeneği ile jetonu kopyalayın.

### Adım 2: En Son Sürüm Tümü Bir Arada Wallarm Yükleyicisini İndirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Adım 3: Tümü Bir Arada Wallarm Yükleyicisini Çalıştırın

İndirilen betiği çalıştırın:

=== "API jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # ARM64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```
=== "Düğüm jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # ARM64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```

* `<GROUP>`, düğümün ekleneceği grubu belirler (Wallarm Console arayüzünde düğümlerin mantıksal gruplandırılması için kullanılır). Yalnızca API jetonu kullanıldığında uygulanır.
* `<TOKEN>`, kopyalanan jetonun değeridir.
* `<CLOUD>`, yeni düğümün kaydedileceği Wallarm Cloud'dur. `US` veya `EU` olabilir.

### Adım 4: NGINX'i Yeniden Başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### Adım 5: Wallarm Düğümünün Çalışmasını Test Edin

Yeni düğümün çalışmasını test etmek için:

1. Korunan bir kaynak adresine test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

1. Wallarm Console → **Saldırılar** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırıların listede göründüğünden emin olun.
1. Cloud'da saklanan verileriniz (kurallar, IP listeleri) yeni düğüme senkronize edilir edilmez, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin. -->

<!-- ### Adım 1: Wallarm Jetonu Hazırlayın

Düğümü güncellemek için [bu türlerden](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) bir Wallarm jetonuna ihtiyacınız olacak. Bir jeton hazırlamak için:

=== "API jetonu"

    1. Wallarm Console → **Ayarlar** → **API jetonları** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden açın.
    1. `Deploy` kaynak rolüne sahip API jetonunu bulun veya oluşturun.
    1. Bu jetonu kopyalayın.

=== "Düğüm jetonu"

    Güncelleme için, kurulum sırasında kullanılan aynı düğüm jetonunu kullanın:

    1. Wallarm Console → **Düğümler** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden açın.
    1. Mevcut düğüm grubunuzda, düğüm menüsünden → **Jetonu Kopyala** seçeneği ile jetonu kopyalayın.

### Adım 2: Tümü Bir Arada Wallarm Yükleyicisinin En Son Sürümünü Postanalytics Makinesine İndirin

Bu adım, postanalytics makinesinde gerçekleştirilir.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Adım 3: Postanalytics'i Güncellemek için Tümü Bir Arada Wallarm Yükleyicisini Çalıştırın

Bu adım, postanalytics makinesinde gerçekleştirilir.

=== "API jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # ARM64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```
=== "Düğüm jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # ARM64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```

* `<GROUP>`, düğümün ekleneceği grubu belirler (Wallarm Console arayüzünde düğümlerin mantıksal gruplandırılması için kullanılır). Yalnızca API jetonu kullanıldığında uygulanır.
* `<TOKEN>`, kopyalanan jetonun değeridir.
* `<CLOUD>`, yeni düğümün kaydedileceği Wallarm Cloud'dur. `US` veya `EU` olabilir.

### Adım 4: Filtreleme Düğümü Makinesi için Tümü Bir Arada Wallarm Yükleyicisinin En Son Sürümünü İndirin

Bu adım, filtreleme düğümü makinesinde gerçekleştirilir.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Adım 5: Filtreleme Düğümünü Güncellemek için Tümü Bir Arada Wallarm Yükleyicisini Çalıştırın

Bu adım, filtreleme düğümü makinesinde gerçekleştirilir.

=== "API jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # ARM64 versiyonu kullanılıyorsa:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```
=== "Düğüm jetonu"
    ```bash
    # x86_64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # ARM64 versiyonu kullanılıyorsa:
    sudo sh wallarm-5.3.0.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```

* `<GROUP>`, düğümün ekleneceği grubu belirler (Wallarm Console arayüzünde düğümlerin mantıksal gruplandırılması için kullanılır). Yalnızca API jetonu kullanıldığında uygulanır.
* `<TOKEN>`, kopyalanan jetonun değeridir.
* `<CLOUD>`, yeni düğümün kaydedileceği Wallarm Cloud'dur. `US` veya `EU` olabilir.

### Adım 6: Filtreleme Düğümü ile Ayrı Postanalytics Modüllerinin Etkileşimini Kontrol Edin

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md" -->