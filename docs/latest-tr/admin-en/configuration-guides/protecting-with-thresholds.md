# Multi-Saldırı Yapıcılarından Korunma

Wallarm, [engelleme modunda](../../admin-en/configure-wallarm-mode.md) olduğunda, kötü amaçlı içerikli tüm istekleri otomatik olarak engeller ve yalnızca meşru isteklerin geçişine izin verir. Aynı IP'den gelen farklı kötü amaçlı içeriklerin sayısı (genellikle **multi-attack perpetrator** olarak adlandırılan) belirli bir eşiği aştığında, Wallarm tepkisini ayarlayarak uygulamalarınız ve API'niz için ek koruma yapılandırabilirsiniz.

Bu tür saldırganlar otomatik olarak denylist'e alınabilir; bu liste, geçmişte çok sayıda kötü amaçlı istek üretmiş olmaları nedeniyle, kötü amaçlı olup olmadıkları analiz edilmeksizin **tüm isteklerini engellemeye** başlar.

## Yapılandırma

Çoklu saldırı yapıcılardan korunmayı nasıl yapılandıracağınızı öğrenmek için aşağıdaki örneği inceleyin.

Diyelim ki, bir IP'den saatte 3'ten fazla kötü amaçlı içerik gelmesini, o IP'yi tamamen engellemek için yeterli bir neden olarak değerlendiriyorsunuz. Bunu yapmak için ilgili eşiği ayarlayıp, sisteme orijinal IP'yi 1 saat boyunca engellemesi talimatını verirsiniz.

Bu korumayı sağlamak için:

1. Wallarm Console'u açın → **Triggers** kısmına gidin ve tetikleyici oluşturma penceresini açın.
1. **Number of malicious payloads** koşulunu seçin.
1. Eşiği `her saat aynı IP'den 3'ten fazla kötü amaçlı istek` olarak ayarlayın.

    !!! info "Sayılmayanlar"
        Deneysel içerikler, [custom regular expressions](../../user-guides/rules/regex-rule.md) kullanılarak oluşturulur.
        
1. Hiçbir filtre ayarlamayın, ancak diğer durumlarda aşağıdaki filtreleri ayrı ya da birlikte kullanabileceğinizi unutmayın:

    * **Type**; istekte tespit edilen bir saldırı [type](../../attacks-vulns-list.md) veya isteğin yöneldiği güvenlik açığı türüdür.
    * **Application**; isteği alan [application](../../user-guides/settings/applications.md)'dır.
    * **IP**; isteğin gönderildiği IP adresidir. Filtre yalnızca tek IP'leri bekler; alt ağlara, lokasyonlara ve kaynak türlerine izin vermez.
    * **Domain**; isteği alan alan adıdır.
    * **Response status**; isteğe döndürülen yanıt kodudur.
  
1. **Denylist IP address - `Block for 1 hour`** tetikleyici tepkisini seçin. Eşiğin aşılmasının ardından Wallarm, orijinal IP'yi [denylist](../../user-guides/ip-lists/overview.md)'e ekleyecek ve bundan sonraki tüm istekleri engelleyecektir.

    Not: Çoklu saldırı koruması nedeniyle bot IP denylist'e eklenmiş olsa dahi, varsayılan olarak Wallarm, bu IP'den gelen engellenmiş isteklerle ilgili istatistikleri toplar ve [görüntüler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

    ![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)
        
1. Tetikleyiciyi kaydedin ve [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md)'ın tamamlanmasını bekleyin (genellikle 2-4 dakika sürer).

## Önceden Yapılandırılmış Tetikleyici

Yeni şirket hesapları, 1 saat içerisinde 3'ten fazla farklı [kötü amaçlı içerik](../../glossary-en.md#malicious-payload) üretildiğinde, IP'yi 1 saat boyunca graylist'e ekleyen, önceden yapılandırılmış (varsayılan) **Number of malicious payloads** tetikleyicisiyle birlikte gelir.

[Graylist](../../user-guides/ip-lists/overview.md), düğüm tarafından işlenen şüpheli IP adreslerinin bulunduğu listedir: Graylist'e alınan bir IP kötü amaçlı istek oluşturduğunda, düğüm bu istekleri engellerken meşru isteklerin geçişine izin verir. Graylist'e karşılık, [denylist](../../user-guides/ip-lists/overview.md) ise uygulamalarınıza ulaşmasına hiç izin verilmeyen IP adreslerini belirtir - düğüm, denylist'e eklenmiş kaynaklar tarafından üretilen meşru trafiği bile engeller. IP graylist'e alma, [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) oranını azaltmaya yönelik seçeneklerden biridir.

Tetikleyici, herhangi bir node filtreleme modunda etkin olduğundan, düğüm modundan bağımsız olarak IP'leri graylist'e alır.

Ancak, düğüm graylist'i yalnızca **safe blocking** modunda analiz eder. Graylist'e alınmış IP'lerden gelen kötü amaçlı istekleri engellemek için, önce özelliklerini öğrenerek düğüm [modunu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) safe blocking'e geçirin.

Brute force, Forced browsing, Resource overlimit, Data bomb veya Virtual patch saldırı türleri bu tetikleyicide dikkate alınmaz.

Varsayılan tetikleyiciyi geçici olarak devre dışı bırakabilir, düzenleyebilir veya silebilirsiniz.

## Test

Aşağıdakiler, [önceden yapılandırılmış tetikleyici](#pre-configured-trigger) için test örneğidir. Bunları tetikleyici görünümünüze göre ayarlayabilirsiniz.

1. Aşağıdaki istekleri korunan kaynağa gönderin:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    Bunlar, [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) ve [Path Traversal](../../attacks-vulns-list.md#path-traversal) türlerinden toplam 4 kötü amaçlı içeriktir.
1. Wallarm Console'u açın → **IP lists** → **Graylist** bölümüne gidin ve isteklerin gönderildiği IP adresinin 1 saat boyunca graylist'e alındığını kontrol edin.
1. **Attacks** bölümünü açın ve saldırıların listede görüntülendiğini kontrol edin:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Saldırıları aramak için `multiple_payloads` [arama etiketi](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) kullanabilirsiniz.