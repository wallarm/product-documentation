# Güvenli bir düğüm yükseltme süreci için öneriler

Bu belge, Wallarm filtreleme düğümünün 4.8'e kadar güvenli bir şekilde yükseltilmesi için öneriler ve ilgili riskleri açıklar.

## Genel öneriler

* Filtreleme düğümü güncelleme sürecini dikkatlice planlayın ve izleyin. Yeni Wallarm düğümlerinin tahmini yayın tarihleri, [Wallarm düğümü sürümleme politikası](versioning-policy.md)nda yayınlanmaktadır.
* Altyapınızda birden çok Wallarm düğümü yüklüyse, bunları kademeli olarak güncelleyin. İlk düğümü güncelledikten sonra, bir gün boyunca düğüm modüllerinin işleyişini izleyin ve ilk düğüm düzgün bir şekilde çalışıyorsa diğer Wallarm düğümlerini kademeli olarak güncelleyin.
* Ayrılmış geliştirme ve üretim ortamları olan model için, filtreleme düğümünü kademeli olarak güncelleyin. Önce, yeni versiyonu üretim dışı ortamlarda uygulayın ve test edin, ardından üretim ortamlarında uygulayın. Ayrıntılı öneriler [ayrı ortamlar için Wallarm düğümlerinin yapılandırılması talimatları](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes)nda açıklanmıştır.
* Filtreleme düğümünü yükseltmeden önce, (örneğin, [trafik filtreleme modunu](../admin-en/configure-wallarm-mode.md) `off` olarak ayarlayarak) kullanılabilir herhangi bir yöntemle düğüm aracılığıyla trafik yönlendirmeyi devre dışı bırakın.
* Filtreleme düğümü modülü yükseltildikten sonra, düğüm filtreleme modunu `monitoring` olarak ayarlayın. Tüm modüller doğru bir şekilde çalışıyor ve bir gün boyunca `monitoring` modunda anormal bir sayıda yeni yanlış pozitif yoksa, filtreleme düğümünü `block` moduna koyun.
* Wallarm düğüm güncellemelerini uygulamadan önce NGINX'i en son sürüme güncelleyin. Altyapınızın NGINX'in belirli bir sürümünü kullanması gerekiyorsa, lütfen Wallarm modülünün özel bir NGINX sürümü için oluşturulması üzerine [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

## Olası riskler

Aşağıda, filtreleme düğümünün güncellenmesi durumunda ortaya çıkabilecek riskler yer almaktadır. Risklerin etkisini azaltmak için, lütfen güncelleme sırasında uygun yönergeleri takip edin.

### Değişen işlevsellik

* [Wallarm düğümü 4.8'de neler yeni](what-is-new.md)
* [EOL düğümünün (3.6 veya daha düşük) yükseltilmesi durumunda neler yeni](older-versions/what-is-new.md)

### Yeni yanlış pozitifler

Her yeni filtreleme düğümü sürümü ile trafik analizini geliştiriyoruz. Bu, yanlış pozitiflerin sayısının her yeni sürümle azaldığı anlamına gelir. Ancak, her korunan uygulamanın kendi özellikleri vardır, bu nedenle engelleme modunu (`block`) etkinleştirmeden önce `monitoring` modunda yeni filtreleme düğümü sürümünün işleyişini analiz etmenizi öneririz.

Güncellemeden sonra yeni yanlış pozitiflerin sayısını analiz etmek için:

1. Filtreleme düğümünün yeni sürümünü `monitoring` [modunda](../admin-en/configure-wallarm-mode.md) dağıtın ve trafiği filtreleme düğümüne gönderin.
2. Bir süre sonra, Wallarm Konsolu → **Olaylar** bölümünü açın ve hatalı bir şekilde saldırı olarak tanınan taleplerin sayısını analiz edin.
3. Yanlış pozitiflerin sayısında anormal bir artış bulursanız, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

### Kullanılan kaynak miktarının artması

Yeni filtreleme düğümü özelliklerinin kullanılması, kullanılan kaynak miktarında değişikliklere neden olabilir. Kullanılan kaynak miktarındaki değişiklikler hakkında bilgi, [Yenilikler](what-is-new.md) bölümünde vurgulanmıştır.

Ayrıca, filtreleme düğümünün işleyişini izlemenizi öneririz: belgelerde belirtilen miktarla ve gerçekte kullanılan kaynak miktarı arasında önemli farklılıklar bulursanız, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.

## Güncelleme süreci

Wallarm düğüm güncelleme süreci, platforma ve kurulum biçimlerine bağlıdır. Lütfen kurulum biçimini seçin ve uygun talimatları takip edin:

* [NGINX, NGINX Plus için Modüller](nginx-modules.md)
* [NGINX veya Envoy için Modüller ile Docker Konteyneri](docker-container.md)
* [Entegre Wallarm modülleri ile NGINX Ingress Controller](ingress-controller.md)
* [Entegre Wallarm modülleri ile Kong Ingress Controller](kong-ingress-controller.md)
* [Sidecar](sidecar-proxy.md)
* [Cloud node image](cloud-image.md)
* [Çok kiracılı düğüm](multi-tenant.md)
* [CDN düğümü](cdn-node.md)
* [Wallarm düğüm 2.18 ve daha düşük sürümlerden 4.8'e izin ve engelleme listelerinin taşınması](migrate-ip-lists-to-node-3.md)