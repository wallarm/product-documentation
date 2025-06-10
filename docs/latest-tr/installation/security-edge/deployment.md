# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

**Security Edge** platformu, Wallarm tarafından barındırılan bir ortamda, coğrafi olarak dağıtılmış konumlarda Wallarm düğümlerinin konuşlandırılması için yönetilen bir hizmet sunar. Ana konuşlandırma seçeneklerinden biri olan **inline** dağıtım, herhangi bir yerinde kurulum gerektirmeden tüm API altyapınız için gerçek zamanlı, sağlam koruma sağlar.

Bu, DNS ayarlarınızda CNAME kayıtlarını düzenleyerek trafiğinizi Wallarm'ın edge düğümlerine yönlendirebildiğinizde API'lerinizi güvence altına almak için ideal bir çözümdür.

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## Nasıl Çalışır

Security Edge hizmeti, Wallarm düğümlerinin Wallarm tarafından konuşlandırılan, barındırılan ve yönetilen güvenli bir bulut ortamı sağlar:

* Anahtardan teslim konuşlandırma: Dünya genelinde dağıtılmış konumlarda Wallarm'ın düğümleri otomatik olarak konuşlandırması için minimum kurulum gereklidir.
* Otomatik ölçeklendirme: Düğümler, manuel yapılandırma olmaksızın değişen trafik yüklerini karşılamak için yatay olarak otomatik ölçeklenir.
* Azaltılmış maliyetler: Wallarm tarafından yönetilen düğümler sayesinde daha düşük operasyonel giderler, daha hızlı konuşlandırma ve ölçeklenebilirlik.
* Sorunsuz entegrasyon: API altyapınızı kesinti olmadan korumanıza olanak tanıyan basit yapılandırma.

## Sınırlamalar

* Şu anda Edge inline düğümü yalnızca doğrudan, İnternete açık konuşlandırmayı destekler. Trafiği yönlendiren üçüncü taraf bir hizmetin (örneğin, Cloudflare, Akamai gibi CDN veya DDoS koruma sağlayıcısı) arkasında çalışamaz.
* Yalnızca üçüncü seviye veya daha yüksek alan adları desteklenir (örneğin, yerine `domain.com` kullanmak yerine `www.domain.com` kullanın).
* Yalnızca 64 karakterden kısa alan adları desteklenir.
* Yalnızca HTTPS trafiği desteklenir; HTTP'ye izin verilmez.
* Edge düğüm konuşlandırmasını başlatmak için sertifika CNAME kayıtlarının eklenmesi gerekir.
* Sertifika CNAME kaydı 14 gün içinde eklenmezse, düğüm konuşlandırması başarısız olur.

## Edge Inline'ı Yapılandırma

Edge inline'ı çalıştırmak için Wallarm Console → **Security Edge** → **Edge inline** → **Configure** bölümüne gidin. Trafiği yönlendirmek için birden fazla origin ve korumak için birden fazla host yapılandırabilirsiniz.

Bu bölüm mevcut değilse, hesabınızın ilgili abonelik hakkına sahip olmaması muhtemeldir, lütfen sağlamak için sales@wallarm.com ile iletişime geçin.

Edge düğüm konuşlandırma ayarlarını istediğiniz zaman güncelleyebilirsiniz. Düğüm, mevcut CNAME kayıtları değişmeden yeniden konuşlandırılacaktır.

### 1. Genel Ayarlar

Genel ayarlarda, Edge düğümünün konuşlandırılacağı bölgeleri ve filtrelenmiş trafiğin yönlendirileceği origin'leri belirtirsiniz.

#### Bölgeler

Edge düğümünü konuşlandırmak için bir veya birden fazla bölge seçin. API'lerinizin veya uygulamalarınızın barındırıldığı yerlere yakın bölgelerin seçilmesini öneririz.

Birden fazla bölgede konuşlandırma, coğrafi yedekliliği artırır ve yüksek erişilebilirlik sağlar.

#### Origin Sunucuları

Edge düğümünün filtrelenmiş trafiği yönlendireceği origin'leri belirtin. Her origin için, sunucu IP adresi, alan adı veya isteğe bağlı bir port ile birlikte FQDN sağlayın (varsayılan: 443).

Bir origin'in birden fazla sunucusu varsa, hepsini belirtebilirsiniz. İstekler aşağıdaki şekilde dağıtılır:

* Yuvarlak-robin algoritması kullanılır. İlk istek ilk sunucuya, ikinci istek sıradaki sunucuya gönderilir ve sonuncunun ardından ilk sunucuya döner.
* IP tabanlı oturum kalıcılığı ile, aynı IP'den gelen trafik sürekli olarak aynı sunucuya yönlendirilir.

