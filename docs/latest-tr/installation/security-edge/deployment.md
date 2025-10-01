# Security Edge Inline <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

**Security Edge** platformu, Wallarm tarafından barındırılan bir ortamda coğrafi olarak dağıtılmış konumlarda Wallarm düğümlerini (node) dağıtmak için yönetilen bir hizmet sunar. Başlıca dağıtım seçeneklerinden biri olan **inline** dağıtım, herhangi bir yerinde kurulum gerektirmeden tüm API yelpazeniz için gerçek zamanlı ve güçlü koruma sağlar.

DNS ayarlarınızdaki CNAME kayıtlarını değiştirerek trafiği host'larınızdan Wallarm uç (edge) düğümlerine yönlendirebildiğiniz senaryolarda API'leri güvenceye almak için ideal bir çözümdür.

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## Nasıl çalışır

Security Edge hizmeti, Wallarm düğümlerinin Wallarm tarafından dağıtıldığı, barındırıldığı ve yönetildiği güvenli bir bulut ortamı sağlar:

* Anahtar teslim dağıtım: Wallarm’ın, küresel olarak dağıtılmış konumlara düğümleri otomatik olarak dağıtması için minimum kurulum gerekir.
* Otomatik ölçeklendirme: Düğümler, değişken trafik yüklerini karşılamak için yatay olarak otomatik ölçeklenir; manuel yapılandırma gerekmez.
* Azaltılmış maliyetler: Wallarm tarafından yönetilen düğümler ile daha düşük operasyonel yük, daha hızlı dağıtım ve ölçeklenebilirlik.
* Sorunsuz entegrasyon: Basit yapılandırma ile API ortamınızı kesintiye uğratmadan korumanızı sağlar.

## Sınırlamalar

* Yalnızca üçüncü seviye veya daha üstü alan adları desteklenir (ör. `domain.com` yerine `www.domain.com` kullanın).
* Yalnızca 64 karakterden kısa alan adları desteklenir.
* Yalnızca HTTPS trafiği desteklenir; HTTP’ye izin verilmez.
* [Özel engelleme sayfası ve engelleme kodu](../../admin-en/configuration-guides/configure-block-page-and-code.md) yapılandırmaları henüz desteklenmemektedir.

## Edge Inline'ı yapılandırma

Edge inline’ı çalıştırmak için Wallarm Console → Security Edge → Edge inline → Configure yolunu izleyin. Bu bölüm kullanılamıyorsa, gerekli abonelik için sales@wallarm.com ile iletişime geçin.

Filtrelenmiş trafiği iletmek için birden fazla origin ve korumak için birden fazla host yapılandırabilirsiniz. Demoya bakın:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

Edge node dağıtım ayarlarını istediğiniz zaman güncelleyebilirsiniz. Düğüm, mevcut CNAME kayıtları değişmeden yeniden dağıtılacaktır.

### 1. Genel ayarlar

Genel ayarlarda, Edge node’un dağıtılacağı bölgeleri ve filtrelenmiş trafiğin iletileceği origin’leri belirtirsiniz.

#### Bölgeler

Edge node’u dağıtmak için bir veya daha fazla bölge seçin. API’lerinizin veya uygulamalarınızın barındırıldığı yerlere yakın bölgeleri seçmenizi öneririz.

Birden fazla bölgede dağıtım, coğrafi yedekliliği artırır ve yüksek erişilebilirlik sağlar.

#### Origin sunucuları

Edge node’un filtrelenmiş trafiği ileteceği origin’leri belirtin. Her origin için, isteğe bağlı port (varsayılan: 443) ile bir sunucu IP adresi veya FQDN sağlayın.

Bir origin birden fazla sunucuya sahipse, hepsini belirtebilirsiniz. İstekler şu şekilde dağıtılır:

* Round-robin algoritması kullanılır. İlk istek ilk sunucuya, ikincisi bir sonrakine gönderilir ve sonuncudan sonra döngü başa sarar.
* IP tabanlı oturum kalıcılığı ile, aynı IP’den gelen trafik tutarlı olarak aynı sunucuya yönlendirilir.

