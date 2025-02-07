# API'deki Değişiklikleri İzleme <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API'nizde değişiklikler meydana gelirse, [API Discovery](overview.md) oluşturulmuş API envanterini günceller, değişiklikleri vurgular ve ne zaman neyin değiştiği hakkında size bilgi verir. Ayrıca, tüm ya da bazı değişiklikler için bildirimler ayarlayabilirsiniz.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

Şirketin birkaç ekibi, farklı programlama dilleri ve çeşitli dil framework'leri olabilir. Bu nedenle, API'ye farklı kaynaklardan herhangi bir zamanda değişiklik gelebilir, bu da onları kontrol etmeyi zorlaştırır. Güvenlik yetkilileri için, değişiklikleri en kısa sürede tespit etmek ve analiz etmek önemlidir. Kaçırılırsa, bu tür değişiklikler bazı riskler içerebilir, örneğin:

* Geliştirme ekibi, üçüncü taraf bir kütüphane kullanmaya başlayabilir ve bu kütüphane ayrı bir API'ye sahip olabilir; ancak güvenlik uzmanlarına bildirilmez. Bu şekilde, şirket izlenmeyen ve zafiyetlere karşı kontrol edilmeyen uç noktalar elde eder. Bu uç noktalar potansiyel saldırı alanları olabilir.
* PII verileri uç noktaya gönderilmeye başlanır. Planlanmamış bir PII aktarımı, düzenleyici gereksinimlere uyum ihlali ve itibar risklerine yol açabilir.
* İş mantığı açısından önemli bir uç nokta (örneğin, `/login`, `/order/{order_id}/payment/`) artık çağrılmaz.
* Uç noktaya gönderilmemesi gereken diğer parametreler, örneğin `is_admin` (birisi uç noktaya erişip yönetici haklarıyla işlem yapmaya çalışır) gönderilmeye başlanır.

## API'deki Değişiklikleri Vurgulama

Her seferinde **API Discovery** bölümünü açtığınızda, **Changes since** filtresi `Last week` durumuna geçer; bu da son hafta içinde gerçekleşen değişikliklerin vurgulandığı anlamına gelir. Zaman aralığını değiştirmek için, **Changes since** filtresindeki tarihleri yeniden tanımlayın.

Uç nokta listesinde, aşağıdaki işaretler API'deki değişiklikleri vurgular:

* Dönem içinde listeye eklenen uç noktalar için **New**.
* Dönem içinde yeni keşfedilen parametreleri veya `Unused` durumunu alan parametreleri olan uç noktalar için **Changed**. Uç nokta detaylarında bu tür parametrelerin karşılık gelen bir işareti bulunacaktır.

    * Bir parametre, dönem içinde keşfedilirse `New` durumunu alır.
    * Bir parametre, 7 gün boyunca herhangi bir veri iletilmediği takdirde `Unused` durumunu alır.
    * Daha sonra `Unused` durumundaki parametre tekrar veri iletmeye başlarsa `Unused` durumunu kaybeder.

* Dönem içinde `Unused` durumunu alan uç noktalar için **Unused**.

    * Bir uç nokta, 7 gün boyunca (200 kodlu yanıt ile) talep edilmezse `Unused` durumunu alır.
    * Daha sonra `Unused` durumundaki uç nokta tekrar (200 kodlu yanıt ile) talep edilirse `Unused` durumunu kaybeder.

Seçilen dönem ne olursa olsun, **New**, **Changed** veya **Unused** işareti ile hiçbir şey vurgulanmıyorsa, bu, o dönem için API'de herhangi bir değişiklik olmadığı anlamına gelir.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

Hata olarak işaretlenen uç noktalar için hızlı ipuçları:

* Değişikliğin ne zaman gerçekleştiğini görmek için **New**, **Changed** veya **Unused** etiketlerinin üzerine fare ile gelin.
* Bu durumun nedenini görmek için **Changed** uç nokta detaylarına gidin: **New** parametreler ve **Unused** durumunu alan parametreler - parametre değişikliğinin ne zaman gerçekleştiğini görmek için etiketlerin üzerine fare ile gelin.
* Son 7 gün içinde tüm değişiklik türleri için sayaçlar [API Discovery Dashboard](dashboard.md) sayfasında görüntülenir.

