# FAST'in Bamboo ile entegrasyonu

CI MODE'de FAST'in Bamboo iş akışına entegrasyonu aşağıdaki yöntemlerden biriyle yapılandırılabilir:

* [YAML spesifikasyonu](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html) aracılığıyla
* [JAVA spesifikasyonu](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html) aracılığıyla
* [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html) aracılığıyla

Aşağıdaki örnek, entegrasyonu yapılandırmak için YAML spesifikasyonunu kullanır.

## FAST düğüm belirtecinin iletilmesi

[FAST düğüm belirtecini](../../operations/create-node.md) güvenli şekilde kullanmak için değerini bir [Bamboo global değişkeni](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html) olarak tanımlayın.

![Bamboo global değişkeninin iletilmesi](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek kaydı adımını ekleme

İstek kaydını uygulamak için otomatik uygulama testi işine aşağıdaki ayarları uygulayın:

1. Otomatik testleri çalıştıran komuttan önce, gerekli diğer [değişkenlerle](../ci-mode-recording.md#environment-variables-in-recording-mode) birlikte FAST Docker kapsayıcısını `CI_MODE=recording` modunda çalıştıran komutu ekleyin. Örneğin:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Otomatik testlerin FAST düğümü üzerinden proxy'lenmesini yapılandırın. Örneğin:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "Docker ağı"
    İstekleri kaydetmeden önce, FAST düğümünün ve otomatik test aracının aynı ağda çalıştığından emin olun.

??? info "FAST düğümünün kayıt modunda çalıştırıldığı otomatik test adımı örneği"
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

    Örnek aşağıdaki adımları içerir:

    1. `my-network` adlı Docker ağını oluşturun.
    2. `dvwa` test uygulamasını `my-network` ağında çalıştırın.
    3. FAST düğümünü `my-network` ağında kayıt modunda çalıştırın.
    4. Otomatik test aracı Selenium'u, FAST düğümünü proxy olarak kullanacak şekilde `my-network` ağında çalıştırın.
    5. Otomatik testleri `my-network` ağında çalıştırın.
    6. Otomatik test aracı Selenium'u ve kayıt modundaki FAST düğümünü durdurun.

## Güvenlik testi adımını ekleme

Güvenlik testini uygulamak için iş akışınıza aşağıdaki talimatları izleyerek ayrı bir adım ekleyin:

1. Test uygulaması çalışmıyorsa, uygulamayı çalıştırma komutunu ekleyin.
2. Uygulamayı çalıştıran komuttan sonra, gerekli diğer [değişkenlerle](../ci-mode-testing.md#environment-variables-in-testing-mode) birlikte FAST Docker kapsayıcısını `CI_MODE=testing` modunda çalıştıran komutu ekleyin.

    !!! info "Kaydedilmiş temel istek kümesini kullanma"
        Temel istek kümesi başka bir pipeline'da kaydedildiyse, [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkeninde kayıt kimliğini belirtin. Aksi halde, son kaydedilen küme kullanılacaktır.

    Komut örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker ağı"
    Güvenlik testinden önce, FAST düğümünün ve test uygulamasının aynı ağda çalıştığından emin olun.

??? info "Güvenlik testi adımı örneği"
    Komutlar, istek kaydı adımında oluşturulan `my-network` ağında çalıştırılmaktadır. Test uygulaması, `app-test`, de istek kaydı adımında çalıştırılmaktadır.

    1. `security_testing`i `stages` listesine ekleyin. Örnekte, bu adım iş akışını sonlandırır.

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
    2. Yeni `security_test` işinin gövdesini tanımlayın.

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

    Örnek aşağıdaki adımları içerir:

    1. FAST düğümünü `my-network` ağında test modunda çalıştırın. Temel istek kümesi mevcut pipeline'da oluşturulup en son kaydedilen olduğu için `TEST_RECORD_ID` değişkeni atlanmıştır. Test tamamlandığında FAST düğümü otomatik olarak durdurulacaktır.
    2. `dvwa` test uygulamasını durdurun.
    3. `my-network` ağını silin.

## Test sonucunu alma

Güvenlik testinin sonucu Bamboo UI içindeki derleme günlüklerinde görüntülenecektir. Ayrıca, Bamboo tam `.log` dosyasını indirmeye izin verir.

![FAST düğümünün test modunda çalıştırılmasının sonucu](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## Daha fazla örnek

FAST'in Bamboo iş akışına entegrasyonuna dair daha fazla örneği [GitHub](https://github.com/wallarm/fast-examples) üzerinde bulabilirsiniz.

!!! info "Daha fazla soru"
    FAST entegrasyonuyla ilgili sorularınız varsa lütfen [bizimle iletişime geçin](mailto:support@wallarm.com).