[img-enable-fuzzer]:            ../../../images/fast/operations/common/test-policy/fuzzer/fuzzer-slider.png
[img-manipulate-items]:         ../../../images/fast/operations/common/test-policy/fuzzer/manipulate-fuzzer-items.png
[img-anomaly-condition]:        ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-condition.png
[img-not-anomaly-condition]:    ../../../images/fast/operations/common/test-policy/fuzzer/not-anomaly-condition.png
[img-stop-condition]:           ../../../images/fast/operations/common/test-policy/fuzzer/stop-condition.png

[link-ruby-regexp]:             http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html      

[anchor-payloads-section]:      #the-payloads-section
[anchor-anomaly-section]:       #the-consider-result-an-anomaly-if-response-section
[anchor-not-anomaly-section]:   #the-consider-result-not-an-anomaly-if-response-section
[anchor-stop-section]:          #the-stop-fuzzing-if-response-section

# Fuzzer Yapılandırması

!!! info "Fuzzer'ı etkinleştirme"
    Fuzzer varsayılan olarak devre dışıdır. Wallarm hesabınızdaki policy editor içinde **Fuzz testing** bölümünden etkinleştirebilirsiniz:
    
    ![Fuzzer'ı etkinleştirme][img-enable-fuzzer]

    **Fuzz testing** bölümündeki fuzzer anahtarı ile **Attacks to test** bölümündeki **Use only custom DSL** anahtarı birbirini dışlar.

    İlke varsayılan olarak bir fuzzer'ı desteklemez.

Fuzzer ve anomali algılama ile ilgili ayarlar, policy editor içindeki **Fuzz testing** bölümünde yer alır.

Uygulamayı anomaliler için test etmek amacıyla, FAST anomali baytları içeren bir payload ile gönderilen isteğe hedef uygulamanın verdiği yanıtı analiz eder. Belirtilen koşullara bağlı olarak, FAST tarafından gönderilen istek anomalik olarak tanınır veya tanınmaz.

Wallarm hesabınızdaki policy editor şunları yapmanıza olanak tanır:

* **Add payload** ve **Add another payload** düğmelerine tıklayarak payload eklemek
* **Add condition** ve **Add another condition** düğmelerine tıklayarak fuzzer işleyişini etkileyen koşullar eklemek
* Yanlarındaki «—» simgesine tıklayarak oluşturulan payload ve koşulları silmek

![Payload ve koşul yönetimi][img-manipulate-items]

Koşulları yapılandırırken aşağıdaki parametreleri kullanabilirsiniz:

* **Status**: HTTPS yanıt kodu
* **Length**: yanıt uzunluğu (bayt cinsinden)
* **Time**: yanıt süresi (saniye cinsinden)
* **Length diff**: FAST isteğine gelen yanıt ile orijinal baseline isteğine gelen yanıtın uzunluk farkı (bayt cinsinden)
* **Time diff**: FAST isteğine gelen yanıt süresi ile orijinal baseline isteğine gelen yanıt süresi arasındaki fark (saniye cinsinden)
* **DOM diff**: FAST ve orijinal baseline isteklerinin DOM öğe sayısı farkı
* **Body**: [Ruby düzenli ifadesi][link-ruby-regexp]. Yanıt gövdesi bu düzenli ifadeyi sağlıyorsa koşul karşılanır

[**Stop fuzzing if response**][anchor-stop-section] bölümünde ayrıca aşağıdaki parametreler de yapılandırılabilir:

* **Anomalies**: tespit edilen anomali sayısı
* **Timeout errors**: sunucudan yanıt alınamadığı kaç kez gerçekleştiği

Bu parametrelerin bir kombinasyonunu kullanarak, fuzzer'ın çalışmasını etkileyen gerekli koşulları yapılandırabilirsiniz (aşağıya bakın).

## "Payloads" Bölümü

Bu bölüm bir veya daha fazla payload'ı yapılandırmak için kullanılır.

Payload ekleme sırasında aşağıdaki veriler belirtilir:

* yük boyutu: 1 ile 255 bayt arasında
* payload'ın hangi değere yerleştirileceği: başlangıç, rastgele veya son konum

Payload değiştirme sırasında aşağıdaki veriler belirtilir:

* değiştirme yöntemi: değerde rastgele bir segmenti değiştir, ilk `M` bayt, son `M` bayt veya tüm dize
* yük boyutu `M`: 1 ile 255 bayt arasında


## "Consider Result an Anomaly if Response" Bölümü

Uygulamadan gelen yanıt, **Consider result an anomaly if response** bölümünde yapılandırılan tüm koşulları karşılıyorsa, bir anomali bulunduğu kabul edilir.

Örnek:

Yanıt gövdesi `.*SQLITE_ERROR.*` düzenli ifadesini sağlıyorsa, gönderilen FAST isteğinin bir anomaliye neden olduğu kabul edilir:

![Koşul örneği][img-anomaly-condition]

!!! info "Varsayılan davranış"
    Bu bölümde yapılandırılmış koşul yoksa, fuzzer sunucu yanıtını baseline isteğe verilen yanıttan anormal derecede farklı parametrelerle algılar. Örneğin, uzun bir sunucu yanıt süresi, sunucu yanıtının anormal olarak algılanması için bir neden olabilir.

## "Consider result not an anomaly if response" Bölümü

Uygulamadan gelen yanıt, **Consider result not an anomaly if response** bölümünde yapılandırılan tüm koşulları karşılıyorsa, bir anomali bulunmadığı kabul edilir.

Örnek:

Yanıt kodu `500`'den düşükse, gönderilen FAST isteğinin bir anomaliye neden olmadığı kabul edilir:

![Koşul örneği][img-not-anomaly-condition]

## "Stop fuzzing if response" Bölümü

Uygulama yanıtı, tespit edilen anomali sayısı veya zaman aşımı hataları sayısı, **Stop fuzzing if response** bölümünde yapılandırılan tüm koşulları sağlıyorsa, fuzzer anomali aramayı durdurur.

Örnek:

İkiden fazla anomali tespit edilirse fuzzing durdurulacaktır. Her bir anomali içinde, ikiye eşit olmayan herhangi bir sayıda tekil anomali baytı bulunabilir.

![Koşul örneği][img-stop-condition]

!!! info "Varsayılan davranış"
    Fuzzing sürecini durdurma koşulları yapılandırılmamışsa, fuzzer tüm 255 anomali baytını kontrol eder. Bir anomali tespit edilirse, payload içindeki her bir bayt ayrı ayrı durdurulacaktır.