* [Hits](../../../glossary-en.md#hit) tespit edildi, şu durumlar hariç:

    * [özel düzenli ifade](../../rules/regex-rule.md) temelinde tespit edilen deneysel Hits. Deneysel olmayan Hits bildirimleri tetikler.
    * [örneklem](../../events/grouping-sampling.md#sampling-of-hits) içinde kaydedilmeyen Hits.

* Sistem ile ilgili:
    * [User](../../../user-guides/settings/users.md) değişiklikleri (yeni oluşturuldu, silindi, rol değişikliği)
    * [Integration](integrations-intro.md) değişiklikleri (devre dışı bırakıldı, silindi)
    * [Application](../../../user-guides/settings/applications.md) değişiklikleri (yeni oluşturuldu, silindi, ad değişikliği)
    * [rogue API tespiti](../../../api-discovery/rogue-api.md#step-1-upload-specification) veya [API spesifikasyonunun uygulanması](../../../api-specification-enforcement/setup.md#step-1-upload-specification) için kullanılan spesifikasyonların düzenli güncellenmesi sırasında oluşan hatalar
* [Vulnerabilities](../../../glossary-en.md#vulnerability) tespit edildi, varsayılan olarak tümü veya yalnızca seçilen risk seviyesi/seviyeleri için - high, medium veya low.
* [Rules](../../../user-guides/rules/rules.md) ve [triggers](../../../user-guides/triggers/triggers.md) değiştirildi (kural veya tetikleyici oluşturma, güncelleme ya da silme)
* ([AASM Enterprise](../../../api-attack-surface/setup.md#enabling) gerektirir) [Security issues](../../../api-attack-surface/security-issues.md) tespit edildi, tümü veya yalnızca seçilen [risk level(s)](../../../api-attack-surface/security-issues.md#issue-risk-level):
    * Critical risk
    * High risk
    * Medium risk
    * Low risk
    * Info risk
* Saatlik olarak, önceki saat içinde işlenen istek sayısını içeren bir bildirim alabilirsiniz