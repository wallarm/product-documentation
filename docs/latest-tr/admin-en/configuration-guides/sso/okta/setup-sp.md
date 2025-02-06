[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

#   Adım 1: Wallarm Tarafında Parametrelerin Oluşturulması (Okta)

Okta ile SSO'yu bağlamak için önce Wallarm tarafında bazı parametreler oluşturmanız gerekecektir.

!!! warning "Önce Wallarm tarafında SSO hizmetini etkinleştirin"
    Varsayılan olarak, ilgili hizmet etkinleştirilmediği sürece Wallarm üzerindeki SSO bağlantısı mümkün değildir. SSO hizmetini etkinleştirmek için lütfen hesap yöneticiniz veya [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.

    Hizmet etkinleştirildikten sonra aşağıdaki SSO bağlantı prosedürünü gerçekleştirebilirsiniz.

Yönetici hesabınızı kullanarak Wallarm Console'a giriş yapın ve **Settings → Integration → Okta SSO** adımlarını izleyerek Okta entegrasyonu ayarlarına geçin.

![The “Okta SSO” block][img-okta-sso-provider-wl]

Bu işlem SSO yapılandırma sihirbazını açacaktır. Sihirbazın ilk adımında, Okta hizmetine iletilmesi gereken parametreleri (hizmet sağlayıcının meta verileri) içeren bir form karşınıza çıkacaktır:
*   **Wallarm Entity ID**, Wallarm uygulaması tarafından kimlik sağlayıcı için oluşturulan benzersiz uygulama tanımlayıcısıdır.
*   **Assertion Consumer Service URL (ACS URL)**, kimlik sağlayıcının SamlResponse parametresi ile istek gönderdiği Wallarm tarafındaki uygulama adresidir.

![Service provider's metadata][img-sp-metadata]

Oluşturulan parametrelerin, Okta hizmet tarafındaki ilgili alanlara girilmesi gerekecektir (bkz. [Adım 2][doc-setup-idp]).