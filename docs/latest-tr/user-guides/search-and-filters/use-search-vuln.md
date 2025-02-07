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

# Güvenlik Açığı Arama ve Filtreler

**Güvenlik Açıkları** bölümünde, Wallarm tespit edilen güvenlik açıkları arasında arama yapmayı kolaylaştıran yöntemler sunar.

Kullanabileceğiniz seçenekler:

* **Filtreler**: filtreleme kriterlerini seçmek için
* **Arama alanı**: insan diline benzer öznitelikler ve değiştiriciler kullanarak arama sorguları girmek için

Filtrelerde ayarlanan değerler otomatik olarak arama alanında çoğaltılır; arama alanına girilen değerler de filtrelere yansıtılır.

## Filtreler

Kullanılabilir filtreler, Wallarm Console’da **Filtre** butonu ile genişletilebilen ve daraltılabilen filtre panelinde sunulur.

![UI'daki güvenlik açığı filtreleri](../../images/user-guides/search-and-filters/filters-vuln.png)

Farklı filtreler için değerler seçildiğinde, sonuçlar bu koşulların tamamını karşılar. Aynı filtre için farklı değerler belirtildiğinde ise sonuçlar bu koşullardan herhangi birini karşılar.

## Arama Alanı

Arama alanı, insan diline benzer öznitelikler ve değiştiriciler içeren sorguları kabul eder; bu da sorgu göndermeyi sezgisel hale getirir. Örneğin:

* `rce high`: yüksek risk seviyesine sahip tüm [RCE](../../attacks-vulns-list.md#remote-code-execution-rce) güvenlik açıklarını aramak için
* `ptrav medium`: orta risk seviyesine sahip tüm [path traversal](../../attacks-vulns-list.md#path-traversal) güvenlik açıklarını aramak için

Farklı parametreler için değerler belirtildiğinde, sonuçlar bu koşulların tamamını karşılar. Aynı parametre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

!!! info "Öznitelik Değerini DEĞİL Olarak Ayarlama"
    Öznitelik değerini olumsuzlamak için, öznitelik ya da değiştirici adının önüne `!` ekleyin. Örneğin: `rce !low` ifadesi, düşük risk seviyesine sahip RCE güvenlik açıkları dışındaki tüm RCE güvenlik açıklarını gösterir.

Aşağıda, arama sorgularında kullanılabilecek öznitelik ve değiştirici listesini bulabilirsiniz.

### Güvenlik Açığı Türüne Göre Arama

Arama dizesinde belirtilebilecek öznitelikler:

<!-- * `anomaly`: to search for [anomaly][al-anomaly] vulnerabilities detected by [FAST](../../fast/README.md). -->
* `sqli`: [SQL injection][al-sqli] güvenlik açıklarını aramak için.
* `xss`: [cross site scripting][al-xss] güvenlik açıklarını aramak için.
* `rce`: [uzaktan komut çalıştırma][al-rce] güvenlik açıklarını aramak için.
* `ptrav`: [path traversal][al-path-traversal] güvenlik açıklarını aramak için.
* `crlf`: [CRLF injection][al-crlf] güvenlik açıklarını aramak için.
* `nosqli`: [NoSQL injection][al-nosqli] güvenlik açıklarını aramak için.
* `xxe`: [XML external entity][al-xxe] güvenlik açıklarını aramak için.
* `ldapi`: [LDAP injection][al-ldapi] güvenlik açıklarını aramak için.
* `ssti`: [server‑side template injections][ssti-injection] güvenlik açıklarını aramak için.
* `infoleak`: [information disclosure][al-infoleak] tipindeki güvenlik açıklarını aramak için.
* `vuln_component`: uygulamalarınızın güncelliğini yitiren veya güvenliği etkileyen hatalar içeren [bileşenleri][al-vuln-comp] ile ilgili güvenlik açıklarını aramak için.
* `redir`: [open redirect][al-open-redirect] güvenlik açıklarını aramak için.
* `idor`: [broken object level authorization (BOLA)][al-bola] güvenlik açıklarını aramak için.
* `ssrf`: [server‑side request forgery (SSRF)][al-ssrf] güvenlik açıklarını aramak için.
* `csrf`: [cross-site request forgery (CSRF)][al-csrf] güvenlik açıklarını aramak için.
* `weak_auth`: [weak JWT][al-weak-jwt] güvenlik açıklarını aramak için.

Bir güvenlik açığı adı, büyük veya küçük harflerle belirtilebilir: `SQLI`, `sqli` ve `SQLi` eşit derecede doğrudur.

### Risk Seviyesine Göre Arama

Arama dizesinde risk seviyesini belirtin:

* `low`: düşük risk seviyesi.
* `medium`: orta risk seviyesi.
* `high`: yüksek risk seviyesi.