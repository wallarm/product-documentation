İlk tespit edilen saldırılara dayanarak, **Aktif tehdit doğrulama** modülü, aynı uç noktayı hedef alan farklı yüklerle birçok yeni test isteği oluşturur. Bu mekanizma, Wallarm'ın saldırılar sırasında potansiyel olarak istismar edilebilecek zayıf noktaları tespit etmesine olanak sağlar. Aktif tehdit doğrulama süreci, uygulamanın belirli saldırı vektörlerine karşı savunmasız olmadığını teyit edecek ya da gerçek uygulama güvenlik sorunlarını bulacaktır.

[Modül tarafından tespit edilebilecek zayıf noktaların listesi](../attacks-vulns-list.md)

**Aktif tehdit doğrulama** süreci, korunan uygulamanın olası Web ve API güvenlik açıklarını kontrol etmek için aşağıdaki mantığı kullanır:

1. Bir Wallarm filtreleme düğümü tarafından tespit edilen ve bağlı Wallarm Cloud'a yüklenen her kötü amaçlı istek grubu (her saldırı) için, sistem hangi özel uç noktanın (URL, istek dizesi parametresi, JSON özniteliği, XML alanı, vb.) hangi belirli tehlike türünün (SQLi, RCE, XSS, vb.) saldırıya uğradığını ve saldırganın hangi açığı istismar etmeye çalıştığını analiz eder. Örneğin, aşağıdaki kötü amaçlı GET isteğine bakalım:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    Sistem istekten aşağıdaki detayları öğrenecektir:
    
    * Saldırıya uğrayan URL `https://example.com/login`'dır
    * Kullanılan saldırı tipi SQLi (`UNION SELECT username, password` yüküne göre)
    * Saldırıya uğrayan sorgu dizesi parametresi `user`'dır
    * İsteğe ek bilgi olarak `token=IyEvYmluL3NoCg` istek dizesi parametresi sunulur (muhtemelen uygulama tarafından kullanıcıyı doğrulamak için kullanılır)
2. Toplanan bilgileri kullanarak, **Aktif tehdit doğrulama** modülü, orijinal hedeflenen uç noktaya yönelik yaklaşık 100-150 test isteği oluşturacak, ancak aynı saldırı türü için farklı türde kötü amaçlı yüklerle (SQLi gibi). Örneğin:

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

    !!! info "Kötü amaçlı yükler kaynaklarınıza zarar vermez"
        Üretilen isteklerin kötü amaçlı yükleri, gerçek kötü amaçlı sözdizimi içermez, sadece saldırı prensibini taklit etmeyi amaçlarlar. Sonuç olarak, kaynaklarınıza zarar vermezler.
3. **Aktif tehdit doğrulama** modülü, oluşturulan test isteklerini Wallarm korumasını atlayarak uygulamaya gönderir ([beyaz listeye alma özelliği][allowlist-scanner-addresses] kullanarak) ve belirli bir uç noktadaki uygulamanın belirli bir saldırı türüne karşı savunmasız olmadığını doğrular. Modül, uygulamanın gerçek bir güvenlik açığı olduğundan şüphelenirse, [olay](../user-guides/events/check-attack.md#incidents) türünde bir olay oluşturur.

    !!! info "İsteklerdeki `User-Agent` HTTPS başlık değeri"
        **Aktif tehdit doğrulama** modülü isteklerinde `User-Agent` HTTP başlığı, `Wallarm Threat-Verification (v1.x)` değerine sahip olacaktır.
4. Tespit edilen güvenlik olayları Wallarm Konsolunda raporlanır ve mevcut üçüncü taraf [Entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) ve [Tetikleyiciler](../user-guides/triggers/triggers.md) aracılığıyla güvenlik ekibinize yönlendirilebilir.