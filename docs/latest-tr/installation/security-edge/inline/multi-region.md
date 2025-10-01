# Security Edge Inline'ın Çok Bulutlu ve Çok Bölgeli Dağıtımı <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Coğrafi yedeklilik ve düşük gecikme için inline Edge Node'ları birden çok bölgeye ve bulut sağlayıcısına dağıtabilirsiniz.

[Security Edge yapılandırılırken](deployment.md), desteklenen bulut sağlayıcıları — **AWS** ve **Azure** — genelinde bir veya daha fazla bölge seçebilirsiniz.

## Çok bölgeli dağıtım

Tek bir bulut sağlayıcısı içinde birden çok bölge seçildiğinde, trafik gecikmeye göre yönlendirilir — her istek en yakın kullanılabilir bölgeye gider.

Bu en yaygın kurulumdur; talepleri birden fazla konumdan karşıladığınız durumlarda önerilir.

![!](../../../images/waf-installation/security-edge/inline/multi-region-edge-nodes.png)

Kullanılabilir bölgeler [Wallarm Cloud](../../../about-wallarm/overview.md#cloud) hesabınıza bağlıdır (US → US bölgeleri, EU → EU bölgeleri).

## Çok bulutlu dağıtım

Farklı bulut sağlayıcıları genelinde birden çok bölge seçildiğinde, gecikme dikkate alınmaksızın tüm istekler seçilen bölgeler ve sağlayıcılar arasında **[round‑robin](https://en.wikipedia.org/wiki/Round-robin_DNS)** stratejisiyle dağıtılır.

Bu kurulum şu durumlarda önerilir:

* Bulut sağlayıcısı yedekliliği — trafik tüm seçili sağlayıcılar arasında dağıtılır; böylece biri kullanılamaz hale gelirse (ör. AWS) diğerleri (ör. Azure) kesinti olmadan trafiği işlemeye devam eder.
* Bölgesel yüksek erişilebilirlik — örneğin, hem `AWS US East 1` hem de `Azure East US` seçildiğinde trafik bölgeler arasında dengede kalır ve bir bölge veya sağlayıcı kullanılamaz olsa bile hizmet devam eder.

![!](../../../images/waf-installation/security-edge/inline/multi-cloud-edge-nodes.png)

## Orijin erişimi için Wallarm IP aralıkları

Security Edge'den orijinlerinize olan bağlantıları [mTLS](mtls.md) ile güvence altına almanızı öneririz. Bu, Wallarm IP'leri değiştiğinde IP izin listelerini güncelleme gereğini ortadan kaldırır.

mTLS kullanılamıyorsa, seçilen bölgelerin Wallarm IP adreslerinden gelen trafiğe izin verin:

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

    === "Central US"
        ```
        104.43.139.76
        104.43.139.77
        ```
    === "East US 2"
        ```
        20.65.88.253
        20.65.88.252
        ```
    === "West US 3"
        ```
        20.38.2.233
        20.38.2.232
        ```
    === "Germany West Central"
        ```
        20.79.250.104
        20.79.250.105
        ```
    === "Switzerland North"
        ```
        20.203.240.193
        20.203.240.192
        ```

## CNAME kayıtları

Korumadaki hostunuz üçüncü seviye (veya daha üst seviye) bir alan adıysa (ör. `api.example.com`), DNS bölgenizde [Wallarm tarafından sağlanan FQDN'ye işaret eden CNAME kaydını belirtmeniz gerekir](deployment.md#6-routing-traffic-to-the-edge-node). Bu kayıt **Traffic CNAME** olarak döndürülür.

* Tek bulut dağıtımı: **seçilen bulut sağlayıcısı için Traffic CNAME**'i kullanın.
* Çok bulutlu dağıtım: seçilen tüm bölgeler ve sağlayıcılar arasında trafiği otomatik olarak dağıtmak için **Traffic CNAME (Global)** kullanın.

    Belirli bir sağlayıcıya yönlendirmeyi zorlamak gerekiyorsa — örneğin sağlayıcılar arası gecikme veya performansı test etmek için — sağlayıcıya özel CNAME'ler de mevcuttur.

![](../../../images/waf-installation/security-edge/inline/traffic-cname.png)

## A kayıtları

Korumadaki hostunuz kök alan adıysa (ör. `example.com`), CNAME kullanılamaz. Bu durumda DNS yapılandırması **A kayıtlarını** kullanmalıdır; bunlar dağıtım [**Active**](upgrade-and-management.md#statuses) olduğunda döndürülür.

Edge Node dağıtımı için birden fazla bölge veya sağlayıcı seçtiyseniz, döndürülen tüm A kayıtlarını DNS bölgenize eklemeniz gerekir.

![](../../../images/waf-installation/security-edge/inline/a-records.png)

Bu durumda trafik yönlendirmesi DNS sağlayıcınız tarafından yönetilir. Varsayılan olarak çoğu DNS sağlayıcısı [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) mantığını kullanır, ancak bazıları gecikme tabanlı yönlendirmeyi de destekleyebilir.

## Bir bulut sağlayıcısını veya bölgeyi kaldırma

* Bir bulut sağlayıcısını kaldırmadan önce DNS yapılandırmanızı [kalan sağlayıcının Traffic CNAME'ini](#cname-records) kullanacak şekilde değiştirin.

    Bir bulut sağlayıcısı kaldırıldığında, ona ait **Traffic CNAME** silinir.
    
    Yalnızca bir sağlayıcı kaldıysa, **Traffic CNAME (Global)** de kaldırılır ve kullanılamaz hale gelir.
* Bir bölgeyi kaldırmadan önce [A kayıtlarınızı](#a-records) buna göre güncelleyin.

    Bir bölge kaldırılırsa, ilişkili A kayıtları artık kullanılamaz olacaktır.