[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm API genel bakış

Wallarm API, Wallarm sistem bileşenleri arasında etkileşim sağlar. Wallarm API yöntemlerini aşağıdaki örnekleri oluşturmak, almak veya güncellemek için kullanabilirsiniz:

* güvenlik açıkları
* saldırılar
* olaylar
* kullanıcılar
* istemciler
* filtre düğümleri
* vb.

API yöntemlerinin açıklamaları, Wallarm Console → sağ üst → `?` → **Wallarm API Console** aracılığıyla veya doğrudan aşağıdaki bağlantılar üzerinden verilmektedir:

* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm/overview.md#cloud)
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm/overview.md#cloud)

![Wallarm API Console](../images/wallarm-api-reference.png)

## API uç noktası

API istekleri aşağıdaki URL'lere gönderilir:

* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm/overview.md#cloud)
* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm/overview.md#cloud)

## API isteklerinin kimlik doğrulaması

Wallarm API isteklerini gerçekleştirmek için doğrulanmış bir kullanıcı olmalısınız. API isteklerinin kimlik doğrulama yöntemi, isteği gönderen istemciye bağlı olarak değişir:

* [API Reference UI](#wallarm-api-console)
* [Your own API client](#your-own-api-client)

### Wallarm API Console

İsteklerin kimlik doğrulaması için bir token kullanılır. Bu token, Wallarm hesabınızda başarılı oturum açma işleminden sonra oluşturulur.

1. Aşağıdaki bağlantıları kullanarak Wallarm Console'a giriş yapın:
    * https://us1.my.wallarm.com/ for the US cloud
    * https://my.wallarm.com/ for the EU cloud
2. Aşağıdaki bağlantıları kullanarak Wallarm API Console sayfasını yenileyin:
    * https://apiconsole.us1.wallarm.com/ for the US cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud
3. İstediğiniz API yöntemine gidin → **Try it out** bölümünde parametre değerlerini girin ve isteği **Execute** edin.

### Your own API client

Kendi API istemciniz üzerinden Wallarm API'ye istek gönderirken kimlik doğrulaması yapmak için:

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) üzerinden Wallarm hesabınıza giriş yapın → **Settings** → **API tokens**.
2. Wallarm API'ye erişim için [Create token](../user-guides/settings/api-tokens.md) oluşturun.
3. Token'ınızı açın ve **Token** bölümündeki değeri kopyalayın.
4. Gerekli API isteğini, `X-WallarmApi-Token` header parametresinde **Token** değerini göndererek yapın.

[More details on API tokens →](../user-guides/settings/api-tokens.md)

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## Wallarm'un API geliştirme ve dokümantasyon yaklaşımı

Wallarm API Reference, tüm gösterilen verilerin API'den dinamik olarak alındığı tek sayfalı bir uygulamadır (SPA). Bu tasarım, yeni veri ve işlevsellik ilk olarak halka açık API'de sunulduğunda ve bir sonraki adım olarak API Reference’ta tanımlandığında [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) yaklaşımını kullanmaya yöneltir. Normalde tüm yeni işlevsellik hem halka açık API hem de API Reference’ta paralel olarak yayınlanır, ancak bazen yeni API değişiklikleri API Reference değişikliklerinden önce yayınlanır ve bazı işlevsellik yalnızca halka açık API üzerinden sunulur.
    
Wallarm API Reference, [Swagger UI](https://swagger.io/tools/swagger-ui/) aracı kullanılarak Swagger dosyasından oluşturulmaktadır. API Reference, mevcut API uç noktaları, yöntemler ve veri yapıları hakkında bilgi edinmenin kolay bir yolunu sunar. Ayrıca, mevcut tüm uç noktaları denemenin basit bir yolunu sağlar.