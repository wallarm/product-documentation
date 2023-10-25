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

Bu bölüm, güvenlik test setinin oluşturulup yürütülmesi sürecine rehberlik edecektir. Test seti, daha önce [oluşturduğunuz][link-previous-chapter] test politikası ve temel talebi kullanarak oluşturulacaktır. Gerekli tüm adımlar tamamlandığında, testlerinizin sonucunda bir XSS açıklığı bulacaksınız.

Uygulama güvenlik testine başlamak için, test çalışması oluşturulmalıdır. *Test çalışması*, tek seferlik bir zafiyet testi sürecini tanımlar. Her test çalışmasının doğru FAST işlemi için önemli olan benzersiz bir tanımlayıcısı vardır. Test çalışması oluşturulduğunda, test çalışması ID'si ve test politikası FAST düğümüne gönderilir. Daha sonra düğümde güvenlik testi süreci başlar.

FAST, güvenlik test setini aşağıdaki gibi oluşturur ve yürütür:

1.  Düğüm, test politikası ve test çalışma ID'si kendisine gönderilene kadar tüm gelen talepleri şeffaf bir şekilde yönlendirir.

2.  Test çalışması oluşturulup çalıştırıldığında, FAST düğümü test politikası ve test çalışma ID'sini Wallarm bulutundan alır.

3.  Eğer düğüm, hedef uygulamaya bir temel talebi alırsa, o zaman:
    1.  Düğüm, gelen talebi test çalışma ID'si ile işaretler
    2.  İşaretlenmiş talep Wallarm buluta kaydedilir
    3.  Başlangıç temel talebi hedef uygulamaya değiştirilmeden gönderilir
    
    !!! bilgi "Temel taleplerin kayıt süreci"
        Bu sürece genellikle temel taleplerin kayıt süreci denir. Kaydı, bulutun web arayüzünden veya Wallarm API'sine bir API çağrısı yaparak durdurabilirsiniz. Düğüm, başlangıç temel taleplerini hedef uygulamaya göndermeye devam edecektir.
    
    Temel taleplerin kaydedilmesi, düğümün test politikası ve test çalışma ID'sini ilk aldığı durumda başlar.
    
    FAST düğümü, bir isteğin temel olup olmadığını, `ALLOWED_HOSTS` çevre değişkenini incelerek belirler. Bu değişken, FAST düğümünün [dağıtım süreci][link-deployment] sırasında ayarlandı. Eğer talebin hedef alan adı bu değişken tarafından kabul edilirse, talep temel olarak kabul edilir. Eğer rehbere uyduysanız, `google-gruyere.appspot.com` alan adına yapılan tüm talepler temel olarak kabul edilir.
    
    Hedefe yönelik olmayan tüm diğer talepler, herhangi bir değişiklik yapılmadan şeffaf bir şekilde yönlendirilir.

4.  FAST düğümü, test çalışma ID'sine dayanarak Wallarm bulutundan tüm kaydedilmiş temel talepleri alır.

5.  FAST düğümü, buluttan alınan test politikasını kullanarak her temel talep için güvenlik testleri oluşturur.

6.  Oluşturulan güvenlik test seti, taleplerin hedef uygulamaya düğümden gönderilmesiyle yürütülür. Test sonuçları, test çalışma ID'si ile ilişkilendirilir ve bulutta saklanır.

    ![FAST düğümünün iç mantığı][img-fast-node-internals]

    !!! bilgi "Kullanımdaki bir test çalışması hakkında not"
        Herhangi bir zaman diliminde, sadece bir test çalışması FAST düğümünde çalışabilir. Aynı düğüm için başka bir test çalışması oluşturursanız, mevcut test çalışması yürütme işlemi kesilir.
       
Güvenlik test setinin oluşturulma ve uygulama sürecini başlatmak için aşağıdakileri yapın:

1.  [Test çalışmasını oluşturun ve çalıştırın][anchor1]
2.  [Daha önce oluşturduğunuz HTTPS temel isteğini yürütün][anchor2]
    
##  1.  Test Çalışmasını Oluşturun ve Çalıştırın  