!!! info "Origin'lere Wallarm IP aralıklarından gelen trafiğe izin verin"
    Origin'leriniz, seçilen bölgeler tarafından kullanılan IP aralıklarından gelen trafiğe izin vermelidir:

    * AWS

        === "US East 1"
            ```
            18.215.213.205
            44.214.56.120
            44.196.111.152
            ```
        === "US West 1"
            ```
            52.8.91.20
            13.56.117.139
            54.177.237.34
            50.18.177.184
            ```
        === "EU Central 1 (Frankfurt)"
            ```
            18.153.123.2
            18.195.202.193
            3.76.66.246
            3.79.213.212
            ```
        === "EU Central 2 (Zurich)"
            ```
            51.96.131.55
            16.63.191.19
            51.34.0.90
            51.96.67.145
            ```

    * Azure

        === "East US"
            ```
            104.211.29.72
            104.211.29.73
            ```
        === "West US"
            ```
            104.210.63.116
            104.210.63.117
            ```
        === "Germany West Central (EU)"
            ```
            20.79.250.104
            20.79.250.105
            ```
        === "Switzerland North (EU)"
            ```
            20.203.240.193
            20.203.240.192
            ```

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

Daha sonra, trafik analizi ve filtreleme için host eklerken, her host veya lokasyonu belirlenen origin ile eşleştireceksiniz.

### 2. Sertifikalar

Trafiği güvenli bir şekilde origin'lerinize yönlendirmek için, Wallarm alan adlarınız için sertifika edinmelidir. Bu sertifikalar, **Certificates** bölümünde belirttiğiniz DNS bölgelerine göre verilecektir.

Yapılandırma tamamlandıktan sonra, Wallarm her DNS bölgesi için bir CNAME sağlayacaktır. Alan sahibi doğrulaması yapmak ve sertifika verme işlemini tamamlamak için bu CNAME kaydını DNS ayarlarınıza ekleyin.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

### 3. Hostlar

**Hosts** bölümünde:

1. Trafiğin analiz için Wallarm düğümüne yönlendirileceği alan adlarını ve portları veya isteğe bağlı alt alan adlarını belirtin. Her host girdisi, daha önce **Certificates** bölümünde tanımlanan bir DNS bölgesi ile eşleşmelidir.

    ??? info "İzin verilen portlar"
        HTTP portlarından Edge düğümüne trafik yönlendirilmesine izin verilmez. Aşağıdaki portlar desteklenir:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, ve 60000

1. (İsteğe bağlı) Wallarm platformu üzerindeki farklı API örneklerini veya hizmetlerini kategorize etmek ve yönetmek için host trafiğini bir [Wallarm application](../../user-guides/settings/applications.md) ile ilişkilendirin.
1. Her host için [Wallarm mode](../../admin-en/configure-wallarm-mode.md) ayarını belirleyin.
1. Filtrelenmiş trafiğin her host'tan yönlendirileceği origin'i seçin.

![!](../../images/waf-installation/security-edge/inline/hosts.png)

Hostlar içindeki belirli **lokasyonlar** için ayrıca özelleştirme yapabilirsiniz:

* Origin. Lokasyonda tanımlanan yol otomatik olarak origin'e eklenir.
* Wallarm application.
* Filtreleme modu.
* Bazı [NGINX directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). Varsayılan olarak, bu direktifler NGINX dokümantasyonunda belirtildiği gibi NGINX'in standart değerlerini kullanır.

Her lokasyon, host düzeyindeki ayarları devralır ancak bireysel olarak özelleştirilebilir. Açıkça yapılandırılmamış lokasyonlar, host düzeyinde belirtilen genel ayarları takip edecektir.

Aşağıdaki örnek yapılandırma, her yol için belirli ihtiyaçları karşılamak üzere ayarları özelleştirir: `/auth` bloklama modu etkinleştirilmiş şekilde güvenliği ön planda tutarken, `/data` daha büyük yüklemelere izin vermek için `client_max_body_size` 5MB olarak artırılır.

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. (İsteğe bağlı) Yönetici Ayarları

**Admin settings** bölümünde, konuşlandırılacak Edge düğüm sürümünü seçebilirsiniz. Açıkça seçilmemişse, mevcut en son sürüm otomatik olarak konuşlandırılır.

Sürümlerin değişiklik günlüğü için, lütfen [makaleye](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) bakın. Edge düğüm sürümü, bağlantılı makaledeki ile aynı olan `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` formatını takip eder. Edge düğüm sürümündeki build numarası küçük değişiklikleri belirtir.

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

