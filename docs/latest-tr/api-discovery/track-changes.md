# API'deki değişiklikleri izleme <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API'nizde değişiklikler meydana geldiğinde, [API Discovery](overview.md) oluşturulmuş API envanterini günceller, değişiklikleri vurgular ve neyin, ne zaman değiştiğine dair bilgi sağlar. Ayrıca, tüm değişiklikler veya bir kısmı için bildirimler ayarlayabilirsiniz.

![API Discovery - değişiklikleri izleme](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

Bir şirkette birden çok ekip, farklı programlama dilleri ve çeşitli dil framework'leri olabilir. Dolayısıyla değişiklikler farklı kaynaklardan herhangi bir zamanda API'ye gelebilir ve bu da kontrolü zorlaştırır. Güvenlik sorumluları için değişiklikleri en kısa sürede tespit etmek ve analiz etmek önemlidir. Kaçırılması durumunda şu riskleri barındırabilir:

* Geliştirme ekibi ayrı bir API'ye sahip üçüncü taraf bir kütüphaneyi kullanmaya başlayabilir ve bunu güvenlik uzmanlarına bildirmeyebilir. Bu şekilde şirket, izlenmeyen ve güvenlik açıkları açısından kontrol edilmeyen endpoint'lere sahip olur. Bunlar potansiyel saldırı yönleri olabilir.
* PII verileri endpoint'e aktarılmaya başlanır. Planlanmamış PII aktarımı, düzenleyicilerin gerekliliklerine uyumun ihlaline ve itibar risklerine yol açabilir.
* İş mantığı için önemli olan endpoint (örneğin, `/login`, `/order/{order_id}/payment/`) artık çağrılmıyor.
* `is_admin` gibi aktarılmaması gereken diğer parametreler (biri endpoint'e erişiyor ve bunu yönetici haklarıyla yapmaya çalışıyor) endpoint'e aktarılmaya başlanır.

## API'deki değişikliklerin vurgulanması

Her API Discovery bölümünü açtığınızda, **Changes since** filtresi `Last week` durumuna gelir; bu da son bir hafta içinde gerçekleşen değişikliklerin vurgulandığı anlamına gelir. Zaman aralığını değiştirmek için tarihleri **Changes since** filtresinde yeniden tanımlayın.

Endpoint listesinde, aşağıdaki işaretler API'deki değişiklikleri vurgular:

* Dönem içinde listeye eklenen endpoint'ler için **New**.
* Dönem içinde yeni keşfedilen parametrelere sahip endpoint'ler veya bu dönem içinde `Unused` durumunu almış parametrelere sahip endpoint'ler için **Changed**. Endpoint ayrıntılarında bu parametrelerin karşılık gelen işareti olacaktır.

    * Bir parametre dönem içinde keşfedilirse `New` durumunu alır.
    * Bir parametre 7 gün boyunca herhangi bir veri iletmezse `Unused` durumunu alır.
    * Daha sonra `Unused` durumundaki parametre yeniden veri iletmeye başlarsa `Unused` durumunu kaybeder.

* Dönem içinde `Unused` durumunu alan endpoint'ler için **Unused**.

    * Bir endpoint 7 gün boyunca istenmezse (yanıtta 200 kodu ile) `Unused` durumunu alır.
    * Daha sonra `Unused` durumundaki endpoint yeniden istenirse (yanıtta 200 kodu ile) `Unused` durumunu kaybeder.

Hangi dönem seçilirse seçilsin, hiçbir öğe **New**, **Changed** veya **Unused** işaretiyle vurgulanmıyorsa, bu, o dönem için API'de değişiklik olmadığı anlamına gelir.

![API Discovery - değişiklikleri izleme](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

Rogue olarak işaretlenen endpoint'ler için hızlı ipuçları:

* Değişikliğin ne zaman gerçekleştiğini görmek için **New**, **Changed** veya **Unused** etiketlerinin üzerine fareyle gelin
* Bu durumun nedenini görmek için **Changed** endpoint ayrıntılarına gidin: **New** parametreler ve **Unused** durumuna geçen parametreler — parametre değişikliğinin ne zaman olduğunu görmek için etiketlerin üzerine fareyle gelin
* Son 7 güne ait tüm değişiklik türlerinin sayaçları [API Discovery Dashboard](dashboard.md) üzerinde görüntülenir.

## API'deki değişiklikleri filtreleme

**API Discovery** bölümünde, **Changes since** filtresini kullanmak, yalnızca seçilen dönem içinde değiştirilen endpoint'leri vurgular ancak değişiklik olmayan endpoint'leri filtrelemez.

**Changes in API** filtresi farklı çalışır ve seçilen dönem içinde değiştirilen endpoint'leri **yalnızca** gösterir, diğerlerinin tümünü filtreler.

<a name="example"></a>Örneği ele alalım: Diyelim ki API'nizde bugün 10 endpoint var (daha önce 12 vardı, ancak bunlardan 3'ü 10 gün önce Unused olarak işaretlendi). Bu 10'dan 1'i dün eklendi; 2'sinin parametrelerinde değişiklik var: biri 5 gün önce, diğeri 10 gün önce:

* Bugün **API Discovery** bölümünü her açtığınızda **Changes since** filtresi `Last week` durumunda olacaktır; sayfada 10 endpoint görüntülenecek, **Changes** sütununda bunlardan 1'i **New**, 1'i ise **Changed** işaretine sahip olacaktır.
* **Changes since** değerini `Last 2 weeks` olarak değiştirin - 13 endpoint görüntülenecek, **Changes** sütununda bunlardan 1'i **New**, 2'si **Changed** ve 3'ü **Unused** işaretine sahip olacaktır.
* **Changes in API** değerini `Unused endpoints` olarak ayarlayın - 3 endpoint görüntülenecek, hepsi **Unused** işaretine sahip olacaktır.
* **Changes in API** değerini `New endpoints + Unused endpoints` olarak değiştirin - 4 endpoint görüntülenecek, 3'ü **Unused**, 1'i **New** işaretine sahip olacaktır.
* **Changes since** değerini tekrar `Last week` olarak değiştirin - 1 endpoint görüntülenecek ve **New** işaretine sahip olacaktır.

## Bildirim alma

API'nizdeki değişiklikler hakkında anında mesajlaşma aracınıza, SIEM'inize veya günlük yönetim sisteminize bildirimler almak için **Changes in API** koşuluyla [triggers](../user-guides/triggers/triggers.md) yapılandırın.

Yeni, değişmiş veya kullanılmayan endpoint'ler ya da bunların tümü hakkında mesajlar alabilirsiniz. Ayrıca izlemek istediğiniz uygulama veya host'a ve sunulan hassas veri türüne göre bildirimleri daraltabilirsiniz.

**Tetikleyici örneği: Slack'te yeni endpoint'lerle ilgili bildirim**

Bu örnekte, `example.com` API host'u için yeni endpoint'ler API Discovery modülü tarafından keşfedilirse, bununla ilgili bildirim yapılandırdığınız Slack kanalınıza gönderilecektir.

![Changes in API tetikleyicisi](../images/user-guides/triggers/trigger-example-changes-in-api.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Integrations** bölümüne [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud'unda gidin ve [Slack ile entegrasyon](../user-guides/settings/integrations/slack.md) yapılandırın.
1. **Triggers** bölümünde, yukarıda gösterildiği gibi bir tetikleyici oluşturun.
1. `200` (`OK`) yanıtını almak için `example.com/users` endpoint'ine birkaç istek gönderin.
1. **API Discovery** bölümünde, endpoint'inizin **New** işaretiyle eklendiğini kontrol edin.
1. Slack kanalınızdaki aşağıdakine benzer mesajları kontrol edin:
    ```
    [wallarm] API'nizde yeni bir endpoint keşfedildi

    Bildirim türü: api_structure_changed

    API'nizde yeni GET example.com/users endpoint'i keşfedildi.

        Client: Client 001
        Cloud: US

        Details:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```