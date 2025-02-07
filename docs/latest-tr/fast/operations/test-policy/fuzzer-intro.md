[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# Anomali Tespit Süreci Yapılandırması: Genel Bakış

[vulnerabilities][gl-vuln] tespitinin yanı sıra, FAST *fuzzer* kullanarak [anomalies][gl-anomaly] tespit edebilir.

Bu dokümantasyon bölümü aşağıdaki noktaları anlatmaktadır:

* [Fuzzer Operasyon Prensipleri][doc-fuzzer-internals]
* [Politika Düzenleyici Kullanılarak Fuzzer Yapılandırması][doc-fuzzer-configuration]

??? info "Anomali örneği"
    Hedef uygulamanın [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) anormal davranışı [FAST uzantı örneğinde](../../dsl/extensions-examples/mod-extension.md) gösterilmiştir.

    Bu hedef uygulama, genellikle yanlış giriş ve şifre kombinasyonu ile yapılan yetkilendirme isteğine `403 Unauthorized` kodu ve `Invalid email or password.` mesajı ile yanıt verir.

    Ancak, giriş değerinin herhangi bir bölümünde `'` sembolü kullanıldığında, uygulama `500 Internal Server Error` kodu ve `...SequelizeDatabaseError: SQLITE_ERROR:...` mesajı ile yanıt verir; bu davranış anomaldir.

    Bu anomali, herhangi bir zafiyetin doğrudan istismarına yol açmamakta, ancak saldırgana uygulama mimarisi hakkında bilgi sunmakta ve [SQL Injection](../../vuln-list.md#sql-injection) saldırısını gerçekleştirmesi için bir çağrı niteliğindedir.