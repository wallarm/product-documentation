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


# Test Politikalarını Kullanma

Test politikaları, güvenlik testleri ile [ilişkili][doc-pol-tr-relations] durumdadır. Bir test tekrarı oluştururken, her test politikası FAST node davranışını tanımlar ve belirler.

Test politikasını aşağıdaki yollarla belirtebilirsiniz:

* Arayüzü kullanarak; test [oluşturulmuşsa][doc-tr-creation-gui] veya [kopyalanmışsa][doc-tr-copying-gui], **Test policy** açılır listesinden ilgili politikayı seçin:

    ![Arayüz üzerinden test politikası seçimi][img-set-policy-in-gui]

* Test politika ID'sini belirtin:
    * Test, API yöntemleriyle [oluşturulmuşsa][doc-tr-creation-api] veya [kopyalanmışsa][doc-tr-copying-api] API isteğinde
    * Test yönetimini [FAST node][doc-ci-mode] ile gerçekleştiriyorsanız, [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] ortam değişkeninde
        
    Test politika ID’sini, Wallarm hesabınızdaki [EU cloud][link-pol-list-eu] veya [US cloud][link-pol-list-us] için politika listesinden bulabilirsiniz.

    ![Politika ID alma][img-get-policy-id]

!!! info "Default test policy"
    FAST otomatik olarak **Default Policy** oluşturur ve uygular. Bu politika, uygulamadaki tipik güvenlik açıklarını, en sık kullanılan istek noktalarını kontrol ederek test eder.

    Lütfen varsayılan test politikasının ayarlarının değiştirilemeyeceğini unutmayın.