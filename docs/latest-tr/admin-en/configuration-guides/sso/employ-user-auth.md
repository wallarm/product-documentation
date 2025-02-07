# Kullanıcılar İçin SSO Kimlik Doğrulamasını Yapılandırma

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

Wallarm portal kullanıcıları için SSO kimlik doğrulamasını [etkinleştirebilir][anchor-enable] veya [devre dışı bırakabilirsiniz][anchor-disable].


## Kullanıcılar İçin SSO Kimlik Doğrulamasını Etkinleştirme

!!! warning
    *   Kullanıcılar için SSO kimlik doğrulaması etkinleştirildiğinde, giriş/parola ile oturum açma mekanizması ve iki faktörlü kimlik doğrulaması kullanılamaz. SSO kimlik doğrulaması etkinleştirildiğinde, kullanıcının parolası silinir ve iki faktörlü kimlik doğrulaması devre dışı bırakılır.
    *   Gerekli kullanıcı grubuna, [Okta][doc-allow-access-okta] veya [G Suite][doc-allow-access-gsuite] tarafında yapılandırılmış Wallarm uygulamasına erişim izni verildiği varsayılmaktadır.

Wallarm kullanıcıları için SSO kimlik doğrulamasını etkinleştirmek için:

1. **Ayarlar** → **Kullanıcılar** bölümüne gidin.
2. Kullanıcı menüsünden **SSO girişi etkinleştir** seçeneğini seçin.

![Wallarm kullanıcısı için SSO'yu etkinleştirme][img-enable-sso-for-user]

Açılan pencerede, kullanıcıya SSO kimlik doğrulamasının etkinleştirildiğine dair bildirim gönderilmesi istenecektir. **Bildirim gönder** düğmesine tıklayın. Eğer bildirim gönderilmesine gerek yoksa, **İptal** düğmesine tıklayın.

Bundan sonra, kullanıcı [kimlik sağlayıcısı][doc-user-sso-guide] üzerinden kimlik doğrulaması yapabilir.

Not: Şirket hesabındaki tüm kullanıcılar için [Strict SSO](#strict-sso-mode) modu kullanılarak da SSO etkinleştirilebilir.

## Kullanıcılar İçin SSO Kimlik Doğrulamasını Devre Dışı Bırakma

Wallarm kullanıcıları için SSO kimlik doğrulamasını devre dışı bırakmak için:

1. **Ayarlar** → **Kullanıcılar** bölümüne gidin.
2. Kullanıcı menüsünden **SSO'yu devre dışı bırak** seçeneğini seçin.

![Wallarm kullanıcısı için SSO'yu devre dışı bırakma][img-disable-sso-for-user]

Bundan sonra, kullanıcıya SSO ile girişin devre dışı bırakıldığı ve giriş/parola yöntemiyle oturum açabilmesi için parolasını geri yüklemesine yönelik (bağlantı içeren) bir e-posta bildirimi gönderilir. Ayrıca, kullanıcı için iki faktörlü kimlik doğrulaması yeniden aktif hale gelir.

## SSO ve API Kimlik Doğrulaması

Kullanıcı için SSO etkinleştirildiğinde, bu kullanıcıya [Wallarm API’ye yapılan istekler](../../../api/overview.md#your-own-api-client) için kimlik doğrulaması sağlanamaz. Çalışan API kimlik bilgilerini almak için iki seçeneğiniz bulunmaktadır:

* Eğer **strict SSO** modu kullanılmıyorsa, şirket hesabınız altında SSO seçeneği olmadan bir kullanıcı oluşturun ve [API token(ler)ini](../../../api/overview.md#your-own-api-client) oluşturun.
* Eğer **strict SSO** modu kullanılıyorsa, **Yönetici** rolüne sahip SSO kullanıcıları için API kimlik doğrulamasını etkinleştirebilirsiniz. Bunu yapmak için, kullanıcı menüsünden **API erişimini etkinleştir** seçeneğini seçin. Böylece, kullanıcı için `SSO+API` kimlik doğrulama yöntemi etkinleştirilir ve bu, API tokenlarının oluşturulmasına olanak tanır.

    Daha sonra, bu kullanıcı için API kimlik doğrulamasını **API erişimini devre dışı bırak** seçeneğini seçerek kapatabilirsiniz. Bu durumda, mevcut tüm API tokenleri silinecek ve bir hafta içerisinde kaldırılacaktır.

## Strict SSO Modu

Wallarm, normal SSO’dan farklı olarak tüm şirket hesabı kullanıcıları için aynı anda SSO kimlik doğrulamasını etkinleştiren **strict SSO** modunu desteklemektedir. Strict SSO modunun diğer özellikleri şunlardır:

* Hesaptaki mevcut tüm kullanıcılar için kimlik doğrulama yöntemi SSO olarak değiştirilir.
* Yeni eklenen tüm kullanıcılar varsayılan olarak kimlik doğrulama yöntemi olarak SSO’yu alır.
* Hiçbir kullanıcı için kimlik doğrulama yöntemi SSO dışındaki bir yöntemle değiştirilemez.

Strict SSO modunu etkinleştirmek veya devre dışı bırakmak için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

!!! info "Strict SSO etkinleştirildiğinde aktif oturumların durumu"
    Şirket hesabına giriş yapmış kullanıcılar, strict SSO moduna geçildiğinde mevcut oturumlarına devam eder. Oturumu kapattıktan sonra, kullanıcılara SSO kullanmaları istenecektir.

## SSO Kimlik Doğrulama Sorun Giderme

Kullanıcı SSO üzerinden oturum açamıyorsa, hata mesajı ile birlikte aşağıdaki tabloda açıklanan hata kodlarından biri gösterilir. Çoğu durumda, şirket hesabı yöneticisi bu hataları düzeltebilir:

| Hata kodu | Açıklama | Nasıl düzeltilir |
|--|--|--|
| `saml_auth_not_found + userid` | Kullanıcıda SSO etkin değil. | [Yukarıdaki bölümde](#enabling-sso-authentication-for-users) belirtildiği şekilde SSO'yu etkinleştirin. |
| `saml_auth_not_found + clientid` | İstemcide **Integrations** bölümünde SSO entegrasyonu bulunmuyor. | [SAML SSO entegrasyonu](intro.md) dokümantasyonundaki talimatları izleyin. |
| `invalid_saml_response` veya `no_mail_in_saml_response` | SSO sağlayıcısı beklenmeyen bir yanıt verdi. Bu, yanlış yapılandırılmış bir SSO entegrasyonunun işareti olabilir. | Aşağıdakilerden birini yapın:<br><ul><li>Wallarm Console’un **Integrations** bölümünde yapılandırılan SSO entegrasyonunda hata olmadığından emin olun.</li><li>SSO sağlayıcısı tarafındaki yapılandırmada hata olmadığından emin olun.</li></ul> |
| `user_not_found` | Belirtilen e-posta ile Wallarm’da kullanıcı bulunamadı. | Wallarm Console’da bu e-posta ile bir kullanıcı oluşturun. |
| `client_not_found` | Wallarm’da şirket hesabı bulunamadı. | Uygun bir e-posta alanına sahip bir kullanıcı hesabı oluşturun; bu işlem şirket hesabının hemen oluşturulmasını sağlar. |

Gerekirse, yöneticiler bu hatalardan herhangi birini düzeltmek için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçebilir.