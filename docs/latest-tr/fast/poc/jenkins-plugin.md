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

# Jenkins ile Wallarm FAST Eklentisinin Entegrasyonu

!!! warning "Uyumluluk"
    Wallarm FAST eklentisinin yalnızca Freestyle Jenkins projeleriyle çalıştığını lütfen unutmayın.
    
    Projeniz bir Pipeline türüyse, lütfen [FAST node aracılığıyla Jenkins ile entegrasyon örneğini][fast-jenkins-cimode] inceleyin.

## Adım 1: Eklentinin Kurulumu

[Jenkins Plugin Manager][jenkins-manage-plugin] kullanarak Jenkins projenize [Wallarm FAST eklentisini][jenkins-plugin-wallarm-fast] kurun. Eklenti yönetimi hakkında daha ayrıntılı bilgi [Jenkins resmî dokümantasyonunda][jenkins-manage-plugin] mevcuttur.

![Wallarm FAST eklentisinin kurulumu][jenkins-plugin-install]

Kurulum sırasında sorunlarla karşılaşırsanız, eklentiyi manuel olarak derleyin.

??? info "Wallarm FAST eklentisinin manuel olarak derlenmesi"
    Wallarm FAST eklentisini manuel olarak derlemek için aşağıdaki adımları izleyin:

    1. [Maven](https://maven.apache.org/install.html) CLI'nin kurulu olduğundan emin olun.
    2. Aşağıdaki komutları çalıştırın:
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        Komutlar başarıyla yürütüldükten sonra, `target` dizininde `wallarm-fast.hpi` eklenti dosyası oluşturulacaktır.

    3. `wallarm-fast.hpi` eklentisini [Jenkins talimatlarını](https://jenkins.io/doc/book/managing/plugins/#advanced-installation) kullanarak yükleyin.

## Adım 2: Kaydetme ve Test Etme Adımlarının Eklenmesi

!!! info "Yapılandırılmış iş akışı"
    Devam eden talimatlar, yapılandırılmış Jenkins iş akışınızın aşağıdaki noktalardan birine karşılık gelmesini gerektirir:

    * Test otomasyonu uygulanmış olmalıdır. Bu durumda [istek kaydı](#istek-kaydı-adımının-eklenmesi) ve [güvenlik testi](#güvenlik-testi-adımının-eklenmesi) adımları eklenecektir.
    * Bir temel istekler kümesi kaydedilmiş olmalıdır. Bu durumda [güvenlik testi](#güvenlik-testi-adımının-eklenmesi) adımı eklenecektir.

### İstek Kaydı Adımının Eklenmesi

İstek kaydı adımını eklemek için, **Build** sekmesinde `Record baselines` modunu seçin ve aşağıda açıklanan değişkenleri yapılandırın. İstek kaydı adımı, **otomatik uygulama testi adımından önce** eklenmelidir.

!!! warning "Ağ"
    İstekleri kaydetmeden önce, FAST eklentisi ile otomatik test aracı aynı ağda olduğundan emin olun.

??? info "Kayıt modundaki değişkenler"

    | Değişken               | Değer  | Gerekli   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm Cloud'dan bir belirteç. | Evet |
    | `Wallarm API host`      | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>Wallarm US cloud'daki sunucu için `us1.api.wallarm.com` ve <br>Wallarm EU cloud'daki sunucu için `api.wallarm.com`.<br>Varsayılan değer `us1.api.wallarm.com`.| Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer bir IP adresi veya alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının bağlantı noktası. Varsayılan değer 8080. | Hayır |
    | `Fast port`   | FAST node'un bağlantı noktası. | Evet |
    | `Inactivity timeout`    | Bu aralık içinde FAST node'a hiçbir temel istek ulaşmazsa, kayıt işlemi FAST node ile birlikte durdurulur.<br>İzin verilen değer aralığı: 1 saniyeden 1 haftaya.<br>Değer saniye cinsinden geçirilmelidir.<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
    | `Fast name`             | FAST node Docker konteynerinin adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node sürümü. | Hayır |
    | `Local docker network`  | FAST node'un çalıştığı Docker ağı. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak IP adresi. | Hayır |
    | `Without sudo`          | FAST node'u çalıştıran kullanıcının haklarıyla FAST node komutlarının yürütülüp yürütülmeyeceği. Varsayılan olarak, komutlar ayrıcalıklı kullanıcı haklarıyla (sudo üzerinden) yürütülür. | Hayır |

**İstekleri kaydetmek için yapılandırılmış eklenti örneği:**

![İstekleri kaydetmek için eklenti yapılandırma örneği][jenkins-plugin-record-params]

İkinci olarak, FAST node'u bir proxy olarak ekleyerek otomatik test adımını güncelleyin.

Test tamamlandığında, FAST eklentisi istek kaydını otomatik olarak durduracaktır.

### Güvenlik Testi Adımının Eklenmesi

Güvenlik testi adımını eklemek için, **Build** sekmesinde `Playback baselines` modunu seçin ve aşağıda açıklanan değişkenleri yapılandırın. 

Lütfen uygulamanın, güvenlik testini çalıştırmadan önce halihazırda başlatılmış ve test için erişilebilir olması gerektiğini unutmayın.

!!! warning "Ağ"
    Güvenlik testinden önce, FAST eklentisi ile uygulamanın aynı ağda olduğundan emin olun.

??? info "Test modundaki değişkenler"

    | Değişken              | Değer  | Gerekli   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm Cloud'dan bir belirteç. | Evet |
    | `Wallarm API host`    | Wallarm API sunucusunun adresi. <br>İzin verilen değerler: <br>Wallarm US cloud'daki sunucu için `us1.api.wallarm.com` ve <br>Wallarm EU cloud'daki sunucu için `api.wallarm.com`.<br>Varsayılan değer `us1.api.wallarm.com`. | Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer bir IP adresi veya alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının bağlantı noktası. Varsayılan değer 8080. | Hayır |
    | `Policy id`   | [Test policy](../operations/test-policy/overview.md) ID'si.<br> Varsayılan değer `0` - `Default Test Policy`. | Hayır |
    | `TestRecord id`    | Test kaydı ID'si. [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode) ile eşleşir.<br>Varsayılan değer, kullanılan FAST node tarafından oluşturulan son test kaydıdır. | Hayır |
    | `TestRun RPS`   | Hedef uygulamaya gönderilecek test isteklerinin sayısına yönelik bir sınır (*RPS*, *requests per second*).<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsız). | Hayır |
    | `TestRun name`   | Test çalıştırmasının adı.<br>Varsayılan olarak, değer test çalıştırmasının oluşturulma tarihinden otomatik olarak üretilir. | Hayır |
    | `TestRun description`   | Test çalıştırmasının açıklaması. | Hayır |
    | `Stop on first fail`   | Bir hata oluştuğunda testin durdurulup durdurulmayacağı. | Hayır |
    | `Fail build`   | Güvenlik testi sırasında güvenlik açıkları bulunursa derlemenin hata ile bitirilip bitirilmeyeceği. | Hayır |
    | `Exclude`   | Güvenlik testinden hariç tutulacak dosya uzantıları listesi.<br>Uzantıları ayırmak için &#448; sembolü kullanılır.<br> Varsayılan olarak istisna yoktur. | Hayır |
    | `Fast name`             | FAST node Docker konteynerinin adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node sürümü. | Hayır |
    | `Local docker network`  | FAST node'un çalıştığı Docker ağı. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak IP adresi. | Hayır |
    | `Without sudo`          | FAST node'u çalıştıran kullanıcının haklarıyla FAST node komutlarının yürütülüp yürütülmeyeceği. Varsayılan olarak, komutlar ayrıcalıklı kullanıcı haklarıyla (sudo üzerinden) yürütülür. | Hayır |

    !!! warning "FAST node'un çalıştırılması"
        İş akışına hem istek kaydı hem de güvenlik testi adımını eklerseniz, FAST node Docker konteynerlerinin adlarının farklı olması gerektiğini lütfen unutmayın.

**Güvenlik testi için yapılandırılmış eklenti örneği:**

![Güvenlik testi için eklenti yapılandırma örneği][jenkins-plugin-playback-params]

## Adım 3: Test Sonucunun Alınması

Güvenlik testinin sonucu Jenkins arayüzünde görüntülenecektir.

![FAST eklentisi çalıştırmasının sonucu][fast-example-jenkins-plugin-result]

## Daha Fazla Örnek

FAST'in CircleCI iş akışına entegrasyon örneklerini [GitHub][fast-examples-github] üzerinde bulabilirsiniz.

!!! info "Ek sorular"
    FAST entegrasyonu ile ilgili sorularınız varsa, lütfen [bizimle iletişime geçin][mail-to-us].