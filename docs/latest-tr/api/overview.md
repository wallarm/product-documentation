[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm API Genel Bakışı

Wallarm API, Wallarm sistemlerinin bileşenleri arasındaki etkileşimi sağlar. Wallarm API metotlarını şu durumları oluşturmak, almak veya güncellemek için kullanabilirsiniz:

* zafiyetler
* saldırılar
* olaylar
* kullanıcılar
* müşteriler
* filtre düğümleri
* vb.

API metotlarının açıklaması, Wallarm Konsol→ sağ üst→ `?` → **Wallarm API Konsolu** yolunu izleyerek veya aşağıdaki linklerden doğrudan erişilebilir:

* Amerikan bulutu için https://apiconsole.us1.wallarm.com/
* Avrupa bulutu için https://apiconsole.eu1.wallarm.com/

![Wallarm API Konsolu](../images/wallarm-api-reference.png)

## API bağlantı noktası

API istekleri aşağıdaki URL'ye gönderilir:

* Amerikan bulutu için `https://us1.api.wallarm.com/`
* Avrupa bulutu için `https://api.wallarm.com/`

## API isteklerinin doğrulanması

Wallarm API isteklerini yapabilmek için doğrulanmış bir kullanıcı olmalısınız. API isteklerinin doğrulanma metodu, isteği gönderen istemciye bağlıdır:

* [API Referans UI](#api-reference-ui)
* [Kendi API İstemciniz](#your-own-api-client)

### Wallarm API Konsolu

İstek doğrulaması için token kullanılır. Token, Wallarm hesabınızda başarılı bir doğrulama sonrası oluşturulur.

1. Aşağıdaki linklerden birini kullanarak Wallarm Konsolunuzda oturum açın:
    * Amerikan bulutu için https://us1.my.wallarm.com/
    * Avrupa bulutu için https://my.wallarm.com/
2. Aşağıdaki linklere tıklayarak Wallarm API Konsolu sayfasını yenileyin: 
    * Amerikan bulutu için https://apiconsole.us1.wallarm.com/
    * Avrupa bulutu için https://apiconsole.eu1.wallarm.com/
3. Gerekli API metoduna gidin → **Deneyin** bölümü, parametre değerlerini girin ve isteği **Çalıştırın**.

### Kendi API İstemciniz

Kendi API istemcinizden Wallarm API'ye istekleri doğrulamak için:

1. Wallarm hesabınıza [Amerikan Bulutu](https://us1.my.wallarm.com/) veya [Avrupa Bulutu](https://my.wallarm.com/) 'nda oturum açın → **Ayarlar** → **API tokenları**.
2. Wallarm API'ye erişim için [token oluşturun](../user-guides/settings/api-tokens.md#configuring-tokens).
3. Token'ınızı açın ve **Token** kısmından değeri kopyalayın.
4. Gerekli API isteğini, `X-WallarmApi-Token` başlık parametresinde **Token** değerini geçirerek gönderin.

[API tokenları hakkında daha fazla bilgi →](../user-guides/settings/api-tokens.md)

## Wallarm'ın API geliştirme ve belgelendirme yaklaşımı

Allarm API Referansı, tek sayfalı bir uygulama (SPA) olup tüm gösterilen veriler API'den dinamik olarak alınır. Bu tasarım, Wallarm'ın [API-öncelikli](https://swagger.io/resources/articles/adopting-an-api-first-approach/) yaklaşımını benimsemesini sağlar; yeni veri ve işlevsellik ilk olarak kamuya açık API'de sunulur ve ardından API Referansı'nda açıklanır. Genellikle tüm yeni işlevsellikler, kamuya açık API ve API Referansı'nda eş zamanlı olarak yayınlanır, ancak bazen API Referansı değişikliklerinden önce yeni API değişiklikleri yayınlanır ve bazı işlevler yalnızca kamu API'si aracılığıyla kullanılabilir hale gelir.

Wallarm API Referansı, [Swagger UI](https://swagger.io/tools/swagger-ui/) aracı kullanılarak Swagger dosyasından oluşturulmuştur. API Referansı, kullanılabilir API uç noktaları, metotları ve veri yapıları hakkında bilgi edinmenin kolay bir yolunu sağlar. Ayrıca, kullanılabilir tüm uç noktaları denemek için basit bir yol sunar.