# Kullanıcı etkinlik günlüğü

Wallarm Console'daki **Settings** → **Activity log** sekmesinde, Wallarm sistemindeki kullanıcı eylemlerinin geçmişini görüntüleyebilirsiniz. Günlükler, aşağıdaki nesnelerin oluşturulması, güncellenmesi ve silinmesine ilişkin bilgileri içerir:

* Ağ çevresindeki alan adları
* Ağ çevresindeki hizmetler (portlar)
* Ağ çevresindeki alan adları ve ilişkili IP adresleri
* [Two‑factor authentication](account.md#enabling-two-factor-authentication)
* [API tokens](api-tokens.md)
* [Users](users.md)
* Trafik işleme [rules](../rules/rules.md)
* [Custom ruleset backups](../rules/rules.md#backup-and-restore)
* [Wallarm nodes](../nodes/nodes.md)
* [Triggers](../triggers/triggers.md)
* [Integrations](integrations/integrations-intro.md)
* [Blocked IP address](../ip-lists/overview.md)
* [Hit sampling](../events/grouping-sampling.md#sampling-of-hits)

Günlükler ayrıca aşağıdaki eylemler ve nesneler hakkında bilgiler içerir:

* [false positive olarak işaretlenen zafiyet](../vulnerabilities.md#vulnerability-lifecycle)
* [Yeniden kontrol edilen saldırı](../../vulnerability-detection/threat-replay-testing/overview.md)

![Activity log](../../images/user-guides/settings/audit-log.png)

**Activity log kayıtlarını filtrelemek için**, aşağıdaki parametreleri kullanabilirsiniz:

* Eylemi gerçekleştiren kullanıcı bilgisi (büyük/küçük harf duyarlı)

      Eylem Wallarm teknik destek ekibi tarafından gerçekleştirildiyse, kullanıcı adı `Technical support` olur. Bu değer Activity log kayıtlarını sıralamak için kullanılamaz.
* Eylem türü
* Eylemin uygulandığı nesnenin adı
* Eylemin gerçekleştirildiği tarih