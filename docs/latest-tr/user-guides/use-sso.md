[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/


#   Wallarm portalına Tek Oturum Açma Kullanarak Giriş Yapma

Bu kılavuz, Tek Oturum Açma (SSO) teknolojisini kullanarak Wallarm portalında kullanıcı doğrulama sürecini ele alacaktır.

!!! info "Ön Koşullar"
    SSO doğrulaması etkinleştirildiyse ve hesabınızın rolü *Admin* değilse, artık Wallarm portalına giriş yapmak için yalnızca SSO doğrulamasını kullanabilirsiniz.
    
    Bu kılavuz, [Okta][link-okta] veya [G Suite][link-gsuite] gibi kimlik sağlayıcılarından biriyle zaten bir hesabınız olduğunu varsayar. Aksi takdirde, lütfen yöneticinizle iletişime geçin.

SSO kullanarak doğrulama yapmak için, Wallarm giriş sayfasına gidin.

Eğer Wallarm'a giriş yapmak için `<some_domain>.wallarm.com` gibi bir adres (örn. `my.wallarm.com`) kullanıyorsanız, o zaman SSO ile giriş yapmak için *Sign in with SAML SSO* bağlantısına tıklamanız gerekmektedir (giriş/şifre ikilisi öncelikli kabul edilir).

![The “login/password” pair login page][img-basic-auth]

Eğer Wallarm'e, hesabınızın ait olduğu şirkete tahsis edilen `<company_domain>.wallarm.io` gibi bir adres kullanarak giriş yapıyorsanız, o zaman öncelikli giriş yöntemi SSO girişidir ve giriş formu yukarıda verilen formdan farklı olacaktır.

![SSO login form][img-sso-login-form]

SSO kullanarak Wallarm'a giriş yapmak için, e-posta adresinizi girmeniz gerekmektedir.

Girilen e-posta kayıtlıysa ve SSO doğrulaması için yapılandırılmışsa, Okta veya G Suite gibi bir kimlik sağlayıcı (IdP) hizmetine yönlendirileceksiniz. Eğer bu sağlayıcı tarafından yetkilendirilmezseniz, giriş sayfasına geri yönlendirileceksiniz. Aşağıda Okta ve G Suite hizmetlerinin giriş sayfaları gösterilmiştir.

![Okta and G Suite login pages][img-idp-auth-pages]

E-posta adresinizi ve parolanızı (iki faktörlü doğrulama gibi ek seçeneklerle) girin. Kimlik sağlayıcı tarafından başarılı bir doğrulama gerçekleştirildikten ve talep edilen kaynağa (Wallarm) erişim hakları doğrulandıktan sonra, sağlayıcı sizi Wallarm portalına yönlendirir. Aynı zamanda, sağlayıcı, sizin meşru bir kullanıcı olduğunuzu onaylayan ve diğer gerekli parametreleri içeren bir isteği Wallarm tarafına gönderir. Bu şekilde, Wallarm portalına giriş yapmış olursunuz ve gösterge paneli sayfası açılır.

![Wallarm portal's Dashboard][img-wl-dashboard]

Bu adım, SSO doğrulama sürecini tamamlar.