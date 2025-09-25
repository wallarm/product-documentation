[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Functions ile Azion Edge Firewall

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/), özel kodu ağın kenarında çalıştırmayı mümkün kılarak istekleri işlemek için özel kuralların uygulanmasını sağlar. Wallarm özel kodu entegre edilerek gelen trafik analiz ve filtreleme için Wallarm node üzerinden proxy’lenebilir. Bu kurulum, zaten [Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/) tarafından sağlanan güvenlik önlemlerini güçlendirir. Bu kılavuz, Azion Edge üzerinde çalışan hizmetleri korumak için Wallarm node’unu Azion Edge ile nasıl entegre edeceğinize ilişkin talimatlar sağlar.

Çözüm, Wallarm node’unun harici olarak dağıtılmasını ve belirli platforma özel kod veya politikaların enjekte edilmesini içerir. Bu sayede trafik, potansiyel tehditlere karşı analiz ve koruma için harici Wallarm node’una yönlendirilebilir. Wallarm’ın bağlayıcıları (connectors) olarak adlandırılan bu bileşenler, Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile harici Wallarm node’u arasında temel bağlantıyı sağlar. Bu yaklaşım kesintisiz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliği sağlar.

## Kullanım senaryoları

Bu çözüm aşağıdaki kullanım senaryoları için önerilir:

* Azion Edge üzerinde çalışan API’lerin veya trafiğin güvenliğini sağlamak.
* Kapsamlı saldırı gözlemi, raporlama ve kötü amaçlı isteklerin anında engellenmesini sunan bir güvenlik çözümüne ihtiyaç duyulması.

## Sınırlamalar

Çözümün yalnızca gelen isteklerle çalışması nedeniyle bazı sınırlamaları vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemiyle zafiyet keşfi düzgün çalışmaz. Çözüm, test ettiği zafiyetlere tipik kötü amaçlı isteklere verilen sunucu yanıtlarına dayanarak bir API’nin savunmasız olup olmadığını belirler.
* [Wallarm API Discovery](../../api-discovery/overview.md), çözüm yanıt analizine dayandığı için trafiğinize göre API envanterini keşfedemez.
* Yanıt kodu analizine ihtiyaç duyduğundan [zorla gezinmeye karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Azion Edge teknolojilerine hakimiyet
* Azion Edge üzerinde çalışan API’ler veya trafik.

## Dağıtım

Azion Edge üzerindeki API’leri Wallarm ile güvenceye almak için şu adımları izleyin:

1. Kullanılabilir dağıtım seçeneklerinden birini kullanarak bir Wallarm node dağıtın.
1. Edge Functions için Wallarm kodunu edinin ve Azion üzerinde çalıştırın.

<a id="1-deploy-a-wallarm-node"></a>
### 1. Bir Wallarm node dağıtın

Azion Edge üzerinde Wallarm kullanırken, trafik akışı [in-line](../inline/overview.md) olur.

1. Hat içi dağıtım için [desteklenen Wallarm node dağıtım çözümlerinden veya yapıtlarından](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
1. Dağıtılan node’u aşağıdaki şablona göre yapılandırın:

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

        ### SSL yapılandırması burada

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

    * HTTPS trafiği için TLS/SSL sertifikaları: Wallarm node’unun güvenli HTTPS trafiğini işleyebilmesi için TLS/SSL sertifikalarını uygun şekilde yapılandırın. Belirli yapılandırma seçilen dağıtım yöntemine bağlı olacaktır. Örneğin NGINX kullanıyorsanız, yol gösterici olması için [ilgili makalesine](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) bakabilirsiniz.
    * [Wallarm çalışma modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.
1. Dağıtım tamamlandığında, gelen istek yönlendirme adresini daha sonra ayarlamak için node örneğinin IP’sini not edin.

### 2. Edge Functions için Wallarm kodunu edinin ve Azion üzerinde çalıştırın

Azion Edge Functions için Wallarm kodunu edinmek ve çalıştırmak için şu adımları izleyin:

1. Wallarm kodunu edinmek için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Azion Edge üzerinde, **Billing & Subscriptions** bölümüne gidin ve **Application Acceleration** ile **Edge Functions** aboneliğini etkinleştirin.
1. Yeni bir **Edge Application** oluşturun ve kaydedin.
1. Oluşturulan uygulamayı açın → **Main Settings** ve **Application Acceleration** ile **Edge Functions**’ı etkinleştirin.
1. **Domains** bölümüne gidin ve **Add Domain**’a tıklayın.
1. **Edge Functions**’a gidin, **Add Function**’a tıklayın ve `Edge Firewall` türünü seçin.
1. Wallarm kaynak kodunu yapıştırın ve `wallarm.node.tld` alanını [önceden dağıtılmış Wallarm node’unun](#1-deploy-a-wallarm-node) adresiyle değiştirin.
1. **Edge Firewall** → **Add Rule Set** → **Name** yazın → **Domains** seçin ve **Edge Functions**’ı açın.
1. **Functions** sekmesine geçin, **Add Function**’a tıklayın ve daha önce oluşturulan fonksiyonu seçin.
1. **Rules Engine** sekmesine geçin → **New Rule** ve trafiğin Wallarm tarafından filtrelenmesi için kriterleri ayarlayın:

    * Tüm istekleri analiz etmek ve filtrelemek için `If Request URI starts with /` seçin.
    * **Behaviors** içinde `Then Run Function` seçin ve daha önce oluşturulan fonksiyonu seçin.

## Test

Dağıtılan politikanın işlevselliğini test etmek için şu adımları izleyin:

1. API’nize test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Arayüzde Attacks][attacks-in-ui-image]

    Wallarm node modu engelleme olarak ayarlanmışsa, istek de engellenecektir.

## Yardıma mı ihtiyacınız var?

Azion Edge ile birlikte Wallarm’ın bu şekilde dağıtımı sırasında herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyaç duyarsanız, [Wallarm desteği](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Uygulama sırasında karşılaşabileceğiniz sorunları çözmenize yardımcı olmak için rehberlik sağlarlar.