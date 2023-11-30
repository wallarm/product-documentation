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

# FAST'ın GitLab CI/CD ile Entegrasyonu

FAST'ın CI MODU, GitLab CI/CD iş akışına `~/.gitlab-ci.yml` dosyası aracılığıyla entegre edilmiştir. GitLab CI/CD iş akışı konfigürasyonu hakkında daha fazla bilgi [GitLab resmi belgelerinde][gitlabcicd-config-yaml] bulunabilir.

## FAST Düğüm Jetonunun Geçişi

[FAST düğüm jetonunu][fast-node-token] güvenli bir şekilde kullanmak için, değerini [proje ayarlarınızdaki değere göre][gitlabci-set-env-var] değiştirin.

![GitLab CI/CD environment variable'nın geçişi][gitlabci-example-env-var]

--8<-- "../include-tr/fast/fast-cimode-integration-examples/configured-workflow.md"

## İsteği Kaydetme Adımının Eklenmesi

--8<-- "../include-tr/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda FAST düğümünü çalıştırma adımının otomatize edilmiş test örneği"
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

    Bir örnek aşağıdaki adımları içerir:

    1. Docker network `my-network` oluşturun.
    2. `my-network` ağı üzerinde kayıt modunda FAST düğümünü çalıştırın.
    3. Otomatik test aracı Selenium'u, `my-network` ağı üzerinde bir proxy olarak FAST düğümüyle çalıştırın.
    4. Test uygulamasını ve otomatik testleri `my-network` ağı üzerinde çalıştırın.
    5. Selenium ve FAST düğümünü durdurun.

## Güvenlik Testinin Adımını Ekleme

--8<-- "../include-tr/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımının örneği"
    1. `stages` listesine `security_test` ekleyin.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. Yeni `security_test` aşamasının yapısını belirleyin.

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

    Bir örnek aşağıdaki adımları içerir:

    1. Docker network `my-network` oluşturun.
    2. Test uygulamasını `my-network` ağı üzerinde çalıştırın.
    3. `my-network` ağı üzerinde test modunda FAST düğümünü çalıştırın. `TEST_RECORD_ID` değişkeni atlanmıştır çünkü temel taleplerin seti mevcut pipeline'da oluşturulmuştur ve son kaydedilenlerdir. FAST düğümü, test bitene kadar otomatik olarak durdurulacaktır.
    4. Test uygulamasını durdurun.

## Test Sonucunun elde Edilmesi

Güvenlik testinin sonucu GitLab CI/CD arayüzünde görüntülenecektir.

![Test modunda FAST düğümünün çalıştırılmasının sonucu][fast-example-gitlab-result]

## Daha Fazla Örnek 

FAST'ın GitLab CI/CD iş akışına entegrasyon örneklerini [GitHub][fast-examples-github] ve [GitLab][fast-example-gitlab-cicd] sayfalarımızda bulabilirsiniz.

!!! info "Ek sorular"
    FAST entegrasyonu ile ilgili sorularınız varsa lütfen [bize ulaşın][mail-to-us].

## Demo videolar

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>