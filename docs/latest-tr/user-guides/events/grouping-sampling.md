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

# Vuruşların Gruplanması ve Örneklenmesi

[analyzing attacks](check-attack.md) işlemi sırasında, kötü niyetli isteklerin nasıl sunulduğunu anlamak önemlidir. Wallarm, saldırı listesini sadeleştirmek için vuruş gruplama ve örnekleme teknikleri kullanır. Bu teknikler bu makalede açıklanmıştır.

## Vuruşların Gruplanması

Wallarm, [vuruşları](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) iki gruplama yöntemi kullanarak tek bir saldırı altında toplar:

* Temel gruplama
* Kaynak IP tarafından vuruşların gruplandırılması

Bu yöntemler birbirini dışlamaz. Vuruşlar her iki yönteme ait özellikler taşıyorsa, tümü tek bir saldırı altında gruplanır.

### Temel Gruplama

Vuruşlar, aynı saldırı türüne, kötü niyetli payload içeren parametreye ve vuruşların gönderildiği adrese sahip olduklarında gruplanır. Vuruşlar, aynı veya farklı IP adreslerinden gelebilir ve aynı saldırı türü içinde kötü niyetli payload değerleri farklı olabilir.

Bu vuruş gruplama yöntemi temel olup tüm vuruşlara uygulanır ve devre dışı bırakılamaz veya değiştirilemez.

### Kaynak IP Tarafından Gruplama

Vuruşlar, aynı kaynak IP adresine sahip olduklarında gruplanır. Gruplandırılan vuruşlar farklı saldırı türlerine, kötü niyetli payloadlara ve URL'lere sahipse, saldırı parametreleri saldırı listesinde `[multiple]` etiketi ile işaretlenir.

Bu vuruş gruplama yöntemi, Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb ve Virtual patch saldırı türleri dışındaki tüm vuruşlarda çalışır.

Vuruşlar bu yöntemle gruplanırsa, [**Mark as false positive**](check-attack.md#false-positives) düğmesi ve [active verification](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) seçeneği saldırı için kullanılamaz.

Kaynak IP'ye göre gruplama, varsayılan olarak Wallarm Console → **Triggers** menüsünde bulunan **Hits from the same IP** varsayılan tetikleyicisi ile etkindir; bu tetikleyici, tek bir IP adresinden 15 dakika içinde 50'den fazla vuruş geldiğinde devreye girer.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

Kaynak IP'ye göre gruplamayı ihtiyaçlarınıza göre ayarlayabilirsiniz: bunu **Hits from the same IP** tipinde kendi özel tetikleyicilerinizi oluşturarak yapın. Herhangi bir özel tetikleyici oluşturduğunuzda varsayılan tetikleyici silinir; tüm özel tetikleyicilerinizi sildiğinizde, varsayılan tekrar geri yüklenir. Varsayılan tetikleyiciyi geçici olarak devre dışı bırakarak gruplamayı duraklatmanız da mümkündür.

## Vuruşların Örneklenmesi

Saldırı detayları oluşturulurken, Wallarm, yalnızca benzersiz [vuruşları](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) göstererek saldırı hakkındaki bilgileri analiz için daha konforlu hale getirir - benzer ve aynı vuruşlar Wallarm Cloud'a yükleme sırasında atlanır ve görüntülenmez. Bu sürece vuruş **örnekleme** denir.

Vuruş örneklemesi, saldırı tespit kalitesini etkilemez, ancak yavaşlamayı önlemeye yardımcı olur. Wallarm node, örnekleme etkin olsa bile saldırı tespiti ve [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) işlemine devam eder.

**Hits sampling is enabled** bildirimi, örneklemenin şu anda aktif olduğunu gösterir. Sadece örneklemenin uygulandığı saldırıları görmek için bu bildirime tıklayabilir veya arama alanına [`sampled`](../search-and-filters/use-search.md#search-for-sampled-hits) ekleyebilirsiniz. Saldırı detaylarında benzer kaç vuruşun tespit edildiğini ancak görüntülenmediğini göreceksiniz:

![Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

!!! info "Saldırı listesindeki atlanan vuruşların görüntülenmesi"
    Atlanan vuruşlar Wallarm Cloud'a yüklenmediği için, bazı vuruşlar veya tüm saldırılar saldırı listesinde yer almayabilir.

Atlanan istekler, Wallarm node tarafından işlenen istekler olmaya devam ettiğinden, node detaylarındaki RPS değeri atlanan her istek ile artar. [Threat Prevention dashboard](../dashboards/threat-prevention.md) üzerindeki istek ve vuruş sayısı da atlanan vuruş sayısını içerir.

**Vuruş örneklemesi etkin olduğunda**

* [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) için, vuruş örneklemesi varsayılan olarak devre dışı bırakılmıştır. Trafiğinizdeki saldırı yüzdesi yüksekse, vuruş örneklemesi iki ardışık aşamada gerçekleştirilir: **extreme** ve **regular**.
* [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) ve [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) saldırıları için: **regular** örnekleme algoritması varsayılan olarak etkindir. Trafiğinizdeki saldırı yüzdesi yüksekse, **extreme** örnekleme ancak o zaman başlar.
* Denylisted IP'lerden gelen etkinlikler için, örnekleme node tarafında yapılandırılır. Node, Cloud'a yalnızca ilk 10 aynı isteği yüklerken, diğer vuruşlara örnekleme algoritması uygular.

Trafikteki saldırı yüzdesi azaldığında örnekleme otomatik olarak devre dışı bırakılacaktır.

### Extreme Örnekleme

Extreme örnekleme algoritmasının temel mantığı şöyledir:

* Vuruşlar [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) tipindeyse, algoritma Cloud'a yalnızca benzersiz [kötü niyetli payloadlara](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) sahip olanları yükler. Bir saat içinde aynı payloada sahip birkaç vuruş tespit edilirse, yalnızca ilk tespit edilen Cloud'a yüklenir, diğerleri atlanır.
* Vuruşlar [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) veya [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) tipindeyse, algoritma Cloud'a yalnızca tespit edilen ilk %10'unu yükler.

### Regular Örnekleme

Regular algoritma, extreme aşama sonrası kaydedilen vuruşları işler; vuruşlar [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) veya [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) tipindeyse, extreme örnekleme devre dışı bırakılmışsa orijinal vuruş kümesi işlenir.

Regular örnekleme algoritmasının temel mantığı şöyledir:

1. Her saat için ilk 5 aynı vuruş, Wallarm Cloud'da örnek olarak kaydedilir. Geri kalan vuruşlar örneğe kaydedilmez, ancak sayıları ayrı bir parametrede kaydedilir.

    Vuruşlar, aşağıdaki tüm parametrelerin aynı değerlere sahip olması durumunda aynıdır:

    * Saldırı türü
    * Kötü niyetli payload içeren parametre
    * Hedef adres
    * İstek yöntemi
    * Yanıt kodu
    * Kaynak IP adresi
2. Vuruş örnekleri, etkinlik listesinde [saldırılara](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) gruplanır.