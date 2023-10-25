[img-search-for-anomalies]:         ../../../images/fast/operations/en/test-policy/fuzzer/search-for-anomalies-scheme.png
[img-anomaly-description]:          ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-description.png

[doc-fuzzer-configuration]:         fuzzer-configuration.md

[link-payloads-section]:            fuzzer-configuration.md#the-payloads-section
[link-stop-fuzzing-section]:        fuzzer-configuration.md#the-stop-fuzzing-if-response-section


# Fuzzer İşleminin İlkeleri

Fuzzer, 255 *anomali baytını* kontrol eder: `0x01` ile `0xFF` arasında. Biri veya daha fazla böyle byte, hedef uygulamanın anomali davranışına yol açabilecek istek noktalarına eklenir.

Her byte'ı tek tek kontrol etmek yerine, fuzzer, sabit uzunlukta bir veya daha fazla anomali bayt dizilerini (*payloads*) noktaya ekler ve bu isteği uygulamaya gönderir.

İzin verilen noktaları değiştirmek için fuzzer:

* Başlangıç değerine
* Değerin rastgele bir pozisyonuna
* Değerin sonuna payloads ekler
* Aşağıdaki payload değerini değiştirir:

    * rastgele segmentler
    * ilk `M` baytlar
    * son `M` baytlar
    * tüm string

[fuzzer konfigürasyonu][doc-fuzzer-configuration] ile, FAST'tan uygulamaya gelen istekte bulunan payload'un `M` boyutu bayt olarak ayarlanır. Bu şu noktaları etkiler:

* payload eklemesi kullanılıyorsa, nokta değerine eklenecek bayt sayısı
* payload değiştirmesi kullanılıyorsa, nokta değerinde değiştirilecek bayt sayısı
* uygulamaya gönderilecek isteklerin sayısı

Eğer payload ile yapılan bir isteğin yanıtında anomali davranış tespit edilirse, o zaman fuzzer, uygulamaya her payload byte için özellikle istekte bulunur. Bu sayede, fuzzer, anomali davranışa neden olan belirli baytları tespit eder.

![Anomali baytları kontrol etme şeması][img-search-for-anomalies]

Tespit edilen tüm baytlar, anomali açıklamasında sunulur:

![Anomali açıklaması][img-anomaly-description]

??? info "Fuzzer işlem örneği"
    Diyelim ki, 250 byte payload'ın boyutu, bazı nokta değerinin ilk 250 byte'ını [değiştirir](fuzzer-configuration.md#payloads-section).

    Bu koşullar altında, fuzzer tüm bilinen anomali baytlarını göndermek üzere iki istek oluşturur: biri 250 byte payload'lu ve diğeri 5 byte payload'lu.

    Üssündeki istekte başlangıç nokta değeri şu şekilde değiştirilir:

    * Değer 250 byte'dan uzunsa: ilk olarak değerin ilk 250 byte'ı 250 byte payload ile değiştirilir, sonra ilk 250 byte'ı 5 byte payload ile değiştirilir.
    * Değer 250 byte'dan kısaysa: ilk olarak değer, 250 byte payload ile tamamen değiştirilir, sonra değer tamamen 5 byte payload ile değiştirilir.

    Diyelim ki, 5 byte `ABCDE` payload, `_250-byte-uzun-bas_qwerty` değerinin uzun noktasının ilk 250 baytını değiştirdi ve bir anomaliye neden oldu. Yani, `ABCDEqwerty` noktası değerli test isteği bir anomaliye neden oldu.

    Bu durumda fuzzer, her byte'ı kontrol etmek için 5 ek istek oluşturur ve aşağıdaki nokta değerlerine sahip olur:

    * `Aqwerty`
    * `Bqwerty`
    * `Cqwerty`
    * `Dqwerty`
    * `Eqwerty`

    Bu tür bir veya daha fazla istek tekrar bir anomaliye neden olacak ve fuzzer, tespit edilen anomali baytların listesini oluşturur, örneğin: `A`, `C`.

Sonraki aşamada, [fuzzing konfigürasyonu][doc-fuzzer-configuration] ve anomali tespit edilip edilmediğini belirleyen kuralların açıklaması hakkında bilgi edinebilirsiniz.

FAST fuzzer, bir izin verilmiş noktayı bir iterasyon (*fuzzing*) boyunca işler. [Fuzzing durdurma kurallarına][link-stop-fuzzing-section] bağlı olarak, bir veya daha fazla nokta tutarlı bir şekilde işlenir.