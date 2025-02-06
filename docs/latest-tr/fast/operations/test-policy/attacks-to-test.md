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


#   Güvenlik Açığı Tespit Süreç Yapılandırması

FAST, [açıkları][gl-vuln] aşağıdaki seçenekleri kullanarak tespit eder:

* Yerleşik FAST eklentileri
* [Özel eklentiler][link-user-extensions]

    !!! info "Özel eklentiler"
        Özel eklentileri kullanmak için, lütfen onları FAST düğümüne [bağlayın][link-connect-extensions].

Uygulamadaki açıkları tespit etme yöntemini aşağıdaki şekillerde kontrol edebilirsiniz:

* Yerleşik FAST eklentisini kullanarak testler gerçekleştirmek istiyorsanız, test etmek istediğiniz açıkların kutucuklarını işaretleyin.
* Yalnızca yerleşik FAST eklentileri hariç özel eklentileri kullanarak testler gerçekleştirmek istiyorsanız, tüm kutucukların işaretini kaldırın veya **Yalnızca özel DSL kullan** anahtarını etkinleştirip listeden açıkları seçin.

    ![Özel DSL anahtarı][img-custom-dsl-slider]

    Lütfen, **Yalnızca özel DSL kullan** anahtarı etkinleştirildiyse, yerleşik FAST eklentilerinin ve [FAST fuzzer][doc-fuzzer]in devre dışı bırakılacağını unutmayın. FAST fuzzer etkinleştirilirse, **Yalnızca özel DSL kullan** anahtarı tekrar devre dışı kalacaktır.

!!! info "Temel açılar"
    Bir politika oluştururken, uygulamalarda tespit edilebilen en tipik açıklar varsayılan olarak seçilir:

    * [path traversal (PTRAV)][vuln-ptrav],
    * [remote code execution (RCE)][vuln-rce],
    * [SQL injection (SQLi)][vuln-sqli],
    * [cross-site scripting (XSS)][vuln-xss],
    * [XML dış etkiye karşı duyarlılık (XXE) saldırısına açıklık][vuln-xxe].
    
    Özel politikalar kullanıyorsanız, istediğiniz anda ilgili kutucuğun işaretini kaldırarak belirli bir açığın test edilmesini devre dışı bırakabilirsiniz.