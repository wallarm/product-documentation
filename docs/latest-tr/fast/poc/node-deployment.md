```markdown
# Wallarm API aracılığıyla FAST Node Çalıştırma

!!! info "Bölüm Gereksinimleri"
    Bu bölümde açıklanan adımları takip edebilmek için bir [token][doc-get-token] elde etmeniz gerekmektedir.
    
    Bu bölümde örnek olarak kullanılan değerler:
    
    * Token olarak `token_Qwe12345`.
    * Bir test çalıştırmasının tanımlayıcısı olarak `tr_1234`.
    * Bir test kaydının tanımlayıcısı olarak `rec_0001`.

FAST node'un çalıştırılması ve yapılandırılması aşağıdaki adımları içerir:
1.  [FAST Node ile Docker Konteynerinin Dağıtımı.][anchor-node]
2.  [Test Çalıştırması Alınması.][anchor-testrun]

## FAST Node ile Docker Konteynerinin Dağıtımı

!!! warning "Wallarm API Sunucularına Erişim İzni Verin"
    FAST node'un düzgün çalışabilmesi için HTTPS protokolü (`TCP/443`) üzerinden `us1.api.wallarm.com` veya `api.wallarm.com` Wallarm API sunucularına erişimin olması kritik öneme sahiptir.
    
    Docker host'un Wallarm API sunucularına erişimini engelleyecek bir güvenlik duvarı kısıtlaması olmadığından emin olun.

Docker konteyneri FAST node ile çalıştırılmadan önce bazı yapılandırmalar gereklidir. Node'u yapılandırmak için, token'ı `WALLARM_API_TOKEN` ortam değişkeni aracılığıyla konteynere aktarın. Ek olarak, eğer [kayıt altına alınacak istek sayısını sınırlandırmanız gerekiyorsa][doc-limit-requests] `ALLOWED_HOSTS` değişkenini kullanabilirsiniz.

Ortam değişkenlerini konteynere geçirmek için, değişkenleri bir metin dosyasına yerleştirin ve dosyanın yolunu [`--env-file`][link-docker-envfile] parametresi üzerinden,  [`docker run`][link-docker-run] komutuna ekleyin (ayrıntılı bilgi için “Quick Start” kılavuzundaki [talimatlara][doc-docker-run-fast] bakın).

Aşağıdaki komutu çalıştırarak FAST node içeren bir konteyner başlatın:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

Bu kılavuz, konteynerin yalnızca belirli bir CI/CD işi için bir kez çalıştırıldığını ve iş bittiğinde kaldırıldığını varsayar. Bu nedenle, yukarıda listelenen komuta [`--rm`][link-docker-rm] parametresi eklenmiştir.

Komut parametrelerinin [ayrıntılı açıklaması][doc-docker-run-fast] için “Quick Start” kılavuzuna bakınız.

??? info "Örnek"
    Bu örnek, FAST node'un `token_Qwe12345` token'ını kullandığını ve gelen temel isteklerin kaydedilmesi için `Host` başlık değerinde `example.local` içeren tüm istekleri kayda aldığını varsayar.  

    Ortam değişkenlerinin bulunduğu dosyanın içeriği aşağıdaki örnekte gösterilmiştir:

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    Aşağıdaki komut, `fast-poc-demo` adlı konteyneri aşağıdaki özelliklerle çalıştırır:
    
    * İşi bittikten sonra konteyner kaldırılır.
    * Ortam değişkenleri `fast.cfg` dosyası kullanılarak konteynere aktarılır.
    * Konteynerin `8080` portu, Docker host'unun `9090` portuna yönlendirilir.

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FAST node dağıtımı başarılı olursa, konteynerin konsolu ve log dosyası aşağıdaki bilgi mesajlarını içerir:

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

Artık FAST node, Docker host'unun IP adresinde ve daha önce `docker run` komutundaki `-p` parametresi ile belirttiğiniz portta dinlemektedir.

## Test Çalıştırması Alınması

Ya bir [test çalıştırması oluşturmanız][anchor-testrun-creation] ya da bir tanesini [kopyalamanız][anchor-testrun-copying] gerekmektedir. Seçim, sizin için uygun olan [test çalıştırması oluşturma senaryosuna][doc-testing-scenarios] bağlıdır.

### Test Politika Tanımlayıcısının Edinilmesi

Kendi [test politikanızı][doc-testpolicy] kullanmayı planlıyorsanız, [yeni bir tane oluşturun][link-wl-portal-new-policy] ve politikanın tanımlayıcısını edinin. Daha sonra, test çalıştırması oluşturma veya kopyalama sırasında API çağrısında `policy_id` parametresine bu tanımlayıcıyı iletin.

Aksi halde, varsayılan test politikasını kullanmayı seçerseniz, API çağrısında `policy_id` parametresini atlamanız gerekir.

!!! info "Test Politikası Örneği"
    “Quick Start” kılavuzu, örnek bir test politikasının nasıl oluşturulacağına dair [adım adım talimatlar][doc-testpolicy-creation-example] içermektedir.

### Test Çalıştırması Oluşturma

Bir test çalıştırması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] da oluşturulur.

Bu test çalıştırması oluşturma yöntemi, hedef uygulamanın test edilmesi ve temel isteklerin kaydedilmesi gerekiyorsa tercih edilmelidir.

!!! info "Test Çalıştırması Nasıl Oluşturulur?"
    Bu süreç detaylı olarak [burada][doc-create-testrun] açıklanmıştır.

FAST node, test çalıştırması oluşturulduktan sonra istekleri kaydetmek için belirli bir süreye ihtiyaç duyar.

Test aracınız ile hedef uygulamaya istek göndermeden önce, FAST node'un istekleri kayda alacak şekilde hazır olduğundan emin olun.

Bunu yapmak için, test çalıştırması durumunu periyodik olarak kontrol etmek amacıyla `https://us1.api.wallarm.com/v1/test_run/test_run_id` URL'sine GET isteği gönderin:

--8<-- "../include/fast/poc/api-check-testrun-status-recording.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı görüntülenecektir. Bu yanıt, kayıt sürecinin durumu (örneğin `ready_for_recording` parametresinin değeri) gibi yararlı bilgileri içerir.

Eğer parametrenin değeri `true` ise, FAST node kayda hazırdır ve test aracınızı çalıştırarak hedef uygulamaya istek gönderebilirsiniz.

Aksi halde, node kayda hazır olana kadar aynı API çağrısını tekrar edin.

### Test Çalıştırmasının Kopyalanması

Bir test çalıştırması kopyalanırken, mevcut bir [test kaydı][doc-testrecord] tekrar kullanılır.

Bu test çalıştırması oluşturma yöntemi, zaten kayıt altına alınmış temel isteklerle hedef uygulamanın test edilmesi gerektiğinde kullanılmalıdır.

!!! info "Test Çalıştırması Nasıl Kopyalanır?"
    Bu süreç detaylı olarak [burada][doc-copy-testrun] açıklanmıştır.

Bir test çalıştırmasının başarıyla oluşturulmasının ardından, FAST node hemen testi başlatır. Ekstra bir işlem yapmanıza gerek yoktur.

## Sonraki Adımlar

Güvenlik testlerinin tamamlanması uzun sürebilir. FAST ile güvenlik testlerinin bitip bitmediğini anlamak için [bu belgeye][doc-waiting-for-tests] bakabilirsiniz.

Gerekirse [“Deployment via API”][doc-integration-overview-api] veya [“CI/CD Workflow with FAST”][doc-integration-overview] belgelerine geri dönebilirsiniz.
```