[img-demo-app]:                 ../../../images/fast/poc/common/examples/demo-app.png
[img-testing-flow]:             ../../../images/fast/poc/en/examples/testing-flow.png
[img-testing-flow-fast]:        ../../../images/fast/poc/en/examples/testing-flow-fast.png
[img-services-relations]:       ../../../images/fast/poc/common/examples/api-services-relations.png
[img-test-traffic-flow]:        ../../../images/fast/poc/en/examples/test-traffic-flow.png

[img-cci-pass-token]:           ../../../images/fast/poc/common/examples/circleci/pass-token.png
[img-cci-pass-results]:         ../../../images/fast/poc/common/examples/circleci/pass-results.png
[img-cci-workflow]:             ../../../images/fast/poc/en/examples/circleci/api-workflow.png

[img-cci-demo-pass-token]:      ../../../images/fast/poc/common/examples/circleci/demo-pass-token.png
[img-cci-demo-rspec-tests]:     ../../../images/fast/poc/common/examples/circleci/api-demo-rspec-tests.png
[img-cci-demo-testrun]:         ../../../images/fast/poc/common/examples/circleci/demo-testrun.png
[img-cci-demo-tests-failed]:    ../../../images/fast/poc/common/examples/circleci/demo-tests-failed.png
[img-cci-demo-vuln-details]:    ../../../images/fast/poc/common/examples/circleci/demo-vuln-details.png

[doc-env-variables]:            ../../operations/env-variables.md
[doc-testrun-steps]:            ../../operations/internals.md#test-run-execution-flow-baseline-requests-recording-takes-place
[doc-testrun-creation]:         ../node-deployment.md#creating-a-test-run
[doc-get-token]:                ../../operations/create-node.md
[doc-stopping-recording]:       ../stopping-recording.md
[doc-waiting-for-tests]:        ../waiting-for-tests.md
[doc-node-ready-for-recording]: ../node-deployment.md#creating-a-test-run

[link-api-recoding-mode]:       ../integration-overview-api.md#deployment-via-the-api-when-baseline-requests-recording-takes-place

[link-example-project]:         https://github.com/wallarm/fast-example-api-circleci-rails-integration
[link-rspec]:                   https://rspec.info/
[link-capybara]:                https://github.com/teamcapybara/capybara
[link-selenium]:                https://www.seleniumhq.org/
[link-docker-compose-build]:    https://docs.docker.com/compose/reference/build/
[link-circleci]:                https://circleci.com/

[link-wl-portal]:               https://us1.my.wallarm.com
[link-wl-portal-testrun-tab]:   https://us1.my.wallarm.com/testing/?status=running

[anchor-project-description]:           #how-the-sample-application-works
[anchor-cci-integration-description]:   #how-fast-integrates-with-rspec-and-circleci
[anchor-cci-integration-demo]:          #demo-of-the-fast-integration

#   FAST'in CI/CD'ye Entegrasyonu Örneği

!!! info "Bölüm kuralları"
    Bölüm boyunca örnek değer olarak şu token kullanılmıştır: `token_Qwe12345`.

Wallarm’ın GitHub’ında bir örnek proje [fast-example-api-circleci-rails-integration][link-example-project] mevcuttur. Amacı, FAST’in mevcut CI/CD süreçlerine nasıl entegre edileceğini göstermektir. Bu örnek, [“Temel İsteklerin Kaydı Gerçekleşirken API üzerinden Dağıtım”][link-api-recoding-mode] senaryosunu izler.

Bu belge şu bilgileri içerir:
1.  [Örnek uygulamanın nasıl çalıştığının açıklaması.][anchor-project-description]
2.  [FAST entegrasyonunun adım adım ayrıntılı açıklaması.][anchor-cci-integration-description]
3.  [FAST entegrasyonunun çalışır halde demosu.][anchor-cci-integration-demo]

##  Örnek Uygulama Nasıl Çalışır

Örnek uygulama, bir blogda gönderi yayınlamanızı ve blog gönderilerini yönetmenizi sağlayan bir web uygulamasıdır.

![Örnek uygulama][img-demo-app]

Uygulama Ruby on Rails ile yazılmıştır ve bir Docker konteyneri olarak sunulmuştur. 

Ayrıca, uygulama için [RSpec][link-rspec] entegrasyon testleri oluşturulmuştur. RSpec, web uygulamasıyla etkileşim kurmak için [Capybara][link-capybara] kullanır ve Capybara, uygulamaya HTTP istekleri göndermek için [Selenium][link-selenium] kullanır:

![Test akışı][img-testing-flow]

RSpec, aşağıdaki senaryoları test etmek için birkaç entegrasyon testi yürütür:
* Gönderilerin yer aldığı sayfaya gitme
* Yeni bir gönderi oluşturma
* Mevcut bir gönderiyi güncelleme
* Mevcut bir gönderiyi silme

Capybara ve Selenium, bu testleri uygulamaya yönelik bir dizi HTTP isteğine dönüştürmeye yardımcı olur.

!!! info "Testlerin Konumu"
    Yukarıda bahsedilen entegrasyon testleri `spec/features/posts_spec.rb` dosyasında açıklanmıştır.

##  FAST, RSpec ve CircleCI ile Nasıl Entegre Olur

Burada, örnek proje için FAST’in RSpec ve CircleCI ile entegrasyonunun genel bir görünümünü bulacaksınız.

RSpec, test öncesi ve sonrası kancaları (hook) destekler:

```
config.before :context, type: :feature do
    # RSpec testlerinin yürütülmesinden önce yapılacak işlemler
  end
    # RSpec testlerinin yürütülmesi
  config.after :context, type: :feature do
    # RSpec testlerinin yürütülmesinden sonra yapılacak işlemler
  end
```

Bu, esasen RSpec’in uygulamayı test etmek için attığı adımların, FAST güvenlik testlerini içeren adımlarla zenginleştirilebileceği anlamına gelir.

Bir Selenium sunucusunu `HTTP_PROXY` ortam değişkeni ile bir proxy sunucusuna yönlendirebiliriz. Böylece uygulamaya giden HTTP istekleri proxy’lenir. Proxyleme mekanizmasının kullanımı, entegrasyon testlerinin gönderdiği istekleri mevcut test akışına minimum müdahale ile FAST node’u üzerinden geçirmenize olanak tanır:

![FAST ile test akışı][img-testing-flow-fast]

Tüm bu hususlar göz önünde bulundurularak bir CircleCI işi oluşturulmuştur. İş şu adımlardan oluşur (`.circleci/config.yml` dosyasına bakınız):

1.  Gerekli hazırlıklar:
    
    [Bir token edinmeniz][doc-get-token] ve değerini `TOKEN` ortam değişkeni aracılığıyla CircleCI projesine geçirmeniz gerekir.
Yeni bir CI işi oluşturulduktan sonra, değişkenin değeri işin yürütüldüğü Docker konteynerine aktarılır.
    
    ![Token'ı CircleCI'ye iletin][img-cci-pass-token]
    
2.  Servisleri oluşturma
    
    Bu aşamada, bir dizi servis için birkaç Docker konteyneri oluşturulur. Konteynerler paylaşılan bir Docker ağına yerleştirilir. Bu nedenle, birbirleriyle hem IP adresleri hem de konteyner adları üzerinden iletişim kurabilirler.
    
    Aşağıdaki servisler oluşturulur (`docker-compose.yaml` dosyasına bakınız):
    
    * `app-test`: hedef uygulama ve test aracı için bir servis.
        
        Servis için Docker imajı aşağıdaki bileşenleri içerir:
        
        * Hedef uygulama (dağıtımdan sonra HTTP üzerinden `app-test:3000` adresinden erişilebilir).
        
        * Capybara ile birleştirilmiş RSpec test aracı; Bu araç, FAST güvenlik testlerini çalıştırmak için gereken tüm işlevleri içerir.
        
        * Capybara: HTTP isteklerini Selenium sunucusu `selenium:4444` kullanarak hedef uygulama `app-test:3000` adresine gönderecek şekilde yapılandırılmıştır (`spec/support/capybara_settings.rb` dosyasına bakınız).
        
        Token, servisin konteynerine `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni ile iletilir. Token, bir test çalıştırması üzerinde işlemler gerçekleştirmek için `config.before` ve `config.after` bölümlerinde (bkz. `spec/support/fast-helper.rb` dosyası) tanımlanan fonksiyonlar tarafından kullanılır.
    
    * `fast`: FAST node’u için bir servis.
        
        Node, dağıtımdan sonra HTTP üzerinden `fast:8080` adresinden erişilebilir. 
        
        Token, servisin konteynerine `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni ile iletilir. Token, FAST’in doğru çalışması için gereklidir.
        
        !!! info "Temel isteklerle ilgili not"
            Sunulan örnek, `ALLOWED_HOSTS` [ortam değişkenini][doc-env-variables] kullanmaz. Bu nedenle, FAST node’u gelen tüm istekleri temel (baseline) istek olarak tanır.
    
    * `selenium`: Selenium sunucusu için bir servis. `app-test` konteynerindeki Capybara, çalışması için bu sunucuyu kullanır.
        
        İsteklerin FAST node’u üzerinden proxy’lenmesini etkinleştirmek için servisin konteynerine `HTTP_PROXY=http://fast:8080` ortam değişkeni verilir.
        
        Servise dağıtımdan sonra HTTP üzerinden `selenium:4444` adresinden erişilebilir.
        
    Tüm servisler aralarında aşağıdaki ilişkileri oluşturur:
    
    ![Servisler arasındaki ilişkiler][img-services-relations]
    
3.  Yukarıdaki ilişkilere bağlı olarak, servisler aşağıdaki sıkı sırayla dağıtılmalıdır:
    1.  `fast`.
    2.  `selenium`.
    3.  `app-test`.
    
    `fast` ve `selenium` servisleri, `docker-compose up -d fast selenium` komutu çalıştırılarak sıralı bir şekilde dağıtılır.
    
4.  Selenium sunucusu ve FAST node’u başarıyla dağıtıldıktan sonra `app-test` servisini dağıtma ve RSpec testlerini yürütme zamanı gelir.
    
    Bunu yapmak için aşağıdaki komut çalıştırılır:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    Test ve HTTP trafik akışları aşağıdaki görselde gösterilmiştir:
    
    ![Test ve HTTP trafik akışları][img-test-traffic-flow]
    
    [Senaryoya][link-api-recoding-mode] uygun olarak, RSpec testleri FAST güvenlik testlerini çalıştırmak için gerekli tüm adımları içerir (`spec/support/fast_hooks.rb` dosyasına bakınız):
    
    1.  RSpec testlerinin yürütülmesinden önce bir test çalıştırması [oluşturulur][doc-testrun-creation].
        
        Ardından FAST node’unun temel istekleri kaydetmeye hazır olup olmadığını kontrol etmek için bir API çağrısı [yapılır][doc-node-ready-for-recording]. Node hazır olana kadar mevcut testlerin yürütme süreci başlatılmaz.
        
        !!! info "Kullanılan test politikası"
            Bu örnek varsayılan test politikasını kullanır.
        
    2.  RSpec testleri yürütülür.
    3.  RSpec testleri tamamlandıktan sonra aşağıdaki işlemler gerçekleştirilir:
        1.  Temel isteklerin kaydı [durdurulur][doc-stopping-recording]; 
        2.  Test çalıştırmasının durumu [periyodik olarak izlenir][doc-waiting-for-tests]:
            * FAST güvenlik testleri başarıyla tamamlanırsa (test çalıştırmasının durumu `state: passed`), RSpec’e `0` çıkış kodu döndürülür.
            * FAST güvenlik testleri başarısız tamamlanırsa (bazı zafiyetler bulundu ve test çalıştırmasının durumu `state: failed`), RSpec’e `1` çıkış kodu döndürülür.
    
5.  Test sonucunun alınması:
    
    RSpec sürecinin çıkış kodu `docker-compose run` sürecine ve ardından CircleCI’ye aktarılır.     
    
    ![CircleCI'de iş sonucu][img-cci-pass-results]

Açıklanan CircleCI işi, [daha önce][link-api-recoding-mode] listelenen adımları yakından takip eder:

![Ayrıntılı CircleCI işi][img-cci-workflow]

##  FAST entegrasyonunun demosu

1.  Wallarm cloud içinde bir FAST node’u [oluşturun][doc-get-token] ve verilen token’ı kopyalayın.
2.  [Örnek proje dosyalarını][link-example-project] kendi GitHub deponuza kopyalayın.
3.  GitHub deponuzu [CircleCI][link-circleci] içine ekleyin (CircleCI’de “Follow Project” düğmesine basın); böylece depodaki içeriği her değiştirdiğinizde CI işi tetiklenir. CircleCI terminolojisinde bir depo “a project” olarak adlandırılır.
4.  CircleCI projenize bir `TOKEN` ortam değişkeni ekleyin. Bunu projenin ayarlarında yapabilirsiniz. FAST token’ını bu değişkenin değeri olarak iletin:
    
    ![Token'ı projeye iletin][img-cci-demo-pass-token]
    
5.  CI işini başlatmak için depoya bir şey push’layın. RSpec entegrasyon testlerinin başarıyla tamamlandığından emin olun (işin konsol çıktısına bakınız):
    
    ![RSpec testleri geçti][img-cci-demo-rspec-tests]
    
6.  Test çalıştırmasının yürütüldüğünden emin olun.
    
    Wallarm hesabı bilgilerinizle [Wallarm portal][link-wl-portal] içine giriş yapabilir ve uygulamanın zafiyetlere karşı gerçek zamanlı test sürecini gözlemlemek için [“Testruns” sekmesine][link-wl-portal-testrun-tab] gidebilirsiniz:
    
    ![Test yürütümü][img-cci-demo-testrun]
    
7.  Test süreci tamamlandıktan sonra CI iş durumunun “Failed” olarak raporlandığını görebilirsiniz:
    
    ![CI işinin tamamlanması][img-cci-demo-tests-failed]
    
    Test edilenin Wallarm demo uygulaması olduğu göz önüne alınırsa, başarısız CI işi, FAST’in uygulamada tespit ettiği zafiyetleri temsil eder (yapı günlüklerinde “FAST tests have failed” mesajı görünmelidir). Bu durumda başarısızlık, derleme ile ilgili herhangi bir teknik sorun nedeniyle değil, zafiyet bulunması nedeniyledir.
    
    !!! info "Hata mesajı"
        “FAST tests have failed” hata mesajı, `spec/support/fast_helper.rb` dosyasında bulunan `wait_test_run_finish` metodu tarafından üretilir; bu da `1` çıkış kodu ile sonlandırmadan önce gerçekleşir.

8.  Test süreci sırasında CircleCI konsolunda tespit edilen zafiyetler hakkında bilgi gösterilmez. 

    Zafiyetleri ayrıntılı olarak Wallarm portal üzerinde inceleyebilirsiniz. Bunu yapmak için test çalıştırmasının bağlantısına gidin. Bu bağlantı, CircleCI konsolundaki FAST bilgilendirme mesajının bir parçası olarak görüntülenir.
    
    Bu bağlantı şu şekilde görünmelidir:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    Örneğin, örnek uygulamada birkaç XSS zafiyeti bulunduğunu görmek için tamamlanmış test çalıştırmasına göz atabilirsiniz:
    
     ![Zafiyet hakkında ayrıntılı bilgi][img-cci-demo-vuln-details]
    
Sonuç olarak, FAST’in mevcut CI/CD süreçlerine güçlü entegrasyon yeteneklerine sahip olduğu ve entegrasyon testleri hatasız geçse bile uygulamadaki zafiyetleri bulabildiği gösterilmiştir.