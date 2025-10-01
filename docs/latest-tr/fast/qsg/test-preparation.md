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
    
    
#   Test için ortamı yapılandırma

Bu bölüm, Google Gruyere uygulamasındaki XSS güvenlik açıklarını tespit etmek için FAST'in yapılandırılması sürecinde size rehberlik edecektir. Gerekli tüm adımları tamamladığınızda, XSS açıklarını bulmak amacıyla bir HTTPS temel isteğini FAST düğümü üzerinden proxy'lemek için hazır olacaksınız.

Bir güvenlik test seti oluşturmak için Wallarm FAST aşağıdakilere ihtiyaç duyar:
* Temel istekleri proxy'leyen, kurulmuş bir FAST düğümü
* FAST düğümünün Wallarm cloud'a bağlantısı 
* Bir temel istek
* Bir test politikası

[önceki bölümde][link-previous-chapter] bir FAST düğümünü başarıyla dağıttınız ve buluta bağladınız. Bu bölümde bir [test politikası][gl-testpolicy] ve bir temel istek oluşturmaya odaklanacaksınız.

![Kullanılan test şeması][img-test-scheme]

!!! info "Bir test politikası oluşturma"
    Test edilen her hedef uygulama için özel bir politika oluşturmanız şiddetle önerilir. Ancak, Wallarm cloud tarafından otomatik olarak oluşturulan varsayılan politikayı da kullanabilirsiniz. Bu belge, özel bir politika oluşturma sürecinde size rehberlik edecektir; varsayılan politika bu kılavuzun kapsamı dışındadır.
    
Test için ortamı hazırlamak üzere aşağıdakileri yapın:

1.  [Temel isteği hazırlayın][anchor1]
2.  [XSS güvenlik açıklarını hedefleyen test politikasını oluşturun][anchor2]
    
!!! info "Hedef uygulama"
    Bu örnekte hedef uygulama olarak [Google Gruyere][link-https-google-gruyere] kullanılmaktadır. Temel isteği yerel uygulamanıza oluşturuyorsanız, lütfen Google Gruyere adresi yerine bu uygulamayı çalıştıran makinenin IP adresini kullanın.
    
    IP adresini almak için `ifconfig` veya `ip addr` gibi araçları kullanabilirsiniz.
        
##  1.  Temel isteği hazırlayın

1.  Sağlanan temel istek [Google Gruyere][link-https-google-gruyere] uygulamasını hedeflediğinden, önce uygulamanın izole (sandbox) bir örneğini oluşturmalısınız. Ardından örneğin benzersiz tanımlayıcısını elde etmelisiniz.
    
    Bunu yapmak için şu [bağlantıya][link-https-google-gruyere-start] gidin. Size Google Gruyere örneğinin tanımlayıcısı verilecektir; bunu kopyalayın. Hizmet şartlarını okuyun ve **Agree & Start** düğmesini seçin.
    
    ![Google Gruyere başlangıç sayfası][img-google-gruyere-startpage]

    İzole Google Gruyere örneği çalıştırılacaktır. Aşağıdaki adres üzerinden size erişilebilir hale getirilecektir:
    
    `https://google-gruyere.appspot.com/<your instance ID>/`

2.  Google Gruyere uygulamasının kendi örneğinize temel isteği oluşturun. Bu kılavuzda meşru bir isteğin kullanılması önerilir.

    İstek aşağıdaki gibidir:

    ```
    https://google-gruyere.appspot.com/<your instance ID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "Bir istek örneği"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  XSS güvenlik açıklarını hedefleyen bir test politikası oluşturun

1.  [My Wallarm portal][link-wl-console] üzerinde, [daha önce][link-previous-chapter] oluşturduğunuz hesapla oturum açın.

2.  “Test policies” sekmesini seçin ve **Create test policy** düğmesine tıklayın.

    ![Test politikası oluşturma][img-policy-screen]

3.  “General” sekmesinde, politika için anlamlı bir ad ve açıklama belirleyin. Bu kılavuzda `DEMO POLICY` adını kullanmanız önerilir. 

    ![Test politikası sihirbazı: “General” sekmesi.][img-wizard-general]

4.  “Insertion points” sekmesinde, güvenlik test seti istekleri oluşturulurken işlenmeye uygun [temel istek öğelerini][gl-element] belirleyin. Bu kılavuzun amaçları için tüm GET parametrelerinin işlenmesine izin vermek yeterlidir. Bunu sağlamak için “Where to include” bloğuna `GET_.*` ifadesini ekleyin. Bir politika oluştururken, FAST varsayılan olarak bazı parametrelerin işlenmesine izin verir. Bunları «—» simgesini kullanarak silebilirsiniz.

    ![Test politikası sihirbazı: “Insertion points” sekmesi.][img-wizard-insertion-points]

5.  “Attacks to test” sekmesinde, hedef uygulamadaki güvenlik açığından yararlanmak için tek bir saldırı türü seçin — XSS.

6.  En sağdaki sütundaki politika önizlemesinin aşağıdaki gibi göründüğünden emin olun:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  Politikayı kaydetmek için **Save** düğmesini seçin.

8.  **Back to test policies** düğmesini seçerek test politikası listesine geri dönün.
    
    
!!! info "Test politikası ayrıntıları"
    Test politikaları hakkında ayrıntılı bilgi şu [bağlantıda][doc-policy-in-detail] mevcuttur.

Artık Google Gruyere uygulamasına yönelik HTTPS temel isteği ve XSS güvenlik açıklarını hedefleyen test politikası ile bu bölümün tüm hedeflerini tamamlamış olmalısınız.