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

# FAST'ın CircleCI ile Entegrasyonu

FAST'ın CI MOD'unun CircleCI iş akışına entegrasyonu, `~/.circleci/config.yml` dosyası aracılığıyla yapılandırılır. CircleCI iş akışı yapılandırması hakkında daha fazla ayrıntı, [CircleCI resmi belgelerinde][circleci-config-yaml] bulunur.

## FAST Node Token'ını Geçme

[FAST node token'ını][fast-node-token] güvenli bir şekilde kullanmak için, değerini [proje ayarlarınızdaki çevre değişkenine][circleci-set-env-var] geçin.

![CircleCI çevre değişkeni geçme][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydetme Adımını Ekleme

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "FAST'ın kayıt modunda çalışan düğümünün otomatik test adımı örneği"
    ```
    - run:
          name: Testleri ve FAST kaydını başlat
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    Örnekte şu adımlar bulunur:

    1. 'my-network' adlı Docker ağı oluşturma.
    2. 'my-network' ağı üzerinde kayıt modunda FAST düğümünü çalıştırma.
    3. 'my-network' ağı üzerinde FAST düğümünü proxy olarak kullanan otomatik test aracı Selenium'u çalıştırma.
    4. 'my-network' ağı üzerinde test uygulamasını ve otomatik testleri çalıştırma.
    5. Otomatik test aracı Selenium'u ve kayıt modunda olan FAST düğümünü durdurma.

## Güvenlik Testinin Adımını Ekleme

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik test adımının örneği"
    ```
    - run:
        name: FAST testlerini başlat
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    Örnekte şu adımlar bulunur:

    1. 'my-network' adlı ağda test uygulamasını çalıştırma.
    2. 'my-network' ağı üzerinde FAST düğümünü test modunda çalıştırma. `TEST_RECORD_ID` değişkeni göz ardı edilmiştir çünkü baseline taleplerinin kümesi mevcut pipeline'da oluşturuldu ve son kaydedilendir. Testler tamamlandığında FAST düğümü otomatik olarak duracaktır.
    3. Test uygulamasını durdurma.

## Test Sonucunu Alma

Güvenlik testinin sonucu CircleCI arayüzünde görüntülenecektir.

![Test modunda FAST düğümünün çalıştırılmasının sonucu][fast-example-result]

## Daha Fazla Örnek

CircleCI iş akışına FAST entegrasyonunun örneklerini [GitHub][fast-examples-github] ve [CircleCI][fast-example-circleci] hizmetlerimizde bulabilirsiniz.

!!! info "Daha fazla sorularınız mı var?"
    FAST entegrasyonuyla ilgili sorularınız varsa, lütfen [bizimle iletişime geçin][mail-to-us].
