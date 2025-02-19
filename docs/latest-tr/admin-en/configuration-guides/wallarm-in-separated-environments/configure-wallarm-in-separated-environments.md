# Ayrı Ortamlarda Filtre Düğümünün Yapılandırılması İçin Öneriler

Zaten [Wallarm filtering nodes'ın ayrı ortamlarda nasıl çalıştığını](how-wallarm-in-separated-environments-works.md) öğrenmişsinizdir. Düğümlerin tanımlandığı şekilde çalışabilmesi için, bu makalede yer alan ayrı ortamlarda düğümlerin yapılandırılmasıyla ilgili önerileri inceleyin.

## İlk Wallarm Koruma Dağıtım Süreci

Ortamlar için Wallarm korumasının ilk dağıtımını gerçekleştiriyorsanız, aşağıdaki yaklaşımı kullanmanız önerilir (ihtiyacınıza göre uyarlayabilirsiniz):

1. Mevcut Wallarm düğüm dağıtım seçenekleri hakkında bilgi edinin [burada](../../../installation/supported-deployment-options.md).
2. Gerekirse, ortamlarınız için filtre düğümü yapılandırmasını ayrı ayrı yönetmek üzere mevcut seçenekler hakkında bilgi edinin. Bu bilgiyi [burada](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features) bulabilirsiniz.
3. Üretim dışı ortamlarınızda, filtreleme modu `monitoring` olarak ayarlanmış Wallarm filtering nodes'ları dağıtın.
4. Wallarm çözümünü nasıl çalıştıracağınız, ölçeklendireceğiniz ve izleyeceğiniz hakkında bilgi edinin; yeni ağ bileşeninin kararlılığını doğrulayın.
5. Üretim ortamınızda, filtreleme modu `monitoring` olarak ayarlanmış Wallarm filtering nodes'ları dağıtın.
6. Yeni Wallarm bileşeni için uygun yapılandırma yönetimi ve izleme süreçlerini uygulayın.
7. Wallarm bulut‑tabanlı arka ucu uygulamanızın uygulamanızı öğrenebilmesi için, test ve üretim dahil tüm ortamlarınızda 7-14 gün boyunca trafiğin filtre düğümleri üzerinden akmasını sağlayın.
8. Üretim dışı tüm ortamlarınızda `blocking` filtreleme modunu etkinleştirin ve korunan uygulamanın beklendiği gibi çalıştığını doğrulamak için otomatik veya manuel testler kullanın.
9. Üretim ortamında `blocking` filtreleme modunu etkinleştirin. Mevcut yöntemleri kullanarak uygulamanın beklendiği gibi çalıştığını doğrulayın.

!!! info
    Filtreleme modunu yapılandırmak için lütfen bu [talimatları](../../configure-wallarm-mode.md) kullanın.

## Yeni Wallarm Düğüm Değişikliklerinin Kademeli Yayılımı

Zaman zaman mevcut Wallarm altyapınızda değişiklikler gerekebilir. Kuruluşunuzun değişiklik yönetim politikasına bağlı olarak, potansiyel olarak riskli tüm değişiklikleri üretim dışı bir ortamda test etmeniz ve ardından üretim ortamınıza uygulamanız gerekebilir.

Farklı Wallarm bileşenlerinin ve özelliklerinin yapılandırmasını test etmek ve kademeli olarak değiştirmek için aşağıdaki yaklaşımlar önerilmektedir:
* [Tüm Formlarda Wallarm filtering nodes'ın düşük düzeyde yapılandırılması](#low-level-configuration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Wallarm düğüm kurallarının yapılandırılması](#configuration-of-wallarm-node-rules)

### Tüm Formlarda Wallarm Filtering Nodes'ın Düşük Düzeyde Yapılandırılması

Filtre düğümlerinin düşük düzey yapılandırması, Docker ortam değişkenleri, sağlanan NGINX yapılandırma dosyası, Kubernetes Ingress controller parametreleri vb. aracılığıyla gerçekleştirilir. Yapılandırma yöntemi, [dağıtım seçeneğine](../../../installation/supported-deployment-options.md) bağlıdır.

Mevcut altyapı kaynakları için değişiklik yönetim süreçlerinizi kullanarak, düşük düzey yapılandırma farklı müşteri ortamları için ayrı ayrı yönetilebilir.

### Wallarm Düğüm Kurallarının Yapılandırılması

Her kural kaydı, bir [farklı küme](how-wallarm-in-separated-environments-works.md#resource-identification) uygulama örneği ID'leri veya `HOST` istek başlıkları ile ilişkilendirilebildiğinden, aşağıdaki seçenekler önerilmektedir:

* Önce test veya geliştirme ortamına yeni bir yapılandırma uygulayın, işlevselliği doğrulayın ve ardından değişikliği üretim ortamına uygulayın.
* `Experimental` modunda `Create regexp-based attack indicator` kuralını kullanın. Bu mod, kuralın geçerli son kullanıcı isteklerini yanlışlıkla engelleme riski olmadan doğrudan üretim ortamına dağıtılmasına olanak sağlar.

    ![Creating experimental rule](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* Belirli ortamlar ve istekler için Wallarm filtreleme modunu kontrol etmek üzere `Set filtration mode` kuralını kullanın. Bu kural, yeni uç noktalar ve farklı ortamlardaki diğer kaynakları korumak için Wallarm korumasının kademeli olarak yayılmasını sağlamak amacıyla ek esneklik sunar. Varsayılan olarak, [`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode) değeri, [`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override) ayarına bağlı olarak kullanılır.

    ![Creating a rule to overwrite the filtration mode](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)