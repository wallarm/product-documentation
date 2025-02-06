Entegrasyon kartı üzerinden halihazırda ayarladığınız bildirimlerin yanı sıra, Wallarm triggers fazladan bildirimler için ek olaylar seçmenize olanak tanır:

* Belirli bir zaman aralığında (gün, saat vb.) [saldırı](../../../glossary-en.md#attack), [hit](../../../glossary-en.md#hit) veya olay sayısının ayarlanan değeri aşması

    !!! info "Sayılmayanlar"
        * Saldırılar için:
            * [Özel düzenli ifadeler](../../../user-guides/rules/regex-rule.md) temelindeki deneysel saldırılar.
        * Hitler için:
            * [Özel düzenli ifadeler](../../../user-guides/rules/regex-rule.md) temelindeki deneysel hitler.
            * [Örneklemede](../../../user-guides/events/analyze-attack.md#sampling-of-hits) yer almayan hitler.

* [API değişiklikleri](../../../api-discovery/track-changes.md) gerçekleşti
* Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşul detaylandırması için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler belirlendikten sonra, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Bir entegrasyon seçimi](../../../images/user-guides/triggers/select-integration.png)