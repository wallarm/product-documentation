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

!!! info "Fuzzer'ın Etkinleştirilmesi"
    Fuzzer varsayılan olarak devre dışıdır. Wallarm hesabınızdaki **Fuzz testing** bölümünden etkinleştirebilirsiniz:
    
    ![Fuzzer'ı Etkinleştirme][img-enable-fuzzer]

    **Attacks to test** bölümündeki fuzzer anahtarı ile **Use only custom DSL** anahtarı birbirini dışlar.

    Varsayılan olarak politika bir fuzzer desteklemez.

Fuzzer ve anomali tespitiyle ilgili ayarlar, politika düzenleyicisindeki **Fuzz testing** bölümünde yer alır.

Uygulamanın anomaliler açısından test edilmesi için FAST, hedef uygulamanın anomali baytları içeren bir yük ile yaptığı isteğe verdiği yanıtı analiz eder. Belirtilen koşullara bağlı olarak, FAST tarafından gönderilen istek anormal olarak algılanır ya da algılanmaz.

Wallarm hesabınızdaki politika düzenleyici, size şu işlemleri yapma imkanı tanır:

* **Add payload** ve **Add another payload** düğmelerine tıklayarak yük ekleme
* **Add condition** ve **Add another condition** düğmelerine tıklayarak fuzzer işlemini etkileyen koşullar ekleme
* Yanlarında bulunan «—» simgesine tıklayarak oluşturulan yükleri ve koşulları silme

![Yük ve koşul yönetimi][img-manipulate-items]

Koşulları yapılandırırken aşağıdaki parametreleri kullanabilirsiniz:

* **Status**: HTTPS yanıt kodu
* **Length**: yanıt uzunluğu (bayt cinsinden)
* **Time**: yanıt süresi (saniye cinsinden)
* **Length diff**: FAST ve orijinal temel isteklerin yanıt uzunlukları arasındaki fark (bayt cinsinden)
* **Time diff**: FAST ve orijinal temel isteklere verilen yanıt süresi arasındaki fark (saniye cinsinden)
* **DOM diff**: FAST ve orijinal temel isteklerdeki DOM eleman sayıları arasındaki fark
* **Body**: [Ruby regular expression][link-ruby-regexp]. Yanıt gövdesi bu düzenli ifadeyi karşıladığı sürece koşul sağlanmış kabul edilir

[**Stop fuzzing if response**][anchor-stop-section] bölümünde, aşağıdaki parametreler de yapılandırılabilir:

* **Anomalies**: tespit edilen anomali sayısı
* **Timeout errors**: sunucudan yanıt alınamayan durumların sayısı

Bu parametrelerin kombinasyonlarını kullanarak, fuzzer işlemlerini etkileyen gerekli koşulları yapılandırabilirsiniz (aşağıya bakınız).

## "Payloads" Bölümü

Bu bölüm, bir veya daha fazla yükü yapılandırmak için kullanılır.

Yük eklenirken aşağıdaki veriler belirtilir:

* 1 ile 255 bayt arasında yük boyutu
* Yükün nerede ekleneceği: başlangıç, rastgele veya bitiş pozisyonu

Yük değiştirilirken aşağıdaki veriler belirtilir:

* Değiştirme yöntemi: değerin rastgele bir segmentini değiştirmek — ilk `M` bayt, son `M` bayt veya tüm dize
* 1 ile 255 bayt arasında `M` yük boyutu

## "Consider Result an Anomaly if Response" Bölümü

Uygulamadan gelen yanıt, **Consider result an anomaly if response** bölümünde yapılandırılan tüm koşulları sağlıyorsa, bir anomali bulunmuş kabul edilir.

**Örnek:**

Eğer yanıt gövdesi `.*SQLITE_ERROR.*` düzenli ifadesini sağlıyorsa, gönderilen FAST isteğinin anomaliye sebep olduğu düşünülür:

![Koşul örneği][img-anomaly-condition]

!!! info "Varsayılan davranış"
    Bu bölümde yapılandırılmış koşul yoksa, fuzzer, temel istek yanıtına göre anormal farklı parametreler içeren sunucu yanıtını tespit eder. Örneğin, uzun bir sunucu yanıt süresi, sunucu yanıtının anormal olduğunu tespit etmek için bir sebep olabilir.

## "Consider result not an anomaly if response" Bölümü

Uygulamadan gelen yanıt, **Consider result not an anomaly if response** bölümünde yapılandırılan tüm koşulları sağlıyorsa, bir anomali bulunmamış kabul edilir.

**Örnek:**

Eğer yanıt kodu `500`'den düşükse, gönderilen FAST isteğinin anomaliye sebep olmadığı düşünülür:

![Koşul örneği][img-not-anomaly-condition]

## "Stop fuzzing if response" Bölümü

Uygulama yanıtı, tespit edilen anomali sayısı veya zaman aşımı hataları, **Stop fuzzing if response** bölümünde yapılandırılan tüm koşulları sağlıyorsa, fuzzer anomali aramayı durdurur.

**Örnek:**

İki veya daha fazla anomali tespit edilirse fuzzing durdurulacaktır. Her anomali durumunda, ikiye eşit olmayan herhangi bir sayıda tek anormal bayt olabilir.

![Koşul örneği][img-stop-condition]

!!! info "Varsayılan davranış"
    Fuzzing işlemini durdurmak için koşullar yapılandırılmamışsa, fuzzer 255 anormal baytı kontrol eder. Bir anomali tespit edildiğinde, yükdeki her bir bireysel bayt durdurulacaktır.