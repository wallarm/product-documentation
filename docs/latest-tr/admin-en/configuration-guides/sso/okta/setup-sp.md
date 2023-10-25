[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# Adım 1: Wallarm Tarafında Parametrelerin Oluşturulması (Okta)

SSO'yu Okta ile bağlamak için ilk olarak Wallarm tarafında bazı parametreler oluşturmanız gerekecektir.

!!! uyarı "SSO hizmetini öncelikle Wallarm tarafında etkinleştirin"
    Varsayılan olarak, Wallarm'da SSO bağlantısı, uygun hizmeti etkinleştirmeden mevcut değildir. SSO hizmetini etkinleştirmek için lütfen hesap yöneticinizle veya [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

    Hizmeti etkinleştirdikten sonra aşağıdaki SSO bağlantı işlemine devam edebilirsiniz.

Yönetici hesabınız kullanarak Wallarm Konsolu'na giriş yapın ve **Ayarlar → Entegrasyon → Okta SSO** adımlarını izleyerek Okta entegrasyon ayarlarına geçin.

![“Okta SSO” bloğu][img-okta-sso-provider-wl]

Bu, SSO konfigürasyon sihirbazını açar. Sihirbazın ilk adımında, Okta hizmetine geçirilmesi gereken parametreler (hizmet sağlayıcının metaverileri) ile bir form sunulacaktır:
*   **Wallarm Entity ID**, kimlik sağlayıcı için Wallarm uygulaması tarafından oluşturulan benzersiz bir uygulama tanımlayıcısıdır.
*   **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcının SamlResponse parametresi ile talepler gönderdiği Wallarm tarafında uygulamanın adresidir.

![Hizmet sağlayıcının metaverileri][img-sp-metadata]

Oluşturulan parametreler, Okta hizmet tarafında karşılık gelen alanlara girilmelidir (bkz. [Adım 2][doc-setup-idp]).