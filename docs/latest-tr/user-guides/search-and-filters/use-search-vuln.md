[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-comp]:           ../../attacks-vulns-list.md#vulnerable-component
[al-ssrf]:                ../../attacks-vulns-list.md#serverside-request-forgery-ssrf
[al-csrf]:                ../../attacks-vulns-list.md#cross-site-request-forgery-csrf
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[al-weak-jwt]:            ../../attacks-vulns-list.md#weak-jwt
[al-bola]:                ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[al-anomaly]:             ../../fast/vuln-list.md#anomaly

# Zafiyet Arama ve Filtreler

**Vulnerabilities** bölümünde, Wallarm tespit edilen zafiyetler arasında arama için kullanışlı yöntemler sağlar.

Şunları kullanabilirsiniz:

* Filtreleme ölçütlerini seçmek için **Filters**
* Doğal dile benzer öznitelik ve değiştiricilerle arama sorguları girmek için **Search field**

Filters içinde ayarlanan değerler Search field içinde otomatik olarak çoğaltılır; tersi de geçerlidir.

## Filtreler

Mevcut filtreler, Wallarm Console içinde, **Filter** düğmesi kullanılarak genişletilip daraltılan filtreler panelinde sunulur.

![UI'de zafiyet filtreleri](../../images/user-guides/search-and-filters/filters-vuln.png)

Farklı filtrelerin değerleri seçildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı filtre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

## Search field

Search field, doğal dile benzer öznitelik ve değiştiriciler içeren sorguları kabul eder; bu da sorgu göndermeyi sezgisel hale getirir. Örneğin:

* `rce high`: yüksek risk seviyesine sahip tüm [RCE](../../attacks-vulns-list.md#remote-code-execution-rce) zafiyetlerini aramak için
* `ptrav medium`: yüksek risk seviyesine sahip tüm [yol geçişi](../../attacks-vulns-list.md#path-traversal) zafiyetlerini aramak için

Farklı parametrelerin değerleri belirtildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı parametre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

!!! info "Öznitelik değerini NOT'a ayarlama"
    Bir öznitelik değerini olumsuzlamak için, lütfen öznitelik veya değiştirici adından önce `!` kullanın. Örneğin: düşük risk seviyesine sahip olanlar hariç tüm RCE zafiyetlerini göstermek için `rce !low`.

Aşağıda arama sorgularında kullanılabilecek öznitelik ve değiştiricilerin listesi yer almaktadır.

### Zafiyet türüne göre arama

Arama satırında belirtin:

<!-- * `anomaly`: to search for [anomaly][al-anomaly] vulnerabilities detected by [FAST](../../fast/README.md). -->
* `sqli`: [SQL enjeksiyonu][al-sqli] zafiyetlerini aramak için.
* `xss`: [siteler arası betik çalıştırma][al-xss] zafiyetlerini aramak için.
* `rce`: [OS komut çalıştırma][al-rce] zafiyetlerini aramak için.
* `ptrav`: [yol geçişi][al-path-traversal] zafiyetlerini aramak için.
* `crlf`: [CRLF enjeksiyonu][al-crlf] zafiyetlerini aramak için.
* `nosqli`: [NoSQL enjeksiyonu][al-nosqli] zafiyetlerini aramak için.
* `xxe`: [XML dış varlık][al-xxe] zafiyetlerini aramak için.
* `ldapi`: [LDAP enjeksiyonu][al-ldapi] zafiyetlerini aramak için.
* `ssti`: [sunucu tarafı şablon enjeksiyonları][ssti-injection] için.
* `infoleak`: [bilgi ifşası][al-infoleak] türündeki zafiyetleri aramak için.
* `vuln_component`: uygulamalarınızın [bileşenleri][al-vuln-comp] ile ilişkili, güncel olmayan veya güvenliği etkileyen hatalar içeren zafiyetleri aramak için.
* `redir`: [açık yönlendirme][al-open-redirect] zafiyetlerini aramak için.
* `idor`: [bozuk nesne düzeyi yetkilendirme (BOLA)][al-bola] zafiyetlerini aramak için.
* `ssrf`: [sunucu tarafı istek sahteciliği (SSRF)][al-ssrf] zafiyetlerini aramak için.
* `csrf`: [siteler arası istek sahteciliği (CSRF)][al-csrf] zafiyetlerini aramak için.
* `weak_auth`: [zayıf JWT][al-weak-jwt] zafiyetlerini aramak için.

Bir zafiyet adı hem büyük hem de küçük harflerle belirtilebilir: `SQLI`, `sqli` ve `SQLi` eşit derecede doğrudur.

### Risk seviyesine göre arama

Arama satırında risk seviyesini belirtin:

* `low`: düşük risk seviyesi.
* `medium`: orta risk seviyesi.
* `high`: yüksek risk seviyesi.