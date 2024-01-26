[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# Anomali Tespit Süreci Konfigürasyonu: Genel Bakış

[vulnerabilities][gl-vuln] tespitinin yanı sıra, FAST [anomalies][gl-anomaly] tespit edebilir *fuzzer* kullanarak.

Bu belgeleme bölümü aşağıdaki noktaları açıklar:

* [Fuzzer İşlem Prensipleri][doc-fuzzer-internals]
* [Politika Editörünü Kullanarak Fuzzer Konfigürasyonu][doc-fuzzer-configuration]

??? bilgi "Anomali örneği"
    Hedef uygulamanın [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) anormal davranışı, [FAST eklentisinin örneği](../../dsl/extensions-examples/mod-extension.md)nde gösterilmiştir.

    Bu hedef uygulama genellikle yanıltıcı bir kullanıcı adı ve şifre kombinasyonu ile gelen yetkilendirme isteğine `403 Yetkisiz` kodu ve `Geçersiz e-posta veya şifre.` mesajı ile yanıt verir.

    Ancak, giriş değerinin herhangi bir parçası içinde `'` sembolü geçerse, uygulama `500 Dahili Sunucu Hatası` kodu ve `...SequelizeDatabaseError: SQLITE_ERROR:...` mesajı ile yanıt verir; bu davranış anormaldir.

    Bu anomali, herhangi bir güvenlik açığının doğrudan kötüye kullanılmasına yol açmaz, ancak bir saldırganı uygulamanın mimarisi hakkında bilgi edinmeye ve [SQL Enjeksiyonu](../../vuln-list.md#sql-injection) saldırısını gerçekleştirmeye teşvik eder.