[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# Wallarm FAST Orbs ile CircleCI Entegrasyonu

Bu dökümantasyon, [Wallarm FAST Orbs (plugin)][circleci-fast-plugin] aracılığıyla FAST'in CircleCI iş akışına entegrasyon yöntemini açıklamaktadır. Entegrasyon kurulumu `~/.circleci/config.yml` yapılandırma dosyasında gerçekleştirilir. CircleCI Orbs hakkında daha fazla bilgi [resmi CircleCI dokümantasyonunda][circleci-using-orbs] bulunabilir.

!!! warning "Gereksinimler"

    * CircleCI sürüm 2.1
    * Zaten [kayıtlı temel isteklerin setine][recording-mode] sahip yapılandırılmış CircleCI iş akışı

    Eğer farklı bir CircleCI sürümü ile çalışıyorsanız veya istek kaydetme adımını eklemeniz gerekiyorsa, lütfen [FAST node üzerinden CircleCI ile entegrasyon örneğine][fast-jenkins-cimode] göz atın.

## Adım 1: FAST Node Token'ının Aktarılması

CircleCI proje ayarlarında `WALLARM_API_TOKEN` ortam değişkeninde [FAST node token][fast-node-token] değerini girin. Ortam değişkenlerinin kurulumu ile ilgili yöntem [CircleCI dokümantasyonunda][circleci-set-env-var] açıklanmıştır.

![Passing CircleCI environment variable][circleci-example-env-var]

## Adım 2: Wallarm FAST Orbs'un Bağlanması

Wallarm FAST Orbs bağlamak için, `~/.circleci/config.yml` dosyasına aşağıdaki ayarları ekleyin:

1. Dosyada CircleCI sürüm 2.1'in belirtildiğinden emin olun:

    ```
    version: 2.1
    ```
2. `orbs` bölümünde Wallarm FAST plugin'i başlatın:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## Adım 3: Güvenlik Testinin Adımının Yapılandırılması

Güvenlik testlerini yapılandırmak için, CircleCI iş akışınıza ayrı bir `fast/run_security_tests` adımı ekleyin ve aşağıda listelenen parametreleri tanımlayın:

| Parameter | Açıklama | Zorunlu |
| ---------| ---------|---------|
| test_record_id | Test kayıt ID'si. [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode) ile ilgilidir.<br>Varsayılan değer, kullanılan FAST node tarafından oluşturulan son test kaydıdır. | Evet |
| app_host | Test uygulamasının adresi. Değer bir IP adresi veya alan adı olabilir.<br>Varsayılan değer dahili IP'dir. | Hayır |
| app_port | Test uygulamasının portu.<br>Varsayılan değer 80'dir. | Hayır |
| policy_id | [Test policy](../operations/test-policy/overview.md) ID'si.<br>Varsayılan değer `[null]`-`Default Test Policy`. | Hayır |
| stop_on_first_fail | Bir hata oluştuğunda test etmeyi durdurma göstergesi. | Hayır |
| test_run_name | Test çalışmasının adı.<br>Varsayılan olarak, değer test çalışması oluşturulma tarihinden otomatik olarak oluşturulur. | Hayır |
| test_run_desc | Test çalışmasının açıklaması. | Hayır |
| test_run_rps | Hedef uygulamaya gönderilecek test isteklerinin (*RPS*, saniyedeki istek sayısı) limiti.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır). | Hayır |
| wallarm_api_host | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm US bulutu sunucusu için ve <br>`api.wallarm.com` Wallarm EU bulutu sunucusu için<br>Varsayılan değer `us1.api.wallarm.com`'dur. | Hayır |
| wallarm_fast_port | FAST node'un portu.<br>Varsayılan değer 8080'dir. | Hayır |
| wallarm_version | Kullanılan Wallarm FAST Orbs'un versiyonu.<br>Versiyon listesini [bu linke][circleci-fast-plugin] tıklayarak görebilirsiniz.<br>Varsayılan değer en son versiyondur. | Hayır |

??? info "Örnek ~/.circleci/config.yml"
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

    FAST'in CircleCI iş akışına entegrasyonu ile ilgili daha fazla örneğe [GitHub](https://github.com/wallarm/fast-examples) ve [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration) üzerinden ulaşabilirsiniz.

!!! info "İleri Düzey Sorular"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın][mail-to-us].