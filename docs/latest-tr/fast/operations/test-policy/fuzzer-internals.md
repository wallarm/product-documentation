[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Fuzzer İşlem Prensipleri

Fuzzer, `0x01`'den `0xFF`'e kadar 255 *anormal bayt* kontrol eder. İstek noktalarına eklenen bir veya daha fazla bu bayt, hedef uygulamada anormal davranışa yol açabilir.

Her baytı ayrı ayrı kontrol etmek yerine, fuzzer sabit uzunlukta bir veya daha fazla anormal bayt dizisini (*payloads*) ilgili noktaya ekler ve bu isteği uygulamaya gönderir.

İzin verilen noktaları değiştirmek için fuzzer:

* Payload'ları ekler:
    * değerin başına
    * değerin rastgele bir yerine
    * değerin sonuna
* Aşağıdaki payload değerlerini değiştirir:
    * rastgele segmentler
    * ilk `M` bayt
    * son `M` bayt
    * tüm dize

[fuzzer configuration][doc-fuzzer-configuration] ile FAST'tan uygulamaya gönderilen istekte yer alan payload'un `M` bayt olarak boyutu ayarlanır. Bu, aşağıdaki noktaları etkiler:

* Payload ekleme kullanıldığında nokta değerine eklenecek bayt sayısı
* Payload değiştirme kullanıldığında nokta değerinde değiştirilecek bayt sayısı
* Uygulamaya gönderilen istek sayısı

Payload içeren isteğe verilen yanıtta anormal davranış tespit edilirse, fuzzer her payload baytı için ayrı istekler gönderir. Böylece, fuzzer anormal davranışa neden olan belirli baytları tespit eder.

![Scheme of checking for anomalous bytes][img-search-for-anomalies]

Tespit edilen tüm baytlar anomali açıklamasında sunulur:

![Anomaly description][img-anomaly-description]

??? info "Fuzzer İşleyişi Örneği"
    Diyelim ki, 250 baytlık payload [replace](fuzzer-configuration.md) işlemi, belirli bir nokta değerinin ilk 250 baytını değiştiriyor.

    Bu koşullar altında, fuzzer bilinen tüm anormal baytları göndermek için iki istek oluşturur: biri 250 baytlık payload ile, diğeri 5 baytlık payload ile.

    Temel (baseline) isteğindeki başlangıç nokta değeri şu şekilde değiştirilecektir:

    * Eğer değer 250 bayttan uzunsa: ilk olarak değerin ilk 250 baytı 250 baytlık payload ile değiştirilecek, ardından ilk 250 bayt 5 baytlık payload ile değiştirilecektir.
    * Eğer değer 250 bayttan kısaysa: ilk olarak değer tamamen 250 baytlık payload ile değiştirilecek, ardından değer tamamen 5 baytlık payload ile değiştirilecektir.

    Diyelim ki, 5 baytlık `ABCDE` payload, uzun nokta değerinin `_250-bytes-long-head_qwerty` kısmının ilk 250 baytını değiştirip anomaliye sebep oldu. Başka bir deyişle, `ABCDEqwerty` nokta değerine sahip test isteği anomaliye yol açtı.

    Bu durumda, fuzzer her baytı kontrol etmek için aşağıdaki nokta değerleriyle 5 ek istek oluşturur:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    Bu isteklik veya daha fazlası tekrar anomali oluşturacak ve fuzzer, tespit edilen anormal baytların listesini, örneğin: `A`, `C` olarak oluşturacaktır.

Sonrasında, [fuzzing configuration][doc-fuzzer-configuration] hakkında bilgi alabilir ve anomali tespit edilip edilmediğini belirleyen kuralların açıklamasını inceleyebilirsiniz.

FAST fuzzer, her iterasyonda bir izin verilen noktayı (*fuzzing*) işler. [Fuzzing stopping rules][link-stop-fuzzing-section]'a bağlı olarak, bir veya daha fazla nokta tutarlı bir şekilde işlenecektir.