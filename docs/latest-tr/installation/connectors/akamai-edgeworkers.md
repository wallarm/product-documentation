[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Kod Paketi ile Akamai EdgeWorkers

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs), platformun kenarında özel mantık çalıştırmaya ve hafif JavaScript işlevlerini dağıtmaya imkan veren güçlü bir edge computing platformudur. API'leri ve trafiği Akamai EdgeWorkers üzerinde çalışan müşteriler için Wallarm, altyapılarınızı korumak amacıyla Akamai EdgeWorkers üzerinde dağıtılabilecek bir kod paketi sunar.

Çözüm, Wallarm node'unun harici olarak dağıtılmasını ve özel kod ya da politikaların belirli platforma enjekte edilmesini içerir. Bu, trafiğin analiz ve potansiyel tehditlere karşı koruma sağlamak amacıyla harici Wallarm node'una yönlendirilmesini sağlar. Wallarm'ın konektörleri olarak adlandırılan bu yapı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile harici Wallarm node arasında hayati bir bağlantı görevi görür. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliği sağlar.

## Kullanım Senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım senaryoları için önerilmektedir:

* Akamai EdgeWorkers üzerinde çalışan API'lerin veya trafiğin korunması.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellenmesini sağlayan bir güvenlik çözümü gereksinimi.

## Sınırlamalar

Çözüm, yalnızca gelen isteklere çalıştığından dolayı bazı sınırlamalara sahiptir:

* [Pasif algılama](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi ile açıklık tespiti düzgün çalışmaz. Çözüm, test ettiği açıklıklara özgü kötü niyetli isteklere sunucunun verdiği yanıtlara dayanarak bir API'nin açık olup olmadığını belirler.
* [Wallarm API Discovery](../../api-discovery/overview.md), çözümün yanıt analizi yapmasına dayanması nedeniyle trafiğinize dayalı API envanterini keşfedemez.
* [Zorla taramaya karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir, çünkü bu durum yanıt kodu analizini gerektirir.

Ayrıca, [EdgeWorkers ürün sınırlamaları](https://techdocs.akamai.com/edgeworkers/docs/limitations) ve [http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request) kaynaklı sınırlamalar da vardır:

* Desteklenen tek trafik iletim yöntemi gelişmiş TLS’dir.
* Maksimum yanıt başlık boyutu 8000 bayttır.
* Maksimum gövde boyutu 1 MB'dır.
* Desteklenmeyen HTTP yöntemleri: `CONNECT`, `TRACE`, `OPTIONS` (desteklenen yöntemler: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* Desteklenmeyen başlıklar: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimlerin karşılandığından emin olun:

* Akamai EdgeWorkers teknolojilerinin anlaşılması
* Akamai EdgeWorkers üzerinden akan API'ler veya trafik.

## Dağıtım

Akamai EdgeWorkers üzerinde API'lerinizi Wallarm ile korumak için aşağıdaki adımları izleyin:

1. Mevcut dağıtım seçeneklerinden biriyle bir Wallarm node'u dağıtın.
1. Wallarm kod paketini elde edin ve bunu Akamai EdgeWorkers üzerinde çalıştırın.

### 1. Bir Wallarm node'u dağıtın

Akamai EdgeWorkers üzerinde Wallarm kullanırken, trafik akışı [in-line](../inline/overview.md) şeklindedir.

1. In-line dağıtım için [desteklenen Wallarm node dağıtım çözümlerinden veya artefaktlarından](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
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
    * [Wallarm çalışma modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.
1. Dağıtım tamamlandıktan sonra, gelen istek yönlendirmesi için daha sonra ihtiyacınız olacak node örneği IP'sini not alın.

### 2. Wallarm kod paketini edinin ve Akamai EdgeWorkers üzerinde çalıştırın

Akamai EdgeWorkers üzerinde Wallarm kod paketini edinmek ve [çalıştırmak](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) için aşağıdaki adımları izleyin:

1. Wallarm kod paketini edinmek için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Akamai üzerindeki sözleşmenize [EdgeWorkers ekleyin](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract).
1. Bir EdgeWorker ID [oluşturun](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id).
1. Oluşturulan ID'yi açın, **Create Version** tuşuna basın ve Wallarm kod paketini [yükleyin](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1).
1. Oluşturulan versiyonu, önce staging ortamında **Activate** edin.
1. Her şeyin düzgün çalıştığını onayladıktan sonra, versiyon yayınlamasını production ortamında tekrarlayın.
1. **Akamai Property Manager**'da, Wallarm'ı kurmak istediğiniz mevcut ya da yeni bir mülk seçin veya oluşturun.
1. Yeni oluşturulan EdgeWorker ile yeni bir davranış [oluşturun](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1), örneğin adı **Wallarm Edge** olsun ve aşağıdaki kriterleri ekleyin:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1. **Wallarm Node** adında başka bir davranış oluşturun, **Origin Server** olarak [önceden dağıtılan node'unu](#1-deploy-a-wallarm-node) işaret edin. **Forward Host Header**'ı **Origin Hostname** olarak değiştirin ve aşağıdaki kriterleri ekleyin:

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. Yeni bir mülk değişkeni `PMUSER_WALLARM_MODE` ekleyin ve [değerini](../../admin-en/configure-wallarm-mode.md) `monitoring` (varsayılan) ya da `block` olarak belirleyin.
    
    Güvenlik ayarları için **Hidden** seçeneğini seçin.
1. Yeni versiyonu kaydedin ve önce staging ortamına, ardından [production'a](https://techdocs.akamai.com/api-acceleration/docs/test-stage) dağıtın.

## Test

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede gösterildiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm node modu blocking olarak ayarlandıysa, istek de engellenecektir.

## Yardım Gerekli mi?

Akamai EdgeWorkers ile birlikte anlatılan Wallarm dağıtımı sırasında herhangi bir sorunla karşılaşırsanız veya yardım gerekirse, [Wallarm support](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Onlar, uygulama süreci esnasında karşılaşabileceğiniz problemleri gidermek ve rehberlik sağlamak için hizmetinizdedir.