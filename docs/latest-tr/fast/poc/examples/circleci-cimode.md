[circleci-config-yaml]:         https://circleci.com/docs/2.0/writing-yaml/#section=configuration
[fast-node-token]:              ../../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[fast-example-result]:          ../../../images/fast/poc/common/examples/circleci-cimode/circleci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-circleci]:        https://circleci.com/gh/wallarm/fast-example-circleci-dvwa-integration


# FAST'in CircleCI ile Entegrasyonu

CI MODE'de FAST'in CircleCI iş akışına entegrasyonu `~/.circleci/config.yml` dosyası üzerinden yapılandırılır. CircleCI iş akışı yapılandırması hakkında daha fazla bilgi için [CircleCI resmi dokümantasyonuna][circleci-config-yaml] bakın.

## FAST Düğüm Belirtecinin Aktarılması

[FAST düğüm belirtecini][fast-node-token] güvenli şekilde kullanmak için, değerini [proje ayarlarınızda bir ortam değişkeni][circleci-set-env-var] olarak iletin.

![CircleCI ortam değişkeninin iletilmesi][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydı Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST düğümü ile otomatikleştirilmiş test adımı örneği"
    ```
    - run:
          name: Start tests & FAST record
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    Örnek aşağıdaki adımları içerir:

    1. Docker ağı `my-network`'i oluşturun.
    2. FAST düğümünü `my-network` ağında kayıt modunda çalıştırın.
    3. Otomatik test aracı Selenium'u, FAST düğümünü proxy olarak kullanarak `my-network` ağında çalıştırın.
    4. Test uygulamasını ve otomatik testleri `my-network` ağında çalıştırın.
    5. Otomatik test aracı Selenium'u ve kayıt modundaki FAST düğümünü durdurun.

## Güvenlik Testi Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımı örneği"
    ```
    - run:
        name: Start FAST tests
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    Örnek aşağıdaki adımları içerir:

    1. Test uygulamasını `my-network` ağında çalıştırın.
    2. FAST düğümünü `my-network` ağında test modunda çalıştırın. Temel istekler kümesi mevcut pipeline içinde oluşturulup en son kaydedilen olduğu için `TEST_RECORD_ID` değişkeni atlanmıştır. Test tamamlandığında FAST düğümü otomatik olarak duracaktır.
    3. Test uygulamasını durdurun.

## Test Sonucunun Alınması

Güvenlik testinin sonucu CircleCI arayüzünde görüntülenecektir.

![Test modunda FAST düğümünün çalıştırılmasının sonucu][fast-example-result]

## Daha Fazla Örnek

FAST'in CircleCI iş akışına entegrasyonuna ilişkin örnekleri [GitHub][fast-examples-github] ve [CircleCI][fast-example-circleci] üzerinde bulabilirsiniz.

!!! info "Daha fazla soru"
    FAST entegrasyonuyla ilgili sorularınız varsa, lütfen [bizimle iletişime geçin][mail-to-us].