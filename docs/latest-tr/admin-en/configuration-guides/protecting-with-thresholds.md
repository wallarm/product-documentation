# Çoklu Saldırı Faillerine Karşı Koruma

Wallarm [blocking mode](../../admin-en/configure-wallarm-mode.md) konumundayken, kötü amaçlı payload içeren tüm istekleri otomatik olarak engeller ve yalnızca meşru isteklerin geçmesine izin verir. Aynı IP’den gelen farklı kötü amaçlı payload sayısı (sıklıkla “multi-attack perpetrator” olarak anılır) belirli bir eşiği aşarsa, Wallarm’ın tepkisini ayarlayarak uygulamalarınız ve API’niz için ek koruma yapılandırabilirsiniz.

Bu tür failler otomatik olarak denylist’e alınabilir; bu da onlardan gelen tüm isteklerin engellenmesini sağlar. Bu durumda, söz konusu kaynaktan geçmişte çok sayıda kötü amaçlı istek üretildiği için, isteklerin kötü amaçlı olup olmadığını analiz etmeye zaman harcanmaz.

## Yapılandırma

Aşağıdaki örneği göz önünde bulundurarak çoklu saldırı faillerine karşı korumayı nasıl yapılandıracağınızı öğrenin.

Diyelim ki bazı IP’lerden saatte 3’ten fazla kötü amaçlı payload gelmesini, IP’yi tamamen engellemek için yeterli bir sebep olarak değerlendiriyorsunuz. Bunu yapmak için ilgili eşiği ayarlayın ve sistemin kaynak IP’yi 1 saatliğine engellemesini belirtin.

Bu korumayı sağlamak için:

1. Wallarm Console → **Triggers**’ı açın ve tetikleyici oluşturma penceresini açın.
1. **Number of malicious payloads** koşulunu seçin.
1. Eşiği şu şekilde ayarlayın: `more than 3 malicious requests from the same IP per hour`.

    !!! info "Sayılmayanlar"
        [custom regular expressions](../../user-guides/rules/regex-rule.md) tabanlı deneysel payload’lar.
        
1. Herhangi bir filtre ayarlamayın, ancak diğer durumlarda aşağıdakileri ayrı ayrı veya birleştirerek kullanabileceğinizi unutmayın:

    * **Type**, istekte tespit edilen saldırı türü veya isteğin yöneldiği güvenlik açığı türüdür ([type](../../attacks-vulns-list.md)).
    * **Application**, isteği alan [application](../../user-guides/settings/applications.md) öğesidir.
    * **IP**, isteğin gönderildiği IP adresidir. Filtre yalnızca tekil IP’leri bekler; alt ağlar, konumlar ve kaynak türlerine izin vermez.
    * **Domain**, isteği alan alan adıdır.
    * **Response status**, isteğe döndürülen yanıt kodudur.

1. **Denylist IP address** - `Block for 1 hour` tetikleyici tepkisini seçin. Eşik aşıldığında Wallarm, kaynak IP’yi [denylist](../../user-guides/ip-lists/overview.md)’e alacak ve bundan sonraki tüm istekleri engelleyecektir.

    Çoklu saldırı koruması tarafından bot IP’si denylist’e alınmış olsa bile, varsayılan olarak Wallarm, ondan kaynaklanan engellenen isteklerle ilgili istatistikleri toplar ve [görüntüler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

    ![Varsayılan tetikleyici](../../images/user-guides/triggers/trigger-example-default.png)
        
1. Tetikleyiciyi kaydedin ve [Cloud ve node eşitlemesinin tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

<a id="pre-configured-trigger"></a>
## Önceden yapılandırılmış tetikleyici

Yeni şirket hesaplarında, 1 saat içinde 3’ten fazla farklı [malicious payloads](../../glossary-en.md#malicious-payload) üretildiğinde IP’yi 1 saatliğine graylist’e alan, önceden yapılandırılmış (default) **Number of malicious payloads** tetikleyicisi bulunur.

[Graylist](../../user-guides/ip-lists/overview.md), node tarafından şu şekilde işlenen şüpheli IP adresleri listesidir: graylist’teki bir IP kötü amaçlı istekler üretirse node bunları engeller, ancak meşru isteklere izin verir. Graylist’in aksine, [denylist](../../user-guides/ip-lists/overview.md), uygulamalarınıza hiç ulaşmasına izin verilmeyen IP adreslerini gösterir – node, denylist’teki kaynaklar tarafından üretilen meşru trafiği bile engeller. IP graylisting, [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) azaltılmasına yönelik seçeneklerden biridir.

Tetikleyici, node’un herhangi bir filtreleme modunda çalışır; dolayısıyla node mode’dan bağımsız olarak IP’leri graylist’e alır.

Bununla birlikte, node graylist’i yalnızca **safe blocking** modunda analiz eder. Graylist’teki IP’lerden gelen kötü amaçlı istekleri engellemek için, önce özelliklerini öğrenerek node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)’unu safe blocking olarak değiştirin.

Brute force, Forced browsing, Resource overlimit, Data bomb veya Virtual patch saldırı türlerine sahip Hits bu tetikleyicide dikkate alınmaz.

Default tetikleyiciyi geçici olarak devre dışı bırakabilir, değiştirebilir veya silebilirsiniz.

## Test etme

Aşağıda, [pre-configured trigger](#pre-configured-trigger) için test örneği verilmiştir. Bunu kendi tetikleyici görünümünüze uyarlayabilirsiniz.

1. Korumalı kaynağa aşağıdaki istekleri gönderin:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) ve [Path Traversal](../../attacks-vulns-list.md#path-traversal) türlerinde 4 kötü amaçlı payload vardır.
1. Wallarm Console → **IP lists** → **Graylist**’i açın ve isteklerin geldiği IP adresinin 1 saatliğine graylist’e alındığını kontrol edin.
1. **Attacks** bölümünü açın ve saldırıların listede görüntülendiğini kontrol edin:

    ![UI'de üç kötü amaçlı payload](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    Saldırıları aramak için `multiple_payloads` [arama etiketi](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)’ni kullanabilirsiniz.