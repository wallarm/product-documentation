[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# Genel Ayarlar

**Ayarlar** bölümünün **Genel** sekmesinde aşağıdaki işlemleri yapabilirsiniz:

* Wallarm filtreleme modunu değiştirin
* Otomatik oturum kapatma zaman aşımını yönetin

![Genel sekme](../../images/user-guides/settings/general-tab.png)

## Filtreleme modu

Her Wallarm düğümü, HTTP istek seviyesinde saldırıları tanımlayabilir ve engelleyebilir. Bu [filtreleme modu][link-config-parameters] yerel veya global ayarlar tarafından belirlenir:

* **Yerel ayarlar (varsayılan)**: bu mod, bir filtre düğümü yapılandırma dosyasından ayarları kullanır.
* **Güvenli engelleme**: [gri listeye alınmış IP'lerden](../ip-lists/graylist.md) kaynaklanan tüm kötü amaçlı istekler engellenir.
* **İzleme**: tüm istekler işlenir, ancak saldırı tespit edilse bile hiçbiri engellenmez.
* **Engelleme**: bir saldırının belirlendiği tüm istekler engellenir.

## Oturum Yönetimi

[Administratorler](users.md#user-roles), şirket hesabı için oturum kapatma zaman aşımlarını ayarlayabilir. Ayarlar tüm hesap kullanıcılarını etkileyecektir. Boşta ve kesin zaman aşımları belirlenebilir.