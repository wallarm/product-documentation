# FAST'in Azure DevOps ile Entegrasyonu

CI MODE'da FAST'in Azure DevOps pipeline'ına entegrasyonu `azure-pipelines.yml` dosyası üzerinden yapılandırılır. `azure-pipelines.yml` dosyasının ayrıntılı şeması [Azure DevOps resmi dokümantasyonunda](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema) açıklanmaktadır.

!!! info "Yapılandırılmış iş akışı"
    Aşağıdaki adımlar, şu maddelerden birine karşılık gelen önceden yapılandırılmış bir iş akışı gerektirir:

    * Test otomasyonu uygulanmış durumda. Bu durumda, FAST düğüm belirteci [aktarılmalı](#passing-fast-node-token) ve [istek kaydetme](#adding-the-step-of-request-recording) ile [güvenlik testi](#adding-the-step-of-security-testing) adımları eklenmelidir.
    * Temel istek kümesi önceden kaydedilmiş durumda. Bu durumda, FAST düğüm belirteci [aktarılmalı](#passing-fast-node-token) ve [güvenlik testi](#adding-the-step-of-security-testing) adımı eklenmelidir.

## FAST Düğüm Belirtecinin İletilmesi

[FAST düğüm belirtecini](../../operations/create-node.md) güvenli bir şekilde kullanmak için mevcut pipeline ayarlarınızı açın ve belirteç değerini [Azure DevOps ortam değişkenine](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables) iletin.

![Azure DevOps ortam değişkeni geçirme](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## İstek Kaydetme Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "FAST düğümünü kayıt modunda çalıştıran otomatik test adımı örneği"
    ```
    - job: tests
      steps:
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

## Güvenlik Testi Adımının Eklenmesi

Güvenlik testi kurulumu, test uygulamasında kullanılan kimlik doğrulama yöntemine bağlıdır:

* Kimlik doğrulama gerekiyorsa, güvenlik testi adımını istek kaydetme adımıyla aynı işe ekleyin.
* Kimlik doğrulama gerekmiyorsa, güvenlik testi adımını pipeline'a ayrı bir iş olarak ekleyin.

Güvenlik testini uygulamak için şu talimatları izleyin:

1. Test uygulamasının çalıştığından emin olun. Gerekirse, uygulamayı çalıştırma komutunu ekleyin.
2. FAST Docker konteynerini `CI_MODE=testing` modunda ve diğer gerekli [değişkenlerle](../ci-mode-testing.md#environment-variables-in-testing-mode) uygulamayı çalıştıran komutun __ardından__ çalıştıran komutu ekleyin.

    !!! info "Kaydedilmiş temel istek kümesini kullanma"
        Temel istek kümesi başka bir pipeline'da kaydedildiyse, [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkeninde kayıt kimliğini belirtin. Aksi halde, en son kaydedilen küme kullanılacaktır.

    Komut örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Ağı"
    Güvenlik testinden önce, FAST düğümü ile test uygulamasının aynı ağda çalıştığından emin olun.

??? info "FAST düğümünü test modunda çalıştıran otomatik test adımı örneği"
    Aşağıdaki örnek, kimlik doğrulama gerektiren DVWA uygulamasını test ettiğinden, güvenlik testi adımı istek kaydetme adımıyla aynı işe eklenmiştir.

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
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

## Test Sonucunun Alınması

Güvenlik testinin sonucu Azure DevOps arayüzünde görüntülenecektir.

![FAST düğümünün test modunda çalıştırılmasının sonucu](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## Daha Fazla Örnek

FAST'in Azure DevOps iş akışına entegrasyonuna ilişkin örnekleri [GitHub](https://github.com/wallarm/fast-examples) üzerinde bulabilirsiniz.

!!! info "Daha fazla soru"
    FAST entegrasyonuyla ilgili sorularınız varsa lütfen [bizimle iletişime geçin](mailto:support@wallarm.com).