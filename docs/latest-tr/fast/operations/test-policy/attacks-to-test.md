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

FAST, aşağıdaki seçenekler kullanılarak [güvenlik açıklarını][gl-vuln] tespit eder:

* Dahili FAST eklentileri
* [Özel eklentiler][link-user-extensions]

    !!! info "Özel eklentiler"
        Özel eklentileri kullanmak için, lütfen onları FAST düğümüne [bağlayın][link-connect-extensions].

Uygulamadaki güvenlik açıklarının tespit şeklini aşağıdaki şekillerde kontrol edebilirsiniz:

* Dahili FAST eklentisi kullanarak testler gerçekleştirmek istiyorsanız, testlerini çalıştırmak istediğiniz güvenlik açığı onay kutularını işaretleyin.
* Sadece özelleştirilmiş eklentileri kullanarak ve dahili FAST eklentilerini dahil etmeden testler gerçekleştirmek istiyorsanız, tüm onay kutularının işaretini kaldırın veya **Yalnızca özel DSL kullan** anahtarını etkinleştirin ve listeden güvenlik açıklarını seçin.

    ![Özel DSL anahtarı][img-custom-dsl-slider]

    Lütfen **Yalnızca özel DSL kullan** anahtarı etkinleştirildiğinde, dahili FAST eklentileri ve [FAST fuzzer][doc-fuzzer] devre dışı bırakılacaktır. Eğer FAST fuzzer etkinleştirilmişse, **Yalnızca özel DSL kullan** anahtarı tekrar pasif hale gelecektir.

!!! info "Temel güvenlik açıklıkları"
    Bir politika oluştururken, uygulamalarda tespit edilebilecek en tipik güvenlik açıklıkları varsayılan olarak seçilmiştir:

    * [yol geçişi (PTRAV)][vuln-ptrav],
    * [uzaktan kod yürütme (RCE)][vuln-rce],
    * [SQL enjeksiyonu (SQLi)][vuln-sqli],
    * [siteler arası betik çalıştırma (XSS)][vuln-xss],
    * [XML dış varlık saldırısına karşı güvenlik açığı (XXE)][vuln-xxe].
    
    Eğer özel politikalar kullanıyorsanız, belirli bir güvenlik açığı için uygulamanın testini istediğiniz an onay kutusunun işaretini kaldırarak devre dışı bırakabilirsiniz.
