[se-connector-setup-img]:           ../../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edge Bağlayıcıları <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

[**Security Edge**](overview.md) platformu, Wallarm tarafından barındırılan bir ortamda coğrafi olarak dağıtılmış konumlarda Wallarm Node’larının dağıtımı için yönetilen bir hizmet sunar. Temel dağıtım seçeneklerinden biri, sahada kurulum gerektirmeden tüm API ortamınız için güçlü koruma sağlayan [**connector**](../connectors/overview.md) Node dağıtımıdır.

![!](../../images/waf-installation/security-edge/connectors/traffic-flow.png)

!!! info "Desteklenen platformlar"
    Şu anda Edge bağlayıcıları yalnızca MuleSoft Mule Gateway, CloudFront, Cloudflare, Fastly, IBM DataPower için mevcuttur.

## Gereksinimler

* [Security Edge aboneliği](../../about-wallarm/subscription-plans.md) (ücretsiz veya ücretli)
* Aşağıdaki API yönetim platformlarından birinde çalışan API:

    * MuleSoft Mule Gateway
    * CloudFront
    * Cloudflare
    * Fastly
    * IBM DataPower

## Security Edge Bağlayıcılarını Çalıştırma

Security Edge Connector’ı çalıştırmak için Wallarm Console → **Security Edge** → **Connectors** → **Add connector** yolunu izleyin. Bu bölüm mevcut değilse, gerekli aboneliğe erişim için sales@wallarm.com ile iletişime geçin.

Free Tier’da, [Quick setup](free-tier.md) ile Edge Node’ları dağıttıktan sonra **Security Edge** bölümü ayarları düzenlemenize olanak tanır.

### 1. Bir bağlayıcı için Edge Node’u dağıtma

Yalnızca bağlayıcı ayarlarını belirtmeniz gerekir. Wallarm dağıtımı gerçekleştirir ve platformdan trafiği yönlendirmek için bir uç nokta sağlar.

Tek bir uç nokta, farklı host’lardan birden fazla bağlantıyı işleyebilir.

1. Wallarm Console → **Security Edge** → **Connectors** → **Add connector** adımlarını izleyin.

    ![!][se-connector-setup-img]
1. Node dağıtım ayarlarını belirtin:

    * **Regions**: bağlayıcı için Wallarm Node’u dağıtmak üzere bir veya daha fazla bölge seçin. API’lerinizin veya uygulamalarınızın dağıtıldığı konumlara yakın bölgeleri seçmenizi öneririz. Birden fazla bölge, bir örnek kullanılamaz hale gelirse yükü dengeleyerek coğrafi yedekliliği artırır.

        Bölgeleri **AWS** veya **Azure** içinde seçebilirsiniz.
    
    * **Filtration mode**: [trafik analiz modu][filtration-mode-docs].
    * **Application**: genel uygulama kimliği. Wallarm’da [uygulamalar](../../user-guides/settings/applications.md), altyapınızın bölümlerini (ör. alan adları, konumlar, örnekler) tanımlamaya ve düzenlemeye yardımcı olur.
    
        Her Node için genel bir uygulama kimliği gereklidir; ayrıca konumlar veya örnekler için özel kimlikler atayabilirsiniz.
    
    * **Allowed hosts**: Node’un hangi host’lardan gelen trafiği kabul edip analiz edeceğini belirtin.

        Belirtilen host mevcut değilse veya erişilemiyorsa 415 hatası döndürülür ve trafik işlenmez.
    
    * **Location configuration**: gerekirse belirli host ve konumlara özgü uygulama kimlikleri ve trafik analiz modunu atayın.

        ![!][se-connector-hosts-locations-img]
