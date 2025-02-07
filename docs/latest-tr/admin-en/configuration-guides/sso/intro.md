# SAML SSO çözümü ile entegrasyon genel bakış

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

Şirketiniz zaten bir [SAML][link-saml] SSO çözümü kullanıyorsa, şirket kullanıcılarınızı Wallarm portalına kimlik doğrulaması yapmaları için Tek Oturum Açma (SSO) teknolojisini kullanabilirsiniz.

Wallarm, SAML standardını destekleyen herhangi bir çözümle entegre edilebilir. SSO kılavuzları, örnek olarak [Okta][doc-admin-sso-okta] veya [Google Suite (G Suite)][doc-admin-sso-gsuite] kullanılarak entegrasyonu açıklamaktadır.

Wallarm'ın SSO ile yapılandırılması ve çalışmasıyla ilgili belgeler aşağıdakileri varsayar:
*   Wallarm, **hizmet sağlayıcı** (SP) olarak hareket eder.
*   Google veya Okta, **kimlik sağlayıcı** (IdP) olarak hareket eder.

SAML SSO kapsamındaki roller hakkında daha fazla bilgiye buradan ulaşabilirsiniz ([PDF][link-saml-sso-roles]).

!!! warning "SSO hizmetinin etkinleştirilmesi"
    Wallarm üzerinde SSO bağlantısı, uygun hizmet etkinleştirilmediği sürece varsayılan olarak mevcut değildir. SSO hizmetini etkinleştirmek için, lütfen hesap yöneticiniz veya [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.
    
    Eğer SSO hizmeti etkinleştirilmemişse, Wallarm Console'daki **Entegrasyonlar** bölümünde SSO ile ilgili bloklar görünmeyecektir.