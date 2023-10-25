#   Adım 2: G Suite'te Bir Uygulama Oluşturma ve Yapılandırma  

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! bilgi "Önkoşullar"
    Bu kılavuzda aşağıdaki değerler örnek değerler olarak kullanılmaktadır:

    * **Uygulama Adı** parametresi için `WallarmApp` değeri (G Suite'te).
    * **ACS URL** parametresi için `https://sso.online.wallarm.com/acs` değeri (G Suite'te).
    * **Entity ID** parametresi için `https://sso.online.wallarm.com/entity-id` değeri (G Suite'te).

!!! uyarı
    **ACS URL** ve **Entity ID** parametreleri için örnek değerleri, [önceki adımda][doc-setup-sp] elde ettiğiniz gerçeklerle değiştirdiğinizden emin olun.

Google [yönetici konsoluna][link-gsuite-adm-console] giriş yapın. *Uygulamalar* bloğuna tıklayın.

![G Suite yönetici konsolu][img-gsuite-console]

*SAML uygulamaları* bloğuna tıklayın. *Alanınıza bir hizmet/Uygulama ekleyin* bağlantısına veya sağ alttaki "+" düğmesine tıklayarak yeni bir uygulama ekleyin.

*Kendi özel uygulamamı ayarla* düğmesine tıklayın.

![G Suite'ye yeni bir uygulama ekleme][img-gsuite-add-app]

Kimlik sağlayıcınız olarak G Suite tarafından sağlanan bilgiler (meta veriler) şunları içerir:
*   **SSO URL**
*   **Entity ID**
*   **Sertifika** (X.509)

Meta veriler, SSO'yu yapılandırmak için gereken kimlik sağlayıcısının özelliklerini tanımlayan bir dizi parametredir ( [1. Adımda][doc-setup-sp] hizmet sağlayıcı için üretilenlere benzer).

Meta verileri SSO Wallarm kurulum sihirbazına iki şekilde aktarabilirsiniz:
*   Her parametreyi kopyalayın ve sertifikayı indirin, ardından bunları Wallarm kurulum sihirbazındaki ilgili alanlara yapıştırın (yükleyin).
*   Meta verilerle birlikte bir XML dosyası indirin ve Wallarm tarafında yükleyin.

Meta verileri istediğiniz şekilde kaydedin ve *İleri*ye tıklayarak uygulamanın bir sonraki yapılandırma adımına geçin. Kimlik sağlayıcı meta verilerinin Wallarm tarafına girişi [Adım 3][doc-metadata-transfer] 'te açıklanmıştır.

![Meta verileri kaydetme][img-fetch-metadata]

Uygulamanın yapılandırılmasının bir sonraki aşaması hizmet sağlayıcı (Wallarm)'nın meta verilerini sağlamaktır. Gerekli alanlar:
*   **ACS URL** , Wallarm tarafında üretilen **Assertion Consumer Service URL** parametresine karşılık gelir.
*   **Entity ID** , Wallarm tarafında üretilen **Wallarm Entity ID** parametresine karşılık gelir.

Gerekirse diğer parametreleri doldurun. *İleri*'ye tıklayın.

![Hizmet sağlayıcı bilgilerini doldurun][img-fill-in-sp-data]

Uygulamanın yapılandırılmasının final aşamasında, hizmet sağlayıcının özelliklerine mevcut kullanıcı profil alanları arasındaki eşlemeleri sağlamanız istenecektir. Wallarm (bir hizmet sağlayıcı olarak), bir öznitelik eşlemesi oluşturmanızı gerektirir.

*Yeni bir eşleme ekle* 'ye tıklayın ve ardından `email` özniteliğini “Primary Email” kullanıcı profil alanına ( “Temel Bilgiler” grubunda) eşleyin. 

![Bir öznitelik eşlemesi oluşturma][img-create-attr-mapping]

*Bitir* 'e tıklayın. 

Bundan sonra, verilen bilgilerin kaydedildiği ve SAML SSO yapılandırmasını tamamlamak için kimlik sağlayıcısı (Google) hakkındaki verileri hizmet sağlayıcısı (Wallarm) yönetici paneline yüklemeniz gerektiği pop-up pencerede size bildirilecektir. *Tamam* 'a tıklayın.

Bundan sonra oluşturulan uygulamanın sayfasına yönlendirileceksiniz.
Bir kez uygulama oluşturulduktan sonra, bu G Suite'teki tüm organizasyonlarınız için devre dışı kalır. Bu uygulama için SSO'yu etkinleştirmek için *Hizmeti Düzenle* düğmesine tıklayın. 

![G Suite'teki Uygulama Sayfası][img-app-page]

**Hizmet durumu** parametresi için *Herkes için AÇIK* seçeneğini seçin ve *Kaydet* 'e tıklayın.

Şimdi, [SSO yapılandırmasına Wallarm tarafında devam][doc-metadata-transfer] edebilirsiniz.