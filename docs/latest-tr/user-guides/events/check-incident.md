[link-using-search]:    ../search-and-filters/use-search.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# Olay Analizi

Wallarm Console içinde, tespit edilen [olayları](../../glossary-en.md#security-incident) **Incidents** bölümünde analiz edebilirsiniz. Gerekli verileri bulmak için, [burada][use-search] açıklandığı şekilde arama alanını kullanın veya gerekli arama filtrelerini manuel olarak ayarlayın.

## Olayları kontrol etme

![Incidents sekmesi][img-incidents-tab]

* **Date**: Kötü amaçlı isteğin tarih ve saati.
    * Aynı türden birkaç istek kısa aralıklarla tespit edildiyse, tarih altında saldırı süresi görüntülenir. Süre, belirtilen zaman aralığında belirli bir türdeki ilk istek ile aynı türdeki son istek arasındaki zaman periyodudur. 
    * Saldırı şu anda gerçekleşiyorsa, uygun bir etiket görüntülenir.
* **Payloads**: Saldırı türü ve benzersiz [kötü amaçlı payload](../../glossary-en.md#malicious-payload) sayısı. 
* **Hits**: Belirtilen zaman dilimindeki saldırıdaki hit (istek) sayısı. 
* **Top IP / Source**: Kötü amaçlı isteklerin kaynaklandığı IP adresi. Kötü amaçlı istekler birden fazla IP adresinden geliyorsa, arayüz en fazla isteğin geldiği IP adresini gösterir. IP adresi için ayrıca aşağıdaki veriler görüntülenir:
     * Belirtilen zaman aralığında aynı saldırı kapsamındaki isteklerin kaynaklandığı toplam IP adresi sayısı. 
     * IP adresinin kayıtlı olduğu ülke/bölge (IP2Location veya benzeri veritabanlarında bulunduysa)
     * Kaynak türü; ör. **Public proxy**, **Web proxy**, **Tor** ya da IP'nin kayıtlı olduğu bulut platformu vb. (IP2Location veya benzeri veritabanlarında bulunduysa)
     * IP adresi kötü amaçlı etkinliklerle biliniyorsa, **Malicious IPs** etiketi görünür. Bu, kamuya açık kayıtlar ve uzman doğrulamaları temel alınarak belirlenir
* **Domain / Path**: İsteğin hedeflediği alan adı, yol ve uygulama kimliği (ID).
* **Status**: Saldırı engelleme durumu ([trafik filtreleme modu](../../admin-en/configure-wallarm-mode.md) değerine bağlıdır):
     * Blocked: saldırıdaki tüm hit'ler filtreleme düğümü tarafından engellendi.
     * Partially blocked: saldırıdaki bazı hit'ler engellendi, diğerleri yalnızca kaydedildi.
     * Monitoring: saldırıdaki tüm hit'ler kaydedildi ancak engellenmedi.
* **Parameter**: Kötü amaçlı isteğin parametreleri ve isteğe uygulanan [ayrıştırıcılar](../rules/request-processing.md) etiketleri
* **Vulnerabilities**: Olayın istismar ettiği güvenlik açığı. Güvenlik açığına tıklamak, ayrıntılı açıklamasına ve nasıl düzeltileceğine ilişkin talimatlara götürür.

Olayları son isteğin zamanına göre sıralamak için, **Sort by latest hit** anahtarını kullanabilirsiniz.

## Tehdit aktörü faaliyetlerinin tam bağlamı {#full-context-of-threat-actor-activities}

--8<-- "../include/request-full-context.md"

## Olaylara yanıt verme

[Olaylar](../../glossary-en.md#security-incident), doğrulanmış bir güvenlik açığını hedef alan saldırılardır.

![Incidents sekmesi][img-incidents-tab]

**Incidents** bölümünde bir olay göründüğünde:

1. İsteğe bağlı olarak (önerilir), olayın kötü amaçlı isteklerinin [tam bağlamını](#full-context-of-threat-actor-activities) araştırın: hangi [kullanıcı oturumuna](../../api-sessions/overview.md) ait olduklarını ve bu oturumdaki isteklerin tam sıralamasını.
  
     Bu, tehdit aktörünün tüm etkinliğini ve mantığını görmenizi, saldırı vektörlerini ve hangi kaynakların tehlikeye atılabileceğini anlamanızı sağlar.
  
1. **Vulnerabilities** sütunundaki bağlantıyı takip ederek, bu güvenlik açığının nasıl düzeltileceğine ilişkin talimatlar ve ilgili olaylar listesi de dahil olmak üzere ayrıntılı güvenlik açığı bilgilerini alın. 

     ![Güvenlik açığına ilişkin ayrıntılı bilgiler](../../images/user-guides/vulnerabilities/vuln-info.png)

     Güvenlik açığını düzeltin ve ardından Wallarm içinde kapalı olarak işaretleyin. Ayrıntılar için [Güvenlik Açıklarını Yönetme](../vulnerabilities.md) makalesine bakın.
1. Listede olaya geri dönün, sistem tepkisine hangi mekanizmanın neden olduğunu araştırın (saldırıların `Blocked`, `Partially blocked` ve `Monitoring` [durumlarına](check-attack.md#attack-analysis) dikkat edin), sistemin benzer isteklere gelecekte nasıl davranacağını ve gerekirse bu gelecekteki davranışın nasıl ayarlanacağını değerlendirin.

     Olaylar için bu araştırma ve ayarlama, diğer tüm saldırılarda olduğu [gibi](check-attack.md#responding-to-attacks) aynı şekilde gerçekleştirilir.

## Olayları almak için API çağrıları

Olay ayrıntılarını almak için, Wallarm Console arayüzünü kullanmanın yanı sıra [Wallarm API'yi doğrudan çağırabilirsiniz](../../api/overview.md). Aşağıda, son 24 saatte tespit edilen ilk 50 olayı alma amaçlı API çağrısına bir örnek verilmiştir.

İstek, saldırı listesi için [kullanılan](check-attack.md#api-calls) istekle benzerdir; olayı sorgulamak için isteğe `"!vulnid": null` terimi eklenir. Bu terim, API'ye güvenlik açığı kimliği (ID) belirtilmemiş tüm saldırıları yok saymasını söyler ve sistemin saldırıları olaylardan bu şekilde ayırt etmesini sağlar.

Lütfen `TIMESTAMP` değerini, 24 saat önceki tarihin [Unix Zaman Damgası](https://www.unixtimestamp.com/) biçimine dönüştürülmüş haliyle değiştirin.

--8<-- "../include/api-request-examples/get-incidents-en.md"