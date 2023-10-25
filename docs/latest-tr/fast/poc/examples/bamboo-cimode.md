# FAST'ın Bamboo ile Entegrasyonu

FAST'ın CI MODE'daki entegrasyonu aşağıdaki yöntemlerden biri kullanılarak Bamboo iş akışına yapılandırılabilir:

* [YAML spesifikasyonu](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html) aracılığıyla
* [JAVA spesifikasyonu](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html) aracılığıyla
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html) aracılığıyla

Aşağıdaki örnek, entegrasyonu yapılandırmak için YAML spesifikasyonunu kullanır.

## FAST Node Token'inin Geçirilmesi

[FAST node token](../../operations/create-node.md) değerini güvenli bir şekilde kullanmak için, [Bamboo genel değişken](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html) olarak geçirin.

![Bamboo genel değişkeninin geçirilmesi](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## Talep Kaydı Adımının Eklenmesi

Talep kaydını uygulamak için, otomatik uygulama testinin işine aşağıdaki ayarları uygulayın:

1. Otomatik testleri çalıştıran komut __öncesi__ diğer gerekli [değişkenler](../ci-mode-recording.md#environment-variables-in-recording-mode) ile birlikte `CI_MODE=kayıt` modunda FAST Docker konteynırını çalıştıran komutu ekleyin. Örneğin:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. FAST node aracılığıyla otomatik testlerin proxyingini yapılandırın. Örneğin:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! uyarı "Docker Ağı"
    Talepleri kaydetmeden önce, FAST node ve otomatik test aracının aynı ağı kullanıp kullanmadığını kontrol edin.

??? bilgi "FAST node'un kayıt modunda çalışırken otomatik test adımının örneği"
    ```
    test:
    key: TST
    tasks:
        - script:
            interpreter: /bin/sh
            scripts:
            - docker network create my-network
            - docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
            - docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
            - docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
            - docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
            - docker stop selenium fast
    ```

    Bir örnek aşağıdaki adımları içerir:

    1. Docker ağı `my-network` oluşturun.
    2. Test uygulaması `dvwa` üzerinde `my-network` ağını çalıştırın.
    3. Kayıt modunda olan FAST node'u `my-network` ağında çalıştırın.
    4. Otomatik test aracı Selenium'u, proxy olarak FAST node kullanarak `my-network` ağında çalıştırın.
    5. Otomatik testleri `my-network` ağı üzerinde çalıştırın.
    6. Kayıt modunda olan otomatik test aracı Selenium ve FAST node'u durdurun.

## Güvenlik Testi Adımının Eklenmesi

Güvenlik testini uygulamak için, talimatlara göre iş akışınıza ayrı ayrı adımlar ekleyin:

1. Test uygulaması çalışmıyorsa, uygulamayı çalıştıran komutu ekleyin.
2. Uygulamayı çalıştıran komut __sonrası__ diğer gerekli [değişkenler](../ci-mode-testing.md#environment-variables-in-testing-mode) ile birlikte `CI_MODE=test` modunda FAST Docker konteynırını çalıştıran komutu ekleyin.

    !!! bilgi "Kaydedilmiş temel talepler setinin kullanılması"
        Temel talepler seti başka bir pipeline'da kaydedildiyse, bu kayıt ID'sini [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkeninde belirtin. Aksi takdirde, son kaydedilen set kullanılacaktır.

    Komutun örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! uyarı "Docker Ağı"
    Güvenlik testinden önce, FAST node ve test uygulamasının aynı ağı kullanıp kullanmadığını kontrol edin.

??? bilgi "Güvenlik testi adımının örneği"
    Komutlar, talep kaydetme adımında oluşturulan `my-network` ağında çalışıyor. Test uygulaması, `app-test`, talep kaydetme adımında da çalışıyor.

    1. `stages` listesine `security_testing` ekleyin. Bu örnekte, bu adım iş akışını sonlandırır.

        ```
        stages:
        - testing:
            manual: false
            jobs:
                - test
        - security_testing:
            final: true
            jobs:
                - security_test
        ```
    2. Yeni işin `security_test` gövdesini tanımlayın.

        ```
        security_test:
        key: SCTST
        tasks:
            - script:
                interpreter: /bin/sh
                scripts:
                - docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
                - docker stop dvwa
                - docker network rm my-network
        ```

    Bir örnek aşağıdaki adımları içerir:

    1. Test modunda olan FAST node'u `my-network` ağında çalıştırın. `TEST_RECORD_ID` değişkeni atlanmıştır çünkü temel talepler seti mevcut pipeline'da oluşturulmuştur ve son kaydedilendir. Test tamamlandığında FAST node otomatik olarak duracaktır.
    2. Test uygulaması `dvwa` durdurun.
    3. `my-network` ağı silin.

## Testin Sonucunu Alma

Güvenlik testinin sonucu, Bamboo UI'deki oluşturma günlüklerinde görüntülenir. Ayrıca, Bamboo'nun tam `.log` dosyasını indirmesine izin verilir.

![FAST node'un test modunda çalışması sonucu](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## Daha Fazla Örnek

FAST'ın Bamboo iş akışına entegrasyonuna dair daha fazla örnek, [GitHub](https://github.com/wallarm/fast-examples) sayfamızda bulabilirsiniz.

!!! bilgi "Daha fazla sorunuz mu var?"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın](mailto:support@wallarm.com).