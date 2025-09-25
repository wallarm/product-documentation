[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# General Settings

**Settings** bölümünün **General** sekmesinde şunları yapabilirsiniz:

* Wallarm filtreleme modunu değiştirmek
* Otomatik oturum kapatma zaman aşımlarını yönetmek

![General sekmesi](../../images/user-guides/settings/general-tab.png)

## Filtreleme modu

Her Wallarm düğümü HTTP isteği düzeyinde saldırıları tespit edip engelleyebilir. Bu [filtreleme modu][link-config-parameters] yerel veya genel ayarlarla tanımlanır:

* **Local settings (default)**: bu mod, ayarları filtre düğümü yapılandırma dosyasından kullanır.
* **Safe blocking**: [gri listeye alınmış IP'lerden](../ip-lists/overview.md) gelen tüm kötü amaçlı istekler engellenir.
* **Monitoring**: tüm istekler işlenir, ancak bir saldırı tespit edilse bile hiçbiri engellenmez.
* **Blocking**: bir saldırının tespit edildiği tüm istekler engellenir.

## Oturum kapatma yönetimi

[Yöneticiler](users.md#user-roles) şirket hesabı için oturum kapatma zaman aşımlarını yapılandırabilir. Ayarlar, hesapta bulunan tüm kullanıcıları etkiler. Boşta kalma ve mutlak zaman aşımları ayarlanabilir.