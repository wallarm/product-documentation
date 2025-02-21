[gitlabcicd-config-yaml]:       https://docs.gitlab.com/ee/ci
[fast-node-token]:              ../../operations/create-node.md
[gitlabci-set-env-var]:         https://docs.gitlab.com/ee/ci/variables/
[gitlabci-example-env-var]:     ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-env-var-example.png
[fast-example-gitlab-result]:   ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-gitlab-cicd]:     https://gitlab.com/wallarm/fast-example-gitlab-dvwa-integration

# GitLab CI/CD ile FAST Entegrasyonu

FAST'in CI MODE'daki entegrasyonu, GitLab CI/CD iş akışına `~/.gitlab-ci.yml` dosyası üzerinden yapılandırılır. GitLab CI/CD iş akışı yapılandırması hakkında daha fazla ayrıntıya [GitLab resmi dokümantasyonu][gitlabcicd-config-yaml]’ndan ulaşabilirsiniz.

## FAST Node Token'ının Geçirilmesi

[FAST node token'ını][fast-node-token] güvenli bir şekilde kullanmak için, değerini proje ayarlarınızda bulunan [ortam değişkeni][gitlabci-set-env-var] üzerinden iletin.

![GitLab CI/CD ortam değişkeninin geçirilmesi][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## Talep Kaydının Yapılması Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda FAST node ile otomatik test adımına örnek"
    ```
    test:
      stage: test
      script:
        - docker network create my-network 
        - docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network --rm wallarm/fast 
        - docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest 
        - docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb 
        - docker stop selenium fast
        - docker network rm my-network
    ```

    Bir örnek aşağıdaki adımları içermektedir:

    1. Docker ağı `my-network` oluşturulur.
    2. FAST node, `my-network` ağı üzerinde kayıt modunda çalıştırılır.
    3. Otomatik test aracı Selenium, FAST node'u proxy olarak kullanacak şekilde `my-network` ağı üzerinde çalıştırılır.
    4. Test uygulaması ve otomatik testler `my-network` ağı üzerinde çalıştırılır.
    5. Selenium ve FAST node durdurulur.

## Güvenlik Testi Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımına örnek"
    1. `stages` listesine `security_test` ekleyin.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. Yeni `security_test` adımının gövdesini tanımlayın.

        ```
          security_test:
            stage: security_test
            script:
              - docker network create my-network 
              - docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test
              - sleep 5 
              - docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast 
              - docker stop app-test
        ```

    Bir örnek aşağıdaki adımları içermektedir:

    1. Docker ağı `my-network` oluşturulur.
    2. Test uygulaması, `my-network` ağı üzerinde çalıştırılır.
    3. FAST node, `my-network` ağı üzerinde testing modunda çalıştırılır. Mevcut boru hattında oluşturulan ve son kaydedilen temel istek seti nedeniyle `TEST_RECORD_ID` değişkeni atlanır. Test tamamlandığında FAST node otomatik olarak duracaktır.
    4. Test uygulaması durdurulur.

## Test Sonuçlarının Alınması

Güvenlik testinin sonucu GitLab CI/CD arayüzünde görüntülenecektir.

![Testing modundaki FAST node’un çalıştırılmasının sonucu][fast-example-gitlab-result]

## Daha Fazla Örnek

FAST'in GitLab CI/CD iş akışına entegrasyonuna örnekleri [GitHub][fast-examples-github] ve [GitLab][fast-example-gitlab-cicd] üzerinden bulabilirsiniz.

!!! info "Daha Fazla Sorunuz mu Var?"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın][mail-to-us].

<!-- ## Demo videolar

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->