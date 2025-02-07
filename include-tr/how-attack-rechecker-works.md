Based on the initial detected attacks, the **Threat Replay Testing** module creates a lot of new test requests with different payloads attacking the same endpoint. This mechanism allows Wallarm to detect vulnerabilities that could be potentially exploited during attacks. The process of Threat Replay Testing will either confirm that the application is not vulnerable to the specific attack vectors or find actual application security issues.

[Modül tarafından tespit edilebilecek güvenlik açıkları listesi](../attacks-vulns-list.md)

The **Threat Replay Testing** process uses the following logic to check the protected application for possible Web and API security vulnerabilities:

**Threat Replay Testing** süreci, korumalı uygulamadaki olası Web ve API güvenlik açıklarını kontrol etmek için aşağıdaki mantığı kullanır:

1. For every group of malicious request (every attack) detected by a Wallarm filtering node and uploaded to the connected Wallarm Cloud, the system analyzes which specific endpoint (URL, request string parameter, JSON attribute, XML field, etc) was attacked and which specific kind of vulnerability (SQLi, RCE, XSS, etc) the attacker was trying to exploit. For example, let's take a look at the following malicious GET request:

   Wallarm filtreleme düğümü tarafından tespit edilen ve bağlı Wallarm Cloud'a yüklenen her kötü niyetli istek grubu (her saldırı) için, sistem saldırıya uğrayan belirli uç noktayı (URL, istek dizesi parametresi, JSON özelliği, XML alanı vb.) ve saldırganın hangi tür güvenlik açığını (SQLi, RCE, XSS vb.) kullanmaya çalıştığını analiz eder. Örneğin, aşağıdaki kötü niyetli GET isteğine göz atalım:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    From the request the system will learn the following details:
    
    İstekten sistem aşağıdaki bilgileri öğrenir:
    
    * The attacked URL is `https://example.com/login`
    * Saldırıya uğrayan URL `https://example.com/login`
    * The type of used attack is SQLi (according to the `UNION SELECT username, password` payload)
    * Kullanılan saldırı türü, SQLi’dir (istekte yer alan `UNION SELECT username, password` payload'una göre)
    * The attacked query string parameter is `user`
    * Saldırıya uğrayan sorgu dizesi parametresi `user`'dir
    * Additional piece of information provided in the request is the request string parameter `token=IyEvYmluL3NoCg` (it is probably used by the application to authenticate the user)
    * İstekte sağlanan ek bilgi, istek dizesi parametresi `token=IyEvYmluL3NoCg`'dir (muhtemelen uygulama tarafından kullanıcının kimliğini doğrulamak için kullanılır)
    
2. Using the collected information the **Threat Replay Testing** module will create a list of about 100-150 test requests to the originally targeted endpoint but with different types of malicious payloads for the same type of attack (like SQLi). For example:

   Toplanan bilgiler kullanılarak **Threat Replay Testing** modülü, orijinal hedeflenen uç noktaya yönelik benzer saldırı türü (örneğin SQLi) için farklı kötü niyetli payload türleri içeren yaklaşık 100-150 test isteğinden oluşan bir liste oluşturur. Örneğin:

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

    !!! info "Malicious payloads do not harm your resources"
        Malicious payloads of generated requests do not include real malicious syntax, they are intended just to imitate the attack principle. As a result, they do not harm your resources.
    
    !!! info "Kötü niyetli payload'lar kaynaklarınıza zarar vermez"
        Oluşturulan isteklerin kötü niyetli payload'ları gerçek kötü amaçlı sözdizimini içermez; saldırı prensibini taklit etmek için tasarlanmıştır. Sonuç olarak, kaynaklarınıza zarar vermezler.
    
3. The **Threat Replay Testing** module will send generated test requests to the application bypassing the Wallarm protection (using the [allowlisting feature][allowlist-scanner-addresses]) and verify that the application at the specific endpoint is not vulnerable to the specific attack type. If the module suspects that the application has an actual security vulnerability, it will create an event with type [incident](../user-guides/events/check-attack.md#incidents).

   **Threat Replay Testing** modülü, Wallarm korumasını aşarak ( [allowlist-scanner-addresses][allowlist-scanner-addresses] özelliğini kullanarak) oluşturulan test isteklerini uygulamaya gönderir ve belirli uç noktadaki uygulamanın belirtilen saldırı türüne karşı savunmasız olmadığını doğrular. Eğer modül, uygulamada gerçek bir güvenlik açığı olduğundan şüphelenirse, [incident](../user-guides/events/check-attack.md#incidents) türünde bir olay oluşturur.

    !!! info "`User-Agent` HTTPS header value in the requests"
        The `User-Agent` HTTP header in the **Threat Replay Testing** module requests will have the value `Wallarm Threat-Verification (v1.x)`.
    
    !!! info "İsteklerdeki `User-Agent` HTTPS başlık değeri"
        **Threat Replay Testing** modülü isteklerindeki `User-Agent` HTTP başlık değeri `Wallarm Threat-Verification (v1.x)` olarak ayarlanır.
    
4. Detected security incidents are reported in Wallarm Console and are able to be dispatched to your security team via available third-party [Integrations](../user-guides/settings/integrations/integrations-intro.md) and [Triggers](../user-guides/triggers/triggers.md).

   Tespit edilen güvenlik olayları Wallarm Console'da bildirilir ve mevcut üçüncü taraf [Integrations](../user-guides/settings/integrations/integrations-intro.md) ve [Triggers](../user-guides/triggers/triggers.md) aracılığıyla güvenlik ekibinize iletilebilir.