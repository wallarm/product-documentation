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

# Test Modunda Bir FAST Düğümünü Çalıştırma

Test modundayken FAST düğümü, kayıt modunda temel isteklerden doldurulan test kaydına dayanarak bir test çalıştırması oluşturur ve hedef uygulama için ayarlanmış güvenlik test setini yürütür.

!!! info "Bölüm Önkoşulları"
    Bu bölümde anlatılan adımları takip etmek için bir [token][doc-get-token] almanız gerekir.
    
    Bu bölüm boyunca örnek olarak aşağıdaki değerler kullanılır:
        
    * Bir test çalıştırmasının tanımlayıcısı olarak `tr_1234`
    * Bir test kaydının tanımlayıcısı olarak `rec_0001`
    * Bir temel isteğin tanımlayıcısı olarak `bl_7777`

!!! info "`docker-compose`'i yükleyin"
    Bu bölüm boyunca, FAST düğümünün test modunda nasıl çalıştığını göstermek için [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın kurulum talimatları [burada][link-docker-compose-install] mevcuttur.

## Test Modunda Ortam Değişkenleri

FAST düğümü yapılandırması ortam değişkenleri aracılığıyla yapılır. Aşağıdaki tablo, FAST düğümünü test modunda yapılandırmak için kullanılabilecek tüm ortam değişkenlerini içerir.

| Ortam Değişkeni   | Değer  | Gerekli mi? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Düğüm için token. | Evet |
| `WALLARM_API_HOST`   	| Kullanılacak Wallarm API sunucusunun alan adı. <br>İzin verilen değerler: <br>US cloud ile kullanım için `us1.api.wallarm.com`;<br>EU cloud ile kullanım için `api.wallarm.com`.| Evet |
| `CI_MODE`            	| FAST düğümünün çalışma modu. <br>Gerekli değer: `testing`. | Evet |
| `WORKERS` | Birden çok temel istekle paralel şekilde çalışan eşzamanlı iş parçacıklarının sayısı.<br>Varsayılan değer: `10`.| Hayır |
| `TEST_RECORD_ID` | Test kaydının tanımlayıcısı.<br>Varsayılan: boş değer. | Hayır |
| `TEST_RUN_NAME` | Test çalıştırmasının adı.<br>Varsayılan değer benzer biçimdedir: “TestRun Sep 24 12:31 UTC”. | Hayır |
| `TEST_RUN_DESC` | Test çalıştırmasının açıklaması.<br>Varsayılan değer: boş dize. | Hayır |
| `TEST_RUN_POLICY_ID` | Test politikasının tanımlayıcısı.<br>Parametre yoksa, varsayılan politika devreye girer. | Hayır |
| `TEST_RUN_RPS` | Parametre, test çalıştırması sırasında hedef uygulamaya gönderilecek test isteklerinin sayısına (RPS, saniye başına istek) bir sınır belirtir.<br>İzin verilen değer aralığı: 1 ile 1000 arası (saniye başına istek)<br>Varsayılan değer: sınırsız. | Hayır |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | Bu parametre, bir güvenlik açığı tespit edildiğinde FAST’in davranışını belirtir:<br>`true`: ilk tespit edilen güvenlik açığında test çalıştırmasını durdurur.<br>`false`: herhangi bir güvenlik açığı tespit edilip edilmediğine bakılmaksızın tüm temel istekleri işler.<br>Varsayılan değer: `false`. | Hayır |
| `TEST_RUN_URI` | Hedef uygulamanın URI’si.<br>Hedef uygulamanın IP adresi CI/CD süreci boyunca değişebileceğinden, uygulama URI’sini kullanabilirsiniz. <br>Örneğin, `docker-compose` ile dağıtılan uygulamanın URI’si `http://app-test:3000` gibi görünebilir.  | Hayır |
| `BUILD_ID` | Bir CI/CD iş akışının tanımlayıcısı. Bu tanımlayıcı, birkaç FAST düğümünün aynı bulut FAST düğümünü kullanarak eşzamanlı çalışmasına izin verir. Ayrıntılar için [bu][doc-concurrent-pipelines] belgeye bakın.| Hayır |
| `FILE_EXTENSIONS_TO_EXCLUDE` | Test sırasında değerlendirme sürecinden hariç tutulması gereken statik dosya uzantılarının listesi.<br>Bu uzantıları <code>&#124;</code> karakterini kullanarak sıralayabilirsiniz: <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | Hayır |
| `PROCESSES`            | FAST düğümü tarafından kullanılabilecek süreç sayısı. Her süreç, `WORKERS` değişkeninde belirtilen sayıda iş parçacığı kullanır.<br>Varsayılan süreç sayısı: `1`.<br>Özel değer: [nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation) komutu kullanılarak hesaplanan CPU sayısının yarısına eşit `auto`. | Hayır |

!!! info "Ayrıca bakınız"
    Belirli bir FAST düğümü çalışma moduna özgü olmayan ortam değişkenlerinin açıklamaları [burada][doc-env-variables] mevcuttur.

## Bir Test Politikası Tanımlayıcısı Edinme

Kendi [test politikanızı][doc-testpolicy] kullanmayı planlıyorsanız, Wallarm Cloud içinde [bir tane oluşturun][link-wl-portal-new-policy]. Daha sonra, FAST düğümünü test modunda çalıştırırken `TEST_RUN_POLICY_ID` ortam değişkeni aracılığıyla tanımlayıcıyı FAST düğümünün Docker konteynerine iletin. 

Aksi takdirde, varsayılan test politikasını kullanmayı seçerseniz, konteyner için `TEST_RUN_POLICY_ID` ortam değişkenini ayarlamayın.

!!! info "Bir Test Politikası Nasıl Oluşturulur"
    “Hızlı Başlangıç” kılavuzu, örnek bir test politikasının nasıl oluşturulacağına dair [adım adım talimatlar][doc-testpolicy-creation-example] içerir.

## Bir test kaydı tanımlayıcısı alma
 
Test modunda belirli bir test kaydını kullanmak için, test kaydının tanımlayıcısını [`TEST_RECORD_ID`][anchor-testing-variables] parametresiyle FAST düğümüne iletebilirsiniz. Böylece, önce FAST düğümünü kayıt modunda çalıştırmanıza gerek kalmaz. Bunun yerine, aynı güvenlik testlerini farklı düğümlerde ve test çalıştırmalarında birden çok kez gerçekleştirmek için önceden oluşturulmuş bir test kaydını kullanabilirsiniz.
 
Test kaydının tanımlayıcısını Wallarm portal arayüzünden veya test modundaki FAST düğümü günlüğünden alabilirsiniz. `TEST_RECORD_ID` parametresini kullanmazsanız, FAST düğümü, düğümün son test kaydını kullanacaktır.

## Test Modunda Bir FAST Düğümünün Dağıtımı

Daha önce oluşturulan `docker-compose.yaml` dosyası, bir FAST düğümünü test modunda çalıştırmak için uygundur.
Bunu yapmak için, `CI_MODE` ortam değişkeninin değerini `testing` olarak değiştirmek gerekir.

Değişkenin değerini `docker-compose.yaml` dosyasında düzenleyerek değiştirebilir veya gerekli değere sahip ortam değişkenini `docker-compose run` komutunun `-e` seçeneğiyle Docker konteynerine geçirerek ayarlayabilirsiniz:

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "Test hakkında rapor alma"
    Test sonuçlarını içeren raporu almak için, FAST düğümü Docker konteynerini dağıtırken `-v {DIRECTORY_FOR_REPORTS}:/opt/reports/` seçeneği aracılığıyla raporların indirileceği dizini bağlayın.

    Güvenlik testleri tamamlandığında, `{DIRECTORY_FOR_REPORTS}` dizininde kısa `<TEST RUN NAME>.<UNIX TIME>.txt` raporunu ve ayrıntılı `<TEST RUN NAME>.<UNIX TIME>.json` raporunu bulacaksınız.

!!! info "`docker-compose` komutunun seçenekleri"
    Yukarıda açıklanan ortam değişkenlerinin herhangi birini `-e` seçeneğiyle bir FAST düğümü Docker konteynerine geçirebilirsiniz.

    Yukarıdaki örnekte ayrıca `--rm` seçeneği kullanılmıştır; böylece düğüm durdurulduğunda FAST düğümü konteyneri otomatik olarak temizlenir.

Komut başarıyla yürütülürse, aşağıda gösterilene benzer bir konsol çıktısı üretilecektir:

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

Bu çıktı, `rec_0001` tanımlayıcısına sahip test kaydının, `tr_1234` tanımlayıcılı bir test çalıştırması oluşturmak için kullanıldığını ve işlemin başarıyla tamamlandığını bildirir.

Sonraki adımda, test politikasını karşılayan test kaydındaki her temel istek için FAST düğümü tarafından güvenlik testleri oluşturulur ve yürütülür. Konsol çıktısı aşağıdakilere benzer iletiler içerecektir:

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

Bu çıktı, `bl_7777` tanımlayıcılı temel istekler için test setinin çalıştırıldığını belirtir. Ayrıca, `TEST_RUN_POLICY_ID` ortam değişkeninin olmaması nedeniyle varsayılan test politikasının kullanıldığını bildirir.

## Test Modunda FAST Düğümüyle Docker Konteynerini Durdurma ve Kaldırma

Elde edilen test sonuçlarına bağlı olarak, FAST düğümleri farklı şekillerde sonlanabilir.

Hedef uygulamada bazı güvenlik açıkları tespit edilirse, FAST düğümü buna benzer bir ileti gösterir:

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

Bu durumda dört güvenlik açığı bulundu. `bl_7777` tanımlayıcılı temel istek için test seti başarısız sayılır. `tr_1234` tanımlayıcılı ilgili test çalıştırması da başarısız olarak işaretlenir.

Hedef uygulamada herhangi bir güvenlik açığı tespit edilmezse, FAST düğümü buna benzer bir ileti gösterir:

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

Bu durumda, `tr_1234` tanımlayıcılı test çalıştırması başarılı kabul edilir.

!!! warning "Güvenlik test setleri hakkında"
    Yukarıdaki örneklerin yalnızca tek bir test setinin çalıştırıldığı anlamına gelmediğine dikkat edin. FAST test politikasına uyan her temel istek için bir test seti oluşturulur.
    
    Gösterim amacıyla burada tek bir test setine ilişkin bir ileti gösterilmiştir.

FAST düğümü test sürecini tamamladıktan sonra sonlanır ve bir CI/CD işi kapsamında çalışan sürece bir çıkış kodu döndürür. 
* Güvenlik testi durumu “passed” ise ve FAST düğümü test süreci sırasında hata ile karşılaşmazsa `0` çıkış kodu döndürülür. 
* Aksi halde, güvenlik testleri başarısız olursa veya FAST düğümü test süreci sırasında bazı hatalarla karşılaşırsa `1` çıkış kodu döndürülür.

Test modundaki FAST düğümü konteyneri, güvenlik testleri tamamlandıktan sonra otomatik olarak duracaktır. Yine de, bir CI/CD aracı, [daha önce açıklanan][anchor-stopping-fast-node] yollarla düğümün ve konteynerinin yaşam döngüsünü kontrol edebilir.

[Örnek yukarıda][anchor-testing-mode] FAST düğümü konteyneri `--rm` seçeneğiyle çalıştırılmıştı. Bu, durdurulan konteynerin otomatik olarak kaldırılacağı anlamına gelir.