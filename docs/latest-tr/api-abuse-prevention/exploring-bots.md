[link-attacks]:                 ../user-guides/events/check-attack.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# Bot Aktivitesini Keşfetmek <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Abuse Prevention](../api-abuse-prevention/overview.md), ML algoritmalarına dayalı olarak kötü niyetli bot aktivitesini tespit eder. Bu tür saldırıları tek bir engellenmiş istek üzerinden analiz etmek imkansızdır. Bu nedenle, Wallarm platformunun bot aktivitesini farklı açılardan incelemek için geniş bir araç yelpazesi sunması esastır.

## API İstismarı Gösterge Panelleri

API Abuse Prevention, son 30 gündeki bot aktivitelerine ilişkin verileri **API Abuse Prevention** bölümü → **İstatistikler** sekmesinde pratik bir şekilde görselleştirir. Zaman çizelgesi diyagramı kullanarak bot aktivitesindeki ani artışları kolayca tespit edebilirsiniz. Ek olarak bulunan **En İyi Saldırganlar** ve **En Çok Hedef Alınanlar** widget'ları, en aktif botları ve en fazla saldırıya uğrayan API'leri ve uygulamaları belirlemenizi sağlar. Bu bot aktivitelerini, gösterge paneli öğesine tek tıklayarak **Saldırılar** sekmesinde detaylandırabilirsiniz.

Ayrıca, alttaki **Davranış Kalıpları** bölümünde bot davranışlarını analiz edebilirsiniz. Her bir dedektör hakkında ayrıntılı bilgi edinin ve bot eylemlerini belirlemek için nasıl birlikte hareket ettiklerini görün. Bu widget ile en sağ üstteki [deny- veya graylisted](setup.md#creating-profiles) IP sayacı, sizi bot IP'sinin ne zaman ve ne kadar süreyle engellenme listesine alındığını kontrol edebileceğiniz **IP Listeleri** [geçmişine](../user-guides/ip-lists/overview.md#ip-list-history) yönlendirecektir.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

Eğer herhangi bir bot aktivitesi tespit edilmediyse, **Geçerli trafik** durumu görüntülenir:

![API abuse prevention statistics - no bots detected](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-nobots.png)

Unutmayın, bot tespiti trafiğe bağlıdır - yeterli trafik yoksa, API Abuse Prevention bunu **İstatistik oluşturmak için yetersiz veri** mesajı ile bildirir. Her profilin trafiğini **Profiller** sekmesinde [kontrol edebilirsiniz](setup.md#per-profile-traffic).

## Saldırılar

Wallarm Console içindeki → **Saldırılar** bölümünde botlar tarafından gerçekleştirilen saldırıları inceleyebilirsiniz. `api_abuse`, `account_takeover`, `scraping` ve `security_crawlers` arama anahtarlarını kullanın veya **Tür** filtresinden uygun seçenekleri seçin.

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Not: Bot IP'si API Abuse Prevention tarafından deny listesine alınsa bile, Wallarm varsayılan olarak bu IP'den kaynaklanan engellenmiş isteklerle ilgili istatistikleri toplar ve [görüntüler](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

**Dedektör Değerleri**

Tetiklenen [dedektörlerin](overview.md#how-api-abuse-prevention-works) listesini ve belirli anormallikler için normal davranıştan ne kadar sapma olduğunu gösteren değerlerini inceleyin. Yukarıdaki şekilde, örneğin, normal değeri `< 10` iken değeri `326` olan **Query abuse**, normal değeri `> 1` iken değeri `0.05` olan **Request interval** ve diğerleri bulunmaktadır.

**Isı Haritaları**

Bot bilgileri üç adet ısı haritasında görselleştirilir. Tüm ısı haritalarında, balon ne kadar büyükse, kırmızı renge ve sağ üst köşeye o kadar yakın demektir - bu IP'nin bir bot olarak değerlendirilmesi için o kadar fazla sebep vardır.

Isı haritalarında ayrıca mevcut botunuzu (**this bot**) son 24 saat içinde aynı uygulamaya saldıran diğer botlarla karşılaştırabilirsiniz. Çok fazla bot böyle yaptığı takdirde, yalnızca en şüpheli 30 tanesi görüntülenecektir.

Isı haritaları:

* **Performance**: Mevcut ve diğer tespit edilen botların performansını, isteklerin benzersiz olmaması, planlanmış istekler, RPS ve istek aralığı gibi metrikler açısından görselleştirir.
* **Behavior**: Mevcut ve diğer tespit edilen botların şüpheli davranış skorunu; şüpheli davranış derecesi, kritik veya hassas uç noktalara yapılan istek sayısı, RPS ve bot olarak tespit eden dedektör sayısı açısından görselleştirir.
* **HTTP errors**: Bot aktivitelerinden kaynaklanan API hatalarını, hedef aldıkları farklı uç nokta sayısı, gerçekleştirdikleri güvensiz istek sayısı, RPS ve aldıkları hata yanıt kodu sayısı gibi metrikler ışığında görselleştirir.

<!--Her ısı haritası, balon boyutu, rengi ve konumunun anlamı hakkında ayrıntılı açıklama içerir (daha fazlasını görmek için **Show more** kullanın). Gereken alan etrafında dikdörtgen çizerek ısı haritasına yakınlaştırabilirsiniz.

**API Abuse Prevention** modülü, istemci trafiğini URL desenlerine derler. URL deseni aşağıdaki segmentlere sahip olabilir:

| Segment | İçerir | Örnek |
|---|---|---|
| SENSITIVE | Uygulamanın kritik işlevlerine veya kaynaklarına, örneğin yönetici paneline erişim sağlayan URL parçaları. Olası güvenlik ihlallerini önlemek için gizli tutulmalı ve yetkili kişilerle sınırlandırılmalıdır. | `wp-admin` |
| IDENTIFIER | Sayısal tanımlayıcılar, UUID'ler vb. çeşitli tanımlayıcılar. | - |
| STATIC | Farklı türde statik dosyaları içeren klasörler. | `images`, `js`, `css` |
| FILE | Statik dosya adları. | `image.png` |
| QUERY | Sorgu parametreleri. | - |
| AUTH | Kimlik doğrulama/izin endpoint'leri ile ilgili içerik. | - |
| LANGUAGE | Dil ile ilgili parçalar. | `en`, `fr` |
| HEALTHCHECK | Sağlık kontrolü endpoint'leri ile ilgili içerik. | - |
| VARY | Diğer kategorilere atanamayan kısım. URL yolunun değişken kısmı. | - | -->

## API istismarı tespit doğruluğunu API Sessions ile doğrulama

--8<-- "../include/bot-attack-full-context.md"