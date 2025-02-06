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

# EOL Wallarm NGINX Modüllerinin Yükseltilmesi

Bu yönergeler, ömrünü tamamlamış (EOL) Wallarm NGINX modüllerini (sürüm 3.6 ve altı) 5.0 sürümüne yükseltmek için gereken adımları açıklamaktadır. Wallarm NGINX modülleri, aşağıdaki yönergelerden birine uygun olarak kurulan modüllerdir:

* NGINX stable için ayrı paketler
* NGINX Plus için ayrı paketler
* Dağıtım tarafından sağlanan NGINX için ayrı paketler

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "Tümünü Bir Arada Yükleyici ile Yükseltme"
    Güncelleme, Wallarm'ın [all-in-one installer](../../installation/nginx/all-in-one.md) aracı kullanılarak gerçekleştirilir; çünkü ayrı Linux paketleri kullanımdan kaldırılmıştır. Bu yöntem, önceki yaklaşıma kıyasla yükseltme sürecini ve devam eden dağıtım bakımını sadeleştirir.
    
    Yükleyici otomatik olarak aşağıdaki işlemleri gerçekleştirir:

    1. İşletim sisteminizi ve NGINX sürümünüzü kontrol eder.
    1. Tespit edilen OS ve NGINX sürümü için Wallarm repositorilerini ekler.
    1. Bu repositorilerden Wallarm paketlerini kurar.
    1. Kurulan Wallarm modülünü NGINX'inize entegre eder.
    1. Sağlanan token ile filtreleme düğümünü Wallarm Cloud'a bağlar.

        Ayrı Linux paketleri ile manuel yükseltme artık desteklenmemektedir.

    ![Manual ile all-in-one karşılaştırması](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Wallarm Teknik Destek Ekibini, EOL Düğüm Yükseltmesi Yapacağınızı Bildirin

Ömrünü tamamlamış Wallarm NGINX modüllerini (sürüm 3.6 ve altı) 5.0 sürümüne yükseltiyorsanız, [Wallarm teknik destek ekibini](mailto:support@wallarm.com) bu durumdan haberdar edin ve yardım isteyin.

Diğer yardımların yanı sıra, Wallarm hesabınız için yeni IP listesi mantığını etkinleştirmelerini talep edin. Yeni IP listesi mantığı etkinleştirildiğinde, lütfen Wallarm Console'u açın ve [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün mevcut olduğundan emin olun.

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Yükseltme Prosedürü

* Eğer filtreleme düğümü ile postanalytics modülleri aynı sunucuda kuruluysa, hepsini yükseltmek için aşağıdaki yönergeleri takip edin.

    Yeni bir makinede, all-in-one installer kullanarak daha yeni sürümde bir düğüm çalıştırmanız, düzgün çalıştığını test ettikten sonra eskisini durdurup trafiğin eski makine yerine yeni makine üzerinden yönlendirilmesini sağlamanız gerekecektir.

* Eğer filtreleme düğümü ile postanalytics modülleri farklı sunucularda kuruluysa, **önce** postanalytics modülünü ve **sonra** [bu yönergeleri](separate-postanalytics.md) takip ederek filtreleme modülünü yükseltin.

## Adım 1: Threat Replay Testing Modülünü Devre Dışı Bırakın (node 2.16 veya altı yükseltiliyorsa)

Eğer Wallarm düğümünüzü 2.16 veya daha düşük bir sürümden yükseltiyorsanız, lütfen Wallarm Console → **Vulnerabilities** → **Configure** bölümünden [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Bu modülün çalışması, yükseltme sürecinde [yanlış pozitif sonuçlara](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülü devre dışı bırakmak bu riski minimize eder.

## Adım 2: Temiz Bir Makine Hazırlayın

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Adım 3: NGINX ve Bağımlılıkları Kurun

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 4: Wallarm Token'ını Hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 5: All-in-one Wallarm Yükleyicisini İndirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 6: All-in-one Wallarm Yükleyicisini Çalıştırın

### Filtreleme Düğümü ve Postanalytics Aynı Sunucuda

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### Filtreleme Düğümü ve Postanalytics Farklı Sunucularda

!!! warning "Filtreleme düğümü ve postanalytics modüllerinin yükseltilme sırası"
    Eğer filtreleme düğümü ile postanalytics modülleri farklı sunucularda kuruluysa, postanalytics paketlerini yükseltmeden önce filtreleme düğümü paketlerini güncellemeniz gerekmektedir.

1. [Bu yönergeleri](separate-postanalytics.md) takip ederek postanalytics modülünü yükseltin.
1. Filtreleme düğümünü yükseltin:

    === "API token"
        ```bash
        # x86_64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'da düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Node token"
        ```bash
        # x86_64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh filtering

        # ARM64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh filtering
        ```

## Adım 7: Önceki Wallarm Düğüm Sürümünden Allowlist ve Denylist'leri 5.0'a Taşıyın (sadece node 2.18 veya altı yükseltiliyorsa)

Eğer düğümünüzü 2.18 veya daha düşük bir sürümden yükseltiyorsanız, önceki Wallarm düğüm sürümündeki allowlist ve denylist yapılandırmasını en güncel sürüme [taşıyın](../migrate-ip-lists-to-node-3.md).

## Adım 8: Eski Düğüm Sunucusundan NGINX ve Postanalytics Yapılandırmalarını Yeni Olanına Aktarın

Eski makinede yer alan düğümle ilgili NGINX yapılandırması ve postanalytics yapılandırmasını, gerekli yönergeleri kopyalayarak yeni makinedeki dosyalara aktarın.

**Kaynak Dosyalar**

Eski makinede, işletim sistemine ve NGINX sürümüne bağlı olarak NGINX yapılandırma dosyaları farklı dizinlerde ve farklı isimlerde bulunabilir. En yaygın olanlar şunlardır:

* NGINX ayarlarını içeren `/etc/nginx/conf.d/default.conf`
* Wallarm düğüm izleme ayarlarını içeren `/etc/nginx/conf.d/wallarm-status.conf`. Detaylı açıklama [linkte][wallarm-status-instr] mevcuttur.

Ayrıca, postanalytics modülünün (Tarantool veritabanı ayarlarının) yapılandırması genellikle aşağıdakilerden birinde bulunur:

* `/etc/default/wallarm-tarantool` veya
* `/etc/sysconfig/wallarm-tarantool`

**Hedef Dosyalar**

All-in-one installer, işletim sistemi ve NGINX sürümlerinin farklı kombinasyonlarıyla çalıştığından, yeni makinenizde [hedef dosyalar](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) farklı isimlerde ve farklı dizinlerde olabilir.

Yapılandırma aktarılırken aşağıdaki adımların uygulanması gerekmektedir.

### Kullanımdan Kaldırılmış NGINX Direktiflerini Yeniden Adlandırın

Açıkça yapılandırma dosyalarında belirtilmişse, aşağıdaki NGINX direktiflerinin isimlerini değiştirin:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Sadece direktif isimlerini değiştirdik; mantıkları aynı kalmaktadır. Eski isimdeki direktifler geçici olarak desteklenmeye devam etmektedir, ancak yeniden adlandırmanız tavsiye edilir.

### Düğüm Loglama Değişkenlerini Güncelleyin

Yeni düğüm sürümünde, [düğüm loglama değişkenlerinde](../../admin-en/configure-logging.md#filter-node-variables) aşağıdaki değişiklikler uygulanmıştır:

* `wallarm_request_time` değişkeni `wallarm_request_cpu_time` olarak yeniden adlandırılmıştır.

    Sadece değişken adı değiştirilmiş olup, mantığı aynıdır. Eski isim geçici olarak desteklenmektedir, fakat yine de yeniden adlandırmanız önerilir.
* `wallarm_request_mono_time` değişkeni eklenmiştir – sıraya, kuyruğa alınan zaman ile 
    * Kuyrukta geçirilen süre 
    * İsteğin işlenmesinde CPU'nun harcadığı saniye cinsinden toplam zaman
  bilgisini loglamak isterseniz, bu değişkeni log formatınızın yapılandırmasına ekleyin.

### Wallarm Düğüm Filtrasyon Modu Ayarlarını Son Sürümlerde Yapılan Değişikliklere Göre Ayarlayın

1. Aşağıda listelenen ayarların beklenen davranışlarının, [`off` ve `monitoring` filtrasyon modlarının değişmiş mantığına](what-is-new.md#filtration-modes) uygunluğunu kontrol edin:
      * [`wallarm_mode` direktifi](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console'da yapılandırılan genel filtrasyon kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Console'da yapılandırılan endpoint odaklı filtrasyon kuralları](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. Eğer beklenen davranış, değişen filtrasyon modu mantığıyla örtüşmüyorsa, [bu yönergeleri](../../admin-en/configure-wallarm-mode.md) kullanarak ayarları güncelleyin.

### `overlimit_res` Saldırı Tespit Yapılandırmasını Direktiflerden Kurala Taşıyın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### `wallarm-status.conf` Dosyası İçeriğini Güncelleyin

Aşağıdaki gibi `/etc/nginx/conf.d/wallarm-status.conf` dosyasının içeriğini güncelleyin:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Filtre düğüm sunucusunun yalnızca loopback adresleri için erişim sağlanır  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarının kontrolü devre dışı bırakılmış olup, yasaklanmış IP'lerin wallarm-status servisine erişimine izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[İstatistik servisi yapılandırması hakkında daha fazla bilgi](../../admin-en/configure-statistics-service.md)

### Wallarm Engelleme Sayfasını Güncelleyin

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirilmiştir](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-posta adresi varsayılan olarak boş bırakılmıştır.

Eğer engellenen isteklere yanıt olarak dönen sayfa olarak `&/usr/share/nginx/html/wallarm_blocked.html` yapılandırıldıysa, [yeni örnek sayfa](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) kopyalanıp özelleştirilerek kullanılmalıdır.

## Adım 9: API Portunu Güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 10: Threat Replay Testing Modülünü Yeniden Etkinleştirin (sadece node 2.16 veya altı yükseltiliyorsa)

[Threat Replay Testing modülü kurulumu için önerileri](../../vulnerability-detection/threat-replay-testing/setup.md) inceleyin ve gerekiyorsa modülü yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitif sonuçlara yol açmadığından emin olun. Yanlış pozitifler tespit ederseniz, lütfen [Wallarm teknik destek ekibiyle](mailto:support@wallarm.com) iletişime geçin.

## Adım 11: NGINX'i Yeniden Başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 12: Wallarm Düğümünün Çalışmasını Test Edin

Yeni düğümün çalışmasını test etmek için:

1. Korumalı kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları içeren bir istek gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırıların listelendiğini doğrulayın.
1. Bulut ortamınızda veriler (kurallar, IP listeleri) yeni düğüme senkronize edildikten sonra, kuralların beklendiği gibi çalıştığını test etmek için birkaç test saldırısı gerçekleştirin.

## Adım 13: Trafiğin Wallarm Düğümüne Yönlendirilmesini Yapılandırın

Kullanılan dağıtım yaklaşımına bağlı olarak, aşağıdaki ayarları gerçekleştirin:

=== "Inline"
    Yük dengeleyicinizin hedeflerini, trafiği Wallarm örneğine yönlendirecek şekilde güncelleyin. Ayrıntılar için lütfen yük dengeleyici dokümantasyonunuza başvurun.

    Trafiğin tamamen yeni düğüme yönlendirilmesinden önce, kısmi olarak yönlendirip yeni düğüm davranışını kontrol etmeniz önerilir.

=== "Out-of-Band"
    Web veya proxy sunucunuz (örneğin, NGINX, Envoy) gelen trafiği Wallarm düğümüne yansıtacak şekilde yapılandırın. Yapılandırma ayrıntıları için ilgili web veya proxy sunucu dokümantasyonuna bakmanızı tavsiye ederiz.

    [Buradaki linkte][web-server-mirroring-examples], en popüler web ve proxy sunucuları (NGINX, Traefik, Envoy) için örnek yapılandırma bulunmaktadır.

## Adım 14: Eski Düğümü Kaldırın

1. Wallarm Console → **Nodes** bölümünden eski düğümü seçip **Delete** butonuna tıklayarak silin.
1. İşlemi onaylayın.
    
    Düğüm Cloud üzerinden silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesi duracaktır. Filtreleme düğümünü silmek geri alınamaz. Düğüm listeden kalıcı olarak kaldırılacaktır.

1. Eski düğümün bulunduğu makineyi silin veya sadece Wallarm düğüm bileşenlerinden temizleyin:

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

## Ayarların Özelleştirilmesi

Wallarm modülleri 5.0 sürümüne güncellenmiştir. Önceki filtreleme düğümü ayarları, yeni sürüme otomatik olarak uygulanacaktır. Ek ayarlar yapmak için [mevcut direktifleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"