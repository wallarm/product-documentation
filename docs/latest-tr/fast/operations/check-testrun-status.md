[doc-about-tr-token]:   internals.md

[img-testrun-velocity]: ../../images/fast/poc/en/checking-testrun-status/testrun-velocity.png
[img-testrun-avg-rps]:  ../../images/fast/poc/en/checking-testrun-status/testrun-avg-rps.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-test-runs]:            ../../images/fast/poc/en/checking-testrun-status/test-runs.png

[link-wl-portal-testruns-in-progress]:  https://us1.my.wallarm.com/testing/?status=running

[link-integration-chapter]:         integration-overview.md
[link-vuln-list]:                   ../vuln-list.md

[anchor-testrun-estimates]:         #estimates-of-test-runs-execution-speed-and-time-to-completion

[doc-testrun-copying]:              copy-testrun.md
[doc-stop-recording]:               stop-recording.md


#   Test Çalıştırma Durumunun Kontrol Edilmesi

İlk referans isteği kaydedildiğinde test isteklerinin oluşturulması ve uygulanması işlemleri başlar ve referans isteklerin kaydedilmesi sürecinden önemli bir süre sonra sona erebilir. Çalışan prosedürler hakkında bazı bilgiler almak için test çalıştırma durumunu kontrol edebilirsiniz. Bunun için aşağıdaki yöntemler kullanılabilir:

* [Wallarm UI üzerinden durum kontrolü](#wallarm-ui-üzerinden-durum-kontrolü)
* [API yöntemini kullanarak durum kontrolü](#api-yöntemini-kullanarak-durum-kontrolü)

## Wallarm UI Üzerinden Durum Kontrolü

Test çalıştırma durumu Wallarm UI'da gerçek zamanlı olarak görüntülenir. Durumu kontrol etmek için:

1. [US bulut](https://us1.my.wallarm.com/) veya [EU bulut](https://my.wallarm.com/) 'taki Wallarm hesabınıza giriş yapın.
2. **Test çalışmaları** bölümünü açın ve gerekli test çalışmasına tıklayın.

![Test çalışması örneği][img-test-runs]

Her referans istek için durum gösterilir:

* **Geçti** ![Durum: Geçti][img-status-passed]
        
    Verilen referans isteği için hiçbir zafiyet bulunamadı.
        
* **Devam Ediyor** ![Durum: Devam Ediyor][img-status-inprogress]
              
    Referans istek zafiyetler için test ediliyor.

* **Başarısız** ![Durum: Başarısız][img-status-failed]  
        
    Verilen referans isteği için zafiyetler bulundu. Her referans isteği için bulunan zafiyetlerin sayısı ve detaylarına ulaşmak için bir link gösterilir.

* **Hata** ![Durum: Hata][img-status-error]  
            
    Gösterilen hata nedeniyle test süreci durduruldu:

    * `Bağlantı başarısız`: ağ hatası
    * `Auth hatası`: kimlik doğrulama parametreleri yanlış geçildi veya hiç geçilmedi
    * `Geçersiz politikalar`: yapılandırılmış test politikasını uygulama başarısız oldu
    * `Dahili istisna`: yanlış güvenlik testi konfigürasyonu
    * `Kayıt hatası`: yanlış veya eksik istek parametreleri

* **Bekliyor** ![Durum: Bekliyor][img-status-waiting]      
        
    Referans istek test için kuyruğa alındı. Sadece sınırlı sayıda isteği aynı anda test edilebilir. 
            
* **Kesildi** ![Durum: Kesildi][img-status-interrupted]
        
    Test süreci ya **Testi kes** düğmesiyle ya da aynı FAST düğümünde başka bir test çalışması gerçekleştirildiğinde durduruldu.

## API Yöntemini Kullanarak Durum Kontrolü

!!! bilgi "Gerekli bilgiler"
    Aşağıda açıklanan adımları gerçekleştirebilmek için, aşağıdaki bilgilere ihtiyacınız olacaktır:
    
    * bir belirteç
    * bir test çalışma tanımlayıcı
    
    Test çalışma ve belirteç hakkında detaylı bilgiyi [burada][doc-about-tr-token] bulabilirsiniz.
    
    Bu belgede örnek değerlere referans verilmiştir:

    * `token_Qwe12345` bir belirteç olarak.
    * `tr_1234` bir test çalışma tanımlayıcı olarak.

!!! bilgi "Bir test çalışması kontrolünü hangi zaman dilimlerinde gerçekleştireceğinizi nasıl seçersiniz"
    Önceden belirlenmiş bir süreye (örneğin, 15 saniye) test çalışması durumunu kontrol edebilirsiniz. Alternatif olarak, bir test çalışmanın tamamlanması için tahmini süreyi kullanabilir ve bir sonraki kontrolün ne zaman yapılacağını belirleyebilirsiniz. Bu tahmini, bir test çalışmasının durumunu kontrol ederken elde edebilirsiniz. [Aşağıda detaylar mevcuttur.][anchor-testrun-estimates]

Bir test çalışma durumunu tek seferde kontrol etmek için, `https://us1.api.wallarm.com/v1/test_run/test_run_id`  URL'sine GET talebi gönderin:

--8<-- "../include-tr/fast/operations/api-check-testrun-status.md"

API sunucusuna gelen talep başarılı ise, sunucunun yanıtıyla karşılaşırsınız. Yanıt, çok sayıda kullanışlı bilgi içerir:

* `vulns`: hedef uygulamada tespit edilen zafiyetler hakkında bilgi içeren bir dizi. Belirli bir zafiyet hakkındaki her zafiyet kaydı aşağıdaki verileri içerir:
    * `id`: zafiyetin tanımlayıcısı.
    * `threat`: zafiyet için tehdit seviyesini açıklayan 1 ile 100 arasında bir numara. Seviye ne kadar yüksekse, zafiyet o kadar ciddidir.
    * `code`: zafiyete atanan bir kod.

    * `type`: zafiyet türü. Parametre [burada][link-vuln-list] açıklanan değerlerden birini alabilir.
    
* `state`: test çalışması durumu. Parametre aşağıdaki değerlerden birini alabilir:
    * `cloning`: referans isteklerin kopyalanması devam ediyor (bir test çalışması [kopyalanırken][doc-testrun-copying]).
    * `running`: test çalışma çalışıyor ve uygulanıyor.
    * `paused`: test çalışma uygulanması duraklatıldı.
    * `interrupted`: test çalışma uygulanması kesildi (örneğin, bu düğüm tarafından yürütülen geçerli test çalışma yapılırken hızlı düğüm için yeni bir test çalışması oluşturuldu).
    * `passed`: test çalışma uygulanması başarıyla tamamlandı (hiçbir zafiyet bulunamadı).
    * `failed`: test çalışma uygulanması başarısızlıkla tamamlandı (bazı zafiyetler bulundu).
    
* `baseline_check_all_terminated_count`: tüm test isteği kontrollerinin tamamlandığı referans isteği sayısı.
    
* `baseline_check_fail_count`: bazı test isteği kontrollerinin başarısız olduğu referans isteği sayısı (başka bir deyişle, FAST, bir zafiyet buldu).
    
* `baseline_check_tech_fail_count`: teknik sorunlar nedeniyle bazı test isteği kontrollerinin başarısız olduğu referans isteği sayısı (örneğin, hedef uygulama belirli bir süreliğine kullanılamıyorsa).
    
* `baseline_check_passed_count`: tüm test isteği kontrollerinin geçtiği referans isteği sayısı (başka bir deyişle, FAST bir zafiyet bulamadı). 
    
* `baseline_check_running_count`: test isteği kontrollerinin hâlâ devam ettiği referans isteği sayısı.
    
* `baseline_check_interrupted_count`: tüm test isteği kontrollerinin kesildiği referans isteği sayısı (örneğin, test çalışmasının kesilmesi nedeniyle)
    
* `sended_requests_count`: hedef uygulamaya gönderilen test isteklerinin toplam sayısı.
    
* `start_time` ve `end_time`: test çalışmasının başladığı ve sona erdiği zaman. Zaman UNIX zaman formatında belirtilmiştir.
    
* `domains`: referans isteklerin hedeflendiği hedef uygulamanın alan adlarının listesi. 
    
* `baseline_count`: kaydedilen referans isteği sayısı.
    
* `baseline_check_waiting_count`: kontrol edilmeyi bekleyen referans isteği sayısı;

* `planing_requests_count`: hedef uygulamaya gönderilmeyi bekleyen test isteklerinin toplam sayısı.

###  Test çıktısı hız ve tamamlanma süresi tahminleri

API sunucusunun yanıtında, bir test çıktısının yürütme hızını ve tamamlanma zamanını tahmin etmenize olanak sağlayan ayrı bir parametreler grubu bulunur. Bu grup, aşağıdaki parametreleri içerir:

* `current_rps`—FAST'ın uygulamaya istek gönderme hızının anlık değeridir.

    Bu, FAST'ın saniyedeki ortalama istek sayısını (RPS) ile ölçülür. Bu ortalama RPS, test çıktısının durumunun elde edilmesinden önceki 10 saniyelik süre zarfında FAST'ın hedef uygulamaya gönderdiği istek sayısıdır.

    **Örnek:**
    Test çıktısının durumu 12:03:01'de elde edildiyse `current_rps` parametresinin değeri, *(12:02:51-12:03:01 zaman aralığında gönderilen isteklerin sayısı)/10* şeklinde hesaplanır.

* `avg_rps`—FAST'ın uygulamaya istek göndermek için kullandığı ortalama hız (test çıktısının durumunun elde edilme anında).

    Bu değer, FAST'ın test çıktısının *tüm yürütme süresinde* hedef uygulamaya gönderdiği isteklerin ortalama sayısıdır:

    * Test çıktısı hala yürütülüyorsa yürütmenin başlangıcından mevcut zamana kadar (`current time`-`start_time` eşittir).
    * Test çıktısı yürütme işlemi tamamlandıysa, yürütmenin başlangıcından yürütmenin sonuna kadar (`end_time`-`start_time` eşittir).

        `avg_rps` parametresinin değeri, *(`sended_requests_count`/(tüm test çıktısı yürütme süresi))* şeklinde hesaplanır.
    
* `estimated_time_to_completion`—test çıktının yürütmesinin muhtemelen tamamlanacağı süre (saniye cinsinden ve test çıktısının durumunun elde edildiği anda). 

    Parametrenin değeri `null` ise:
    
    * Henüz hiçbir zafiyet kontrolü başlamamıştır (örneğin, yeni oluşturulan bir test çalışması için henüz referans isteği kaydedilmedi).
    * Test çıktısı yürütülüyor değil (yani, herhangi bir durumda, `"state":"running"` hariç).

    `estimated_time_to_completion` parametresinin değeri, *(`planing_requests_count`/`current_rps`)* olarak hesaplanır.
    
!!! uyarı "Test çıktısı hız ve süre tahminleri ile ilgili parametrelerin olası değerleri"
    Bahsedilen parametrelerin değerleri, bir test çıktısının yürütmesinin ilk 10 saniyesinde `null`'dır.

`estimated_time_to_completion` parametresinin değerini bir sonraki test çalışma durum kontrolünün ne zaman yapılacağını belirlemek için kullanabilirsiniz. Not: değer artabilir veya azalabilir.

**Örnek:**

Bir test çıktısının durumunu `estimated_time_to_completion` süresinde kontrol etmek için aşağıdakileri yapın:

1.  Test çalışmasının yürütmesi başladıktan sonra, test çıktısının durumunu birkaç kez elde edin. Örneğin, bunu 10 saniyelik aralıklarla yapabilirsiniz. `estimated_time_to_completion` parametresinin değeri `null` olmaması için bunu yapmaya devam edin.

2.  `estimated_time_to_completion` saniye sonra bir sonraki test çalışma durum kontrolünü gerçekleştirin.

3.  Test çalışmasının yürütmesi tamamlanana kadar önceki adımı tekrarlayın.

!!! bilgi "Tahminlerin grafiksel gösterimi"
    Wallarm web arayüzünü kullanarak tahminlerin değerlerini de elde edebilirsiniz.
    
    Bunu yapmak için, Wallarm portalına giriş yapın ve şu anda yürütülen [test çalışmaları listesine][link-wl-portal-testruns-in-progress] gidin:
    
    ![Test çalışmasının hız ve yürütme süresi tahminleri][img-testrun-velocity]
    
    Test çalışmasının yürütmesi tamamlandığında, saniyede gönderilen ortalama isteklerin değerini görürsünüz:
    
    ![Ortalama isteklerin saniyedeki değeri][img-testrun-avg-rps]