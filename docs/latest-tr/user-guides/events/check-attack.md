[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md

[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-vulns-tab]:        ../../images/user-guides/events/check-vulns.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# Olayları Kontrol Etme

Tespit edilen saldırıları ve olayları Wallarm Konsolu'nun **Olaylar** bölümünde kontrol edebilirsiniz. İhtiyacınız olan verileri bulmak için, lütfen [burda][use-search] tarif edildiği gibi arama alanını kullanın veya manuel olarak gerekli arama filtrelerini ayarlayın.

## Saldırılar

![Saldırılar sekmesi][img-attacks-tab]

* **Tarih**: Kötü niyetli isteğin tarih ve saati.
    * Eğer aynı türden birçok istek kısa aralıklarla tespit edildiyse, saldırının süresi tarihin altında görünür. Süre, belirli bir türden ilk isteğin ve belirtilen zaman dilimindeki aynı türden son isteğin arasındaki zaman dilimidir. 
    * Eğer saldırı şu an gerçekleşiyorsa, uygun bir [etiket](#events-that-are-currently-happening) gösterilir.
* **İstekler (isabetler)**: Belirtilen zaman dilimindeki saldırıdaki isteklerin (isabetlerin) sayısı. 
* **Yükler**: Saldırı türü ve benzersiz [kötü niyetli yük](../../glossary-en.md#malicious-payload) sayısı. 
* **Üst IP / Kaynak**: Kötü niyetli isteklerin kaynaklandığı IP adresi. Kötü niyetli istekler birkaç IP adresinden geldiğinde, arayüz en çok istek için sorumlu olan IP adresini gösterir. IP adresi için ayrıca şu bilgiler gösterilir:
     * Belirtilen zaman diliminde aynı saldırıda olan isteklerin kaynaklandığı toplam IP adresi sayısı. 
     * IP adresinin kayıtlı olduğu ülke/bölge (IP2Location gibi veritabanlarında bulunduysa).
     * Kaynak tipi, örneğin **Açık proxy**, **Web proxy**, **Tor** veya IP'nin kayıtlı olduğu bulut platformu, vb (IP2Location gibi veritabanlarında bulunduysa)
     * **Kötü niyetli IP'ler** etiketi, IP adresinin kötü niyetli aktiviteler için bilindiği durumlarda görünür. Bu, kamuya açık kayıtlar ve uzman doğrulamalarına dayanır.
* **Alan adı / Yol**: İsteğin hedeflediği alan adı, yol ve uygulama ID'si.
* **Durum**: Saldırı engelleme durumu ([trafik filtreleme moduna](../../admin-en/configure-wallarm-mode.md) bağlıdır):
     * Engellendi: saldırının tüm isabetleri filtreleme düğümü tarafından engellendi.
     * Kısmen engellendi: saldırının bazı isabetleri engellendi ve diğerleri sadece kaydedildi.
     * İzleme: saldırının tüm isabetleri kaydedildi ancak engellenmedi.
* **Parametre**: Kötü niyetli isteğin parametreleri ve isteğe uygulanan [ayrıştırıcıların](../rules/request-processing.md) etiketleri.
* **Aktif doğrulama**: Saldırının doğrulama durumu. Eğer saldırı yanlış pozitif olarak işaretlendi ise, uygun işaret bu sütunda (**FP**) görünür ve saldırı tekrar doğrulanmaz. Yanlış pozitif eylemi ile saldırıları bulmak için, aşağıdaki arama filtresini kullanın.
    ![Filter for false positive][img-show-falsepositive]

Son isteğin zamanına göre saldırıları sıralamak için **Son isabete göre sırala** anahtarını kullanabilirsiniz.

## Olaylar

![Olaylar sekmesi][img-incidents-tab]

Olaylar, saldırılarla aynı parametrelere sahiptir, tek bir sütun dışında: saldırıların **Doğrulama** sütunu olayların **Zafiyetler** sütunu ile değiştirilmiştir. **Zafiyetler** sütunu, ilgili olayın istismar ettiği zafiyeti görüntüler.

Zafiyete tıklamak sizi detaylı açıklamasına ve nasıl düzeltileceği konusunda talimatlarına götürür.

Son isteğin zamanına göre olayları sıralamak için **Son isabete göre sırala** anahtarını kullanabilirsiniz.

## Şu Anda Gerçekleşmekte Olan Olaylar

Gerçek zamanlı olayları kontrol edebilirsiniz. Eğer şirketinizin kaynakları kötü niyetli istekleri alıyorsa, Wallarm Konsolu'nda aşağıdaki veriler görüntülenir:

* Son 5 dakika içinde gerçekleşen olayların sayısı, bu **Olaylar** bölüm adının yanında ve bölüm içinde görüntülenir.
* Özel etiket, saldırıların veya olayların tablosundaki olay tarihinde görünür.

Arama alanına `şimdi` anahtar kelimesini ekleyerek sadece şu anda gerçekleşen olayları görüntüleyebilirsiniz:

* `saldırılar şimdi` ile şu anda gerçekleşen saldırıları görüntüleyin.
* `olaylar şimdi` ile şu anda gerçekleşen olayları görüntüleyin.
* `saldırılar olaylar şimdi` ile şu anda gerçekleşen saldırıları ve olayları görüntüleyin.

![Şu anda gerçekleşen saldırılar][img-current-attacks]

## Saldırıları ve Olayları almak için API çağrıları

Saldırı veya olay detaylarını almak için, Wallarm Konsolu UI'ının dışında Wallarm API'sini doğrudan [çağırabilirsiniz](../../api/overview.md). Aşağıda ilgili API çağrılarını örneklerini bulabilirsiniz.

**Son 24 saat içinde tespit edilen ilk 50 saldırıyı alın**

Lütfen `TIMESTAMP` ifadesini, tarihin 24 saat öncesine dönüştürülmüş olan [Unix zaman damgası](https://www.unixtimestamp.com/) formatıyla değiştirin.

--8<-- "../include-tr/api-request-examples/get-attacks-en.md"

!!! uyarı "100 veya daha fazla saldırı alırken"
    100 veya daha fazla kayıt içeren saldırı ve isabet setleri için, performansı optimize etmek adına bu verileri büyük veri setlerinden daha küçük parçalar halinde almak daha iyidir. [İlgili istek örneğini keşfetin](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)

**Son 24 saat içinde onaylanan ilk 50 olayı alın**

Bu istek, bir saldırı listesi için önceki örneğe çok benzer; Bu isteğe `"!vulnid": null` terimi eklenmiştir. Bu terim, API'ye belirli bir zafiyet ID'si olmadan tüm saldırıları görmezden gelmesini söyler ve bu, sistemin saldırılar ile olaylar arasındaki ayrımı nasıl yaptığını gösterir.

Lütfen `TIMESTAMP` ifadesini, tarihin 24 saat öncesine dönüştürülmüş olan [Unix zaman damgası](https://www.unixtimestamp.com/) formatıyla değiştirin.

--8<-- "../include-tr/api-request-examples/get-incidents-en.md"