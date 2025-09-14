[link-attacks]:                 ../user-guides/events/check-attack.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# Bot Etkinliğini Keşfetme <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Abuse Prevention](../api-abuse-prevention/overview.md), kötü amaçlı bot etkinliğini ML algoritmalarına dayanarak tanımlar. Bu tür saldırılar tek bir engellenen isteğe bakılarak analiz edilemez. Bu nedenle Wallarm platformunun bot etkinliğini farklı açılardan araştırmak için geniş bir araç yelpazesi sunması esastır.

## API kötüye kullanım panoları

API Abuse Prevention, son 30 güne ait bot etkinliği verilerini **API Abuse Prevention** bölümü → **Statistics** sekmesinde kullanışlı biçimde görselleştirir. Zaman çizelgesi diyagramını kullanarak bot etkinliğindeki ani artışları kolayca belirleyebilirsiniz. Ek **Top Attackers** ve **Top Targets** widget’ları en aktif botları ve en çok saldırıya uğrayan API’leri ile uygulamaları belirlemenize olanak tanır. Kontrol panelindeki öğeye tek tıkla **Attacks** sekmesinde bu bot etkinliklerine derinlemesine inebilirsiniz.

Ayrıca alt kısımdaki **Behavioral patterns** bölümünde bot davranışlarını analiz edebilirsiniz. Her bir dedektör hakkında ayrıntılı bilgi edinin ve bot eylemlerini belirlemek için birlikte nasıl hareket ettiklerini görün. Bu widget ve sağ üstteki [deny- veya graylisted](setup.md#creating-profiles) IP sayaçları sizi, botun IP’sinin engelleme listesine ne zaman ve hangi süreyle alındığını kontrol edebileceğiniz **IP Lists** [geçmişine](../user-guides/ip-lists/overview.md#ip-list-history) götürür.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

Herhangi bir bot etkinliği tespit edilmediyse, **Legitimate traffic** durumu görüntülenir:

![API abuse prevention statistics - no bots detected](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-nobots.png)

Bot tespitinin trafiğe bağlı olduğunu unutmayın – yeterli trafik yoksa, API Abuse Prevention bunu **Insufficient data to build statistics** mesajıyla bildirir. **Profiles** sekmesinde profil başına trafiği [kontrol edebilirsiniz](setup.md#per-profile-traffic).

## Attacks

Wallarm Console → **Attacks** bölümünde botlar tarafından gerçekleştirilen saldırıları inceleyebilirsiniz. `api_abuse`, `account_takeover`, `scraping` ve `security_crawlers` arama anahtarlarını kullanın veya **Type** filtresinden uygun seçenekleri seçin.

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Bot IP’si API Abuse Prevention tarafından denylist’e alınsa bile, varsayılan olarak, Wallarm ondan kaynaklanan engellenen isteklere ilişkin istatistikleri toplar ve [gösterir](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

**Dedektör değerleri**

Tetiklenen [dedektörler](overview.md#how-api-abuse-prevention-works) listesine ve belirli anomaliler için normal davranıştan sapmanın ne kadar büyük olduğunu gösteren değerlerine dikkat edin. Örneğin yukarıdaki şekilde, normal `< 10` iken değeri `326` olan **Query abuse**, normal `> 1` iken değeri `0.05` olan **Request interval** ve diğerleri gösterilmektedir.

**Isı haritaları**

Bot bilgileri üç ısı haritasında görselleştirilir. Tüm ısı haritalarında, balon ne kadar büyük, rengine göre kırmızıya ve sağ üst köşeye ne kadar yakınsa, bu IP’nin bot olduğuna inanmak için o kadar çok neden vardır.

Isı haritalarında ayrıca mevcut botunuzu (**this bot**) son 24 saat içinde aynı uygulamaya saldıran diğer botlarla karşılaştırabilirsiniz. Çok fazla bot saldırdıysa, yalnızca en şüpheli 30’u görüntülenir.

Isı haritaları:

* **Performance**, mevcut ve diğer tespit edilen botların istek benzersiz olmama durumu, zamanlanmış istekler, RPS ve istek aralığı dahil performansını görselleştirir.
* **Behavior**, mevcut ve diğer tespit edilen botların şüpheli davranış puanını; şüpheli davranış derecelerini, kritik veya hassas uç noktalara yapılan istek sayısını, RPS’lerini ve onları bot olarak tespit eden bot dedektörü sayısını içerecek şekilde görselleştirir.
* **HTTP errors**, hedefledikleri farklı uç nokta sayısı, yaptıkları güvensiz istek sayısı, RPS’leri ve aldıkları hata yanıt kodlarının sayısı dahil bot etkinliklerinin neden olduğu API hatalarını görselleştirir.

<!--Each heatmap includes detailed description of its bubble size, color and position meaning (use **Show more**). You can zoom in heatmap by drawing rectangular around required area.

The **API Abuse Prevention** module compiles client traffic into URL patterns. The URL pattern may have the following segments:

| Segment | Contains | Example |
|---|---|---|
| SENSITIVE | URL parts that provide access to the application's critical functions or resources, such as the admin panel. They should be kept confidential and restricted to authorized personnel to prevent potential security breaches. | `wp-admin` |
| IDENTIFIER | Various identifiers like numeric identifiers, UUIDs, etc. | - |
| STATIC | The folders that contain static files of different kinds. | `images`, `js`, `css` |
| FILE | Static file names. | `image.png` |
| QUERY | Query parameters. | - |
| AUTH | Content related to the authentication/authorization endpoints. | - |
| LANGUAGE | Language-related parts. | `en`, `fr` |
| HEALTHCHECK | Content related to the health check endpoints. | - |
| VARY | The segment is marked as VARY if it is impossible to attribute it to other categories. A variable part of the URL path. | - | -->

## API Sessions ile API kötüye kullanım tespit doğruluğunu doğrulama

--8<-- "../include/bot-attack-full-context.md"