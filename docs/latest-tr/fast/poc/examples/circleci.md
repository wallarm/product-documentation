# CI/CD İçin FAST Entegrasyonu Örneği

!!! info "Bölüm Konvansiyonları"
    Bölüm boyunca örnek değer olarak aşağıdaki token kullanılmıştır: `token_Qwe12345`.

Wallarm’ın GitHub’ında [fast-example-api-circleci-rails-integration][link-example-project] adlı örnek bir proje bulunmaktadır. Bu projenin amacı, mevcut CI/CD süreçlerine FAST entegrasyonunun nasıl gerçekleştirileceğini göstermektir. Bu örnek, [“Temel İstek Kayıt İşleminde API Üzerinden Dağıtım”][link-api-recoding-mode] senaryosunu takip eder.

Bu doküman aşağıdaki bilgileri içerir:
1.  [Örnek uygulamanın nasıl çalıştığının açıklaması.][anchor-project-description]
2.  [FAST entegrasyonunun aşama aşama detaylı açıklaması.][anchor-cci-integration-description]
3.  [Çalışır halde FAST entegrasyonunun demosu.][anchor-cci-integration-demo]

## Örnek Uygulamanın Çalışma Şekli

Örnek uygulama, blog gönderileri yayınlamanıza ve blog gönderilerini yönetmenize olanak tanıyan bir web uygulamasıdır.

![The sample application][img-demo-app]

Uygulama, Ruby on Rails ile yazılmıştır ve bir Docker konteyneri olarak dağıtılmaktadır.

Ayrıca, uygulama için [RSpec][link-rspec] entegrasyon testleri oluşturulmuştur. RSpec, web uygulaması ile etkileşim için [Capybara][link-capybara]'yı kullanır ve Capybara, uygulamaya HTTP istekleri göndermek için [Selenium][link-selenium]'u kullanır:

![Testing flow][img-testing-flow]

RSpec, aşağıdaki senaryoları test etmek için birkaç entegrasyon testi yürütür:
* Gönderilerin bulunduğu sayfada gezinme
* Yeni gönderi oluşturma
* Varolan gönderiyi güncelleme
* Varolan gönderiyi silme

Capybara ve Selenium, bu testleri uygulamaya gönderilen bir dizi HTTP isteğine dönüştürmeye yardımcı olur.

!!! info "Testlerin Konumu"
    Bahsi geçen entegrasyon testleri, `spec/features/posts_spec.rb` dosyasında açıklanmıştır.

## FAST'in RSpec ve CircleCI ile Entegrasyonu

Burada, örnek proje için FAST'in RSpec ve CircleCI ile entegrasyonuna genel bir bakış bulacaksınız.

RSpec, test öncesi ve test sonrası kancaları destekler:

```
config.before :context, type: :feature do
    # RSpec testlerinin yürütülmesinden önce yapılacak işlemler
  end
    # RSpec testlerinin yürütülmesi
  config.after :context, type: :feature do
    # RSpec testlerinin yürütülmesinden sonra yapılacak işlemler
  end
```

Bu, esasen, RSpec’in uygulamayı test etmek için attığı adımlara FAST güvenlik testlerini içeren adımları eklemenin mümkün olduğu anlamına gelir.

Selenium sunucusunu `HTTP_PROXY` ortam değişkeni ile bir proxy sunucusuna yönlendirebiliriz. Böylece, uygulamaya gönderilen HTTP istekleri proxy üzerinden iletilecektir. Proxy mekanizmasının kullanılması, entegrasyon testleri tarafından gönderilen isteklerin mevcut test akışına minimal müdahale ile FAST node üzerinden geçmesini sağlar:

![Testing flow with FAST][img-testing-flow-fast]

Yukarıda belirtilen tüm bilgiler göz önünde bulundurularak bir CircleCI işi oluşturulmuştur. İş, aşağıdaki adımlardan oluşur (bkz. `.circleci/config.yml` dosyası):

1.  Gerekli hazırlıklar:
    
    Bir token [edin][doc-get-token] ve bu değeri CircleCI projesine `TOKEN` ortam değişkeni aracılığıyla aktarın.
    Yeni bir CI işi oluşturulduktan sonra, değişkenin değeri işin yürütüldüğü Docker konteynerine aktarılır.
    
    ![Pass the token into the CircleCI][img-cci-pass-token]
    
