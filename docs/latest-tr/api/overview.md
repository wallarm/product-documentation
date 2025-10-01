[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm API genel bakış

Wallarm API, Wallarm sisteminin bileşenleri arasında etkileşim sağlar. Aşağıdaki varlıkları oluşturmak, almak veya güncellemek için Wallarm API yöntemlerini kullanabilirsiniz:

* zafiyetler
* saldırılar
* olaylar
* kullanıcılar
* müşteriler
* filtre düğümleri
* vb.

API yöntemlerinin açıklaması, Wallarm Console → sağ üst → `?` → **Wallarm API Console** yolundan erişilebilen **Wallarm API Console** içinde veya doğrudan şu bağlantıdan verilir:

* [ABD bulutu](../about-wallarm/overview.md#cloud) için https://apiconsole.us1.wallarm.com/
* [AB bulutu](../about-wallarm/overview.md#cloud) için https://apiconsole.eu1.wallarm.com/

![Wallarm API Console](../images/wallarm-api-reference.png)

## API uç noktası

API istekleri aşağıdaki URL'ye gönderilir:

* [ABD bulutu](../about-wallarm/overview.md#cloud) için `https://us1.api.wallarm.com/`
* [AB bulutu](../about-wallarm/overview.md#cloud) için `https://api.wallarm.com/`

## API isteklerinin kimlik doğrulaması

Wallarm API istekleri yapmak için doğrulanmış bir kullanıcı olmanız gerekir. API isteklerinin kimlik doğrulama yöntemi, isteği gönderen istemciye bağlıdır:

* [API Reference UI](#wallarm-api-console)
* [Kendi API istemciniz](#your-own-api-client)

### Wallarm API Console

İstek kimlik doğrulaması için bir token kullanılır. Bu token, Wallarm hesabınızda başarılı kimlik doğrulamadan sonra oluşturulur.

1. Aşağıdaki bağlantıyı kullanarak Wallarm Console'a giriş yapın:
    * US bulutu için https://us1.my.wallarm.com/
    * EU bulutu için https://my.wallarm.com/
2. Aşağıdaki bağlantıyı kullanarak Wallarm API Console sayfasını yenileyin:
    * US bulutu için https://apiconsole.us1.wallarm.com/
    * EU bulutu için https://apiconsole.eu1.wallarm.com/
3. Gerekli API yöntemine gidin → **Try it out** bölümünde parametre değerlerini girin ve isteği **Execute** edin.

### Kendi API istemciniz

Kendi API istemcinizden Wallarm API'ye yapılan isteklerin kimlik doğrulamasını yapmak için:

1. [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) üzerindeki Wallarm hesabınıza giriş yapın → **Settings** → **API tokens**.
1. Wallarm API'ye erişmek için [Token oluşturun](../user-guides/settings/api-tokens.md).
1. Token'ınızı açın ve **Token** bölümündeki değeri kopyalayın.
1. Gerekli API isteğini gönderirken `X-WallarmApi-Token` başlık parametresinde **Token** değerini iletin.

[API tokenları hakkında daha fazla bilgi →](../user-guides/settings/api-tokens.md)

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## API geliştirme ve dokümantasyona Wallarm yaklaşımı

Wallarm API Referansı, gösterilen tüm verilerin API'den dinamik olarak alındığı tek sayfalık bir uygulamadır (SPA). Bu tasarım, yeni veri ve işlevlerin önce genel API'de kullanıma sunulduğu ve bir sonraki adımda API Referansı'nda açıklandığı [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) yaklaşımını kullanmamızı sağlar. Normalde tüm yeni işlevler hem genel API'de hem de API Referansı'nda paralel olarak yayımlanır, ancak bazen yeni API değişiklikleri API Referansı değişikliklerinden önce yayımlanır ve bazı işlevler yalnızca genel API üzerinden kullanılabilir.

Wallarm API Referansı, Swagger dosyasından [Swagger UI](https://swagger.io/tools/swagger-ui/) aracı kullanılarak üretilir. API Referansı, mevcut API uç noktaları, yöntemleri ve veri yapıları hakkında bilgi edinmenin kolay bir yolunu sunar. Ayrıca mevcut tüm uç noktaları denemenin basit bir yolunu da sağlar.