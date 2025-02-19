```markdown
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-waiting-for-tests]:            waiting-for-tests.md
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general
[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode
[anchor-testing-variables]:         #environment-variables-in-testing-mode
[anchor-stopping-fast-node]:        ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode

# Test Modunda FAST Node Çalıştırma

Test modunda, FAST node, kaydetme modunda temel isteklerden doldurulan test kaydı baz alınarak bir test çalıştırması oluşturur ve hedef uygulama için yapılandırılmış güvenlik test setini yürütür.

!!! info "Bölüm Ön Koşulları"
    Bu bölümde açıklanan adımları takip edebilmek için bir [token][doc-get-token] elde etmeniz gerekir.
    
    Bu bölümde örnek olarak kullanılan değerler:
        
    * `tr_1234`: bir test çalıştırmasının tanımlayıcısı
    * `rec_0001`: bir test kaydının tanımlayıcısı
    * `bl_7777`: bir temel isteğin tanımlayıcısı

!!! info "Install `docker-compose`"
    Bu bölümde, FAST node'un test modundaki çalışma şeklini göstermek için [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın kurulum talimatları [burada][link-docker-compose-install] mevcuttur.

## Test Modunda Ortam Değişkenleri

FAST node yapılandırması, ortam değişkenleri aracılığıyla yapılır. Aşağıdaki tabloda, test modunda bir FAST node yapılandırırken kullanılabilecek tüm ortam değişkenleri yer almaktadır.

| Ortam Değişkeni               | Değer  | Gerekli? |
|-------------------------------|--------|----------|
| `WALLARM_API_TOKEN`           | Bir node için token. | Evet |
| `WALLARM_API_HOST`            | Kullanılacak Wallarm API sunucusunun alan adı. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` ABD bulutu için; <br>`api.wallarm.com` AB bulutu için. | Evet |
| `CI_MODE`                     | FAST node'un çalışma modu. <br>Zorunlu değer: `testing`. | Evet |
| `WORKERS`                     | Paralel şekilde birden fazla temel istekle çalışan eşzamanlı iş parçacığı sayısı.<br>Varsayılan değer: `10`. | Hayır |
| `TEST_RECORD_ID`              | Bir test kaydının tanımlayıcısı.<br>Varsayılan: boş değer. | Hayır |
| `TEST_RUN_NAME`               | Test çalıştırmasının adı.<br>Varsayılan değer benzer formatta: “TestRun Sep 24 12:31 UTC”. | Hayır |
| `TEST_RUN_DESC`               | Test çalıştırmasının açıklaması.<br>Varsayılan değer: boş string. | Hayır |
| `TEST_RUN_POLICY_ID`          | Test politikasının tanımlayıcısı.<br>Eğer parametre belirtilmezse, varsayılan politika uygulanır. | Hayır |
| `TEST_RUN_RPS`                | Bu parametre, test çalıştırması sırasında hedef uygulamaya gönderilecek test isteği sayısına (*RPS*, *saniyede istek sayısı*) bir sınır belirler.<br>İzin verilen değer aralığı: 1 ile 1000 (saniyede istek)<br>Varsayılan değer: limitsiz. | Hayır |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | Bu parametre, FAST'in bir güvenlik açığı tespit edildiğinde nasıl davranacağını belirtir:<br>`true`: tespit edilen ilk güvenlik açığında test çalıştırmasını durdurur.<br>`false`: herhangi bir güvenlik açığı tespit edilse de tüm temel istekleri işler.<br>Varsayılan değer: `false`. | Hayır |
| `TEST_RUN_URI`                | Hedef uygulamanın URI'si.<br>CI/CD sürecinde hedef uygulamanın IP adresi değişebileceğinden, uygulama URI'si kullanılabilir. <br>Örneğin, `docker-compose` kullanılarak dağıtılan uygulamanın URI'si `http://app-test:3000` şeklinde olabilir. | Hayır |
| `BUILD_ID`                    | Bir CI/CD iş akışının tanımlayıcısı. Bu tanımlayıcı, aynı bulut FAST node'u kullanarak birden fazla FAST node'un eşzamanlı çalışmasına olanak tanır. Detaylar için [bu][doc-concurrent-pipelines] belgeye bakın. | Hayır |
| `FILE_EXTENSIONS_TO_EXCLUDE`  | Test sırasında değerlendirme sürecine dahil edilmeyecek statik dosya uzantılarının listesi.<br>Bu uzantıları <code>&#124;</code> karakteri ile sıralayabilirsiniz: <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | Hayır |
| `PROCESSES`                   | FAST node tarafından kullanılabilecek işlem sayısı. Her işlem, `WORKERS` değişkeninde belirtilen iş parçacığı sayısını kullanır.<br>Varsayılan işlem sayısı: `1`.<br>Özel değer: [nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation) komutu ile hesaplanan CPU sayısının yarısına eşit `auto`. | Hayır |

