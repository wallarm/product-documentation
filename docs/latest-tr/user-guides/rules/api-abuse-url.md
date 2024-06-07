# Belirli URL'ler ve İstekler İçin Bot Korumasını Devre Dışı Bırakma

Wallarm platformunun [**API İstismar Önleme**](../../api-abuse-prevention/overview.md) modülü, korunacak belirli uygulamaları, hedeflenen bot türlerini, tolerans seviyesini vb. belirleyen [profiler](../../api-abuse-prevention/setup.md) tabanlı botları tespit eder ve karşı tedbir alır. Ek olarak, bu makalede belirtilen **API İstismar Önleme modunu Ayarlama** kuralı, belirli URL'ler ve istekler için bot korumasını devre dışı bırakmanıza olanak sağlar.

Kuralın [URI oluşturucusu](../../user-guides/rules/add-rule.md#uri-constructor) hem URL hem de istek elemanları içerir, dolayısıyla bu kuralı, isteklerin hedeflediği URL'ler ve belirli istek türleri için bot korumasını devre dışı bırakmak amacıyla kullanabilirsiniz. Örneğin, belirli başlıklar içeren istekler için kullanabilirsiniz.

!!! bilgi "Farklı düğüm sürümlerinde kural desteği"
   Bu özellik yalnızca 4.8 ve üzeri düğüm sürümleri tarafından desteklenmektedir.

## Kuralın Oluşturulması ve Uygulanması

Belirli bir URL veya istek türü için bot korumasını devre dışı bırakmak için:

1. Wallarm Konsolu → **Kurallar** → **Kural Ekle** yolunu izleyin.
1. **Eğer istek şu şekildeyse**, [tanımlayın](../../user-guides/rules/add-rule.md#uri-constructor) kuralın uygulanmasını istediğiniz istekleri ve/veya URL'leri.

    URL'yi belirtmek için [**API Keşif**](../../about-wallarm/api-discovery.md) modülünü kullanıyor ve uç noktalarınızı keşfediyorsanız, ayrıca menüsünü kullanarak uç nokta için hızlıca bir kural oluşturabilirsiniz.

1. **Sonra** bölümünde, **API İstismar Önleme modunu Ayarla**'yı seçin ve ayarlayın:

    * **Varsayılan** - Belirtilen kapsam (belirli URL veya istek) için, botlardan koruma, genel API İstismar Önleme [profileri](../../api-abuse-prevention/setup.md) tarafından belirlenen alışıldık şekilde çalışacaktır.
    * **Bot aktivitesi için kontrol etme** - Tanımlanan URL ve/veya istek türü için bot aktivitesi kontrolü gerçekleştirilmeyecektir.

1. İsteğe bağlı olarak, bu URL/istek türü için kural oluşturma sebebini yorum kısmında belirtin.

URL ve/veya istek türü için istisnayı kuralı silmeden geçici olarak devre dışı bırakabileceğinizi unutmayın: bunun için **Varsayılan** modunu seçin. Daha sonra herhangi bir zamanda **Bot aktivitesi için kontrol etme**'ye geri dönebilirsiniz.

## Kural Örnekleri

### Talep başlıklarına Göre Meşru Botu İşaretlemek

Uygulamanızın Klaviyo pazarlama otomasyon aracıyla entegre olduğunu ve birden fazla IP'nin istek gönderdiğini varsayalım. Bu yüzden, belirli URI'ler için `Klaviyo/1.0` kullanıcı aracından gelen GET isteklerinde otomatik (bot) aktiviteleri kontrol etmeme kararı aldık:

![Belirli başlıkları olan istekler için bot aktivitesi kontrol etme](../../images/user-guides/rules/api-abuse-url-request.png)

### Test Uç Noktası İçin Botlardan Koruma Devre Dışı Bırakma

Uygulamanıza ait bir uç noktanız olduğunu varsayalım. Uygulamanız bot aktivitelerinden korunmalıdır ancak test uç noktası bir istisna olmalıdır. Ek olarak, API envanterinizin [**API Keşif**](../../about-wallarm/api-discovery.md) modülü tarafından keşfedildiğini varsayalım.

Bu durumda, **API Keşif** uç noktaları listesinden bir kural oluşturmak daha kolaydır. Bu listeye gidin, uç noktanızı bulun ve kural oluşturmayı buradan başlatın:

![API Keşif uç noktası için API İstismar Önleme modunu Ayarlama](../../images/user-guides/rules/api-abuse-url.png)