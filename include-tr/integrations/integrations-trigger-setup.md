Entegrasyon kartı üzerinden zaten kurduğunuz bildirimlere ek olarak, Wallarm tetikleyicileri bildirimler için ek olaylar seçmenize olanak tanır:

* Belirli bir zaman aralığında (gün, saat vb.) [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olay sayısının belirlenen sayıyı aşması

    !!! info "Nelerin sayılmadığı"
        * attacks için: 
            * [özel düzenli ifadeler](../../../user-guides/rules/regex-rule.md) temel alınan deneysel attacks.
        * hits için:
            * [özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayalı deneysel hits.
            * [sample](../../events/grouping-sampling.md#sampling-of-hits) içine kaydedilmeyen Hits.

* [API'de değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* IP adresi [denylisted](../../../user-guides/ip-lists/overview.md) oldu
* Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşulu ayrıntılandırmak için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler ayarlandıktan sonra, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Bir entegrasyon seçme](../../../images/user-guides/triggers/select-integration.png)