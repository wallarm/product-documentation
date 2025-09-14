[img-set-policy-in-gui]:    ../../../images/fast/operations/common/test-policy/overview/tr-gui-set-policy.png
[img-get-policy-id]:        ../../../images/fast/operations/common/test-policy/overview/get-policy-id.png

[doc-pol-tr-relations]:     ../internals.md#fast-test-policy
[doc-tr-creation-gui]:      ../create-testrun.md#creating-a-test-run-via-web-interface
[doc-tr-creation-api]:      ../create-testrun.md#creating-a-test-run-via-api
[doc-tr-copying-gui]:       ../copy-testrun.md#copying-a-test-run-via-web-interface
[doc-tr-copying-api]:       ../copy-testrun.md#copying-a-test-run-via-an-api

[doc-ci-mode]:              ../../poc/integration-overview-ci-mode.md
[doc-tr-pid-envvar]:        ../../poc/ci-mode-testing.md#environment-variables-in-testing-mode

[link-pol-list-eu]:         https://my.wallarm.com/testing/policies/     
[link-pol-list-us]:         https://us1.my.wallarm.com/testing/policies/


# Test Politikalarının Kullanımı

Test politikaları, güvenlik testleriyle [ilişkilidir][doc-pol-tr-relations]. Bir test yinelemesi oluşturulurken, her bir test politikası FAST node davranışını tanımlar ve belirtir.

Test politikasını aşağıdaki yollarla belirtebilirsiniz:

* Arayüzü kullanarak: test [oluşturuluyor][doc-tr-creation-gui] veya [kopyalanıyorsa][doc-tr-copying-gui], **Test policy** açılır listesinden politikayı seçin:

    ![Arayüz üzerinden test çalıştırması oluşturma sırasında test politikasını seçme][img-set-policy-in-gui]

* Test politika kimliğini (ID) belirtin:
    * test, API yöntemleriyle [oluşturuluyor][doc-tr-creation-api] veya [kopyalanıyorsa][doc-tr-copying-api], API isteğinde
    * testleri [FAST node][doc-ci-mode] içinde yönetiyorsanız [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] ortam değişkeninde
         
    Test politika kimliğini, Wallarm hesabınızdaki politika listesinde [AB bulutu][link-pol-list-eu] veya [ABD bulutu][link-pol-list-us] için bulabilirsiniz.

    ![Politika kimliğini alma][img-get-policy-id]

!!! info "Varsayılan test politikası"
    FAST otomatik olarak **Default Policy** oluşturur ve uygular. Bu politika, en yaygın kullanılan istek noktalarını kontrol ederek bir uygulamayı tipik güvenlik açıklarına karşı test eder.

    Lütfen varsayılan test politikasının ayarlarının değiştirilemeyeceğini unutmayın.