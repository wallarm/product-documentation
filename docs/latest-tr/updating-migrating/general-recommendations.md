# Güvenli Node Yükseltme Önerileri

Bu belge, Wallarm Node'larının güvenli yükseltilmesi için önerileri ve ilgili riskleri açıklar.

## Genel öneriler

* Filtreleme node'u güncelleme sürecini dikkatle planlayın ve izleyin. Wallarm node'larının yeni sürümlerine ilişkin tahmini yayın tarihleri [Wallarm node sürümleme politikası](versioning-policy.md) içinde yayınlanır.
* Altyapınızda birden fazla Wallarm node kuruluysa, bunları kademeli olarak güncelleyin. İlk node'u güncelledikten sonra, bir gün boyunca node modüllerinin çalışmasını izleyin ve ilk node düzgün çalışıyorsa diğer Wallarm node'ları kademeli olarak güncelleyin.
* Geliştirme ve üretim ortamları ayrılmış modelde, filtreleme node'unu kademeli olarak güncelleyin. Önce yeni sürümü üretim dışı ortamlara uygulayın ve test edin, ardından üretim ortamlarında uygulayın.
* Filtreleme node'unu yükseltmeden önce, node üzerinden trafik yönlendirmesini mevcut yöntemlerden herhangi biriyle devre dışı bırakın (ör. [trafik filtreleme modu](../admin-en/configure-wallarm-mode.md) değerini `off` olarak ayarlayarak).
* Filtreleme node modülü yükseltildikten sonra node filtreleme modunu `monitoring` olarak ayarlayın. Tüm modüller doğru çalışıyorsa ve `monitoring` modunda bir gün boyunca anormal sayıda yeni yanlış pozitif yoksa, filtreleme node'unu `block` moduna alın.
* Eğer [NGINX node](../installation/nginx-native-node-internals.md#nginx-node) kullanıyorsanız, Wallarm node güncellemelerini uygulamadan önce NGINX'i mevcut en son sürüme yükseltin. Altyapınız belirli bir NGINX sürümünü kullanmak zorundaysa, özel bir NGINX sürümü için Wallarm modülünün derlenmesi amacıyla lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Olası riskler

Aşağıda, filtreleme node'unu güncellerken ortaya çıkabilecek riskler yer almaktadır. Risklerin etkisini azaltmak için güncelleme sırasında ilgili yönergeleri izleyin.

### Değişen işlevsellik

* [Wallarm Node 6.x ve 0.14.x+ içindeki yenilikler](what-is-new.md)
* [EOL node'u (3.6 veya daha düşük) yükseltiyorsanız neler yeni](older-versions/what-is-new.md)

### Yeni yanlış pozitifler

Filtreleme node'unun her yeni sürümüyle trafik analizini geliştiriyoruz. Bu, her yeni sürümle yanlış pozitif sayısının azaldığı anlamına gelir. Ancak, korunan her uygulamanın kendine özgü özellikleri vardır, bu nedenle engelleme modunu (`block`) etkinleştirmeden önce yeni filtreleme node sürümünün `monitoring` modundaki çalışmasını analiz etmenizi öneririz.

Güncellemeden sonra yeni yanlış pozitiflerin sayısını analiz etmek için:

1. Filtreleme node'unun yeni sürümünü `monitoring` [modunda](../admin-en/configure-wallarm-mode.md) devreye alın ve filtreleme node'una trafik gönderin.
2. Bir süre sonra, Wallarm Console → Attacks bölümünü açın ve yanlışlıkla saldırı olarak tanınan isteklerin sayısını analiz edin.
3. Yanlış pozitif sayısında anormal bir artış tespit ederseniz, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

### Kullanılan kaynak miktarında artış

Bazı yeni filtreleme node özelliklerinin kullanımı, kullanılan kaynak miktarında değişikliklere neden olabilir. Kullanılan kaynak miktarındaki değişikliklerle ilgili bilgiler [Yenilikler](what-is-new.md) bölümünde vurgulanmıştır.

Ayrıca filtreleme node'unun çalışmasını izlemeniz önerilir: belgelerde belirtilen miktarla fiilen kullanılan kaynak miktarı arasında önemli farklılıklar bulursanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Güncelleme süreci

Wallarm node güncelleme süreci, platforma ve kurulum biçimlerine bağlıdır. Lütfen kurulum biçimini seçin ve ilgili talimatları izleyin:

* NGINX Node:

    * [NGINX, NGINX Plus için modüller](nginx-modules.md)
    * [Hepsi bir arada yükleyici](all-in-one.md)
    * [NGINX modülleriyle Docker konteyneri](docker-container.md)
    * [Entegre Wallarm modüllerine sahip NGINX Ingress controller](ingress-controller.md)
    * [Sidecar](sidecar-proxy.md)
    * [Cloud node imajı](cloud-image.md)
    * [Çok kiracılı node](multi-tenant.md)
    * [Wallarm node 2.18 ve altından 6.x'e allowlist ve denylist'lerin taşınması](migrate-ip-lists-to-node-3.md)
* Native Node:

    * [Hepsi bir arada yükleyici](native-node/all-in-one.md)
    * [Helm chart](native-node/helm-chart.md)
    * [Docker imajı](native-node/docker-image.md)