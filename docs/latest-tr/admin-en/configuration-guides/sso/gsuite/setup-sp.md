[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

#   Adım 1: Wallarm Tarafında Parametre Oluşturma (G Suite)

G Suite ile SSO'yu bağlamak için, önce Wallarm tarafında bazı parametreler oluşturmanız gerekecektir.

!!! warning "Önce Wallarm tarafında SSO hizmetini etkinleştirin"
    Varsayılan olarak, ilgili hizmet etkinleştirilmeden Wallarm'da SSO bağlantısı kullanılamaz. SSO hizmetini etkinleştirmek için, lütfen hesap yöneticiniz veya [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.

    Hizmeti etkinleştirdikten sonra aşağıdaki SSO bağlantı prosedürünü gerçekleştirebileceksiniz.

Yönetici hesabınızı kullanarak Wallarm Console'a giriş yapın ve **Settings → Integration → Google SSO** yolunu izleyerek G Suite entegrasyon ayarlarına geçin.

![“Google SSO” bloğu][img-gsuite-sso-provider-wl]

Bu işlem, SSO yapılandırma sihirbazını açacaktır. Sihirbazın ilk adımında, G Suite servisine iletilmesi gereken parametreler (hizmet sağlayıcısının metadata'sı) içeren bir form sunulacaktır:
*   **Wallarm Entity ID**, kimlik sağlayıcısı için Wallarm uygulaması tarafından oluşturulan benzersiz uygulama tanımlayıcısıdır.
*   **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcısının SamlResponse parametresiyle birlikte istek gönderdiği Wallarm tarafındaki uygulama adresidir.

![Hizmet sağlayıcısının metadata'sı][img-sp-metadata]

Oluşturulan parametrelerin, G Suite hizmeti tarafındaki ilgili alanlara girilmesi gerekecektir (bkz. [Adım 2][doc-setup-idp]).