# Azure DevOps ile FAST Entegrasyonu

CI MODE içerisindeki FAST'ın Azure DevOps boru hattına entegrasyonu, `azure-pipelines.yml` dosyası aracılığıyla yapılandırılır. `azure-pipelines.yml` dosyasının ayrıntılı şeması, [Azure DevOps official documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema) belgesinde açıklanmıştır.

!!! info "Yapılandırılmış çalışma akışı"
    Devamındaki talimatların gerçekleşebilmesi için aşağıdaki noktalardan birine karşılık gelen, zaten yapılandırılmış bir çalışma akışının mevcut olması gerekmektedir:

    * Test otomasyonu uygulanmış olmalıdır. Bu durumda, FAST node tokenı [geçilmeli](#passing-fast-node-token) ve [istek kaydı](#adding-the-step-of-request-recording) ile [güvenlik testi](#adding-the-step-of-security-testing) adımları eklenmelidir.
    * Temel istek kümesi zaten kaydedilmiş olmalıdır. Bu durumda, FAST node tokenı [geçilmeli](#passing-fast-node-token) ve [güvenlik testi](#adding-the-step-of-security-testing) adımı eklenmelidir.

## FAST Node Token'ının Geçilmesi

[FAST node token](../../operations/create-node.md)'ı güvenli bir şekilde kullanmak için, mevcut pipeline ayarlarınızı açın ve token değerini [Azure DevOps environment variable](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables) içine aktarın.

![Passing Azure DevOps environment variable](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## İstek Kaydı Adımının Eklenmesi

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Kayıt modunda FAST node çalıştırılarak otomatik test adımının örneği"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'my-network oluştur'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'my-network üzerinde test uygulamasını çalıştır'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'my-network üzerinde kayıt modunda FAST node çalıştır'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'my-network üzerinde FAST node’u proxy olarak kullanarak Selenium çalıştır'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'my-network üzerinde otomatik testleri çalıştır'
      - script: docker stop selenium fast
        displayName: 'Kayıt modundaki Selenium ve FAST node’u durdur'
    ```

## Güvenlik Testi Adımının Eklenmesi

Güvenlik testi yapılandırma yöntemi, test uygulamasında kullanılan kimlik doğrulama yöntemine bağlıdır:

* Eğer kimlik doğrulama gerekiyorsa, istek kaydı adımının yer aldığı aynı işe güvenlik testi adımını ekleyin.
* Eğer kimlik doğrulama gerekli değilse, güvenlik testi adımını pipeline’ınıza ayrı bir iş olarak ekleyin.

Güvenlik testini gerçekleştirmek için aşağıdaki talimatları izleyin:

1. Test uygulamasının çalıştığından emin olun. Gerekirse, uygulamayı çalıştırma komutunu ekleyin.
2. Uygulama çalıştırma komutundan __sonra__, diğer gerekli [değişkenlerle](../ci-mode-testing.md#environment-variables-in-testing-mode) birlikte `CI_MODE=testing` modunda çalışan FAST Docker container komutunu ekleyin.

    !!! info "Kayıt altına alınan temel istek kümesinin kullanılması"
        Eğer temel istek kümesi başka bir pipeline’da kaydedildiyse, [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode) değişkeninde kayıt kimliğini belirtin. Aksi takdirde, en son kaydedilen küme kullanılacaktır.

    Komut örneği:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Ağı"
    Güvenlik testinden önce, FAST node ve test uygulamasının aynı ağ üzerinde çalıştığından emin olun.

??? info "Test modunda FAST node çalıştırılarak otomatik test adımının örneği"
    Aşağıdaki örnek, kimlik doğrulaması gerektiren DVWA uygulamasını test ettiğinden, güvenlik testi adımı istek kaydı adımının yer aldığı aynı işe eklenmiştir.

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'my-network oluştur'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'my-network üzerinde test uygulamasını çalıştır'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'my-network üzerinde kayıt modunda FAST node çalıştır'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'my-network üzerinde FAST node’u proxy olarak kullanarak Selenium çalıştır'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'my-network üzerinde otomatik testleri çalıştır'
        - script: docker stop selenium fast
          displayName: 'Kayıt modundaki Selenium ve FAST node’u durdur'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'my-network üzerinde test modunda FAST node çalıştır'
        - script: docker stop dvwa
          displayName: 'Test uygulamasını durdur'
        - script: docker network rm my-network
          displayName: 'my-network’i sil'
    ```

## Test Sonuçlarının Alınması

Güvenlik testinin sonucu, Azure DevOps arayüzünde gösterilecektir.

![Test modunda FAST node çalıştırılmasının sonucu](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## Daha Fazla Örnek

FAST'ın Azure DevOps çalışma akışıyla entegrasyonuna dair örnekleri, [GitHub](https://github.com/wallarm/fast-examples) adresinde bulabilirsiniz.

!!! info "Ek sorularınız mı var?"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın](mailto:support@wallarm.com).