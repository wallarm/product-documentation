[img-test-scheme]:                  ../../images/fast/qsg/en/test-preparation/12-qsg-fast-test-prep-scheme.png
[img-google-gruyere-startpage]:     ../../images/fast/qsg/common/test-preparation/13-qsg-fast-test-prep-gruyere.png
[img-policy-screen]:                ../../images/fast/qsg/common/test-preparation/14-qsg-fast-test-prep-policy-screen.png
[img-wizard-general]:               ../../images/fast/qsg/common/test-preparation/15-qsg-fast-test-prep-policy-wizard-general.png
[img-wizard-insertion-points]:      ../../images/fast/qsg/common/test-preparation/16-qsg-fast-test-prep-policy-wizard-ins-points.png

[link-previous-chapter]:            deployment.md
[link-https-google-gruyere]:        https://google-gruyere.appspot.com
[link-https-google-gruyere-start]:  https://google-gruyere.appspot.com/start
[link-wl-console]:                  https://us1.my.wallarm.com

[doc-policy-in-detail]:             ../operations/test-policy/overview.md

[gl-element]:                       ../terms-glossary.md#baseline-request-element
[gl-testpolicy]:                    ../terms-glossary.md#test-policy

[anchor1]:  #1-prepare-the-baseline-request                       
[anchor2]:  #2-create-a-test-policy-targeted-at-xss-vulnerabilities
    
    
# Test Ortamının Ayarlanması

Bu bölüm, FAST'ın Google Gruyere uygulamasındaki XSS açıklıklarını tespit etmek üzere nasıl yapılandırılacağına dair size yol gösterecektir. Tüm gereklilikleri tamamladığınızda, XSS açıklıklarını bulmak için bir HTTPS temel isteği FAST düğümüne aktarmaya hazır olacaksınız.

Bir güvenlik test seti oluşturmak için Wallarm FAST'a aşağıdakilere ihtiyaç duyulur:
* Temel isteklerin proxy edildiği dağıtılmış bir FAST düğümü
* FAST düğümünün Wallarm bulutuna bağlanması 
* Temel bir istek
* Bir test politikası

Bir FAST düğümünü başarıyla dağıttınız ve [önceki bölümde][link-previous-chapter] buluta bağladınız. Bu bölümde bir temel istek ve [test politikası][gl-testpolicy] oluşturmak odak noktanız olacak.

![Kullanılan test şeması][img-test-scheme]

!!! info "Bir test politikasının oluşturulması"
    Her hedef uygulama için özelleştirilmiş bir politika oluşturmanız şiddetle önerilir. Ancak, Wallarm bulutunun otomatik olarak oluşturduğu varsayılan politikayı da kullanabilirsiniz. Bu belge, özel bir politika oluşturma sürecini size anlatırken, varsayılan politika bu kılavuzun kapsamı dışındadır.
    
Test ortamını ayarlamak için aşağıdakileri yapın:

1.  [Temel isteği hazırlayın][anchor1]
2.  [XSS açıklıklarına yönelik test politikası oluşturun][anchor2]
    
!!! info "Hedef uygulama"
    Bu örnekte hedef uygulama olarak [Google Gruyere][link-https-google-gruyere] kullanılmaktadır. Eğer temel isteği yerel uygulamanıza yapılandırırsanız, bu uygulamanın çalıştığı makinenin IP adresini Google Gruyere adresi yerine kullanın.
    
    IP adresini almak için `ifconfig` veya `ip addr` gibi araçları kullanabilirsiniz.
        
##  1.  Temel İsteği Hazırlama

1.  Temel istek [Google Gruyere][link-https-google-gruyere] uygulamasına yönelik oluşturulduğundan, ilk olarak uygulamanın sandbox halinde bir örneğini oluşturmalısınız. Daha sonra bu örneğin benzersiz tanımlayıcısını almalısınız.
    
    Bunun için bu [bağlantıya][link-https-google-gruyere-start] gidin. Google Gruyere örneğinin tanımlayıcısı size verilecek, bunu kopyalamalısınız. Hizmet şartlarını okuyun ve **Aagree & Start** düğmesini seçin.
    
    ![Google Gruyere start page][img-google-gruyere-startpage]

    Google Gruyere'nin izole örneği çalıştırılacak. Aşağıdaki adres üzerinden size erişilebilir olacaktır:
    
    `https://google-gruyere.appspot.com/<sizin örneğinizin ID'si>/`

2.  Google Gruyere uygulamasının örneğinize yönelik temel isteği oluşturun. Rehberde, geçerli bir istek kullanmanız önerilir.

    İstek aşağıdaki gibidir:

    ```
    https://google-gruyere.appspot.com/<sizin örneğinizin ID'si>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "İstek örneği"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  XSS Açıklıklarına Yönelik Test Politikası Oluşturma

1.  Daha önce [oluşturduğunuz][link-previous-chapter] hesap kullanılarak [My Wallarm portalı][link-wl-console]'na giriş yapın.

2.  “Test politikaları” sekmesini seçin ve **Test politikası oluştur** düğmesini tıklayın.

    ![Test politikası oluşturma][img-policy-screen]

3.  “Genel” sekmesinde politikaya anlamlı bir isim ve açıklama verin. Bu rehberde, `DEMO POLICY` isminin kullanılması önerilmektedir. 

    ![Test politika sihirbazı: “Genel” sekme][img-wizard-general]

4.  “Ekleme noktaları” sekmesinde, güvenlik test seti isteklerinin oluşturulması sırasında işleme alınabilecek [temel istek unsurları][gl-element] belirlenmelidir. Bu kılavuzun amacı için tüm GET parametrelerinin işlenmesine izin vermek yeterli olacaktır. Bunun için, “Nereye dahil edilecek” kısmına `GET_.*` ifadesini ekleyin. Bir politika oluştururken, FAST bazı parametrelerin işleme alınmasına varsayılan olarak izin verir. Bu parametreleri «—» simgesi ile silebilirsiniz.

    ![Test politika sihirbazı: “Ekleme Noktaları” sekme.][img-wizard-insertion-points]

5.  “Test Edilecek Saldırılar” sekmesinde, hedef uygulamadaki açıklığı sömürmek için bir saldırı türü seçin — XSS.

6.  En sağdaki sütunda politika önizlemesinin aşağıdakine benzer görünmesini sağlayın:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  Politikayı kaydetmek için  **Kaydet** düğmesini seçin.

8.  **Test politikalarına geri dön** düğmesini seçerek test politikası listesine geri dönün.
    
    
!!! info "Test politikası detayları"
    Test politikaları hakkında detaylı bilgiler [bağlantı][doc-policy-in-detail] üzerinden erişilebilir.

Şimdi Google Gruyere uygulamasına yönelik HTTPS temel isteğin ve XSS açıklıklarına yönelik test politikanın oluşturulmasını tamamlamış olmalısınız.