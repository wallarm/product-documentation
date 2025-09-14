# Security Edge <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge, [Wallarm Node](../../about-wallarm/overview.md#filtering-node) barındırmadan API’lerinizi ve uygulamalarınızı korumanıza olanak tanıyan, Wallarm tarafından yönetilen bir dağıtım seçeneğidir. Trafiği **Wallarm’ın küresel olarak dağıtılmış Edge altyapısına** yönlendirirsiniz; burada trafik filtrelenir ve güvenle backend’inize iletilir.

Node, Wallarm tarafından barındırılır ve işletilir; bu da ekibiniz için altyapı yükünü azaltır.

## Temel avantajlar

Security Edge hizmeti, Wallarm Node’ların Wallarm tarafından dağıtıldığı, barındırıldığı ve yönetildiği güvenli bir bulut ortamı sağlar:

* Tamamen yönetilen, minimum operasyonel karmaşıklığa sahip çözüm.
* Anahtar teslim dağıtım: Wallarm’ın Node’ları küresel olarak dağıtılmış konumlara otomatik olarak dağıtması için minimum kurulum yeterlidir.
* Otomatik ölçekleme: Node’lar, değişken trafik yüklerini karşılamak için manuel yapılandırmaya gerek kalmadan yatay olarak otomatik ölçeklenir.
* Düşük maliyet: Wallarm tarafından yönetilen Node’larla daha düşük operasyonel yük, daha hızlı dağıtım ve ölçeklenebilirlik sağlar.
* Sorunsuz entegrasyon: Basit yapılandırma ile API ortamınızı kesintiye uğratmadan korumanıza olanak tanır.
* Küresel PoP ağı ve gecikme temelli DNS yönlendirmesi: trafik, kullanıcılarınıza yakın konumlarda bulunan Wallarm’ın dağıtılmış PoP’leri üzerinden yönlendirilir.

## Mevcut dağıtım seçenekleri

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>Gerçek zamanlı trafik Edge Node üzerinden yönlendirilir, filtrelenir ve origin’inize iletilir</p>
        </a>

        <a class="do-card" href="../se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>Asenkron analiz veya gerçek zamanlı engelleme için Edge Node’u API platformunuza bağlayın</p>
        </a>
    </div>
</div>

!!! info "Dağıtım alternatifleri"
    Daha fazla kontrol veya geleneksel barındırma seçenekleri mi arıyorsunuz? [Kendi altyapınızda barındırılan Node dağıtımı](../supported-deployment-options.md) ve [Connector’lar için kendi altyapınızda barındırılan Node dağıtımı](../connectors/overview.md) sayfalarına göz atın.

## Free Tier

Security Edge, aylık en fazla **500.000 istek için ücretsiz** olan Free Tier planında mevcuttur.

Edge Node’ları Free Tier planı üzerinden [**Quick setup** wizard](free-tier.md) aracılığıyla dağıtabilirsiniz.  

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />