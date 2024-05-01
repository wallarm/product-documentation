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

# CI / CD'ye Hızlı Entegrasyon Örneği

!!! info "Bölüm kuralları"
    Şu jeton değeri, bölüm boyunca bir örnek değer olarak kullanılır: `token_Qwe12345`.

Örnek bir proje [fast-example-api-circleci-rails-integration][link-example-project], Wallarm'ın GitHub'unda mevcuttur. Amacı, mevcut CI / CD süreçlerine Hızlı entegrasyon nasıl yapıldığını göstermektir. Bu örnek, [“API'ler Üzerinden Yayın Yaparken Benzetim İstekler Kaydı”][link-api-recoding-mode] senaryosunu izler.

Bu belge şu bilgileri içerir:
1. [Örnek uygulamanın nasıl çalıştığına dair bir açıklama.][anchor-project-description]
2. [Hızlı bir entegrasyonun ayrıntılı adım adım bir açıklaması.][anchor-cci-integration-description]
3. [Hızlı entegrasyonun eylemdeki bir demosu.][anchor-cci-integration-demo]

## Örnek Uygulamanın Nasıl Çalıştığı

Örnek uygulama, bir blogda yayınları yayınlamanıza olanak sağlayan bir web uygulamasıdır ve blog yayınlarını yönetme kapasitesine sahiptir.

![Örnek uygulama][img-demo-app]

Uygulama Ruby on Rails'de yazılmıştır ve bir Docker container olarak sevk edilmiştir.

Ayrıca, uygulama için [RSpec][link-rspec] entegrasyon testleri oluşturulmuştur. RSpec, web uygulamasıyla etkileşim kurmak için [Capybara][link-capybara] kullanır ve Capybara, uygulamaya HTTP isteklerini göndermek için [Selenium][link-selenium] kullanır:

![Test akışı][img-testing-flow]

RSpec, aşağıdaki senaryoları test etmek için birkaç entegrasyon testi yürütür:
* Yayınlarla olan sayfaya yönlendirme
* Yeni bir gönderi oluşturma
* Mevcut bir gönderiyi güncelleme
* Mevcut bir yayını silme

Capybara ve Selenium, bu testleri uygulamaya bir dizi HTTP isteğine dönüştürmeye yardımcı olur.

!!! info "Testlerin Konumu"
    Söz konusu entegrasyon testleri `spec/features/posts_spec.rb` dosyasında tanımlanmıştır.

## RSpec ve CircleCI ile FAST Nasıl Entegre Olur

İşte size, örnek proje için RSpec ve CircleCI ile Hızlı entegrasyonun bir genel bakışını bulabilirsiniz.

RSpec, test öncesi ve test sonrası kancalarını destekler:

```
config.before :context, type: :feature do
    # RSpec testlerinin yürütülmesinden önce alınacak eylemler
  end
    # RSpec testlerinin yürütülmesi
  config.after :context, type: :feature do
    # RSpec testlerinin yürütülmesinden sonra alınacak eylemler
  end
```

Bu, RSpec'in uygulamayı test etmek için attığı adımları Hızlı güvenlik testleriyle ilgili adımlarla genişletme olasılığı anlamına gelir.

Bir Selenium sunucusunu, `HTTP_PROXY` ortam değişkeni ile bir proxy sunucusuna yönlendirebiliriz. Bu nedenle, uygulamaya HTTP istekleri proxylenir. Proxy mekanizmasının kullanılması, entegrasyon testlerinden çıkan istekleri, mevcut test akışına minimum müdahale ile Hızlı düğüm üzerinden geçirmenize olanak sağlar:

![FAST ile Test akışı][img-testing-flow-fast]

Bir CircleCI işi, tüm yukarıda belirtilen gerçekler göz önünde bulundurularak oluşturulur. İş, aşağıdaki adımları içerir (`.circleci/config.yml` dosyasına bakın):

1. Gerekli hazırlıklar:
    
    Bir jeton [elde etmeniz gerekiyor][doc-get-token] ve değerini `TOKEN` ortam değişkeni üzerinden CircleCI projesine geçirmeniz gerekiyor.
Yeni bir CI işi bulunduktan ve değişken değeri işin gerçekleştirildiği Docker konteynırına geçirildikten sonra.
    
    ![Jetonu CircleCI'ya geçirme][img-cci-pass-token]
    
2. Hizmetleri inşa edin
    
    Bu aşamada birkaç Docker konteyneri, bir dizi hizmet için inşa edilmelidir. Konteynerler, bir paylaşılan Docker ağa yerleştirilir. Bu nedenle, IP adreslerini ve konteynerlerin isimlerini kullanarak birbirleriyle iletişim kurabilirler.
    
    Aşağıdaki hizmetler inşa edilir ( `docker-compose.yaml` dosyasına bakın):
    
    * `app-test`: hedef uygulama ve test aracı için bir hizmet.
        
        Hizmet için bir Docker görüntüsü, aşağıdaki bileşenleri içerir:
        
        * Hedef uygulama (dağıtımdan sonra `app-test:3000` üzerinden HTTP ile erişilebilir).
        
        * RSpec test aracı Capybara ile birleştirilmiştir; Aracın, Hızlı güvenlik testlerini çalıştırmak için gereken tüm fonksiyonları içerir.
        
        * Capybara: Hedef uygulamaya `app-test:3000` HTTP istekleri göndermek için Selenium sunucusu `selenium:4444` kullanarak yapılandırılmıştır ( `spec/support/capybara_settings.rb` dosyasına bakın).
        
        Jeton, `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni ile hizmetin konteynırına iletildi. Jeton, bir test koşusunda manipülasyonları gerçekleştirmek için `config.before` ve `config.after` bölümlerinde tarif edilen fonksiyonlar tarafından kullanılır ( `spec/support/fast-helper.rb` dosyasına bakın).
    
    * `fast`: Hızlı düğüm için bir hizmet.
        
        Düğüm, dağıtımdan sonra `fast:8080` üzerinden HTTP ile erişilebilir.
        
        Jeton, `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni ile hizmetin konteynırına geçirildi. Jeton, düzgün bir Hızlı işlem için gereklidir.
        
        !!! info "Baz istekleri ile ilgili not"
            Sağlanan örnek, `ALLOWED_HOSTS` [ortam değişkenini][doc-env-variables] kullanmamaktadır. Bu nedenle, Hızlı düğümün tüm gelen istekleri baz istekler olarak tanır.
    
    * `selenium`: Selenium sunucusu için bir hizmet. `app-test` konteynırından Capybara, işlemi için bu sunucuyu kullanır.
        
        Hizmetin konteynırına `HTTP_PROXY=http://fast:8080` ortam değişkeni iletilir, bu da Hızlı düğüm üzerinden isteklerin proxylenmesini sağlar.
        
        Hizmet, dağıtımdan sonra `selenium:4444` üzerinden HTTP ile erişilebilir.
        
    Tüm hizmetler aralarındaki ilişkileri oluşturur:
    
    ![Hizmetler arasındaki ilişkiler][img-services-relations]
    
3.  Yüksekten bahsedilen ilişkiler nedeniyle, hizmetlerin aşağıdaki sırayla dağıtılması gerekmektedir:
    1.  fast.
    2.  selenium.
    3.  app-test.
    
    ‘fast’ ve ‘selenium’ hizmetleri, `docker-compose up -d fast selenium` komutunun verilmesi ile sıra ile dağıtılır.
    
4.  Selenium sunucusu ve Hızlı düğümün başarıyla dağıtılmasının ardından, `app-test` hizmetinin dağıtılması ve RSpec testlerinin yürütülme zamanı geldi.
    
    Bu işlemi yapmak için, aşağıdaki komut verilir:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    Test ve HTTP trafik akışları resimde gösterilmektedir:
    
    ![Test ve HTTP trafik akışları][img-test-traffic-flow]
    
    [Senaryoya][link-api-recoding-mode] göre, RSpec testleri, Hızlı güvenlik testlerini çalıştırmak için gereken tüm adımları içerir ( `spec/support/fast_hooks.rb` dosyasına bakın):
    
    1.  RSpec testlerinin uygülamasından önce bir test koşusu [oluşturulur][doc-testrun-creation].
        
        Daha sonra, Hızlı düğümün baz isteklerin kaydına hazır olup olmadığını kontrol etmek için bir API çağrısı [yapılır][doc-node-ready-for-recording]. Düğüm hazır oluncaya kadar mevcut testlerin yürütme süreci başlamaz.
        
        !!! info "Kullanılan test politikası"
            Bu örnek, varsayılan test politikasını kullanır.
        
    2.  RSpec testleri yürütülür.
    3.  RSpec testleri bittikten sonra aşağıdaki eylemler gerçekleştirilir:
        1.  Baz isteklerin kayıt süreci [durdurulur][doc-stopping-recording]; 
        2.  Test koşusu durumu [düzenli aralıklarla izlenir][doc-waiting-for-tests]:
            * Eğer Hızlı güvenlik testleri başarıyla tamamlanırsa (test koşusunun durumu `state: passed` olur), o zaman RSpec'e çıkış kodu `0` döndürülür.
            * Eğer Hızlı güvenlik testleri başarısızlıkla tamamlanırsa (bazı zafiyetler tespit edildi ve test koşusunun durumu `state: failed` olur), o zaman RSpec'e çıkış kodu `1` döndürülür.
    
5.  Test sonucu elde edilir:
    
    RSpec sürecinin çıkış kodu, `docker-compose run` sürecine ve ardından CircleCI'ye geçirilir.     
    
    ![CircleCI'da iş sonucu][img-cci-pass-results]

Açıklanan CircleCI işi, [daha önce listelenen][link-api-recoding-mode] adımları yakından takip eder:

![CircleCI işi detayları][img-cci-workflow]

## Hızlı Entegrasyonunun Demosu

1.  Wallarm bulutunda bir Hızlı düğüm [oluşturun][doc-get-token] ve sağlanan jetonu kopyalayın.
2.  [Örnek proje dosyalarını][link-example-project] kendi GitHub depoya kopyalayın.
3.  Kullanılan GitHub deposunu [CircleCI][link-circleci]'da ekleyin (CircleCI’da “Projeyi Takip Et” düğmesine basın), böylece CI işi, depoya bir değişiklik yaptığınızda tetiklenir. CircleCI terminolojide depolara “proje” denir.
4.  CircleCI projesine bir `TOKEN` ortam değişkeni ekleyin. Bu işlemi projenin ayarlarından yapabilirsiniz. Bu değişkenin değeri olarak Hızlı jetonunu geçirin:
    
    ![Jetonu projeye geçirme][img-cci-demo-pass-token]
    
5.  CI işini başlatmak için bir şeyler depoya itin. RSpec entegrasyon testlerinin başarıyla tamamlandığından emin olun (işin konsol çıktısını görün):
    
    ![RSpec testleri geçti][img-cci-demo-rspec-tests]
    
6.  Test koşusunun çalıştığından emin olun.
    
    Wallarm hesabı bilgilerinizi kullanarak [Wallarm portaline][link-wl-portal] giriş yapabilir ve uygulamanın zafiyetlere karşı gerçek zamanlı olarak test edilme sürecini gözlemlemek için [“Testruns” sekmesine][link-wl-portal-testrun-tab] gidin:
    
    ![Test koşusu çalışırken][img-cci-demo-testrun]
    
7.  Test süreci bittikten sonra, CI işin durumunun "Başarısız" olarak raporlandığını görebilirsiniz:
    
    ![CI işin tamamlanmasının ardından][img-cci-demo-tests-failed]
    
    Testin altında Wallarm demo uygulaması olduğu göz önüne alındığında, başarısız CI işi, Hızlı'nın uygulamada tespit ettiği zafiyetleri temsil eder (derleme günlüğü dosyalarında “FAST testleri başarısız oldu” mesajı görünmelidir). Bu durumda arıza, hiçbir inşa ile ilgili teknik sorunlar tarafından tetiklenmez.
    
    !!! info "Hata mesajı"
        "FAST testleri başarısız oldu" hata mesajı, `spec/support/fast_helper.rb` dosyasında yer alan `wait_test_run_finish` metodundan önce çıktı kodu `1` ile sonlanmadan önce üretilir.

8.  Test süreci sırasında CircleCI konsolunda tespit edilen zafiyetler hakkında bilgi görüntülenmez. 

    Zafiyetleri ayrıntılı olarak Wallarm portalinde inceleyebilirsiniz. Bunun için, CircleCI konsolunda bir Hızlı bilgilendirme mesajının bir parçası olarak görüntülenen test koşusu bağlantısına gidin.
    
    Bu bağlantı şu şekilde görünmelidir:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    Örneğin, örnek uygulamada birkaç XSS zafiyeti bulunduğunu gösteren tamamlanmış bir test koşusuna bir göz atabilirsiniz:
    
     ![Zafiyet hakkında ayrıntılı bilgi][img-cci-demo-vuln-details]
    
Sonuç olarak, Hızlı'nın, mevcut CI / CD süreçlerine entegrasyon ve hatta entegrasyon testlerin hiçbir hatasız geçmesine rağmen uygulamadaki zafiyetleri bulma konusunda güçlü yeteneklere sahip olduğunu gösterildi.