# Tetikleyici örnekleri

[Wallarm tetikleyicileri](triggers.md) hakkında gerçek örnekler öğrenin, bu özelliği daha iyi anlayın ve tetikleyicileri uygun şekilde yapılandırın.

## 1 saat içinde 4 veya daha fazla kötü niyetli yük algılanırsa IP'yi gri listeye al

Bir IP adresinden korunan kaynağa 4 veya daha fazla farklı kötü niyetli yük gönderilirse, bu IP adresi bir Wallarm hesabındaki tüm uygulamalar için 1 saat boyunca gri listeye alınır.

Wallarm hesabınızı yakın zamanda oluşturduysanız, bu [tetikleyici zaten oluşturulmuş ve etkinleştirilmiştir](triggers.md#pre-configured-triggers-default-triggers). Bu tetikleyiciyi ve elle oluşturulan diğer tetikleyicileri düzenleyebilir, devre dışı bırakabilir, silebilir veya kopyalayabilirsiniz.

![Gri listeye alma tetikleyicisi](../../images/user-guides/triggers/trigger-example-graylist.png)

**Tetikleyiciyi test etmek için:**

1. Aşağıdaki istekleri korunan kaynağa gönderin:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    Bu, [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) türlerinden 4 kötü niyetli yüktür.
1. Wallarm Console'u belirleyin → **IP listeleri** → **Gri liste** ve isteklerin kaynaklandığı IP adresinin 1 saat boyunca gri listeye alındığını kontrol edin.
1. **Etkinlikler** bölümünü açın ve saldırıların listeyi görüntülediğini kontrol edin:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Saldırıları aramak için filtreleri kullanabilirsiniz, örneğin: `sqli` [SQLi](../../attacks-vulns-list.md#sql-injection) saldırıları için, `xss` [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) saldırıları için, `ptrav` [Path Traversal](../../attacks-vulns-list.md#path-traversal) saldırıları için. Tüm filtreler, [aramayı kullanma talimatlarında](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

Tetikleyici, herhangi bir düğüm filtreleme modunda çalışır, böylece düğüm modundan bağımsız olarak IP'leri gri listeye alır. Ancak, düğüm gri listeyi yalnızca **güvenli engelleme** modunda analiz eder. Gri listeye alınan IP'lerden gelen kötü niyetli istekleri engellemek için düğüm [modu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)'nı güvenli engelleme moduna geçirin ve öncelikle özelliklerini öğrenin.

## 1 saat içinde 4 veya daha fazla kötü niyetli yük algılandığında IP'yi reddetme listesine ekle

Bir IP adresinden korunan kaynağa 4 veya daha fazla farklı [kötü niyetli yük](../../glossary-en.md#malicious-payload) gönderilirse, bu IP adresi bir Wallarm hesabındaki tüm uygulamalar için 1 saat boyunca reddetme listesine alınır.

![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

**Tetikleyiciyi test etmek için:**

1. Aşağıdaki istekleri korunan kaynağa gönderin:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    Bu, [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) türlerinden 4 kötü niyetli yüktür.
2. Wallarm Console'u belirleyin → **IP listeleri** → **Reddetme listesi** ve isteklerin kaynaklandığı IP adresinin 1 saat boyunca engellendiğini kontrol edin.
1. **Etkinlikler** bölümünü açın ve saldırıların listeyi görüntüleyip görüntülemediğini kontrol edin:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Saldırıları aramak için filtreleri kullanabilirsiniz, örneğin: `sqli` [SQLi](../../attacks-vulns-list.md#sql-injection) saldırıları için, `xss` [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) saldırıları için, `ptrav` [Path Traversal](../../attacks-vulns-list.md#path-traversal) saldırıları için. Tüm filtreler, [aramayı kullanma talimatlarında](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

Bu tetikleyici tarafından reddetme listesine alınan bir IP adresi varsa, filtreleme düğümü bu IP'den gelen tüm kötü niyetli ve meşru istekleri engeller. Meşru isteklere izin vermek için, [gri listeleme tetikleyicisi](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)'ni yapılandırabilirsiniz.

## Korunan kaynağa 31 veya daha fazla istek gönderilirse istekleri kaba kuvvet saldırısı olarak işaretle

İsteklerin düzenli bir kaba kuvvet saldırısı olarak işaretlenmesi için, **Kaba Kuvvet** durumu olan bir tetikleyici yapılandırılmalıdır.

Eğer 30 saniye içinde `https://example.com/api/v1/login` adresine 31 veya daha fazla istek gönderilirse, bu istekler bir [kaba kuvvet saldırısı](../../attacks-vulns-list.md#brute-force-attack) olarak işaretlenir ve isteklerin kaynaklandığı IP adresi reddetme listesine eklenir.

![Kaba kuvvet tetikleyicisi with counter](../../images/user-guides/triggers/trigger-example6.png)

[Kaba kuvvet korumasının ve tetikleyici testinin ayrıntıları →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## 404 kodu 31 veya daha fazla isteğe geri döndürülürse istekleri zorla gezinme saldırısı olarak işaretle

Bir zorla gezinme saldırısı olarak işaretlenmesi için, **Zorla Gezinme** durumu olan bir tetikleyici yapılandırılmalıdır.

Eğer `https://example.com/**.**` uç noktası 30 saniye içinde 404 yanıt kodunu 31 veya daha fazla kez gönderirse, ilgili istekler bir [zorla gezinme saldırısı](../../attacks-vulns-list.md#forced-browsing) olarak işaretlenir ve bu isteklerin kaynak IP adresi engellenir.

URI değerine uyan uç noktası örnekleri `https://example.com/config.json`, `https://example.com/password.txt`'dir.

![Zorla Gezinme tetikleyicisi](../../images/user-guides/triggers/trigger-example5.png)

[Kaba kuvvet korumasının ve tetikleyici testinin ayrıntıları →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## BOLA saldırısı olarak istekleri işaretle

Eğer `https://example.com/shops/{shop_id}/financial_info` adresine 30 saniye içinde 31 veya daha fazla istek gönderilirse, bu istekler [BOLA saldırısı](../../attacks-vulns-list.md#broken-object-level-authorization-bola) olarak işaretlenir ve isteklerin kaynaklandığı IP adresi reddetme listesine eklenir.

![BOLA tetikleyicisi](../../images/user-guides/triggers/trigger-example7.png)

[BOLA korumasının ve tetikleyici testinin ayrıntıları →](../../admin-en/configuration-guides/protecting-against-bola.md)

## Zayıf JWT'leri algıla

Node 4.4 veya üstü tarafından işlenen gelen isteklerin önemli bir kısmı zayıf JWT'leri içeriyorsa, ilgili [güvenlik açığını](../vulnerabilities.md) kaydedin.

Zayıf JWT'ler:

* Şifrelenmemiş - imzalama algoritması yoktur ( `alg` alanı `hiçbiri` veya yoktur).
* Kompromize edilmiş gizli anahtarlar kullanılarak imzalanmış

Eğer Wallarm hesabınızı yeni oluşturduysanız, bu [tetikleyici zaten oluşturulmuş ve etkin durumdadır](triggers.md#pre-configured-triggers-default-triggers). Bu tetikleyiciyi ve elle oluşturulan diğer tetikleyicileri düzenleyebilir, devre dışı bırakabilir, silebilir veya kopyalayabilirsiniz.

![Zayıf JWT'ler için tetikleyici örneği](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**Tetikleyiciyi test etmek için:**

1. Kötü amaçlı olarak bir seçilmiş [gizli anahtar](https://github.com/wallarm/jwt-secrets) kullanılarak bir JWT oluşturun, örneğin:

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. Kötü amaçlı olarak bir seçilmiş JWT kullanarak kimlik doğrulamalı bir şekilde bazı trafiği oluşturun.
1. Node 4.4 veya üstü tarafından işlenen gelen isteklerin önemli bir kısmı zayıf JWT'leri içeriyorsa, Wallarm güvenlik açığını kaydeder, örneğin:

    ![JWT vuln example](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)

## Bir saniye içinde 2 veya daha fazla olay algılanırsa Opsgenie'ye bildirim gönder

Bir uygulama sunucusu veya veritabanı ile ilgili 2 veya daha fazla olay bir saniye içinde algılanırsa, bu etkinlik hakkındaki bildirim Opsgenie'ye gönderilecektir.

![Opsgenie'ye veri gönderme tetikleyicisi örneği](../../images/user-guides/triggers/trigger-example3.png)

**Tetikleyiciyi test etmek** için, korunan kaynağa bir aktif güvenlik açığından faydalanmayı deneyen bir saldırı gönderilmesi gerekmektedir. Wallarm Console → **Güvenlik açıklıkları** bölümü, uygulamalarınızda algılanan aktif güvenlik açıklıklarını ve bu güvenlik açıklıklarını istismar eden saldırı örneklerini gösterir.

Eğer saldırı örneği korunan kaynağa gönderilirse, Wallarm olayı kaydeder. İki veya daha fazla kaydedilmiş olay, aşağıdaki bildirimin Opsgenie'ye gönderilmesini tetikler:

```
[Wallarm] Tetikleyici: Olay sayısı eşiği aştı

Bildirim türü: incidents_exceeded

Algılanan olayların sayısı 1 saniye içinde 1'i aştı.
Bu bildirim "Olaylar hakkında bildirim" tetikleyicisi tarafından tetiklendi.

Ek tetikleyici maddeleri:
Hedef: sunucu, veritabanı.

Etkinlikleri görüntüleme:
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Müşteri: TestCompany
Bulut: EU
```

* `Olaylar hakkında bildirim` tetikleyici adıdır
* `TestCompany` Wallarm Console'daki şirket hesabınızın adıdır
* `EU` şirket hesabınızın kayıtlı olduğu Wallarm Bulutudur

!!! info "Aktif güvenlik açığı istismarından kaynağı koruma"
    Kaynağı aktif güvenlik açığı istismarından korumak için, güvenlik açığını zamanında yamanızı öneririz. Eğer güvenlik açığı uygulama tarafında yamanamazsa, lütfen bu güvenlik açığından faydalanmayı deneyen saldırıları engellemek için bir [sanal yama](../rules/vpatch-rule.md) yapılandırın.

## IP adresi reddetme listesine eklendiğinde Webhook URL'ye bildirim gönder

Bir IP adresi reddetme listesine eklendiğinde, bu olay hakkındaki web kancası Webhook URL'sine gönderilir.

![Reddetme listesine alınmış IP için tetikleyici örneği](../../images/user-guides/triggers/trigger-example4.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **IP listeleri** → **Reddetme Listesi**'ni açın ve IP adresini reddetme listesine ekleyin. Örneğin:

    ![IP'yi reddetme listesine ekleme](../../images/user-guides/triggers/test-ip-blocking.png)
2. Aşağıdaki web kancasının Webhook URL'ye gönderildiğini kontrol edin:

    ```
    [
        {
            "summary": "[Wallarm] Tetikleyici: Yeni IP adresi reddetme listesine eklendi",
            "description": "Bildirim türü: ip_blocked\n\nIP adresi 1.1.1.1 çok sayıda saldırı üretiyor sebebiyle 2021-06-10 02:27:15 +0300'a kadar reddetme listesine eklendi. Reddetme listesindeki engellenen IP adreslerini Wallarm Console'un \"Reddetme Listesi\" bölümünde gözden geçirebilirsiniz.\nBu bildirim, \"Reddetme Listesine Eklenmiş IP Hakkında Bildirim\" tetikleyicisi tarafından tetiklendi. IP, Uygulama #8 için engellendi.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Reddetme Listesine Eklenmiş IP Hakkında Bildirim",
            "application": "Uygulama #8",
            "reason": "Çok sayıda saldırı üretiyor",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Reddetme Listesine Eklenmiş IP Hakkında Bildirim`, tetikleyici adıdır
    * `TestCompany`, Wallarm Console'daki şirket hesabınızın adıdır
    * `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Bulutudur

## Aynı IP'den gelen vuruşları tek bir saldırıda grupla

Aynı IP adresinden gelen 50'den fazla [vuruş](../../about-wallarm/protecting-against-attacks.md#hit) algılanırsa, bu IP'den gelen sonraki vuruşlar [etkinlik listesinde](../events/check-attack.md) tek bir saldırıya gruplanır.

Eğer Wallarm hesabınızı yeni oluşturduysanız, bu [tetikleyici zaten oluşturulmuş ve etkin durumdadır](triggers.md#pre-configured-triggers-default-triggers). Bu tetikleyiciyi ve elle oluşturulan diğer tetikleyicileri düzenleyebilir, devre dışı bırakabilir, silebilir veya kopyalayabilirsiniz.

![Vuruşları gruplama için tetikleyici örneği](../../images/user-guides/triggers/trigger-example-group-hits.png)

**Tetikleyiciyi test etmek için**, 51 veya daha fazla vuruş gönderin:

* Tüm vuruşlar 15 dakika içinde gönderilmiştir
* Vuruş kaynaklarının IP adresleri aynıdır
* Vuruşlar farklı saldırı türlerine veya kötü niyetli yüklerle parametrelere veya gönderildikleri adreslere sahip olan vuruşlara sahiptir (yani vuruşlar temel yöntemle bir saldırıya [gruplanmaz](../../about-wallarm/protecting-against-attacks.md#attack))
* Saldırı türleri Kaba Kuvvet, Zorla Gezinme, Kaynak Üst Sınırı, Veri Bombası ve Sanal Tamirden farklıdır

Örnek:

* `example.com`'a 10 vuruş
* `test.com`'a 20 vuruş
* `example-domain.com`'a 40 vuruş

İlk 50 vuruş, etkinlik listesinde ayrı vuruşlar olarak gözükür. Sonraki tüm vuruşlar tek bir saldırıya gruplanır, örneğin:

![IP'ye göre bir saldırıya gruplanmış vuruşlar](../../images/user-guides/events/attack-from-grouped-hits.png)

Saldırı için [**Yanıltıcı pozitif olarak işaretle**](../events/false-attack.md#mark-an-attack-as-a-false-positive) düğmesi ve [aktif doğrulama](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) seçeneği kullanılamaz.

## API envanterinizde yeni uç noktalar

API'nizde değişiklikler olabilir. Bunlar [**API Discovery**](../../about-wallarm/api-discovery.md) modülü tarafından keşfedilecekler. Olası [değişiklikler](../../user-guides/api-discovery.md#tracking-changes-in-api) şunları içerir:

* Yeni bir uç nokta keşfedildi
* Bir uç noktasında değişiklikler var (yeni veya silinen parametreler)
* Bir uç nokta kullanılmıyor olarak işaretlendi

Bunun gibi değişikliklerin bazı ya da tamamı hakkında epostanıza veya messengerınıza bilgilendirme almak için, **API'deki Değişiklikler** durumu olan tetikleyicinin yapılandırılmalıdır.

Bu örnekte, eğer API Discovery modülü tarafından `example.com` API hostu için yeni uç noktalar keşfedilirse, bu hakkındaki bildirim yapılandırılmış Slack kanalınıza gönderilecektir.

![API değişiklikleri tetikleyicisi](../../images/user-guides/triggers/trigger-example-changes-in-api.png)

**Tetikleyiciyi test etmek için:**

1. **Entegrasyonlar**'da [Slack ile entegrasyonu](../../user-guides/settings/integrations/slack.md) yapılandırın.
1. **Tetikleyiciler**'de yukarıda gösterildiği gibi bir tetikleyici oluşturun.
1. `200` (`OK`) yanıtını almak için `example.com/users` uç noktasına birkaç istek gönderin.
1. **API Discovery** bölümünde, uç noktanızın **Yeni** işareti ile eklendiğini kontrol edin.
1. Slack kanalınızdaki mesajları kontrol edin; örneğin:

    ```
    [wallarm] API'nızda yeni bir uç nokta keşfedildi

    Bildirim türü: api_structure_changed

    GET example.com/users uç noktanızda yeni bir uç nokta keşfedildi.

        Müşteri: Müşteri 001
        Bulut: ABD

        Detaylar:

          Uygulama: Uygulama 1802
          Alan adı: example.com
          uç_nokta_yolu: /users
          http_metodu: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```