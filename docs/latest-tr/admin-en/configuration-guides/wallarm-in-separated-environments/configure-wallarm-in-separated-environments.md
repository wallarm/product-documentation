# Ayrı Ortamlar için Filtre Düğümünü Yapılandırma Üzerine Öneriler

[Wallarm filtreleme düğümlerinin ayrı ortamlarda nasıl çalıştığını](how-wallarm-in-separated-environments-works.md) zaten öğrendiniz. Düğümlerin tarif edildiği gibi çalışması için, bu makaleden ayrı ortamlardaki düğümleri yapılandırma konusundaki önerileri öğrenin.

## İlk Wallarm Koruma Dağıtım Süreci

Eğer Wallarm korumasını ortamlara ilk kez dağıtıyorsanız, aşağıdaki yaklaşımı kullanmanız önerilir (gerektiği gibi ayarlamaktan çekinmeyin):

1. Mevcut Wallarm düğüm dağıtım seçenekleri hakkında bilgi edinin [burada](../../../installation/supported-deployment-options.md).
2. Gerekirse, ortamlarınız için filtreleme düğümü yapılandırmasını ayrı ayrı yönetmek için mevcut seçenekler hakkında bilgi edinin. Bu bilgileri [burada](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features) bulabilirsiniz.
3. Filtreleme modu `izleme` olarak ayarlanmış Wallarm filtreleme düğümlerini üretim dışı ortamlarınıza dağıtın.
4. Wallarm çözümünü çalıştırma, ölçeklendirme ve izleme hakkında bilgi edinin; yeni ağ bileşeninin stabilitesini doğrulayın.
5. Filtreleme modu `izleme` olarak ayarlanmış Wallarm filtreleme düğümlerini üretim ortamınıza dağıtın.
6. Yeni Wallarm bileşeni için uygun yapılandırma yönetimi ve izleme süreçlerini uygulayın.
7. Trafik akışını, test ve üretimi içeren tüm ortamlarınızda, filtreleme düğümleri üzerinden sürdürün. Bu, Wallarm bulut tabanlı arka uç için uygulamanız hakkında bilgi edinmek için biraz zaman verme anlamına gelir. Süre 7-14 gün olacaktır.
8. `engelleme` filtreleme modunu tüm üretim dışı ortamlarınızda etkinleştirin ve otomatik veya manuel testlerle korunan uygulamanın beklendiği gibi çalıştığını doğrulayın.
9. Üretim ortamında `engelleme` filtreleme modunu etkinleştirin. Mevcut yöntemleri kullanarak, uygulamanın beklendiği gibi çalıştığını doğrulayın.

!!! bilgi
    Filtreleme modunu ayarlamak için lütfen bu [talimatları](../../configure-wallarm-mode.md) kullanın.

## Yeni Wallarm Düğüm Değişikliklerinin Kademeli Dağıtımı

Zaman zaman mevcut Wallarm altyapınızda bazı değişiklikler gerekebilir. Organizasyonunuzun değişiklik yönetimi politikasına bağlı olarak, tüm potansiyel olarak riskli değişiklikleri üretim dışı bir ortamda test etmeniz, ardından değişiklikleri üretim ortamınıza uygulamanız gerekebilir.

Farklı Wallarm bileşenlerinin ve özelliklerinin yapılandırmasını test etmek ve kademeli olarak değiştirmek için aşağıdaki yaklaşımlar önerilmektedir:
* [Tüm form faktörlerinde Wallarm filtreleme düğümlerinin düşük seviye yapılandırması](#low-level-onfiguration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Wallarm düğüm kurallarının yapılandırması](#configuration-of-wallarm-node-rules)

### Tüm Form Faktörlerinde Wallarm Filtreleme Düğümlerinin Düşük Seviye Yapılandırması

Filtreleme düğümlerinin düşük seviye yapılandırması, Docker ortam değişkenleri aracılığıyla, sağlanan NGINX yapılandırma dosyası, Kubernetes Ingress controller parametreleri, vb. ile gerçekleştirilir. Yapılandırma şekli, [dağıtım seçeneğine](../../../installation/supported-deployment-options.md) bağlıdır.

Düşük seviye yapılandırma, altyapı kaynakları için mevcut değişiklik yönetimi süreçlerinizi kullanarak farklı müşteri ortamları için ayrı ayrı yönetilebilir.

### Wallarm Düğüm Kurallarının Yapılandırması

Her kural kaydı, farklı bir [küme](how-wallarm-in-separated-environments-works.md#resource-identification) uygulama örneği ID'leri veya `HOST` istek başlıkları ile ilişkilendirilebileceğinden, aşağıdaki seçenekler önerilmektedir:

* Yeni yapılandırmayı önce bir test veya geliştirme ortamına uygulayın, işlevselliği doğrulayın ve ardından değişikliği üretim ortamında uygulayın.
* `Regexp tabanlı saldırı göstergesini oluştur` kuralını `Deneysel` modda kullanın. Bu mod, kuralın hatalı bir şekilde geçerli son kullanıcı taleplerini engelleme riski olmadan doğrudan üretim ortamına dağıtılmasına izin verir.

    ![Deneysel kural oluşturma](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* `Filtreleme modunu ayarla` kuralını, belirli ortamlar ve istekler için Wallarm filtreleme modunu kontrol etmek için kullanın. Bu kural, Wallarm korumasının, yeni uç noktalar ve farklı ortamlarda diğer kaynakları korumak için kademeli olarak dağıtılma şeklinde ek esneklik sağlar. Varsayılan olarak, [`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode) değeri, [`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override) ayarına bağlı olarak kullanılır.

    ![Filtreleme modunu yeniden yazmak için bir kural oluşturma](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)