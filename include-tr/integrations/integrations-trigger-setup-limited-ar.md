Entegration card üzerinden zaten yapılandırdığınız bildirimlere ek olarak, Wallarm tetikleyicileri bildirimler için ek olaylar seçmenize olanak tanır:

* Zaman aralığı başına (gün, saat vb.) [saldırıların](../../../glossary-en.md#attack), [hitlerin](../../../glossary-en.md#hit) veya olayların sayısı belirlenen sayıyı aşarsa

    !!! info "Nelerin sayılmadığı"
        * Saldırılar için:
            * [özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel saldırılar.
        * Hitler için:
            * [özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel hitler.
            * [örneklemde](../../../user-guides/events/analyze-attack.md#sampling-of-hits) kaydedilmeyen hitler.

* [API'de değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* Yeni [rogue API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni bir kullanıcı eklendi

Koşulu ayrıntılandırmak için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler ayarlanır ayarlanmaz, seçilen uyarının gönderileceği entegrasyonu seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Entegrasyon seçimi](../../../images/user-guides/triggers/select-integration.png)