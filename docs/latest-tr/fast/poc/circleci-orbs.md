[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# Wallarm FAST Orbs'un CircleCI ile Entegrasyonu

Bu talimat, FAST'ı CircleCI iş akışına [Wallarm FAST Orbs (eklenti)][circleci-fast-plugin] aracılığıyla entegre etme yöntemini anlatır. Entegrasyon kurulumu, `~/.circleci/config.yml` yapılandırma dosyasında gerçekleştirilir. CircleCI Orbs hakkında daha fazla ayrıntıya [resmi CircleCI belgelerinden][circleci-using-orbs] ulaşabilirsiniz.

!!! Uyarı "Gereksinimler"

    * CircleCI sürümü 2.1
    * Zaten bir [kaydedilmiş temel istek seti][recording-mode] ile yapılandırılmış CircleCI iş akışı
    
    Eğer başka bir CircleCI sürümüyle çalışıyorsanız veya istek kayıt aşamasını eklemek istiyorsanız, lütfen [CircleCI ile FAST düğümü aracılığıyla entegrasyon örneğini][fast-jenkins-cimode] inceleyin.

## Adım 1: FAST Node Token'ını Geçmek

[FAST node token][fast-node-token] değerini CircleCI proje ayarlarında `WALLARM_API_TOKEN` ortam değişkeninde geçin. Ortam değişkenlerinin kurulum yöntemi [CircleCI belgelerinde][circleci-set-env-var] anlatılmıştır.

![CircleCI ortam değişkenini geçmek][circleci-example-env-var]

## Adım 2: Wallarm FAST Orbs'ün Bağlanması

Wallarm FAST Orbs'ü bağlamak için `~/.circleci/config.yml` dosyasında aşağıdaki ayarları belirleyin:

1. Dosyada CircleCI sürümü 2.1'in belirtildiğinden emin olun:

    ```
    version: 2.1
    ```

2. `orbs` bölümünde Wallarm FAST eklentisini başlatın:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## Adım 3: Güvenlik Testi Aşamasının Yapılandırılması

Güvenlik testini yapılandırmak için, CircleCI iş akışınıza ayrı bir `fast/run_security_tests` adımı ekleyin ve aşağıda listelenen parametreleri belirleyin:

| Parametre | Açıklama | Gerekli |
| ---------| ---------|--------------- |
| test_record_id| Test kayıt ID'si. [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode) ile karşılar.<br>Varsayılan değer, kullanılan FAST düğümü tarafından oluşturulan son test kaydıdır. | Evet|
| app_host | Deneme uygulamasının adresi. IP adresi veya bir alan adı olabilir.<br>Varsayılan değer, dahili IP'dir. | Hayır |
| app_port | Deneme uygulamasının portu.<br>Varsayılan değer, 80'dir. | Hayır |
| policy_id | [Deneme politikası](../operations/test-policy/overview.md) ID'si.<br>Varsayılan değer, `[null]`-`Default Test Policy`. | Hayır |
| stop_on_first_fail | Bir hata oluştuğunda testin durdurulmasını gösteren gösterge. | Hayır |
| test_run_name | Test çalışmasının adı.<br>Varsayılan olarak, değer test çalışması oluşturulma tarihinden otomatik olarak oluşturulur. | Hayır |
| test_run_desc | Test çalışmasının tanımı. | Hayır |
| test_run_rps | Hedef uygulamaya gönderilecek olan test isteklerinin (*RPS*, *saniyedeki istekler*) limiti.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır). | Hayır |
| wallarm_api_host | Wallarm API sunucusunun adresi. <br>Kabul edilen değerler: <br>`us1.api.wallarm.com` Wallarm ABD bulutundaki sunucu ve <br>`api.wallarm.com` Wallarm AB bulutundaki sunucu için<br>Varsayılan değer `us1.api.wallarm.com`'dır. | Hayır|
| wallarm_fast_port | FAST düğümünün portu.<br>Varsayılan değer 8080'dir. | Hayır |
| wallarm_version | Kullanılan Wallarm FAST Orbs sürümü.<br>Sürümler listesi [bağlantı]yı tıklayarak bulunabilir[circleci-fast-plugin].<br>Varsayılan değer en günceldir.| Hayır|

??? bilgi "~=/.circleci/config.yml örneği"
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

    FAST'ı CircleCI iş akışına entegre etme örneklerine [GitHub](https://github.com/wallarm/fast-examples) ve [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration) adreslerimizden daha fazla ulaşabilirsiniz.

!!! bilgi "Ek sorular"
    FAST entegrasyonuyla ilgili sorularınız varsa, lütfen [bize ulaşın][mail-to-us].