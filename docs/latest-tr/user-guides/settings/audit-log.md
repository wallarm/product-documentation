# Kullanıcı aktivite kaydı

Wallarm Console'daki **Ayarlar** → **Etkinlik Kaydı** sekmesinde, Wallarm sistemdeki kullanıcı eylemlerinin geçmişini kontrol edebilirsiniz. Loglar, aşağıdaki nesnelerin oluşturulması, güncellenmesi ve silinmesi hakkında bilgi içerir:

* [Açığa çıkan varlıklardan](../scanner.md) IP adresi veya alt ağ
* Ağ çevresinden alan adları
* Ağ çevresinden hizmetler (portlar)
* Ağ çevresinden alan adları ve ilişkili IP adresleri
* [İki faktörlü doğrulama](account.md#enabling-two-factor-authentication)
* [API tokenları](api-tokens.md)
* [Kullanıcılar](users.md)
* Trafik işleme [kuralları](../rules/rules.md)
* [Özel kurallar yedekleme](../rules/rules.md)
* [Wallarm düğümleri](../nodes/nodes.md)
* [CDN düğümleri](../nodes/cdn-node.md)
* [Tetikleyiciler](../triggers/triggers.md)
* [Entegrasyonlar](integrations/integrations-intro.md)
* [Engellenen IP adresi](../ip-lists/denylist.md)
* [Vuruş örnekleme](../events/analyze-attack.md#sampling-of-hits)

Loglar ayrıca aşağıdaki eylem ve nesnelerle ilgili bilgileri de içerir:

* [Yanlış pozitif olarak işaretlenen güvenlik açığı](../vulnerabilities.md#marking-vulnerabilities-as-false-positives)
* [Tekrar kontrol edilen saldırı](../events/verify-attack.md)

![Etkinlik Kaydı](../../images/user-guides/settings/audit-log.png)

**Etkinlik günlüğü kayıtlarını filtrelemek için**, aşağıdaki parametreleri kullanabilirsiniz:

* Eylemi gerçekleştiren kullanıcı üzerine büyük/küçük harfe duyarlı veriler

      Eylem Wallarm teknik destek ekibi tarafından gerçekleştirildiyse, kullanıcı adı `Teknik destek`tir. Bu değer etkinlik log kayıtlarını sıralamak için kullanılamaz.
* Eylem türü
* Eylemin gerçekleştirildiği nesnenin adı
* Eylemin gerçekleştirildiği tarih