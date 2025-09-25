[anchor-node]:                      #deployment-of-the-docker-container-with-the-fast-node
[anchor-testrun]:                   #obtaining-a-test-run
[anchor-testrun-creation]:          #creating-a-test-run
[anchor-testrun-copying]:           #copying-a-test-run

[doc-limit-requests]:               ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-prepare-a-file-containing-the-necessary-environment-variables
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-docker-run-fast]:              ../qsg/deployment.md#4-deploy-the-fast-node-docker-container
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-run
[doc-testrecord]:                   ../operations/internals.md#test-record
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#clean-up---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   Wallarm API aracılığıyla FAST Düğümünü Çalıştırma

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları takip etmek için bir [token][doc-get-token] edinmeniz gerekir.
    
    Bu bölüm boyunca örnek olarak aşağıdaki değerler kullanılmaktadır:
    
    * Bir token olarak `token_Qwe12345`.
    * Bir test çalıştırmasının tanımlayıcısı olarak `tr_1234`.
    * Bir test kaydının tanımlayıcısı olarak `rec_0001`.

FAST düğümünün çalıştırılması ve yapılandırılması aşağıdaki adımlardan oluşur:
1.  [FAST Düğümü ile Docker konteynerinin dağıtımı.][anchor-node]
2.  [Bir Test Çalıştırmasının edinilmesi.][anchor-testrun]

##  FAST Düğümü ile Docker Konteynerinin Dağıtımı

!!! warning "Wallarm API Sunucularına Erişim Verin"
    FAST düğümünün düzgün çalışması için `us1.api.wallarm.com` veya `api.wallarm.com` Wallarm API sunucularına HTTPS protokolü (`TCP/443`) üzerinden erişebilmesi kritik öneme sahiptir.
    
    Güvenlik duvarınızın Docker ana makinesinin Wallarm API sunucularına erişimini kısıtlamadığından emin olun.

FAST düğümü ile Docker konteynerini çalıştırmadan önce bazı yapılandırmalar gereklidir. Düğümü yapılandırmak için token’ı `WALLARM_API_TOKEN` ortam değişkenini kullanarak konteynere yerleştirin. Ek olarak, kaydedilecek istek sayısını [sınırlamanız gerekiyorsa][doc-limit-requests] `ALLOWED_HOSTS` değişkenini de kullanabilirsiniz.

Ortam değişkenlerini konteynere aktarmak için değişkenleri bir metin dosyasına koyun ve [`docker run`][link-docker-run] komutunun [`--env-file`][link-docker-envfile] parametresini kullanarak dosyanın yolunu belirtin (“Hızlı Başlangıç” kılavuzundaki [yönergelere][doc-docker-run-fast] bakın).

Aşağıdaki komutu çalıştırarak FAST düğümü içeren bir konteyner başlatın:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

Bu kılavuz, konteynerin verilen CI/CD işi için yalnızca bir kez çalıştığını ve iş bittiğinde kaldırıldığını varsayar. Bu nedenle, yukarıdaki komuta [`--rm`][link-docker-rm] parametresi eklenmiştir.

Komutun parametrelerinin [ayrıntılı açıklaması][doc-docker-run-fast] için “Hızlı Başlangıç” kılavuzuna bakın.

??? info "Örnek"
    Bu örnek, FAST düğümünün `token_Qwe12345` token’ını kullandığını ve `Host` başlığının değerinde `example.local` alt dizgisi bulunan tüm gelen temel istekleri kaydedecek şekilde yapılandırıldığını varsayar.  

    Ortam değişkenlerini içeren bir dosyanın içeriği aşağıdaki örnekte gösterilmiştir:

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    Aşağıdaki komut, şu davranışlara sahip `fast-poc-demo` adlı Docker konteynerini çalıştırır:
    
    * İş bittikten sonra konteyner kaldırılır.
    * Ortam değişkenleri `fast.cfg` dosyası kullanılarak konteynere aktarılır. 
    * Konteynerin `8080` portu, Docker ana makinesinin `9090` portuna yayımlanır.

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FAST düğümünün dağıtımı başarılı olursa, konteynerin konsolunda ve günlük dosyasında aşağıdaki bilgilendirici iletiler bulunur:

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

