[link-attacks]:                 ../user-guides/events/check-attack.md
[link-incidents]:               ../user-guides/events/check-incident.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# API Sessions'ların Keşfi <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'un [API Sessions](overview.md), uygulamalarınızla ilişkili kullanıcı oturumlarını belirledikten sonra, bunları Wallarm Console'un **API Sessions** bölümünde inceleyebilirsiniz. Bu makaleden keşfedilen verileri nasıl gözden geçireceğinizi öğrenin.

## Tehdit Aktörünün Faaliyetlerinin Tam Bağlamı

--8<-- "../include/request-full-context.md"

## Belirli Zaman Aralığındaki Faaliyetler

Belirtilen zaman aralığında neler olduğunu araştırabilirsiniz. Bunun için tarih/saat filtresini ayarlayın. Yalnızca belirtilen zamanda gerçekleşen isteklere sahip oturumlar görüntülenecektir - her oturum içinde yalnızca bu zaman aralığındaki istekler gösterilecektir.

![!API Sessions - activities within specific time](../images/api-sessions/api-sessions-timeframe.png)

İpucu: kendi tarayıcınızda **[oturumunuza bağlantıyı](#sharing-session-information)** kullanın ve **sonra** yalnızca seçilen oturumdaki, seçilen zaman dilimindeki istekleri görmek için zaman aralığını ayarlayın.

## Oturum İçindeki Belirli Faaliyetler

Oturum, farklı türde (POST, GET, vb.) çok sayıda istek, farklı yanıt kodları, farklı IP adreslerinden gelen yasal ve kötü niyetli, çeşitli saldırı türleri içeren istekler barındırabilir.

Oturum detaylarında, isteklerin farklı kriterlere göre dağılımını gösteren kapsamlı istatistikleri görebilirsiniz. Sadece belirli istekleri görmek için oturum içi filtreleri (bir veya birkaç) uygulayabilirsiniz.

![!API Sessions - filters inside session](../images/api-sessions/api-sessions-inline-filters.png)

Oturum içi filtrelerin, **API Sessions** bölümündeki genel filtrelerle iletişim kurduğunu unutmayın: 

* Genel filtreler uygulandıktan sonra açılan herhangi bir oturum bu filtreleri paylaşacaktır (oturum içerisinde, bunu iptal etmek için **Tüm istekleri göster** seçeneğine tıklayabilirsiniz).
* Mevcut oturumunuzda genel filtreleri uygulamak için **Filtreleri Uygula** düğmesini kullanın.

## Etkilenen Uç Noktaların İncelenmesi

Oturum istek detaylarındaki **API Discovery insights** özelliğini kullanarak etkilenen uç noktaları inceleyin. Uç noktanın risk altında olup olmadığını, bu riskin uç noktanın [rogue](../api-discovery/rogue-api.md) (özellikle, gölge veya zombi API'leri) olarak tanımlanmasından mı kaynaklandığını ve ne ölçüde ve hangi önlemlerle korunduğunu hemen öğrenebilirsiniz.

![!API Sessions - APID endpoint insights](../images/api-sessions/api-sessions-apid-insight.png)

[**API Discovery**](../api-discovery/overview.md) bölümündeki uç nokta bilgilerine geçmek için **API Discovery'da Keşfet** seçeneğine tıklayın.

## Performans Sorunlarının Belirlenmesi

Oturum istek detaylarındaki **Time,ms** ve **Size,bytes** sütunlarını kullanarak sunulan verileri beklenen ortalama değerlerle karşılaştırın. Belirgin şekilde aşılmış değerler, olası performans sorunları ve darboğazlara işaret eder; ayrıca kullanıcı deneyimini optimize etme olasılığını gösterir.

## Hassas İş Akışları

[API Discovery](../api-discovery/overview.md) bölümünde, [hassas iş akışı](../api-discovery/sbf.md) özelliği (NGINX Node 5.2.11 veya native Node 0.10.1 veya daha üstü gerektirir), otomatik ve manuel olarak kimlik doğrulama, hesap yönetimi, faturalandırma ve benzeri kritik işlevler için önemli olan uç noktaların belirlenmesini sağlar.

Eğer oturumlardaki istekler, API Discovery'de belirli hassas iş akışları için önemli olarak etiketlenen uç noktaları etkiliyorsa, bu oturumlar da otomatik olarak bu iş akışını etkileyen oturumlar olarak etiketlenir.

Oturumlar hassas iş akışı etiketleri ile ilişkilendirildikten sonra, belirli bir iş akışına göre filtrelenmeleri mümkün olur; bu da analiz için en önemli oturumların seçilmesini kolaylaştırır.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-no-select.png)

Wallarm, iş akışlarını listeler ve toplam oturum istekleri içindeki ilgili isteklerin sayısını ve yüzdesini gösterir.

Oturumlar aşağıdaki hassas iş akışlarından biriyle ilişkilendirilebilir:

--8<-- "../include/default-sbf.md"

Belirli iş akışlarını etkileyen tüm oturumları hızlıca analiz etmek için **Business flow** filtresini kullanın.

## Kullanıcılar ve Roller Bazında Oturumlar

Eğer API Sessions'ı, kullanıcılar ve roller hakkında bilgi almak üzere [ayarlandıysanız](setup.md#users-and-roles), oturumları kullanıcılar ve rollere göre filtreleyebilirsiniz.

![!API Sessions - user and user role display](../images/api-sessions/api-sessions-user-role-display.png)

## API Kötüye Kullanımı Tespitinin Doğruluğunu Doğrulama

--8<-- "../include/bot-attack-full-context.md"

## Saldırı Tespitinin Ayarlanması

Oturumun kötü niyetli isteği üzerinden doğrudan Wallarm'un saldırı tespitiyle ilgili davranışlarını ayarlayabilirsiniz:

* Saldırı, [yanlış pozitif](../about-wallarm/protecting-against-attacks.md#false-positives) olarak işaretlenebilir - bu durumda filtreleme düğümü, gelecekte bu tür istekleri saldırı olarak tanımayacaktır.
* [Kural](../user-guides/rules/rules.md) oluşturulabilir - aktif hale geldiğinde, kural isteklerin analizinde ve sonraki işleminde Wallarm'un varsayılan davranışını değiştirecektir.

![!API Sessions - request details - available actions](../images/api-sessions/api-sessions-request-details-actions.png)

## Oturum Bilgilerinin Paylaşılması

Oturumda şüpheli bir davranış fark ettiyseniz ve elde ettiğiniz bilgileri meslektaşlarınızla paylaşmak ya da oturumu daha fazla analiz için saklamak istiyorsanız, oturum detaylarındaki **Bağlantıyı Kopyala** veya **CSV İndir** seçeneklerini kullanın.

![!API Sessions - sharing session information](../images/api-sessions/api-sessions-share.png)