## API'deki Değişiklikleri Filtreleme

**API Discovery** bölümünde, **Changes since** filtresini kullanmak, seçili dönem içinde değişen uç noktaları vurgular, ancak değişiklik olmayan uç noktaları filtrelemez.

**Changes in API** filtresi ise farklı çalışır ve yalnızca seçili dönem içinde değişen uç noktaları gösterir, diğer tüm uç noktaları filtreler.

<a name="example"></a>Örneği ele alalım: Diyelim ki API'nizde bugün 10 uç nokta var (önceden 12 vardı, fakat 10 gün önce 3'ü `Unused` olarak işaretlenmişti). Bu 10 uç noktadan 1'i dün eklenmiş, 2'sinde ise 5 gün önce birinde ve 10 gün önce diğerinde parametre değişiklikleri meydana gelmiş:

* Bugün her seferinde **API Discovery** bölümünü açtığınızda, **Changes since** filtresi `Last week` durumuna geçecektir; sayfada 10 uç nokta görüntülenecektir, **Changes** sütununda 1 tanesinde **New** işareti, 1 tanesinde ise **Changed** işareti olacaktır.
* **Changes since** filtresini `Last 2 weeks` olarak değiştirin - 13 uç nokta görüntülenecektir, **Changes** sütununda 1 tanesinde **New** işareti, 2 tanesinde **Changed** işareti ve 3 tanesinde **Unused** işareti olacaktır.
* **Changes in API** filtresini `Unused endpoints` olarak ayarlayın - 3 uç nokta görüntülenecek, hepsi **Unused** işareti ile gösterilecektir.
* **Changes in API** filtresini `New endpoints + Unused endpoints` olarak değiştirin - 4 uç nokta görüntülenecek, 3'ü **Unused** işaretiyle, 1'i ise **New** işaretiyle gösterilecektir.
* **Changes since** filtresini tekrar `Last week` durumuna getirin - 1 uç nokta görüntülenecek, bu uç nokta **New** işareti ile gösterilecektir.

## Bildirim Almak

API'deki değişiklikler hakkında e-posta veya mesajlaşma aracınıza anında bildirim almak için, **Changes in API** koşuluna sahip [triggers](../user-guides/triggers/triggers.md) yapılandırın.

Yeni, değişen veya kullanılmayan uç noktalar hakkında veya tüm bu değişiklikler hakkında mesajlar alabilirsiniz. Ayrıca, bildirimleri, izlemek istediğiniz uygulama veya ana makine ve sunulan hassas veri türüne göre daraltabilirsiniz.

**Trigger örneği: Slack'de yeni uç noktalar hakkında bildirim**

Bu örnekte, API Discovery modülü tarafından `example.com` API ana makinesi için yeni uç noktalar keşfedilirse, bu bildirim yapılandırılmış Slack kanalınıza gönderilecektir.

![Changes in API trigger](../images/user-guides/triggers/trigger-example-changes-in-api.png)

**Trigger'ı test etmek için:**

1. Wallarm Console → **Integrations** bölümüne gidin ve [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) bulutunda [integration with Slack](../user-guides/settings/integrations/slack.md) yapılandırmasını yapın.
2. **Triggers** bölümünde, yukarıda gösterildiği gibi bir trigger oluşturun.
3. `example.com/users` uç noktasına, `200` (`OK`) yanıtı alana kadar birkaç istek gönderin.
4. **API Discovery** bölümünde, uç noktanızın **New** işareti ile eklendiğini kontrol edin.
5. Slack kanalınızdaki mesajları kontrol edin, örneğin:
    ```
    [wallarm] API'nizde yeni bir uç nokta keşfedildi

    Bildirim türü: api_structure_changed

    API'nizde yeni GET example.com/users uç noktası keşfedildi.

        Client: Client 001
        Cloud: US

        Detaylar:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```