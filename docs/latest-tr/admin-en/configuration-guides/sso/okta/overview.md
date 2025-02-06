# Okta ile SSO Bağlantısı

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

Bu rehber, kimlik sağlayıcı olarak [Okta][link-okta] servisini, hizmet sağlayıcı olarak görev yapan Wallarm ile bağlama işlemini kapsayacaktır.

!!! note

    Varsayılan olarak, Wallarm üzerinde SSO bağlantısı uygun hizmet etkinleştirilmeden kullanılamaz. SSO hizmetini etkinleştirmek için lütfen hesap yöneticiniz veya [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.
    
    Hizmet etkinleştirildikten sonra,
    
    *   aşağıdaki SSO bağlantı prosedürünü gerçekleştirebileceksiniz ve
    *   SSO ile ilgili bloklar “Integrations” sekmesinde görünecektir.
    
    Ayrıca, Wallarm ve Okta için yönetici haklarına sahip hesaplara sahip olmanız gerekmektedir.

SSO'nun Okta ile bağlanma süreci aşağıdaki adımlardan oluşmaktadır:
1.  [Wallarm Tarafında Parametrelerin Oluşturulması.][doc-setup-sp]
2.  [Okta'da Bir Uygulamanın Oluşturulması ve Yapılandırılması.][doc-setup-idp]
3.  [Okta Metadata'sının Wallarm Kurulum Sihirbazına Aktarılması.][doc-metadata-transfer]
4.  [Okta Tarafında Wallarm Uygulamasına Erişime İzin Verme][doc-allow-access-to-wl]

Bunun ardından, Wallarm kullanıcıları için [SSO kimlik doğrulamasını yapılandırın][doc-employ-sso].