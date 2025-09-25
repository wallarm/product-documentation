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

# FAST'in GitLab CI/CD ile Entegrasyonu

CI MODE'da FAST'in GitLab CI/CD iş akışına entegrasyonu `~/.gitlab-ci.yml` dosyası aracılığıyla yapılandırılır. GitLab CI/CD iş akışı yapılandırması hakkında daha fazla ayrıntı [GitLab resmi dokümantasyonu][gitlabcicd-config-yaml] içinde mevcuttur.

## FAST Node Token'ını İletme

[FAST düğüm token'ını][fast-node-token] güvenli bir şekilde kullanmak için, değerini [proje ayarlarınızda bir ortam değişkeni][gitlabci-set-env-var] olarak iletin.

![GitLab CI/CD ortam değişkenini iletme][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydı Adımını Ekleme

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST düğümü ile otomatik test adımı örneği"
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

    Örnek aşağıdaki adımları içerir:

    1. `my-network` adlı Docker ağı oluşturun.
    2. FAST düğümünü `my-network` üzerinde kayıt modunda çalıştırın.
    3. `my-network` üzerinde FAST düğümünü proxy olarak kullanarak Selenium otomatik test aracını çalıştırın.
    4. Test uygulamasını ve otomatik testleri `my-network` üzerinde çalıştırın.
    5. Selenium'u ve FAST düğümünü durdurun.

## Güvenlik Testi Adımını Ekleme

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımı örneği"
    1. `stages` listesine `security_test` ekleyin.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. Yeni `security_test` aşamasının gövdesini tanımlayın.

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

    Örnek aşağıdaki adımları içerir:

    1. `my-network` adlı Docker ağı oluşturun.
    2. Test uygulamasını `my-network` üzerinde çalıştırın.
    3. FAST düğümünü `my-network` üzerinde test modunda çalıştırın. Temel istek kümesi mevcut pipeline'da oluşturulduğu ve son kaydedilen set olduğu için `TEST_RECORD_ID` değişkeni atlanmıştır. Test tamamlandığında FAST düğümü otomatik olarak duracaktır.
    4. Test uygulamasını durdurun.

## Test Sonucunu Alma

Güvenlik testi sonucu GitLab CI/CD arayüzünde görüntülenecektir.

![FAST düğümünün test modunda çalıştırılmasının sonucu][fast-example-gitlab-result]

## Daha Fazla Örnek

FAST'in GitLab CI/CD iş akışına entegrasyonu örneklerini [GitHub][fast-examples-github] ve [GitLab][fast-example-gitlab-cicd] üzerinde bulabilirsiniz.

!!! info "Daha fazla soru"
    FAST entegrasyonuyla ilgili sorularınız varsa, lütfen [bizimle iletişime geçin][mail-to-us].

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->