#   Okta ile SSO'ya Bağlanma

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

Bu kılavuz, hizmet sağlayıcı olarak Wallarm'ın kimlik sağlayıcı hizmeti [Okta][link-okta] ile nasıl bağlantı kurulacağına dair süreci kapsar.

!!! not

    Varsayılan olarak, Wallarm'da SSO bağlantısı, uygun hizmeti etkinleştirmediğiniz sürece mevcut değildir. SSO hizmetini etkinleştirmek için lütfen hesap yöneticinize veya [Wallarm destek ekibine](mailto:support@wallarm.com) başvurun.
    
    Hizmeti etkinleştirdikten sonra
    
    *   aşağıdaki SSO bağlantı prosedürünü gerçekleştirebilirsiniz, ve
    *   "Entegrasyonlar" sekmesinde SSO ile ilgili bloklar görünecektir.
    
    Ayrıca, hem Wallarm hem de Okta için yönetim haklarına sahip hesaplara ihtiyacınız var.

Okta ile SSO'ya bağlanma süreci aşağıdaki adımları içerir:
1.  [Wallarm Tarafında Parametrelerin Oluşturulması.][doc-setup-sp]
2.  [Okta'da Bir Uygulamanın Oluşturulması ve Yapılandırılması.][doc-setup-idp]
3.  [Okta Metaverisi'nin Wallarm Kurulum Sihirbazına Aktarılması.][doc-metadata-transfer]
4.  [Okta Tarafından Wallarm Uygulamasına Erişimin Sağlanması][doc-allow-access-to-wl]

Bundan sonra, Wallarm kullanıcıları için [SSO kimlik doğrulamasını yapılandırın.][doc-employ-sso]