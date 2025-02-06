```markdown
[se-connector-setup-img]:           ../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edge Connectors <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

**Security Edge** platformu, Wallarm tarafından barındırılan bir ortam içerisinde coğrafi olarak dağıtılmış konumlarda Wallarm düğümlerini dağıtmak için yönetilen bir hizmet sunar. Ana dağıtım seçeneklerinden biri, yerinde hiçbir kurulum gerektirmeden tüm API altyapınıza sağlam koruma sunan [**connector**](connectors/overview.md) düğüm dağıtımıdır.

![!](../images/waf-installation/security-edge/connectors/traffic-flow.png)

## Nasıl Çalışır

Security Edge hizmeti, Wallarm düğümünün dağıtıldığı, barındırıldığı ve Wallarm tarafından yönetildiği güvenli bir bulut ortamı sağlar:

* Anahtar teslim dağıtım: Wallarm'un dünya genelinde dağıtılmış konumlarda otomatik olarak Wallarm düğümlerini dağıtması için minimum kurulum gereklidir.
* Otomatik ölçekleme: Değişen trafik yüklerinde, düğüm örnekleri manuel kurulum gerektirmeden otomatik olarak yatay ölçeklenir.
* Maliyetlerin azaltılması: Wallarm tarafından yönetilen düğümler sayesinde operasyonel maliyetler düşer, böylece daha hızlı dağıtım ve ölçeklenebilirlik sağlanır.

!!! info "Desteklenen platformlar"
    Şu anda, Edge connector'ları yalnızca MuleSoft, CloudFront, Cloudflare, Fastly için mevcuttur.

## Security Edge Connectörlerini Çalıştırma

### 1. Bir connector için Edge düğümünü dağıtma

Sadece connector ayarlarını belirtmeniz yeterlidir. Wallarm, dağıtımı üstlenecek ve platformunuzdan gelen trafiği yönlendirmek için size bir uç nokta sağlayacaktır.

Bir uç nokta, farklı ana bilgisayarlardan gelen birden fazla bağlantıyı yönetebilir.

1. Security Edge dağıtımı sadece ilgili abonelikle mevcuttur. Edinmek için sales@wallarm.com ile iletişime geçin.
1. Wallarm Console → **Security Edge** → **Connectors** → **Add connector** adımlarını izleyin.

    ![!][se-connector-setup-img]
1. Düğüm dağıtım ayarlarını belirtin:

    * **Regions**: Connector için Wallarm düğümünü dağıtmak üzere bir veya daha fazla bölge seçin. API'lerinizin veya uygulamalarınızın dağıtıldığı konumlara yakın bölgelerin seçilmesini öneririz. Bir örnek kullanılamaz hale gelirse yük dengelemesi yaparak, birden fazla bölge coğrafi yedekliliği artırır.
    * **Filtration mode**: [trafik analiz modu][filtration-mode-docs].
    * **Application**: Genel uygulama kimliği. Wallarm'da, [applications](../user-guides/settings/applications.md) altyapınızdaki parçaları (örneğin, domainler, konumlar, örnekler) tanımlamanıza ve düzenlemenize yardımcı olur.
        
        Her düğüm, belirli konumlar veya örnekler için ayrı kimlikler atama seçeneği ile birlikte genel bir uygulama kimliğine ihtiyaç duyar.
    
    * **Allowed hosts**: Düğümün hangi ana bilgisayarları kabul edeceğini ve trafiğini analiz edeceğini belirtin.

        Belirtilen bir ana bilgisayar mevcut değilse veya erişilemez durumdaysa, 415 hatası dönecek ve trafik işlenmeyecektir.
    
    * **Location configuration**: Gerekirse, belirli ana bilgisayarlar ve konumlar için benzersiz uygulama kimlikleri atayın.

        ![!][se-connector-hosts-locations-img]
1. Kaydedildikten sonra, Wallarm'un connector için düğümü dağıtması ve yapılandırması 3-5 dakika sürecektir.

    Dağıtım tamamlandığında durum **Pending**'den **Active**'a değişecektir.
1. Platformunuzdan gelen trafiği yönlendirmek üzere, düğüm uç noktasını daha sonra kullanmak için kopyalayın.

![!](../images/waf-installation/security-edge/connectors/copy-endpoint.png)

Düğüm **Active** durumundayken istediğiniz zaman Edge düğüm dağıtım ayarlarını değiştirebilirsiniz. Düğüm, dağıtım yeniden başlatılarak **Pending** durumundan **Active** durumuna getirilecektir. Uç nokta değişmeyecek, ancak yeniden dağıtım sürecinde kullanılamayacaktır.

### 2. API'lerinizi çalıştıran platforma Wallarm kodu enjekte etme

Edge düğümünü dağıttıktan sonra, trafiği dağıtılmış düğüme yönlendirmek için platformunuza Wallarm kodu enjekte etmeniz gerekecektir.

1. Wallarm Console UI'dan platformunuz için bir kod paketi indirin.

    ![!](../images/waf-installation/security-edge/connectors/download-code-bundle.png)
1. Aşağıdaki talimatları izleyerek, API yönetim platformunuzda paketi uygulayın:

    * [MuleSoft](connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [CloudFront](connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Cloudflare](connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Fastly](connectors/fastly.md#2-deploy-wallarm-code-on-fastly)

## Edge düğümünü silme

Edge düğümünü silerseniz, uç noktası kullanılamaz hale gelir ve trafiği güvenlik analizi için artık onun üzerinden yönlendiremezsiniz.

Platformunuza enjekte edilen Wallarm kod paketi, paket ayarlarında belirtilen düğüm uç noktasına ulaşmaya çalışacaktır. Ancak, `failed: Couldn't resolve address` hatasıyla başarısız olacak ve trafik, Edge düğümünden geçmeden hedefe doğru akmaya devam edecektir.

## Sorun Giderme

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"
```