2.  Hizmetleri oluşturma
    
    Bu aşamada bir dizi hizmet için birkaç Docker konteyneri oluşturulur. Konteynerler, paylaşılan bir Docker ağına yerleştirilir. Bu sayede, IP adresleri ve konteyner isimleri kullanılarak birbirleriyle iletişim kurabilirler.
    
    Aşağıdaki hizmetler oluşturulur (bkz. `docker-compose.yaml` dosyası):
    
    * `app-test`: hedef uygulama ve test aracı için bir hizmet.
        
        Hizmet için oluşturulan Docker imajı, aşağıdaki bileşenleri içerir:
        
        * Hedef uygulama (dağıtım sonrası `app-test:3000` adresinden HTTP üzerinden erişilebilir).
        
        * Capybara ile birlikte kullanılan RSpec test aracı; Bu araç, FAST güvenlik testlerini çalıştırmak için gereken tüm işlevleri içerir.
        
        * Capybara: `spec/support/capybara_settings.rb` dosyasına bakarak, Selenium sunucusu `selenium:4444` kullanılarak hedef uygulama `app-test:3000` adresine HTTP istekleri gönderecek şekilde yapılandırılmıştır.
        
        Token, `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni aracılığıyla hizmet konteynerine aktarılır. Token, `spec/support/fast-helper.rb` dosyasında açıklanan `config.before` ve `config.after` bölümlerinde yer alan işlevler tarafından, bir test çalışması üzerinde işlem yapılması için kullanılır.
    
    * `fast`: FAST node için bir hizmet.
        
        Node, dağıtım sonrası HTTP üzerinden `fast:8080` adresinden erişilebilir.
        
        Token, `WALLARM_API_TOKEN=$TOKEN` ortam değişkeni aracılığıyla hizmet konteynerine aktarılır. Doğru FAST çalışması için token gereklidir.
        
        !!! info "Temel İstekler Hakkında Not"
            Sağlanan örnek, `ALLOWED_HOSTS` [ortam değişkenini][doc-env-variables] kullanmamaktadır. Bu nedenle, FAST node gelen tüm istekleri temel istekler olarak tanır.
    
    * `selenium`: Selenium sunucusu için bir hizmet. `app-test` konteynerindeki Capybara, çalışması için bu sunucuyu kullanır.
        
        `HTTP_PROXY=http://fast:8080` ortam değişkeni, isteklerin FAST node üzerinden proxy'lenmesini sağlamak amacıyla hizmet konteynerine aktarılır.
        
        Hizmete, dağıtım sonrası HTTP üzerinden `selenium:4444` adresinden erişilebilir.
        
    Tüm hizmetler arasında aşağıdaki ilişkiler oluşur:
    
    ![Relations between services][img-services-relations]
    
3.  Yukarıda belirtilen ilişkilere bağlı olarak, hizmetler aşağıdaki kesin sırayla dağıtılmalıdır:
    1.  `fast`.
    2.  `selenium`.
    3.  `app-test`.
    
    `fast` ve `selenium` hizmetleri, `docker-compose up -d fast selenium` komutunun verilmesiyle ardışık olarak dağıtılır.
    
4.  Selenium sunucusu ve FAST node'unun başarılı dağıtımının ardından, `app-test` hizmetini dağıtma ve RSpec testlerini yürütme zamanı gelir.
    
    Bunu yapmak için aşağıdaki komut verilir:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    Test ve HTTP trafik akışları görüntüde gösterilmiştir:
    
    ![Test and HTTP traffics flows][img-test-traffic-flow]
    
    [Senaryoya][link-api-recoding-mode] uygun olarak, RSpec testleri FAST güvenlik testlerini çalıştırmak için gerekli tüm adımları içerir (bkz. `spec/support/fast_hooks.rb` dosyası):
    
    1.  RSpec testlerinin yürütülmesinden önce bir test çalışması [oluşturulur][doc-testrun-creation].
        
        Ardından, FAST node'un temel istekleri kaydetmeye hazır olup olmadığını kontrol etmek için bir API çağrısı [yapılır][doc-node-ready-for-recording]. Node hazır olana kadar mevcut test yürütme süreci başlatılmaz.
        
        !!! info "Kullanılan Test Politikası"
            Bu örnek, varsayılan test politikasını kullanır.
        
    2.  RSpec testleri yürütülür.
    3.  RSpec testleri tamamlandıktan sonra aşağıdaki işlemler gerçekleştirilir:
        1.  Temel isteklerin kayıt süreci [durdurulur][doc-stopping-recording]; 
        2.  Test çalışması durumu [belirli aralıklarla izlenir][doc-waiting-for-tests]:
            * FAST güvenlik testleri başarıyla tamamlanırsa (test çalışması durumu `state: passed` ise), RSpec'e `0` çıkış kodu döner.
            * FAST güvenlik testleri başarısız tamamlanırsa (bazı güvenlik açıkları tespit edilmişse ve test çalışması durumu `state: failed` ise), RSpec'e `1` çıkış kodu döner.
    