!!! info "See also"
    Belirli bir FAST node çalışma moduna özgü olmayan ortam değişkenlerinin açıklamaları [burada][doc-env-variables] mevcuttur.

## Bir Test Politikası Tanımlayıcısı Edinme

Kendi [test politikanızı][doc-testpolicy] kullanmayı planlıyorsanız, Wallarm cloud'da bir tane [oluşturun][link-wl-portal-new-policy]. Daha sonra, FAST node test modunda çalıştırılırken Docker konteynerine `TEST_RUN_POLICY_ID` ortam değişkeni aracılığıyla bu tanımlayıcıyı geçirmeniz gerekir.

Aksi takdirde, varsayılan test politikasını kullanmayı tercih ederseniz, konteyner için `TEST_RUN_POLICY_ID` ortam değişkenini ayarlamayın.

!!! info "How to Create a Test Policy"
    “Quick Start” kılavuzu, örnek bir test politikası oluşturma adımlarını [adım adım talimatlar][doc-testpolicy-creation-example] olarak sunmaktadır.

## Bir Test Kaydı Tanımlayıcısı Edinme

Test modunda belirli bir test kaydını kullanmak için, test kaydının tanımlayıcısını FAST node'a [`TEST_RECORD_ID`][anchor-testing-variables] parametresi ile geçirebilirsiniz. Böylece FAST node'u önceden kaydetme modunda çalıştırmaya gerek kalmaz. Önceden oluşturulmuş bir test kaydını, farklı node'larda ve test çalıştırmalarında aynı güvenlik testlerini gerçekleştirmek için kullanabilirsiniz.
 
Test kaydının tanımlayıcısını Wallarm portal arayüzünden veya test modundaki FAST node log'undan alabilirsiniz. Eğer `TEST_RECORD_ID` parametresini kullanmazsanız, FAST node son test kaydını kullanacaktır.

## Test Modunda FAST Node Dağıtımı

Önceden oluşturulan `docker-compose.yaml` dosyası, test modunda FAST node çalıştırmak için uygundur.
Bunu yapmak için, `CI_MODE` ortam değişkeninin değeri `testing` olarak değiştirilmelidir.

Değişkenin değerini `docker-compose.yaml` dosyasında değiştirerek veya `docker-compose run` komutunun `-e` seçeneği ile gerekli değeri Docker konteynerine geçirerek değiştirebilirsiniz:

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "Test Sonuç Raporunu Alma"
    Test sonuçlarını içeren raporu almak için, FAST node Docker konteyneri dağıtılırken raporu indirmek üzere dizini `-v {DIRECTORY_FOR_REPORTS}:/opt/reports/` seçeneği ile bağlayın.

    Güvenlik testleri tamamlandığında, `{DIRECTORY_FOR_REPORTS}` dizininde kısa `<TEST RUN NAME>.<UNIX TIME>.txt` raporu ve detaylı `<TEST RUN NAME>.<UNIX TIME>.json` raporu bulunacaktır.

!!! info "docker-compose Komutu Seçenekleri"
    Yukarıda açıklanan herhangi bir ortam değişkenini, `-e` seçeneği ile FAST node Docker konteynerine geçirebilirsiniz.

    Yukarıdaki örnekte kullanılan `--rm` seçeneği sayesinde, FAST node konteyneri durduğunda otomatik olarak kaldırılır.

