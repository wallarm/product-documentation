[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# Adım 1: Wallarm Tarafında Parametrelerin Oluşturulması (G Suite)

SSO'yu G Suite ile bağlamak için öncelikle Wallarm tarafında bazı parametreler oluşturmanız gerekecektir.

!!! uyarı "Önce Wallarm tarafında SSO hizmetini aktifleştirin"
    Varsayılan olarak, Wallarm'da SSO bağlantısı uygun hizmeti aktifleştirmeden kullanılamaz. SSO hizmetini aktifleştirmek için, lütfen hesap yöneticinizle ya da [Wallarm destek ekibiyle](mailto:support@wallarm.com) iletişime geçin.

    Hizmeti aktifleştirdikten sonra aşağıdaki SSO bağlantı işlemini gerçekleştirebileceksiniz.

Yönetici hesabınızı kullanarak Wallarm Console'a giriş yapın ve **Ayarlar → Entegrasyon → Google SSO** yolunu izleyerek G Suite entegrasyon ayarlarına devam edin.

![“Google SSO” bloğu][img-gsuite-sso-provider-wl]

Bu, SSO yapılandırma sihirbazını açacaktır. Sihirbazın ilk adımında, G Suite hizmetine yönlendirilmesi gereken parametreler (hizmet sağlayıcının metadatası) ile bir form ile karşılaşacaksınız:
*   **Wallarm Entity ID** , kimlik sağlayıcı için Wallarm uygulaması tarafından oluşturulan benzersiz bir uygulama tanımlayıcısıdır.
*   **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcının SamlResponse parametreli talepleri gönderdiği uygulamanın Wallarm tarafındaki adresidir.

![Hizmet sağlayıcının metadatası][img-sp-metadata]

Oluşturulan parametreler, G Suite hizmetinin ilgili alanlarına girilmesi gerekecektir (bkz. [Adım 2][doc-setup-idp]).