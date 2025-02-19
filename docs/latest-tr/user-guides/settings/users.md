[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-add-user-invitation-link]: ../../images/user-guides/settings/invite-user-by-link.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# Kullanıcıları Yönetme

Wallarm hesabınıza takım üyelerinizi davet edin ve her birine belirli bir rol atayarak hassas bilgileri koruyun ve hesap işlemlerini sınırlandırın. Kullanıcıları **Settings** → **Users** altında yönetin.

Yalnızca **Administrator** ve **Global Administrator** rollerinin kullanıcı yönetimi ayrıcalıkları vardır.

## Kullanıcı Rolleri

Wallarm müşterilerindeki kullanıcılar aşağıdaki rollere sahip olabilir:

* **Administrator**: Tüm Wallarm ayarlarına erişim sağlar.
* **Analyst**: Temel Wallarm ayarlarını görüntüleme, saldırılar, [incidents][link-glossary-incident] ve [vulnerabilities][link-glossary-vulnerability] ile ilgili bilgileri yönetme erişimi sağlar.
* **Read Only**: Temel Wallarm ayarlarını görüntüleme erişimi sağlar.
* **API Developer**: [API Discovery](../../api-discovery/overview.md) modülü tarafından keşfedilen API envanterini görüntüleme ve indirme erişimi sağlar. Bu rol, yalnızca şirket API'leri hakkında gerçek verilere ulaşmak için Wallarm kullanan kullanıcıları ayırt etmenizi sağlar. Bu kullanıcıların, **API Discovery**, onun panosu ve **Settings → Profile** dışında Wallarm Console’un diğer bölümlerine erişimi yoktur.
* **Deploy**: Wallarm filtreleme düğümlerini `addnode` script'i ile oluşturma erişimi sağlar, ancak Wallarm Console'a erişimi yoktur.

    !!! warning "Using the Deploy role to install the Wallarm node 4.0"
        **Deploy** kullanıcı rolünün yalnızca 3.6 ve altı düğümlerin kurulumu için kullanılması önerilir; çünkü [`addnode` script, 4.0 sürümünde kullanımdan kaldırılmıştır](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

[multitenancy](../../installation/multi-tenant/overview.md) özelliği ayrıca **Global Administrator**, **Global Analyst**, **Global Read Only** gibi küresel rolleri kullanmanızı sağlar. Küresel roller, kullanıcılara teknik tenant hesabına ve bağlantılı tenant hesaplarına erişim sağlarken, normal roller yalnızca teknik tenant hesabına erişim imkânı sunar.

Aşağıdaki tabloda, farklı kullanıcı rollerinin Wallarm varlıklarına erişimi hakkında daha ayrıntılı bilgi verilmiştir. Varlık yönetimi, varlık oluşturma, düzenleme ve silmeyi kapsar.

| Varlık                                        | Administrator / Global Administrator | Analyst / Global Analyst       | Read Only / Global Read Only  | API Developer        |
|-----------------------------------------------|----------------------------------------|--------------------------------|-------------------------------|----------------------|
| **Filtering nodes**                           | Görüntüle ve yönet                     | Görüntüle                      | Görüntüle                     | -                    |
| **Dashboard**                                 | Görüntüle                              | Görüntüle                      | Görüntüle                     | -                    |
| **Attacks**                                   | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **Incidents**                                 | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **API Sessions**                              | Görüntüle ve yönet                     | Görüntüle                      | Görüntüle                     | -                    |
| **Vulnerabilities**                           | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **API inventory by API Discovery**            | Görüntüle ve yönet                     | Görüntüle ve yönet             | -                             | Görüntüle ve indir   |
| **API Specifications**                        | Görüntüle ve yönet                     | Görüntüle                      | Görüntüle                     | Görüntüle            |
| **Scanner**                                   | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **Triggers**                                  | Görüntüle ve yönet                     | -                              | -                             | -                    |
| **IP lists**                                  | Görüntüle, yönet ve dışa aktar         | Görüntüle, yönet ve dışa aktar | Görüntüle ve dışa aktar       | -                    |
| **Rules**                                     | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **Credential Stuffing Detection**             | Görüntüle ve yönet                     | Görüntüle ve yönet             | Görüntüle                     | -                    |
| **BOLA protection**                           | Görüntüle ve yönet                     | Görüntüle                      | -                             | -                    |
| **Security Edge**                             | Görüntüle ve yönet                     | Görüntüle                      | -                             | -                    |
| **Integrations**                              | Görüntüle ve yönet                     | -                              | -                             | -                    |
| **Filtration mode**                           | Görüntüle ve yönet                     | Görüntüle                      | Görüntüle                     | -                    |
| **Applications**                              | Görüntüle ve yönet                     | Görüntüle                      | Görüntüle                     | -                    |
| **Users**                                     | Görüntüle ve yönet                     | -                              | Görüntüle                     | -                    |
| **API tokens**                                | Kişisel ve paylaşılan tokenları yönet    | Kişisel tokenları yönet        | -                             | -                    |
| **Activity log**                              | Görüntüle                              | -                              | Görüntüle                     | -                    |

## Bir Kullanıcıyı Davet Etmek

Hesabınıza bir kullanıcı eklemenin iki yolu vardır; her ikisi de bir davet bağlantısı oluşturmayı ve paylaşmayı içerir. Wallarm, davet bağlantısını kullanıcının belirtilen e-posta adresine otomatik olarak gönderebilir veya bağlantıyı doğrudan kullanıcıyla paylaşabilirsiniz.

### Otomatik E-posta Daveti

Bu yöntem için, kullanıcının rolünü, e-posta adresini ve adını önceden ayarlayın; Wallarm, belirtilen e-posta adresine giriş yapıp şifre belirlemesi için bir bağlantı içeren davet e-postasını otomatik olarak gönderecektir. Kullanıcının kayıt işlemini tamamlamak için bağlantıyı takip etmesi gerekir.

Davet bağlantısını otomatik olarak göndermek için **Add new user** düğmesine tıklayın ve formu doldurun:

![New user form][img-add-user]

Form gönderildikten sonra, kullanıcı kullanıcı listenize eklenecek ve davet bağlantısını içeren bir e-posta alacaktır.

### Manuel Davet Bağlantısı Paylaşımı

Takım üyenizin e-posta adresini, rolünü ve bağlantının süresini **Invite by link** seçeneğini kullanarak belirleyip bir davet bağlantısı oluşturun. Sonrasında, bu bağlantıyı hedef kullanıcıyla paylaşın.

![New user inv link][img-add-user-invitation-link]

Bu bağlantı, kullanıcının şifre belirleyip adını girerek hesabını oluşturması için onu Wallarm kayıt sayfasına götürür.

Kayıt işleminden sonra, kullanıcı listenize eklenecek ve bir onay e-postası alacaktır.

## Kullanıcı Ayarlarını Değiştirme

Kullanıcı listesinde bir kullanıcı göründüğünde, ilgili kullanıcı menüsünden **Edit user settings** seçeneğini kullanarak ayarlarını düzenleyebilirsiniz. Bu, atanan kullanıcı rolünü, adını ve soyadını değiştirmenizi sağlar.

## 2FA'yı Devre Dışı Bırakma

Bir kullanıcının [iki faktörlü kimlik doğrulaması (2FA)](account.md#enabling-two-factor-authentication) etkinleştirilmişse ve bunu sıfırlamanız gerekiyorsa, kullanıcı menüsünden **Disable 2FA** seçeneğini seçin. İşlemi onaylamak için Wallarm administrator hesabı şifrenizi girin.

![User actions menu][img-user-menu-disable-2fa]

Bu işlem, seçili kullanıcı için 2FA'yı devre dışı bırakacaktır. Kullanıcı, profil ayarlarından 2FA'yı yeniden etkinleştirebilir.

## Kullanıcıların Devre Dışı Bırakılması ve Silinmesi

* Bir kullanıcının Wallarm hesabı giriş yeteneğini, hesap bilgilerini silmeden geçici olarak askıya almak için, isminin yanındaki **Disable access** seçeneğini kullanın. Bu işlem, ana kullanıcı listesindeki kullanıcıyı gri renkle işaretler ve **Disabled** sekmesi altında listeler. Kullanıcının hesabını yeniden etkinleştirmek için **Enable access** seçeneğini seçin; böylece kullanıcı tekrar giriş yapıp Wallarm'a erişebilir.
* Kalıcı kaldırma ve sonsuza dek giriş erişimini iptal etmek için, kullanıcı menüsünden **Delete** user seçeneğini seçin. Bu işlem, kullanıcıyı kalıcı olarak listeden siler ve geri alınamaz.

## Yeni Kullanıcı Uyarıları

Wallarm hesabınıza yeni kullanıcı eklendiğinde anında uyarı almak için, **User added** koşuluna sahip bir [trigger](../triggers/triggers.md) ayarlayın. Belirli roller veya herhangi bir yeni kullanıcı eklemesi hakkında bildirim almayı seçebilirsiniz.

Bu bildirimlerle ilgilenen takım üyelerinin kendi trigger'larını ayarlamaları gerekir.

**Trigger örneği: Slack'e yeni kullanıcı uyarıları**

Eğer Wallarm Console'daki şirket hesabına **Administrator** veya **Analyst** rolüne sahip yeni bir kullanıcı eklenirse, bu etkinlik hakkında bildirim entegrasyonda belirtilen e-posta adresine ve Slack kanalına gönderilecektir.

![Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**Trigger'ı test etmek için:**

1. Wallarm Console → **Settings** → **Users** bölümünü açın ve yeni bir kullanıcı ekleyin.
2. E-posta gelen kutunuzu açın ve aşağıdaki mesajı aldığınızı kontrol edin:

    ![Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack kanalını açın ve **wallarm** kullanıcısından gelen aşağıdaki bildirimi aldığınızı kontrol edin:

    ```
    [Wallarm] Trigger: New user was added to the company account

    Notification type: create_user

    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` ve `johnsmith@example.com` eklenen kullanıcıyla ilgili bilgidir.
    * `Analyst` eklenen kullanıcının rolüdür.
    * `John Doe` ve `johndoe@example.com` yeni kullanıcı ekleyen kullanıcı hakkında bilgidir.
    * `Added user` trigger adıdır.
    * `TestCompany`, Wallarm Console'daki şirket hesabınızın adıdır.
    * `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud'dur.

## Çıkış Yönetimi

**Administrator** ve **Global Administrator** [rollerindeki](users.md#user-roles) kullanıcılar, **Settings** → **General** bölümünde şirket hesabı için oturum kapatma zaman aşımı ayarlayabilir. Bu ayarlar tüm hesap kullanıcılarını etkileyecektir. Hem boşta kalma hem de mutlak zaman aşımı ayarlanabilir.

![General tab](../../images/user-guides/settings/general-tab.png)