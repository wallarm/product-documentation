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

Ekip üyelerinizi Wallarm hesabınıza davet edin ve her birine hassas bilgileri korumak ve hesap üzerindeki eylemleri sınırlandırmak için belirli bir rol atayın. Kullanıcıları **Settings** → **Users** bölümünden yönetin.

Yalnızca **Administrator** ve **Global Administrator** rolleri kullanıcı yönetimi ayrıcalıklarına sahiptir.

## Kullanıcı rolleri

Wallarm müşterilerinin kullanıcıları aşağıdaki rollere sahip olabilir:

* Tüm Wallarm ayarlarına erişimi olan **Administrator**.
* Ana Wallarm ayarlarını görüntüleme, saldırılar, [olaylar][link-glossary-incident] ve [zafiyetler][link-glossary-vulnerability] hakkında bilgileri yönetme erişimi olan **Analyst**.
* Ana Wallarm ayarlarını görüntüleme erişimi olan **Read Only**.
* [API Discovery](../../api-discovery/overview.md) modülü tarafından keşfedilen API envanterini görüntüleme ve indirme erişimi olan **API Developer**. Bu rol, görevleri yalnızca şirket API’lerine ilişkin güncel verileri elde etmek için Wallarm’ı kullanmayı gerektiren kullanıcıları ayırt etmeyi sağlar. Bu kullanıcıların **API Discovery**, onun dashboard’ı ve **Settings → Profile** dışında herhangi bir Wallarm Console bölümüne erişimi yoktur.
* `addnode` betiğini kullanarak Wallarm filtreleme düğümleri oluşturmaya erişimi olan ve Wallarm Console’a erişimi olmayan **Deploy**.

    !!! warning "Wallarm node 4.0’ı kurmak için Deploy rolünün kullanılması"
        **Deploy** kullanıcı rolünün, yalnızca 3.6 ve altı sürümlerdeki düğümlerin kurulumu için kullanılması önerilir çünkü [`addnode` betiği 4.0 sürümünde kullanım dışı bırakılmıştır](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

[Çok kiracılılık](../../installation/multi-tenant/overview.md) özelliği ayrıca **Global Administrator**, **Global Analyst**, **Global Read Only** gibi global rolleri kullanmanızı sağlar. Global roller kullanıcılara teknik tenant hesabına ve bağlantılı tenant hesaplarına erişim sağlarken, normal roller yalnızca teknik tenant hesabına erişim sağlar.

Farklı kullanıcı rollerinin Wallarm varlıklarına erişimi hakkında daha ayrıntılı bilgi aşağıdaki tabloda verilmiştir. Varlık yönetimi; varlık oluşturma, düzenleme ve silmeyi kapsar.

| Varlık              | Administrator / Global Administrator | Analyst / Global Analyst | Read Only / Global Read Only | API Developer |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **Filtering nodes**       | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Dashboard**       | Görüntüle                                 | Görüntüle                     | Görüntüle                         | - |
| **Attacks**          | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **Incidents**          | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **API Sessions**          | Görüntüle ve yönet                      | Görüntüle          | Görüntüle                         | - |
| **Vulnerabilities** | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle              | - |
| **API inventory by API Discovery**   | Görüntüle ve yönet                      | Görüntüle ve yönet          | -                            | Görüntüle ve indir |
| **API Specifications**   | Görüntüle ve yönet                      | Görüntüle          | Görüntüle                            | Görüntüle |
| **Triggers**        | Görüntüle ve yönet                      | -                        | -                            | - |
| **IP lists**       | Görüntüle, yönet ve dışa aktar             | Görüntüle, yönet ve dışa aktar | Görüntüle ve dışa aktar              | - |
| **Rules**           | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **Credential Stuffing Detection**           | Görüntüle ve yönet                      | Görüntüle ve yönet          | Görüntüle                         | - |
| **BOLA protection**           | Görüntüle ve yönet                      | Görüntüle          | - | - |
| **Security Edge**    | Görüntüle ve yönet                      | Görüntüle                        | -                            | - |
| **Integrations**    | Görüntüle ve yönet                      | -                        | -                            | - |
| **Filtration mode**        | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Applications**    | Görüntüle ve yönet                      | Görüntüle                     | Görüntüle                         | - |
| **Users**           | Görüntüle ve yönet                      | -                        | Görüntüle                         | - |
| **API tokens**           | Kişisel ve paylaşılan token’ları yönet | Kişisel token’ları yönet | - | - |
| **Activity log**    | Görüntüle                                 | -                        | Görüntüle                         | - |

## Kullanıcıları davet etme

Hesabınıza bir kullanıcı eklemenin iki yolu vardır; her ikisi de bir davet bağlantısı oluşturmayı ve paylaşmayı içerir. Wallarm’ın davet bağlantısını belirtilen kullanıcının e-posta adresine otomatik olarak göndermesini sağlayabilir veya bağlantıyı doğrudan kullanıcıyla paylaşabilirsiniz.

### Otomatik e-posta daveti

Bu yöntem için, kullanıcının rolünü, e-postasını ve adlarını önceden ayarlayın; Wallarm, belirttiğiniz e-posta adresine giriş yapma ve parola belirleme bağlantısını içeren bir davet e-postası gönderecektir. Kullanıcı, kayıt işlemini tamamlamak için bağlantıyı izlemelidir.

Davet bağlantısını otomatik olarak göndermek için **Add user** düğmesine tıklayın ve formu doldurun:

![Yeni kullanıcı formu][img-add-user]

Formu gönderdikten sonra kullanıcı, kullanıcı listenize eklenecek ve davet bağlantısını içeren bir e-posta alacaktır.

### Manuel davet bağlantısı paylaşımı

**Invite by link** seçeneğini kullanarak ekip üyenizin e-postasını, rolünü ve bağlantının geçerlilik süresini seçip bir davet bağlantısı oluşturun. Ardından bu bağlantıyı ilgili kullanıcıyla paylaşın.

![Yeni kullanıcı davet bağlantısı][img-add-user-invitation-link]

Bu bağlantı, kullanıcının bir parola seçip adını girerek hesabını oluşturacağı Wallarm kayıt sayfasına yönlendirir.

Kayıt sonrasında, kullanıcılar listenize eklenecek ve bir doğrulama e-postası alacaktır.

## SSO ile otomatik oluşturma

Wallarm Console kullanıcılarını ve izinlerini doğrudan SAML SSO çözümünüzden yönetebilirsiniz. Bu durumda, SAML SSO çözümünüzde Wallarm rollerine eşlenmiş gruplar bulunur - bu gruplar içinde yeni kullanıcılar oluşturduğunuzda, kullanıcılar Wallarm’da otomatik olarak oluşturulur ve şu hakları alır:

* Karşılık gelen Wallarm rolü.
* SSO kimlik bilgileriyle Wallarm Console’a anında erişim.
* Rol tarafından belirtilen izinler.

Bunun çalışması için, [burada](../../admin-en/configuration-guides/sso/setup.md#step-4-saml-sso-solution-configure-provisioning) açıklandığı gibi Wallarm ile SAML SSO çözümünüz arasında **provisioning** seçeneği etkin olacak şekilde entegrasyon yapılandırmanız gerekir.

## Kullanıcı ayarlarını değiştirme

Bir kullanıcı kullanıcı listesinde göründüğünde, ilgili kullanıcı menüsünden **Edit user settings** seçeneğini kullanarak ayarlarını düzenleyebilirsiniz. Bu sayede atanan kullanıcı rolünü, adını ve soyadını değiştirebilirsiniz.

## 2FA yönetimi

### Tüm kullanıcılar için zorunlu kılma

Tüm şirket kullanıcıları için iki faktörlü kimlik doğrulamayı (2FA) zorunlu kılabilirsiniz. Bunun için:

1. Wallarm Console’u açın → **Settings** → **General**.
1. **Sign-in management** bölümünde, **Enforce two-factor authentication for all company users** seçeneğini işaretleyin ve onaylayın.

![2FA - Tüm şirket kullanıcıları için etkinleştirme](../../images/user-guides/settings/2fa-enforce.png)

Etkinleştirildiğinde, şirket hesabınızdaki tüm kullanıcılar, atlama seçeneği olmadan giriş yapabilmeden önce 2FA’yı kurmak zorunda kalacaktır: bir sonraki girişlerinde 2FA’nın zorunlu kılındığı bildirilecek ve 2FA yapılandırma seçenekleri sunulacaktır. Ancak, bu seçeneğin etkinleştirilmesi mevcut kullanıcı oturumlarını etkilemez.

Zorunlu kılma modunu daha sonra dilediğiniz zaman devre dışı bırakabilirsiniz. Devre dışı bıraktıktan sonra, kullanıcılar bilgilendirilmez ve [kendileri](account.md#enabling-two-factor-authentication) veya [siz (yönetici)](#disabling-for-selected-users) bu kullanıcı için manuel olarak devre dışı bırakana kadar 2FA’yı kullanmaya devam ederler.

### Seçili kullanıcılar için devre dışı bırakma

Bir kullanıcıda [iki faktörlü kimlik doğrulama (2FA) etkinse](account.md#enabling-two-factor-authentication) ve bunu sıfırlamanız gerekiyorsa, kullanıcı menüsünden **Disable 2FA** seçeneğini belirleyin. Eylemi, Wallarm yönetici hesabı parolanızı girerek onaylayın. [2FA zorunlu kılma modu](#enforcing-for-all-users) etkin olduğunda, tek tek kullanıcılar için 2FA’yı devre dışı bırakamazsınız.

![Kullanıcı işlem menüsü][img-user-menu-disable-2fa]

Bu işlem, seçili kullanıcı için 2FA’yı devre dışı bırakacaktır. Kullanıcı, profil ayarları üzerinden 2FA’yı yeniden etkinleştirebilir.

## Kullanıcıları devre dışı bırakma ve silme

* Bir kullanıcının hesabını silmeden Wallarm hesabına oturum açma yeteneğini geçici olarak askıya almak için adının yanındaki **Disable access** seçeneğini kullanın. Bu işlem, kullanıcıyı ana kullanıcı listesinde gri renkte işaretler ve **Disabled** sekmesinde listeler. Hesaplarını yeniden etkinleştirmek için **Enable access** seçeneğini belirleyin; böylece tekrar oturum açıp Wallarm’a erişebilirler.
* Kalıcı olarak kaldırmak ve giriş erişimini tamamen iptal etmek için kullanıcı menüsünden **Delete** kullanıcısını seçin. Bu işlem onları kullanıcı listesinden kalıcı olarak kaldırır ve geri alınamaz.

## Yeni kullanıcı uyarıları

**User added** koşuluyla bir [tetikleyici](../triggers/triggers.md) ayarlayarak Wallarm hesabınıza yeni kullanıcılar eklendiğinde anında uyarılar alın. Yalnızca belirli roller veya herhangi bir yeni kullanıcı eklemesi hakkında bildirim almayı seçebilirsiniz.

Bu bildirimlerle ilgilenen ekip üyeleri kendi tetikleyicilerini kendileri ayarlamalıdır.

**Tetikleyici örneği: Slack’e yeni kullanıcı uyarıları**

Wallarm Console’da şirket hesabına **Administrator** veya **Analyst** rolüne sahip yeni bir kullanıcı eklendiyse, bu olay hakkında bildirim, entegrasyonda belirtilen e-posta adresine ve Slack kanalına gönderilecektir.

![Slack’e ve e-posta ile bildirim gönderen tetikleyici örneği](../../images/user-guides/triggers/trigger-example2.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Settings** → **Users** bölümünü açın ve yeni bir kullanıcı ekleyin.
2. E-posta Gelen Kutunuzu açın ve aşağıdaki mesajın geldiğini kontrol edin:

    ![Yeni kullanıcı eklendiğine dair e-posta](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack kanalını açın ve aşağıdaki bildirimin **wallarm** kullanıcısından geldiğini kontrol edin:

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` ve `johnsmith@example.com` eklenen kullanıcıya ilişkin bilgilerdir
    * `Analyst` eklenen kullanıcının rolüdür
    * `John Doe` ve `johndoe@example.com` yeni kullanıcıyı ekleyen kullanıcıya ilişkin bilgilerdir
    * `Added user` tetikleyicinin adıdır
    * `TestCompany`, Wallarm Console’daki şirket hesabınızın adıdır
    * `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud’dur

## Oturum kapatma yönetimi

**Administrator** ve **Global Administrator** [roller](users.md#user-roles), şirket hesabı için oturum kapatma zaman aşımı sürelerini **Settings** → **General** bölümünde ayarlayabilir. Ayarlar tüm hesap kullanıcılarını etkiler. Boşta kalma ve mutlak zaman aşımı süreleri ayarlanabilir.

![General sekmesi](../../images/user-guides/settings/general-tab.png)