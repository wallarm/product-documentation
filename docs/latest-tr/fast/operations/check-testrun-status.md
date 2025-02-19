```markdown
#   Test Çalıştırma Durumunun Kontrolü

Test isteklerinin oluşturulması ve çalıştırılması süreçleri, ilk temel istek kaydedildiğinde başlar ve temel istek kaydetme işlemi [durdurulduğunda][doc-stop-recording] önemli bir süre boyunca devam edebilir. Test çalıştırmasının durumunu kontrol ederek, gerçekleştirilen süreçler hakkında bilgi edinebilirsiniz. Bunun için aşağıdaki yöntemler kullanılabilir:

* [Wallarm UI üzerinden durumu kontrol etme](#checking-the-state-via-wallarm-ui)
* [API yöntemiyle durumu kontrol etme](#checking-the-state-using-api-method)

## Wallarm UI Üzerinden Durum Kontrolü

Test çalıştırma durumu, Wallarm UI'da gerçek zamanlı modda görüntülenir. Durumu kontrol etmek için:

1. [US cloud](https://us1.my.wallarm.com/) veya [EU cloud](https://my.wallarm.com/) üzerinde Wallarm hesabınıza giriş yapın.
2. **Test runs** bölümünü açın ve ilgili test çalıştırmasına tıklayın.

![Test run example][img-test-runs]

Her temel istek için durum görüntülenir:

* **Passed** ![Status: Passed][img-status-passed]
        
    İlgili temel istek için herhangi bir güvenlik açığı tespit edilmemiştir.
        
* **In progress** ![Status: In progress][img-status-inprogress]
              
    Temel istek, güvenlik açıkları açısından test edilmektedir.

* **Failed** ![Status: Failed][img-status-failed]  
        
    İlgili temel istek için güvenlik açıkları tespit edilmiştir. Her temel istek için tespit edilen güvenlik açığı sayısı ve detaylar için link görüntülenir.
            
* **Error** ![Status: Error][img-status-error]  
            
    Test süreci, aşağıdaki hatalardan ötürü durdurulmuştur:

    * `Connection failed`: ağ hatası
    * `Auth failed`: kimlik doğrulama parametreleri gönderilmedi ya da yanlış gönderildi
    * `Invalid policies`: yapılandırılmış test politikasının uygulanması başarısız oldu
    * `Internal exception`: yanlış güvenlik testi yapılandırması
    * `Recording error`: yanlış veya eksik istek parametreleri

* **Waiting** ![Status: Waiting][img-status-waiting]      
        
    Temel istek test için sıraya alınmıştır. Aynı anda yalnızca sınırlı sayıda istek test edilebilir. 
            
* **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
    Test süreci ya **Interrupt testing** düğmesine basılarak kesildi ya da aynı FAST düğümü üzerinde başka bir test çalıştırması başladı.

## API Yöntemiyle Durum Kontrolü

!!! info "Gerekli Veriler"
    Aşağıda belirtilen adımlara devam edebilmek için şu veriler gereklidir:
    
    * bir token
    * bir test çalıştırma tanımlayıcısı
    
    Test çalıştırması ve token hakkında detaylı bilgiyi [buradan][doc-about-tr-token] edinebilirsiniz.
    
    Bu belgede örnek değer olarak aşağıdaki değerler kullanılmaktadır:

    * Token olarak `token_Qwe12345`.
    * Test çalıştırma tanımlayıcısı olarak `tr_1234`.


!!! info "Test çalıştırmasının durumunu kontrol etmek için doğru zaman aralığının seçilmesi"
    Test çalıştırmasının durumunu önceden belirlenmiş bir zaman aralığında (örneğin, 15 saniye) kontrol edebilirsiniz. Alternatif olarak, test çalıştırmasının bitiş süresi tahmini kullanılarak bir sonraki kontrolün ne zaman yapılacağı belirlenebilir. Bu tahmini, test çalıştırmasının durumu kontrol edilirken edinebilirsiniz. [Detaylar için bkz.][anchor-testrun-estimates]

Test çalıştırmasının durumunu tek seferlik kontrol etmek için, GET isteğini URL `https://us1.api.wallarm.com/v1/test_run/test_run_id` adresine gönderin:

--8<-- "../include/fast/operations/api-check-testrun-status.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı size sunulur. Yanıt, aşağıdakiler de dahil olmak üzere birçok faydalı bilgiyi sağlar:

* `vulns`: hedef uygulamadaki tespit edilen güvenlik açıkları hakkında bilgiler içeren bir dizi. Her güvenlik açığı kaydı aşağıdaki verileri içerir:
    * `id`: güvenlik açığının tanımlayıcısı.
    
    * `threat`: 1 ile 100 arasında bir sayı olarak, güvenlik açığının tehdit seviyesini tanımlar. Seviye ne kadar yüksekse, güvenlik açığı o kadar ciddidir.
    * `code`: güvenlik açığına atanan kod.

    * `type`: güvenlik açığı tipi. Bu parametre, [burada][link-vuln-list] açıklanan değerlerden birini alabilir.
    
* `state`: test çalıştırmasının durumu. Bu parametre aşağıdaki değerlerden birini alabilir:
    * `cloning`: temel isteklerin kopyalanma işlemi devam ederken (bir test çalıştırmasının [kopyası oluşturulurken][doc-testrun-copying]).
    * `running`: test çalıştırması çalışıyor ve işlem yapıyor.
    * `paused`: test çalıştırması duraklatılmış.
    * `interrupted`: test çalıştırması kesintiye uğramış (örneğin, mevcut test çalıştırması yürütülürken aynı FAST düğümü üzerinde yeni bir test çalıştırması başlatıldı).
    * `passed`: test çalıştırması başarıyla tamamlanmış (güvenlik açığı tespit edilmemiştir).
    * `failed`: test çalıştırması başarısız şekilde tamamlanmış (bazı güvenlik açıkları tespit edilmiştir).
    
* `baseline_check_all_terminated_count`: tüm test isteği kontrolleri tamamlanan temel isteklerin sayısı.
    
* `baseline_check_fail_count`: bazı test isteği kontrolleri başarısız olan temel isteklerin sayısı (yani, FAST bir güvenlik açığı tespit etti).
    
* `baseline_check_tech_fail_count`: hedef uygulamanın belirli bir süre boyunca kullanılamaması gibi teknik sorunlar nedeniyle bazı test isteği kontrolleri başarısız olan temel isteklerin sayısı.
    
* `baseline_check_passed_count`: tüm test isteği kontrollerini geçen temel isteklerin sayısı (yani, FAST bir güvenlik açığı tespit etmedi). 
    
* `baseline_check_running_count`: test isteği kontrolleri halen devam eden temel isteklerin sayısı.
    
* `baseline_check_interrupted_count`: tüm test isteği kontrolleri kesintiye uğrayan temel isteklerin sayısı (örneğin, test çalıştırmasının kesintiye uğraması nedeniyle)
    
* `sended_requests_count`: hedef uygulamaya gönderilen toplam test isteği sayısı.
    
* `start_time` ve `end_time`: sırasıyla test çalıştırmasının başladığı ve bittiği zaman. Zaman, UNIX zaman formatında belirtilmiştir.
    
* `domains`: temel isteklerin hedeflendiği hedef uygulamanın domain adlarının listesi.
    
* `baseline_count`: kaydedilen temel isteklerin sayısı.
    
* `baseline_check_waiting_count`: kontrol edilmek üzere bekleyen temel isteklerin sayısı;

* `planing_requests_count`: hedef uygulamaya gönderilmek üzere sıraya alınan toplam test isteği sayısı.

###  Test Çalıştırmasının İşlem Hızının ve Tamamlanma Süresinin Tahmini

API sunucusunun yanıtında, test çalıştırmasının işlem hızı ve tamamlanma süresinin tahminini yapabilmenizi sağlayan ayrı bir parametre grubu bulunmaktadır. Grup aşağıdaki parametreleri içerir:

* `current_rps`—FAST’ın, test çalıştırmasının durumu alınırken hedef uygulamaya gönderdiği anlık istek hızı (saniyedeki istek ortalaması).

    Bu değer, ortalama istek/saniye (RPS) değeridir. Bu ortalama RPS, test çalıştırmasının durumu alınmadan 10 saniyelik süre içerisinde hedef uygulamaya gönderilen istek sayısı olarak hesaplanır. 

    **Örnek:**
    Eğer test çalıştırmasının durumu 12:03:01'de alınırsa, `current_rps` parametresinin değeri, *(12:02:51-12:03:01 arasındaki gönderilen istek sayısı)/10* olarak hesaplanır.

* `avg_rps`—FAST’ın, test çalıştırmasının durumu alınırken hedef uygulamaya gönderdiği ortalama istek hızı.

    Bu değer, FAST’ın test çalıştırması süresince hedef uygulamaya gönderdiği ortalama istek/saniye (RPS) sayısıdır:

    * Test çalıştırmasının başlangıcından itibaren, eğer test çalıştırması halen devam ediyorsa (bu `current time`-`start_time` ile eşdeğerdir).
    * Test çalıştırması bitmişse, test çalıştırmasının başlangıcından bitişine kadar (bu `end_time`-`start_time` ile eşdeğerdir).

        `avg_rps` parametresinin değeri, *(`sended_requests_count`/(test çalıştırmasının toplam çalışma süresi))* olarak hesaplanır.
    
* `estimated_time_to_completion`—test çalıştırmasının durumunun alındığı anda, test çalıştırmasının tamamlanmasının muhtemel olacağı süre (saniye cinsinden). 

    Parametre değeri `null` ise:
    
    * Henüz hiçbir güvenlik açığı kontrolü devam etmiyorsa (örneğin, yeni oluşturulan bir test çalıştırması için henüz temel istek kaydı yapılmamışsa).
    * Test çalıştırması yürütülmüyorsa (yani, `"state":"running"` dışındaki herhangi bir durumda).

    `estimated_time_to_completion` parametresi, *(`planing_requests_count`/`current_rps`)* olarak hesaplanır.
    
!!! warning "Test çalıştırmasının işlem hızı ve süre tahmini ile ilgili parametrelerin olası değerleri"
    Yukarıda belirtilen parametre değerleri, test çalıştırmasının ilk 10 saniyesinde `null` olacaktır.

`estimated_time_to_completion` parametresinin değeri, bir sonraki test çalıştırması durum kontrolünün ne zaman yapılacağına karar vermek için kullanılabilir. Bu değerin artabileceğini veya azalabileceğini unutmayın.

**Örnek:**

Test çalıştırması bitiş süresi tahmini aralığında durum kontrolü yapmak için:

1.  Test çalıştırması başladıktan sonra, test çalıştırmasının durumunu birkaç kez alın. Örneğin, 10 saniyelik aralıklarla kontrol edebilirsiniz. `estimated_time_to_completion` parametresinin değeri `null` olana kadar bu işlemi tekrarlayın.

2.  `estimated_time_to_completion` saniye sonrasında test çalıştırmasının durumunu tekrar kontrol edin.

3.  Test çalıştırması tamamlanana kadar önceki adımı tekrarlayın.

!!! info "Tahminlerin grafiksel gösterimi"
    Tahmin değerlerini Wallarm web arayüzünü kullanarak da edinebilirsiniz.
    
    Bunun için, Wallarm portalına giriş yapıp, şu anda yürütülmekte olan [test çalıştırmaları listesini][link-wl-portal-testruns-in-progress] görüntüleyin:
    
    ![Test run's speed and execution time estimates][img-testrun-velocity]
    
    Test çalıştırması tamamlandığında, ortalama istek/saniye değeri görüntülenir:
    
    ![Average requests per second value][img-testrun-avg-rps]
```