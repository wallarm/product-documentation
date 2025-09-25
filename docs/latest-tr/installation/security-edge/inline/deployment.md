# Security Edge Inline Dağıtımı <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Wallarm [inline trafik analizi için Security Edge](overview.md) dağıtmak için bu kılavuzu izleyin.

## Gereksinimler

* [Security Edge aboneliği](../../../about-wallarm/subscription-plans.md) (ücretsiz veya ücretli)
* Alanlarınızın DNS kayıtlarını düzenleyerek mülkiyeti doğrulama ve trafiği Wallarm'a yönlendirme imkânı

## Yapılandırma akışı

Edge'i inline çalıştırmak için, Wallarm Console → Security Edge → Inline → Configure yoluna gidin. Bu bölüm mevcut değilse, gerekli aboneliğe erişim için sales@wallarm.com ile iletişime geçin.

Free Tier üzerinde, [Hızlı kurulum](../free-tier.md) ile Edge Node'ları dağıttıktan sonra, **Security Edge** bölümü ayarları düzenlemenizi sağlar.

Edge Node dağıtım ayarlarını istediğiniz zaman güncelleyebilirsiniz. Düğüm yeniden dağıtılırken mevcut CNAME ve A kayıtları değişmeden kalır.

Tam yapılandırma akışının demosuna bakın:

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/d0rwdofmftda" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
    </div>

## 1. Sağlayıcı ve bölge

Edge Node dağıtımı için bir veya daha fazla bölge (AWS veya Azure) seçin. Gecikmeyi en aza indirmek için API'lerinize yakın konumları seçin.

