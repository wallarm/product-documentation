[fast-node-token]:              ../operations/create-node.md
[fast-ci-mode-record]:          ci-mode-recording.md#environment-variables-in-recording-mode

[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

[jenkins-plugin-wallarm-fast]:   https://plugins.jenkins.io/wallarm-fast/

[jenkins-plugin-install]:       ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-install.png
[jenkins-plugin-record-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-record-params.png
[jenkins-plugin-playback-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-playback-params.png
[jenkins-manage-plugin]:        https://jenkins.io/doc/book/managing/plugins/
[fast-example-jenkins-plugin-result]:  ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-result.png
[fast-jenkins-cimode]:          examples/jenkins-cimode.md

# Wallarm FAST Plugin'nin Jenkins ile Entegrasyonu

!!! warning "Uyumluluk"
    Lütfen Wallarm FAST plugin'in yalnızca Freestyle Jenkins projeleriyle çalıştığını unutmayın.
    
    Projeniz Pipeline tipindeyse, lütfen [Jenkins ile FAST node üzerinden entegrasyon örneğini][fast-jenkins-cimode] inceleyin.

## Adım 1: Plugin'in Yüklenmesi

Plugin Manager kullanarak Jenkins projenize [Wallarm FAST plugin][jenkins-plugin-wallarm-fast]'ini yükleyin. Plugin yönetimi hakkında daha ayrıntılı bilgiyi [Jenkins resmi dokümantasyonunda][jenkins-manage-plugin] bulabilirsiniz.

![Wallarm FAST plugin kurulumu][jenkins-plugin-install]

Eğer yükleme sırasında problemlerle karşılaşırsanız, plugin'i manuel olarak inşa edin.

??? info "Wallarm FAST Plugin'in Manuel İnşası"
    Wallarm FAST plugin'in manuel olarak inşa edilmesi için aşağıdaki adımları izleyin:

    1. [Maven](https://maven.apache.org/install.html) CLI'nın yüklü olduğundan emin olun.
    2. Aşağıdaki komutları çalıştırın:
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        Komutların başarıyla çalıştırılmasının ardından, `target` dizininde `wallarm-fast.hpi` plugin dosyası oluşturulacaktır.

    3. `wallarm-fast.hpi` plugin dosyasını [Jenkins talimatlarını](https://jenkins.io/doc/book/managing/plugins/#advanced-installation) kullanarak yükleyin.

## Adım 2: Kayıt ve Test Adımlarının Eklenmesi

!!! info "Yapılandırılmış İş Akışı"
    İlerleyen talimatlarda, yapılandırılmış Jenkins iş akışının aşağıdaki noktalardan biriyle uyumlu olması gerekecektir:

    * Test otomasyonu uygulanmış olmalıdır. Bu durumda, [istek kaydetme](#adding-the-step-of-request-recording) ve [güvenlik testi](#adding-the-step-of-security-testing) adımları eklenecektir.
    * Temel istek seti kaydedilmelidir. Bu durumda, [güvenlik testi](#adding-the-step-of-security-testing) adımı eklenecektir.

### İstek Kaydetme Adımının Eklenmesi

İstek kaydetme adımını eklemek için **Build** sekmesinde `Record baselines` modunu seçin ve aşağıda tarif edilen değişkenleri yapılandırın. İstek kaydetme adımı, **otomatik uygulama testi adımından** önce eklenmelidir.

!!! warning "Ağ"
    İstekleri kaydetmeden önce, FAST plugin ile otomatik test aracının aynı ağda olduğundan emin olun.

??? info "Kayıt Modundaki Değişkenler"

    | Değişken              | Değer  | Zorunlu   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm cloud'dan alınan token. | Evet |
    | `Wallarm API host`      | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` (Wallarm US cloud sunucusu için) ve <br>`api.wallarm.com` (Wallarm EU cloud sunucusu için).<br>Varsayılan değer: `us1.api.wallarm.com`. | Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer, IP adresi veya alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının portu. Varsayılan değer 8080'dir. | Hayır |
    | `Fast port`   | FAST node'un portu. | Evet |
    | `Inactivity timeout`    | Bu süre zarfında FAST node'a temel istekler gelmezse, kayıt işlemi FAST node ile birlikte durdurulur.<br>İzin verilen değer aralığı: 1 saniyeden 1 haftaya kadar.<br>Değer saniye cinsinden verilmelidir.<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
    | `Fast name`             | FAST node Docker konteynerinin adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node'un versiyonu. | Hayır |
    | `Local docker network`  | FAST node'un çalıştığı Docker ağı. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak IP adresi. | Hayır |
    | `Without sudo`          | FAST node komutlarının, FAST node’u çalıştıran kullanıcının haklarıyla çalıştırılıp çalıştırılmayacağı. Varsayılan olarak, komutlar süper kullanıcı haklarıyla (sudo üzerinden) çalıştırılır. | Hayır |

**Test kaydı için yapılandırılmış plugin örneği:**

![İstek kaydı için plugin yapılandırma örneği][jenkins-plugin-record-params]

İkinci olarak, otomatik test adımına FAST node'u proxy olarak ekleyin.

Test tamamlandığında FAST plugin otomatik olarak istek kaydetmeyi durduracaktır.

### Güvenlik Testi Adımının Eklenmesi

Güvenlik testi adımını eklemek için **Build** sekmesinde `Playback baselines` modunu seçin ve aşağıda tarif edilen değişkenleri yapılandırın. 

Uygulamanın, güvenlik testi başlamadan **önce** başlatılmış ve test için erişilebilir olduğuna dikkat edin.

!!! warning "Ağ"
    Güvenlik testinden önce, FAST plugin ile uygulamanın aynı ağda olduğundan emin olun.

??? info "Test Modundaki Değişkenler"

    | Değişken              | Değer  | Zorunlu   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm cloud'dan alınan token. | Evet |
    | `Wallarm API host`    | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` (Wallarm US cloud sunucusu için) ve <br>`api.wallarm.com` (Wallarm EU cloud sunucusu için).<br>Varsayılan değer: `us1.api.wallarm.com`. | Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer, IP adresi veya alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının portu. Varsayılan değer 8080'dir. | Hayır |
    | `Policy id`   | [Test policy](../operations/test-policy/overview.md) ID'si.<br>Varsayılan değer: `0`-`Default Test Policy`. | Hayır |
    | `TestRecord id`    | Test kayıt ID'si. [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)'ye karşılık gelir.<br>Varsayılan değer, kullanılan FAST node tarafından oluşturulan son test kaydıdır. | Hayır |
    | `TestRun RPS`   | Hedef uygulamaya gönderilecek test isteklerinin (RPS, saniyedeki istek sayısı) limiti.<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırı yoktur).| Hayır |
    | `TestRun name`   | Test çalışmasının adı.<br>Varsayılan olarak, test çalışmasının oluşturulma tarihinden otomatik olarak üretilir. | Hayır |
    | `TestRun description`   | Test çalışmasının açıklaması. | Hayır |
    | `Stop on first fail`   | Hata meydana geldiğinde testin durdurulup durdurulmayacağı. | Hayır |
    | `Fail build`   | Güvenlik testi sırasında açıklar bulunması durumunda yapının hata ile sonlandırılıp sonlandırılmayacağı. | Hayır |
    | `Exclude`   | Güvenlik testinden hariç tutulacak dosya uzantılarının listesi.<br>Uzantıları ayırmak için &#448; sembolü kullanılır.<br>Varsayılan olarak, hariç tutma yoktur. | Hayır |
    | `Fast name`             | FAST node Docker konteynerinin adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node'un versiyonu. | Hayır |
    | `Local docker network`  | FAST node'un çalıştığı Docker ağı. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak IP adresi. | Hayır |
    | `Without sudo`          | FAST node komutlarının, FAST node’u çalıştıran kullanıcının haklarıyla çalıştırılıp çalıştırılmayacağı. Varsayılan olarak, komutlar süper kullanıcı haklarıyla (sudo üzerinden) çalıştırılır. | Hayır |

    !!! warning "FAST Node'un Çalıştırılması"
        İstek kaydetme ve güvenlik testi adımını iş akışına eklerseniz, FAST node Docker konteynerlerinin adlarının farklı olması gerektiğini unutmayın.

**Güvenlik testi için yapılandırılmış plugin örneği:**

![Güvenlik testi için plugin yapılandırma örneği][jenkins-plugin-playback-params]

## Adım 3: Test Sonuçlarının Alınması

Güvenlik test sonuçları Jenkins arayüzünde görüntülenecektir.

![FAST plugin çalıştırma sonucu][fast-example-jenkins-plugin-result]

## Daha Fazla Örnek

FAST'ın CircleCI iş akışına entegrasyonu örneklerini [GitHub'da][fast-examples-github] bulabilirsiniz.

!!! info "Daha Fazla Soru"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bizimle iletişime geçin][mail-to-us].