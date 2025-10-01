[img-fast-node-internals]: ../../images/fast/qsg/en/test-run/18-qsg-fast-test-run-proxy-internals.png
[img-view-recording-cloud]: ../../images/fast/qsg/common/test-run/20-qsg-fast-test-run-baselines-recording.png
[img-request-exec-result]:  ../../images/fast/qsg/common/test-run/22-qsg-fast-test-run-gruyere-request.png
[img-incoming-baselines]:   ../../images/fast/qsg/common/test-run/23-qsg-fast-test-run-processing.png    
[img-xss-found]:            ../../images/fast/qsg/common/test-run/24-qsg-fast-test-run-vuln.png


[link-deployment]:          deployment.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-previous-chapter]:    test-preparation.md
[link-create-tr-gui]:       ../operations/create-testrun.md#creating-a-test-run-via-web-interface

[anchor1]:  #1-create-and-run-the-test-run  
[anchor2]:  #2-execute-the-https-baseline-request-you-created-earlier 

    
    
#   Testi çalıştırma

Bu bölüm, bir güvenlik test setinin üretilmesi ve yürütülmesi süreci boyunca size rehberlik edecektir. Test seti, [önceden][link-previous-chapter] oluşturduğunuz test politikası ve temel (baseline) istek kullanılarak derlenecektir. Gerekli tüm adımlar tamamlandığında, testinizin sonucu olarak bir XSS güvenlik açığı bulacaksınız.

Uygulama güvenlik testine başlamak için bir test çalıştırması oluşturulmalıdır. *Test çalıştırması*, tek seferlik bir zafiyet test sürecini ifade eder. Her test çalıştırmasının, FAST’in doğru çalışması için kritik olan benzersiz bir tanımlayıcısı vardır. Bir test çalıştırması oluşturduğunuzda, test çalıştırması kimliği (ID) ve test politikası FAST düğümüne gönderilir. Ardından güvenlik testi süreci düğüm üzerinde başlatılır.

FAST bir güvenlik test setini aşağıdaki şekilde üretir ve yürütür:

1.  Düğüm, test politikası ve test çalıştırması kimliği kendisine gönderilene kadar gelen tüm istekleri şeffaf bir şekilde proxy’ler.

2.  Test çalıştırması oluşturulup çalıştırıldığında, FAST düğümü test politikasını ve test çalıştırması kimliğini Wallarm cloud üzerinden alır.

3.  Düğüm hedef uygulamaya yönelik bir temel (baseline) istek alırsa:
    1.  Düğüm, gelen isteği test çalıştırması kimliği ile işaretler
    2.  İşaretli istek Wallarm cloud’a kaydedilir
    3.  İlk temel istek, değiştirilmeden hedef uygulamaya gönderilir
    
    !!! info "Temel isteklerin kaydedilmesi süreci"
        Bu sürece sıklıkla temel isteklerin kaydedilmesi (baseline recording) denir. Kaydı, bulutun web arayüzünden ya da Wallarm API’sine bir API çağrısı yaparak durdurabilirsiniz. Düğüm, ilk temel istekleri hedef uygulamaya göndermeye devam edecektir.
    
    Temel kayıt, düğümün önce test politikasını ve test çalıştırması kimliğini alması durumunda başlar.
    
    FAST düğümü, bir isteğin temel istek olup olmadığını `ALLOWED_HOSTS` ortam değişkenini inceleyerek belirler. Bu değişken, FAST düğümünün [kurulumu sırasında][link-deployment] ayarlanmıştır. İsteğin hedef alan adı bu değişken tarafından izin verilenler arasındaysa, istek temel istek olarak kabul edilir. Kılavuzu takip ettiyseniz, `google-gruyere.appspot.com` alan adına yapılan tüm istekler temel istek olarak kabul edilecektir.
    
    Uygulamayı hedeflemeyen diğer tüm istekler herhangi bir değişiklik yapılmadan şeffaf bir şekilde proxy’lenir.

4.  FAST düğümü, test çalıştırması kimliğine göre kaydedilmiş tüm temel istekleri Wallarm cloud’dan alır.

5.  FAST düğümü, buluttan aldığı test politikasını kullanarak her temel istek için güvenlik testleri üretir.

6.  Üretilen güvenlik test seti, isteklerin düğümden hedef uygulamaya gönderilmesiyle yürütülür. Test sonuçları test çalıştırması kimliği ile ilişkilendirilir ve bulutta saklanır.

    ![FAST düğümünün iç mantığı][img-fast-node-internals]

    !!! info "Kullanımdaki bir test çalıştırmasına ilişkin not"
        Herhangi bir zaman aralığında, FAST düğümünde yalnızca bir test çalıştırması çalıştırılabilir. Aynı düğüm için başka bir test çalıştırması oluşturursanız, mevcut test çalıştırmasının yürütümü kesilir.
       
