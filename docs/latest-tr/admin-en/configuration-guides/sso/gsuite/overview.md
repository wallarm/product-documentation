```markdown
#   G Suite ile SSO Bağlantısı

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

Bu kılavuz, Wallarm'ın servis sağlayıcı olarak hizmet verdiği duruma, [G Suite][link-gsuite] (Google) hizmetini kimlik sağlayıcı olarak bağlama sürecini kapsar.

!!! not
    Varsayılan olarak Wallarm'da, uygun servisi etkinleştirmeden SSO bağlantısı mevcut değildir. SSO servisini etkinleştirmek için lütfen hesap yöneticiniz veya [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.
    
    Servis etkinleştirildikten sonra:
    
    *   aşağıdaki SSO bağlantı prosedürünü uygulayabilir ve
    *   “Integrations” sekmesinde SSO ile ilgili blokları görebilirsiniz.
    
    Ayrıca, Wallarm ve G Suite için yönetim yetkisine sahip hesaplara sahip olmanız gerekmektedir.

G Suite ile SSO bağlantısı süreci aşağıdaki adımları içerir:
1.  [Wallarm Tarafında Parametre Oluşturma.][doc-setup-sp]
2.  [G Suite'de Bir Uygulama Oluşturma ve Yapılandırma.][doc-setup-idp]
3.  [G Suite Metadata'sının Wallarm Kurulum Sihirbazına Aktarılması.][doc-metadata-transfer]
4.  [G Suite Tarafında Wallarm Uygulamasına Erişime İzin Verme.][doc-allow-access-to-wl]

Bunun ardından, Wallarm kullanıcıları için [SSO kimlik doğrulamasını yapılandırın][doc-employ-sso].
```