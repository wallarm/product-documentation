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

Wallarm Console'da, **Olaylar** bölümünde tespit edilen olayları analiz edebilirsiniz. Gerekli verileri bulmak için lütfen [burada][use-search] açıklanan arama alanını kullanın veya gerekli arama filtrelerini elle ayarlayın.

## Olayları Kontrol Etme

![Olaylar sekmesi][img-incidents-tab]

* **Tarih**: Zararlı isteğin gerçekleştiği tarih ve saat.
    * Kısa aralıklarla aynı tipten birkaç istek tespit edildiyse, saldırı süresi tarihin altında görünür. Süre, belirli zaman aralığında belli bir tipteki ilk istekle aynı tipteki son istek arasındaki zaman dilimidir.
    * Eğer saldırı şu anda gerçekleşiyorsa, uygun bir etiket görüntülenir.
* **Payloads**: Saldırı türü ve benzersiz [malicious payload](../../glossary-en.md#malicious-payload) sayısı.
* **Hits**: Belirtilen zaman diliminde saldırıdaki isteklerin (hitlerin) sayısı.
* **Top IP / Kaynak**: Zararlı isteklerin geldiği IP adresi. Zararlı istekler birkaç IP adresinden geliyorsa, arayüz en çok isteğe neden olan IP adresini gösterir. IP adresi için ayrıca şu veriler de görüntülenir:
     * Belirtilen zaman diliminde aynı saldırı kapsamında isteklerin geldiği IP adreslerinin toplam sayısı.
     * IP adresinin kayıtlı olduğu ülke/bölge (IP2Location veya benzeri veri tabanlarında bulunması durumunda)
     * Kaynak türü, örneğin **Public proxy**, **Web proxy**, **Tor** veya IP'nin kayıtlı olduğu cloud platformu vb. (IP2Location veya benzeri veri tabanlarında bulunması durumunda)
     * IP adresi kötü niyetli aktiviteler için biliniyorsa **Malicious IPs** etiketi görüntülenecektir. Bu, kamuya açık kayıtlar ve uzman doğrulamaları temel alınarak sağlanır.
* **Domain / Path**: İsteğin hedef aldığı domain, path ve application ID.
* **Status**: Saldırı engelleme durumu (ayrıca [traffic filtration mode](../../admin-en/configure-wallarm-mode.md)'a bağlı):
     * Blocked: Saldırının tüm hitleri filtreleme düğümü tarafından engellendi.
     * Partially blocked: Saldırının bazı hitleri engellenirken bazıları sadece kaydedildi.
     * Monitoring: Saldırının tüm hitleri kaydedildi fakat engellenmedi.
* **Parameter**: Zararlı isteğin parametreleri ve isteğe uygulanan [parsers](../rules/request-processing.md) etiketleri.
* **Vulnerabilities**: Olayın faydalandığı güvenlik açığı. Güvenlik açığına tıkladığınızda detaylı açıklaması ve nasıl düzeltileceğine dair talimatlar görüntülenir.

En son istek zamanına göre olayları sıralamak için **Sort by latest hit** anahtarını kullanabilirsiniz.

## Tehdit Aktörünün Tüm Faaliyetlerinin Tam Bağlamı

--8<-- "../include/request-full-context.md"

## Olaylara Yanıt Verme

[Olaylar](../../glossary-en.md#security-incident), tespit edilmiş bir güvenlik açığına yönelik saldırılardır.

![Olaylar sekmesi][img-incidents-tab]

Olay **Olaylar** bölümünde göründükten sonra:

1. Opsiyonel olarak (önerilir), olayın zararlı isteklerinin [tam bağlamını](#full-context-of-threat-actor-activities) araştırın: bu isteklerin hangi [kullanıcı oturumuna](../../api-sessions/overview.md) ait olduğu ve bu oturumdaki isteklerin tam dizisinin ne olduğu.

     Bu, tehdit aktörünün tüm aktivitesini ve mantığını görmenizi, saldırı vektörlerini anlamanızı ve hangi kaynakların tehlikeye girebileceğini belirlemenizi sağlar.
  
1. Güvenlik Açıkları sütunundaki bağlantıyı takip edin; bu, ilgili güvenlik açığı hakkında ayrıntılı bilgi, nasıl düzeltileceğine dair talimatlar ve ilgili olayların listesini sunar.

     ![Güvenlik açığı detaylı bilgi](../../images/user-guides/vulnerabilities/vuln-info.png)

     **Güvenlik açığını düzeltin** ve ardından Wallarm'da kapalı olarak işaretleyin. Ayrıntılı bilgi için lütfen [Güvenlik Açıklarını Yönetme](../vulnerabilities.md) makalesine bakın.
1. Listedeki olaya geri dönün, sistem tepkisini hangi mekanizmanın tetiklediğini inceleyin (saldırıların `Blocked`, `Partially blocked` ve `Monitoring` [durumlarına](check-attack.md#attack-analysis) dikkat edin), sistemin benzer isteklere gelecekte nasıl davranacağını ve gerekirse bu gelecekteki davranışı nasıl ayarlayacağınızı belirleyin.

     Olaylar için bu araştırma ve ayarlama, diğer saldırılar için [aynı şekilde](check-attack.md#responding-to-attacks) yapılmaktadır.

## Olayları Almak için API Çağrıları

Olay detaylarını almak için Wallarm Console UI'nin yanı sıra [Wallarm API'sını direkt olarak çağırabilirsiniz](../../api/overview.md). Aşağıda, **son 24 saatte tespit edilen ilk 50 olayı almak** için API çağrısının örneği verilmiştir.

İstek, saldırıların listesini almak için kullanılan [isteğe benzer](check-attack.md#api-calls-to-get-attacks); `"!vulnid": null` ifadesi olayları talep etmek amacıyla eklenmiştir. Bu ifade, API'ya belirli bir vulnerability ID'si olmayan tüm saldırıları göz ardı etmesini söyler ve sistemin saldırılar ile olaylar arasındaki ayrımı yapma biçimidir.

Lütfen `TIMESTAMP` değerini, 24 saat öncesinin [Unix Timestamp](https://www.unixtimestamp.com/) formatına dönüştürülmüş tarihiyle değiştirin.

--8<-- "../include/api-request-examples/get-incidents-en.md"