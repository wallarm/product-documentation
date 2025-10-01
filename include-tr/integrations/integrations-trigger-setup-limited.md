Entegrasyon kartı üzerinden zaten yapılandırdığınız bildirimlere ek olarak, Wallarm tetikleyicileri bildirimler için ek olaylar seçmenize olanak tanır:

* Belirli bir zaman aralığında (gün, saat vb.) [saldırılar](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olay sayısının belirlenen sayıyı aşması

    !!! info "Sayılmayanlar"
        * Saldırılar için: 
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel saldırılar.
        * Hits için:
            * [Özel düzenli ifadelere](../../../user-guides/rules/regex-rule.md) dayanan deneysel hits.
            * [Örneklem](../../events/grouping-sampling.md#sampling-of-hits) içinde kaydedilmeyen Hits.

* [API'de değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* Yeni [izinsiz API](../../../api-discovery/rogue-api.md) (shadow, orphan, zombie) tespit edildi
* Şirket hesabına yeni kullanıcı eklendi

Koşulu ayrıntılandırmak için bir veya daha fazla filtre ekleyebilirsiniz. Koşul ve filtreler ayarlandıktan sonra, seçilen uyarının hangi entegrasyon üzerinden gönderileceğini seçin. Aynı anda birden fazla entegrasyon seçebilirsiniz.

![Bir entegrasyon seçme](../../../images/user-guides/triggers/select-integration.png)