!!! info "Wallarm IP aralıklarından origin'lere trafiğe izin verin"
    Origin’leriniz, seçilen bölgeler tarafından kullanılan IP aralıklarından gelen trafiğe izin vermelidir:

    === "us-east-1"
        ```
        18.215.213.205
        44.214.56.120
        44.196.111.152
        ```
    === "us-west-1"
        ```
        52.8.91.20
        13.56.117.139
        54.177.237.34
        50.18.177.184
        ```
    === "eu-central-1 (Frankfurt)"
        ```
        18.153.123.2
        18.195.202.193
        3.76.66.246
        3.79.213.212
        ```
    === "eu-central-2 (Zurich)"
        ```
        51.96.131.55
        16.63.191.19
        51.34.0.90
        51.96.67.145
        ```

![!](../../images/waf-installation/security-edge/inline/general-settings-section.png)

Daha sonra, trafik analizi ve filtreleme için host eklerken, her host veya konumu (location) ilgili origin’ine atayacaksınız.

### 2. Sertifikalar

**Certificates** bölümünde, alan adlarınız için sertifikalar edinebilirsiniz:

* Edge Inline node’u doğrudan, internete açık bir çözüm olarak dağıtılmışsa, Wallarm’ın trafiği origin sunucularınıza güvenle yönlendirmesi için sertifikalara ihtiyaç vardır. Sertifikalar, bu bölümde belirtilen DNS bölgelerine göre verilir.

    Yapılandırma tamamlandıktan sonra, Wallarm her DNS bölgesi için bir CNAME sağlar. Alan adı sahipliğini doğrulamak ve sertifika verme işlemini tamamlamak için bu CNAME kaydını DNS ayarlarınıza ekleyin.
* Origin sunucularınız, trafiği proxy’leyen üçüncü taraf bir hizmetin (ör. bir CDN veya Cloudflare ya da Akamai gibi bir DDoS koruma sağlayıcısı) arkasındaysa, sertifika verilmesi gerekmez. Bu durumda, **Skip certificate issuance** seçeneğini belirleyin.

![!](../../images/waf-installation/security-edge/inline/certificates.png)

Her biri farklı bir sertifika verme yaklaşımına sahip birden fazla DNS bölgesi belirtebilirsiniz.

### 3. Hostlar

**Hosts** bölümünde:

1. Trafiği analiz için Wallarm node’una yönlendirecek alan adlarını, portları ve alt alan adlarını belirtin. Her host girdisi, daha önce **Certificates**’ta tanımlanan bir DNS bölgesiyle eşleşmelidir.

    ??? info "İzin verilen portlar"
        HTTP portlarından Edge node’a trafik yönlendirmeye izin verilmez. Aşağıdaki portlar desteklenir:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553 ve 60000

1. (İsteğe bağlı) Host’un trafiğini Wallarm platformunda farklı API örneklerini veya servislerini kategorize edip yönetmek için bir [Wallarm application](../../user-guides/settings/applications.md) ile ilişkilendirin.
1. Her host için [Wallarm mode](../../admin-en/configure-wallarm-mode.md) ayarını belirleyin.
1. (İsteğe bağlı) Sunucu [NGINX yönergeleri](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)’ni belirtin. Varsayılan olarak, bu yönergeler NGINX dokümantasyonunda belirtildiği gibi NGINX’in standart değerlerini kullanır.
1. Her host için, kök konum (`/`) yapılandırmasını tanımlayın:

    * Wallarm node’un filtrelenmiş trafiği ileteceği origin (başka konum özel ayarları tanımlanmadıysa). Konumun yolu, origin’e otomatik olarak eklenir.
    * (İsteğe bağlı) Wallarm application.
    * Filtrasyon modu.

![!](../../images/waf-installation/security-edge/inline/hosts.png)

Host’lar içindeki belirli **location**’lar için ayrıca şu özelleştirmeleri yapabilirsiniz:

