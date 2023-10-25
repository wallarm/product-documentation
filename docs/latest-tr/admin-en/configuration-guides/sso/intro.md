# SAML SSO çözümü ile entegrasyonun genel bakışı

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

Şirketinizin kullanıcılarını Wallarm portalına doğrulamak için Tekli Oturum Açma (SSO) teknolojisini kullanabilirsiniz, eğer şirketiniz zaten bir [SAML][link-saml] SSO çözümü kullanıyorsa.

Wallarm, SAML standardını destekleyen herhangi bir çözümle entegre olabilir. SSO rehberleri, [Okta][doc-admin-sso-okta] veya [Google Suite (G Suite)][doc-admin-sso-gsuite] örneğini kullanarak entegrasyonu anlatır.

Wallarm'ın SSO ile yapılandırılması ve işletilmesi ile ilgili belgeler, aşağıdaki durumları varsayar:
*   Wallarm bir **hizmet sağlayıcı** (SP) olarak hareket eder.
*   Google veya Okta bir **kimlik sağlayıcı** (IdP) olarak hareket eder.

SAML SSO'daki rollerle ilgili daha fazla bilgi burada bulunabilir ([PDF][link-saml-sso-roles]).

!!! uyarı "SSO servisini etkinleştirme"
    Varsayılan olarak, Wallarm'da SSO bağlantısı, uygun servisi etkinleştirmeden kullanılamaz. SSO servisini etkinleştirmek için lütfen hesap yöneticinizle veya [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.
     
    Eğer hiç SSO servisi etkinleştirilmemiş ise, Wallarm Konsolundaki **Entegrasyonlar** bölümünde SSO ile ilgili bloklar görünmez.