Kullanılabilir bölgeler [Wallarm Cloud](../../../about-wallarm/overview.md#cloud) bölgenize bağlıdır (US → US bölgeleri, EU → EU bölgeleri).

[Çok bölgeli ve çok bulutlu dağıtım hakkında daha fazla bilgi](multi-region.md)

## 2. Originler

Edge Node'un filtrelenmiş trafiği ileteceği originleri belirtin. Her origin için bir sunucu IP adresi veya isteğe bağlı port ile bir FQDN (varsayılan: 443) sağlayın.

Bir origin birden çok sunucuya sahipse, hepsini belirtebilirsiniz. İstekler şu şekilde dağıtılır:

* [Round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) algoritması kullanılır. İlk istek ilk sunucuya, ikinci istek bir sonrakine gönderilir ve son sunucudan sonra tekrar başa döner.
* IP tabanlı oturum kalıcılığı ile aynı IP'den gelen trafik tutarlı şekilde aynı sunucuya yönlendirilir.

**Origin erişimini güvenli hale getirme**

Originlerinizi yalnızca güvenilir trafikle sınırlamak için, Edge Node bağlantılarına aşağıdaki yöntemlerden biriyle izin verin:

* (Önerilir) Edge Node'ları [mTLS](mtls.md) ile kimlik doğrulayın. Bu, Wallarm IP'leri değişirse oluşabilecek sorunların önüne geçer.
* Yalnızca seçilen dağıtım bölgelerinin IP aralıklarından gelen trafiğe izin verin (IP'ler değişebilir).

    ??? info "Wallarm IP aralıklarını göster"
        * AWS

            === "ABD Doğu 1"
                ```
                18.215.213.205
                44.214.56.120
                44.196.111.152
                ```
            === "ABD Batı 1"
                ```
                52.8.91.20
                13.56.117.139
                54.177.237.34
                50.18.177.184
                ```
            === "AB Orta 1 (Frankfurt)"
                ```
                18.153.123.2
                18.195.202.193
                3.76.66.246
                3.79.213.212
                ```
            === "AB Orta 2 (Zürih)"
                ```
                51.96.131.55
                16.63.191.19
                51.34.0.90
                51.96.67.145
                ```

        * Azure

            === "ABD Merkezi"
                ```
                104.43.139.76
                104.43.139.77
                ```
            === "ABD Doğu 2"
                ```
                20.65.88.253
                20.65.88.252
                ```
            === "ABD Batı 3"
                ```
                20.38.2.233
                20.38.2.232
                ```
            === "Almanya Batı Merkezi"
                ```
                20.79.250.104
                20.79.250.105
                ```
            === "İsviçre Kuzey"
                ```
                20.203.240.193
                20.203.240.192
                ```

![!](../../../images/waf-installation/security-edge/inline/general-settings-section.png)

## 3. Sertifikalar

* Edge Inline Node doğrudan, internete açık bir çözüm olarak dağıtılıyorsa, trafiği origin sunucularınıza güvenli şekilde yönlendirmek için Wallarm sertifikalar gerektirir. Sertifikalar bu bölümde belirtilen DNS bölgelerine göre düzenlenir.

    Yapılandırma tamamlandığında, Wallarm her DNS bölgesi için bir CNAME sağlar. Alan adı sahipliğini doğrulamak ve sertifika düzenleme sürecini tamamlamak için bu CNAME kaydını DNS ayarlarınıza ekleyin.
* Origin sunucularınız, trafiği proxy'leyen üçüncü taraf bir servis (ör. bir CDN veya Cloudflare ya da Akamai gibi bir DDoS koruma sağlayıcısı) arkasındaysa, sertifika düzenlenmesi gerekmez. Bu durumda, **Skip certificate issuance** seçeneğini işaretleyin.

![!](../../../images/waf-installation/security-edge/inline/certificates.png)

Birden fazla DNS bölgesi belirtebilir, her biri için farklı bir sertifika düzenleme yaklaşımı seçebilirsiniz.

!!! info "CAA kayıtları"
    Bazı kuruluşlar, alan adları için sertifika düzenleyebilecek Sertifika Otoritelerini (CA) sınırlamak amacıyla [CAA](https://letsencrypt.org/docs/caa/) DNS kayıtları kullanır.

    CAA kayıtlarınız varsa, Let's Encrypt'i Wallarm Hesap Kimliği ile yetkilendirdiğinizden emin olun; aksi halde Security Edge için sertifikalar düzenlenemez:

    ```
    0 issue "letsencrypt.org;validationmethods=dns-01;accounturi=https://acme-v02.api.letsencrypt.org/acme/acct/2513765531"
    ```

    Mevcut CAA kayıtlarınızı şu komutla kontrol edebilirsiniz:

    ```
    dig +short CAA your-domain.com
    ```

## 4. Hostlar

Analiz için trafiği Edge Node'a yönlendirecek genel alan adlarını, portları ve alt alan adlarını belirtin.

!!! info "Apex alan adları"
    Mümkünse apex alan adları yerine `www.example.com` kullanın. Ya da [apex alan adından `www.*`'a yönlendirme](host-redirection.md#recommended-redirect-from-apex-domain-to-www) yapılandırın. Bu, Wallarm'ın global bir CNAME kullanmasını ve A kayıtlarıyla elle trafik dengeleme ihtiyacını ortadan kaldırır.

1. Hostlarınızı belirtin. Her host girdisi bir DNS bölgesiyle ( **Certificates** bölümünde belirtilmişse) eşleşmeli ve yönlendirme döngülerden kaçınmak için originlerden farklı olmalıdır.

    ??? note "İzin verilen portlar"
        HTTP portlarından Edge Node'a trafik yönlendirmek yasaktır. Aşağıdaki portlar desteklenir:

        443, 444, 1443, 1760, 2001, 2087, 2096, 4333, 4334, 4430, 4440, 4443 4466, 4993, 5000, 5001, 5454, 7003, 7443, 7741, 8010, 8012, 8070, 8071, 8072, 8075, 8076, 8077, 8078, 8081, 8082, 8084, 8085, 8086, 8088, 8090, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8104, 8181, 8243, 8282, 8383, 8443, 8444, 8448, 8585, 8723, 8787, 8801, 8866, 9052, 9090, 9093, 9111, 9193, 9440, 9443, 9797, 44300, 44301, 44302, 44395, 44443, 52233, 55180, 55553, and 60000
1. (İsteğe bağlı) Host trafiğini, Wallarm platformunda farklı API örneklerini veya servislerini kategorize edip yönetmek için bir [Wallarm uygulaması](../../../user-guides/settings/applications.md) ile ilişkilendirin.
1. Her host için [Wallarm modu](../../../admin-en/configure-wallarm-mode.md) ayarlayın.
1. (İsteğe bağlı) [Sunucu NGINX yönergelerini](nginx-overrides.md#server-level-directives) özelleştirin. Varsayılanlar standart NGINX değerlerini izler.
1. Her host için, kök konum (`/`) yapılandırmasını tanımlayın:

    * Wallarm Node'un filtrelenmiş trafiği ileteceği [Origin](#2-origins) (konuma özel başka ayarlar tanımlanmadıysa). Konumun yolu otomatik olarak origin'e eklenir.
    * (İsteğe bağlı) Wallarm uygulaması.
    * Filtreleme modu.

![!](../../../images/waf-installation/security-edge/inline/hosts.png)

Hostlar içindeki belirli **konumlar** için şu ayarları daha da özelleştirebilirsiniz:

* Origin. Konumda tanımlanan yol otomatik olarak origin'e eklenir.
* Wallarm uygulaması.
* Filtreleme modu.
* [Konum NGINX yönergeleri](nginx-overrides.md#location-level-directives). Varsayılanlar standart NGINX değerlerini izler.

Her konum, özel olarak geçersiz kılınmadıkça, host ve kök konumdan ayarları devralır.

Aşağıdaki örnek yapılandırma, özel ihtiyaçları karşılamak için yola göre ayarları özelleştirir: `/auth` engelleme modu etkinleştirilerek güvenliği önceliklendirir, `/data` ise `client_max_body_size` değerini 5MB'a yükselterek daha büyük yüklemelere izin verir.

![!](../../../images/waf-installation/security-edge/inline/locations.png)

## 5. Sertifika CNAME yapılandırması

Alan doğrulaması için, Wallarm Console'da sağlanan CNAME kayıtlarını her DNS bölgesi için DNS sağlayıcınızın ayarlarına ekleyin. Bu kayıtlar, Wallarm'ın alan adı sahipliğini doğrulaması ve sertifikaları düzenlemesi için gereklidir.

!!! warning "Sertifika CNAME kaydını kaldırmayın"
    Sertifika CNAME kaydı DNS ayarlarınızda kalmalıdır. Daha sonraki dağıtım yapılandırma güncellemeleri ve sertifika yenilemesi için gereklidir.

![](../../../images/waf-installation/security-edge/inline/host-cnames.png)

![](../../../images/waf-installation/security-edge/inline/cert-cname.png)

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. CNAME kayıtları doğrulandığında (gerekliyse), Wallarm Edge Node dağıtımını başlatır.

## 6. Trafiği Edge Node'a yönlendirme

İstemci isteklerini Edge Node üzerinden geçirmek için, korunan alan adı tipine göre DNS kayıtlarınızı güncelleyin.

### CNAME kaydı

Korumalı host'unuz üçüncü seviye (veya daha üst) bir alan adıysa (örn. `api.example.com`), DNS bölgenizde Wallarm tarafından sağlanan FQDN'ye işaret eden CNAME kaydı belirtmeniz gerekir.

Sertifika CNAME doğrulandıktan sonra, her host için bir **Traffic CNAME** kullanıma sunulur. Sertifika düzenlenmiyorsa, yapılandırma tamamlanır tamamlanmaz CNAME hazır olur.

* Tek bulut dağıtımı: seçilen bulut sağlayıcısı için **Traffic CNAME** kullanın.
* Çok bulut dağıtımı: trafiği seçilen tüm bölge ve sağlayıcılar arasında otomatik dağıtmak için **Traffic CNAME (Global)** kullanın.

    Sağlayıcıya özel CNAME'ler de mevcuttur; örneğin sağlayıcılar arası gecikme veya performansı test etmek için trafiği belirli bir sağlayıcıya zorlamak istiyorsanız kullanabilirsiniz.

![](../../../images/waf-installation/security-edge/inline/traffic-cname.png)

DNS değişikliklerinin yayılması 24 saate kadar sürebilir. Yayılma tamamlandığında, Wallarm tüm trafiği yapılandırılmış originlere proxy'ler.

### A kayıtları

Korumalı host'unuz bir apex alan adıysa (örn. `example.com`), CNAME kullanılamaz. Bu durumda, DNS kurulumu dağıtım [**Active**](upgrade-and-management.md#statuses) olduğunda döndürülen **A kayıtlarını** kullanmalıdır.

![](../../../images/waf-installation/security-edge/inline/a-records.png)

Bu durumda trafik yönlendirmesi DNS sağlayıcınız tarafından yönetilir. Varsayılan olarak, çoğu DNS sağlayıcısı [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) mantığını kullanır, ancak bazıları gecikmeye dayalı yönlendirmeyi de destekleyebilir.

## Daha fazla yapılandırma seçeneği

* [Edge Node'un birden çok bölge ve sağlayıcıda dağıtılması](multi-region.md)
* [Edge Node'dan originlere mTLS](mtls.md)
* [Host yönlendirme](host-redirection.md)
* [Özel engelleme sayfası](custom-block-page.md)
* [NGINX geçersiz kılmaları](nginx-overrides.md)
* [Edge Node yükseltmesi](upgrade-and-management.md)
* [Telemetri portalı](telemetry-portal.md)