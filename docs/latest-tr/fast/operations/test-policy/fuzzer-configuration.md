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

# Fuzzer Konfigürasyonu

!!! info "Fuzzer'ı etkinleştirmek"
    Fuzzer, varsayılan olarak devre dışıdır. Wallarm hesabınızdaki politika düzenleyicide **Fuzz testi** bölümünde etkinleştirebilirsiniz:
    
    ![Fuzzer'ı etkinleştirme][img-enable-fuzzer]

    Fuzzer anahtarı ve **Sadece özel DSL kullan** anahtarı **Test edilecek saldırılar** bölümünde birbirine karşıtır.

    Politika, varsayılan olarak bir fuzzer'ı desteklemez.

Fuzzer ve anomaliden ötürü ayarlar, politika düzenleyicinin **Fuzz testi** bölümünde bulunur.

Uygulamanın anomalileri test etmek için, FAST hedef uygulamanın, anomali baytları içeren bir yük ile gönderilen talebin yanıtını analiz eder. Belirlenen koşullara bağlı olarak, FAST tarafından gönderilen talep anomali olarak tanınır ya da tanınmaz.

Wallarm hesabınızdaki politika düzenleyicisi, size:

* **Payload ekle** ve **Başka bir yük ekle** butonlarına tıklayarak payload eklemeye 
* **Durum ekle** ve **Başka bir durum ekle** butonlarına tıklayarak, fuzzer işlemi üzerinde etkisi olan koşulları eklemeye
* Oluşturulan payloadları ve koşulları, yanlarında bulunan «—» sembolüne tıklayarak silmeye olanak verir

![Payload ve durum yönetimi][img-manipulate-items]

Durumları yapılandırırken aşağıdaki parametreleri kullanabilirsiniz:

* **Durum**: HTTPS yanıt kodu
* **Uzunluk**: yanıt uzunluğu bayt olarak
* **Zaman**: yanıt süresi saniye cinsinden
* **Uzunluk farkı**: FAST ve orijinal baz çizgisi isteklerine verilen yanıtın uzunluğundaki fark, bayt cinsinden
* **Zaman farkı**: FAST ve orijinal baz çizgisi isteklerine verilen yanıt süresi arasındaki fark, saniye cinsinden
* **DOM farkı**: FAST ve orijinal baz çizgisi isteklerindeki DOM öğeleri sayısındaki fark
* **Gövde**: [Ruby düzenli ifadesi][link-ruby-regexp]. Yanıt gövdesi bu düzenli ifadeyi karşıladığında durum yerine getirilir

İşte [**Yanıt alındığında fuzzing'i durdur**][anchor-stop-section] bölümünde, aşağıdaki parametreler de yapılandırılabilir:

* **Anomaliler**: algılanan anomali sayısı
* **Zaman aşımı hataları**: sunucudan hiç yanıt alınmadığı zaman sayısı

Bu parametrelerin kombinasyonunu kullanarak, fuzzer işlemlerini etkileyen gerekli koşulları yapılandırabilirsiniz (aşağıya bakınız).

## "Payloadlar" Bölümü

Bu bölüm, bir veya daha fazla payload yapılandırmak için kullanılır.

Payload eklenirken, aşağıdaki veriler belirtilir:

* yük boyutu 1'den 255 bayta
* payload'ın ekleneceği değer: başlangıç, rastgele veya son pozisyon

Payload değiştirilirken, aşağıdaki veriler belirtilir:

* değiştirme metodu: değerdeki bir rastgele segmenti değiştirme — ilk `M` bayt, son `M` bayt veya bütün string
* yük boyutu `M` 1'den 255 bayta


## "Yanıt Aldığında Sonucu Anomali Olarak Düşün" Bölümü

Uygulamanın yanıtı, **Yanıt aldığında sonucu anomali olarak düşün** bölümünde yapılandırılan bütün koşulları karşılarsa, o zaman bir anomali bulunmuş olarak kabul edilir.

**Örnek:**

Eğer yanıt gövdesi `.*SQLITE_ERROR.*` düzenli ifadesini karşılıyorsa, o zaman gönderilen FAST talebinin bir anomaliye neden olduğunu düşünün:

![Örnek durum][img-anomaly-condition]

!!! info "Varsayılan davranış"
    Eğer bu bölümde hiçbir yapılandırılmış durum yoksa, fuzzer sunucu yanıtını baz istek yanıtına oranla anormal şekilde farlı parametrelerle algılar. Örneğin, uzun bir sunucu yanıt süresi sunucu yanıtının anomali olarak algılanmasına sebep olabilir.

## "Yanıt Aldığında Sonucu Anomali Olarak Düşünme" Bölümü

Eğer uygulamanın yanıtı, **Yanıt aldığında sonucu anomali olarak düşünme** bölümünde yapılandırılan bütün koşulları karşılarsa, o zaman bir anomali bulunmuş olarak kabul edilmez.

**Örnek:**

Eğer yanıt kodu `500`'den düşükse, o zaman gönderilen FAST talebinin bir anomaliye neden olmadığını düşünün:

![Örnek durum][img-not-anomaly-condition]

## "Yanıt Aldığında Fuzzing'i Durdur" Bölümü

Eğer uygulamanın yanıtı, algılanan anomali sayısı veya zaman aşımı hata sayısı, **Yanıt alındığında fuzzing'i durdur** bölümünde yapılandırılan bütün koşulları karşılar ise, o zaman fuzzer anomali aramayı durdurur.

**Örnek:**

Eğer iki'den fazla anomali algılanırsa, fuzzing durdurulur. Her anomali içinde iki'ye eşit olmayan herhangi bir sayıda tek anomalous bayta sahip olabilirsiniz.

![Örnek durum][img-stop-condition]

!!! info "Varsayılan davranış"
    Eğer fuzzing sürecini durdurma koşulları yapılandırılmamışsa, o zaman fuzzer tüm 255 anomalous baytı kontrol eder. Bir anomali algılandığında, payload içindeki her tek bayt durdurulur.