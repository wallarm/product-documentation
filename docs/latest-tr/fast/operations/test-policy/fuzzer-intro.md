[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# Anomali Algılama Sürecinin Yapılandırılması: Genel Bakış

[Zafiyetlerin][gl-vuln] tespitine ek olarak, FAST fuzzer kullanarak [anomali][gl-anomaly]leri de tespit edebilir.

Bu dokümantasyon bölümü aşağıdaki noktaları açıklar:

* [Fuzzer’ın Çalışma İlkeleri][doc-fuzzer-internals]
* [Policy Editor kullanılarak Fuzzer’ın Yapılandırılması][doc-fuzzer-configuration]

??? info "Anomali örneği"
    Hedef uygulama [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/)’un anormal davranışı, [FAST uzantısı örneğinde](../../dsl/extensions-examples/mod-extension.md) gösterilmektedir.

    Bu hedef uygulama, kullanıcı adı ve parola yanlış kombinasyonuyla yapılan yetkilendirme isteğine genellikle `403 Unauthorized` kodu ve `Invalid email or password.` mesajıyla yanıt verir.

    Ancak, kullanıcı adı değerinin herhangi bir bölümünde `'` sembolü iletilirse, uygulama `500 Internal Server Error` kodu ve `...SequelizeDatabaseError: SQLITE_ERROR:...` mesajıyla yanıt verir; bu davranış anormaldir.

    Bu anomali herhangi bir zafiyetin doğrudan istismarına yol açmaz, ancak bir saldırgana uygulama mimarisi hakkında bilgi verir ve [SQL Injection](../../vuln-list.md#sql-injection) saldırısını gerçekleştirmeye yönlendirir.