1. **Auto-update strategy** ayarlarında bir [Edge Node sürümü](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer) seçebilir ve gerekirse [Auto update](#upgrading-the-edge-node) özelliğini etkinleştirebilirsiniz. Herhangi bir sürüm açıkça seçilmezse en son sürüm otomatik olarak dağıtılır.

    ![!](../../images/waf-installation/security-edge/connectors/autoupdate.png)
1. Kaydettikten sonra, Wallarm’ın bağlayıcı için Node’u dağıtıp yapılandırması 3-5 dakika sürer.

    Dağıtım tamamlandığında durum **Pending**’den **Active**’e değişecektir.
1. Platformunuzdan trafiği yönlendirmek için daha sonra gerekebileceğinden Node uç noktasını kopyalayın.

![!](../../images/waf-installation/security-edge/connectors/copy-endpoint.png)

Node **Active** durumundayken Edge Node dağıtım ayarlarını istediğiniz zaman değiştirebilirsiniz. Node, **Pending** durumundan **Active**’e yeniden dağıtılır. Uç nokta değişmez, ancak yeniden dağıtım sırasında kullanılamaz olacaktır.

### 2. API’lerinizin çalıştığı platforma Wallarm kodunu enjekte etme

Edge Node’u dağıttıktan sonra, trafiği dağıtılan Node’a yönlendirmek için platformunuza Wallarm kodunu enjekte etmeniz gerekir.

1. Wallarm Console UI üzerinden platformunuz için bir kod paketi indirin.

    ![!](../../images/waf-installation/security-edge/connectors/download-code-bundle.png)
1. Paketi aşağıdaki talimatları izleyerek API yönetim platformunuza uygulayın:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

## Telemetri portalı

Security Edge Bağlayıcıları için telemetri portalı, Wallarm tarafından işlenen trafik metriklerine ilişkin gerçek zamanlı içgörüler sunan bir Grafana panosu sağlar.

Pano; toplam işlenen istekler, RPS, tespit edilen ve engellenen saldırılar, dağıtılan Edge Node sayısı, kaynak tüketimi, 5xx yanıtlarının sayısı vb. gibi temel metrikleri görüntüler.

![!](../../images/waf-installation/security-edge/connectors/telemetry-portal.png)

Node **Active** durumuna ulaştığında **Run telemetry portal** gerçekleştirin. Başlatmadan ~5 dakika sonra Security Edge bölümünden doğrudan bir bağlantı ile erişilebilir hale gelir.

![!](../../images/waf-installation/security-edge/connectors/run-telemetry-portal.png)

Grafana ana sayfasından, panele ulaşmak için **Dashboards** → **Wallarm** → **Portal Connector Overview** yolunu izleyin. Birden fazla Node için her paneli görüntülemek üzere bağlayıcı uç noktasına karşılık gelen **Tenant ID**’yi değiştirin.

## Edge Node’u Yükseltme

**Auto update** etkinleştirildiğinde, Edge Node yeni bir minor veya patch sürümü yayınlanır yayınlanmaz (seçilen seçeneğe bağlı olarak) otomatik olarak yükseltilir. Tüm başlangıç ayarlarınız korunur. Auto update varsayılan olarak kapalıdır.

Edge Node’u manuel olarak yükseltmek için, Node’unuzu düzenlemek üzere açın ve **Auto update** bölümünde bir sürüm seçin. En iyi performans ve güvenlik için en son sürümün kullanılması önerilir.

Yeni bir major sürüme yükseltme yalnızca manuel olarak yapılabilir.

Sürümlerin değişiklik günlüğü için [makaleye](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer) bakın. Edge Node sürümü, bağlantılı makaledeki ile aynı sürüme karşılık gelen `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` biçimini takip eder. Edge Node sürümündeki derleme numarası küçük değişiklikleri belirtir.

Ek olarak, bağlayıcı kod paketinizi de yükseltmeniz gerekebilir. Değişiklik günlüğü ve yükseltme talimatları için [Connector Kod Paketi Değişiklik Günlüğü](../connectors/code-bundle-inventory.md) sayfasına bakın.

## Edge Node’u Silme

Edge Node’u silerseniz, uç noktası kullanılamaz hale gelir ve güvenlik analizi için trafiği artık bu uç nokta üzerinden yönlendiremezsiniz.

Platformunuza enjekte edilen Wallarm kod paketi, paket ayarlarında belirtilen Node uç noktasına ulaşmayı denemeye devam edecektir. Ancak, `failed: Couldn't resolve address` hatasıyla başarısız olur ve trafik Edge Node üzerinden geçmeden hedefe akmaya devam eder.

Aboneliğinizin süresi dolarsa, Edge Node 14 gün sonra otomatik olarak silinir.

## Sorun giderme

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"