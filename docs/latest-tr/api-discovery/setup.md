# API Discovery Kurulumu <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [API Discovery](overview.md) modülünü nasıl etkinleştireceğinizi, yapılandıracağınızı ve hata ayıklayacağınızı açıklamaktadır.

## Etkinleştirme

API Discovery, Wallarm node kurulumu [tüm biçimlerine](../installation/supported-deployment-options.md) dahildir. Node dağıtımında, API Discovery modülü kurulur ancak varsayılan olarak devre dışı bırakılır.

API Discovery'ı etkinleştirip doğru şekilde çalıştırmak için:

1. [Abonelik planınızın](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) **API Discovery** içermesine dikkat edin. Abonelik planını değiştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) adresine talepte bulunun.
1. Wallarm Console → **API Discovery** → **Configure API Discovery** bölümüne gidip API Discovery ile trafik analizini etkinleştirin.

API Discovery modülü etkinleştirildiğinde, trafik analizi ve API envanterinin oluşturulması başlayacaktır. API envanteri, Wallarm Console’un **API Discovery** bölümünde görüntülenecektir.

## Yapılandırma

**API Discovery** bölümündeki **Configure API Discovery** butonuna tıklayarak, API keşfi için uygulamaların seçilmesi ve risk skoru hesaplamasının özelleştirilmesi gibi API Discovery ayarlarını detaylandırabileceğiniz seçeneklere ulaşabilirsiniz.

### API Discovery için Uygulamaların Seçilmesi

API Discovery'ı tüm uygulamalar veya sadece seçili uygulamalar için etkinleştirebilir/devre dışı bırakabilirsiniz:

1. Uygulamaların, [Setting up applications](../user-guides/settings/applications.md) makalesinde açıklandığı şekilde eklendiğinden emin olun.

   Uygulamalar yapılandırılmamışsa, tüm API'lerin yapıları tek bir ağaç altında gruplanır.

1. Gerekli uygulamalarda Wallarm Console → **API Discovery** → **Configure API Discovery** bölümünden API Discovery'yı etkinleştirin.

    ![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**Settings** → **[Applications](../user-guides/settings/applications.md)** bölümünden yeni bir uygulama eklediğinizde, uygulama otomatik olarak API discovery listesine **devre dışı** durumuyla eklenir.

### Risk Skoru Hesaplamasının Özelleştirilmesi

[risk score](risk-score.md) hesaplamasında her faktörün ağırlığını ve hesaplama yöntemini yapılandırabilirsiniz.

### Hassas Veri Tespitinin Özelleştirilmesi

API Discovery, API'leriniz tarafından kullanılan ve taşınan hassas verileri [tespit edip vurgular](sensitive-data.md). Mevcut tespit sürecini ince ayarlayabilir ve tespit edilecek kendi veri tiplerinizi ekleyebilirsiniz.

Mevcut yapılandırmayı görmek ve değişiklik yapmak için, Wallarm Console’da **API Discovery** → **Configure API Discovery** → **Sensitive data** bölümüne gidin. Burada mevcut hassas veri kalıplarını inceleyebilir, değiştirebilir ve kendi kalıplarınızı ekleyebilirsiniz.

[Detaylar için buraya tıklayın →](sensitive-data.md#customizing-sensitive-data-detection)

## Hata Ayıklama

API Discovery günlüklerini almak ve analiz etmek için aşağıdaki yöntemleri kullanabilirsiniz:

* Node’un çalıştığı makinada `/opt/wallarm/var/log/wallarm/appstructure-out.log` günlük dosyasını okuyun.
* Eğer Wallarm node, Kubernetes Ingress kontrolcüsü olarak dağıtılmışsa: Tarantool ve `wallarm-appstructure` konteynerlerini çalıştıran podun durumunu kontrol edin. Pod durumu **Running** olmalıdır.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure` konteynerinin günlüklerini okuyun:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```