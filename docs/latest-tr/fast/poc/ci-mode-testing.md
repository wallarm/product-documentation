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

#  Bir FAST Node'u Test Modunda Çalıştırma

Test modundayken, FAST düğümü kayıt modundaki temel isteklerden beslenen bir test kaydı temelinde bir test koşusu oluşturur ve hedef uygulama için güvenlik testi setini yürütür.

!!! bilgi "Bölüm Öngereklilikleri"
    Bu bölümde anlatılan adımları takip etmek için bir [token][doc-get-token] almanız gerekiyor.
    
    Bu bölüm boyunca şu değerler örnek olarak kullanılır:
        
    * `tr_1234` bir test koşusu tanımlayıcısı olarak
    * `rec_0001` bir test kaydı tanımlayıcısı olarak
    * `bl_7777` bir temel istek tanımlayıcısı olarak

!!! bilgi "`docker-compose` Kurulumu"
    Bu bölüm boyunca FAST düğümünün test modunda nasıl çalıştığını göstermek için [`docker-compose`][link-docker-compose] aracı kullanılacaktır.
    
    Bu aracın kurulum talimatları [burada][link-docker-compose-install] bulunabilir.

## Test Modunda Ortam Değişkenleri

FAST düğümü yapılandırması ortam değişkenleri üzerinden yapılır. Aşağıdaki tablo, bir FAST düğümünü test modunda yapılandırmak için kullanılabilecek tüm ortam değişkenlerini içerir.

| Ortam Değişkeni   | Değer  | Gerekli mi? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Bir düğüm için token. | Evet |
| `WALLARM_API_HOST`   	| Kullanılacak Wallarm API sunucusunun alan adı. <br>İzin verilen değerler: <br>`us1.api.wallarm.com` ABD bulutu için;<br>`api.wallarm.com` AB bulutu için.| Evet |
| `CI_MODE`            	| FAST düğümünün işletim modu. <br>Gerekli değer: `testing`. | Evet |
| `WORKERS` | Birçok temel istek ile paralel bir şekilde çalışan eş zamanlı iş parçacığı sayısı.<br>Varsayılan değer: `10`.| Hayır |
| `TEST_RECORD_ID` | Bir test kaydının tanımlayıcısı.<br>Varsayılan: boş değer. | Hayır |
| `TEST_RUN_NAME` | Test koşusunun adı.<br>Varsayılan değer benzer bir format içerir: "TestRun Sep 24 12:31 UTC”. | Hayır |
| `TEST_RUN_DESC` | Test koşusunun açıklaması.<br>Varsayılan değer: boş string. | Hayır |
| `TEST_RUN_POLICY_ID` | Test politikasının tanımlayıcısı.<br>Parametre eksikse, varsayılan politika devreye girer. | Hayır |
| `TEST_RUN_RPS` | Bu parametre, sınama koşusu esnasında hedef uygulamaya gönderilecek test istek sayısını (*RPS*, *saniyedeki istekler*) sınırlandırır.<br>İzin verilen değer aralığı: 1'den 1000'e kadar (saniyedeki istekler)<br>Varsayılan değer: sınırsız. | Hayır |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | Bu parametre, bir zafiyet algılandığında FAST'ın davranışını belirler:<br>`true`: ilk tespit edilen zafiyette test koşusunun yürütmesini durdurur.<br>`false`: herhangi bir zafiyet algılanmış olsa bile tüm temel istekler işlenir.<br>Varsayılan değer: `false`. | Hayır |
| `TEST_RUN_URI` | Hedef uygulamanın URI'si.<br>CI/CD süreci boyunca hedef uygulamanın IP adresi değişebilir, bu yüzden uygulamanın URI'sini kullanabilirsiniz. <br>Örneğin, `docker-compose` üzerinden yerleştirilen uygulamanın URI'si `http://app-test:3000` gibi görünebilir.  | Hayır |
| `BUILD_ID` | Bir CI/CD iş akışının tanımlayıcısı. Bu tanımlayıcı, birkaç FAST düğümünün, aynı bulut FAST düğümünü kullanarak eşzamanlı olarak çalışmasına izin verir. Ayrıntılar için [bu][doc-concurrent-pipelines] belgeye bakın.| Hayır |
| `FILE_EXTENSIONS_TO_EXCLUDE` | Test sürecinde değerlendirme işleminden hariç tutulması gereken statik dosya uzantıları listesi.<br>Bu uzantıları <code>&#124;</code> karakterini kullanarak enumere edebilirsiniz: <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | Hayır |
| `PROCESSES`            | FAST düğümünün kullanabileceği süreçlerin sayısı. Her süreç, `WORKERS` değişkeninde belirtilen iş parçacığı sayısını kullanır.<br>Varsayılan süreç sayısı: `1`.<br>Özel değer: `auto` [nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation) komutu kullanılarak hesaplanan CPU sayısının yarısına eşittir. | Hayır |

