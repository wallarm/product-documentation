* [Hits](../../../glossary-en.md#hit) tespit edildi, şu durumlar dışında:

    * [özel düzenli ifade](../../rules/regex-rule.md) temelinde tespit edilen deneysel Hits. Deneysel olmayan Hits bildirimleri tetikler.
    * [sample](../../../user-guides/events/analyze-attack.md#sampling-of-hits) içinde kaydedilmeyen Hits.

* Sistemle ilgili:
    * [User](../../../user-guides/settings/users.md) değişiklikleri (yeni oluşturuldu, silindi, rol değişikliği)
    * [Integration](integrations-intro.md) değişiklikleri (devre dışı bırakıldı, silindi)
    * [Application](../../../user-guides/settings/applications.md) değişiklikleri (yeni oluşturuldu, silindi, ad değişikliği)
    * [rogue API tespiti](../../../api-discovery/rogue-api.md#step-1-upload-specification) veya [API spesifikasyonu zorlaması](../../../api-specification-enforcement/setup.md#step-1-upload-specification) için kullanılan spesifikasyonların düzenli güncellenmesi sırasında oluşan hatalar
* [Vulnerabilities](../../../glossary-en.md#vulnerability) tespit edildi, varsayılan olarak tümü ya da yalnızca seçilen risk seviyesi/seviyeleri için - yüksek, orta veya düşük.
* [Rules](../../../user-guides/rules/rules.md) ve [triggers](../../../user-guides/triggers/triggers.md) değişti (rule veya trigger oluşturma, güncelleme ya da silme)
* Saatlik olarak, önceki saat içinde işlenen isteklerin sayısını içeren bir bildirim alabilirsiniz