[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Functions ile Azion Edge Firewall

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/) ağ kenarında özel kod çalıştırılmasına olanak tanır ve böylece müşteriye özel kuralların istekleri işlemesi sağlanır. Wallarm özel kodunun dahil edilmesiyle, gelen trafik analiz ve filtreleme için Wallarm node'una proxy yapılabilir. Bu yapılandırma, [Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/) tarafından sağlanan güvenlik önlemlerini artırır. Bu kılavuz, Azion Edge üzerinde çalışan servisleri korumak için Wallarm node'u ile Azion Edge entegrasyonunun nasıl gerçekleştirileceğini anlatmaktadır.

Çözüm, Wallarm node'unun harici olarak dağıtılmasını ve belirli platforma özel özel kod veya politikaların enjekte edilmesini içerir. Bu şekilde, trafik potansiyel tehditlere karşı analiz ve korunma amacıyla harici Wallarm node'una yönlendirilebilir. Wallarm'ın konektörleri olarak adlandırılan bu yapı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile harici Wallarm node'u arasındaki temel bağlantıyı oluşturur. Bu yaklaşım, sorunsuz entegrasyonu, güvenli trafik analizini, risk azaltımını ve genel platform güvenliğini sağlar.

## Kullanım Senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım senaryoları için önerilmektedir:

* Azion Edge üzerinde çalışan API'leri veya trafiği korumak.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellenmesini sunan bir güvenlik çözümüne ihtiyaç duymak.

## Sınırlamalar

Bu çözümün yalnızca gelen isteklerle çalışması nedeniyle bazı sınırlamaları bulunmaktadır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi kullanılarak yapılan zafiyet keşfi düzgün çalışmaz. Çözüm, test ettiği zafiyetler için tipik olan kötü niyetli isteklere verilen sunucu yanıtlarına dayanarak bir API'nin savunmasız olup olmadığını belirler.
* [Wallarm API Discovery](../../api-discovery/overview.md), çözüm yanıt analizine dayandığından trafiğinize göre API envanterini keşfedemez.
* Yanıt kodu analizini gerektirdiğinden [zorunlu taramaya karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimlerin karşılandığından emin olun:

* Azion Edge teknolojilerinin anlaşılması
* Azion Edge üzerinde çalışan API'ler veya trafik.

## Dağıtım

Wallarm ile Azion Edge üzerindeki API'leri güvence altına almak için aşağıdaki adımları takip edin:

1. Mevcut dağıtım seçeneklerinden biriyle bir Wallarm node'u dağıtın.
1. Edge Functions için Wallarm kodunu edinin ve Azion üzerinde çalıştırın.

### 1. Bir Wallarm node'u dağıtın

Azion Edge üzerinde Wallarm kullanırken, trafik akışı [in-line](../inline/overview.md) şeklindedir.

1. In-line dağıtım için mevcut [desteklenen Wallarm node dağıtım çözümleri veya artefaktlarından](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
1. Dağıtılan node'u aşağıdaki şablonu kullanarak yapılandırın:

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

    * HTTPS trafiği için TLS/SSL sertifikaları: Wallarm node'unun güvenli HTTPS trafiğini işleyebilmesi için TLS/SSL sertifikalarını uygun şekilde yapılandırın. Belirli yapılandırma, seçilen dağıtım yöntemine bağlı olacaktır. Örneğin, NGINX kullanıyorsanız, rehberlik için [bu makaleye](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) bakabilirsiniz.
    * [Wallarm işletim modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.
1. Dağıtım tamamlandıktan sonra, ileride gelen istek yönlendirmesi için node örneği IP adresini not alın.

### 2. Edge Functions için Wallarm kodunu edinin ve Azion'da çalıştırın

Azion Edge Functions için Wallarm kodunu edinmek ve çalıştırmak için aşağıdaki adımları izleyin:

1. Wallarm kodunu edinmek için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Azion Edge üzerinde, **Billing & Subscriptions** bölümüne gidin ve **Application Acceleration** ile **Edge Functions** aboneliğini aktive edin.
1. Yeni bir **Edge Application** oluşturun ve kaydedin.
1. Oluşturulan uygulamayı açın → **Main Settings** bölümüne gidin ve **Application Acceleration** ile **Edge Functions**'ı etkinleştirin.
1. **Domains** bölümüne gidin ve **Add Domain** seçeneğine tıklayın.
1. **Edge Functions** bölümüne gidin, **Add Function** seçeneğine tıklayın ve `Edge Firewall` türünü seçin.
1. Wallarm kaynak kodunu yapıştırın ve `wallarm.node.tld` kısmını [önceden dağıtılan Wallarm node'unun](#1-deploy-a-wallarm-node) adresi ile değiştirin.
1. **Edge Firewall** bölümüne gidin → **Add Rule Set** → **Name** alanına bir isim verin → **Domains**'i seçin ve **Edge Functions**'ı açın.
1. **Functions** sekmesine geçin, **Add Function** seçeneğine tıklayın ve daha önce oluşturulan fonksiyonu seçin.
1. **Rules Engine** sekmesine geçin → **New Rule** seçeneğine tıklayın ve Wallarm tarafından trafiğin filtrelenmesi için kriterleri belirleyin:

    * Tüm isteği analiz etmek ve filtrelemek için, `If Request URI starts with /` seçeneğini belirleyin.
    * **Behaviors** bölümünde, `Then Run Function` seçeneğini seçin ve daha önce oluşturulan fonksiyonu seçin.

## Test

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize, test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console'u açın → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerindeki **Attacks** bölümünü kontrol edin ve saldırının listede görüntülendiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm node modu block (engelleme) olarak ayarlanmışsa, istek de engellenecektir.

## Yardıma mı ihtiyacınız var?

Açıklanan Wallarm ve Azion Edge entegrasyonu sırasında herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyaç duyarsanız, [Wallarm support](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Uygulama süreci sırasında karşılaşabileceğiniz sorunların giderilmesi için rehberlik sağlamaya hazırdırlar.