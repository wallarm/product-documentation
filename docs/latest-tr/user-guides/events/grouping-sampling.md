[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Hit'lerin Gruplandırılması ve Örneklenmesi

[saldırıları analiz ederken](check-attack.md), kötü amaçlı isteklerin nasıl sunulduğunu anlamak önemlidir. Wallarm, saldırı listesini basitleştirmek için hit gruplandırma ve örnekleme tekniklerini kullanır. Bu teknikler bu makalede açıklanmaktadır.

## Hit'lerin gruplandırılması

Wallarm, [hit'leri](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) tek bir saldırıda aşağıdaki iki gruplandırma yöntemiyle bir araya getirir:

* Temel gruplandırma
* Kaynak IP'ye göre hit gruplandırma

Bu yöntemler birbirini dışlamaz. Hit'ler her iki yöntemin özelliklerini taşıyorsa, hepsi tek bir saldırıda gruplandırılır.

### Temel gruplandırma

Hit'ler aynı saldırı türüne, kötü amaçlı payload içeren parametreye ve hit'lerin gönderildiği adrese sahipse gruplandırılır. Hit'ler aynı veya farklı IP adreslerinden gelebilir ve aynı saldırı türü içinde kötü amaçlı payload değerleri farklı olabilir.

Bu hit gruplandırma yöntemi temeldir, tüm hit'lere uygulanır ve devre dışı bırakılamaz veya değiştirilemez.

### Kaynak IP'ye göre hit gruplandırma

Hit'ler aynı kaynak IP adresine sahipse gruplandırılır. Gruplandırılan hit'lerin saldırı türleri, kötü amaçlı payload'ları ve URL'leri farklıysa, saldırı parametreleri saldırı listesinde `[multiple]` etiketiyle işaretlenir.

Bu hit gruplandırma yöntemi Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb ve Virtual patch saldırı türleri dışındaki tüm hit'ler için çalışır.

Hit'ler bu yöntemle gruplandırılmışsa, [**Mark as false positive**](check-attack.md#false-positives) butonu ve [active verification](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) seçeneği bu saldırı için kullanılamaz.

Kaynak IP'ye göre gruplandırma varsayılan olarak Wallarm Console → **Triggers** bölümünde, tek bir IP adresi 15 dakika içinde 50'den fazla hit ürettiğinde tetiklenen **Hits from the same IP** varsayılan trigger'ı ile etkindir.

![Hit gruplandırma için trigger örneği](../../images/user-guides/triggers/trigger-example-group-hits.png)

Kaynak IP'ye göre gruplandırmayı ihtiyaçlarınıza göre ayarlayabilirsiniz: **Hits from the same IP** tipindeki kendi özel trigger'larınızı oluşturarak bunu yapın. Herhangi bir özel trigger oluşturmak varsayılan olanı siler, tüm özel trigger'larınızı silerseniz varsayılan geri yüklenir. Ayrıca varsayılan trigger'ı geçici olarak devre dışı bırakarak gruplandırmayı duraklatabilirsiniz.

## Hit'lerin örneklenmesi

Saldırı ayrıntılarını oluştururken, Wallarm yalnızca benzersiz [hit'leri](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) göstererek saldırıyla ilgili bilgileri analiz için daha konforlu hale getirir - benzersiz olmayan (karşılaştırılabilir ve özdeş) hit'ler Wallarm Cloud'a yüklenmekten çıkarılır ve görüntülenmez. Bu sürece hit **örnekleme** denir.

Hit örnekleme, saldırı tespitinin kalitesini etkilemez ancak yavaşlamasını önlemeye yardımcı olur. Wallarm node, hit örnekleme etkin olsa bile saldırı tespitini ve [engellemeyi](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) sürdürür.

**Hits sampling is enabled** bildirimi, örneklemenin şu anda çalıştığını gösterir. Yalnızca örneklemenin uygulandığı saldırıları görmek için bu bildirime tıklayabilir veya arama alanına [`sampled`](../search-and-filters/use-search.md#search-for-sampled-hits) ekleyebilirsiniz. Saldırı ayrıntılarında, kaç benzer hit'in tespit edildiğini ancak gösterilmediğini göreceksiniz:

![Düşürülen hit'ler](../../images/user-guides/events/bruteforce-dropped-hits.png)

!!! info "Saldırı listesinde düşürülen hit'lerin görüntülenmesi"
    Düşürülen hit'ler Wallarm Cloud'a yüklenmediğinden, belirli hit'ler veya tüm saldırılar saldırı listesinde bulunmayabilir.

Düşürülen istekler yine de Wallarm node tarafından işlenen istekler olduğundan, node ayrıntıları UI'ında RPS değeri her düşürülen istekle birlikte artar. [Threat Prevention dashboard](../dashboards/threat-prevention.md) üzerindeki istek ve hit sayısı da düşürülen hit'lerin sayısını içerir.

**Hit örnekleme etkin olduğunda**

* [Girdi doğrulama saldırıları](../../attacks-vulns-list.md#attack-types) için, hit örnekleme varsayılan olarak devre dışıdır. Trafiğinizdeki saldırı yüzdesi yüksekse, hit örnekleme art arda iki aşamada gerçekleştirilir: **aşırı** ve **normal**.
* [Davranışsal saldırılar](../../attacks-vulns-list.md#attack-types), [Data bomb](../../attacks-vulns-list.md#data-bomb) ve [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) saldırıları için: **normal** örnekleme algoritması varsayılan olarak etkindir. **Aşırı** örnekleme yalnızca trafiğinizdeki saldırı yüzdesi yüksekse başlar.
* Denylist'e alınmış IP'lerden gelen olaylar için örnekleme node tarafında yapılandırılır. Cloud'a yalnızca ilk 10 özdeş isteği yükler, geri kalan hit'lere örnekleme algoritması uygular.

Trafikteki saldırı yüzdesi azaldığında örnekleme otomatik olarak devre dışı bırakılır.

### Aşırı örnekleme

Aşırı örnekleme algoritmasının temel mantığı aşağıdaki gibidir:

* Hit'ler [girdi doğrulama](../../attacks-vulns-list.md#attack-types) türündeyse, algoritma Cloud'a yalnızca benzersiz [kötü amaçlı payload](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) içerenleri yükler. Bir saat içinde aynı payload'a sahip birden fazla hit tespit edilirse, bunların yalnızca ilki Cloud'a yüklenir, diğerleri düşürülür.
* Hit'ler [davranışsal](../../attacks-vulns-list.md#attack-types), [Data bomb](../../attacks-vulns-list.md#data-bomb) veya [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) türündeyse, algoritma bir saat içinde tespit edilenlerin yalnızca ilk %10'unu Cloud'a yükler.

### Normal örnekleme

Normal algoritma, [davranışsal](../../attacks-vulns-list.md#attack-types), [Data bomb](../../attacks-vulns-list.md#data-bomb) veya [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) türünde olmadıkça yalnızca aşırı aşamadan sonra kaydedilen hit'leri işler. Bu tür hit'ler için aşırı örnekleme devre dışıysa, normal algoritma orijinal hit kümesini işler.

Normal örnekleme algoritmasının temel mantığı aşağıdaki gibidir:

1. Her saat için ilk 5 özdeş hit, Wallarm Cloud'da örnek olarak saklanır. Geri kalan hit'ler örneğe kaydedilmez, ancak sayıları ayrı bir parametrede kaydedilir.

    Hit'ler, aşağıdaki parametrelerin tamamı aynı değerlere sahipse özdeştir:

    * Saldırı türü
    * Kötü amaçlı payload içeren parametre
    * Hedef adres
    * İstek yöntemi
    * Yanıt kodu
    * Kaynak IP adresi
2. Hit örnekleri, olay listesinde [saldırılar](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) halinde gruplandırılır.