# SAML SSO Kimlik Doğrulaması Sorun Giderme

Bu makale, Wallarm'ın [SAML SSO Kimlik Doğrulaması](intro.md) ile nasıl sorun giderileceğini açıklar.

### SSO ve API kimlik doğrulaması

Bir kullanıcı için SSO etkinleştirildiğinde, bu kullanıcının [Wallarm API'ye yapılan istekler](../../../api/overview.md#your-own-api-client) için kimlik doğrulaması kullanılamaz hale gelir. Çalışan API kimlik bilgileri almak için kullanılan SSO [seçeneklerine](intro.md#available-options) bağlı olarak farklı seçenekler vardır:

* Provisioning açıkken veya kapalıyken ve strict SSO seçeneğiyle, **Administrator** rolüne sahip SSO kullanıcıları için API kimlik doğrulamasını etkinleştirebilirsiniz. Bunu yapmak için, bu kullanıcının menüsünden **Enable API access** öğesini seçin. Kullanıcı için `SSO+API` kimlik doğrulama yöntemi etkinleştirilir ve API belirteçleri oluşturulmasına izin verir.

    Daha sonra **Disable API access** seçerek kullanıcı için API kimlik doğrulamasını devre dışı bırakabilirsiniz. Bu yapılırsa, mevcut tüm API belirteçleri silinir ve bir hafta sonra kaldırılır.

* Provisioning kapalıyken ve strict SSO kullanılmıyorsa, şirket hesabınız altında SSO seçeneği olmadan bir kullanıcı oluşturun ve [API belirteci(leri)](../../../api/overview.md#your-own-api-client) oluşturun.

### Oturum açamama sorunları

Kullanıcı SSO ile oturum açamazsa, aşağıdaki tabloda açıklanan hata kodlarından biriyle bir hata mesajı görüntülenir. Çoğu durumda, şirket hesabı yöneticisi bu hataları düzeltebilir:

| Hata kodu | Açıklama | Nasıl düzeltilir |
|--|--|--|
| `saml_auth_not_found + userid` | Provisioning kapalı ve kullanıcının SSO’su etkin değil. | Wallarm Console → **Settings** → **Users** → kullanıcı menüsü → **Enable SSO** içinde SSO'yu etkinleştirin. |
| `saml_auth_not_found + clientid` | Müşterinin **Integrations** bölümünde bir SSO entegrasyonu yok. | [SAML SSO ile entegrasyon](intro.md) dokümantasyonundaki talimatları izleyin. |
| `invalid_saml_response` veya `no_mail_in_saml_response` | SSO sağlayıcısı beklenmeyen bir yanıt verdi. Bu, yanlış yapılandırılmış bir SSO entegrasyonunun işareti olabilir. | Aşağıdakilerden birini yapın:<br><ul><li>Wallarm Console'un **Integrations** bölümünde yapılandırılmış SSO entegrasyonunda hata olmadığından emin olun.</li><li>SSO sağlayıcı tarafındaki yapılandırmada hata olmadığından emin olun.</li></ul> |
| `user_not_found` | Wallarm, belirtilen e-posta ile kullanıcıyı bulamadı. | Wallarm Console içinde bu e-postaya sahip bir kullanıcı oluşturun. |
| `client_not_found` | Şirket hesabı Wallarm’da bulunamadı. | Uygun bir e-posta etki alanına sahip bir kullanıcı hesabı oluşturun; bu, şirket hesabını hemen oluşturacaktır. |

 Gerekirse, yönetici bu hatalardan herhangi birini düzeltmek için yardım almak üzere [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçebilir.