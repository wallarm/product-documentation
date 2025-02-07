# Yapılandırılmış SSO Kimlik Doğrulamasını Değiştirme

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

Yapılandırılmış SSO kimlik doğrulamasını [düzenleyebilir][anchor-edit], [devre dışı bırakabilir][anchor-disable] veya [kaldırabilirsiniz][anchor-remove].

!!! warning "Dikkat: SSO tüm kullanıcılar için devre dışı bırakılacak"
    SSO kimlik doğrulamasını devre dışı bırakırken veya kaldırırken tüm kullanıcılar için devre dışı bırakılacağını unutmayın. Kullanıcılara SSO kimlik doğrulamasının devre dışı bırakıldığı ve şifrenin geri yüklenmesi gerektiği bildirilecektir.

## Düzenleme

Yapılandırılmış SSO kimlik doğrulamasını düzenlemek için:

1. Wallarm UI'de **Ayarlar → Entegrasyon** bölümüne gidin.
2. Yapılandırılmış SSO sağlayıcı menüsünden **Düzenle** seçeneğini seçin.
3. SSO sağlayıcı ayrıntılarını güncelleyin ve **Değişiklikleri kaydet** düğmesine tıklayın.

## Devre Dışı Bırakma

SSO'yu devre dışı bırakmak için *Ayarlar → Entegrasyon* bölümüne gidin. İlgili SSO sağlayıcısının bloğuna tıklayın ve ardından *Devre Dışı Bırak* düğmesine tıklayın.

![disabling-sso-provider][img-disable-sso-provider]

Açılan pencerede, SSO sağlayıcısının devre dışı bırakılması ve tüm kullanıcıların SSO kimlik doğrulamasının devre dışı bırakılması onaylanmalıdır.
*Evet, devre dışı bırak* düğmesine tıklayın.

Onaylandıktan sonra, SSO sağlayıcısının bağlantısı kesilecek, ancak ayarları kaydedilecektir ve gelecekte bu sağlayıcıyı yeniden etkinleştirebilirsiniz. Ayrıca, devre dışı bırakmanın ardından başka bir SSO sağlayıcısını (başka bir hizmeti kimlik sağlayıcı olarak) bağlayabileceksiniz.

## Kaldırma

!!! warning "Dikkat: SSO sağlayıcısının kaldırılması hakkında"
    Devre dışı bırakmaya kıyasla, SSO sağlayıcısının kaldırılması, tüm ayarlarının kurtarma imkanı olmadan kaybedilmesine neden olur.
    
    Sağlayıcınızı yeniden bağlamanız gerekirse, yeniden yapılandırmanız gerekecektir.

SSO sağlayıcısının kaldırılması, devre dışı bırakılmasına benzer.

*Ayarlar → Entegrasyon* bölümüne gidin. İlgili SSO sağlayıcısının bloğuna tıklayın ve ardından *Kaldır* düğmesine tıklayın.

Açılan pencerede, sağlayıcının kaldırılması ve tüm kullanıcıların SSO kimlik doğrulamasının devre dışı bırakılması onaylanmalıdır.
*Evet, kaldır* düğmesine tıklayın.

Onaylandıktan sonra, seçilen SSO sağlayıcısı kaldırılacak ve artık kullanılamayacaktır. Ayrıca, başka bir SSO sağlayıcısına bağlanabileceksiniz.