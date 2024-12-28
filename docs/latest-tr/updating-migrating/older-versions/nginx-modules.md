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
[graylist-docs]:                    ../../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# EOL Wallarm NGINX modüllerini yükseltme

Bu talimatlar, son kullanma tarihi geçmiş Wallarm NGINX modüllerini (sürüm 3.6 ve altı) sürüm 4.8'a yükseltme adımlarını tanımlar. Wallarm NGINX modülleri, aşağıdakilerden birine göre kurulan modüllerdir:

* [NGINX kararlı paketi için bireysel paketler](../../installation/nginx/dynamic-module.md)
* [NGINX Plus için bireysel paketler](../../installation/nginx-plus.md)
* [Dağıtım sağlanmış NGINX için bireysel paketler](../../installation/nginx/dynamic-module-from-distr.md)

--8<-- "../include-tr/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## EOL düğümü yükseltirken Wallarm teknik desteğine bilgi verin

Son kullanma tarihi geçmiş Wallarm NGINX modüllerini (sürüm 3.6 ve altı) sürüm 4.8'a yükseltirken, bu durumu [Wallarm teknik destek](mailto:support@wallarm.com) bölümüne bildirin ve yardım isteyin.

Başka bir yardım dışında, Wallarm hesabınız için yeni IP listeleri mantığını etkinleştirmelerini isteyin. Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Konsolunu açın ve [**IP listeleri**](../../user-guides/ip-lists/overview.md) bölümünün kullanılabilir olduğundan emin olun.

## Yükseltme yöntemleri

--8<-- "../include-tr/waf/installation/upgrade-methods.md"

## Her şey dahil kurulum uygulaması ile yükseltme

Son kullanma tarihi geçmiş Wallarm NGINX modüllerini (sürüm 3.6 ve altı) [her şey dahil kurulum uygulaması](../../installation/nginx/all-in-one.md) kullanarak sürüm 4.8'a yükseltmek için aşağıdaki prosedürü kullanın.

### Her şey dahil kurulum uygulaması ile yükseltme için gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-upgrade-requirements.md"

### Yükseltme prosedürü

* Süzgeç düğümü ve sonrasında analitik modülleri aynı sunucuda kuruluysa, tümünü yükseltmek için aşağıdaki talimatları izleyin.

    Yeni sürümün bir düğümünü temiz bir makinede her şey dahil kurulum uygulaması kullanarak çalıştırmanız, düzgün çalıştığını test etmeniz ve eski olanı durdurmanız ve trafiği yeni makineye yönlendirmek yerine yönlendirmeniz gerekecektir.

* Süzgeç düğümü ve sonrasında analitik modülleri farklı sunucularda kuruluysa, **önce** sonrasında analitik modülünü yükseltin ve **sonra** süzgeç modülünü aşağıdaki [talimatları](separate-postanalytics.md) izleyerek yükseltin.

### Adım 1: Threat Replay Testing modülünü devre dışı bırakın (2.16 veya daha eski bir düğüm yükseltirken)