### 5. Sertifika CNAME Yapılandırması

Yapılandırma tamamlandıktan sonra, her DNS bölgesi için Wallarm Console tarafından sağlanan CNAME kayıtlarını DNS sağlayıcınızın ayarlarına ekleyin. Bu kayıtlar, Wallarm'ın alan sahibi doğrulaması yapıp sertifika vermesi için gereklidir.

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

Örneğin, DNS bölgesinde `myservice.com` belirtilmişse, CNAME kaydı şu şekildedir:

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.aws.wallarm-cloud.com
```

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. Wallarm, CNAME kayıtları doğrulandığında Edge düğüm konuşlandırmasına başlar.

### 6. Trafik Yönlendirmesi için CNAME Yapılandırması

Sertifika CNAME doğrulandıktan sonra (~10 dakika), her host için **Hosts** sekmesinde bir **Traffic CNAME** mevcut olacaktır. Bunu kopyalayın ve Wallarm'a trafiği yönlendirmek için DNS ayarlarınıza ekleyin.

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. Yayılım tamamlandığında, Wallarm tüm trafiği origin'lerinize iletir ve kötü amaçlı istekleri engeller.

## Telemetri Portalı

Security Edge Inline için telemetri portalı, Wallarm tarafından işlenen trafik metriklerine ilişkin gerçek zamanlı içgörüler sunan bir Grafana gösterge paneli sağlar.

Gösterge panelinde toplam işlenen istekler, RPS, tespit edilen ve engellenen saldırılar, konuşlandırılan Edge düğüm sayısı, kaynak tüketimi, 5xx yanıt sayısı vb. gibi ana metrikler gösterilir.

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

**Run telemetry portal** düğüm **Active** durumuna ulaştıktan sonra çalıştırılır. Başlatıldıktan yaklaşık 5 dakika sonra Security Edge bölümünden doğrudan erişilebilen bir bağlantı ile erişilebilir hale gelir.

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

## Edge Inline'ı Yükseltme

Edge düğümünü en son değişikliklerle yükseltmek için **Configure** → **Admin settings** bölümüne gidin ve listeden bir sürüm seçin. Optimal performans ve güvenlik için en son sürümün kullanılması önerilir.

Sürümlerin değişiklik günlüğü için, lütfen [makaleye](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) bakın. Edge düğüm sürümü, bağlantılı makaledeki ile aynı olan `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` formatını takip eder. Edge düğüm sürümündeki build numarası küçük değişiklikleri belirtir.

## Edge Inline'ı Silme

Edge konuşlandırmanızı silmek için, **Configure** → **Admin settings** → **Delete** bölümüne tıklayın.

Düğümleri silip yeniden oluşturmayı düşünüyorsanız, mevcut konuşlandırmanın ayarlarını değiştirebilir ve düğümler güncellenmiş yapılandırma ile yeniden konuşlandırılır.

## Durumlar

Edge düğüm bölümünde, origin'ler, hostlar ve bölgeler için konuşlandırma ve yapılandırma durumlarının gerçek zamanlı göstergeleri sağlanır:

=== "Hosts"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origins"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Regions"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)

* **Pending cert CNAME**: Sertifika verilmesi için DNS'e eklenmesi beklenen sertifika CNAME kayıtları.
* **Pending traffic CNAME**: Konuşlandırma tamamlanmış, Edge düğümüne trafiğin yönlendirilmesi için trafik CNAME kaydının eklenmesi bekleniyor.
* **Deploying**: Edge düğümü şu anda kuruluyor ve yakında erişilebilir olacak.
* **Active**: Edge düğümü tamamen çalışır durumda ve yapılandırmaya uygun şekilde trafiği filtreliyor.
* **Cert CNAME error**: DNS'de sertifika CNAME doğrulanırken bir sorun oluştu. Lütfen CNAME'in doğru yapılandırıldığını kontrol edin.
* **Deployment failed**: Örneğin, sertifika CNAME'in 14 gün içinde eklenmemesi nedeniyle Edge düğüm konuşlandırması başarısız oldu. Yapılandırma ayarlarını kontrol edip tekrar konuşlandırmayı deneyin veya yardım için [Wallarm Support team](https://support.wallarm.com) ile iletişime geçin.
* **Degraded**: Edge düğümü bölgede aktif ancak sınırlı işlevsellik gösterebilir veya küçük sorunlar yaşıyor olabilir. Yardım için lütfen [Wallarm Support team](https://support.wallarm.com) ile iletişime geçin.