```markdown
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
    
    
#   Test Ortamının Ayarlanması

Bu bölüm, Google Gruyere uygulamasında XSS açıklarını tespit etmek için FAST’in yapılandırılması sürecinde sizi adım adım yönlendirecektir. Gerekli tüm adımları tamamladıktan sonra, XSS açıklarını bulmak amacıyla FAST düğümü üzerinden HTTPS baseline isteğini proxy’leyebileceksiniz.

Wallarm FAST’in bir güvenlik test seti oluşturabilmesi için aşağıdakilere ihtiyaç vardır:
* Baseline istekleri proxy’leyen dağıtılmış bir FAST düğümü
* FAST düğümünün Wallarm cloud ile bağlantısı
* Bir baseline isteği
* Bir test politikası

[Önceki bölüm][link-previous-chapter]de başarılı bir şekilde bir FAST düğümü dağıttınız ve cloud’a bağlandınız. Bu bölümde [test politikası][gl-testpolicy] ve bir baseline isteği oluşturmaya odaklanacaksınız.

![Kullanımdaki test şeması][img-test-scheme]

!!! info "Test Politikası Oluşturma"
    Her hedef uygulama için özel bir politika oluşturmanız şiddetle tavsiye edilir. Ancak, Wallarm cloud tarafından otomatik olarak oluşturulan varsayılan politikayı da kullanabilirsiniz. Bu doküman, özel bir politikanın oluşturulması sürecinde size rehberlik ederken, varsayılan politika bu kılavuzun kapsamı dışındadır.
    
Test ortamını ayarlamak için aşağıdakileri yapın:

1.  [Baseline isteğini hazırla][anchor1]
2.  [XSS açıklarına yönelik test politikası oluştur][anchor2]
    
!!! info "Hedef Uygulama"
    Mevcut örnekte hedef uygulama olarak [Google Gruyere][link-https-google-gruyere] kullanılmaktadır. Baseline isteğini yerel uygulamanıza oluşturuyorsanız, lütfen Google Gruyere adresi yerine uygulamayı çalıştıran makinenin IP adresini kullanın.
    
    IP adresini öğrenmek için `ifconfig` veya `ip addr` gibi araçları kullanabilirsiniz.
        
##  1.  Baseline İsteğini Hazırlama

1.  Sağlanan baseline isteği [Google Gruyere][link-https-google-gruyere] uygulamasını hedef aldığından, öncelikle uygulamanın sandbox ortamında çalışan bir örneğini oluşturmalısınız. Daha sonra, bu örneğin benzersiz tanımlayıcısını almalısınız.
    
    Bunun için, bu [link] [link-https-google-gruyere-start]e gidin. Google Gruyere örneğinin tanımlayıcısı ekrana gelecektir; bunu kopyalayın. Hizmet şartlarını okuyun ve **Agree & Start** butonuna tıklayın.
    
    ![Google Gruyere başlangıç sayfası][img-google-gruyere-startpage]

    İzole edilmiş Google Gruyere örneği çalıştırılacaktır. Size şu adres üzerinden erişilebilir hale gelecektir:
    
    `https://google-gruyere.appspot.com/<your instance ID>/`

2.  Google Gruyere uygulamanızın örneğine yönelik baseline isteğini oluşturun. Kılavuz, yasal bir isteğin kullanılmasını önermektedir.

    İstek şu şekildedir:

    ```
    https://google-gruyere.appspot.com/<your instance ID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "Bir istek örneği"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  XSS Açıklarına Yönelik Test Politikası Oluşturma

1.  [My Wallarm portalına][link-wl-console] daha önce oluşturduğunuz hesapla giriş yapın [önceki bölüm][link-previous-chapter]de.
    
2.  “Test policies” sekmesini seçin ve **Create test policy** butonuna tıklayın.

    ![Test politikası oluşturma ekranı][img-policy-screen]

3.  “General” sekmesinde, politika için anlamlı bir isim ve açıklama belirleyin. Bu kılavuzda, `DEMO POLICY` isminin kullanılması önerilmektedir. 

    ![Test policy sihirbazı: “General” sekmesi.][img-wizard-general]

4.  “Insertion points” sekmesinde, güvenlik test seti istekleri oluşturulurken işleme alınmaya uygun olan [baseline istek elemanlarını][gl-element] ayarlayın. Bu kılavuzun amaçları için, tüm GET parametrelerinin işlenmesine izin vermek yeterlidir. Bunu sağlamak için, “Where to include” bölümüne `GET_.*` ifadesini ekleyin. Bir politika oluşturulurken, FAST bazı parametreleri varsayılan olarak işler. Bunları «—» simgesini kullanarak silebilirsiniz.

    ![Test policy sihirbazı: “Insertion points” sekmesi.][img-wizard-insertion-points]

5.  “Attacks to test” sekmesinde, hedef uygulamadaki açığı istismar etmek için XSS saldırı türünü seçin.

6.  Sağdaki sütunda bulunan politika önizlemesinin aşağıdaki gibi göründüğünden emin olun:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  Politikayı kaydetmek için **Save** butonuna tıklayın.

8.  **Back to test policies** butonuna tıklayarak test politikaları listesine geri dönün.
    
    
!!! info "Test Politikası Detayları"
    Test politikaları hakkında detaylı bilgi [link][doc-policy-in-detail] üzerinden mevcuttur.

Artık Google Gruyere uygulamasına yönelik HTTPS baseline isteğiniz ve XSS açıklarına odaklanan test politikanız ile bölümdeki tüm hedeflerinizi tamamlamış olmalısınız.
```