# Security Edge Free Tier

[Security Edge](overview.md) Free Tier, Wallarm platformunu değerlendirmenize ve Wallarm Node’u kendiniz barındırmadan, ayda **500.000 isteğe kadar - ücretsiz** koruma sağlamanıza olanak tanır.

Security Edge Free Tier ile, çoğu özelliği içeren [Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans) olarak Wallarm platformuna erişirsiniz, ancak bazı [sınırlamalar](#limitations) vardır.

## Başlarken

Security Edge Free Tier’ı kullanmaya başlamak için, **Wallarm’a [US](https://us1.my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide) veya [EU Cloud](https://my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide) üzerinde kaydolun**.

Otomatik olarak Free Tier’a atanacak ve **Quick setup wizard**’a yönlendirileceksiniz.

Security Edge dağıtımı kullanım senaryonuza uymuyorsa, alternatifler için sales@wallarm.com ile iletişime geçin.

## Quick setup wizard

Wizard, temel [Inline](inline/overview.md) veya [Connector](se-connector.md) Security Edge dağıtımında size rehberlik eder.

Edge Node’lar monitoring [mode](../../admin-en/configure-wallarm-mode.md) ile başlar, bu nedenle istekler engellenmez.

=== "Security Edge Inline"
    1. Dağıtım için bir bölge seçin.
    1. Genel bir host belirtin (kullanıcılarınızın bağlandığı alan adı).
    1. Analiz edilen trafiğin iletileceği bir origin tanımlayın.

        Origin birden fazla sunucuya sahipse, hepsini belirtebilirsiniz. Edge Node, trafiği [round-robin](https://en.wikipedia.org/wiki/Round-robin_DNS) yük dengeleme kullanarak onlara iletir.

        Döngüleri önlemek için Origin’ler host’lardan farklı olmalıdır.
    1. Alan adı sahipliğini doğrulamak için sağlanan **Certificate CNAME** kaydını DNS bölgenize ekleyin.
    1. Yönlendirmeyi tamamlamak için host’unuzun DNS’ini sağlanan **Traffic CNAME**’e yöneltin.

        Traffic CNAME, certificate CNAME doğrulanınca sağlanır.

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-inline.png)
=== "Security Edge Connector"
    1. Dağıtım için bir bölge seçin.
    1. Sağlanan Node URL’sini kopyalayın — Connector için giriş noktasıdır.
    1. Platformunuz için **Download code bundle** indirin.
    1. Paketi, aşağıdaki yönergeleri izleyerek API yönetim platformunuza uygulayın:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-connector.png)

Kurulumdan sonra, Edge Node’a otomatik olarak bir test saldırısı gönderilir. Saldırı tespit edildiğinde, Free Tier’ın tüm işlevleriyle Wallarm Console’a erişim kazanırsınız. Saldırı [**Attacks**](../../user-guides/events/check-attack.md) bölümünde görünecektir.

Ayrıca ekip arkadaşlarınızı onboarding’e katılmaları için davet edebilirsiniz. Kendilerine **Administrator** [role](../../user-guides/settings/users.md#user-roles) atanır ve e-posta ile bir davet bağlantısı alırlar.

Wizard’ı daha sonra Security Edge bölümündeki **Quick setup** üzerinden veya `/onboarding` adresinden yeniden açabilirsiniz.

## Sınırlamalar

Tam Security Edge yapılandırma akışına kıyasla, **Quick setup** wizard’ın aşağıdaki kısıtları vardır:

* Host ince ayarı desteklenmez: filtrasyon modları, Wallarm applications, NGINX yönergeleri
* Security Edge Inline:

    * Apex alan adları host’larda desteklenmez
    * Yalnızca bir origin eklenebilir
    * [Alan adı sahipliği doğrulaması](inline/deployment.md#3-certificates) atlanamaz (ör. origin’iniz Cloudflare gibi bir proxy arkasındaysa)
    * [Host yönlendirme](inline/host-redirection.md) desteklenmez
    * [Özel engelleme sayfası](inline/custom-block-page.md)
    * [NGINX geçersiz kılmaları](inline/nginx-overrides.md)
    * [Karşılıklı TLS](inline/mtls.md) yapılandırması kullanılamaz

Bazı özellikler, quick setup veya tam yapılandırma akışı kullanılsın fark etmeksizin Free Tier’da kullanılamaz:

* [Zafiyet değerlendirmesi](../../user-guides/vulnerabilities.md)
* [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Security Edge’in telemetri portalı
* Microsoft Azure’da dağıtım
* Çoklu bulut ve çoklu bölge Security Edge Inline dağıtımı

## Sonraki adımlar

* [Security Edge Inline: tam yapılandırma akışı](inline/deployment.md)
* [Security Edge Connector: tam yapılandırma akışı](se-connector.md)