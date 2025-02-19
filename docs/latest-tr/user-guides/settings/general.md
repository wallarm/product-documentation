[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# Genel Ayarlar

**Ayarlar** bölümünün **Genel** sekmesinde şunları yapabilirsiniz:

* Wallarm filtreleme modunu değiştirme
* Otomatik çıkış zaman aşım sürelerini yönetme

![Genel sekme](../../images/user-guides/settings/general-tab.png)

## Filtreleme modu

Her Wallarm düğümü, HTTP istek düzeyinde saldırıları tespit edip engelleyebilir. Bu [filtreleme modu][link-config-parameters], yerel ya da genel ayarlara göre belirlenir:

* **Yerel ayarlar (varsayılan)**: Bu mod, bir filtre düğümü yapılandırma dosyasındaki ayarları kullanır.
* **Güvenli engelleme**: [gri listelenmiş IP'lerden](../ip-lists/overview.md) kaynaklanan tüm kötü amaçlı istekler engellenir.
* **İzleme**: Tüm istekler işlenir, ancak saldırı tespit edilse bile hiçbir istek engellenmez.
* **Engelleme**: Saldırı tespit edilen tüm istekler engellenir.

## Çıkış yönetimi

[Yöneticiler](users.md#user-roles), şirket hesabı için çıkış zaman aşım sürelerini ayarlayabilir. Ayarlar, tüm hesap kullanıcılarının üzerinde etkili olur. Boşta kalma ve mutlak zaman aşımı ayarlanabilir.