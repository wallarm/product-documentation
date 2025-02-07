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

    
    
#   Testi Çalıştırma

Bu bölüm, bir güvenlik testi seti oluşturma ve yürütme sürecinde size rehberlik edecektir. Test seti, [önceden][link-previous-chapter] oluşturduğunuz test politikası ve başlangıç isteği kullanılarak oluşturulacaktır. Gerekli tüm adımlar tamamlandığında, testiniz sonucunda bir XSS açığı bulacaksınız.

Uygulama güvenliği testine başlamak için bir test çalıştırması oluşturulmalıdır. *Test çalıştırması*, tek seferlik bir açık test etme sürecini tanımlar. Her test çalıştırmasının benzersiz bir tanımlayıcısı vardır; bu, FAST’in doğru çalışması için hayati öneme sahiptir. Bir test çalıştırması oluşturduğunuzda, test çalıştırması kimliği ve test politikası FAST node’una gönderilir. Ardından, node üzerinde güvenlik testi süreci başlatılır.

FAST, güvenlik testi setini aşağıdaki şekilde oluşturur ve yürütür:

1.  Test politikası ve test çalıştırması kimliği gönderilene kadar, node tüm gelen istekleri şeffafca proxy üzerinden aktarır.

2.  Test çalıştırması oluşturulup başlatıldığında, FAST node, Wallarm Cloud’dan test politikası ve test çalıştırması kimliğini alır.

3.  Node, hedef uygulamaya yönelik bir başlangıç isteği aldığında:
    1.  Gelen isteğe test çalıştırması kimliğini ekler.
    2.  İşaretlenen istek Wallarm Cloud’a kaydedilir.
    3.  Başlangıç isteği, herhangi bir değişiklik yapılmadan hedef uygulamaya gönderilir.
    
    !!! info "Başlangıç İstekleri Kaydetme Süreci"
        Bu süreç, genellikle başlangıç isteklerinin kaydedilmesi olarak adlandırılır. Kayıt işlemini Wallarm Cloud’un web arayüzünden veya Wallarm API’a yapılan bir API çağrısı aracılığıyla durdurabilirsiniz. Node, başlangıç isteklerini hedef uygulamaya göndermeye devam edecektir.
    
    Başlangıç kaydı, node önce test politikası ve test çalıştırması kimliğini aldığında başlar.
    
    FAST node, bir isteğin başlangıç isteği olup olmadığını belirlemek için `ALLOWED_HOSTS` ortam değişkenini inceler. Bu değişken, FAST node’un [dağıtım süreci][link-deployment] sırasında ayarlanmıştır. Eğer isteğin hedef domaini, değişken tarafından izin verilenler arasında ise, istek başlangıç isteği olarak kabul edilir. Kılavuzu takip ettiyseniz, `google-gruyere.appspot.com` domainine yapılan tüm istekler başlangıç olarak değerlendirilecektir.
    
    Hedef uygulamaya yönelik olmayan diğer tüm istekler, herhangi bir değişiklik yapılmadan şeffafca proxy üzerinden iletilir.

4.  FAST node, test çalıştırması kimliğine dayanarak Wallarm Cloud’dan kaydedilmiş tüm başlangıç isteklerini çeker.

5.  FAST node, Wallarm Cloud’dan aldığı test politikası kullanılarak her bir başlangıç isteği için güvenlik testleri oluşturur.

6.  Oluşturulan güvenlik testi seti, node üzerinden hedef uygulamaya istekler gönderilerek yürütülür. Test sonuçları test çalıştırması kimliği ile ilişkilendirilir ve Cloud’da saklanır.

    ![FAST node iç mantığı][img-fast-node-internals]

    !!! info "Kullanımda Olan Test Çalıştırması Hakkında Not"
        Belirli bir zaman diliminde FAST node üzerinde yalnızca bir test çalıştırması yürütülebilir. Aynı node için başka bir test çalıştırması oluşturduğunuzda, mevcut test çalıştırması kesintiye uğrar.
       
Güvenlik testi setinin oluşturulması ve yürütülmesi sürecini başlatmak için aşağıdakileri yapın:

1.  [Test çalıştırmasını oluşturun ve çalıştırın][anchor1]
2.  [Önceden oluşturduğunuz HTTPS başlangıç isteğini çalıştırın][anchor2]
    
