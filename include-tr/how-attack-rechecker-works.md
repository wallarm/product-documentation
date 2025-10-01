Başlangıçta tespit edilen saldırılara dayanarak, **Threat Replay Testing** modülü aynı endpoint'e saldıran farklı payload'larla çok sayıda yeni test isteği oluşturur. Bu mekanizma, Wallarm'ın saldırılar sırasında potansiyel olarak istismar edilebilecek güvenlik açıklarını tespit etmesini sağlar. Threat Replay Testing süreci, uygulamanın belirli saldırı vektörlerine karşı savunmasız olmadığını doğrular veya gerçek uygulama güvenliği sorunları bulur.

[Modül tarafından tespit edilebilen güvenlik açıklarının listesi](../attacks-vulns-list.md)

**Threat Replay Testing** süreci, korunmakta olan uygulamayı olası Web ve API güvenlik açıkları için kontrol etmek üzere aşağıdaki mantığı kullanır:

1. Wallarm filtreleme düğümü tarafından tespit edilip bağlı Wallarm Cloud'a yüklenen her bir kötü amaçlı istek grubu (her saldırı) için sistem, hangi spesifik endpoint'in (URL, sorgu dizesi parametresi, JSON özniteliği, XML alanı, vb.) hedef alındığını ve saldırganın hangi spesifik türde güvenlik açığını (SQLi, RCE, XSS, vb.) istismar etmeye çalıştığını analiz eder. Örneğin, aşağıdaki kötü amaçlı GET isteğine bakalım:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    Bu istekten sistem aşağıdaki ayrıntıları öğrenir:
    
    * Hedef alınan URL: `https://example.com/login`
    * Kullanılan saldırı türü SQLi'dir (`UNION SELECT username, password` payload'ına göre)
    * Hedef alınan sorgu dizesi parametresi `user`
    * İstekte sağlanan ek bilgi, istek dizesi parametresi `token=IyEvYmluL3NoCg`'dır (muhtemelen uygulama tarafından kullanıcıyı kimlik doğrulamak için kullanılır)
2. Toplanan bilgileri kullanarak **Threat Replay Testing** modülü, başlangıçta hedeflenen endpoint'e yönelik, aynı saldırı türü (ör. SQLi) için farklı kötü amaçlı payload'lar içeren yaklaşık 100-150 test isteğinden oluşan bir liste oluşturur. Örneğin:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "Kötü amaçlı payload'lar kaynaklarınıza zarar vermez"
        Üretilen isteklerin kötü amaçlı payload'ları gerçek kötü amaçlı sözdizimi içermez; yalnızca saldırı prensibini taklit etmeye yöneliktir. Sonuç olarak, kaynaklarınıza zarar vermezler.
3. **Threat Replay Testing** modülü, üretilen test isteklerini Wallarm korumasını baypas ederek ( [allowlisting özelliği][allowlist-scanner-addresses] kullanılarak) uygulamaya gönderir ve belirli endpoint'teki uygulamanın belirli saldırı türüne karşı savunmasız olmadığını doğrular. Modül, uygulamada gerçek bir güvenlik açığı olduğundan şüphelenirse, [incident](../user-guides/events/check-attack.md#incidents) türünde bir etkinlik oluşturur.

    !!! info "İsteklerde `User-Agent` HTTPS üstbilgi değeri"
        **Threat Replay Testing** modülü isteklerindeki `User-Agent` HTTP üstbilgisinin değeri `Wallarm Threat-Verification (v1.x)` olacaktır.
4. Tespit edilen güvenlik olayları Wallarm Console'da raporlanır ve mevcut üçüncü taraf [Integrations](../user-guides/settings/integrations/integrations-intro.md) ve [Triggers](../user-guides/triggers/triggers.md) aracılığıyla güvenlik ekibinize iletilebilir.