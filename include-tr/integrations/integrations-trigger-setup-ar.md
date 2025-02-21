Entegrasyon kartı aracılığıyla önceden ayarladığınız bildirimlere ek olarak, Wallarm tetikleyicileri bildirimler için ek olayları seçmenizi sağlar:

* Belirli bir zaman aralığında (gün, saat vb.) [attack](../../../glossary-en.md#attack), [hit](../../../glossary-en.md#hit) veya olay sayısı belirlenen sayıyı aşarsa

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel saldırılar.
        * Vuruşlar için:
            * [custom regular expressions](../../../user-guides/rules/regex-rule.md) tabanlı deneysel vuruşlar.
            * [sample](../../../user-guides/events/analyze-attack.md#sampling-of-hits) içinde saklanmayan vuruşlar.

* [Changes in API](../../../api-discovery/track-changes.md) gerçekleşti
* IP adresi [denylisted](../../../user-guides/ip-lists/overview.md) listesine alındı
* Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşul ayrıntılandırması için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler ayarlandığında, seçilen uyarının gönderileceği entegrasyonu belirleyin. Birden fazla entegrasyonu aynı anda seçebilirsiniz.

![Bir entegrasyon seçimi](../../../images/user-guides/triggers/select-integration.png)