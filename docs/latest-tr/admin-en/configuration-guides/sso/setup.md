# SAML SSO Kimlik Doğrulama Kurulumu

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png
[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

Bu makale, Wallarm'ın [SAML SSO Kimlik Doğrulaması](intro.md) özelliğini etkinleştirme ve yapılandırmanın genel akışını açıklar.

[G Suite](sso-gsuite.md) ve [Okta](sso-okta.md) SAML SSO çözümlerine ait örneklerle de tanışabilirsiniz.

## Adım 1: SSO hizmetini etkinleştirin

Varsayılan olarak, Wallarm'da kimlik doğrulama için SSO hizmeti aktif değildir; ilgili bloklar Wallarm Console içindeki **Integrations** bölümünde görünmez.

SSO hizmetini etkinleştirmek için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin. Varsayılan olarak [provizyon](#step-4-saml-sso-solution-configure-provisioning) ile SSO önerilir:

* Etkinleştirmeden sonra hiçbir kullanıcı giriş ve parola ile kimlik doğrulaması yapamaz. Gerekli ise yedek hesap talep edin - bu hesap giriş/parola kullanımını sürdürür.
* Kullanıcılar Wallarm tarafında devre dışı bırakılamaz veya silinemez.

## Adım 2 (Wallarm): Metaveri oluşturun

SAML SSO çözümü tarafına girmek üzere Wallarm metaverilerine ihtiyacınız var:

1. Wallarm Console'a yönetici ayrıcalıklarıyla giriş yaptığınızdan emin olun.
1. Wallarm Console'da **Integrations** → **SSO SAML AUTHENTICATION** bölümüne gidin ve uygun entegrasyonu başlatın.

    Google, Okta veya başka bir (**Custom**) SAML SSO çözümünü entegre edebilirsiniz. Aynı anda yalnızca bir SSO entegrasyonunun aktif olabileceğini unutmayın.

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO yapılandırma sihirbazında, **Send details** adımında, SAML SSO çözümünüze gönderilecek metaverileri gözden geçirin.
1. Metaverileri kopyalayın veya XML olarak kaydedin.
1. SAML SSO çözümü SSO veri alışverişi için ek doğrulama gerektiriyorsa, [**Extended security**](#extended-security) onay kutusunu seçin.

## Adım 3 (SAML SSO çözümü): Uygulamayı yapılandırın

1. SAML SSO çözümünüze giriş yapın.
1. Wallarm'a erişim sağlayacak uygulamayı yapılandırın.
1. Uygulamanın metaverilerini kopyalayın veya XML olarak kaydedin.
1. Uygulamanın etkinleştirildiğinden ve kullanıcıların uygulamaya erişimi olduğundan emin olun.

## Adım 4 (SAML SSO çözümü): Provizyonu yapılandırın

**Provizyon**, SAML SSO çözümünden Wallarm'a verilerin otomatik aktarımıdır: SAML SSO çözümünüze ait kullanıcılar ve grup üyelikleri Wallarm'a erişimi ve oradaki izinleri belirler; tüm kullanıcı yönetimi SAML SSO çözümü tarafında gerçekleştirilir.

Bunun çalışması için, öznitelik eşlemesini sağlayın:

1. Wallarm'a erişim sağlayan uygulamada aşağıdaki öznitelikleri eşleyin:

    * `email`
    * `first_name`
    * `last_name`
    * kullanıcı grubunu(gruplarını) `wallarm_role:[role]` özniteliğine; burada `role` şunlardan biridir:

        * `admin` (**Administrator**)
        * `analytic` (**Analyst**)
        * `api_developer` (**API Developer**)
        * `auditor` (**Read Only**)
        * `partner_admin` (**Global Administrator**)
        * `partner_analytic` (**Global Analyst**)
        * `partner_auditor` (**Global Read Only**)

            ![Integrations - SSO, Okta'da eşleme örneği](../../../images/admin-guides/configuration-guides/sso/okta/wallarm-sso-okta-mapping.png)

            Tüm rol açıklamalarını [burada](../../../user-guides/settings/users.md#user-roles) bulabilirsiniz.

            SAML SSO çözümünüz grupları farklı özniteliklere eşlemeyi desteklemiyorsa, tüm grupları `wallarm_roles` etiketine eşleyin (Google örneğindeki [durum](sso-gsuite.md#step-4-g-suite-configure-provisioning-part-1) gibi) ve ardından grupları rollere Wallarm tarafında eşleyin - [6. adıma](#step-6-wallarm-configure-provisioning-optional) bakın.

            !!! warning "Geçersiz kılma seçeneği"
                **different permissions in different tenants** seçeneği etkinse, grupların rollere eşlenmesi [farklı](#tenant-dependent-permissions) yapılandırılır ve temel eşlemeyi [geçersiz kılar](#override-general-sso-mapping).

1. Değişiklikleri kaydedin.

**Provizyonu kapatma**

Provizyon seçeneğini [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçerek kapatabilirsiniz. Kapalıysa, SAML SSO çözümünüzde bulunan kullanıcılar için Wallarm'da karşılık gelen kullanıcıları oluşturmanız gerekir. Kullanıcı rollerinin de Wallarm Console'da tanımlanması gerekir.

Provizyon kapalıyken kullanıcıları elle oluşturmalı, rolleri atamalı ve SSO ile giriş yapması gereken kullanıcıları seçmelisiniz - kalanlar giriş/parola kullanır. Talebiniz üzerine, Wallarm desteği ayrıca tüm şirket hesabı kullanıcıları için tek seferde SSO kimlik doğrulamasını etkinleştiren **Strict SSO** seçeneğini de açabilir. Strict SSO'nun diğer özellikleri:

* Hesabın mevcut tüm kullanıcıları için kimlik doğrulama yöntemi SSO'ya çevrilir.
* Tüm yeni kullanıcılar varsayılan olarak kimlik doğrulama yöntemi olarak SSO'yu alır.
* Herhangi bir kullanıcı için kimlik doğrulama yöntemi SSO dışındaki bir şeye değiştirilemez.

Provizyon kapalıyken kullanıcı yönetimi Wallarm Console → **Settings** → **Users** bölümünde [burada](../../../user-guides/settings/users.md) açıklandığı şekilde gerçekleştirilir. SAML SSO çözümü ile eşleme yalnızca `email` özniteliğini kullanır.

## Adım 5 (Wallarm): SSO SAML çözümü metaverilerini girin

1. Wallarm Console'da, SSO yapılandırma sihirbazında **Upload metadata** adımına ilerleyin.
1. Aşağıdakilerden birini yapın:

    * G Suite metaverilerini bir XML dosyası olarak yükleyin.
    * Metaverileri manuel olarak girin.

## Adım 6 (Wallarm): Provizyonu yapılandırın (isteğe bağlı)

Bu adım yalnızca SAML SSO çözümünüz grupları farklı özniteliklere eşlemeyi desteklemiyorsa ve tüm gruplar `wallarm_roles` etiketine eşlenmişse (Google örneğindeki [durum](sso-gsuite.md#step-4-g-suite-configure-provisioning-part-1) gibi) uygulanmalıdır.

1. **Roles mapping** adımına ilerleyin.
1. Bir veya birkaç SSO grubunu Wallarm rollerine eşleyin. Mevcut roller:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)

        Tüm rol açıklamalarını [burada](../../../user-guides/settings/users.md#user-roles) bulabilirsiniz.

    ![SSO gruplarını Wallarm rollerine eşleme - Wallarm'da eşleme](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

1. SSO yapılandırma sihirbazını tamamlayın. Wallarm, SAML SSO Çözümünüzden/Çözümünüze veri aktarımının artık mümkün olup olmadığını test edecektir.

## Genişletilmiş güvenlik

SAML SSO çözümünüz (Keycloak veya Okta gibi), Wallarm dahil uygulamalarla bağlantı kurulurken ek güvenlik doğrulaması gerektirebilir. Buna şunlar dahil olabilir:

* SAML istek ve yanıtlarının imza ile doğrulanmasına yönelik gereksinimler
* SAML istek ve yanıtlarının şifrelenmesine yönelik gereksinimler

Bu tür bir SAML SSO çözümü ile entegrasyonu sağlamak için Wallarm, **Extended security** özelliğine sahiptir. Kullanımı:

1. Wallarm'da, [**Generate metadata**](#step-2-wallarm-generate-metadata) adımında **Extended security** seçeneğini seçin.
1. Metaverileri XML olarak kaydedin; sertifika verileri ve SAML SSO çözümünüz için uygun yapılandırma buna eklenecektir.
1. SAML SSO çözümünde, [**Configure application**](#step-3-saml-sso-solution-configure-application) adımında, sağlanan XML'i içe aktararak tüm seçeneklerin otomatik olarak doğru şekilde yapılandırılmasını sağlayın. Aşağıda Keycloak örneğine bakın.

    ![Genişletilmiş güvenlik - Keycloak örneği](../../../images/admin-guides/configuration-guides/sso/sso-extended-security-keycloak-example.png)

## Kiracıya bağlı izinler

[**different permissions in different tenants**](intro.md#tenant-dependent-permissions) seçeneği etkinse, bu izinleri aşağıdaki gibi yapılandırın:

1. Wallarm Console'a **Global administrator** olarak giriş yaptığınızdan emin olun.
1. **Settings** → **Groups** bölümüne gidin.
1. **Add group**'a tıklayın ve SAML SSO çözümü grup adınıza bağlayın.
1. Rolü ayarlayın, **Add**'e tıklayın.

    ![SSO, different permissions in different tenants, grup oluşturma](../../../images/admin-guides/configuration-guides/sso/sso-iam-group-create.png)

    Grup oluşturulur ve gruplar listesinde görüntülenir.

1. Grup menüsünden **Edit group settings** seçeneğini belirleyin.
1. Grup sayfanız görüntülenir. Kiracı listesini ayarlayın.

    ![SSO, different permissions in different tenants, gruba kiracı ekleme](../../../images/admin-guides/configuration-guides/sso/sso-iam-group-tenants.png)

    Bunun sonucunda SAML SSO çözümü grubunuzun kullanıcıları, belirtilen izinler (rol) setiyle listelenen kiracılara erişebilecek.

1. Başka bir grup ekleyin ve aynı SAML SSO çözümü grup adına bağlayın.
1. Farklı bir rol belirleyin.
1. Farklı bir kiracı listesi belirleyin.

    Bunun sonucunda SAML SSO çözümü grubunuzun kullanıcıları, bu diğer kiracılara farklı bir izin setiyle (başka bir rol) erişebilecek.

**Yalnızca belirli kiracılara erişim**: Farklı SAML SSO çözümü gruplarındaki kullanıcıların yalnızca belirli kiracılara ve diğerlerine değil erişmesini de yapılandırabilirsiniz.

Aynı SAML SSO kullanıcısı farklı izinlerle aynı kiracıya erişim sağlayan birden fazla gruba aitse, daha geniş izin uygulanır.

!!! info "Yöneticileriniz"

    Bazı SAML SSO çözümü gruplarınızdaki kullanıcılar için Wallarm'a (tüm kiracılar) ayrıcalıklı (yönetimsel) erişim sağlamak istiyorsanız, Wallarm Console'da SSO yapılandırma sihirbazında **Roles mapping** adımına ilerleyin ve SSO grubunuzu(gruplarınızı) **Global administrator** rolüne bağlayın.
    
    Bu SAML SSO çözümü grubundaki kullanıcıların, başka herhangi bir SAML SSO çözümü grubuna dahil olsalar bile, herhangi bir şekilde kısıtlanamayacağını unutmayın.

    ![SSO, different permissions in different tenants, global administrator istisnası](../../../images/admin-guides/configuration-guides/sso/sso-iam-global-administrators.png)

<a name="override-general-sso-mapping"></a>**Genel eşlemeyi geçersiz kılma**

Etkin **different permissions in different tenants** seçeneğinin [genel eşleme](#step-4-saml-sso-solution-configure-provisioning)yi geçersiz kıldığını unutmayın; örneğin:

* `Analytic` gruplarınızı genel olarak `wallarm_role:analytic` ile eşlemiş ve 5 kiracınız varsa, daha sonra **different permissions in different tenants** seçeneğini etkinleştirirseniz, `Analytic` grubunun kullanıcıları siz **Groups** oluşturup yönetene kadar herhangi bir kiracıya erişimi kaybeder (genel eşleme artık yok sayılır).
* Daha sonra `Analytic` gruplarına 5 kiracıdan 3'üne erişim sağlayan grubu oluşturursanız, diğer 2 kiracı onlara erişilebilir olmayacaktır (genel eşleme yok sayılır).
* Bazı gruplardaki kullanıcılara tüm kiracılara yönetici olmayan erişim sağlamak istiyorsanız, [teknik kiracı hesabına](../../../installation/multi-tenant/overview.md#tenant-accounts) erişim için **Global something** rolüne sahip bir grup oluşturun.

## Devre dışı bırakma ve silme

**Integrations** bölümünde SSO'yu yalnızca [provizyon](#step-4-saml-sso-solution-configure-provisioning) kapalıyken devre dışı bırakabilir ve silebilirsiniz. Kapatmak için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin.