#   Adım 3: Okta Metadata'nın Wallarm Setup Wizard'a Aktarılması

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Wallarm Console'daki Okta SSO kurulum sihirbazına geri dönün ve sonraki kurulum adımına geçmek için *Next* düğmesine tıklayın.

Bu adımda, Okta servisi tarafından [üretilen][link-metadata] metadata'yı sağlamanız gerekmektedir.

Kimlik sağlayıcı metadata'sını (bu durumda Okta) Wallarm setup wizard'a aktarmanın iki yolu vardır:
*   Metadata içeren bir XML dosyası yükleyerek.

    Uygun dosyayı seçmek için *Upload* düğmesine tıklayarak XML dosyasını yükleyin. Ayrıca dosyayı dosya yöneticinizden “XML” simgesi alanına sürükleyerek de yapabilirsiniz.

*   Metadata'yı manuel olarak girerek.

    *Enter manually* bağlantısına tıklayın ve aşağıdaki şekilde Okta servis parametrelerini kurulum sihirbazı alanlarına kopyalayın:
    
    *   **Identity Provider Single Sign‑On URL** alanını **Identity provider SSO URL** alanına.
    *   **Identity Provider Issuer** alanını **Identity provider issuer** alanına.
    *   **X.509 Certificate** alanını **X.509 Certificate** alanına.
    
    ![Entering the metadata manually][img-transfer-metadata-manually]
    
Sonraki adıma geçmek için *Next* düğmesine tıklayın. Önceki adıma geri dönmek isterseniz *Back* düğmesine tıklayın.


##  Completing SSO Wizard

Wallarm setup wizard'ın son adımında, Okta servisine otomatik olarak bir test bağlantısı gerçekleştirilecek ve SSO sağlayıcısı kontrol edilecektir.

Gerekli tüm parametreler doğru şekilde doldurulduysa ve test başarıyla tamamlandıktan sonra, kurulum sihirbazı Okta servisinin bir kimlik sağlayıcı olarak bağlandığını bildirir ve kullanıcılarınızı kimlik doğrulamak için SSO mekanizmasını bağlamaya başlayabilirsiniz.

SSO yapılandırmasını, *Finish* düğmesine tıklayarak veya kullanıcı sayfasına gidip ilgili düğmeye tıklayarak tamamlayın.

![Completing SSO wizard][img-sp-wizard-finish]

SSO yapılandırma sihirbazını tamamladıktan sonra, *Integration* sekmesinde Okta servisinin bir kimlik sağlayıcı olarak bağlı olduğu ve başka SSO sağlayıcısının bulunmadığı görülecektir.

![The “Integration” tab after finishing the SSO wizard][img-integration-tab]


Şimdi, SSO yapılandırma sürecinin [sonraki adımına][doc-allow-access-to-wl] gidin.