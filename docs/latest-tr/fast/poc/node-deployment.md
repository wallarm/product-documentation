[anchor-node]:                      #docker-container-ile-fast-node-un-yerlestirilmesi
[anchor-testrun]:                   #test-calistirmanin-elde-edilmesi
[anchor-testrun-creation]:          #test-calistirmanin-olusturulmasi
[anchor-testrun-copying]:           #test-calistirmanin-kopyalanması

[doc-limit-requests]:               ../operations/env-variables.md#kaydedilecek-isteklerin-sayisini-sinirlama
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-politikasi
[doc-inactivity-timeout]:           ../operations/internals.md#test-calistirma
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-gerekli-cevre-degiskenlerini-iceren-bir-dosya-hazirlama
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-xss-acikliklarina-yonelik-bir-test-politikasi-olusturma
[doc-docker-run-fast]:              ../qsg/deployment.md#4-fast-node-docker-container-inin-yerlestirilmesi
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-calistirma
[doc-testrecord]:                   ../operations/internals.md#test-kaydi
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#genel

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#temizle---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   Wallarm API ile FAST Node Çalıştırma

!!! info "Bölüm Önkoşulları"
    Bu bölümde tarif edilen adımları takip etmek için bir [token][doc-get-token] elde etmeniz gerekmektedir.
    
    Bu bölüm boyunca örnek olarak şu değerler kullanılmaktadır:
    
    * `token_Qwe12345` bir token olarak.
    * `tr_1234` bir test çalıştırma belirleyicisi olarak.
    * `rec_0001` bir test kaydi belirleyicisi olarak.

FAST düğümün çalıştırılması ve yapılandırılması şu adımları içerir:
1. [Docker Konteynırı ile FAST Node’un Yerleştirilmesi.][anchor-node]
2. [Bir Test Çalıştırmanın Elde Edilmesi.][anchor-testrun]

## Docker Konteynırı ile FAST Node’un Yerleştirilmesi

!!! warning "Wallarm API Sunucularına Erişim Sağlama"
    Fasting düğümünün doğru çalışması için, `us1.api.wallarm.com` ya da `api.wallarm.com` Wallarm API sunucularına HTTPS protokolü (`TCP/443`) üzerinden erişim sağlaması hayati öneme sahiptir.
    
    Güvenlik duvarınızın Docker ana makinesinin Wallarm API sunucularına erişimini kısıtlamadığından emin olun.

FAST node ile olan Docker konteynırının çalıştırılmasından önce bazı yapılandırmalar gereklidir. Node'u yapılandırmak için, konteynır içerisine token'ı, `WALLARM_API_TOKEN` çevre değişkeni kullanılarak yerleştirin. Ek olarak, eğer [kaydedilecek isteklerin sayısını sınırlandırma][doc-limit-requests] ihtiyacınız var ise, `ALLOWED_HOSTS` değişkenini kullanabilirsiniz.

Çevre değişkenlerini konteynıra iletmek için, değişkenleri bir metin dosyasına yerleştirin ve dosyanın yolunu, [`docker run`][link-docker-run] komutunun [`--env-file`][link-docker-envfile] parametresi kullanılarak belirtin (hızlı başlangıç kılavuzunda bulunan [talimatlara] bakınız[doc-docker-run-fast]).

Aşağıdaki komutu uygulayarak FAST node ile bir konteynır çalıştırın:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

Bu kılavuz, konteynırın belirtilen CI/CD işi için yalnızca bir kere çalıştırılacağını ve iş sona erdiğinde kaldırılacağını varsayar. Bu yüzden, yukarıda listelenen komuta [`--rm`][link-docker-rm] parametresi eklenmiştir.

Komutun parametrelerinin ayrıntılı bir açıklaması için “Hızlı Başlangıç” kılavuzuna bakınız[doc-docker-run-fast].

??? info "Örnek"
    Bu örnek, FAST düğümünün `token_Qwe12345` tokenini kullandığını ve gelen tüm temel istekleri kaydetmek üzere ayarlandığını varsayar. Bu isteklerin ‘Host’ başlık değerinin bir alt dizesi olarak `example.local` ihtiva etmektedir.  

    Çevre değişkenleri ile bir dosyanın içeriği, aşağıdaki örnekte gösterilmiştir:

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    Aşağıdaki komut,  `fast-poc-demo` adında bir Docker konteynırını çalıştırır ve bu konteynır şu davranışları sergiler:
    
    * Konteynır işi bittiğinde kaldırılır.
    * Çevre değişkenleri ‘fast.cfg’ dosyası kullanılarak konteynıra iletilir. 
    * Konteynırın `8080` portu Docker ana makinesinin `9090` portuna yayınlanır.

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FAST düğümünün yerleştirilmesi başarılıysa, konteynırın konsolu ve günlük dosyası aşağıdaki bilgilendirme mesajlarını içerir:

```
[info] Node Wallarm Cloud ile bağlantı kurdu
[info] Test Çalıştırma kontrolü için bekleniyor…
```

Şimdi FAST düğümü, daha önce `docker run` komutunun `-p` parametresi ile belirttiğiniz portta, Docker ana makinisinin IP adresini dinlemektedir.

##  Bir Test Çalıştırmanın Elde Edilmesi

Bir test çalıştırması [oluşturmanız][anchor-testrun-creation] ya da [kopyalamanız][anchor-testrun-copying] gerekmektedir. Seçiminiz, sizin için uygun olan [test çalıştırma oluşturma hikayesi][doc-testing-scenarios]ne bağlıdır.

### Bir Test Politikası Belirleyicisinin Edinilmesi

Kendi [test politikanızı][doc-testpolicy] uygulamayı planlıyorsanız, [bir tane oluşturun][link-wl-portal-new-policy] ve politikanın belirleyicisini alın. Daha sonra, belirleyiciyi bir test çalıştırması oluşturmak ya da kopyalamak için bir API çağrısını yaparken `policy_id` parametresine iletin. 

Aksi halde, eğer varsayılan test politikasını kullanmayı seçerseniz, API çağrısından `policy_id` parametresi çıkarılmalıdır.

!!! info "Test Politikası Örneği"
    “Hızlı Başlangıç” kılavuzu, bir örnek test politikası oluşturma üzerine [adım adım talimatlar][doc-testpolicy-creation-example] içerir.

###  Test Çalıştırmanın Oluşturulması

Bir test çalıştırması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] oluşturulur.

Bu test çalıştırma oluşturma yöntemi, hedef uygulamanın test edilmesi yanında temel isteklerin kaydedilmesi gerektiği durumlarda kullanılmalıdır.

!!! info "Nasıl Test Çalıştırması Oluşturulur"
    Bu süreç [burada][doc-create-testrun] ayrıntılı olarak tanımlanmıştır.

Test çalıştırmasının oluşturulmasından sonra FAST düğümünün istekleri kaydetmek için belirli bir süre geçmesi gereklidir.

Herhangi bir istek göndermeden önce FAST düğümünün istekleri kaydetmeye hazır olduğundan emin olun. Bu, test aracını kullanarak hedef uygulamaya istek göndermeniz anlamına gelir.

Bunu yapmak için, test çalıştırma durumunu kontrol etmek amacıyla düzenli aralıklarla `https://us1.api.wallarm.com/v1/test_run/test_run_id` URL'sine GET isteği gönderin:

--8<-- "../include-tr/fast/poc/api-check-testrun-status-recording.md"

API sunucusuna başarılı bir istek gönderdiyseniz, sunucunun yanıtı ile karşılaşılacaktır. Bu yanıt, kayıt sürecinin durumunu da içeren (yani, `ready_for_recording` parametresinin değeri) faydalı bilgiler sunar.

Eğer parametrenin değeri `true` ise, o zaman FAST düğüm istekleri kaydetmeye hazırdır ve hedef uygulamaya istek göndermeye başlamak için test aracınızı ateşleyebilirsiniz.

Aksi taktirde, düğüm hazır olana kadar aynı API çağrısını tekrar yapın.

### Test Çalıştırmanın Kopyalanması

Bir test çalıştırması kopyalandığında, mevcut bir [test kaydı][doc-testrecord] yeniden kullanılır.

Bu test çalıştırma oluşturma metodu, hedef uygulamanın zaten kaydedilmiş temel istekler kullanılarak test edilmesi gerektiği durumlarda kullanılmalıdır.

!!! info "Nasıl Test Çalıştırması Kopyalanır"
    Bu süreç [burada][doc-copy-testrun] ayrıntılı olarak tanımlanmıştır.

Bir test çalıştırmasının başarılı bir şekilde oluşturulduğunun varsayılması durumunda, FAST düğüm hemen test yapmaya başlar. Herhangi bir ek aksiyon almanıza gerek yok.

## Sonraki Adımlar

Test süreci tamamlanması için çok fazla zaman alabilir. FAST ile güvenlik testinin tamamlanıp tamamlanmadığını belirlemek için [bu belgedeki][doc-waiting-for-tests] bilgileri kullanın.

Gerektiği taktirde [“API ile Yerleştirme”][doc-integration-overview-api] veya [“FAST ile CI/CD İş Akışı”][doc-integration-overview] belgelerine geri dönebilirsiniz. 