Güvenlik test setinin oluşturulması ve yürütülmesi sürecini başlatmak için aşağıdakileri yapın:

1.  [Test çalıştırmasını oluşturun ve çalıştırın][anchor1]
2.  [Daha önce oluşturduğunuz HTTPS temel isteğini yürütün][anchor2]
    
##  1.  Test çalıştırmasını oluşturun ve çalıştırın  

Wallarm hesap web arayüzü üzerinden [talimatları][link-create-tr-gui] izleyerek bir test çalıştırması oluşturun.

Talimatları tamamladıktan sonra, bir test çalıştırması oluştururken aşağıdaki temel parametreleri ayarlayın:

* test run name: `DEMO TEST RUN`;
* test policy: `DEMO POLICY`;
* FAST node: `DEMO NODE`.

Bu talimatlar gelişmiş ayarları içermez.

Test çalıştırması kaydedildikten sonra, kimliği (ID) otomatik olarak FAST düğümüne iletilir. “Testruns” sekmesinde, kırmızı yanıp sönen bir nokta göstergesine sahip olarak oluşturulan test çalıştırmasını göreceksiniz. Bu gösterge, test çalıştırması için temel isteklerin kaydedildiği anlamına gelir.

Kaydedilmekte olan tüm temel istekleri görmek için “Baseline req.” sütununa tıklayabilirsiniz.

![Kaydedilen temel isteklerin görüntülenmesi][img-view-recording-cloud]

!!! info "Düğümün kayda hazır olması"
    `DEMO TEST RUN` adlı test çalıştırması için `DEMO NODE` adlı FAST düğümünün temel istekleri kaydetmeye hazır olduğunu belirten konsol çıktısını görene kadar beklemelisiniz.
    
    Düğüm temel isteği kaydetmeye hazırsa, konsol çıktısında buna benzer bir mesaj göreceksiniz:
    
    `[info] Recording baselines for TestRun#N ‘DEMO TEST RUN’`
    
    Düğüm, yalnızca bu mesaj görüntülendikten sonra temel isteklere dayanarak bir güvenlik test seti üretebilecektir.	

Konsol çıktısından, `DEMO TEST RUN` adlı test çalıştırması için `DEMO NODE` adlı FAST düğümünün temel istekleri kaydetmeye hazır olduğu gözlemlenebilir:

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  Daha önce oluşturduğunuz HTTPS temel isteğini yürütün

Bunu yapmak için, önceden yapılandırılmış Mozilla Firefox tarayıcısını kullanarak [oluşturduğunuz][link-previous-chapter] bağlantıya gidin.

!!! info "Bir bağlantı örneği"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

İstek yürütümünün sonucu aşağıda gösterilmektedir:

![İstek yürütümünün sonucu][img-request-exec-result]

FAST düğümünün bir temel isteği kaydettiği konsol çıktısından gözlemlenebilir:

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

Bazı temel isteklerin Wallarm cloud’a kaydedildiğini gözlemleyebilirsiniz:

![Gelen temel istekler][img-incoming-baselines]

Bu belge, gösterim amacıyla yalnızca bir isteğin yürütülmesini önermektedir. Hedef uygulamaya yönelik ek istek olmadığı göz önüne alındığında, “Actions” açılır menüsünden **Stop recording** seçeneğini seçerek temel kayıt sürecini durdurun.

!!! info "Test çalıştırması yürütme sürecinin kontrolü"
    Oluşturduğunuz test çalıştırması için güvenlik test seti oldukça hızlı bir şekilde üretildi. Ancak süreç, temel isteklerin sayısına, kullanılan test politikasına ve hedef uygulamanın yanıt verebilirliğine bağlı olarak önemli ölçüde zaman alabilir. Süreci “Actions” açılır menüsünden uygun seçeneği seçerek duraklatabilir veya durdurabilirsiniz.

Test süreci tamamlandığında ve herhangi bir temel kayıt devam etmiyorsa, test çalıştırması otomatik olarak durur. Tespit edilen güvenlik açıklarına ilişkin kısa bilgiler “Result” sütununda görüntülenecektir. FAST, yürütülen HTTPS isteği için bazı XSS güvenlik açıkları bulmalıdır:

![Keşfedilen güvenlik açığı][img-xss-found]
    
Artık bölümün tüm hedeflerini, Google Gruyere uygulamasına yapılan HTTPS isteğinin test sonucu ile birlikte tamamlamış olmalısınız. Sonuç, üç XSS güvenlik açığının bulunduğunu göstermektedir.