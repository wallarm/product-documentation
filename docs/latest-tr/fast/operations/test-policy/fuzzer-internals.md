[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Fuzzer Çalışma İlkeleri

Fuzzer, `0x01` ile `0xFF` arasındaki 255 anormal baytı kontrol eder. İstek noktalarına eklenen bir veya daha fazla böyle bayt hedef uygulamada anormal davranışa yol açabilir.

Her baytı tek tek kontrol etmek yerine, fuzzer noktaya sabit uzunlukta bir veya daha fazla anormal bayt sırası (*payloads*) ekler ve bu isteği uygulamaya gönderir.

İzin verilen noktaları değiştirmek için fuzzer:

* Payload’ları şuralara ekler:

    * değerin başına
    * değerin rastgele bir konumuna
    * değerin sonuna
* Aşağıdaki değer kısımlarını payload ile değiştirir:

    * rastgele segmentler
    * ilk `M` bayt
    * son `M` bayt
    * tüm dize

[füzzer yapılandırması][doc-fuzzer-configuration] ile FAST’ten uygulamaya giden istekteki payload’ın boyutu `M` bayt cinsinden ayarlanır. Bu aşağıdakileri etkiler:

* payload ekleme kullanılırsa noktaya eklenecek bayt sayısı
* payload ile değiştirme kullanılırsa noktada değiştirilecek bayt sayısı
* uygulamaya gönderilen istek sayısı

Payload içeren isteğe gelen yanıtta anormal davranış tespit edilirse, fuzzer her payload baytı için uygulamaya özel istekler gönderir. Böylece fuzzer, anormal davranışa neden olan belirli baytları tespit eder.

![Anormal baytları kontrol etme şeması][img-search-for-anomalies]

Tespit edilen tüm baytlar anomali açıklamasında sunulur:

![Anomali açıklaması][img-anomaly-description]

??? info "Fuzzer çalışma örneği"
    250 baytlık payloadın, bazı bir nokta değerinin ilk 250 baytını [değiştirmesine](fuzzer-configuration.md) izin verelim.

    Bu koşullarda, fuzzer bilinen tüm anormal baytları göndermek için iki istek oluşturur: biri 250 baytlık payload ile, diğeri 5 baytlık payload ile.

    Temel (baseline) istekteki ilk nokta değeri şu şekilde değiştirilecektir:

    * Değer 250 bayttan uzunsa: başlangıçta değerin ilk 250 baytı 250 baytlık payload ile değiştirilir, ardından ilk 250 bayt 5 baytlık payload ile değiştirilir.
    * Değer 250 bayttan kısaysa: başlangıçta değer tamamen 250 baytlık payload ile değiştirilir, ardından değer tamamen 5 baytlık payload ile değiştirilir.

    5 baytlık `ABCDE` payloadının uzun nokta değerinin ilk 250 baytını `_250-bytes-long-head_qwerty` değiştirip bir anomaliye neden olduğunu varsayalım. Başka bir deyişle, `ABCDEqwerty` nokta değeriyle gönderilen test isteği bir anomaliye neden oldu.

    Bu durumda fuzzer, her baytı kontrol etmek için aşağıdaki nokta değerleriyle 5 ek istek oluşturacaktır:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    Bu isteklerden biri veya birkaçı tekrar bir anomaliye neden olacak ve fuzzer, tespit edilen anormal baytların listesini oluşturacaktır; örneğin: `A`, `C`.

 Sonraki adımda [fuzzing yapılandırması][doc-fuzzer-configuration] ve anomali bulunup bulunmadığını tanımlayan kuralların açıklaması hakkında bilgi alabilirsiniz.

FAST fuzzer her iterasyonda bir izin verilen noktayı işler (*fuzzing*). [Fuzzing durdurma kurallarına][link-stop-fuzzing-section] bağlı olarak, bir veya daha fazla nokta ardışık olarak işlenecektir.