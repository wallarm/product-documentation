[ptrav-saldırı-belgeler]:                ../../attacks-vulns-list.md#path-traversal
[ui'deki-saldırılar-görüntü]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Fonksiyonları İle Azion Edge Firewall

[Azion Edge Fonksiyonları](https://www.azion.com/en/products/edge-functions/) ağ kenarında özel kodun çalıştırılmasını sağlar, müşteri taleplerini ele almak için müşteri kurallarının uygulanmasına olanak tanır. Wallarm özel kodu eklenerek, gelen trafik Wallarm düğümüne yönlendirilip analiz ve filtreleme için proxy olarak kullanılabilir. Bu yapılandırma, [Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/) tarafından zaten sağlanan güvenlik önlemlerini artırır. Bu rehber, Wallarm düğümünü Azion Edge ile entegre etmek için nasıl bir yol izlenmesi gerektiği hakkında bilgi verir.

Çözüm, Wallarm düğümünü dışarıda dağıtmayı ve özel kod veya politikaları belirli bir platforma yerleştirmeyi içerir. Bu, trafiğin potansiyel tehditlere karşı analiz ve koruma amacıyla dış Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın bağlayıcıları olarak adlandırılan bu durum, Azion Edge, Akamai Edge, Mulesoft, Apigee ve AWS Lambda gibi platformlar ile dış Wallarm düğümü arasındaki temel bağlantıyı sağlar. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini garanti eder.

## Kullanım durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım durumları için önerilen çözümdür:

* Azion Edge'de çalışan API'leri veya trafiği güvence altına almak.
* Kapsamlı saldırı gözlemleme, raporlama ve kötü amaçlı isteklerin anında bloke edilmesi sunan bir güvenlik çözümü gerektiren durumlar.

## Sınırlamalar

Çözümün, yalnızca gelen isteklerle çalışabilen belirli sınırlamaları vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi kullanılarak yapılan güvenlik açığı keşfi düzgün bir şekilde çalışmaz. Çözüm, bir API'nin test ettiği güvenlik açıklarına tipik olan kötü amaçlı isteklere sunucu yanıtlarına dayanarak olan bir güvenlik açığı olup olmadığını belirler.
* [Wallarm API Keşif](../../api-discovery/overview.md), çözümün yanıt analizine dayandığı için trafik üzerinde API envanterini keşfetme yeteneğine sahip olamaz.
* [Zoraki taramaya karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md), yanıt kodu analizi gerektirdiği için kullanılamaz.

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Azion Edge teknolojilerinin anlaşılması
* Azion Edge'de çalışan API'ler veya trafik.

## Dağıtım

Azion Edge'deki API'leri Wallarm ile güvence altına almak için aşağıdaki adımları izleyin:

1. Mevcut dağıtım seçeneklerinden birini kullanarak bir Wallarm düğümünü dağıtın.
1. Edge Fonksiyonları için Wallarm kodunu edinin ve Azion'da çalıştırın.

### 1. Wallarm bir düğüm dağıtın

Wallarm'ı Azion Edge'de kullanırken, trafik akış şeması [hat içi (inline)](../inline/overview.md)dir.

1. Hat içi (inline) dağıtım için [desteklenen Wallarm düğümü dağıtım çözümleri veya parçalarından](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
1. Dağıtılan düğümü aşağıdaki şablonda gösterildiği gibi yapılandırın:

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name yourdomain-for-wallarm-node.tld;

        ### SSL configuration here

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    Lütfen aşağıdaki yapılandırmalara dikkat edin:

    * HTTPS trafiği için TLS/SSL sertifikaları: Wallarm düğümünün güvenli HTTPS trafiğini yönetebilmesi için TLS/SSL sertifikalarını uygun şekilde yapılandırın. Belirli yapılandırma, seçilen dağıtım yöntemine bağlı olacaktır. Örneğin, NGINX kullanıyorsanız, yönergeler için [ilgili makaleye](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) bakabilirsiniz.
    * [Wallarm işlem modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.
1. Dağıtım tamamlandığında, gelen istek yönlendirmesi için adresi belirlemeye ihtiyacınız olacağı için düğüm örneği IP'sini not edin.

### 2. Edge Fonksiyonları için Wallarm kodunu edinin ve Azion'da çalıştırın

Azion Edge Fonksiyonları için Wallarm kodunu edinmek ve çalıştırmak için aşağıdaki adımları izleyin:

1. Wallarm kodunu almak için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Azion Edge'de, **Faturalama & Abonelikler** kısmına gidin ve **Application Acceleration** ve **Edge Functions** üzerinde aboneliği etkinleştir.
1. Yeni bir **Edge Application** oluşturun ve kaydedin.
1. Oluşturulan uygulamayı açın → ana ayarlara giderek **Application Acceleration** ve **Edge Functions**'ı etkinleştirin.
1. **Domain** kısmına gidin ve **Add Domain** tıklanır.
1. **Edge Functions** kısmına gidin, **Add Function** tıklayın ve `Edge Firewall` türünü seçin.
1. Wallarm kaynak kodunu yapıştırınız ve `wallarm.node.tld` yerine [daha önce dağıtılmış Wallarm düğümünün](#1-deploy-a-wallarm-node) adresini kullanın.
1. **Edge Firewall'a** gidin → **Add Rule Set** → **Name** türünü belirleyin→ **Domains** seçin ve **Edge Functions**'i açın.
1. **Functions** sekmesine geçin, **Add Function** tıklayın ve daha önce oluşturduğunuz fonksiyonu seçin.
1. **Rules Engine** sekmesine geçin → **New Rule** tıklayın ve Wallarm tarafından filtrelenmesi gereken trafiği belirleyin:

    * Tüm isteği analiz etmek ve filtrelemek için 'If Request URI starts with /' seçeneğini belirleyin.
    * **Behaviors (Davranışlar)** kısmında, `Then Run Function`ı seçin ve daha önce oluşturduğunuz fonksiyonu seçin.

## Test Etme

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize test [Path Traversal][ptrav-saldırı-belgeler] saldırısı ile bir istek gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Konsolu'nu açın → [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) içindeki **Events** bölümüne gidin ve saldırının listede göründüğünden emin olun.
    
    ![Arayüzdeki saldırılar][ui'deki-saldırılar-görüntü]

    Eğer Wallarm düğüm modu blokaj olarak ayarlandıysa, istek de bloke edilecektir.

## Yardıma mı ihtiyacınız var?

Wallarm ve Azion Edge ile birlikte belirtilen şekilde yapılan işlemler sırasında herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyacınız olursa, [Wallarm destek](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. İhtiyaç duyduğunuz rehberliği sağlarlar ve uygulama sürecinde karşılaştığınız herhangi bir problemi çözümlemek için yardımcı olurlar.