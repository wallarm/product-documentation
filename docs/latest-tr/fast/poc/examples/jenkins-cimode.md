[jenkins-config-pipeline]:      https://jenkins.io/doc/book/pipeline
[fast-node-token]:              ../../operations/create-node.md
[jenkins-parameterized-build]:  https://wiki.jenkins.io/display/JENKINS/Parameterized+Build
[jenkins-example-env-var]:     ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-add-token-example.png
[fast-example-jenkins-result]:  ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-result-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

# FAST'ın Jenkins ile Entegrasyonu

FAST'ın CI MODE'a Jenkins iş akışına entegrasyonu, `Jenkinsfile` dosyası üzerinden yapılandırılır. Jenkins iş akışı yapılandırması hakkında daha fazla detay [Jenkins resmi belgelerinde][jenkins-config-pipeline] bulunabilir.

## FAST Node Token'ını Geçmek

[FAST node token'ını][fast-node-token] güvenli bir şekilde kullanmak için değerini [projede ayarlarınızda olan ortam değişkeninde][jenkins-parameterized-build] geçirin.

![Jenkins ortam değişkenini geçme][jenkins-example-env-var]

--8<-- "../include-tr/fast/fast-cimode-integration-examples/configured-workflow.md"

## İstek Kaydının Adımını Eklemek

--8<-- "../include-tr/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST düğümü ile otomatik test adımının örneği"
    ```
    stage('Run autotests with recording FAST node') {
          steps {
             sh label: 'network oluştur', script: 'docker network create my-network'
             sh label: 'kayıt ile fast çalıştır', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'selenium çalıştır', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'uygulama çalıştır', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'selenium durdur', script: 'docker stop selenium'
             sh label: 'fast durdur', script: 'docker stop fast'
             sh label: 'network sil', script: 'docker network rm my-network'
          }
       }
    ```

    Örnek, aşağıdaki adımları içerir:

    1. Docker network'ünü `my-network` olarak oluşturun.
    2. `my-network` isimli network üzerinde kayıt modunda FAST düğümünü çalıştırın.
    3. `my-network` isimli network üzerinde FAST düğümünün proxy olarak otomatik test aracı Selenium'u çalıştırın.
    4. Test uygulamasını ve otomatik testleri çalıştırın.
    5. Selenium ve FAST düğümünü durdurun.
    6. `my-network` isimli network'ü silin.

## Güvenlik Testinin Adımını Eklemek

--8<-- "../include-tr/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Güvenlik testinin adımı örneği"

    ```
    stage('Run security tests') {
          steps {
             sh label: 'network oluştur', script: 'docker network create my-network'
             sh label: 'uygulamayı başlat', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'test modunda fast çalıştır', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'uygulamayı durdur', script: ' docker stop app-test '
             sh label: 'network sil', script: ' docker network rm my-network '
          }
       }
    ```

    Örnek, aşağıdaki adımları içerir:

    1. Docker network'ünü `my-network` olarak oluşturun.
    2. `my-network` isimli network üzerinde test uygulamasını çalıştırın.
    3. `TEST_RECORD_ID` değişkeni göz ardı edildi çünkü temel talepler seti bu pipeline üzerinde oluşturuldu ve son kaydedilendir. Testler bittiğinde FAST düğümü otomatik olarak durdurulacaktır.
    4. Test uygulamasını durdurun.
    5. `my-network` network'ünü silin.

## Testin Sonucunu Alma

Güvenlik testinin sonucu, Jenkins arayüzünde görüntülenecektir.

![Test modunda FAST node'un çalıştırılmasının sonucu][fast-example-jenkins-result]

## Daha Fazla Örnek

FAST'ın Jenkins iş akışına entegrasyonuna dair örnekleri [GitHub][fast-examples-github] üzerinde bulabilirsiniz.

!!! info "Daha fazla sorularınız mı var?"
    FAST entegrasyonu ile ilgili sorularınız varsa lütfen [bize ulaşın][mail-to-us].