* Origin. Konumda tanımlanan yol otomatik olarak origin’e eklenir.
* Wallarm application.
* Filtrasyon modu.
* Bazı [NGINX yönergeleri](https://nginx.org/en/docs/http/ngx_http_proxy_module.html). Varsayılan olarak, bu yönergeler NGINX dokümantasyonunda belirtildiği gibi NGINX’in standart değerlerini kullanır.

Her konum, özellikle geçersiz kılınmadıkça host ve kök konum ayarlarını devralır.

Aşağıdaki örnek yapılandırma, belirli gereksinimleri karşılamak üzere yol bazında ayarları özelleştirir: `/auth`, engelleme modu etkinleştirilerek güvenliği önceliklendirir, `/data` ise `client_max_body_size` değerini 5 MB’a yükselterek daha büyük yüklemelere izin verir.

![!](../../images/waf-installation/security-edge/inline/locations.png)

### 4. (İsteğe bağlı) Admin settings

**Admin settings** bölümünde bir node sürümü seçer ve yükseltme ayarlarını belirtirsiniz:

* Dağıtılacak Edge node sürümünü seçin. Varsayılan olarak en son kullanılabilir sürüm dağıtılır.

    Sürümlerin değişiklik günlüğü için [makaleye](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) bakın. Edge node sürümü, bağlantı verilen makaledeki aynı sürüme karşılık gelen `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` biçimini izler. Edge node sürümündeki build numarası, küçük değişiklikleri belirtir.
* Gerekirse [Auto update](#upgrading-the-edge-inline) özelliğini etkinleştirin.

![!](../../images/waf-installation/security-edge/inline/admin-settings.png)

### 5. Sertifika CNAME yapılandırması

**Certificates** bölümünde DNS bölgeleri belirtilmişse, Wallarm Console’da sağlanan CNAME kayıtlarını her DNS bölgesi için DNS sağlayıcınızın ayarlarına ekleyin. Bu kayıtlar, Wallarm’ın alan adı sahipliğini doğrulaması ve sertifika vermesi için gereklidir.

!!! warning "Sertifika CNAME'ini kaldırmayın"
    Sertifika CNAME kaydı DNS ayarlarınızda kalmalıdır. Bu kayıt, ileride dağıtım yapılandırma güncellemeleri ve sertifika yenilemesi için gereklidir.

![](../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../images/waf-installation/security-edge/inline/cert-cname.png)

Örneğin, DNS bölgesinde `myservice.com` belirtilmişse, cart CNAME aşağıdaki gibidir:

```
_acme-challenge.myservice.com CNAME _acme-challenge.<WALLARM_CLOUD>-<CLIENT_ID>-<DEPLOYMENT_ID>.acme.aws.wallarm-cloud.com
```

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. CNAME kayıtları doğrulandıktan sonra Wallarm, Edge node dağıtımını başlatır.

### 6. Traﬁği Edge Node’a yönlendirme

Traﬁği Edge Node’a yönlendirmek için DNS bölgenizde Wallarm tarafından sağlanan FQDN’ye işaret eden CNAME kaydını belirtmeniz gerekir. Bu kayıt, **Traffic CNAME** olarak döndürülür.

Sertifika CNAME doğrulandıktan sonra, her host için bir **Traffic CNAME** kullanılabilir hale gelir. Sertifika verilmediyse, CNAME yapılandırma tamamlanır tamamlanmaz kullanılabilir olur.

![](../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. Yaygınlaştıktan sonra, Wallarm tüm trafiği 

## Telemetri portalı

Security Edge Inline için telemetri portalı, Wallarm tarafından işlenen trafik metriklerine ilişkin gerçek zamanlı içgörüler sunan bir Grafana panosu sağlar.

Pano; toplam işlenen istekler, RPS, tespit edilen ve engellenen saldırılar, dağıtılan Edge node sayısı, kaynak tüketimi, 5xx yanıt sayısı vb. gibi temel metrikleri gösterir.

![!](../../images/waf-installation/security-edge/inline/telemetry-portal.png)

Node **Active** durumuna ulaştığında **Run telemetry portal**’ı çalıştırın. Başlatmadan ~5 dakika sonra Security Edge bölümünden doğrudan bir bağlantı ile erişilebilir hale gelir.

![!](../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

Grafana ana sayfasından panele ulaşmak için **Dashboards** → **Wallarm** → **Portal Inline Overview** yolunu izleyin.

## Upgrading the Edge Inline

**Admin settings** içinde **Auto update** etkinleştirildiğinde, yeni bir minor veya patch sürümü yayınlanır yayınlanmaz (seçilen seçeneğe bağlı olarak) Edge node otomatik olarak yükseltilir. Tüm ilk ayarlarınız korunur. Auto update varsayılan olarak kapalıdır.

Edge node’u elle yükseltmek için **Configure** → **Admin settings** yoluna gidin ve listeden bir sürüm seçin. En iyi performans ve güvenlik için en son sürümün kullanılması önerilir.

Yeni bir major sürüme yükseltme yalnızca elle yapılabilir.

Sürümlerin değişiklik günlüğü için [makaleye](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) bakın. Edge node sürümü, bağlantı verilen makaledeki aynı sürüme karşılık gelen `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` biçimini izler. Edge node sürümündeki build numarası, küçük değişiklikleri belirtir.

## Edge Inline'ı silme

Edge dağıtımınızı silmek için **Configure** → **Admin settings** → **Delete inline**’a tıklayın.

Düğümleri silip yeniden oluşturmayı planlıyorsanız, mevcut dağıtımın ayarlarını değiştirebilir ve düğümler güncellenmiş yapılandırma ile yeniden dağıtılacaktır.

Aboneliğiniz sona ererse, Edge node 14 gün sonra otomatik olarak silinir.

## Durumlar

Edge node bölümü, origin’leriniz, host’larınız ve bölgeleriniz için dağıtım ve yapılandırma durumlarını gerçek zamanlı olarak sağlar:

=== "Hosts"
    ![!](../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origins"
    ![!](../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Regions"
    ![!](../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "Nodes"
    **Nodes** sekmesi, her Edge node için teknik ayrıntıları sağlar. Bu görünüm öncelikle sorun gidermede yardımcı olması için Wallarm Support tarafından kullanılır. Düğüm sayısı trafik talebine bağlıdır ve Wallarm’ın otomatik ölçeklendirmesi tarafından otomatik olarak yönetilir.

    ![!](../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**: Sertifika verilmesi için DNS’e sertifika CNAME kayıtlarının eklenmesi bekleniyor (uygulanabilirse).
* **Pending traffic CNAME**: Dağıtım tamamlandı, trafiği Edge node’a yönlendirmek için traffic CNAME veya proxy hedef kaydının eklenmesi bekleniyor.
* **Deploying**: Edge node şu anda kuruluyor ve yakında kullanılabilir olacak.
* **Active**: Edge node tamamen çalışır durumda ve yapılandırıldığı şekilde trafiği filtreliyor.
* **Cert CNAME error**: DNS’te sertifika CNAME doğrulanırken bir sorun oluştu. Lütfen CNAME’in doğru yapılandırıldığını kontrol edin (uygulanabilirse).
* **Deployment failed**: Edge node dağıtımı başarılı olmadı; örneğin sertifika CNAME 14 gün içinde eklenmediği için. Yapılandırma ayarlarını kontrol edin ve yeniden dağıtmayı deneyin veya yardım almak için [Wallarm Support team](https://support.wallarm.com) ile iletişime geçin.
* **Degraded**: Edge node bölgede aktiftir ancak sınırlı işlevselliğe sahip olabilir veya küçük sorunlar yaşıyor olabilir. Lütfen yardım almak için [Wallarm Support team](https://support.wallarm.com) ile iletişime geçin.

Host ve origin başına RPS ve istek miktarı, [sürüm](../../updating-migrating/node-artifact-versions.md#all-in-one-installer) 5.3.0’dan itibaren döndürülür.