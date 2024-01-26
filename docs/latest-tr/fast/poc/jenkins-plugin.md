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
    Lütfen not edin ki Wallarm FAST eklentisi sadece Freestyle Jenkins projeleri ile çalışır.
    
    Eğer proje Pipeline tipindeyse, lütfen [Jenkins ile FAST node entegrasyon örneği][fast-jenkins-cimode]'ne bakın.

## Adım 1: Eklentinin Yüklenmesi

[Jenkins projesinde][jenkins-plugin-wallarm-fast] Plugin Manager kullanarak Wallarm FAST eklentisini yükle. Eklentilerin yönetimine dair daha detaylı bilgi [Jenkins'ın resmi dökümantasyonu][jenkins-manage-plugin]'nda bulunabilir.

![Wallarm FAST eklentisinin yüklenmesi][jenkins-plugin-install]

Yükleme esnasında sorunlarla karşılaşıldıysa, eklentiyi manuel olarak oluşturun.

??? info "Wallarm FAST eklentisinin manuel oluşturulması"
    Wallarm FAST eklentisini manuel olarak oluşturmak için aşağıdaki adımları izleyin:

    1. [Maven](https://maven.apache.org/install.html) CLI'nın yüklü olduğundan emin olun.
    2. Aşağıdaki komutları çalıştırın:
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        Komutların başarılı bir şekilde çalıştırılmasının ardından `wallarm-fast.hpi` eklenti dosyası `target` dizinine oluşturulacaktır.

    3. `wallarm-fast.hpi` eklentisini [Jenkins'ın talimatları](https://jenkins.io/doc/book/managing/plugins/#advanced-installation)'nı kullanarak yükleyin.

## Adım 2: Kayıt ve Test Adımlarını Eklemek

!!! info "Yapılandırılmış iş akışı"
    İlerleyen talimatlar için, yapılandırılmış Jenkins iş akışının aşağıdaki maddelerden birine uygun olması gerekmektedir:

    * Test otomasyonu uygulanmış olmalı. Bu durumda, [talepleri kaydetme](#talepleri-kaydetme-adımını-eklemek) ve [güvenlik testi](#güvenlik-testi-adımını-eklemek) adımları eklenir.
    * Bir temel talep seti kaydedilmiş olmalı. Bu durumda, [güvenlik testi](#güvenlik-testi-adımını-eklemek) adımı eklenir.

### Talepleri Kaydetme Adımını Eklemek

Talepleri kaydetme adımını eklemek için, **Build** sekmesindeki `Record baselines` modunu seçin ve aşağıda belirtilen değişkenleri ayarlayın. Talepleri kaydetme adımı **otomatik uygulama test adımı öncesine** eklenmelidir.

!!! warning "Ağ"
    Talepleri kaydetme öncesinde, FAST plugin ve otomatik test işlemi için araçların aynı networkte olduğundan emin olun.

??? info "Kayıt modunda değişkenler"

    | Değişken              | Değer  | Gerekli   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm bulutundan bir token. | Evet |
    | `Wallarm API host`      | Wallarm API server adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm ABD bulutundaki server ve <br>`api.wallarm.com` Wallarm AB bulutundaki server için.<br>Varsayılan değer `us1.api.wallarm.com`. | Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer bir IP adres  veya alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının portu. Varsayılan değer 8080. | Hayır |
    | `Fast port`   | FAST node portu. | Evet |
    | `Inactivity timeout`    | Eğer hiçbir temel talep FAST node'a bu süre zarfında ulaşmazsa, tespit süreci ve FAST node durur.<br>İzin verilen değer aralığı: 1 saniyeden 1 haftaya kadar.<br>Değer saniye cinsinden girilmelidir.<br>Varsayılan değer: 600 saniye (10 dakika). | Hayır |
    | `Fast name`             | FAST node Docker container adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node sürümü. | Hayır |
    | `Local docker network`  | FAST node'ın çalıştığı Docker networkü. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak olan IP adresi. | Hayır |
    | `Without sudo`          | FAST node komutlarını, FAST node'u çalıştıran kullanıcının yetkileriyle çalıştırılıp çalıştırmayacağı. Varsayılan olarak, komutlar süper kullanıcı yetkileriyle (sudo ile) çalıştırılır.  |Hayır |

**Test taleplerini kaydetmek için yapılandırılmış eklenti örneği:**

![Talepleri kaydetmek için eklentinin yapılandırılması][jenkins-plugin-record-params]

İkinci olarak, otomatik test adımını, FAST node'un bir proxy olarak eklenmesini güncelleyin.

Test tamamlandığında FAST plugin otomatik olarak taleplerin kaydını durduracaktır.

### Güvenlik Testi Adımını Eklemek

Güvenlik testi adımını eklemek için, **Build** sekmesindeki `Playback baselines` modunu seçin ve aşağıda belirtilen değişkenleri kurun.

Application zaten başlatılmış ve **güvenlik testi çalıştırılmadan önce** testler için kullanılabiliyor olmalıdır.

!!! warning "Ağ"
    Güvenlik testinden önce, FAST plugin ve application'ın aynı networkte olduğundan emin olun.

??? info "Test modunda değişkenler"

    | Değişken              | Değer  | Gerekli   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarm bulutundan bir token. | Evet |
    | `Wallarm API host`    | Wallarm API server adresi. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` Wallarm ABD bulutundaki server ve <br>`api.wallarm.com` Wallarm AB bulutundaki server için.<br>Varsayılan değer `us1.api.wallarm.com`. | Hayır |
    | `Application host`      | Test uygulamasının adresi. Değer bir IP adresi veya bir alan adı olabilir. | Evet |
    | `Application port`      | Test uygulamasının portu. Varsayılan değer 8080. | Hayır |
    | `Policy id`   | [Test policy](../operations/test-policy/overview.md) ID.<br> Varsayılan değer is `0`-`Default Test Policy`. | Hayır |
    | `TestRecord id`    | Test kayıt ID'si. [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode) ile eşleşir.<br>Varsayılan değer kullanılan FAST node tarafından yaratılan son test kaydıdır.| Hayır |
    | `TestRun RPS`   | Uygulamaya gönderilecek test isteklerinin (*RPS*, *saniye başına istekler*) limiti.<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır).| Hayır |
    | `TestRun name`   | Test çalıştırmasının adı.<br>Varsayılan olarak, değer test çalıştırmasının yaratma tarihinden otomatik olarak oluşturulur.| Hayır |
    | `TestRun description`   | Test çalıştırmasının tanımı.| Hayır |
    | `Stop on first fail`   | Bir hata meydana geldiğinde testin durdurulup durdurulmayacağı. | Hayır |
    | `Fail build`   | Güvenlik testi sırasında açıklıklar bulunduğunda yapının hata ile bitip bitmeyeceği. | Hayır |
    | `Exclude`   | Güvenlik testinden dışlanacak dosya uzantıları listesi.<br>Uzantıları ayırmak için &#448; sembolü kullanılır.<br> Varsayılan olarak, istisna yoktur.| Hayır |
    | `Fast name`             | FAST node Docker container adı. | Hayır |
    | `Wallarm version`       | Kullanılan FAST node sürümü. | Hayır |
    | `Local docker network`  | FAST node'ın çalıştığı Docker networkü. | Hayır |
    | `Local docker ip`       | Çalışan FAST node'a atanacak olan IP adresi. | Hayır |
    | `Without sudo`          | FAST node komutlarını, FAST node'u çalıştıran kullanıcının yetkileriyle çalıştırılıp çalıştırmayacağı. Varsayılan olarak, komutlar süper kullanıcı yetkileriyle (sudo ile) çalıştırılır.  |Hayır|

    !!! warning "Çalışan FAST node"
        Eğer iş akışına talepleri kaydetme adımını ve güvenlik test adımını ekliyorsanız, FAST node Docker container'larının adları farklı olmalıdır.

**Güvenlik testi için ayarlanmış eklenti örneği:**

![Güvenlik testi için eklenti ayarı][jenkins-plugin-playback-params]

## Adım 3: Testin Sonucunu Almak

Güvenlik testinin sonucu Jenkins arayüzünde gösterilecektir.

![FAST eklentisinin çalıştırılmasının sonucu][fast-example-jenkins-plugin-result]

## Diğer Örnekler

FAST'ın CircleCI iş akışı ile entegrasyon örneklerini [GitHub][fast-examples-github].

!!! info "Daha Fazla Sorular"
    Eğer FAST'ın entegrasyonu ile ilgili sorularınız varsa, lütfen [bize ulaşın][mail-to-us].