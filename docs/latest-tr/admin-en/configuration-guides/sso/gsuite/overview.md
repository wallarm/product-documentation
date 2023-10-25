# G Suite ile SSO Bağlantısı Kurma

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

Bu rehber, [G Suite][link-gsuite] (Google) hizmetini bir kimlik sağlayıcı olarak Wallarm'a, servis sağlayıcı olarak hareket eden, bağlama sürecini kapsar.

!!! not
    Varsayılan olarak, Wallarm'da SSO bağlantısı, uygun hizmeti etkinleştirmeden kullanılamaz. SSO hizmetini etkinleştirmek için lütfen hesap yöneticinizle veya [Wallarm destek ekibiyle](mailto:support@wallarm.com) iletişime geçin.
    
    Hizmeti etkinleştirdikten sonra
    
    *   aşağıdaki SSO bağlantı prosedürünü gerçekleştirebilecek ve
    *   SSO ile ilgili bloklar "Entegrasyonlar" sekmesinde görünür olacak.
    
   Bunun yanı sıra, Hem Wallarm hem de G Suite için yönetim haklarına sahip hesaplara ihtiyacınız var.

G Suite ile SSO bağlantısını kurma süreci aşağıdaki adımlardan oluşur:
1.  [Wallarm Tarafında Parametreleri Oluşturma.][doc-setup-sp]
2.  [G Suite'de Bir Uygulama Oluşturma ve Yapılandırma.][doc-setup-idp]
3.  [G Suite Metaverilerini Wallarm Kurulum Sihirbazına Aktarma.][doc-metadata-transfer]
4.  [G Suite Tarafındaki Wallarm Uygulamasına Erişime İzin Verme][doc-allow-access-to-wl]

Bundan sonra, Wallarm kullanıcıları için [SSO kimlik doğrulamasını yapılandırın][doc-employ-sso].