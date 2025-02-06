Besides the notifications you have already set up through the integration card, Wallarm triggers allow you to select additional events for notifications:

Entegre kartı aracılığıyla zaten ayarladığınız bildirimlerin yanı sıra, Wallarm triggers size bildirimler için ek olaylar seçme imkanı sunar:

* Belirli zaman aralığı (gün, saat vb.) başına [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olay sayısı, ayarlanan sayıyı aşarsa

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel saldırılar.
        * Vuruşlar için:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel vuruşlar.
            * [sample](../../events/grouping-sampling.md#sampling-of-hits) içerisinde kaydedilmeyen vuruşlar.

* [API'deki değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* IP adresi [kara listeye alındı](../../../user-guides/ip-lists/overview.md)
* Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşul detaylandırması için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler belirlendikten sonra, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Entegrasyon seçimi](../../../images/user-guides/triggers/select-integration.png)