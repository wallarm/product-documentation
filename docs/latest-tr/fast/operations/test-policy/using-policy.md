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

Test politikaları, güvenlik testleri ile [ilişkilidir][doc-pol-tr-relations]. Bir test döngüsü oluştururken, her test politikası FAST düğüm davranışını tanımlar ve belirtir.

Test politikasını aşağıdaki yollarla belirtebilirsiniz:

* Arayüz kullanılarak, test [oluşturulduğunda][doc-tr-creation-gui] veya [kopyalandığında][doc-tr-copying-gui], o zaman **Test politikası** açılır listesinden politikayı seçin:

    ![Arayüz üzerinden test döngüsü oluştururken test politikasını seçme][img-set-policy-in-gui]

* Test politikasını ID'sini belirtin:
    * API isteğinde test [oluşturulduğunda][doc-tr-creation-api] veya [kopyalandığında][doc-tr-copying-api] API metotları üzerinden
    * [FAST düğümde][doc-ci-mode] test yönetiliyorsa [`TEST_RUN_POLICY_ID`][doc-tr-pid-envvar] ortam değişkeninde
        
    Test politikası ID'sini Wallarm hesabınızdaki politikalar listesinde [EU bulutu][link-pol-list-eu] veya [US bulutu][link-pol-list-us] için bulabilirsiniz.

    ![Politika ID'sini alma][img-get-policy-id]

!!! info "Varsayılan test politikası"
    FAST otomatik olarak **Varsayılan Politika** oluşturur ve uygular. Bu politika, uygulamayı, en sık kullanılan istek noktalarını kontrol ederek tipik zafiyetler için test eder.

    Lütfen varsayılan test politikasının ayarlarının değiştirilemez olduğunu dikkate alın.