Komut başarılı bir şekilde çalıştırılırsa, aşağıda gösterilen benzer bir konsol çıktısı üretilir:

```
 __      __    _ _
 \ \    / /_ _| | |__ _ _ _ _ __
  \ \/\/ / _` | | / _` | '_| '  \
   \_/\_/\__,_|_|_\__,_|_| |_|_|_|
            ___ _   ___ _____
           | __/_\ / __|_   _|
           | _/ _ \\__ \ | |
           |_/_/ \_\___/ |_|

Loading...
INFO synccloud[13]: Registered new instance 16dd487f-3d40-4834-xxxx-8ff17842d60b
INFO [1]: Loaded 0 custom extensions for fast scanner
INFO [1]: Loaded 44 default extensions for fast scanner
INFO [1]: Use TestRecord#rec_0001 for creating TestRun
INFO [1]: TestRun#tr_1234 created
```

Bu çıktı, `rec_0001` tanımlayıcısına sahip test kaydının, `tr_1234` tanımlayıcılı bir test çalıştırması oluşturmak için kullanıldığını ve işlemin başarılı bir şekilde tamamlandığını bildirir.

Sonrasında, FAST node, test politikasına uyan test kaydı içindeki her temel istek için güvenlik testleri oluşturur ve yürütür. Konsol çıktısında benzer mesajlar yer alacaktır:

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

Bu çıktı, `bl_7777` tanımlayıcısına sahip temel istekler için test setinin çalışmakta olduğunu bildirir. Ayrıca, `TEST_RUN_POLICY_ID` ortam değişkeninin belirtilmemesi nedeniyle varsayılan test politikasının kullanıldığını gösterir.

## Test Modunda FAST Node İçeren Docker Konteynerini Durdurma ve Kaldırma

Elde edilen test sonuçlarına bağlı olarak, FAST node'lar farklı şekillerde sonlanabilir.

Hedef uygulamada bazı güvenlik açıkları tespit edilirse, FAST node aşağıdaki gibi bir mesaj gösterir:

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

Bu durumda, dört güvenlik açığı tespit edilmiştir. `bl_7777` tanımlayıcısına sahip temel isteğin test seti başarısız kabul edilir. İlgili `tr_1234` tanımlayıcılı test çalıştırması da başarısız olarak işaretlenir.

Hedef uygulamada hiçbir güvenlik açığı tespit edilmezse, FAST node aşağıdaki gibi bir mesaj gösterir:

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

Bu durumda, `tr_1234` tanımlayıcısına sahip test çalıştırması başarılı kabul edilir.

!!! warning "Güvenlik Test Setleri Hakkında"
    Yukarıdaki örnekler, yalnızca bir test setinin yürütüldüğünü ima etmez. FAST test politikasına uyan her temel istek için bir test seti oluşturulur.
    
    Gösterim amaçlı olarak burada tek bir test setine ilişkin mesaj gösterilmiştir.

FAST node, test sürecini tamamladıktan sonra sonlanır ve bir CI/CD işinin parçası olarak çalışan sürece bir çıkış kodu döndürür. 
* Güvenlik test durumu “passed” ise ve FAST node test süreci sırasında herhangi bir hata ile karşılaşmazsa, `0` çıkış kodu döndürülür. 
* Aksi takdirde, eğer güvenlik testleri başarısız olursa veya FAST node test süreci sırasında bazı hatalarla karşılaşırsa, `1` çıkış kodu döndürülür.

Test modundaki FAST node konteyneri, güvenlik testleri tamamlandığında otomatik olarak duracaktır. Yine de, bir CI/CD aracı [daha önce açıklanan][anchor-stopping-fast-node] yöntemlerle node ve konteyner yaşam döngüsünü kontrol edebilir.

[anchor-testing-mode] ile verilen örnekte, FAST node konteyneri `--rm` seçeneği ile çalıştırılmıştır. Bu, durdurulan konteynerin otomatik olarak kaldırılacağı anlamına gelir.
```