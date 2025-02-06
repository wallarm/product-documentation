# Bamboo ile FAST Entegrasyonu

FAST'ın CI MODE'daki Bamboo iş akışına entegrasyonu, aşağıdaki yöntemlerden biri kullanılarak yapılandırılabilir:

* [YAML specification](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html) aracılığıyla
* [JAVA specification](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html) aracılığıyla
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html) aracılığıyla

Aşağıdaki örnek, entegrasyonu yapılandırmak için YAML specification'ı kullanır.

## FAST Node Token'ının Aktarılması

[FAST node token](../../operations/create-node.md) güvenli bir şekilde kullanmak için, değerini [Bamboo global değişkeni](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html) içerisinde geçirin.

![Bamboo global değişkeninin aktarılması](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydının Adımının Eklenmesi

İstek kaydını uygulamak için, otomatik uygulama testi işine aşağıdaki ayarları uygulayın:

1. Otomatik test komutundan __önce__, diğer gerekli [değişkenlerle](../ci-mode-recording.md#environment-variables-in-recording-mode) birlikte `CI_MODE=recording` modunda FAST Docker konteynerini çalıştıran komutu ekleyin. Örneğin:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Otomatik testleri FAST node üzerinden proxylemek için yapılandırma yapın. Örneğin:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Docker Ağı"
    İstekler kaydedilmeden önce, FAST node ile otomatik test aracının aynı ağ üzerinde çalıştığından emin olun.

??? info "Kayıt modunda FAST node çalıştırılırken otomatik test adımına dair örnek"
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

    1. `my-network` Docker ağını oluşturun.
    2. `dvwa` test uygulamasını `my-network` ağı üzerinde çalıştırın.
    3. `my-network` ağı üzerinde kayıt modunda FAST node'u çalıştırın.
    4. `my-network` ağı üzerinde FAST node'u proxy olarak kullanarak Selenium otomatik test aracını çalıştırın.
    5. `my-network` ağı üzerinde otomatik testleri çalıştırın.
    6. Selenium otomatik test aracını ve kayıt modundaki FAST node'u durdurun.

## Güvenlik Testi Adımının Eklenmesi

Güvenlik testini uygulamak için, aşağıdaki talimatları izleyerek iş akışınıza ayrı bir adım ekleyin:

1. Eğer test uygulaması çalışmıyorsa, uygulamayı çalıştıracak komutu ekleyin.
2. Uygulamayı çalıştıran komuttan __sonra__, diğer gerekli [değişkenlerle](../ci-mode-testing.md#environment-variables-in-testing-mode) birlikte `CI_MODE=testing` modunda FAST Docker konteynerini çalıştıran komutu ekleyin.

    !!! info "Kaydedilmiş baz istek setini kullanma"
        Eğer baz istek seti başka bir boru hattında kaydedildiyse, [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkeninde kayıt kimliğini belirtin. Aksi halde, son kaydedilen set kullanılacaktır.

    Komut örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Ağı"
    Güvenlik testinden önce, FAST node ile test uygulamasının aynı ağ üzerinde çalıştığından emin olun.

??? info "Güvenlik test adımına dair örnek"
    Komutlar, istek kaydı adımında oluşturulan `my-network` ağı üzerinde çalıştırılmaktadır. Test uygulaması, `app-test`, de istek kaydı adımında çalışmaktadır.

    1. `stages` listesine `security_testing` ekleyin. Örnekte, bu adım iş akışını sonlandırır.

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
    2. Yeni iş `security_test`'in yapılandırmasını tanımlayın.

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

    1. `my-network` ağı üzerinde testing modunda FAST node'u çalıştırın. Kayıtlı baz istek seti mevcut boru hattında oluşturulduğu ve son kaydedilen olduğu için `TEST_RECORD_ID` değişkeni belirtilmemiştir. Testing tamamlandığında FAST node otomatik olarak durdurulacaktır.
    2. `dvwa` test uygulamasını durdurun.
    3. `my-network` ağını silin.

## Test Sonuçlarının Alınması

Güvenlik testinin sonucu Bamboo UI'deki build log'larında görüntülenecektir. Ayrıca, Bamboo tam `.log` dosyasını indirme imkanı da sunar.

![Testing modunda FAST node'un çalıştırılmasının sonucu](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## Daha Fazla Örnek

FAST'ın Bamboo iş akışına entegrasyonuna dair daha fazla örneğe [GitHub](https://github.com/wallarm/fast-examples) adresinden ulaşabilirsiniz.

!!! info "İleri Düzey Sorular"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın](mailto:support@wallarm.com).