!!! bilgi "Ayrıca bakın"
    Belirli bir FAST düğüm işletim modu ile ilgili olmayan ortam değişkenlerinin açıklamaları [burada][doc-env-variables] bulunabilir.

## Bir Test Politikası Tanımlayıcısının Edinilmesi

Kendi [test politikanızı][doc-testpolicy] kullanmayı planlıyorsanız, Wallarm bulutta [biri][link-wl-portal-new-policy] oluşturun. Daha sonra, tanımlayıcıyı FAST düğümünün Docker konteynerine test modunda bir FAST düğümü çalıştırırken `TEST_RUN_POLICY_ID` ortam değişkeni üzerinden geçirin.

Aksi takdirde, varsayılan test politikasını kullanmayı seçerseniz, konteyner için `TEST_RUN_POLICY_ID` ortam değişkenini belirlemeyin.

!!! bilgi "Nasıl Test Politikası Yaratılır"
    “Hızlı Başlangıç” rehberi bir örnek test politikası oluşturmayı adım adım [nasıl yapacağınızı][doc-testpolicy-creation-example] anlatır.

## Test kaydı tanımlayıcısının alınması
 
Belirli bir test kaydını test modunda kullanmak için, test kaydının tanımlayıcısını FAST düğümüne [`TEST_RECORD_ID`][anchor-testing-variables] parametresi ile geçirebilirsiniz. Böylece, ilk önce FAST düğümünü kayıt modunda çalıştırmanız gerekmez. Bunun yerine, önceden oluşturulmuş bir test kaydını kullanabilir ve farklı düğümler ve test koşularında aynı güvenlik testlerini birden çok kez gerçekleştirebilirsiniz.
 
Test kaydının tanımlayıcısını Wallarm portalı arayüzünden veya test modunda FAST düğümü günlüğünden alabilirsiniz. Eğer `TEST_RECORD_ID` parametresini kullanmazsanız, o zaman FAST düğümü düğümün son test kaydını kullanır.

## Test Modunda Bir FAST Düğümünün Yerleştirilmesi

Daha önce oluşturulan `docker-compose.yaml` dosyası, bir FAST düğümünü test modunda çalıştırmak için uygundur.
Bunu yapmak için, `CI_MODE` ortam değişkeninin değerini `testing` olarak değiştirmeniz gerekmektedir.

Bu değişkenin değerini `docker-compose.yaml` dosyasındaki değeri değiştirerek ya da `docker-compose run` komutunun `-e` opsiyonu ile Docker konteynerine gerekli değeri ortam değişkeni olarak geçirerek değiştirebilirsiniz:

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! bilgi "Test hakkındaki raporu almak"
    Test sonuçlarına ait raporu almak için, raporu indirecek dizini `-v {RAPORLAR_İÇİN_DIZIN}:/opt/reports/` opsiyonu kullanarak bağlayarak FAST düğüm Docker konteynerini yerleştirebilirsiniz.

    Güvenlik testi bittiğinde `{RAPORLAR_İÇİN_DIZIN}` dizininde kısa `<TEST KOŞUSU ADI>.<UNIX ZAMANI>.txt` raporu ve detaylı `<TEST KOŞUSU ADI>.<UNIX ZAMANI>.json` raporu bulacaksınız.

!!! bilgi "`docker-compose` komutunun opsiyonları"
    Yukarıda anlatılan tüm ortam değişkenlerini `-e` opsiyonu ile bir FAST düğüm Docker konteynerine geçirebilirsiniz.

    Yukarıdaki örnekte ayrıca `--rm` opsiyonu da kullanıldı, böylece düğüm durdurulduğunda FAST düğüm konteyneri otomatik olarak atılır.

Komut başarıyla çalışırsa, burada gösterilen benzer bir konsol çıktısı oluşturulur:

