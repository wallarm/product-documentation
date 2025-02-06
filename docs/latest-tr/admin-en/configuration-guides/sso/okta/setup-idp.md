# Adım 2: Okta'da Bir Uygulamanın Oluşturulması ve Yapılandırılması

[img-dashboard]:            ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:   ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:         ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:  ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:  #1-general-settings
[anchor-configure-saml]:    #2-configure-saml
[anchor-feedback]:          #3-feedback
[anchor-fetch-metadata]:    #downloading-metadata  

!!! info "Önkoşullar"
    Bu kılavuzda aşağıdaki değerler örnek değerler olarak kullanılmaktadır:
    
    *   **App name** parametresi için `WallarmApp` değeri (Okta içinde).
    *   **Single sign‑on URL** parametresi için `https://sso.online.wallarm.com/acs` değeri (Okta içinde).
    *   **Audience URI** parametresi için `https://sso.online.wallarm.com/entity-id` değeri (Okta içinde).

!!! warning
    **Single sign‑on URL** ve **Audience URI** parametrelerine ait örnek değerleri, [önceki adımda][doc-setup-sp] elde ettiğiniz gerçek değerlerle değiştirdiğinizden emin olun.

Okta servisine (hesabınızın yönetici yetkileri olmalıdır) giriş yapın ve sağ üstte bulunan *Administrator* butonuna tıklayın.

*Dashboard* bölümünde, sağ tarafta bulunan *Add Applications* butonuna tıklayın.

![Okta dashboard][img-dashboard]

Yeni uygulama bölümünde, sağ tarafta bulunan *Create New App* butonuna tıklayın.

Açılan pencerede aşağıdaki seçenekleri ayarlayın:
1.  **Platform** → “Web”.
2.  **Sign‑on method** → “SAML 2.0”.

*Create* butonuna tıklayın.

Bundan sonra, SAML entegrasyon sihirbazına (*Create SAML Integration*) yönlendirileceksiniz. SAML entegrasyonunu oluşturmak ve yapılandırmak için üç aşamayı tamamlamanız istenecektir:
1.  [Genel Ayarlar.][anchor-general-settings]
2.  [SAML Yapılandırması.][anchor-configure-saml]
3.  [Geri Bildirim.][anchor-feedback]

Ardından, oluşturulan entegrasyon için meta verilerin [indirilmesi][anchor-fetch-metadata] gerekmektedir.


## 1. Genel Ayarlar

Oluşturduğunuz uygulamanın adını **App Name** alanına girin.

İsteğe bağlı olarak, uygulamanın logosunu (**App logo**) indirip Okta ana sayfasında ve Okta mobil uygulamasında kullanıcılarınız için uygulama görünürlüğünü yapılandırabilirsiniz.

*Next* butonuna tıklayın.

![Genel ayarlar][img-general]


## 2. SAML Yapılandırması

Bu aşamada, Wallarm tarafında daha önce oluşturulan [parametreleri][doc-setup-sp] kullanmanız gerekecektir:

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Okta parametreleri"
    Bu kılavuz, Okta ile SSO yapılandırılırken doldurulması gereken yalnızca zorunlu parametreleri açıklamaktadır.
    
    Dijital imza ve SAML mesaj şifreleme ayarlarıyla ilgili diğer parametreler hakkında ayrıntılı bilgi için lütfen [Okta documentation][link-okta-docs] sayfasına bakınız.

Aşağıdaki temel parametreleri doldurun:
*   **Single sign‑on URL** — daha önce Wallarm tarafından elde edilen **Assertion Consumer Service URL (ACS URL)** değerini girin.
*   **Audience URI (SP Entity ID)** — Wallarm tarafından daha önce aldığınız **Wallarm Entity ID** değerini girin.

İlk yapılandırma için kalan parametreler varsayılan olarak bırakılabilir.

![SAML Yapılandırması][img-saml]

Ayarı sürdürmek için *Next* butonuna tıklayın. Önceki adıma dönmek isterseniz, *Previous* butonuna tıklayın.

![SAML ayar önizlemesi][img-saml-preview]


## 3. Geri Bildirim

Bu aşamada, Okta'ya uygulamanızın türü, Okta müşterisi veya ortağı olup olmadığınız ve diğer bazı bilgiler hakkında ek veri sağlamanız istenecektir. **Are you a customer or partner** parametresi için "I'm an Okta customer adding an internal app" seçmek yeterlidir.

Gerekirse, mevcut diğer parametreleri de doldurun.

Sonrasında, *Finish* butonuna tıklayarak SAML entegrasyon sihirbazını tamamlayabilirsiniz. Önceki adıma dönmek için *Previous* butonuna tıklayın.

![Geri bildirim formu][img-feedback]

Bu aşamadan sonra, oluşturulan uygulamanın ayarlar sayfasına yönlendirileceksiniz.

Artık, Wallarm tarafında SSO sağlayıcısını yapılandırmaya devam etmek için oluşturulan entegrasyonun meta verilerini [indirmelisiniz][anchor-fetch-metadata].

Meta veriler, SSO yapılandırması için gereken, kimlik sağlayıcısının özelliklerini (örneğin, [Adım 1][doc-setup-sp] sırasında hizmet sağlayıcı için oluşturulanlar gibi) tanımlayan parametreler bütünüdür.


## Meta Verilerin İndirilmesi

Meta verileri, ya bir XML dosyası olarak ya da metin formatında (“olduğu gibi”) indirebilirsiniz (ileri yapılandırmada meta verileri manuel olarak girmeniz gerekecektir).

XML dosyası olarak indirmek için:
1.  Oluşturulan uygulamanın ayarlar sayfasında bulunan *Identity Provider metadata* bağlantısına tıklayın:

    ![Meta veri indirme bağlantısı][img-fetch-metadata-xml]
    
    Sonuç olarak, tarayıcınızda benzer içeriğe sahip yeni bir sekmeye yönlendirileceksiniz:
    
    ![XML formatlı meta veriler örneği][img-xml-metadata]
    
2.  İçeriği, tarayıcınız veya uygun başka bir yöntem kullanarak bir XML dosyasına kaydedin.

Meta verileri “olduğu gibi” indirmek için:
1.  Oluşturulan uygulamanın ayarlar sayfasında, *View Setup instructions* butonuna tıklayın.

    ![“View Setup instructions” butonu][img-fetch-metadata-manually]
    
2.  Verilen tüm verileri kopyalayın.


Artık Wallarm tarafında SSO yapılandırmasına [devam edebilirsiniz][doc-metadata-transfer].