# Wallarm platform genel bakış

Wallarm platformu, bulut uygulamalarınızı ve API'lerinizi korumak için eşsiz bir şekilde uygundur. Hibrit mimarisi, kaynaklarınızı aşağıdaki özelliklerle korur:

* Ultra düşük yanlış pozitiflerle [hacker saldırılarına karşı koruma](protecting-against-attacks.md)
* [API tacizine karşı botlara karşı koruma](../api-abuse-prevention/overview.md)
* [API Keşfi](api-discovery.md)
* [Otomatik kırılganlık tespiti](detecting-vulnerabilities.md)

Wallarm, aşağıdaki ana bileşenlerden oluşur:

* Wallarm filtreleme düğümü
* Wallarm Bulut

## Filtreleme düğümü

Wallarm filtreleme düğümü aşağıdakileri yapar:

* Şirketin tüm ağ trafiğini analiz eder ve zararlı istekleri hafifletir
* Ağ trafiği ölçümlerini toplar ve ölçümleri Wallarm Bulut'a yükler
* Wallarm Cloud'da tanımladığınız özel kaynak güvenlik kurallarını indirir ve bu kuralları trafik analizi sırasında uygular

Wallarm filtreleme düğümünü, [desteklenen dağıtım seçeneklerinden](../installation/supported-deployment-options.md) biri ile bir ağ altyapısına yerleştirirsiniz.

## Bulut

Wallarm Bulut aşağıdaki işlemleri yapar:

* Filtreleme düğümünün yüklediği metrikleri işler
* Özel kaynak özel güvenlik kurallarını derler
* Kırılganlık tespit etmek için şirketin açık varlıklarını tarar
* Filtreleme düğümünden alınan trafik metriklerine dayalı API yapısını oluşturur

Wallarm, [Amerikan](#us-cloud) ve [Avrupa](#eu-cloud) bulut örneklerini yönetir. Her Bulut, veritabanları, API uç noktaları, müşteri hesapları vb. bakımından tamamen ayrıdır. Bir Wallarm Bulut'unda kayıtlı bir müşteri, diğer bir Wallarm Bulut'u verilerine erişmek veya yönetmek için kullanamaz.

Aynı zamanda, her iki Wallarm Bulut'u da kullanabilirsiniz. Bu durumda, bireysel Bulut'lardaki bilgilerinizi erişmek ve yönetmek için Wallarm Konsolu ve API uç noktalarında farklı hesapları kullanmanız gerekecektir.

Wallarm Bulutlarının uç noktaları aşağıda sağlanmıştır.

### US Bulutu

Fiziksel olarak ABD'de bulunur.

* Wallarm hesabı oluşturmak için https://us1.my.wallarm.com/
* API yöntemlerini çağırmak için `https://us1.api.wallarm.com/`

### EU Bulutu

Fiziksel olarak Hollanda'da bulunur.

* Wallarm hesabı oluşturmak için https://my.wallarm.com/
* API yöntemlerini çağırmak için `https://api.wallarm.com/`