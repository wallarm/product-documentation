#   Okta ile SSO’yu Bağlama

[link-okta]:                        https://www.okta.com/
[img-dashboard]:            ../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm
[img-transfer-metadata-manually]:   ../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-sp-metadata]:              ../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png
[img-assignments]:  ../../../images/admin-guides/configuration-guides/sso/okta/assignments.png

Bu kılavuz, [Okta][link-okta] hizmetinin kimlik sağlayıcı (IdP) olarak, hizmet sağlayıcı (SP) rolündeki Wallarm’a bağlanması sürecini kapsar.

Adımları tamamlamak için hem Wallarm hem de Okta üzerinde yönetici haklarına sahip hesaplara ihtiyacınız vardır.

## Adım 1 (Wallarm): SSO hizmetini etkinleştirin

Varsayılan olarak, Wallarm’da kimlik doğrulama için SSO hizmeti etkin değildir; Wallarm Console içindeki **Integrations** bölümünde ilgili bloklar görünmez.

SSO hizmetini etkinleştirmek için [Wallarm destek ekibi](https://support.wallarm.com/) ile iletişime geçin. [sağlama](#step-4-okta-configure-provisioning) ile SSO varsayılan olarak önerilir:

* Etkinleştirdikten sonra hiçbir kullanıcı kullanıcı adı ve parola ile kimlik doğrulaması yapamaz. Gerekirse yedek hesap talep edin – bu, kullanıcı adı/parola girişi imkânını korur.
* Wallarm tarafında hiçbir kullanıcı devre dışı bırakılamaz veya silinemez.
* [Birden fazla kiracınız](../../../installation/multi-tenant/overview.md) varsa, Okta ile [kiracıya bağlı izinler](intro.md#tenant-dependent-permissions) seçeneğini kullanabilirsiniz; buna Wallarm desteğiyle birlikte karar verin.

## Adım 2 (Wallarm): Metadata üretin

!!! info "Genişletilmiş güvenlik"
    Okta‑to‑Wallarm bağlantınız için ek güvenlik doğrulaması kullanmak istiyor veya zorunluysanız, bu adımda mevcut olan [Extended security](setup.md#extended-security) seçeneğini kullanmayı düşünün.

Okta tarafında girmeniz için Wallarm metadata’sına ihtiyacınız var:

1. Wallarm Console’da **Integrations** → **SSO SAML AUTHENTICATION** bölümüne gidin ve **Okta SSO** yapılandırmasını başlatın.

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO yapılandırma sihirbazında, **Send details** adımında Okta hizmetine iletilmesi gereken Wallarm metadata’sını gözden geçirin.

    ![Wallarm metadata’sı][img-sp-metadata]

    * **Wallarm Entity ID**, kimlik sağlayıcı için Wallarm uygulaması tarafından oluşturulan benzersiz uygulama tanımlayıcısıdır.
    * **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcının SamlResponse parametresiyle istekleri gönderdiği, uygulamanın Wallarm tarafındaki adresidir.

1. Metadata’yı kopyalayın veya XML olarak kaydedin.

## Adım 3 (Okta): Uygulamayı yapılandırın

Okta’da uygulamayı yapılandırmak için:

1. Okta’ya yönetici olarak giriş yapın.
1. **Applications** → **Applications** → **Create App Integration** seçeneğine tıklayın.

    ![Okta panosu][img-dashboard]

1. **Sign‑on method** → “SAML 2.0” olarak ayarlayın.
1. Devam edin ve **Create SAML Integration** sihirbazında **App Name** ve isteğe bağlı olarak **App logo** gibi genel entegrasyon ayarlarını yapın.

    ![Genel ayarlar][img-general]

1. Devam edin ve Wallarm metadata’sını girin. Zorunlu alanlar:

    *   **Single sign‑on URL** = Wallarm’daki **Assertion Consumer Service URL (ACS URL)**.
    *   **Audience URI (SP Entity ID)** = Wallarm’daki **Wallarm Entity ID**.

        ![SAML yapılandırma][img-saml]

1. İsteğe bağlı olarak, [Okta belgelerinde][link-okta-docs] açıklanan diğer parametreleri ayarlayın.

    ![SAML ayarları önizlemesi][img-saml-preview]

1.  Devam edin ve **Are you a customer or partner** değerini "I'm an Okta customer adding an internal app" olarak ayarlayın.
1. İsteğe bağlı olarak, diğer parametreleri ayarlayın.

    ![Geri bildirim formu][img-feedback]

1. **Finish**’e tıklayın. Oluşturulan uygulamanın sayfasına yönlendirileceksiniz.
1. Okta metadata’sını almak için **Sign On** sekmesine gidin ve aşağıdakilerden birini yapın:

    * **Identity Provider metadata**’ya tıklayın ve görüntülenen verileri XML olarak kaydedin.
    * **View Setup instructions**’a tıklayın ve görüntülenen verileri kopyalayın.

1. **Applications** → **Applications** → **Assign Users to App** yolunu izleyerek ve kullanıcıları uygulamaya atayarak, oluşturulan uygulamaya Okta kullanıcılarının erişimini sağlayın.

    ![Uygulamaya kullanıcı atama][img-assignments]

## Adım 4 (Okta): Sağlamayı yapılandırın

**Provisioning**, SAML SSO çözümünden (Okta) Wallarm’a verilerin otomatik aktarımıdır: Okta kullanıcılarınız ve onların grup üyelikleri, Wallarm’a erişimi ve oradaki izinleri belirler; tüm kullanıcı yönetimi Okta tarafında gerçekleştirilir.

Bunun çalışması için, öznitelik eşlemesi sağlayın:

1. Okta uygulamasında, **Applications** → **Applications** → **General** → **SAML Settings (Edit)** → **Next** adımlarına tıklayın.

1. Öznitelik ifadelerini eşleyin:

    * email - user.email
    * first_name - user.firstName
    * last_name user.lastName

1. Kullanıcı gruplarını `wallarm_role:[role]` değerine eşleyin; burada `role`:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)
    
        Tüm rol açıklamalarını [buradan](../../../user-guides/settings/users.md#user-roles) görebilirsiniz.

    ![Integrations - SSO, Okta’da eşleme](../../../images/admin-guides/configuration-guides/sso/okta/wallarm-sso-okta-mapping.png)

1. Değişiklikleri kaydedin.

## Adım 5 (Wallarm): Okta metadata’sını girin

1. Wallarm Console’da, SSO yapılandırma sihirbazında **Upload metadata** adımına ilerleyin.
1. Aşağıdakilerden birini yapın:

    * Okta metadata’sını bir XML dosyası olarak yükleyin.
    * Metadata’yı aşağıdaki gibi manuel girin:
    
        *   **Identity Provider Single Sign‑On URL** → **Identity provider SSO URL**.
        *   **Identity Provider Issuer** → **Identity provider issuer**.
        *   **X.509 Certificate** → **X.509 Certificate** alanı.
    
            ![Metadata’yı manuel girme][img-transfer-metadata-manually]
    
1. SSO yapılandırma sihirbazını tamamlayın. Wallarm, verilerin Okta’nızla artık alınıp gönderilemediğini test edecektir.

## Adım 6 (Wallarm): Sağlamayı yapılandırın (ATLAYIN)

Okta için, Wallarm tarafındaki bu adım atlanmalıdır.

![SSO gruplarının Wallarm rollerine eşlenmesi - Wallarm’da eşleme](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

Bir sonraki adıma geçin ve SSO yapılandırma sihirbazını tamamlayın. Wallarm, verilerin SAML SSO Çözümünüzle artık alınıp gönderilemediğini test edecektir.