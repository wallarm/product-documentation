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


#   Test çalışmasının durumunun kontrolü

İlk temel isteğin kaydedilmesiyle test isteklerinin oluşturulması ve yürütülmesi süreçleri başlar ve temel isteklerin kaydedilmesi süreci [durdurulduğunda][doc-stop-recording] sonra da önemli bir süre devam edebilir. Devam eden süreçlere dair fikir edinmek için test çalışmasının durumunu kontrol edebilirsiniz. Bunun için aşağıdaki yöntemler kullanılabilir:

* [Wallarm UI üzerinden durumu kontrol etme](#checking-the-state-via-wallarm-ui)
* [API yöntemi kullanarak durumu kontrol etme](#checking-the-state-using-api-method)

## Wallarm UI üzerinden durumu kontrol etme

Test çalışmasının durumu Wallarm UI içinde gerçek zamanlı olarak görüntülenir. Durumu kontrol etmek için:

1. [US cloud](https://us1.my.wallarm.com/) veya [EU cloud](https://my.wallarm.com/) üzerindeki Wallarm hesabınıza giriş yapın.
2. **Test runs** bölümünü açın ve gerekli test çalışmasına tıklayın.

![Test çalışması örneği][img-test-runs]

Durum, her temel istek için görüntülenir:

* **Passed** ![Durum: Passed][img-status-passed]
        
    İlgili temel istek için herhangi bir güvenlik açığı bulunmadı.
        
* **In progress** ![Durum: In progress][img-status-inprogress]
              
    Temel istek güvenlik açıkları için test ediliyor.

* **Failed** ![Durum: Failed][img-status-failed]  
        
    İlgili temel istek için güvenlik açıkları bulundu. Her temel istek için güvenlik açığı sayısı ve ayrıntılara ilişkin bağlantı görüntülenir.
            
* **Error** ![Durum: Error][img-status-error]  
            
    Test süreci görüntülenen hata nedeniyle durduruldu:

    * `Connection failed`: ağ hatası
    * `Auth failed`: kimlik doğrulama parametreleri iletilmedi veya hatalı iletildi
    * `Invalid policies`: yapılandırılan test ilkesinin uygulanması başarısız oldu
    * `Internal exception`: yanlış güvenlik testi yapılandırması
    * `Recording error`: istek parametreleri yanlış veya eksik

* **Waiting** ![Durum: Waiting][img-status-waiting]      
        
    Temel istek test için kuyruğa alındı. Aynı anda yalnızca sınırlı sayıda istek test edilebilir. 
            
* **Interrupted** ![Durum: Interrupted][img-status-interrupted]
        
    Test süreci ya **Interrupt testing** düğmesiyle kesildi ya da aynı FAST düğümünde başka bir test çalışması yürütüldü.

## API yöntemi kullanarak durumu kontrol etme

!!! info "Gerekli veriler"
    Aşağıda açıklanan adımlara devam etmek için şu verilere ihtiyaç vardır:
    
    * bir token
    * bir test çalışması tanımlayıcısı
    
    Test çalışması ve token hakkında ayrıntılı bilgiyi [buradan][doc-about-tr-token] edinebilirsiniz.
    
    Bu dökümanda örnek değer olarak şu değerler kullanılmıştır:

    * token olarak `token_Qwe12345`.
    * test çalışması tanımlayıcısı olarak `tr_1234`.


!!! info "Bir test çalışmasının kontrolünü gerçekleştirmek için doğru zaman aralığı nasıl seçilir"
    Test çalışmasının durumunu önceden tanımlı bir zaman aralığında (ör. 15 saniye) kontrol edebilirsiniz. Alternatif olarak, bir test çalışmasının tamamlanma için tahmini süresini kullanarak bir sonraki kontrolün ne zaman yapılacağını belirleyebilirsiniz. Bu tahmini, bir test çalışmasının durumunu kontrol ederken elde edebilirsiniz. [Ayrıntılar için aşağıya bakın.][anchor-testrun-estimates]

Test çalışmasının durumunu tek seferlik kontrol etmek için `https://us1.api.wallarm.com/v1/test_run/test_run_id` URL’sine bir GET isteği gönderin:

--8<-- "../include/fast/operations/api-check-testrun-status.md"

API sunucusuna yapılan istek başarılı olursa, sunucu cevabını alırsınız. Bu cevap, aşağıdakiler dahil birçok faydalı bilgi içerir:

* `vulns`: hedef uygulamada tespit edilen güvenlik açıklarına ilişkin bilgileri içeren bir dizi. Her bir güvenlik açığı kaydı, belirli bir güvenlik açığına dair aşağıdaki verileri tutar:
    * `id`: güvenlik açığının tanımlayıcısı.
    
    * `threat`: güvenlik açığının tehdit düzeyini tanımlayan, 1 ile 100 arasında bir sayı. Düzey ne kadar yüksekse güvenlik açığı o kadar ciddidir.
    * `code`: güvenlik açığına atanan kod.

    * `type`: güvenlik açığı türü. Parametre, [burada][link-vuln-list] açıklanan değerlerden birini alabilir.
    
* `state`: test çalışmasının durumu. Parametre aşağıdaki değerlerden birini alabilir:
    * `cloning`: temel isteklerin kopyalanması devam ediyor (bir test çalışmasının [kopyasını oluştururken][doc-testrun-copying]).
    * `running`: test çalışması çalışıyor ve yürütülüyor.
    * `paused`: test çalışmasının yürütülmesi duraklatıldı.
    * `interrupted`: test çalışmasının yürütülmesi kesildi (ör. bu düğüm tarafından yürütülürken FAST düğümü için yeni bir test çalışması oluşturuldu).
    * `passed`: test çalışmasının yürütülmesi başarıyla tamamlandı (güvenlik açığı bulunmadı).
    * `failed`: test çalışmasının yürütülmesi başarısız tamamlandı (bazı güvenlik açıkları bulundu).
    
* `baseline_check_all_terminated_count`: tüm test istek kontrolleri tamamlanan temel isteklerin sayısı.
    
* `baseline_check_fail_count`: bazı test istek kontrolleri başarısız olan temel isteklerin sayısı (başka bir deyişle, FAST bir güvenlik açığı buldu).
    
* `baseline_check_tech_fail_count`: bazı test istek kontrolleri teknik sorunlar nedeniyle başarısız olan temel isteklerin sayısı (ör. hedef uygulama bir süreliğine kullanılamadıysa).
    
* `baseline_check_passed_count`: tüm test istek kontrolleri geçen temel isteklerin sayısı (başka bir deyişle, FAST herhangi bir güvenlik açığı bulmadı). 
    
* `baseline_check_running_count`: test istek kontrolleri hâlâ devam eden temel isteklerin sayısı.
    
* `baseline_check_interrupted_count`: tüm test istek kontrolleri kesilen temel isteklerin sayısı (ör. test çalışmasının kesilmesi nedeniyle)
    
* `sended_requests_count`: hedef uygulamaya gönderilen toplam test isteklerinin sayısı.
    
* `start_time` ve `end_time`: sırasıyla test çalışmasının başladığı ve bittiği zaman. Zaman UNIX zaman biçiminde belirtilir.
    
* `domains`: temel isteklerin hedeflendiği hedef uygulamanın alan adlarının listesi. 
    
* `baseline_count`: kaydedilen temel isteklerin sayısı.
    
* `baseline_check_waiting_count`: kontrol edilmek için bekleyen temel isteklerin sayısı;

* `planing_requests_count`: hedef uygulamaya gönderilmek üzere kuyruğa alınmış toplam test isteklerinin sayısı.

###  Test çalışmasının yürütme hızı ve tamamlanma süresi tahminleri

API sunucusunun cevabında, bir test çalışmasının yürütme hızını ve tamamlanma süresini tahmin etmenize olanak sağlayan ayrı bir parametre grubu vardır. Grup, aşağıdaki parametrelerden oluşur:

* `current_rps`—FAST’in hedef uygulamaya (test çalışmasının durumu edinildiği anda) gönderdiği isteklerin anlık hızı.

    Bu değer, ortalama saniye başına istek sayısıdır (RPS). Bu ortalama RPS, test çalışmasının durumu edinilmeden önceki 10 saniyelik zaman aralığında FAST’in hedef uygulamaya gönderdiği istek sayısı olarak hesaplanır. 

    **Örnek:**
    Test çalışmasının durumu 12:03:01’de edinildiyse, `current_rps` parametresinin değeri, *( [12:02:51-12:03:01] zaman aralığında gönderilen istek sayısı )/10* olarak hesaplanır.

* `avg_rps`—FAST’in hedef uygulamaya (test çalışmasının durumu edinildiği anda) gönderdiği isteklerin ortalama hızı.

    Bu değer, FAST’in hedef uygulamaya *tüm test çalışmasının yürütülme süresi* boyunca gönderdiği ortalama saniye başına istek sayısıdır (RPS):

    * Test çalışması hâlâ yürütülüyorsa, test çalışmasının başlangıcından mevcut ana kadar (bu, `current time`-`start_time`’a eşittir).
    * Test çalışmasının yürütülmesi tamamlandıysa, test çalışmasının başlangıcından bitişine kadar (bu, `end_time`-`start_time`’a eşittir).

        `avg_rps` parametresinin değeri, *(`sended_requests_count`/(tüm test çalışmasının yürütülme süresi))* olarak hesaplanır.
    
* `estimated_time_to_completion`—(test çalışmasının durumu edinildiği anda) test çalışmasının tamamlanmasının muhtemel olduğu zamana kadar geçecek süre (saniye cinsinden). 

    Parametre değeri şu durumlarda `null` olur:
    
    * Henüz devam eden bir güvenlik açığı kontrolü yoksa (ör. yeni oluşturulmuş test çalışması için şu ana kadar hiçbir temel istek kaydedilmediyse).
    * Test çalışması yürütülmüyorsa (yani `"state":"running"` hariç herhangi bir durumda ise).

    `estimated_time_to_completion` parametresinin değeri, *(`planing_requests_count`/`current_rps`)* olarak hesaplanır.
    
!!! warning "Test çalışmasının yürütme hızı ve zaman tahminleriyle ilgili parametrelerin olası değerleri"
    Yukarıda belirtilen parametrelerin değerleri, bir test çalışmasının yürütülmesinin ilk 10 saniyesinde `null` olur.

Bir sonraki test çalışması durumu kontrolünün ne zaman yapılacağını belirlemek için `estimated_time_to_completion` parametresinin değerinden yararlanabilirsiniz. Değerin artabileceğini veya azalabileceğini unutmayın.

**Örnek:**

Bir test çalışmasının durumunu `estimated_time_to_completion` süresi sonunda kontrol etmek için şunları yapın:

1.  Test çalışmasının yürütülmesi başladıktan sonra, test çalışmasının durumunu birkaç kez edinin. Örneğin, bunu 10 saniyelik aralıklarla yapabilirsiniz. `estimated_time_to_completion` parametresinin değeri `null` olmayana kadar devam edin.

2.  Bir sonraki durum kontrolünü `estimated_time_to_completion` saniye sonra gerçekleştirin.

3.  Test çalışmasının yürütülmesi tamamlanana kadar önceki adımı tekrarlayın.

!!! info "Tahminlerin görsel temsili"
    Tahmin değerlerini Wallarm web arayüzünü kullanarak da edinebilirsiniz.
    
    Bunu yapmak için Wallarm portalına giriş yapın ve şu anda yürütülmekte olan [test çalışmaları listesine][link-wl-portal-testruns-in-progress] gidin:
    
    ![Test çalışmasının hız ve yürütme süresi tahminleri][img-testrun-velocity]
    
    Test çalışmasının yürütülmesi tamamlandığında, ortalama saniye başına istek sayısı değeri görüntülenir:
    
    ![Ortalama saniye başına istek sayısı değeri][img-testrun-avg-rps]