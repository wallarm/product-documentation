[img-custom-dsl-slider]:    ../../../images/fast/operations/en/test-policy/policy-editor/custom-slider.png

[link-user-extensions]:     ../../dsl/intro.md
[link-connect-extensions]:  ../../dsl/using-extension.md

[doc-fuzzer]:               fuzzer-intro.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability

[vuln-ptrav]:               ../../vuln-list.md#path-traversal
[vuln-rce]:                 ../../vuln-list.md#remote-code-execution-rce
[vuln-sqli]:                ../../vuln-list.md#sql-injection
[vuln-xss]:                 ../../vuln-list.md#cross-site-scripting-xss
[vuln-xxe]:                 ../../vuln-list.md#attack-on-xml-external-entity-xxe


#   Güvenlik Açığı Tespit Sürecinin Yapılandırılması

FAST, [güvenlik açıklarını][gl-vuln] aşağıdaki seçeneklerle tespit eder:

* Yerleşik FAST uzantıları
* [Özel uzantılar][link-user-extensions]

    !!! info "Özel uzantılar"
        Özel uzantıları kullanmak için, lütfen bunları FAST düğümüne [bağlayın][link-connect-extensions].

Uygulamadaki güvenlik açıklarının tespit edilme şeklini şu yollarla kontrol edebilirsiniz:

* Testleri yerleşik FAST uzantısını kullanarak gerçekleştirmek istiyorsanız, test etmek istediğiniz güvenlik açıklarının onay kutularını işaretleyin.
* Testleri, yerleşik FAST uzantılarını hariç tutup yalnızca özel uzantıları kullanarak gerçekleştirmek istiyorsanız, tüm onay kutularının işaretini kaldırın veya **Use only custom DSL** anahtarını etkinleştirip listeden güvenlik açıklarını seçin.

    ![Use only custom DSL anahtarı][img-custom-dsl-slider]

    Lütfen unutmayın: **Use only custom DSL** anahtarı etkinleştirilirse, yerleşik FAST uzantıları ve [FAST fuzzer][doc-fuzzer] devre dışı bırakılır. FAST fuzzer etkinleştirilirse, **Use only custom DSL** anahtarı tekrar pasif hale gelir.

!!! info "Temel güvenlik açıkları"
    Bir politika oluştururken, uygulamalarda tespit edilebilecek en tipik güvenlik açıkları varsayılan olarak seçilir:

    * [yol geçişi (PTRAV)][vuln-ptrav],
    * [uzaktan kod yürütme (RCE)][vuln-rce],
    * [SQL enjeksiyonu (SQLi)][vuln-sqli],
    * [siteler arası betik çalıştırma (XSS)][vuln-xss],
    * [XML dış varlık (XXE) saldırısına karşı güvenlik açığı][vuln-xxe].
    
    Özel politikalar kullanıyorsanız, dilediğiniz anda ilgili onay kutusunun işaretini kaldırarak uygulamanın belirli bir güvenlik açığına karşı test edilmesini devre dışı bırakabilirsiniz.