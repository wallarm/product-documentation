Entegrasyon kartı üzerinden zaten yapılandırdığınız bildirimlere ek olarak, Wallarm tetikleyicileri bildirimler için ek olaylar seçmenize olanak tanır:

* Zaman aralığı (gün, saat vb.) başına [saldırıların](../../../glossary-en.md#attack), [hit'lerin](../../../glossary-en.md#hit) veya olayların sayısı belirlenen sayıyı aşıyor

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayalı deneysel saldırılar.
        * Hit'ler için:
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayalı deneysel hit'ler.
            * [Örneklem](../../../user-guides/events/analyze-attack.md#sampling-of-hits) içinde kaydedilmeyen hit'ler.

* [API'de değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* IP adresi [denylist'e alındı](../../../user-guides/ip-lists/overview.md)
* Yeni [izinsiz API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşulu ayrıntılandırmak için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler ayarlandıktan sonra, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Bir entegrasyon seçme](../../../images/user-guides/triggers/select-integration.png)