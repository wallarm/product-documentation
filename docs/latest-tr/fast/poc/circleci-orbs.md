[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# CircleCI ile Wallarm FAST Orbs Entegrasyonu

Bu talimat, FAST'i [Wallarm FAST Orbs (eklenti)][circleci-fast-plugin] aracılığıyla CircleCI iş akışıyla entegre etme yöntemini açıklar. Entegrasyon kurulumu `~/.circleci/config.yml` yapılandırma dosyasında gerçekleştirilir. CircleCI Orbs hakkında daha fazla ayrıntı [resmi CircleCI dokümantasyonunda][circleci-using-orbs] mevcuttur.

!!! warning "Gereksinimler"

    * CircleCI sürüm 2.1
    * Halihazırda [kaydedilmiş temel istekler kümesine][recording-mode] sahip yapılandırılmış CircleCI iş akışı
    
    CircleCI'nin başka bir sürümüyle çalışıyorsanız veya istek kaydı adımını eklemeniz gerekiyorsa, lütfen [FAST node ile CircleCI entegrasyonu örneğine][fast-jenkins-cimode] göz atın.

## Adım 1: FAST Node Token'ını iletme

CircleCI proje ayarlarında `WALLARM_API_TOKEN` ortam değişkenine [FAST node token][fast-node-token] değerini girin. Ortam değişkenlerinin nasıl ayarlanacağı [CircleCI dokümantasyonunda][circleci-set-env-var] açıklanmıştır.

![CircleCI ortam değişkeninin iletilmesi][circleci-example-env-var]

## Adım 2: Wallarm FAST Orbs'u bağlama

Wallarm FAST Orbs'u bağlamak için `~/.circleci/config.yml` dosyasında aşağıdaki ayarları yapın:

1. Dosyada CircleCI sürüm 2.1 olarak belirtildiğinden emin olun:

    ```
    version: 2.1
    ```
2. `orbs` bölümünde Wallarm FAST eklentisini başlatın:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## Adım 3: Güvenlik test adımını yapılandırma

Güvenlik testini yapılandırmak için CircleCI iş akışınıza ayrı bir adım olarak `fast/run_security_tests` ekleyin ve aşağıda listelenen parametreleri tanımlayın:

| Parametre | Açıklama | Zorunlu |
| ---------| ---------|--------------- |
| test_record_id | Test kaydı kimliği (ID). [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode) ile eşleşir.<br>Varsayılan değer, kullanılan FAST node tarafından oluşturulan son test kaydıdır. | Evet |
| app_host | Test uygulamasının adresi. Değer bir IP adresi veya alan adı olabilir.<br>Varsayılan değer iç IP'dir. | Hayır |
| app_port | Test uygulamasının portu.<br>Varsayılan değer 80'dir. | Hayır |
| policy_id | [Test policy](../operations/test-policy/overview.md) kimliği (ID).<br>Varsayılan değer `[null]`-`Default Test Policy`. | Hayır |
| stop_on_first_fail | Bir hata oluştuğunda testin durdurulmasını belirten bayrak. | Hayır |
| test_run_name | Test çalıştırmasının adı.<br>Varsayılan olarak, değer test çalıştırmasının oluşturulma tarihinden otomatik olarak üretilecektir. | Hayır |
| test_run_desc | Test çalıştırmasının açıklaması. | Hayır |
| test_run_rps | Hedef uygulamaya gönderilecek test isteklerinin sayısı için bir sınır (*RPS*, saniyedeki istek sayısı).<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır). | Hayır |
| wallarm_api_host | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>Wallarm US cloud için `us1.api.wallarm.com` ve <br>Wallarm EU cloud için `api.wallarm.com`<br>Varsayılan değer `us1.api.wallarm.com`. | Hayır |
| wallarm_fast_port | FAST node'unun portu.<br>Varsayılan değer 8080'dir. | Hayır |
| wallarm_version | Kullanılan Wallarm FAST Orbs sürümü.<br>Sürümler listesine [bağlantıya][circleci-fast-plugin] tıklayarak ulaşabilirsiniz.<br>Varsayılan değer latest. | Hayır |

??? info "~/.circleci/config.yml örneği"
    ```
    version: 2.1
    jobs:
      build:
        machine:
          image: 'ubuntu-1604:201903-01'
        steps:
          - checkout
          - run:
              command: >
                docker run -d --name app-test -p 3000:3000
                wallarm/fast-example-rails
              name: Run application
          - fast/run_security_tests:
              app_port: '3000'
              test_record_id: '9058'
    orbs:
      fast: 'wallarm/fast@dev:1.1.0'
    ```

    FAST'in CircleCI iş akışına entegrasyonuna dair daha fazla örneği [GitHub](https://github.com/wallarm/fast-examples) ve [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration) üzerinde bulabilirsiniz.

!!! info "Ek sorular"
    FAST entegrasyonuyla ilgili sorularınız varsa lütfen [bizimle iletişime geçin][mail-to-us].