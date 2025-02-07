# Güvenli Node Güncelleme Önerileri

Bu doküman, Wallarm Nodes’un güvenli şekilde güncellenmesi için önerileri ve ilişkili riskleri açıklamaktadır.

## Ortak öneriler

* Filtreleme node güncelleme sürecini dikkatlice planlayın ve izleyin. Wallarm node’larının yeni sürümlerinin tahmini yayın tarihlerine [Wallarm node versioning policy](versioning-policy.md) sayfasından ulaşabilirsiniz.
* Altyapınızda birden fazla Wallarm node yüklüyse, bunları kademeli olarak güncelleyin. İlk node güncellendikten sonra, node modüllerinin bir gün içinde çalışmasını izleyin ve ilk node düzgün çalışıyorsa diğer Wallarm node’ları kademeli olarak güncelleyin.
* Geliştirme ve üretim ortamlarının ayrıldığı modelde, filtreleme node’u kademeli olarak güncelleyin. İlk olarak, üretim dışı ortamlarda yeni sürümü uygulayın ve test edin, ardından üretim ortamlarında güncelleme yapın. Ayrıntılı öneriler, [ayrı ortamlarda Wallarm node yapılandırma talimatlarında](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes) açıklanmıştır.
* Filtreleme node’u güncellemeden önce, kullanabileceğiniz herhangi bir yöntemle (örneğin [traffic filtration mode](../admin-en/configure-wallarm-mode.md)’u `off` olarak ayarlayarak) node üzerinden trafik yönlendirmesini devre dışı bırakın.
* Filtreleme node modülü güncellendikten sonra, node filtreleme modunu `monitoring` olarak ayarlayın. Tüm modüller doğru çalışırsa ve `monitoring` modunda bir gün boyunca anormal sayıda yeni yanlış pozitif olmazsa, filtreleme node’u `block` moduna alın.
* [NGINX node](../installation/nginx-native-node-internals.md#nginx-node) kullanıyorsanız, Wallarm node güncellemelerini uygulamadan önce NGINX’i mevcut en son sürüme güncelleyin. Altyapınız belirli bir NGINX sürümü kullanmak zorundaysa, özel bir NGINX sürümü için Wallarm modülünün oluşturulması amacıyla lütfen [Wallarm teknik destek](mailto:support@wallarm.com)’e başvurun.

## Olası riskler

Aşağıda, filtreleme node’unun güncellenmesi sırasında ortaya çıkabilecek riskler yer almaktadır. Risklerin etkisini azaltmak için güncelleme yaparken ilgili yönergeleri uygulayın.

### Değişen işlevsellik

* [Wallarm Node 5.x ve 0.x’te neler yeni](what-is-new.md)
* [EOL node (3.6 veya daha düşük) güncelleniyorsa neler yeni](older-versions/what-is-new.md)

### Yeni yanlış pozitifler

Her yeni filtreleme node sürümüyle trafik analizi iyileştirilmektedir. Bu, yanlış pozitif sayısının her yeni sürümde azalacağı anlamına gelmektedir. Ancak, her korunan uygulamanın kendine özgü özellikleri bulunduğundan, bloklama modunu (`block`) etkinleştirmeden önce filtreleme node’unun `monitoring` modundaki çalışmasını analiz etmenizi öneririz.

Güncelleme sonrasında yeni yanlış pozitif sayısını analiz etmek için:

1. Filtreleme node’unun yeni sürümünü `monitoring` [modunda](../admin-en/configure-wallarm-mode.md) dağıtın ve trafiği filtreleme node’una gönderin.
2. Bir süre sonra, Wallarm Console → **Attacks** bölümünü açın ve saldırı olarak yanlış tanımlanan istek sayısını analiz edin.
3. Yanlış pozitif sayısında anormal bir artış fark ederseniz, lütfen [Wallarm teknik destek](mailto:support@wallarm.com)’e başvurun.

### Artan kaynak kullanımı

Bazı yeni filtreleme node özelliklerinin kullanılması, kullanılan kaynak miktarında değişikliklere neden olabilir. Kullanılan kaynak miktarındaki değişikliklere dair bilgiler [What is new](what-is-new.md) bölümünde vurgulanmaktadır.

Ayrıca, filtreleme node çalışmasını izlemek önerilir: Gerçek kullanılan kaynak miktarı ile dokümantasyonda belirtilen miktar arasında önemli farklar bulursanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com)’e başvurun.

## Güncelleme süreci

Wallarm node güncelleme süreci platforma ve kurulum biçimlerine bağlıdır. Lütfen kurulum biçimini seçin ve ilgili talimatları takip edin:

* NGINX Node:

    * [Modules for NGINX, NGINX Plus](nginx-modules.md)
    * [All-in-one installer](all-in-one.md)
    * [Docker container with the modules for NGINX or Envoy](docker-container.md)
    * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
    * [Sidecar](sidecar-proxy.md)
    * [Cloud node image](cloud-image.md)
    * [Multi-tenant node](multi-tenant.md)
    * [Migrating allowlists and denylists from Wallarm node 2.18 and lower to 5.0](migrate-ip-lists-to-node-3.md)
* Native Node:

    * [All-in-one installer](native-node/all-in-one.md)
    * [Helm chart](native-node/helm-chart.md)
    * [Docker image](native-node/docker-image.md)