5.  Test sonucu elde edilir:
    
    RSpec sürecinin çıkış kodu `docker-compose run` sürecine ve ardından CircleCI'ye aktarılır.
    
    ![The job result in CircleCI][img-cci-pass-results]

Tanımlanan CircleCI işi, [daha önce][link-api-recoding-mode] listelenen adımları yakından takip eder:

![CircleCI job in detail][img-cci-workflow]

## FAST Entegrasyonunun Demosu

1.  Wallarm cloud'da bir FAST node [oluşturun][doc-get-token] ve sağlanan tokeni kopyalayın.
2.  [Örnek proje dosyalarını][link-example-project] kendi GitHub havuzunuza kopyalayın.
3.  GitHub havuzunuzu, her değişiklik yaptığınızda CI işinin tetiklenmesi için [CircleCI][link-circleci]'ye ekleyin (CircleCI'de “Follow Project” düğmesine basın). CircleCI terminolojisinde bir havuz “proje” olarak adlandırılır.
4.  CircleCI projenize bir `TOKEN` ortam değişkeni ekleyin. Bunu, projenin ayarlarında yapabilirsiniz. FAST tokenini bu değişkenin değeri olarak aktarın:
    
    ![Pass the token into the project][img-cci-demo-pass-token]
    
5.  CI işini başlatmak için havuza bir şey gönderin. RSpec entegrasyon testlerinin başarıyla tamamlandığından emin olun (işin konsol çıktısına bakın):
    
    ![RSpec tests are passed][img-cci-demo-rspec-tests]
    
6.  Test çalışmasının yürütüldüğünden emin olun.
    
    Wallarm hesabınızla [Wallarm portalına][link-wl-portal] giriş yapıp, gerçek zamanlı olarak uygulamanın güvenlik açıklarına karşı test edilme sürecini gözlemlemek için [“Testruns” sekmesine][link-wl-portal-testrun-tab] geçebilirsiniz:
    
    ![Test run execution][img-cci-demo-testrun]
    
7.  Test süreci tamamlandıktan sonra, CI işinin durumunun “Failed” olarak raporlandığını görebilirsiniz:
    
    ![The completion of the CI job][img-cci-demo-tests-failed]
    
    Testte Wallarm demo uygulaması bulunduğundan, başarısız CI işi FAST'in uygulamada tespit ettiği güvenlik açıklarını temsil eder (yapı log dosyalarında “FAST tests have failed” mesajı görünmelidir). Bu durumda başarısızlık, herhangi bir yapı ile ilgili teknik sorundan kaynaklanmamaktadır.
    
    !!! info "Hata mesajı"
        “FAST tests have failed” hata mesajı, `spec/support/fast_helper.rb` dosyasında bulunan ve çıkış kodu `1` ile sonlanmadan önce çağrılan `wait_test_run_finish` metoduyla üretilir.

8.  Test süreci sırasında CircleCI konsolunda tespit edilen güvenlik açıkları hakkında herhangi bir bilgi gösterilmez. 

    Güvenlik açıklarını, Wallarm portalında detaylı olarak inceleyebilirsiniz. Bunu yapmak için test çalışması bağlantısına gidin. Bağlantı, CircleCI konsolunda yer alan FAST bilgilendirme mesajının bir parçası olarak gösterilir.
    
    Bu bağlantı şu şekilde görünmelidir:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    Örneğin, tamamlanmış test çalışmasına bakarak örnek uygulamada birkaç XSS güvenlik açığının bulunduğunu görebilirsiniz:
    
     ![A detailed information about the vulnerability][img-cci-demo-vuln-details]
    
Sonuç olarak, FAST'in mevcut CI/CD süreçlerine entegrasyondaki güçlü yetenekleri ile entegrasyon testleri hatasız geçse bile uygulamadaki güvenlik açıklarını tespit etme kapasitesi gösterilmiştir.