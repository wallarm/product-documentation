# G Suite ile SSO Bağlantısı

[img-gsuite-console]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[link-gsuite-adm-console]:  https://admin.google.com
[img-sp-wizard-transfer-metadata]:  ../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png

Bu kılavuz, hizmet sağlayıcı olarak hareket eden Wallarm’a kimlik sağlayıcı olarak [G Suite](https://gsuite.google.com/) (Google) hizmetinin bağlanması sürecini kapsar.

Adımları tamamlamak için hem Wallarm hem de G Suite tarafında yönetici haklarına sahip hesaplara ihtiyacınız vardır.

## Adım 1 (Wallarm): SSO servisini etkinleştirin

Varsayılan olarak, Wallarm’da kimlik doğrulama için SSO servisi etkin değildir, buna karşılık gelen bloklar Wallarm Console içindeki **Integrations** bölümünde görünmez.

SSO servisini etkinleştirmek için [Wallarm support team](https://support.wallarm.com/) ile iletişime geçin. Varsayılan olarak [sağlama](#step-4-g-suite-configure-provisioning-part-1) ile SSO önerilecektir:

* Etkinleştirdikten sonra hiçbir kullanıcı giriş ve parola ile kimlik doğrulaması yapamayacaktır. Gerekirse geri dönüş hesabı (fallback account) talep edin - bu hesap giriş/parola kullanımını sürdürecektir.
* Kullanıcılar Wallarm tarafında devre dışı bırakılamaz veya silinemez.
* [Birden fazla tenant](../../../installation/multi-tenant/overview.md) kullanıyorsanız, Okta ile [tenant dependent permissions](intro.md#tenant-dependent-permissions) seçeneğini kullanabilirsiniz; bununla ilgili kararı Wallarm desteği ile birlikte verin.

## Adım 2 (Wallarm): Metadata oluşturun

G Suite tarafında girmek üzere Wallarm metadata’sına ihtiyacınız var:

1. Wallarm Console’da **Integrations** → **SSO SAML AUTHENTICATION** yoluna gidin ve **Google SSO** yapılandırmasını başlatın.

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO yapılandırma sihirbazında, **Send details** adımında, G Suite servisine iletilmesi gereken Wallarm metadata’sını görüntüleyin.

    ![Wallarm metadata’sı](../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png)

    * **Wallarm Entity ID**, kimlik sağlayıcı için Wallarm uygulaması tarafından oluşturulan benzersiz uygulama tanımlayıcısıdır.
    * **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcının SamlResponse parametresiyle istekleri gönderdiği uygulamanın Wallarm tarafındaki adresidir.

1. Metadata’yı kopyalayın veya XML olarak kaydedin. 

## Adım 3 (G Suite): Uygulamayı yapılandırın

G Suite’te uygulamayı yapılandırmak için:

1. Google [admin console][link-gsuite-adm-console] içine giriş yapın. 
1. **Apps** bölümüne gidin.

    ![G Suite yönetici konsolu][img-gsuite-console]

1. **SAML apps** → **Add a service/App to your domain** öğesine tıklayın.
1. **Setup my own custom app** öğesine tıklayın.

    ![G Suite’e yeni bir uygulama ekleme][img-gsuite-add-app]

    Size G Suite metadata’sı sağlanacaktır:

    * **SSO URL**
    * **Entity ID**
    * **Certificate** (X.509)

1. Metadata’yı kopyalayın veya XML olarak kaydedin. 
1. **Next**’e tıklayın.

    ![Metadata’yı kaydetme][img-fetch-metadata]

1. Wallarm metadata’sını girin. Zorunlu alanlar:

    * **ACS URL** = Wallarm içindeki **Assertion Consumer Service URL** parametresi.
    * **Entity ID** = Wallarm içindeki **Wallarm Entity ID** parametresi.

1. Gerekirse kalan parametreleri doldurun ve **Next**’e tıklayın.

    ![Hizmet sağlayıcı bilgilerini doldurma][img-fill-in-sp-data]

1. **Finish**’e tıklayın. Oluşturulan uygulamanın sayfasına yönlendirileceksiniz.

    ![G Suite’te uygulama sayfası][img-app-page]

1. G Suite kullanıcılarına oluşturulan uygulamaya erişim verin: **Edit Service** → **Service status** → **ON for everyone** yolunu izleyin.
1. Değişiklikleri kaydedin.

## Adım 4 (G Suite): Sağlamayı yapılandırma - bölüm 1

**Provisioning**, SAML SSO çözümünden (G Suite) Wallarm’a verilerin otomatik aktarımıdır: G Suite kullanıcılarınız ve onların grup üyelikleri Wallarm’a erişimi ve oradaki izinleri belirler; tüm kullanıcı yönetimi G Suite tarafında gerçekleştirilir.

Bunun çalışması için öznitelik eşlemesini sağlayın:

1. G Suite uygulamasında, **Add new mapping** aracılığıyla şunları eşleyin:

    * `email`
    * `first_name`
    * `last_name`
    * kullanıcı grubu/gruplarını `wallarm_roles` etiketine

    ![SAML SSO çözümü - G Suite - Eşleme](../../../images/admin-guides/configuration-guides/sso/simple-sso-mapping.png)

1. Değişiklikleri kaydedin.

    Sağlama yapılandırmasına Wallarm tarafında [adım 6](#step-6-wallarm-configure-provisioning-part-2) ile devam edilecektir.

## Adım 5 (Wallarm): G Suite metadata’sını girin

1. Wallarm Console’da, SSO yapılandırma sihirbazında **Upload metadata** adımına ilerleyin.
1. Şunlardan birini yapın:

    * G Suite metadata’sını XML dosyası olarak yükleyin.

        ![Metadata yükleme][img-sp-wizard-transfer-metadata]

    * Metadata’yı aşağıdaki şekilde elle girin:

        * **SSO URL** → **Identity provider SSO URL**
        * **Entity ID** → **Identity provider issuer**
        * **Certificate** → **X.509 Certificate**

            ![Metadata’yı elle girme][img-transfer-metadata-manually]


## Adım 6 (Wallarm): Sağlamayı yapılandırma - bölüm 2

1. **Roles mapping** adımına ilerleyin.
1. Bir veya birkaç SSO grubunu Wallarm rollerine eşleyin. Kullanılabilir roller:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)

        Tüm rol açıklamalarını [burada](../../../user-guides/settings/users.md#user-roles) görebilirsiniz.

    ![SSO gruplarının Wallarm rollerine eşlenmesi - Wallarm’da eşleme](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

1. SSO yapılandırma sihirbazını tamamlayın. Wallarm, verilerin G Suite’iniz ile karşılıklı aktarılabilir olduğunu test edecektir.