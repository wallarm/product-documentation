# LDAP Kullanımı

Şirketiniz halihazırda bir LDAP çözümü kullanıyorsa, Wallarm Console'da şirket kullanıcılarınızı kimlik doğrulamak için LDAP teknolojisini kullanabilirsiniz. Bu makale, dizin hizmetinizle LDAP entegrasyonunun nasıl yapılandırılacağını açıklar.

## Genel Bakış

Şirketinizin [dizin hizmetleri](https://en.wikipedia.org/wiki/Directory_service#LDAP_implementations) gibi mevcut kullanıcı yönetim sistemleriyle (ör. [Microsoft Active Directory (AD)](https://learn.microsoft.com/en-us/entra/architecture/auth-ldap)) sorunsuz entegrasyon sağlamak için Wallarm, bu tür sistemlerle LDAP protokolü aracılığıyla entegrasyonu destekler. Bu entegrasyon şunları yapmanıza olanak tanır:

* Şirketinizin kullanıcılarının, dizin hizmetinizde saklanan kimlik bilgilerini kullanarak, Wallarm Console'da daha önce kayıt olmalarına gerek kalmadan Wallarm Console'a oturum açabilmesini sağlamak.
* Dizin hizmetinizden kullanıcı rolleri ve izinlerini Wallarm Console'a iletmek.
* Dizin hizmetiniz tarafından desteklenen veri şifrelemesini kullanmak.

## Gereksinimler

* LDAP yapılandırması etkinleştirilene kadar kullanılamaz; etkinleştirme için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.
* Kimlik doğrulama için yalnızca LDAP veya SSO'dan birini kullanabilirsiniz; ikisini birden kullanamazsınız. LDAP'ı yapılandırmak için, eğer etkinse önce SSO'yu kaldırın.
* Güvenlik duvarınızın, Wallarm IP'lerinden gelen istekleri kabul edecek şekilde yapılandırılmış olması gerekir:

    --8<-- "../include/wallarm-cloud-ips.md"

* LDAP ortamınızda, kullanıcıların aşağıdaki özniteliklere sahip olması gerekir: 

    * `displayName`
    * `mail` veya `email` (özelleştirilebilir)

* Gruplar şunları sağlamalıdır: 

    * `groupOfNames` veya `groupOfUniqueNames` olmalıdır 
    * `member` özniteliğine sahip olmalıdır

## Kurulum

Eğer [gereksinimler](#requirements) karşılanıyorsa, LDAP entegrasyonunu Wallarm Console içinde Integrations → LDAP → LDAP bölümünden yapılandırabilirsiniz.

![LDAP entegrasyonunun yapılandırılması](../../../images/admin-guides/configuration-guides/ldap/configuring-ldap.png)

LDAP entegrasyonunda, Wallarm içinde LDAP gruplarını [user roles](../../../user-guides/settings/users.md#user-roles) ile eşlemeniz gerekir. En az bir LDAP grubunu eşlemelisiniz ve gerektiği kadar ek eşleme ekleyebilirsiniz.

!!! info "LDAP grup DN'si"
    **LDAP group name** için grup DN'sini kullanın, örneğin: 
    
    `cn=wallarm_partner_admin,ou=groups,dc=users,dc=example,dc=com`

Temel seçenekler olarak şunları ayarlayın: 

* LDAP sunucu URL'sini ve portunu **LDAP Server** içinde belirtin.
* Temel distinguished name **Base DN**.
* **Bind DN** ve parola: LDAP sunucusuna bağlanmak (connect) için kullanılan LDAP hiyerarşisindeki bir nesnenin tam adı. Parola ile birlikte verilmelidir.
* **Email attribute name**, kullanıcı e-postasının LDAP sunucusunda saklanacağı alanın adını belirtir.
* Kimlik doğrulama tipi `Simple` olarak ayarlanmıştır ve değiştirilemez.
* SSL/TLS şifrelemesi kullanılacaksa, ilgili sertifika ve özel anahtar değerlerini yapıştırarak yapılandırın.