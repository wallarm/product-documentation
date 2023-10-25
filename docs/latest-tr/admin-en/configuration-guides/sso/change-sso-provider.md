# Yapılandırılmış SSO Kimlik Doğrulamasını Değiştirme

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

Yapılandırılmış SSO kimlik doğrulamasını [düzenleyebilir][anchor-edit], [devre dışı bırakabilir][anchor-disable] veya [kaldırabilir][anchor-remove].

!!! uyarı "Dikkat: SSO tüm kullanıcılar için devre dışı bırakılacak"
    SSO kimlik doğrulamasını devre dışı bırakır veya kaldırırsanız, tüm kullanıcılar için devre dışı bırakılacaktır. Kullanıcılar, SSO kimlik doğrulamasının devre dışı bırakıldığı ve parolanın geri yüklenmesi gerektiği konusunda bilgilendirilecektir.

## Düzenleme

Yapılandırılmış SSO kimlik doğrulamasını düzenlemek için:

1. Wallarm UI'da **Ayarlar → Entegrasyon**'a gidin.
2. Yapılandırılmış SSO sağlayıcı menüsünde **Düzenle** seçeneğini seçin.
3. SSO sağlayıcı detaylarını güncelleyin ve **Değişiklikleri Kaydet**.

## Devre Dışı Bırakma

SSO'yu devre dışı bırakmak için, *Ayarlar → Entegrasyon*'a gidin. İlgili SSO sağlayıcının bloğuna tıklayın ve ardından *Devre Dışı Bırak* düğmesine tıklayın.

![disabling-sso-provider][img-disable-sso-provider]

Açılan pencerede, SSO sağlayıcısının devre dışı bırakılması gerektiğini, ayrıca tüm kullanıcıların SSO kimlik doğrulamasının devre dışı bırakılmasını onaylamak gerekmektedir.
*Evet, devre dışı bırak* seçeneğine tıklayın.

Onaylandıktan sonra, SSO sağlayıcı bağlantısı kesilecektir, ancak ayarları kaydedilecektir ve bu sağlayıcıyı gelecekte tekrar etkinleştirebileceksiniz. Ek olarak, devre dışı bırakıldıktan sonra başka bir SSO sağlayıcısına (kimlik sağlayıcı olarak başka bir hizmet) bağlanabilirsiniz.

##  Kaldırma

!!! uyarı "Dikkat: SSO sağlayıcısını kaldırmayla ilgili"
    Devre dışı bırakmayla karşılaştırıldığında, SSO sağlayıcısını kaldırmak tüm ayarlarının kaybedilmesine neden olacak ve geri getirme olanağı olmayacaktır.
    
    Sağlayıcınızı yeniden bağlamanız gerekiyorsa, yeniden yapılandırmanız gerekecektir.


SSO sağlayıcısını kaldırmak, onu devre dışı bırakmaya benzer.

*Ayarlar → Entegrasyon*'a gidin. İlgili SSO sağlayıcının bloğuna tıklayın ve ardından *Kaldır* düğmesine tıklayın.

Açılan pencerede, sağlayıcının kaldırılmasını, ayrıca tüm kullanıcıların SSO kimlik doğrulamasının devre dışı bırakılmasını onaylamak gerekmektedir.
*Evet, kaldır* seçeneğine tıklayın.

Onaylandıktan sonra, seçili SSO sağlayıcı kaldırılacak ve artık kullanılamayacak. Ayrıca, başka bir SSO sağlayıcısına bağlanabilirsiniz.
