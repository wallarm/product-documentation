# Adım 2: Okta'da Bir Uygulama Oluşturma ve Yapılandırma

[img-dashboard]:              ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:                ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png
[img-saml]:                   ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:           ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:               ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:     ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:           ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:               setup-sp.md
[doc-metadata-transfer]:      metadata-transfer.md

[link-okta-docs] :            https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:    #1-general-settings
[anchor-configure-saml]:      #2-configure-saml
[anchor-feedback]:            #3-feedback
[anchor-fetch-metadata]:      #downloading-metadata

!!! info "Gereksinimler"
    Bu kılavuzda aşağıdaki değerler örnek değerler olarak kullanılmaktadır:

    *   `WallarmApp` **Uygulama adı** parametresi için bir değer (Okta'da).
    *   `https://sso.online.wallarm.com/acs` **Tek Oturum Açma URL'si** parametresi için bir değer (Okta'da).
    *   `https://sso.online.wallarm.com/entity-id` **Dinleyici URI** parametresi için bir değer (Okta'da).

!!! Uyarı
    **Tek Oturum Açma URL'si** ve **Dinleyici URI** parametrelerindeki örnek değerleri, [önceki adımda][doc-setup-sp] elde edilen gerçek değerlerle değiştirdiğinizden emin olun.

Okta hizmetine giriş yapın (hesabın yönetici hakları olmalıdır) ve sağ üstteki *Yönetici* düğmesine tıklayın.

*Gösterge Paneli* bölümünde, sağdaki *Uygulamalar Ekle* düğmesine tıklayın.

![Okta dashboard][img-dashboard]

Yeni uygulama bölümünde, sağdaki *Yeni Uygulama Oluştur* düğmesine tıklayın.

Açılır pencerede aşağıdaki seçenekleri ayarlayın:
1.  **Platform** → “Web”.
2.  **Oturum açma yöntemi** → “SAML 2.0”.

*Oluştur* düğmesine tıklayın.

Bundan sonra SAML entegrasyon sihirbazına (*SAML Entegrasyonu Oluştur*) yönlendirileceksiniz. SAML entegrasyonunu oluşturmak ve yapılandırmak için üç aşamayı tamamlamanız gerekecektir:
1.  [Genel Ayarlar.][anchor-general-settings]
2.  [SAML Yapılandır.][anchor-configure-saml]
3.  [Geri Bildirim.][anchor-feedback]

Bundan sonra, yeni oluşturulan entegrasyon için metaverilerin [indirilmesi gerekmektedir][anchor-fetch-metadata].


##  1.  Genel Ayarlar

Oluşturmakta olduğunuz uygulamanın adını **Uygulama Adı** alanına girin.

İsteğe bağlı olarak, uygulamanın logosunu (**Uygulama logosu**) indirebilir ve Okta ana sayfasında ve Okta mobil uygulamasında uygulama görünürlüğünü kullanıcılarınız için yapılandırabilirsiniz.

*Sonraki* düğmesine tıklayın.

![Genel ayarlar][img-general]


##  2.  SAML Yapılandır

Bu aşamada, önceki[doc-setup-sp] Wallarm tarafından oluşturulan parametrelere ihtiyacınız olacak:

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Okta parametreleri"
    Bu kılavuz yalnızca Okta ile SSO'yu yapılandırırken doldurulması zorunlu olan parametreleri açıklar.
    
    Diğer tüm parametreler hakkında daha fazla bilgi edinmek için (dijital imza ve SAML mesajı şifreleme ayarları dahil olmak üzere), lütfen [Okta belgelerine][link-okta-docs] bakın.

Aşağıdaki temel parametreleri doldurun:
*   **Tek oturum açma URL'si**—daha önce Wallarm tarafında elde ettiğiniz **Assertion Consumer Service URL (ACS URL)** değeri girilir.
*   **Audience URI (SP Entity ID)**—daha önce Wallarm tarafında alınan **Wallarm Entity ID** değerini girin.

İlk kurulum için geri kalan tüm parametreler varsayılan olarak bırakılabilir.

![SAML Yapılandır][img-saml]

Kurulumu sürdürmek için *Sonraki*'ye tıklayın. Önceki adıma dönmek isterseniz, *Önceki*'ye tıklayın.

![SAML ayarları önizleme][img-saml-preview]


##  3.  Geri Bildirim

Bu aşamada, Okta'ya uygulamanızın türü, Okta müşterisi olup olmadığınız, ortak olduğunuz ve diğer veriler hakkında ek bilgiler sağlamanız istenecektir. **Müşteri veya Ortak mısınız?** parametresi için "Bir Okta müşterisiyim ve dahili bir uygulama ekliyorum" seçeneğini seçmek yeterlidir.

Gerekirse, diğer mevcut parametreleri doldurun.

Bundan sonra, SAML entegrasyon sihirbazını *Bitir* düğmesine tıklayarak tamamlayabilirsiniz. Önceki adıma gitmek için *Önceki* düğmesine tıklayın.

![Geri bildirim formu][img-feedback]

Bu aşamadan sonra, oluşturduğunuz uygulamanın ayarlar sayfasına yönlendirileceksiniz.

Şimdi, Wallarm tarafında SSO sağlayıcısının yapılandırmasına devam etmek için oluşturulan entegrasyon için metaverileri [indirmeniz gerekiyor][anchor-fetch-metadata].

Metaveriler, SSO'yu yapılandırmak için gereken kimlik sağlayıcının özelliklerini (hizmet sağlayıcı için [Adım 1][doc-setup-sp]'de oluşturulanlar gibi) açıklayan bir parametre kümesidir.


##  Metaveri İndirme

Metaverileri bir XML dosyası olarak veya “olduğu gibi” metin formunda indirebilirsiniz (daha sonrasında yapılandırmayı manuel olarak girmeniz gerekecektir).

Bir XML dosyası olarak indirmek için:
1.  Oluşturulan uygulamanın ayarlar sayfasında *Identity Provider metadata* bağlantısına tıklayın:

    ![Metaveri indirme linki][img-fetch-metadata-xml]
    
    Sonuç olarak, tarayıcınızda benzer içeriği olan yeni bir sekme açılacaktır:
    
    ![XML biçiminde metaveri örneği][img-xml-metadata]
    
2.  İçeriği bir XML dosyasına kaydedin (tarayıcınız veya başka bir uygun yöntem ile).

Metaverileri “olduğu gibi” indirmek için:
1.  Oluşturulan uygulamanın ayarlar sayfasında *Kurulum talimatlarını görüntüle* düğmesine tıklayın.

    ![“Kurulum talimatlarını görüntüle” düğmesi][img-fetch-metadata-manually]
    
2.  Verilen tüm verileri kopyalayın.

Şimdi Wallarm tarafında SSO'nun yapılandırmasına devam edebilirsiniz.[doc-metadata-transfer].