```
 __      __    _ _
 \ \    / /_ _| | |__ _ _ _ _ __
  \ \/\/ / _` | | / _` | '_| '  \
   \_/\_/\__,_|_|_\__,_|_| |_|_|_|
            ___ _   ___ _____
           | __/_\ / __|_   _|
           | _/ _ \\__ \ | |
           |_/_/ \_\___/ |_|

Yükleniyor...
INFO synccloud[13]: Yeni örneğin kaydedilmesi 16dd487f-3d40-4834-xxxx-8ff17842d60b
INFO [1]: Hızlı tarayıcı için 0 özel genişleme yüklendi
INFO [1]: Hızlı tarayıcı için 44 varsayılan genişleme yüklendi
INFO [1]: Test koşusu oluşturmak için TestRecord#rec_0001'i kullan
INFO [1]: TestRun#tr_1234 oluşturuldu
```

Bu çıktı, başarıyla tamamlanan bir operasyonla birlikte `rec_0001` tanımlayıcılı test kaydının `tr_1234` tanımlayıcılı bir test koşusu oluşturmak için kullanıldığını bize bildirir.

Daha sonra, FAST düğümü, test politikasına uyan test kaydındaki her temel istek için güvenlik testlerini oluşturur ve yürütür. Konsol çıktısı bu tür benzer mesajlar içerir:

```
INFO [1]: Baseline #bl_7777 için bir test seti çalıştırılıyor
INFO [1]: Baseline #bl_7777 için test seti çalışıyor
INFO [1]: Baseline isteği Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]'nin alınması
INFO [1]: İsimli 'Default Policy' TestPolitic'ni kullan
```

Bu çıktı, `bl_7777` tanımlayıcılı temel istek için test setinin sürdüğünü bize bildirir. Ayrıca, `TEST_RUN_POLICY_ID` ortam değişkeninin yokluğu nedeniyle varsayılan test politikasının kullanıldığını bize söyler.

## Test Modundaki FAST Düğümü ile Docker Konteynerin Durdurulması ve Kaldırılması

Alınan test sonuçlarına bağlı olarak, FAST düğümleri farklı şekillerde sonlandırabilir.

Hedef uygulamada bazı zafiyetler tespit edilirse, FAST düğümü şuna benzer bir mesaj gösterir:

```
INFO [1]: 4 zafiyet bulundu, Baseline #bl_7777 için test setini başarısız olarak işaretle
ERROR [1]: TestRun#tr_1234 başarısız oldu
```

Bu durumda, dört zafiyet bulundu. `bl_7777` tanımlayıcılı temeldeki test seti başarısız olarak kabul edildi. `tr_1234` tanımlayıcılı ilgili test koşusu da başarısız olarak işaretlendi.

Hedef uygulamada hiç zafiyet tespit edilmezse, FAST düğümü şuna benzer bir mesaj gösterir:

```
INFO [1]: Hiç sorun bulunamadı. Baseline #bl_7777 için test seti geçti.
INFO [1]: TestRun#tr_1234 geçti
```
Bu durumda, `tr_1234` tanımlayıcılı test koşusu geçmiş olarak kabul edilir.

!!! uyarı "Güvenlik test setleri hakkında"
    Yukarıdaki örnekler yalnızca bir test seti uygulandığını ima etmez. Her bir temel istek için bir test seti oluşturulur, bu test politikası ile FAST uyumludur. 
    
    Burada sadece bir tek test setine ait mesaj gösterilmektedir, bu demonstration amaçlıdır.

FAST düğümü test sürecini tamamladıktan sonra, işlem kodunu çalışan CI/CD işi kısmında bulunan işleme döndürür. 
* Eğer güvenlik test durumu "geçti" ve FAST düğümü test süreci boyunca hiç hata ile karşılaşmazsa, o zaman `0` işlem kodu döndürülür. 
* Aksi takdirde, eğer güvenlik testleri başarısız olursa veya FAST düğümü test süreci boyunca bazı hatalarla karşılaşırsa, o zaman `1` işlem kodu döndürülür.

Güvenlik testi tamamlandıktan sonra test modundaki FAST düğümü konteyneri otomatik olarak durdurulur. Ancak, daha önce [anlatıldığı gibi][anchor-stopping-fast-node] bir CI/CD aracı, düğüm ve konteyner ömür döngüsünün kontrolünde hala olabilir.

[Örnekte yukarıda][anchor-testing-mode] FAST düğümü konteyneri `--rm` opsiyonu ile çalıştırılır. Bu, durdurulan konteynerin otomatik olarak kaldırılacağı anlamına gelir.