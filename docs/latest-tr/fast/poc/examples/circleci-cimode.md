```markdown
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

# CircleCI ile FAST Entegrasyonu

FAST'ın CI MODE'daki entegrasyonu, CircleCI iş akışına `~/.circleci/config.yml` dosyası aracılığıyla yapılandırılır. CircleCI iş akışı yapılandırması hakkında daha fazla ayrıntıyı [CircleCI resmi dokümantasyonunda][circleci-config-yaml] bulabilirsiniz.

## FAST Node Token'ını Aktarma

Güvenli bir şekilde [FAST node token'ını][fast-node-token] kullanmak için, değerini proje ayarlarınızda bulunan [ortam değişkeni][circleci-set-env-var] olarak iletin.

![CircleCI ortam değişkeninin aktarılması][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydı Adımını Eklemek

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST node ile otomatik test adımı örneği"
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

    Bir örnek aşağıdaki adımları içermektedir:

    1. `my-network` adlı Docker ağını oluşturun.
    2. `my-network` ağı üzerinde kayıt modunda FAST node'u çalıştırın.
    3. FAST node'u proxy olarak kullanarak otomatik test aracı Selenium'u `my-network` ağı üzerinde çalıştırın.
    4. Test uygulamasını ve otomatik testleri `my-network` ağı üzerinde çalıştırın.
    5. Otomatik test aracı Selenium ve kayıt modundaki FAST node'u durdurun.

## Güvenlik Testi Adımını Eklemek

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımının örneği"
    ```
    - run:
        name: Start FAST tests
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    Bir örnek aşağıdaki adımları içermektedir:

    1. `my-network` ağı üzerinde test uygulamasını çalıştırın.
    2. `my-network` ağı üzerinde testing modunda FAST node'u çalıştırın. Mevcut pipeline içinde oluşturulan ve son kaydedilen temel isteklere sahip olduğu için `TEST_RECORD_ID` değişkeni atlanır. Test tamamlandığında FAST node otomatik olarak durdurulacaktır.
    3. Test uygulamasını durdurun.

## Test Sonuçlarının Alınması

Güvenlik testi sonuçları CircleCI arayüzünde görüntülenecektir.

![Testing modunda çalışan FAST node'un sonucu][fast-example-result]

## Daha Fazla Örnek

FAST'ın CircleCI iş akışına entegrasyon örneklerini [GitHub][fast-examples-github] ve [CircleCI][fast-example-circleci]'te bulabilirsiniz.

!!! info "Daha Fazla Sorunuz Var?"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın][mail-to-us].
```