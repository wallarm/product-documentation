[jenkins-config-pipeline]:      https://jenkins.io/doc/book/pipeline
[fast-node-token]:              ../../operations/create-node.md
[jenkins-parameterized-build]:  https://wiki.jenkins.io/display/JENKINS/Parameterized+Build
[jenkins-example-env-var]:     ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-add-token-example.png
[fast-example-jenkins-result]:  ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-result-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

# FAST'in Jenkins ile Entegrasyonu

CI MODE'da FAST'in Jenkins iş akışına entegrasyonu `Jenkinsfile` dosyası üzerinden yapılandırılır. Jenkins iş akışı yapılandırması hakkında daha fazla ayrıntı [Jenkins resmi dokümantasyonu][jenkins-config-pipeline] içinde mevcuttur.

## FAST Düğüm Belirteci (Token) İletimi

[FAST düğüm belirtecini][fast-node-token] güvenli biçimde kullanmak için, değerini [proje ayarlarınızda bir ortam değişkeni olarak][jenkins-parameterized-build] iletin.

![Jenkins ortam değişkeninin iletilmesi][jenkins-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydı Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST düğümü ile otomatik test adımı örneği"
    ```
    stage('Run autotests with recording FAST node') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'run fast with recording', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'run selenium', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'run application', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'stop selenium', script: 'docker stop selenium'
             sh label: 'stop fast', script: 'docker stop fast'
             sh label: 'remove network', script: 'docker network rm my-network'
          }
       }
    ```

    Örnek aşağıdaki adımları içerir:

    1. `my-network` adlı Docker ağını oluşturun.
    2. FAST düğümünü `my-network` ağında kayıt modunda çalıştırın.
    3. `my-network` ağında FAST düğümünü proxy olarak kullanarak otomasyon test aracı Selenium'u çalıştırın.
    4. Test uygulamasını ve otomatik testleri çalıştırın.
    5. Selenium'u ve FAST düğümünü durdurun.
    6. `my-network` ağını silin.

## Güvenlik Testi Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testi adımı örneği"

    ```
    stage('Run security tests') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'start application', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'run fast in testing mode', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'stop application', script: ' docker stop app-test '
            sh label: 'remove network', script: ' docker network rm my-network '
          }
       }
    ```

    Örnek aşağıdaki adımları içerir:

    1. `my-network` adlı Docker ağını oluşturun.
    2. Test uygulamasını `my-network` ağında çalıştırın.
    3. FAST düğümünü `my-network` ağında test modunda çalıştırın. `TEST_RECORD_ID` değişkeni atlanmıştır çünkü temel istek kümesi mevcut pipeline içinde oluşturulmuştur ve en son kaydedilendir. Test tamamlandığında FAST düğümü otomatik olarak duracaktır.
    4. Test uygulamasını durdurun.
    5. `my-network` ağını silin.

## Test Sonucunun Elde Edilmesi

Güvenlik testinin sonucu Jenkins arayüzünde görüntülenecektir.

![Test modunda çalışan FAST düğümünün sonucu][fast-example-jenkins-result]

## Daha Fazla Örnek

FAST'in Jenkins iş akışına entegrasyonuna yönelik örnekleri [GitHub][fast-examples-github]'ımızda bulabilirsiniz.

!!! info "Daha fazla soru"
    FAST entegrasyonuyla ilgili sorularınız varsa lütfen [bizimle iletişime geçin][mail-to-us].