Artık FAST düğümü, Docker ana makinesinin IP adresinde ve `docker run` komutunun `-p` parametresiyle daha önce belirttiğiniz portta dinliyor.

##  Bir Test Çalıştırmasının Edinilmesi

Bir test çalıştırmasını [oluşturmanız][anchor-testrun-creation] veya bir test çalıştırmasını [kopyalamanız][anchor-testrun-copying] gerekir. Seçim, size uygun olan [test çalıştırması oluşturma senaryosuna][doc-testing-scenarios] bağlıdır.

### Bir Test Policy Tanımlayıcısının Edinilmesi

Kendi [test policy’nizi][doc-testpolicy] kullanmayı planlıyorsanız, [bir tane oluşturun][link-wl-portal-new-policy] ve politikanın tanımlayıcısını edinin. Daha sonra test çalıştırmasını oluşturmak veya kopyalamak için yapılan API çağrısında bu tanımlayıcıyı `policy_id` parametresine iletin. 

Aksi takdirde, varsayılan test policy’yi kullanmayı seçerseniz, `policy_id` parametresi API çağrısında atlanmalıdır.

!!! info "Test Policy Örneği"
    “Hızlı Başlangıç” kılavuzu, örnek bir test policy’sinin nasıl oluşturulacağına ilişkin [adım adım yönergeler][doc-testpolicy-creation-example] içerir.

### Bir Test Çalıştırması Oluşturma

Bir test çalıştırması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] da oluşturulur.

Bu test çalıştırması oluşturma yöntemi, hedef uygulamanın temel isteklerin kaydıyla birlikte test edilmesinin gerektiği durumlarda kullanılmalıdır.

!!! info "Bir Test Çalıştırması Nasıl Oluşturulur"
    Bu süreç ayrıntılı olarak [burada][doc-create-testrun] açıklanmıştır.

FAST düğümünün, istekleri kaydedebilmesi için test çalıştırması oluşturulduktan sonra belirli bir süreye ihtiyacı vardır.

Test aracını kullanarak hedef uygulamaya herhangi bir istek göndermeden önce FAST düğümünün istek kaydı yapmaya hazır olduğundan emin olun.

Bunu yapmak için, `https://us1.api.wallarm.com/v1/test_run/test_run_id` URL’sine düzenli aralıklarla GET isteği göndererek test çalıştırmasının durumunu kontrol edin:

--8<-- "../include/fast/poc/api-check-testrun-status-recording.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı görüntülenecektir. Bu yanıt, kayıt işleminin durumu ( `ready_for_recording` parametresinin değeri) dahil olmak üzere yararlı bilgiler sağlar.

Parametrenin değeri `true` ise, FAST düğümü kayda hazırdır ve test aracınızı başlatarak hedef uygulamaya istek göndermeye başlayabilirsiniz.

Aksi takdirde, düğüm hazır olana kadar aynı API çağrısını tekrarlayın.


### Bir Test Çalıştırmasını Kopyalama

Bir test çalıştırması kopyalanırken, mevcut bir [test kaydı][doc-testrecord] yeniden kullanılır.

Bu test çalıştırması oluşturma yöntemi, önceden kaydedilmiş temel istekler kullanılarak hedef uygulamanın test edilmesinin gerektiği durumlarda kullanılmalıdır.

!!! info "Bir Test Çalıştırması Nasıl Kopyalanır"
    Bu süreç ayrıntılı olarak [burada][doc-copy-testrun] açıklanmıştır.

Bir test çalıştırması başarıyla oluşturulduğunda, FAST düğümü test etmeye hemen başlar. Ek bir işlem yapmanız gerekmez.

## Sonraki Adımlar

Test sürecinin tamamlanması uzun zaman alabilir. FAST ile güvenlik testinin bitip bitmediğini belirlemek için [bu belgedeki][doc-waiting-for-tests] bilgileri kullanın.

 Gerekirse “API aracılığıyla Dağıtım”[doc-integration-overview-api] veya “FAST ile CI/CD İş Akışı”[doc-integration-overview] belgelerine geri dönebilirsiniz.