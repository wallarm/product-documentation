# Wallarm On-Premises Çözüm Dağıtımı

Bu kılavuz, Wallarm Cloud ve Filtering Nodes bileşenlerinin yerinde (on‑premises) bir ortamda dağıtımına yönelik üst düzey talimatlar sunar.

## Gerekli beceriler

Wallarm’ı yerinde dağıtmak ve yönetmek için aşağıdaki konulara aşinalık önerilir:

* Linux sistem yönetimi (Ubuntu veya RHEL)
* Temel Kubernetes yönetimi (Helm, statefulset’ler, PVC’ler, cronjob’lar, vb.)
* Grafana veya Alertmanager gibi hizmetlerle sistem izleme

## Üst düzey dağıtım süreci

Aşağıda Wallarm’ı yerinde planlama ve dağıtım sürecine üst düzey bir bakış verilmiştir:

1. Wallarm’ın ayrıntılı yerinde dokümantasyonunu ve Wallarm ekibinin desteğini kullanarak bir dağıtım planı oluşturun.
1. [Önkoşulları](#system-requirements-for-wallarm-cloud-on-premises) hazırlayın: SSL sertifikaları, sunucu kimlik bilgileri, config.yaml, vb.
1. **wctl** aracı ve gerekli yapılandırma dosyaları ile yönetim çalışma istasyonunu kurun.
1. Wallarm Cloud düğümlerini hazırlayın ve örneği wctl kullanarak dağıtın.
1. Yük dengeleyiciyi yapılandırın (üretim kümeleri için).
1. Yerinde Wallarm Cloud lisans anahtarını yapılandırın.
1. Wallarm Cloud örneğinin gerekli yapılandırmasını gerçekleştirin (kullanıcılar, Wallarm ürün özellikleri, tetikleyiciler, kurallar, entegrasyonlar, vb.). [Saldırı önleme en iyi uygulamaları](../../quickstart/attack-prevention-best-practices.md) yardımcı olabilir.
1. [Desteklenen kendi barındırdığınız dağıtım seçeneklerinden](../../installation/supported-deployment-options.md) herhangi birini kullanarak Wallarm Filtering Nodes bileşenlerini dağıtın ve yapılandırın.

    !!! info "Wallarm Cloud adresi"
        Düğümü Wallarm tarafından yönetilen Cloud yerine yerel Wallarm Cloud’unuza bağlanacak şekilde yapılandırın. Aşağıdaki bağlantı parametrelerini kullanın:

        * Yerel Wallarm Cloud ana makine adı, örn. `api.wallarm-prod.mycompany.com`
        * Yerel Wallarm Cloud portu: `443/TCP`
        * Node token’ı veya API anahtarı: [dokümantasyonda](../../user-guides/settings/api-tokens.md) açıklandığı şekilde yerel Wallarm Console içinde üretin

        `docker run` komutuna örnek:

        ```
        docker run -d -e WALLARM_API_TOKEN='<API_TOKEN>' \
            -e WALLARM_LABELS='group=onprem' \
            -e WALLARM_API_HOST='api.wallarm-prod.mycompany.com' \
            -e NGINX_BACKEND='<BACKEND_IP>:8080' \
            -p 80:80 \
            -e TARANTOOL_MEMORY_GB='<HALF_OF_RAM>.0' \
            -v /etc/hosts:/etc/hosts \
            wallarm/node
        ```
1. [Sağlık Kontrolü Senaryolarını](../../admin-en/uat-checklist-en.md) kullanarak trafik akışını ve Wallarm Cloud işlevselliğini test edin.
1. Bir [veri yedekleme düğümü](#data-backups-and-disaster-recovery-planning) dağıtın ve yapılandırın.
1. Wallarm Cloud örneğinin ve Wallarm Filtering Nodes bileşenlerinin izlenmesini yapılandırın.
1. Tüm sistemin ayrıntılı testini gerçekleştirin ve müşterinin gereksinimlerini karşıladığını doğrulayın.
1. Wallarm Cloud ve Wallarm Filtering Node bileşenlerini, bakım faaliyetleri de dahil olmak üzere belgelendirin.
1. Tüm sistemin işletimi hakkında Wallarm’dan eğitim alın.

## Yerinde Wallarm Cloud için sistem gereksinimleri

Wallarm Cloud bileşeninin aşağıdaki donanım, ağ ve sistem gereksinimleri vardır.

### Yönetim çalışma istasyonu

[Yönetim çalışma istasyonu](overview.md#management-workstation), Wallarm Cloud’u **wctl** aracıyla kurmak ve işletmek için kullanılır.

Çoğu Wallarm müşterisi bu amaçla iş dizüstü veya masaüstü bilgisayarlarını kullanır – donanım gereksinimleri minimaldir ve çoğu ofis makinesi yeterlidir.

Alternatif olarak, özel bir sunucu kullanabilirsiniz. Bu durumda aşağıdaki gereksinimleri karşılamalıdır:

* Windows, macOS veya Linux işletim sistemi
* Intel (AMD64) veya ARM64 CPU mimarisi
* En az 2 GB RAM
* En az 50 GB disk alanı
* Docker kurulu (**wctl** aracını çalıştırmak için)
* Wallarm Cloud web arayüzüne erişmek için Google Chrome

    Wallarm Cloud örneğine erişimi olduğu sürece Chrome yüklü başka bir makineyi de kullanabilirsiniz.
* Wallarm Cloud sunucularına parolasız SSH erişimi
* Uygun [ağ bağlantısı](#network)

### Wallarm Cloud sunucuları

Wallarm Cloud sunucuları aşağıdaki gereksinimleri karşılamalıdır:

* Desteklenen işletim sistemi:

    * Ubuntu LTS 22.04 (Ubuntu LTS 24.04 henüz desteklenmiyor)
    * Red Hat Enterprise Linux 8.x veya 9.x
* Intel (AMD64) CPU mimarisi (ARM64 henüz desteklenmiyor)
* Yönetim çalışma istasyonundan parolasız SSH erişimine sahip ve parola olmadan `sudo` çalıştırma yetkisi olan normal bir SSH kullanıcı hesabı

    Parolasız SSH oturumu asimetrik şifrelemeye dayanır: genel anahtar sunucuda saklanır ve istemcinin kimlik doğrulaması için karşılık gelen özel anahtarı sunması gerekir.
* Hem dahili hem de harici alan adlarını çözebilen DNS çözücüleri (ör. `onprem.wallarm.com`)
* En az 350 MB/s I/O sağlayan SSD veya NVMe (düşük disk I/O performansı nedeniyle HDD’ler desteklenmez)
* ext4 veya XFS dosya sistemi
* En az 1 GB NIC bağlantıları
* Statik IP adresleri (özel, genel veya her ikisi)
* Üretim dağıtımı için:

    * Yedekli disk depolama (donanım veya yazılım RAID1/5/6)
    * Yedekli sunucu güç kaynakları
    * Yedekli ağ arayüzleri (arayüz bağlama/bonding)
* Uygun [ağ bağlantısı](#network)
* Uygun [CPU, bellek ve disk alanı](#capacity-planning)

### Wallarm veri yedekleme sunucusu

Wallarm, veri yedekleme sunucusunda S3-uyumlu nesne depolama olarak MinIO açık kaynak yazılımının kullanılmasını önerir. Yazılım [tek düğüm tek sürücü](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) modunda kurulabilir.

MinIO yazılımı aşağıdaki sistem yapılandırmalarını destekler:

* Intel (AMD64) CPU mimarisi
* En az 2 CPU çekirdeği
* En az 32 GB RAM
* Desteklenen işletim sistemi:

    * Ubuntu/Debian (MinIO tarafından desteklenen herhangi bir sürüm)
    * Red Hat Enterprise Linux
* XFS dosya sistemi

Önerilen disk boyutu 2 TB’dir.

### SMTP sunucusu

Wallarm Cloud, kullanıcı davetleri, parola sıfırlamaları, uyarılar ve raporlar için e-posta kullanır.

Varsayılan olarak, örnek bir web arayüzü olan yerleşik bir test e-posta sunucusunu içerir. Bu sunucu tüm giden iletileri yakalar ve inceleme için görüntüler. **Bu kurulum yalnızca test için önerilir**.

Üretim kullanımı için, Wallarm Cloud’un müşteri tarafından sağlanan bir SMTP sunucusunu kullanacak şekilde yapılandırılması gerekir. Gerekli SMTP sunucusu parametreleri:

* Giden e-posta iletilerinde kullanılacak alan adı (Wallarm yazılımı, alan adı ve `no-reply` gibi bir kullanıcı adını kullanarak **From** e-posta adresini oluşturur)
* SMTP sunucusu ana makine adı veya IP adresi
* SMTP hizmet portu
* SMTP sunucusunun TLS şifreleme desteği
* Kimlik doğrulama bilgileri (kullanıcı adı ve parola)

### Alan adı ve DNS kayıtları

Wallarm Cloud bileşenine, kuruluşun birincil alan adı içinde ayrı bir alan adı veya alt alan adı atanmalıdır. Birden fazla Wallarm Cloud bileşeni (örneğin üretim ve hazırlık ortamları) dağıtıyorsanız, her örneğe kendi alan adı atanmalıdır.

Örneğin, birincil şirket alan adı `mycompany.com` ise, aşağıdaki alt alan adları Wallarm Cloud örneklerine atanabilir:

* Üretim ortamı: `wallarm-prod.mycompany.com`
* Hazırlık (staging) ortamı: `wallarm-staging.mycompany.com`
* Felaket kurtarma (DR) ortamı: `wallarm-dr.mycompany.com`

### SSL sertifikası

Planlanan Wallarm Cloud örneği için seçilen alan adına uygun bir genel veya kendinden imzalı SSL sertifikası sağlamanız gerekir. Sertifika aşağıdaki ağ iletişimlerini korumak için kullanılacaktır:

* Wallarm filtering nodes bileşenlerinden Wallarm Cloud örneğine
* Wallarm yöneticilerinden (çalışma istasyonları) Wallarm Cloud Console UI ve API’sine

Kolaylık sağlaması ve ortamınızda bir Wallarm Cloud **test örneğinin** dağıtımını hızlandırmak için, Wallarm mühendisleri `onprem.wallarm.tools` alan adıyla birlikte kullanılmak üzere `*.onprem.wallarm.tools` genel adı için geçici bir SSL sertifikası ve özel anahtar sağlayabilir.

### Ağ

Bir Wallarm Cloud örneğinin sunucuları, İnternet’ten ve iç ağın geri kalanından izole edilmiş aynı LAN ve ağ alt ağında konumlandırılmalıdır.

Sunucular aşağıdaki ağ bağlantısı (güvenlik duvarı) izinlerine ihtiyaç duyar:

* Yerel (host tabanlı) güvenlik duvarları tamamen devre dışı
* Giden ağ bağlantıları:

    | Kaynak (source) | Hedef (destination) | Hedef port(lar) | İş gerekçesi |
    | ----- | ----- | ----- | ----- |
    | Tüm Wallarm Cloud düğümleri | https://hibp.onprem.wallarm.com; https://scripts.onprem.wallarm.com; https://packages-versions.onprem.wallarm.com; https://repo.onprem.wallarm.com; https://registry.onprem.wallarm.com; https://configs.onprem.wallarm.com/; (statik IP adresi 34.90.162.10) | 443/TCP | Wallarm yerinde yazılım paketleri ve container’ların indirilmesi |
    | Tüm Wallarm Cloud düğümleri | Wallarm veri yedekleme sunucusu veya S3-uyumlu nesne depolama hizmeti | 443/TCP (veya kullanılan S3-uyumlu depolama hizmetinin kullandığı herhangi bir TCP portu) | Veri yedeklerinin depolanması |
    | Yönetim çalışma istasyonu | Wallarm veri yedekleme sunucusu veya S3-uyumlu nesne depolama hizmeti | 443/TCP (veya kullanılan S3-uyumlu depolama hizmetinin kullandığı herhangi bir TCP portu) | Veri yedeklerine erişmek ve başarılı bir veri kurtarma için gerekli bazı verileri depolamak |
    | Tüm Wallarm Cloud düğümleri | Kurumsal SMTP sunucusu | Tipik olarak 587/TCP (TLS üzerinden Güvenli SMTP) | E-posta iletilerini göndermek için |
    | Tüm Wallarm Cloud düğümleri | SIEM, günlük toplama, mesajlaşma vb. gibi iç ve dış üçüncü taraf entegrasyonları/hizmetleri | Uygulamaya özgü portlar | Yapılandırılmış [üçüncü taraf entegrasyonunun](../../user-guides/settings/integrations/integrations-intro.md) kullanılması |

* Gelen ağ bağlantıları:

    | Kaynak (source) | Hedef (destination) | Hedef port(lar) | İş gerekçesi |
    | ----- | ----- | ----- | ----- |
    | Tüm Wallarm filtering nodes | Wallarm Cloud küme düğümlerinin önündeki yük dengeleyicinin IP adresi; bağımsız Wallarm Cloud sunucusunun IP adresi | 443/TCP | Filtering nodes bileşenlerinden Wallarm Cloud örneğine iletişim (kayıt, yapılandırma, saldırı/oturum veri yükleme, vb.) |
    | Yönetim çalışma istasyonu | Tüm Wallarm Cloud düğümleri | 6443/TCP (K8s API) | Kubernetes API erişimi |
    | Yönetim çalışma istasyonu | Wallarm Cloud küme düğümlerinin önündeki yük dengeleyicinin IP adresi; bağımsız Wallarm Cloud sunucusunun IP adresi | 443/TCP | Wallarm Cloud Console UI erişimi |
    | Dahili DNS çözücüleri | Wallarm Cloud küme düğümlerinin önündeki yük dengeleyicinin IP adresi | 53/UDP | Müşterinin uygulama hazırlık ortamında Wallarm [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) özelliği tarafından gerçekleştirilen DNS tabanlı zafiyet doğrulamaları |
    | Tüm Wallarm Cloud düğümleri | Tüm Wallarm Cloud düğümleri | Tüm IP protokolleri, tüm TCP ve UDP portları | Küme düğümleri arasındaki dahili iletişim |

* Wallarm Cloud sunucularına ve yük dengeleyiciye İnternet kaynaklı tüm trafiğin engellenmesi önemle tavsiye edilir
* Wallarm Cloud küme örneğindeki sunucular arasında AĞ bağlantısı kısıtlaması OLMAMALIDIR

Küme modunda dağıtımda bağımsız bir ağ yük dengeleyicisi kullanmak isterseniz, yukarıda belirtilen gelen ağ bağlantı kurallarını yük dengeleyiciyi hesaba katacak şekilde yeniden düzenlemelisiniz.

!!! info "Air-gapped ağ henüz desteklenmiyor"
    Lütfen şu anda bir Wallarm Cloud örneğinin tam anlamıyla [air-gapped bir ağda](https://en.wikipedia.org/wiki/Air_gap_(networking)) dağıtılamadığını unutmayın.

### Kapasite planlama

Wallarm Cloud bileşeni dağıtımı için kapasite planlamasını etkileyen çeşitli faktörler vardır:

* Test veya üretim dağıtımı
* Wallarm’ın [API Sessions](../../api-sessions/overview.md) ve [API Abuse Prevention](../../api-abuse-prevention/overview.md) özelliklerinin kullanılıp kullanılmadığı – bu özellikler çok fazla disk depolaması gerektirir
* Korumaya alınan API hizmetlerinin trafik modeli – Trafik seviyesi 24 saatlik aralık boyunca sabit mi? Sistem, haftanın belirli günlerinde veya tatil sezonlarında yüksek trafik yaşıyor mu?

Aşağıdakiler her bir Wallarm Cloud düğümü için minimum donanım gereksinimleridir:

* En az 16 CPU çekirdeği
* En az 64 GB RAM
* SSD disk boyutu ve bölümlendirme:

    * `/(root)` birimi – en az 200 GB
    * `/var/lib/wallarm-storage` birimi – en az 2.5 TB (kök bölümün bir parçası olabilir)

**Test** (bağımsız) dağıtımda, yukarıdaki yapılandırmaya sahip tek bir sunucu yeterlidir.

**Üretim** (küme) dağıtımında, aynı yapılandırmaya sahip en az 3 sunucu gerekir.

Yukarıdaki minimum yapılandırma ile 3 düğümlü bir üretim kümesi ayda 1 milyar API isteğine kadar (RPM) işleyebilir.

Ortamınız daha fazla kapasite gerektiriyorsa, her ek 5 milyar RPM için her düğümü şu şekilde ölçeklendirmelisiniz:

* 2 CPU çekirdeği
* 2 GB RAM
* 100 GB ek disk alanı

## Veri yedekleri ve felaket kurtarma planlaması

Wallarm Cloud varsayılan olarak düzenli yedekleme yapmaz. Üretim dağıtımları için veri yedeklemelerinin yapılandırılması önemle önerilir.

Bir Wallarm Cloud dağıtımını yedeklemek için aşağıdaki seçenekler mevcuttur:

* Tek seferlik yedekleme için ve sunucular VMWare veya benzeri bir sanallaştırma platformu kullanılarak sağlandıysa, müşteri sunucuları kontrollü şekilde durdurabilir ve sanallaştırma platformunun sağladığı araçlarla disk anlık görüntüleri/yedekleri alabilir.
* Sağlanan [MinIO](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html) kurulum talimatlarını kullanarak bağımsız bir Wallarm Data Backup Server (WDBS) dağıtın ve Wallarm Cloud örneğini günlük yedeklemeleri yedek sunucuya yapacak şekilde yapılandırın. Diğer bir seçenek de herhangi bir Amazon S3-uyumlu nesne depolamayı kullanmaktır.

Wallarm Cloud verileri Data Backup Server üzerinde depolandıktan sonra, veriler **10 yedekleme çalıştırmasından** sonra otomatik olarak döndürülür (müşteri tarafından değiştirilebilir). Müşteri isteğe bağlı olarak, uzun vadeli veya dış saha depolaması için ek yedek kopyaları oluşturmak üzere kurumsal bir veri yedekleme sistemi (disk veya teyp tabanlı yedekleme jukebox’ı gibi) kullanabilir.

Felaket Kurtarma planlaması için Wallarm, aşağıdaki mimarinin uygulanmasını önerir:

* Birincil Wallarm Cloud örneği ile aynı **bağımsız** veya **küme** modunda, DR mod bayrağı `true` olarak ayarlanmış ek bir Wallarm Cloud Disaster Recovery örneği dağıtın.
* DR modunda, Wallarm Cloud örneği birincil Wallarm Cloud örneği tarafından günlük olarak oluşturulan ve Wallarm Data Backup Server’a gönderilen tüm yeni veri yedeklerini otomatik olarak örneğe geri yükleyecektir.

    Birincil Wallarm Cloud örneğinin verileri doğrudan DR Wallarm Cloud örneğine göndermeyeceğini, tüm veri transferlerinin veri yedekleme sunucusu üzerinden gerçekleştiğini unutmayın.  
* Veriler DR sahasına düzenli olarak (en az günlük) çoğaltılsa da, çoğaltma gerçek zamanlı değildir.
* Normalde, DR sahası yalnızca blok depolama sistemini çalıştırır ve hiçbir veritabanı veya Wallarm Cloud yazılım bileşenini çalıştırmaz; bu nedenle DR örneği ek yeniden yapılandırma adımları olmadan herhangi bir hizmet sunamaz.

![!](../../images/waf-installation/on-premise/backup-dr.png)

Şu anda, Wallarm Cloud yazılımı birincil saha kesintisi durumunda DR sahasına otomatik geçişi desteklememektedir. Aşağıda manuel DR geçiş sürecine üst düzey bir bakış verilmiştir:

1. Birincil Wallarm Cloud örneğinin kullanılamaz olduğunu doğrulayın; gerekirse ilgili sunucu örneklerini kapatın.
1. DR örneğinde, Data Backup Server’dan veri yedekleme çoğaltmasının son yedekleme çalıştırması için başarıyla tamamlandığını doğrulayın.
1. **wctl** yönetim aracını kullanarak DR örneğini DR modundan birincil moda geçirin. Bu prosedür, DR örneğinin yapılandırmasında aşağıdaki değişiklikleri yapacaktır:
   
    1. Data Backup Server’dan DR örneğine veri çoğaltma sürecini durduracaktır.
    1. Gerekli veri deposu ve Wallarm uygulama bileşenlerini başlatacak ve son olarak DR örneğini birincil moda geçirecektir.
1. Wallarm filtering nodes bileşenlerini yeni kurtarılan Wallarm Cloud örneğini kullanacak şekilde yeniden yapılandırın. Bu, aşağıdaki yöntemlerden biri kullanılarak yapılabilir:

    1. İlgili tüm DNS kayıtlarının IP adresini eski (yok olan) Wallarm Cloud örneğinden yeni kurtarılan örneğe işaret edecek şekilde değiştirin.
    1. Filtering nodes bileşenlerini, kurtarılan Wallarm Cloud örneği ile ilişkili DNS adlarını kullanacak şekilde yeniden yapılandırın.

İyi planlanmış ve düzenli olarak test edilmiş bir Wallarm Cloud felaket kurtarma stratejisi aşağıdaki RTO ve RPO parametrelerini sağlayabilir:

* RPO (Kurtarma Noktası Hedefi): 25 saat veya daha az
* RTO (Kurtarma Süresi Hedefi): 1 saat veya daha az

## Güvenlik sağlamlaştırma

Wallarm Cloud örneğini tasarlarken, dağıtırken ve yönetirken kurumsal güvenlik politikalarınızı ve uygulamalarınızı takip etmenizi öneririz.

Wallarm Cloud örneğinizi güvenli tutmak için aşağıdaki hususlara dikkat etmenizi öneririz:

1. Dağıtılan tüm Wallarm Cloud örneklerine (üretim, hazırlık, felaket kurtarma, vb.) ve Wallarm veri yedekleme sunucusuna gelen İnternet erişimini devre dışı bırakın.  
2. İlgili tüm sunucularda işletim sistemi güvenlik yamalarını zamanında dağıtın. Lütfen işletim sistemi yamalarının Wallarm tarafından değil, OS satıcıları (RedHat, Ubuntu) tarafından sağlandığını unutmayın.  
3. Wallarm tarafından sağlanan yeni Wallarm Cloud yazılım sürümlerini zamanında dağıtın.  
4. Şüpheli etkinlikleri izlemek için mevcut kurumsal güvenlik izleme sisteminizi (ajanları) kullanarak ilgili tüm sunucuları izleyin.  
5. Wallarm yazılımı tarafından üretilen önemli güvenlik olaylarını zamanında toplamak ve işlemek için Wallarm Cloud hizmetini kurumsal SIEM’iniz ve bildirim yükseltme hizmetlerinizle entegre edin.  
6. Kimlerin, hangi izinlerle Wallarm düğüm sunucularına ve Console UI’a erişimi olduğunu kontrol edin ve periyodik olarak gözden geçirin.