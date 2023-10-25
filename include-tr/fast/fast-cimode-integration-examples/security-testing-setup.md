Güvenlik testini uygulamak için, bu talimatları izleyerek akışınıza uygun ayrı bir adım ekleyin:

1. Test uygulaması çalışmıyorsa, uygulamayı çalıştırma komutunu ekleyin.
2. `CI_MODE=testing` modunda FAST Docker konteynırını çalıştıran komutu ile diğer gerekli [değişkenler](../ci-mode-testing.md#environment-variables-in-testing-mode) uygulamayı çalıştıran komuttan __sonra__ ekleyin.

    !!! bilgi "Kaydedilmiş temel talep setinin kullanılması"
        Temel taleplerin seti başka bir hattında kaydedildiyse, kayıt kimliğini [TEST_RECORD_ID][fast-ci-mode-test] değişkeninde belirtin. Aksi takdirde, son kaydedilen set kullanılacaktır.

    Komutun örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! uyarı "Docker Ağı"
    Güvenlik testinden önce, FAST düğümünün ve test uygulamasının aynı ağda çalıştığından emin olun.