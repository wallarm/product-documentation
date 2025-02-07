# LDAP Kullanımı

Şirketiniz zaten bir LDAP çözümü kullanıyorsa, Wallarm portalına şirket kullanıcılarınızı doğrulamak için LDAP teknolojisini kullanabilirsiniz. Bu makale, dizin hizmetinizle LDAP entegrasyonunun nasıl yapılandırılacağını anlatmaktadır.

## Genel Bakış

Şirketinizin mevcut kullanıcı yönetim sistemleri ([directory services](https://en.wikipedia.org/wiki/Directory_service#LDAP_implementations)) ile [Microsoft Active Directory (AD)](https://learn.microsoft.com/en-us/entra/architecture/auth-ldap) gibi sistemlerle kesintisiz entegrasyon sağlamak amacıyla, Wallarm bu tür sistemlerle LDAP protokolü üzerinden entegrasyonu destekler. Bu entegrasyon sayesinde:

* Şirket kullanıcılarınıza, Wallarm Console'da önceden kayıt olmadan, dizin hizmetinizde saklanan kimlik bilgilerini kullanarak giriş yapabilme imkânı sağlanır.
* Kullanıcı rolleri ve izinleriniz dizin hizmetinizden Wallarm Console'a aktarılır.
* Dizin hizmetinizin desteklediği veri şifrelemesi kullanılabilir.

## Gereksinimler

* LDAP yapılandırması, etkinleştirilene kadar kullanılamaz. Etkinleştirme için [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.
* LDAP veya SSO üzerinden kimlik doğrulamasını aynı anda kullanamazsınız. LDAP yapılandırması yapmak için öncelikle varsa SSO'yu kaldırın.
* LDAP’nizde, kullanıcıların aşağıdaki özniteliklere sahip olmaları gerekmektedir: 

    * `displayName`
    * `mail` veya `email` (özelleştirilebilir)

* Gruplar ise:

    * `groupOfNames` veya `groupOfUniqueNames` olmalıdır.
    * `member` özniteliğine sahip olmalıdır.

## Kurulum

[Gereksinimler](#gereksinimler) karşılanıyorsa, Wallarm Console içerisinde **Integrations** → **LDAP** → **LDAP** bölümünde LDAP entegrasyonunu yapılandırabilirsiniz.

![LDAP entegrasyonunun yapılandırılması](../../../images/admin-guides/configuration-guides/ldap/configuring-ldap.png)

LDAP entegrasyonunda, LDAP gruplarını Wallarm’daki [kullanıcı rollerine](../../../user-guides/settings/users.md#user-roles) eşleştirmeniz gerekmektedir. En az bir LDAP grubunu eşleştirmeniz gerekir ve gerekirse dilediğiniz kadar ekleyebilirsiniz.

!!! info "LDAP grup DN"
    **LDAP grup adı** olarak, grup DN'si kullanın. Örneğin: 
    
    `cn=wallarm_partner_admin,ou=groups,dc=users,dc=example,dc=com`

Temel seçenekler olarak şunları ayarlayın: 

* **LDAP Server** bölümünde LDAP sunucu URL'si ve portu.
* **Base DN**: Temel dağıtım adı.
* **Bind DN** ve parola: LDAP sunucusuna bağlanmak için kullanılan LDAP hiyerarşisindeki nesnenin tam adı. Bu, parolayla birlikte sağlanmalıdır.
* **Email attribute name**, kullanıcının e-posta adresinin saklanması gereken alanın LDAP sunucusundaki adını belirtir.
* Kimlik doğrulama türü `Simple` olarak ayarlanır ve değiştirilemez.
* SSL/TLS şifrelemesi kullanılacaksa, ilgili sertifika ve özel anahtar değerlerini yapıştırarak yapılandırın.