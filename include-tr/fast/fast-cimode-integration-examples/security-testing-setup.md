Güvenlik testini uygulamak için, aşağıdaki talimatları izleyerek iş akışınıza ilgili ayrı bir adım ekleyin:

1. Test uygulaması çalışmıyorsa, uygulamayı başlatma komutunu ekleyin.
2. Uygulamayı çalıştıran komuttan __sonra__, `CI_MODE=testing` modunda ve gerekli diğer [değişkenlerle](../ci-mode-testing.md#environment-variables-in-testing-mode) FAST Docker konteynerini çalıştıran komutu ekleyin.

    !!! info "Kayıtlı temel istekler kümesinin kullanılması"
        Temel istekler kümesi başka bir pipeline'da kaydedildiyse, kayıt kimliğini [TEST_RECORD_ID][fast-ci-mode-test] değişkeninde belirtin. Aksi takdirde, son kaydedilen küme kullanılacaktır.

    Komut örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker ağı"
    Güvenlik testinden önce, FAST node ile test uygulamasının aynı ağda çalıştığından emin olun.