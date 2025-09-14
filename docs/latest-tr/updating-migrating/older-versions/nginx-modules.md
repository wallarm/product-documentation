[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:          ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                    ../../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# EOL durumundaki Wallarm NGINX modüllerinin yükseltilmesi

Bu talimatlar, destek süresi dolmuş (EOL) Wallarm NGINX modüllerinin (sürüm 3.6 ve altı) en son 6.x sürümüne yükseltilmesi adımlarını açıklar. Wallarm NGINX modülleri, aşağıdaki talimatlardan birine göre kurulan modüllerdir:

* NGINX stable için bireysel paketler
* NGINX Plus için bireysel paketler
* Dağıtımın sağladığı NGINX için bireysel paketler

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "Tüm‑bir‑arada yükleyici ile yükseltme"
    Yükseltme, bireysel Linux paketleri kullanımdan kaldırıldığı için Wallarm'ın [all-in-one installer](../../installation/nginx/all-in-one.md) aracıyla gerçekleştirilir. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve sürekli dağıtım bakımını basitleştirir.
    
    Yükleyici aşağıdaki işlemleri otomatik olarak gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünü kontrol eder.
    1. Algılanan OS ve NGINX sürümü için Wallarm depolarını ekler.
    1. Bu depolardan Wallarm paketlerini kurar.
    1. Kurulan Wallarm modülünü NGINX'inize bağlar.
    1. Sağlanan token ile filtreleme düğümünü Wallarm Cloud'a bağlar.

        Bireysel Linux paketleriyle manuel yükseltme artık desteklenmemektedir.

    ![Tüm‑bir‑arada ile manuelliğin karşılaştırması](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## EOL düğümü yükselttiğinizi Wallarm teknik desteğine bildirin

Destek süresi dolmuş (EOL) Wallarm NGINX modüllerini (sürüm 3.6 ve altı) 6.x sürümüne yükseltiyorsanız, [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçip bilgi verin ve yardım isteyin.

Diğer yardımların yanı sıra, Wallarm hesabınız için yeni IP lists mantığının etkinleştirilmesini talep edin. Yeni IP lists mantığı etkinleştirildiğinde lütfen Wallarm Console'u açın ve [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün mevcut olduğunu doğrulayın.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Yükseltme prosedürü

* Filtreleme düğümü ve postanalytics modülleri aynı sunucuya kuruluysa, tümünü yükseltmek için aşağıdaki talimatları izleyin.

    Daha yeni sürümü temiz bir makinede all-in-one yükleyiciyle çalıştırmanız, düzgün çalıştığını test etmeniz, ardından öncekini durdurmanız ve trafiği önceki makine yerine yeni makineden akacak şekilde yapılandırmanız gerekecektir.

* Filtreleme düğümü ve postanalytics modülleri farklı sunucularda kuruluysa, bu [talimatları](separate-postanalytics.md) izleyerek önce postanalytics modülünü, sonra filtreleme modülünü yükseltin.

## Adım 1: Threat Replay Testing modülünü devre dışı bırakın (sadece düğüm 2.16 veya altından yükseltiliyorsa)

Wallarm düğümünü 2.16 veya altından yükseltiyorsanız, lütfen Wallarm Console → **Vulnerabilities** → **Configure** içinde [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması yükseltme sürecinde [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) üretebilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 2: Temiz makine hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 3: NGINX ve bağımlılıklarını kurun

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 4: Wallarm token hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 5: Tüm‑bir‑arada Wallarm yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 6: Tüm‑bir‑arada Wallarm yükleyicisini çalıştırın

### Aynı sunucuda filtreleme düğümü ve postanalytics

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### Farklı sunucularda filtreleme düğümü ve postanalytics

!!! warning "Filtreleme düğümü ve postanalytics modüllerini yükseltme adımlarının sırası"
    Filtreleme düğümü ve postanalytics modülleri farklı sunuculara kuruluysa, filtreleme düğümü paketlerini güncellemeden önce postanalytics paketlerinin yükseltilmesi gerekir.

1. Postanalytics modülünü şu [talimatları](separate-postanalytics.md) izleyerek yükseltin.
1. Filtreleme düğümünü yükseltin:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu belirler (Wallarm Console UI içinde düğümlerin mantıksal gruplaması için kullanılır).

    === "Node belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.aarch64-glibc.sh filtering
        ```

## Adım 7: İzinli listeleri ve engelli listeleri önceki Wallarm düğümü sürümünden 6.x'e taşıyın (sadece düğüm 2.18 veya altından yükseltiliyorsa)

Düğümü 2.18 veya altından yükseltiyorsanız, izinli liste ve engelli liste yapılandırmasını önceki Wallarm düğümü sürümünden en yeni sürüme [taşıyın](../migrate-ip-lists-to-node-3.md).

## Adım 8: NGINX ve postanalytics yapılandırmasını eski düğüm makinesinden yeniye aktarın

Gerekli yönergeleri veya dosyaları kopyalayarak düğüme ilişkin NGINX ve postanalytics yapılandırmalarını eski makineden yeniye taşıyın:

* `/etc/nginx/conf.d/default.conf` veya `/etc/nginx/nginx.conf` (`http` seviyesine ilişkin NGINX ayarları)

    Filtreleme ve postanalytics düğümleri farklı sunuculardaysa, filtreleme düğümü makinesindeki `/etc/nginx/nginx.conf` dosyasının `http` bloğunda `wallarm_tarantool_upstream` adını [`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream) olarak değiştirin.
* `/etc/nginx/sites-available/default` (trafik yönlendirme için NGINX ve Wallarm ayarları)
* `/etc/nginx/conf.d/wallarm-status.conf` → yeni makinede `/etc/nginx/wallarm-status.conf` konumuna kopyalayın

    Ayrıntılı açıklama [bağlantı][wallarm-status-instr] içinde mevcuttur.
* `/etc/wallarm/node.yaml` → yeni makinede `/opt/wallarm/etc/wallarm/node.yaml` konumuna kopyalayın

    Ayrı bir postanalytics sunucusunda özel bir ana bilgisayar ve bağlantı noktası kullanıyorsanız, kopyalanan dosyada postanalytics düğümü makinesinde `tarantool` bölümünü `wstore` olarak yeniden adlandırın.

### Kullanımdan kaldırılan NGINX yönergelerini yeniden adlandırın

Aşağıdaki NGINX yönergeleri yapılandırma dosyalarında açıkça belirtilmişse adlarını değiştirin:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
* `wallarm_tarantool_upstream` → [`wallarm_wstore_upstream`](../../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)

Yalnızca yönergelerin adları değişti, mantıkları aynı kaldı. Eski adlara sahip yönergeler yakında kullanımdan kaldırılacaktır, bu nedenle önceden yeniden adlandırmanız önerilir.

### Düğüm günlükleme değişkenlerini güncelleyin

Yeni düğüm sürümünde [düğüm günlükleme değişkenlerinde](../../admin-en/configure-logging.md#filter-node-variables) aşağıdaki değişiklikler uygulanmıştır:

* `wallarm_request_time` değişkeninin adı `wallarm_request_cpu_time` olarak değiştirilmiştir.

    Yalnızca değişken adı değişti, mantığı aynı kaldı. Eski ad geçici olarak desteklenmektedir ancak yine de değişkenin yeniden adlandırılması önerilir.
* `wallarm_request_mono_time` değişkeni eklendi – aşağıdaki toplamın loglanmasına ihtiyaç duyuyorsanız günlük formatı yapılandırmasına ekleyin:

    * Kuyrukta geçen süre
    * CPU'nun isteği işlerken harcadığı süre (saniye)

### En son sürümlerde yayınlanan değişikliklere göre Wallarm düğümü filtreleme modu ayarlarını uyarlayın

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değişen mantığı](what-is-new.md#filtration-modes) ile uyumlu olduğundan emin olun:
      * [Yönerge `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console'da yapılandırılmış genel filtreleme kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Console'da yapılandırılmış uç nokta hedefli filtreleme kuralları](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. Beklenen davranış değişen filtreleme modu mantığıyla uyuşmuyorsa, [talimatları](../../admin-en/configure-wallarm-mode.md) kullanarak filtreleme modu ayarlarını yayınlanan değişikliklere göre uyarlayın.

### `overlimit_res` saldırı algılama yapılandırmasını yönergelerden kurala taşıyın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### `wallarm-status.conf` dosya içeriğini güncelleyin

`/etc/nginx/conf.d/wallarm-status.conf` içeriğini aşağıdaki gibi güncelleyin:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.8/8;   # Erişim yalnızca filtreleme düğümü sunucusunun loopback adresleri için kullanılabilir  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarının kontrolü devre dışıdır, denylisted IP'lerin wallarm-status servisine istek yapmasına izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  wallarm_enable_apifw off;
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[İstatistik servisinin yapılandırılması hakkında daha fazla ayrıntı](../../admin-en/configure-statistics-service.md)

### Wallarm engelleme sayfasını güncelleyin

Yeni düğüm sürümünde Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e‑postası artık varsayılan olarak boştur.

Eğer `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenen isteklere yanıt olarak döndürülmek üzere yapılandırılmışsa, yeni örnek sayfanın sürümünü [kopyalayıp özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

## Adım 9: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 10: Threat Replay Testing modülünü yeniden etkinleştirin (sadece düğüm 2.16 veya altından yükseltiliyorsa)

[Threat Replay Testing modülü kurulumuna ilişkin öneriyi](../../vulnerability-detection/threat-replay-testing/setup.md) inceleyin ve gerekirse yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının false positive üretmediğinden emin olun. False positive tespit ederseniz lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

## Adım 11: NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 12: Wallarm düğümü çalışmasını test edin

Yeni düğümün çalışmasını test etmek için:

1. Korunan kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları içeren bir istek gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde açın ve saldırıların listede göründüğünden emin olun.
1. Cloud üzerinde saklanan verileriniz (kurallar, IP lists) yeni düğümle senkronize olur olmaz, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin.

## Adım 13: Trafiğin Wallarm düğümüne gönderilmesini yapılandırın

Yük dengeleyicinizin hedeflerini Wallarm örneğine trafik gönderecek şekilde güncelleyin. Ayrıntılar için, yük dengeleyicinizin belgelerine bakın.

Trafiği tamamen yeni düğüme yönlendirmeden önce, önce kısmen yönlendirmeniz ve yeni düğümün beklendiği gibi davrandığını kontrol etmeniz önerilir.

## Adım 14: Eski düğümü kaldırın

1. Wallarm Console → **Nodes** içinde düğümünüzü seçip **Delete** tıklayarak eski düğümü silin.
1. İşlemi onaylayın.
    
    Düğüm Cloud'dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesini durduracaktır. Filtreleme düğümünü silme işlemi geri alınamaz. Düğüm, düğümler listesinden kalıcı olarak silinecektir.

1. Eski düğümlü makineyi silin veya sadece Wallarm düğüm bileşenlerinden temizleyin:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## Ayarların özelleştirilmesi

Wallarm modülleri 6.x sürümüne güncellendi. Önceki filtreleme düğümü ayarları yeni sürüme otomatik olarak uygulanacaktır. Ek ayarlar yapmak için [kullanılabilir yönergeleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"