Wallarm düğüm 2.16 veya daha eski bir sürüm yükseltirken, lütfen Wallarm Konsolunda → **Zaafiyetler** → **Yapılandır** kısmında [Aktif tehdit doğrulama](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülünü devre dışı bırakın.

Modül işlemi, yükseltme işlemi sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülün devre dışı bırakılması bu riski en aza indirir.

### Adım 2: Temiz bir makine hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-clean-machine.md"

### Adım 3: NGINX ve bağımlılıkları yükleyin

--8<-- "../include-tr/waf/installation/all-in-one-nginx.md"

### Adım 4: Wallarm belirtecini hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

### Adım 5: Her şey dahil Wallarm yükleyicisini indirin

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 6: Her şey dahil Wallarm yükleyicisini çalıştırın

#### Süzgeç düğümü ve sonrasında analitik aynı sunucuda

--8<-- "../include-tr/waf/installation/all-in-one-installer-run.md"

#### Süzgeç düğümü ve sonrasında analitik farklı sunucularda

!!! warning "Süzgeç düğümü ve sonrasında analitik modülleri yükseltme adımları sırası"
    Süzgeç düğümü ve sonrasında analitik modülleri farklı sunucularda kuruluysa, süzgeç düğümü paketlerini güncellemeden önce sonrasında analitik paketlerini yükseltmek gereklidir.

1. Sonrasında analitik modülünü aşağıdaki [talimatları](separate-postanalytics.md) izleyerek yükseltin.
1. Süzgeç düğümünü yükseltin:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Düğümleri Wallarm Konsol Kullanıcı arayüzünde mantıksal gruplama için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
        ```

### Adım 7: İzin listelerini ve reddetme listelerini önceki Wallarm düğüm sürümünden 4.8'e aktarın (yalnızca 2.18 veya daha eski bir düğüm yükseltirken)

2.18 veya daha eski bir düğüm yükseltirken, izin listesi ve reddetme listesi yapılandırmasını önceki Wallarm düğüm sürümünden en yeni sürüme [aktarın](../migrate-ip-lists-to-node-3.md).

### Adım 8: NGINX ve sonrasında analitik yapılandırmasını eski düğüm makinesinden yeniye aktarın

Düğümle ilgili NGINX yapılandırmasını ve sonrasında analitik yapılandırmasını eski makinedeki yapılandırma dosyalarından yeni makinedeki dosyalara aktarın. Bunu, gereken yönergeleri kopyalayarak yapabilirsiniz.

**Kaynak dosyalar**

Eski bir makinede, işletim sistemine ve NGINX sürümüne bağlı olarak, NGINX yapılandırma dosyaları farklı dizinlerde bulunabilir ve farklı isimlere sahip olabilir. En yaygın olanlar şunlardır:

* `/etc/nginx/conf.d/default.conf` NGINX ayarları ile
* `/etc/nginx/conf.d/wallarm.conf` genel filtreleme düğümü ayarları ile

    Bu dosya, tüm domainlere uygulanan ayarlar için kullanılır. Farklı ayarları farklı domain gruplarına uygulamak için genellikle `default.conf` kullanılır veya her domain grubu için yeni bir yapılandırma dosyası oluşturulur (örneğin, `example.com.conf` ve `test.com.conf`). NGINX yapılandırma dosyaları hakkında ayrıntılı bilgi [resmi NGINX belgelerinde](https://nginx.org/en/docs/beginners_guide.html) bulunabilir.
    
* `/etc/nginx/conf.d/wallarm-status.conf` ile Wallarm düğümünün izlenme ayarları. Detaylı açıklama [bağlantıda][wallarm-status-instr] mevcuttur.

Ayrıca, sonrasında analitik modülünün yapılandırması (Tarantool veritabanı ayarları) genellikle aşağıdaki yerlerdedir:

* `/etc/default/wallarm-tarantool` veya
* `/etc/sysconfig/wallarm-tarantool`

**Hedef dosyalar**

Her şey dahil kurulum uygulaması farklı OS ve NGINX sürümleri ile çalışırken, yeni makinenizdeki [hedef dosyalar](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) farklı isimlere sahip olabilir ve farklı dizinlerde bulunabilir.

Yapılandırmayı aktarırken, aşağıdaki adımları gerçekleştirmeniz gerekmektedir.

#### Kullanılmayan NGINX yönergelerini yeniden adlandırın

Yapılandırma dosyalarında açıkça belirtilmişse aşağıdaki NGINX yönergelerinin ismini değiştirin:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Sadece yönergelerin isimlerini değiştirdik, mantıkları aynı kaldı. Eski isimlerdeki yönergeler yakında kullanılmayacak hale gelecek, bu yüzden önce onları yeniden adlandırmanız önerilir.

#### Düğüm günlüğü değişkenlerini güncelleyin

Yeni düğüm sürümünde, aşağıdaki [düğüm günlüğü değişkenlerine](../../admin-en/configure-logging.md#filter-node-variables) ilişkin değişiklikler gerçekleştirilmiştir:

* `wallarm_request_time` değişkeninin ismi `wallarm_request_cpu_time` olarak değiştirildi.

    Sadece değişkenin ismini değiştirdik, mantığı aynı kaldı. Eski isim geçici olarak desteklenmeye devam eder, ancak yine de değişkeni yeniden adlandırmanız önerilir.
* Toplam sürenin (sıraya alma süresi ve CPU'nun talebi işleme süresi) toplamını günlük bilgiler olarak döndürmeniz gerekiyorsa, `wallarm_request_mono_time` değişkeni eklenmiştir.

#### Wallarm düğümünün filtreleme modu ayarlarını en son sürümlerde yayınlanan değişikliklere göre ayarlayın

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değiştirilmiş mantığına](what-is-new.md#filtration-modes) uygun olduğunu doğrulayın: 
      * [`wallarm_mode` yönergesi](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Konsolu'nda yapılandırılmış Genel filtreleme kuralı](../../user-guides/settings/general.md)
      * [Wallarm Konsolu'nda yapılandırılmış düşük seviye filtreleme kuralları](../../user-guides/rules/wallarm-mode-rule.md)
2. Beklenen davranış, değiştirilmiş filtreleme modu mantığına uymuyorsa, lütfen filtreleme modu ayarlarını yayınlanan değişikliklere göre ayarlayın [talimatlar](../../admin-en/configure-wallarm-mode.md) kullanarak.

#### `overlimit_res` saldırı tespitinin yönergesinden kurala olan yapılandırmasını aktarın

--8<-- "../include-tr/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

#### `wallarm-status.conf` dosya içeriğini güncelleyin

`/etc/nginx/conf.d/wallarm-status.conf` içeriğini aşağıdaki gibi güncelleyin:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Erişim yalnızca filtre düğümü sunucusunun döngü adresleri için kullanılabilir 
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarını kontrol etme devre dışı bırakılıdır, kara listeye alınmış IP'ler wallarm-status hizmetini talep etmeye izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[İstatistik hizmeti yapılandırması hakkında daha fazla detay](../../admin-en/configure-statistics-service.md)

#### Wallarm engelleme sayfasını güncelleyin

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boştur.

Engellenen isteklere yanıt olarak `&/usr/share/nginx/html/wallarm_blocked.html` sayfası dönüyorsa, yeni versiyondaki örnek sayfayı [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

### Adım 10: Engelleme modüllerini yapısına yüklendi

Bu süre zarfında, senin demasi modüllerin klasör yapısına yüklendi [talimatlar](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).

Bir süre sonra, modülün işlemi yanlış pozitiflere neden olmadığından emin olun. Yanlış pozitifler bulursanız, lütfen [Wallarm teknik desteğine](mailto:support@wallarm.com) başvurun.

### Adım 11: NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/installation/restart-nginx-systemctl.md"

### Adım 12: Wallarm düğüm işlemini test edin

Yeni düğümün işlemini test etmek için:

1. Test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırıları içeren bir talebi korunan kaynak adresine gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Konsolunu → **Events** kısmını [ABD Cloud](https://us1.my.wallarm.com/search) veya [AB Cloud](https://my.wallarm.com/search) içinde açın ve saldırıların listesinde göründüğünden emin olun.
1. Cloud depolama verilerinizin (kurallar, IP listeleri) yeni düğüme senkronize olmasından hemen sonra, kurallarınızın beklendiği gibi çalıştığını doğrulamak için bazı test saldırıları gerçekleştirin.

### Adım 13: Trafik göndermeyi Wallarm düğümüne ayarlayın

Kullanılan dağıtım yaklaşımına bağlı olarak, aşağıdaki ayarları gerçekleştirin:

=== "Çizgi içi"
    Yük dengeleyici hedeflerinizi Wallarm örneğine trafik göndermek üzere güncelleyin. Detaylar için, lütfen yük dengeleyicinizin belgelerine başvurun.

    Trafik tamamen yeni düğüme yönlendirilmeden önce, öncelikle kısmen yönlendirilmesi ve yeni düğümün beklendiği gibi davranıp davranmadığının kontrol edilmesi önerilir.

=== "Bant dışı"
    Web veya proxy sunucunuzu (ör. NGINX, Envoy) Wallarm düğümüne gelen trafiği aynalamak için yapılandırın. Yapılandırma detayları için, web veya proxy sunucunuzun belgelerine başvurmanızı öneririz.

    [Bağlantı][web-server-mirroring-examples] içinde, en popüler web ve proxy sunucular için (NGINX, Traefik, Envoy) örnek yapılandırmaları bulacaksınız.

### Adım 14: Eski düğümü kaldırın

1. Eski düğümü Wallarm Konsolunda → **Nodes** seçerek ve **Delete**'i tıklayarak silin.
1. Eylemi onaylayın.
    
    Düğüm Cloud'dan silindiğinde, uygulamalarınıza yönelik taleplerin filtrelemesini durdurur. Süzgecin kaldırılmasını geri alınamaz. Düğüm, düğüm listesinden kalıcı olarak silinir.

1. Eski düğüm makinesini silin veya sadece Wallarm düğüm bileşenlerini temizleyin:

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

## Manuel yükseltme

### Manuel yükseltme için gereksinimler

--8<-- "../include-tr/waf/installation/basic-reqs-for-upgrades.md"

### Yükseltme prosedürü

* Süzgeç düğümü ve sonrasında analitik modülleri aynı sunucuda kuruluysa, aşağıdaki talimatları izleyerek tüm paketleri yükseltin.
* Süzgeç düğümü ve sonrasında analitik modülleri farklı sunucularda kuruluysa, **önce** sonrasında analitik modülünü yükseltin ve sonra bu [talimatları](separate-postanalytics.md) izleyerek süzgeç modülünü yükseltin.

### Adım 1: Threat Replay Testing modülünü devre dışı bırakın (2.16 veya daha eski bir düğüm yükseltirken)

Wallarm düğüm 2.16 veya daha eski bir sürüm yükseltirken, lütfen Wallarm Konsolunda → **Zaafiyetler** → **Yapılandır** kısmında [Aktif tehdit doğrulama](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülünü devre dışı bırakın.

Modül işlemi, yükseltme işlemi sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülün devre dışı bırakılması bu riski en aza indirir.

### Adım 2: API portunu güncelleyin

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

### Adım 3: NGINX'i en son sürüme yükseltin

NGINX'i ilgili talimatları kullanarak en son sürüme yükseltin:

=== "NGINX kararlı"

    DEB tabanlı dağıtımlar:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPM tabanlı dağıtımlar:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    NGINX Plus için, lütfen [resmi yükseltme talimatlarını](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus) izleyin.
=== "NGINX Debian/CentOS depo"

    NGINX'i [Debian/CentOS depolandığı yerden kurduysanız](../../installation/nginx/dynamic-module-from-distr.md), lütfen bu adımı atlayın. Yüklenen NGINX sürümü, Wallarm modülleri ile birlikte [daha sonra](#step-7-upgrade-wallarm-packages) yükseltilecektir.

Altyapınızın özelleştirilmiş bir NGINX sürümüne ihtiyacı varsa, lütfen NGINX'in özelleştirilmiş sürümü için Wallarm modülünün oluşturulması ile ilgili olarak [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

### Adım 4: Yeni Wallarm deposunu ekleyin

Önceki Wallarm deposu adresini silin ve yeni Wallarm düğüm sürümünün paketi ile bir depo ekleyin. Lütfen uygun platform için komutları kullanın.

**CentOS ve Amazon Linux 2.0.2021x ve altı**

=== "CentOS 7 ve Amazon Linux 2.0.2021x ve altı"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "CentOS 8.x desteği sona ermiştir"
        CentOS 8.x desteği [sona ermiştir](https://www.centos.org/centos-linux-eol/). Wallarm düğümünü AlmaLinux, Rocky Linux, Oracle Linux 8.x veya RHEL 8.x işletim sistemi üzerine kurabilirsiniz.

        * [NGINX 'stable' için yükleme talimatları](../../installation/nginx/dynamic-module.md)
        * [CentOS/Debian depolarından kurulan NGINX için yükleme talimatları](../../installation/nginx/dynamic-module-from-distr.md)
        * [NGINX Plus için yükleme talimatları](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

**Debian ve Ubuntu**

1. Wallarm deposu adresinin bulunduğu dosyayı yüklü metin düzenleyici ile açın. Bu talimatlarda **vim** kullanılmaktadır.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Önceki depo adresini yorum satırına alın veya silin.
3. Yeni bir depo adresi ekleyin:

    === "Debian 10.x (buster)"
        !!! warning "NGINX sable ve NGINX Plus tarafından desteklenmiyor"
            Resmi NGINX sürümleri (stable ve Plus) ve bu bağlamda Wallarm düğümü 4.4 ve üzeri, Debian 10.x'te (buster) yüklenemez. Yalnızca [NGINX'in Debian/CentOS depolarından yüklandığı](../../installation/nginx/dynamic-module-from-distr.md) bu işletim sistemini kullanınız.

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.8/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/
        ```

### Adım 5: İzin listelerini ve reddetme listelerini önceki Wallarm düğüm sürümünden 4.8'e aktarın (yalnızca 2.18 veya daha eski bir düğüm yükseltirken)

2.18 veya daha eski bir düğüm yükseltirken, izin listesi ve reddetme listesi yapılandırmasını önceki Wallarm düğüm sürümünden en yeni sürüme [aktarın](../migrate-ip-lists-to-node-3.md).

### Adım 6: Wallarm paketlerini yükseltin

#### Süzgeç düğümü ve sonrasında analitik aynı sunucuda

Aşağıdaki komutu, süzgeç düğümü ve sonrasında analitik modülleri yükseltmek için çalıştırın:

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

    --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
=== "CentOS veya Amazon Linux 2.0.2021x ve altı"
    ```bash
    sudo yum update
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

#### Süzgeç düğümü ve sonrasında analitik farklı sunucularda

!!! warning "Süzgeç düğümü ve sonrasında analitik modülleri yükseltme adımları sırası"
    Süzgeç düğümü ve sonrasında analitik modülleri farklı sunucularda kuruluysa, süzgeç düğümü paketlerini güncellemeden önce sonrasında analitik paketlerini yükseltmek gereklidir.

1. Sonrasında analitik modülünü aşağıdaki [talimatları](separate-postanalytics.md) izleyerek yükseltin.
2. Wallarm düğümü paketlerini yükseltin:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include-tr/waf/upgrade/warning-expired-gpg-keys-4.8.md"

        --8<-- "../include-tr/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. Paket yöneticisi, `/etc/cron.d/wallarm-node-nginx` konfigürasyon dosyasının içeriğinin yeniden yazılmasını onaylamanızı isterse:

    1. [IP listesinin taşınmasının](#step-6-migrate-allowlists-and-denylists-from-previous-wallarm-node-version-to-42) tamamlandığından emin olun.
    2. Dosyanın yeniden yazılmasını `Y` seçeneği kullanarak onaylayın.

        Paket yöneticisi, dosyanın `/etc/cron.d/wallarm-node-nginx` [önceki Wallarm düğüm sürümlerinde değiştirildiyse](/2.18/admin-en/configure-ip-blocking-nginx-en/), yeniden yazma onayını ister. Wallarm düğümü 3.x'te IP listesi mantığı değiştikçe, `/etc/cron.d/wallarm-node-nginx` içeriği buna göre güncellendi. İzin verme listesi, Wallarm düğümü 3.x'te doğru şekilde çalışması için, 3.x düğümünün güncellenmiş yapılandırma dosyasını kullanması gereklidir.

        Varsayılan olarak, paket yöneticisi `N` seçeneğini kullanır, ancak Wallarm düğümü 3.x'in IP adresinin izin verme listesinde doğru bir şekilde çalışabilmesi için `Y` seçeneği gereklidir.

### Adım 7: Düğüm tipini güncelleyin

Dağıtılmış düğüm, **düzenli** olan eski tipi taşır ve bu [şimdi yeni **Wallarm düğümü** tipi ile değiştirildi](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

Sen yükseltme sırasında sürekli etki yaratan yerine yeni düğüm tipi yüklü olduğu tavsiye edilir 4.8. Eski düğüm tipi gelecekteki sürümlerde kaldırılacak, lütfen bunu önce yapın.

!!! info "Postanalytic modül ayrı bir sunucuda kuruluysa"
    Süzgeç modülü ve post-analitik modül ayrı sunucularda kuruluysa, bu modülleri aynı düğüm belirteci kullanarak Wallarm Cloud'a bağlamak önerilir. Wallarm Konsol Kullanıcı Arayüzü, her modülü ayrı bir düğüm örneği olarak görüntüler, örneğin:

    ![Node with several instances](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    Wallarm düğümü zaten ayrı olan [postanalytic modül yükseltme sırasında](separate-postanalytics.md) oluşturuldu. Başlangıçta trafiği işleyen modülün aynı düğüm kimlik bilgilerini kullanarak Cloud'a bağlanması için:

    1. Ayrı postanalytic modül yükseltme sırasında oluşturulan düğüm belirtecinin kopyasını alın.
    1. Aşağıdaki listedeki 4. adıma gidin.

Düzenli düğümü Wallarm düğümü ile değiştirmek için:

1. Wallarm Konsolu'nu açın → **Nodes** [ABD Cloud](https://us1.my.wallarm.com/nodes) veya [AB Cloud](https://my.wallarm.com/nodes) ve **Wallarm düğümü** tipinde düğüm oluşturun.

    ![Wallarm node creation][img-create-wallarm-node]
2. Oluşturulan belirteci kopyalayın.
3. Düğümün eski sürümünün bulunduğu sunucuda NGINX hizmetini duraklatın:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    NGINX servisini duraklatmak, RPS'nin yanlış hesaplanma riskini azaltır.
4. **Wallarm düğümünü** çalıştırmak üzere `register-node` betiğini çalıştırın:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>` kopyalanan düğüm belirteci veya `Deploy` rolüne sahip API belirteci değeri.
    * `--force` seçeneği, `/etc/wallarm/node.yaml` dosyasında belirtilen Wallarm Cloud erişim kimlik bilgilerini yeniden yazmayı zorlar. 

### Adım 8: Wallarm engelleme sayfasını güncelleyin

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boştur.

Engellenen isteklere yanıt olarak `&/usr/share/nginx/html/wallarm_blocked.html` sayfası dönüyorsa, yeni versiyondaki örnek sayfayı [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

### Step 9: Kullanılmayan NGINX yönergelerini yeniden adlandırın

Yapılandırma dosyalarında açıkça belirtilmişse aşağıdaki NGINX yönergelerinin ismini değiştirin:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

Sadece yönergelerin isimlerini değiştirdik, mantıkları aynı kaldı. Eski isimlerdeki yönergeler yakında kullanılmayacak hale gelecek, bu yüzden önce onları yeniden adlandırmanız önerilir.

### Adım 10: Düğüm günlüğü değişkenlerini güncelleyin

Yeni düğüm sürümünde, aşağıdaki [düğüm günlüğü değişkenlerine](../../admin-en/configure-logging.md#filter-node-variables) ilişkin değişiklikler gerçekleştirilmiştir:

* `wallarm_request_time` değişkeninin ismi `wallarm_request_cpu_time` olarak değiştirildi.

    Sadece değişkenin ismini değiştirdik, mantığı aynı kaldı. Eski isim geçici olarak desteklenmeye devam eder, ancak yine de değişkeni yeniden adlandırmanız önerilir.
* Toplam sürenin (sıraya alma süresi ve CPU'nun talebi işleme süresi) toplamını günlük bilgiler olarak döndürmeniz gerekiyorsa, `wallarm_request_mono_time` değişkeni eklenmiştir.

### Adım 11: Wallarm düğümünün filtreleme modu ayarlarını en son sürümlerde yayınlanan değişikliklere göre ayarlayın

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değiştirilmiş mantığına](what-is-new.md#filtration-modes) uygun olduğunu doğrulayın: 
      * [`wallarm_mode` yönergesi](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Konsolu'nda yapılandırılmış Genel filtreleme kuralı](../../user-guides/settings/general.md)
      * [Wallarm Konsolu'nda yapılandırılmış düşük seviye filtreleme kuralları](../../user-guides/rules/wallarm-mode-rule.md)
2. Beklenen davranış, değiştirilmiş filtreleme modu mantığına uymuyorsa, lütfen filtreleme modu ayarlarını yayınlanan değişikliklere göre ayarlayın [talimatlar](../../admin-en/configure-wallarm-mode.md) kullanarak.

### Adım 12: `overlimit_res` saldırı tespitinin yönergesinden kurala olan yapılandırmasını aktarın

--8<-- "../include-tr/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### Adım 13: `wallarm-status.conf` dosya içeriğini güncelleyin

`/etc/nginx/conf.d/wallarm-status.conf` içeriğini aşağıdaki gibi güncelleyin:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Erişim yalnızca filtre düğümü sunucusunun döngü adresleri için kullanılabilir 
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarını kontrol etme devre dışı bırakılıdır, kara listeye alınmış IP'ler wallarm-status hizmetini talep etmeye izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[İstatistik hizmeti yapılandırması hakkında daha fazla detay](../../admin-en/configure-statistics-service.md)

### Adım 14: NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

### Adım 15: Wallarm düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-after-node-type-upgrade.md"

### Adım 16: Threat Replay Testing modülünü yeniden etkinleştirin (2.16 veya daha eski bir düğüm yükseltirken)

[Threat Replay Testing modülünün kurulum önerilerini](../../vulnerability-detection/threat-replay-testing/setup.md) öğrenin ve gerektiği takdirde yeniden etkinleştirin.

Bir süre sonra, modülün işlemi yanlış pozitiflere neden olmadığından emin olun. Yanlış pozitifler bulursanız, lütfen [Wallarm teknik desteğine](mailto:support@wallarm.com) başvurun.

### Adım 17: Önceki sürümün düğümünü silin

Yeni düğümün işleminin doğru bir şekilde test edildikten sonra, Wallarm Konsolunun **Nodes** bölümünü açın ve önceki sürümün düzenli düğümünü listeden silin.

Postanalytic modül ayrı bir sunucuda kuruluysa, lütfen bu modülle ilgili düğüm örneğini de silin.

## Ayarları özelleştirme

Wallarm modülleri sürüm 4.8'a güncellendi. Önceki filtreleme düğümü ayarları yeni sürüme otomatik olarak uygulanacaktır. Ek ayarlar yapmak için, [mevcut yönergeleri](../../admin-en/configure-parameters-en.md) kullanın.

--8<-- "../include-tr/waf/installation/common-customization-options-nginx-4.4.md"
