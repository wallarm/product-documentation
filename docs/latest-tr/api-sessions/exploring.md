[link-attacks]:                 ../user-guides/events/check-attack.md
[link-incidents]:               ../user-guides/events/check-incident.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# API Sessions'ı Keşfetme <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın [API Sessions](overview.md) özelliği uygulamalarınızla ilgili kullanıcı oturumlarını belirler belirlemez, bunları Wallarm Console içindeki **API Sessions** bölümünde inceleyebilirsiniz. Bu makaleden keşfedilen verilerde nasıl gezineceğinizi öğrenin.

## Tehdit aktörü faaliyetlerinin tam bağlamı

--8<-- "../include/request-full-context.md"

## Belirli bir zaman aralığındaki faaliyetler

Belirttiğiniz zaman aralığında neler olduğunu araştırabilirsiniz. Bunu yapmak için tarih/saat filtresini ayarlayın. Yalnızca belirtilen zamanda gerçekleşen istekleri içeren oturumlar görüntülenecek — her oturum içinde de yalnızca bu zaman aralığındaki istekler gösterilecektir.

![!API Sessions - belirli zaman aralığındaki faaliyetler](../images/api-sessions/api-sessions-timeframe.png)

İpucu: Kendi tarayıcınızda [oturumunuza bağlantıyı](#sharing-session-information) kullanın ve **ardından** yalnızca seçili oturumdan, seçili zamana ait istekleri görmek için zaman aralığını ayarlayın.

## Oturum içindeki belirli faaliyetler

Oturum; farklı türlerde (POST, GET vb.) birçok istek, farklı yanıt kodları, farklı IP’ler ve farklı saldırı türlerine sahip meşru ve kötü amaçlı istekler içerebilir.

Oturum ayrıntılarında, isteklerin farklı ölçütlere göre dağılımını gösteren kapsamlı istatistikleri görebilirsiniz. Yalnızca belirli istekleri görmek için oturum içi filtreler (bir veya birkaç) uygulayabilirsiniz.

![!API Sessions - oturum içindeki filtreler](../images/api-sessions/api-sessions-inline-filters.png)

Oturum içi filtrelerin **API Sessions** bölümünün genel filtreleriyle etkileşimde bulunduğunu unutmayın:

* Genel filtreler uygulandıktan sonra açılan herhangi bir oturum bu filtreleri devralır (oturum içinde bunu iptal etmek için **Show all requests**’e tıklayabilirsiniz).
* Mevcut oturumunuz içinde genel filtreleri uygulamak için **Apply filters** düğmesini kullanın.

## Etkilenen uç noktaları inceleme

Etkilenen uç noktaları incelemek için oturum istek ayrıntılarındaki **API Discovery insights**’ı kullanın. Uç noktanın risk altında olup olmadığına, bu riskin uç noktanın [rogue](../api-discovery/rogue-api.md) (özellikle, shadow veya zombie API’ler) olması nedeniyle ortaya çıkıp çıkmadığına ve ne ölçüde ve hangi önlemlerle korunduğuna dair bilgileri anında edinebilirsiniz.

![!API Sessions - APID uç nokta içgörüleri](../images/api-sessions/api-sessions-apid-insight.png)

[**API Discovery**](../api-discovery/overview.md) bölümündeki uç nokta bilgisine geçmek için **Explore in API Discovery**’e tıklayın.

## Performans sorunlarını tanımlama

Oturum istek ayrıntılarında sunulan verileri beklenen ortalama değerlerle karşılaştırmak için **Time,ms** ve **Size,bytes** sütunlarını kullanın. Bekleneni önemli ölçüde aşan değerler olası performans sorunları ve darboğazlara ve kullanıcı deneyimini iyileştirme fırsatlarına işaret eder.

## Hassas iş akışları

[API Discovery](../api-discovery/overview.md) içinde, [hassas iş akışı](../api-discovery/sbf.md) özelliği (NGINX Node 5.2.11 veya native Node 0.10.1 ya da üstü gerektirir), kimlik doğrulama, hesap yönetimi, faturalandırma ve benzeri kritik işlevler gibi belirli iş akışları ve işlevler için kritik olan uç noktaların otomatik ve manuel olarak belirlenmesini sağlar.

Oturumların istekleri, API Discovery’de bazı hassas iş akışları için önemli olarak etiketlenmiş uç noktaları etkiliyorsa, bu oturumlar da otomatik olarak ilgili iş akışını etkiliyor olarak etiketlenir.

Oturumlara hassas iş akışı etiketleri atandığında, bunları belirli bir iş akışına göre filtrelemek mümkün olur; bu da analiz edilmesi en önemli oturumları seçmeyi kolaylaştırır.

![!API Sessions - hassas iş akışları](../images/api-sessions/api-sessions-sbf-no-select.png)

Wallarm, iş akışlarını listeler ve oturumdaki toplam istek sayısından o akışla ilgili isteklerin sayısını ve yüzdesini görüntüler.

Oturumlar aşağıdaki hassas iş akışlarından biriyle ilişkilendirilebilir:

--8<-- "../include/default-sbf.md"

Belirli akışları etkileyen tüm oturumları hızlıca analiz etmek için **Business flow** filtresini kullanın.

## Kullanıcılar ve roller bazında oturumlar

API Sessions’ı kullanıcılar ve rollerine ilişkin bilgileri elde edecek şekilde [yapılandırdıysanız](setup.md#users-and-roles), oturumları kullanıcılar ve rollere göre filtreleyebilirsiniz.

![!API Sessions - kullanıcı ve kullanıcı rolü gösterimi](../images/api-sessions/api-sessions-user-role-display.png)

## API kötüye kullanım tespiti doğruluğunu doğrulama

--8<-- "../include/bot-attack-full-context.md"

## Saldırı tespitini ayarlama

Wallarm’ın saldırı tespitine ilişkin davranışını doğrudan oturumun kötü amaçlı isteğinden ayarlayabilirsiniz:

* Saldırı [yanlış pozitif](../about-wallarm/protecting-against-attacks.md#false-positives) olarak işaretlenebilir — filtreleme düğümü gelecekte bu tür istekleri saldırı olarak tanımaz.
* Bir [kural](../user-guides/rules/rules.md) oluşturulabilir — etkinleştirildiğinde, kural isteklerin analizinde ve sonraki işlemlerinde varsayılan Wallarm davranışını değiştirir.

![!API Sessions - istek ayrıntıları - kullanılabilir eylemler](../images/api-sessions/api-sessions-request-details-actions.png)

## Oturum bilgilerini paylaşma

Oturumda şüpheli davranış bulduysanız ve içgörüleri meslektaşlarınızla paylaşmak ve oturumu daha sonra analiz etmek üzere saklamak istiyorsanız, oturum ayrıntılarında **Copy link** veya **Download CSV** öğesini kullanın.

![!API Sessions - oturum bilgilerini paylaşma](../images/api-sessions/api-sessions-share.png)