Test çalışmasını, Wallarm hesap web arayüzünü kullanarak [talimatlara][link-create-tr-gui] uyarak oluşturun.

Talimatları takip ettikten sonra, test çalışması oluştururken aşağıdaki temel parametreleri ayarlayın:

* test çalışma adı: `DEMO TEST RUN`;
* test politikası: `DEMO POLICY`;
* FAST düğümü: `DEMO NODE`.

Bu talimatlar gelişmiş ayarları içermemektedir.

Test çalışması kaydedildikten sonra, ID'si otomatik olarak FAST düğümüne geçirilir. "Testruns" sekmesinde, yanıp sönen kırmızı bir nokta göstergesi olan oluşturulan test çalışmasını göreceksiniz. Bu gösterge, test çalışması için temel taleplerin kaydedildiğini anlamına gelir.

Kaydedilen tüm temel talepleri görmek için "Baseline req." sütununa tıklayabilirsiniz.

![Kaydedilmiş temel talepleri görüntüleme][img-view-recording-cloud]

!!! bilgi "Düğümün kayda hazır olması"
    FAST düğümünün adı `DEMO NODE` olan ve `DEMO TEST RUN` adlı test çalışması için temel talepleri kaydetmeye hazır olduğunu konsol çıktısında görene kadar beklemelisiniz
    
    Eğer düğüm, temel talebi kaydetmeye hazır ise, konsol çıktısında benzer bir mesaj göreceksiniz:
    
    `[info] TestRun#N ‘DEMO TEST RUN’ için temeller kaydediliyor`
    
    Bu mesaj gösterildikten sonra düğüm, temel taleplere dayalı olarak bir güvenlik test seti oluşturabilecektir.    

Konsol çıktısından, FAST düğümünün adı `DEMO NODE` olan ve `DEMO TEST RUN` adlı test çalışması için temel talepleri kaydetmeye hazır olduğu görülür:

--8<-- "../include-tr/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  Daha Önce Oluşturduğunuz HTTPS Temel İsteğini Yürütün

Bunu yapmak için, önceden yapılandırılmış Mozilla Firefox tarayıcısını kullanarak [oluşturduğunuz][link-previous-chapter] bağlantıya gidin.

!!! bilgi "Bir bağlantı örneği"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

İstek uygulamasının sonucu aşağıda gösterilmiştir:

![İstek uygulamasının sonucu][img-request-exec-result]

Konsol çıktısından, FAST düğümünün bir temel talebi kaydettiği görülür:

--8<-- "../include-tr/fast/console-include/qsg/fast-node-testing.md"

Bazı temel taleplerin Wallarm buluta kaydedildiğini görebilirsiniz:

![Gelen temel talepler][img-incoming-baselines]

Bu belge, gösterim amaçlı olarak sadece bir talebin uygulandığını önerir. Ek yönlendirilen talepler olmadığına göre, "Actions" açılır menüsünden **Kayıt İşlemini Durdur** seçeneğini seçerek temel kaydı durdurun.

!!! bilgi "Test çalışması yürütme sürecinin kontrolü"
    Oluşturduğunuz test çalışması için bir güvenlik test seti oldukça hızlı bir şekilde oluşturuldu. Ancak, süreç, temel taleplerin sayısına, kullanılan test politikasına ve hedef uygulamanın yanıt verme hızına bağlı olarak önemli ölçüde uzun sürebilir. "Actions" açılır menüsünden uygun bir seçeneği seçerek test sürecini duraklatabilir veya durdurabilirsiniz.

Temel kaydın devam etmediği durumlarda, test süreci tamamlandığında test çalışması otomatik olarak durur. "Result" sütununda bulunan zafiyetler hakkında kısa bilgiler görüntülenir. FAST, uygulanan HTTPS talebi için bazı XSS zafiyetlerini bulmalıdır:

![Bulunan zafiyet][img-xss-found]
    
Şimdi, bölüm hedeflerinin tamamını tamamlamış olmalı ve Google Gruyere uygulamasına yönelik HTTPS isteğinin test sonucu ile birlikte bulunmalısınız. Sonuç, bulunan üç XSS açıklığını gösterir.
