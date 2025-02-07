# Kullanıcı etkinlik günlüğü

Wallarm Console'un **Ayarlar** → **Etkinlik günlüğü** sekmesinde, Wallarm sistemindeki kullanıcı işlemlerinin geçmişini kontrol edebilirsiniz. Günlükler, aşağıdaki nesnelerin oluşturulması, güncellenmesi ve silinmesiyle ilgili bilgileri içerir:

* [exposed assets](../scanner.md)'da yer alan IP adresi veya alt ağ
* Ağ çevresindeki alan adları
* Ağ çevresindeki servisler (portlar)
* Ağ çevresindeki alan adları ve ilişkili IP adresleri
* [İki‑faktörlü kimlik doğrulama](account.md#enabling-two-factor-authentication)
* [API tokens](api-tokens.md)
* [Users](users.md)
* Trafik işleme [kuralları](../rules/rules.md)
* [Özel kurallar seti yedeklemeleri](../rules/rules.md#backup-and-restore)
* [Wallarm nodes](../nodes/nodes.md)
* [Triggers](../triggers/triggers.md)
* [Integrations](integrations/integrations-intro.md)
* [Engellenen IP adresi](../ip-lists/overview.md)
* [Hit örneklemesi](../events/grouping-sampling.md#sampling-of-hits)

Günlükler ayrıca aşağıdaki işlemler ve nesneler hakkında bilgileri de içerir:

* [Yanlış pozitif olarak işaretlenmiş güvenlik açığı](../vulnerabilities.md#vulnerability-lifecycle)
* [Yeniden kontrol edilen saldırı](../../vulnerability-detection/threat-replay-testing/overview.md)

![Etkinlik günlüğü](../../images/user-guides/settings/audit-log.png)

**Etkinlik günlüğü kayıtlarını filtrelemek için** aşağıdaki parametreleri kullanabilirsiniz:

* İşlemi gerçekleştiren kullanıcıdaki büyük/küçük harf duyarlı veri

      Eğer işlem Wallarm teknik destek ekibi tarafından gerçekleştirildiyse, kullanıcı adı `Technical support` olarak gelir. Bu değer, etkinlik günlüğü kayıtlarını sıralamak için kullanılamaz.
* İşlem türü
* İşlemin gerçekleştirildiği nesnenin adı
* İşlemin gerçekleştirildiği tarih