##  1.  Test Çalıştırmasını Oluşturun ve Çalıştırın  

Wallarm hesabı web arayüzü üzerinden [talimatları][link-create-tr-gui] izleyerek bir test çalıştırması oluşturun.

Talimatları izledikten sonra, test çalıştırması oluştururken aşağıdaki temel parametreleri ayarlayın:

* test çalıştırması adı: `DEMO TEST RUN`;
* test politikası: `DEMO POLICY`;
* FAST node: `DEMO NODE`.

Bu talimatlar gelişmiş ayarları içermemektedir.

Test çalıştırması kaydedildikten sonra, kimliği otomatik olarak FAST node’a iletilecektir. “Testruns” sekmesinde, yanıp sönen kırmızı nokta göstergesi ile oluşturulan test çalıştırmasını göreceksiniz. Bu gösterge, test çalıştırması için başlangıç isteklerinin kaydedildiğini ifade eder.

Kayıt altına alınan tüm başlangıç isteklerini görmek için “Baseline req.” sütununa tıklayabilirsiniz.

![Kayıtlı Başlangıç İsteklerini Görüntüleme][img-view-recording-cloud]

!!! info "Kaydetme İçin Node’un Hazır Olması"
    `DEMO TEST RUN` adlı test çalıştırması için `DEMO NODE` adlı FAST node’un başlangıç isteklerini kaydetmeye hazır olduğuna dair console çıktısını görene kadar beklemelisiniz.
    
    Eğer node başlangıç isteğini kaydetmeye hazırsa, console çıktısında şu benzer mesajı göreceksiniz:
    
    `[info] TestRun#N ‘DEMO TEST RUN’ için başlangıç istekleri kaydediliyor`
    
    Bu mesaj görüntülendikten sonra, node yalnızca başlangıç isteklerine dayanarak bir güvenlik testi seti oluşturabilecektir.

Console çıktısından, `DEMO TEST RUN` adlı test çalıştırması için `DEMO NODE` adlı FAST node’un başlangıç isteklerini kaydetmeye hazır olduğu gözlemlenebilir:

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  Önceden Oluşturduğunuz HTTPS Başlangıç İsteğini Çalıştırın

Bunu yapmak için, önceden yapılandırılmış Mozilla Firefox tarayıcısını kullanarak [oluşturduğunuz bağlantıya][link-previous-chapter] gidin.

!!! info "Bağlantı Örneği"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

İstek yürütme sonucunun çıktısı aşağıda gösterilmiştir:

![İstek Yürütme Sonucu][img-request-exec-result]

Console çıktısından, FAST node’un bir başlangıç isteğini kaydettiği gözlemlenmektedir:

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

Wallarm Cloud’a kaydedilmiş bazı başlangıç isteklerini gözlemleyebilirsiniz:

![Gelen Başlangıç İstekleri][img-incoming-baselines]

Bu belge, gösterim amaçlı olarak yalnızca bir isteğin yürütülmesini önermektedir. Hedef uygulamaya ek istek olmadığından, “Actions” açılır menüsünden **Stop recording** seçeneğini seçerek başlangıç kaydı sürecini durdurun.

!!! info "Test Çalıştırması Yürütme Sürecinin Kontrolü"
    Oluşturduğunuz test çalıştırması için güvenlik testi seti oldukça hızlı oluşturulmuştur. Ancak, süreç; başlangıç isteklerinin sayısına, kullanılan test politikasına ve hedef uygulamanın tepki süresine bağlı olarak önemli bir zaman alabilir. “Actions” açılır menüsünden uygun seçeneği seçerek test sürecini duraklatabilir veya durdurabilirsiniz.

Test süreci, herhangi bir başlangıç kaydının devam etmediği sürece tamamlandığında otomatik olarak duracaktır. Algılanan güvenlik açıkları hakkında kısa bilgiler “Result” sütununda gösterilecektir. FAST, yürütülen HTTPS isteği için bazı XSS güvenlik açıkları bulmalıdır:

![Bulunan Güvenlik Açığı][img-xss-found]
    
Artık, Google Gruyere uygulamasına yapılan HTTPS isteğinin test sonuçlarıyla birlikte bölümün tüm hedefleri tamamlanmıştır. Sonuç, üç adet XSS güvenlik açığının bulunduğunu göstermektedir.