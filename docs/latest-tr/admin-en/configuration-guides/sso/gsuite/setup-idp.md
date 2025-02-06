#   Adım 2: G Suite'de Bir Uygulama Oluşturma ve Yapılandırma

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! info "Ön Koşullar"
    Bu kılavuzda gösterim amacıyla aşağıdaki değerler kullanılmaktadır:

    * **Application Name** parametresi için `WallarmApp` değeri (G Suite'de).
    * **ACS URL** parametresi için `https://sso.online.wallarm.com/acs` değeri (G Suite'de).
    * **Entity ID** parametresi için `https://sso.online.wallarm.com/entity-id` değeri (G Suite'de).

!!! warning
    Lütfen **ACS URL** ve **Entity ID** parametreleri için örnek değerleri, [önceki adım][doc-setup-sp] sırasında elde edilen gerçek değerlerle değiştirdiğinizden emin olun.

Google [admin konsoluna][link-gsuite-adm-console] giriş yapın. *Apps* bloğuna tıklayın.

![G Suite admin console][img-gsuite-console]

*SAML apps* bloğuna tıklayın. Alt sağ köşede yer alan *Add a service/App to your domain* bağlantısına veya “+” düğmesine tıklayarak yeni bir uygulama ekleyin.

*Setup my own custom app* düğmesine tıklayın.

![G Suite'e yeni bir uygulama ekleme][img-gsuite-add-app]

G Suite, kimlik sağlayıcınız olarak size aşağıdaki bilgileri (metadata) sağlayacaktır:
*   **SSO URL**
*   **Entity ID**
*   **Certificate** (X.509)

Metadata, SSO yapılandırması için gerekli olan ve kimlik sağlayıcısının özelliklerini tanımlayan parametreler kümesidir (Wallarm tarafında [Adım 1][doc-setup-sp] için oluşturulanlara benzer).

Bu bilgileri iki şekilde SSO Wallarm yapılandırma sihirbazına aktarabilirsiniz:
*   Her bir parametreyi kopyalayın ve sertifikayı indirin, ardından Wallarm yapılandırma sihirbazındaki ilgili alanlara yapıştırın (yükleyin).
*   Metadata içeren bir XML dosyasını indirin ve Wallarm tarafına yükleyin.

Metadata'yı istediğiniz şekilde kaydedin ve *Next* düğmesine tıklayarak uygulamayı yapılandırmanın bir sonraki adımına geçin. Kimlik sağlayıcı metadata'sını Wallarm tarafına girmek [Adım 3][doc-metadata-transfer] kısmında anlatılacaktır.

![Metadata kaydetme][img-fetch-metadata]

Uygulamayı yapılandırmanın bir sonraki aşamasında, servis sağlayıcının (Wallarm) metadata'sını sağlamanız gerekmektedir. Gerekli alanlar:
*   **ACS URL**, Wallarm tarafında oluşturulan **Assertion Consumer Service URL** parametresine karşılık gelir.
*   **Entity ID**, Wallarm tarafında oluşturulan **Wallarm Entity ID** parametresine karşılık gelir.

Gerekirse diğer parametreleri de doldurun. *Next* düğmesine tıklayın.

![Servis sağlayıcı bilgilerini doldurma][img-fill-in-sp-data]

Uygulamayı yapılandırmanın son aşamasında, servis sağlayıcının özelliklerinin kullanıcı profili alanlarına eşleştirilmesi istenecektir. Wallarm (servis sağlayıcı olarak) sizden bir özellik eşleştirmesi oluşturmanızı istemektedir.

*Add new mapping* düğmesine tıklayın ve ardından `email` özelliğini “Basic Information” grubundaki “Primary Email” kullanıcı profilinde eşleştirin.

![Özellik eşleştirmesi oluşturma][img-create-attr-mapping]

*Finish* düğmesine tıklayın.

Bunun ardından, sağlanan bilgilerin kaydedildiğine dair açılır pencere ile bilgilendirileceksiniz ve SAML SSO yapılandırmasını tamamlamak için servis sağlayıcının (Wallarm) yönetici paneline kimlik sağlayıcı (Google) bilgilerini yüklemeniz gerekecektir. *Ok* düğmesine tıklayın.

Ardından, oluşturulan uygulama sayfasına yönlendirileceksiniz.
Uygulama oluşturulduktan sonra, G Suite içindeki tüm organizasyonlar için devre dışı bırakılmış olur. Bu uygulama için SSO'yu etkinleştirmek adına, *Edit Service* düğmesine tıklayın.

![G Suite'deki uygulama sayfası][img-app-page]

**Service status** parametresi için *ON for everyone* seçeneğini seçin ve *Save* düğmesine tıklayın.


Artık Wallarm tarafında [SSO yapılandırmasına devam edebilirsiniz][doc-metadata-transfer].