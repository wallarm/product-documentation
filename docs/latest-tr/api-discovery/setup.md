# API Discovery Kurulumu <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [API Discovery](overview.md) modülünün nasıl etkinleştirileceğini, yapılandırılacağını ve hata ayıklanacağını açıklar.

## Etkinleştir

API Discovery, Wallarm düğümü kurulumunun tüm [self-hosted](../installation/supported-deployment-options.md), [Security Edge](../installation/security-edge/overview.md) ve [Connector](../installation/connectors/overview.md) biçimlerine dahildir. Düğüm dağıtımı sırasında API Discovery modülü kurulur ancak varsayılan olarak devre dışı bırakılır.

API Discovery özelliğini doğru şekilde etkinleştirip çalıştırmak için:

1. [Abonelik planınızın](../about-wallarm/subscription-plans.md#core-subscription-plans) **API Discovery** içerdiğinden emin olun. Abonelik planını değiştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) adresine talep gönderin.
1. Wallarm Console → **API Discovery** → **Configure API Discovery** içinde, API Discovery ile trafik analizini etkinleştirin.

API Discovery modülü etkinleştirildiğinde, trafik analizi ve API envanteri oluşturulmaya başlanır. API envanteri, Wallarm Console'un **API Discovery** bölümünde görüntülenecektir.

## Yapılandır

**API Discovery** bölümündeki **Configure API Discovery** düğmesine tıklayarak, API keşfi için uygulama seçimi ve risk puanı hesaplamasını özelleştirme gibi ince ayar seçeneklerine geçersiniz.

### API Discovery için uygulamaları seçme

API Discovery'yi tüm uygulamalar için veya yalnızca seçilenler için etkinleştirebilir/devre dışı bırakabilirsiniz:

1. Uygulamaların [Uygulamaların ayarlanması](../user-guides/settings/applications.md) makalesinde açıklandığı şekilde eklendiğinden emin olun.

    Uygulamalar yapılandırılmamışsa, tüm API'lerin yapıları tek bir ağaçta gruplanır.

1. Gerekli uygulamalar için Wallarm Console → **API Discovery** → **Configure API Discovery** içinde API Discovery'yi etkinleştirin.

    ![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**Settings** → **[Applications](../user-guides/settings/applications.md)** içinde yeni bir uygulama eklediğinizde, API keşfi için uygulamalar listesine otomatik olarak **devre dışı** durumda eklenir.

### Risk puanı hesaplamasını özelleştirme

[risk puanı](risk-score.md) hesaplamasında her faktörün ağırlığını ve hesaplama yöntemini yapılandırabilirsiniz.

### Hassas veri tespitini özelleştirme

API Discovery, API'leriniz tarafından tüketilen ve taşınan [hassas verileri tespit eder ve vurgular](sensitive-data.md). Mevcut tespit sürecini ince ayar yapabilir ve tespit edilecek kendi veri türlerinizle genişletebilirsiniz.

Geçerli yapılandırmayı görüntülemek ve değişiklik yapmak için Wallarm Console içinde **API Discovery** → **Configure API Discovery** → **Sensitive data** yoluna gidin. Burada mevcut hassas veri desenlerini görüntüleyip değiştirebilir ve kendi desenlerinizi ekleyebilirsiniz.

[Ayrıntılar için buraya bakın →](sensitive-data.md#customizing-sensitive-data-detection)

## Hata ayıklama

API Discovery günlüklerini almak ve analiz etmek için, düğümün çalıştığı Linux makinede `/opt/wallarm/var/log/wallarm/appstructure-out.log` günlük dosyasını okuyabilirsiniz.