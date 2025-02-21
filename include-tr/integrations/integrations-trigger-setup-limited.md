Besides the notifications you have already set up through the integration card, Wallarm triggers allow you to select additional events for notifications:

Entegrasyon kartı aracılığıyla zaten ayarladığınız bildirimlerin yanı sıra, Wallarm tetikleyicileri ek bildirim olaylarını seçmenizi sağlar:

* Number of [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) or incidents per time interval (day, hour, etc.) exceeds the set number  
  Belirli bir zaman aralığı (gün, saat vb.) içinde [saldırı](../../../glossary-en.md#attack), [hit](../../../glossary-en.md#hit) veya olay sayısının belirlenen sınırı aşması

    !!! info "What is not counted"  
        Ne sayılmaz

        * For attacks:  
            Saldırılar için:  
            * The experimental attacks based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).  
              [Özel düzenli ifadeler](../../../user-guides/rules/regex-rule.md) temelinde gerçekleştirilen deneysel saldırılar.
        * For hits:  
            Hitler için:  
            * The experimental hits based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).  
              [Özel düzenli ifadeler](../../../user-guides/rules/regex-rule.md) temelinde gerçekleştirilen deneysel hitler.  
            * Hits not saved in the [sample](../../events/grouping-sampling.md#sampling-of-hits).  
              [Sample](../../events/grouping-sampling.md#sampling-of-hits) içinde saklanmayan hitler.

* [Changes in API](../../../api-discovery/track-changes.md) took place  
  [API’deki değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti

* New [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) was detected  
  Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi

* New user was added to the company account  
  Şirket hesabına yeni bir kullanıcı eklendi

For condition detailing, you can add one or more filters. As soon, as condition and filters are set, select the integration through which the selected alert should be sent. You can select several integrations simultaneously.  
Koşul detaylandırması için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler belirlendikten sonra, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birkaç entegrasyon seçebilirsiniz.

![Choosing an integration](../../../images/user-guides/triggers/select-integration.png)