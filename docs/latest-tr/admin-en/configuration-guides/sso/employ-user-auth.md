#   Kullanıcılar İçin SSO Kimlik Doğrulamasının Ayarlanması

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

Wallarm portal kullanıcılarına SSO kimlik doğrulamasını [etkinleştirebilir][anchor-enable] ya da [devre dışı bırakabilirsiniz][anchor-disable].


##   Kullanıcılar için SSO Kimlik Doğrulamasının Etkinleştirilmesi

!!! warning
    *   Kullanıcılar için SSO kimlik doğrulaması etkinleştirildiğinde, giriş/şifre ile giriş mekanizması ve iki faktörlü kimlik doğrulama kullanılabilir olmaz. SSO kimlik doğrulaması etkin olduğunda, kullanıcının şifresi silinir ve iki faktörlü kimlik doğrulama devre dışı bırakılır.
    *   Zaten gereken kullanıcılar grubuna, yapılandırılan Wallarm uygulamasına [Okta][doc-allow-access-okta] veya [G Suite][doc-allow-access-gsuite] üzerinden erişim verdiğinizi varsayılır.


Wallarm kullanıcıları için SSO kimlik doğrulamasını etkinleştirmek için:

1. **Ayarlar** → **Kullanıcılar**'a gidin.
1. Kullanıcı menüsünden **SSO Oturumunu Aktif Et**'i seçin.

![Wallarm kullanıcısı için SSO'nun etkinleştirilmesi][img-enable-sso-for-user]

Açılan pencerede, SSO kimlik doğrulamasının etkinleştirildiğine dair kullanıcıya bir bildirim gönderilmesi istenecektir. **Bildirim gönder** düğmesine tıklayın. Bildirime gerek yoksa, **İptal**'e tıklayın.

Bundan sonra, kullanıcı kimlik sağlayıcısından [kimlik doğrulayabilir][doc-user-sso-guide].

[Strict SSO](#strict-sso-mode) modu kullanarak tüm şirket hesabı kullanıcıları için SSO'yu da etkinleştirebileceğinizi unutmayınız.

##  Kullanıcılar için SSO Kimlik Doğrulamasının Devre Dışı Bırakılması

Wallarm kullanıcıları için SSO kimlik doğrulamasını devre dışı bırakmak için:

1. **Ayarlar** → **Kullanıcılar**'a gidin.
1. Kullanıcı menüsünden **SSO'yu Devre Dışı Bırak**'ı seçin.

![Wallarm kullanıcısı için SSO'nun devre dışı bırakılması][img-disable-sso-for-user]

Bundan sonra, kullanıcıya SSO ile oturum açmanın devre dışı bırakıldığına dair bir e-posta ile bildirilelik ve giriş/şifre çifti ile oturum açmak için şifresini geri yüklemesi önerilir. Ayrıca, kullanıcıya iki faktörlü kimlik doğrulama sunulur.

## SSO ve API Kimlik Doğrulaması

Kullanıcı için SSO etkinleştirildiğinde, bu kullanıcı için [Wallarm API'ye istekler](../../../api/overview.md#your-own-client) için kimlik doğrulaması kullanılamaz. Çalışan API kimlik bilgilerini almak için iki seçeneğiniz vardır: 

* Eğer **strict SSO** modu kullanılmazsa, şirket hesabınız altında SSO seçeneği olmayan bir kullanıcı yaratın ve [API token(lar)](../../../api/overview.md#your-own-client) yaratın.
* Eğer **strict SSO** modu kullanılıyorsa, **Yönetici** rolündeki SSO kullanıcıları için API kimlik doğrulamasını etkinleştirebilirsiniz. Bunu yapmak için, bu kullanıcı menüsünden **API erişimini etkinleştir**'i seçin. Kullanıcı için `SSO+API` kimlik doğrulama yöntemi etkinleştirilir ki bu API tokenleri oluşturmayı sağlar.

    Daha sonra bu kullanıcı için API kimlik doğrulamasını devre dışı bırakabilirsiniz **API erişimini devre dışı bırak**'ı seçerek. Eğer bu yapılırsa, mevcut tüm API tokenleri silinir ve bir hafta sonra - kaldırılır.

## Strict SSO Modu

Wallarm, tüm şirket hesabı kullanıcıları için birden SSO kimlik doğrulamasını etkinleştiren **strict SSO** modunu destekler. Strict SSO modunun diğer özellikleri:

* Hesabın tüm mevcut kullanıcıları için kimlik doğrulama yöntemi SSO'ya geçer.
* Tüm yeni kullanıcılar varsayılan olarak SSO kimlik doğrulama yöntemini alır.
* Hiçbir kullanıcı için kimlik doğrulama yöntemi SSO'dan farklı bir yönteme geçirilemez.

Strict SSO modunu etkinleştirmek veya devre dışı bırakmak için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişim kurun.

!!! info "Strict SSO'nun etkinleştirildiğinde aktif oturumların durumu"
    Eğer şirket hesabına giriş yapmış herhangi bir kullanıcı varsa ve strict SSO moduna geçildiğinde, bu oturumlar aktif kalır. Çıkış yaptıktan sonra, kullanıcılardan SSO'yu kullanmaları istenir.

## SSO Kimlik Doğrulaması Sorun Giderme

Eğer kullanıcı SSO üzerinden oturum açamıyorsa, aşağıdaki tabloda açıklanan bir hata kodlarından biri ile bir hata mesajı görüntülenir. Çoğu durumda, şirket hesabının yöneticisi bu hataları düzeltebilir:

| Hata kodu | Açıklama | Nasıl düzeltilir |
|--|--|--|
| `saml_auth_not_found + userid` | Kullanıcı SSO'yu etkinleştirmedin. | Yukarıdaki bölümde açıklandığı gibi SSO'yu etkinleştirin. |
| `saml_auth_not_found + clientid` | İstemci, **Entegrasyonlar** bölümünde bir SSO entegrasyonuna sahip değil. | [SAML SSO ile entegrasyon](intro.md) belgelerindeki talimatları uygulayın. |
| `invalid_saml_response` or `no_mail_in_saml_response` | SSO sağlayıcı beklenmedik bir yanıt verdi. Bu, yanlış yapılandırılmış bir SSO entegrasyonunun işareti olabilir. | Aşağıdakilerden birini yapın:<br><ul><li>Wallarm Console'un **Entegrasyonlar** bölümünde yapılandırılan SSO entegrasyonunda hata olmadığından emin olun.</li><li>SSO sağlayıcısı tarafındaki yapılandırmada bir hata olmadığından emin olun.</li></ul> |
| `user_not_found` | Wallarm belirtilen e-posta ile bir kullanıcı bulamadı. | Wallarm Console'da bu e-posta ile bir kullanıcı oluşturun. |
| `client_not_found` | Wallarm'da şirket hesabı bulunamadı. | Uygun bir e-posta alanı olan bir kullanıcı hesabı oluşturun, bu anında şirket hesabını da oluşturacaktır. |

 İhtiyaç halinde, yönetici bu hataların herhangi birini düzeltmek için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişim kurabilir.