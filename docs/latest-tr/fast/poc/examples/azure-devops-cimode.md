# FAST'ın Azure DevOps ile Entegrasyonu

FAST'ın CI MODE'deki entegrasyonu, `azure-pipelines.yml` dosyası aracılığıyla Azure DevOps pipeline'ında yapılandırılır. `azure-pipelines.yml` dosyasının ayrıntılı şeması [Azure DevOps resmi belgelerinde](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema) anlatılmıştır.

!!! info "Yapılandırılmış iş akışı"
    İleriki talimatlar zaten yapılandırılmış bir iş akışı gerektirir ve aşağıdaki noktalardan birine denk gelir:

    * Test otomasyonu uygulanmıştır. Bu durumda, FAST node token'ı [geçmelidir](#passing-fast-node-token) ve [request kaydı](#adding-the-step-of-request-recording) ve [güvenlik testi](#adding-the-step-of-security-testing) adımları eklenmelidir.
    * Temel taleplerin seti zaten kaydedilmiştir. Bu durumda, FAST node token'ı [geçmelidir](#passing-fast-node-token) ve [güvenlik testi](#adding-the-step-of-security-testing) adımı eklenmelidir.

## FAST Node Token'ını Geçmek

[FAST node token'ını](../../operations/create-node.md) güvenli bir şekilde kullanmak için, mevcut pipeline ayarlarınızı açın ve token değerini [Azure DevOps environment variable](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables) olarak geçirin.

![Azure DevOps environment variable geçişi](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## İsteği Kaydetme Adımını Eklemek

--8<-- "../include-tr/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda çalışan FAST node ile otomatik test adımının örneği"
    ```
    - iş: tests
      adımlar:
      - script: docker network create my-network
        displayName: 'Create my-network'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'Run test application on my-network'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'Run FAST node in recording mode on my-network'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'Run Selenium with FAST node as a proxy on my-network'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'Run automated tests on my-network'
      - script: docker stop selenium fast
        displayName: 'Stop Selenium and FAST node in recording mode'
    ```

## Güvenlik Testi Adımını Eklemek

Güvenlik testi kurulum yöntemi, test uygulamasında kullanılan kimlik doğrulama yöntemine bağlıdır:

* Kimlik doğrulama gerekiyorsa, güvenlik testi adımını, talep kaydetme adımıyla aynı işe ekleyin.
* Kimlik doğrulama gerekmiyorsa, güvenlik testi adımını pipelinenıza ayrı bir iş olarak ekleyin.

Güvenlik testini gerçekleştirmek için talimatlara uyun:

1. Test uygulamasının çalıştığından emin olun. Gerekirse, uygulamayı çalıştırmak için komut ekleyin.
2. Uygulamanın çalıştırılmasının __ardından__ diğer gerekli [variables](../ci-mode-testing.md#environment-variables-in-testing-mode) ile `CI_MODE=testing` modunda FAST Docker konteynırını çalıştırma komutu ekleyin.

    !!! info "Kaydedilmiş baz istek setini kullanım"
        Baz taleplerin seti başka bir pipeline'da kaydedildiyse, kaydın ID'sini [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkenine belirtin. Aksi takdirde, son kaydedilen set kullanılacaktır.

    Komutun örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Network"
    Güvenlik testinden önce, FAST node ve test uygulamasının aynı ağda çalıştığından emin olun.

??? info "Testing modunda çalışan FAST node ile otomatik test adımının örneği"
    Aşağıdaki örnekte, kimlik doğrulama gerektiren DVWA uygulaması test edildiğinden, güvenlik testi adımı, talep kaydetme adımıyla aynı işe eklenmiştir.

    ```
    saatler:
    - sahne: testing
      işler:
      - iş: tests
        adımlar:
        - script: docker network create my-network
          displayName: 'Create my-network'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'Run test application on my-network'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'Run FAST node in recording mode on my-network'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'Run Selenium with FAST node as a proxy on my-network'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'Run automated tests on my-network'
        - script: docker stop selenium fast
          displayName: 'Stop Selenium and FAST node in recording mode'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'Run FAST node in testing mode on my-network'
        - script: docker stop dvwa
          displayName: 'Stop test application'
        - script: docker network rm my-network
          displayName: 'Delete my-network'
    ```

## Testin Sonucunu Almak

Güvenlik testinin sonucu Azure DevOps arayüzünde görüntülenir.

![Testing modunda FAST node çalıştırmanın sonucu](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## Daha Fazla Örnek

FAST'ın Azure DevOps iş akışına entegrasyon örneklerini bizim [GitHub](https://github.com/wallarm/fast-examples) sayfamızda bulabilirsiniz.

!!! info "Daha fazla sorular"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bizimle iletişime geçin](mailto:support@wallarm.com).
