[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkers ile Wallarm Kod Paketi

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs), özel mantığın çalıştırılmasına ve platformun kenarında hafif JavaScript işlevlerinin dağıtılmasına olanak sağlayan güçlü bir kenar bilgi işlem platformudur. API'leri ve trafiği Akamai EdgeWorkers üzerinde çalışan müşteriler için Wallarm, altyapılarını güvence altına almak için Akamai EdgeWorkers'ta dağıtılabilen bir kod paketi sağlar.

Çözüm, Wallarm düğümünü dışarıda dağıtmayı ve özel kod veya politikaları belirli bir platforma yerleştirmeyi içerir. Bu, trafikin analiz ve olası tehditlere karşı koruma için dış Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın bağlayıcıları olarak adlandırılan bu üniteler, Azion Edge, Akamai Edge, Mulesoft, Apigee ve AWS Lambda gibi platformlar ile dış Wallarm düğümü arasındaki önemli bağlantıyı oluşturur. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini garanti eder.

## Kullanım senaryoları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım durumları için önerilir:

* Akamai EdgeWorkers'ta çalışan API'leri veya trafiği güvence altına alma.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellenmesini sunan bir güvenlik çözümü gerektirir.

## Kısıtlamalar

Çözüm, sadece gelen isteklerle çalıştığı için belirli kısıtlamalar vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemiyle güvenlik açığı bulma düzgün çalışmaz. Çözüm, sunucunun tipik olarak test ettiği güvenlik açıkları için kötü amaçlı isteklere yanıtlara dayanarak bir API'nin güvenlik açığına sahip olup olmadığını belirler.
* [Wallarm API Keşfi](../../api-discovery/overview.md), yanıt analizine dayandığından sizin trafiğinize dayalı API envanterini keşfedemez.
* Yanıt kodu analizi gerektirdiğinden, [zorla gezinmeye karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

Ayrıca, [EdgeWorkers ürün kısıtlamaların](https://techdocs.akamai.com/edgeworkers/docs/limitations) ve [http-istek](https://techdocs.akamai.com/edgeworkers/docs/http-request) tarafından da neden olunan kısıtlamalar vardır:

* Tek desteklenen trafik teslimat yöntemi gelişmiş TLS'dir.
* Maksimum yanıt başlığı boyutu 8000 bayttır.
* Maksimum gövde boyutu 1 MB'dir.
* Desteklenmeyen HTTP yöntemleri: `CONNECT`, `TRACE`, `OPTIONS` (desteklenen yöntemler: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* Desteklenmeyen başlıklar: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## Gereklilikler

Dağıtım işlemine devam etmek için aşağıdaki gereklilikleri karşıladığınızdan emin olun:

* Akamai EdgeWorkers teknolojilerinin anlaşılması
* Akamai EdgeWorkers üzerinden çalışan API'ler veya trafik.

## Dağıtım

Akamai EdgeWorkers üzerinde API'leri Wallarm ile güvence altına almak için bu adımları uygulayın:

1. Kullanılabilir dağıtım seçeneklerinden birini kullanarak bir Wallarm düğümü dağıtın.
1. Wallarm kod paketini alın ve onu Akamai EdgeWorkers'ta çalıştırın.

### 1. Wallarm düğümünü dağıtma

Wallarm, Akami EdgeWorkers'ta kullanılırken, trafik akışı [hat üzerinde](../inline/overview.md) olacaktır.

1. Hat üzerinde dağıtım için [desteklenen Wallarm düğümü dağıtım çözümlerinden veya eserlerden](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
1. Dağıtılan düğümü aşağıdaki şablonu kullanarak yapılandırın:

    ```
    sunucu {
        dinle 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        konum / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    sunucu {
        dinle 443 ssl;

        sunucu_adı yourdomain-for-wallarm-node.tld;

        ### SSL yapılandırması burada

        erişim_log off;
        wallarm_yöntemi off;

        konum / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    sunucu {
        dinle unix:/tmp/wallarm-nginx.sock;
        
        sunucu_adı _;
        
        wallarm_modu izleme;
        #wallarm_modu engelleme;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        konum / {
            echo_read_request_body;
        }
    }
    ```

    Lütfen aşağıdaki yapılandırmalara dikkat edin:

    * HTTPS trafiği için TLS/SSL sertifikaları: Wallarm düğümünün güvenli HTTPS trafiğini işleyebilmesi için TLS/SSL sertifikalarını buna göre yapılandırın. Belirli yapılandırma, seçilen dağıtım yöntemine bağlı olacaktır. Örneğin, NGINX kullanıyorsanız, yönerge için [kendi makalesine](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) başvurabilirsiniz.
    * [Wallarm işlem modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.
1. Dağıtım tamamlandıktan sonra, gelen istek yönlendirmesi için adresi ayarlamak üzere daha sonra ihtiyaç duyacağınız düğüm örneği IP'sini not edin.

### 2. Wallarm kod paketini alın ve Akamai EdgeWorkers'ta çalıştırın

Wallarm kod paketini almak ve Akamai EdgeWorkers'ta [çalıştırmak](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) için aşağıdaki adımları izleyin:

1. Wallarm kod paketini almak için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. EdgeWorkers'ları Akamai kontratınıza [ekleyin](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract).
1. Bir EdgeWorker ID'si [oluşturun](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id).
1. Oluşturulan ID'yi açın, **Sürüm Oluştur** düğmesine basın ve Wallarm kod paketini [yükleyin](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1).
1. Oluşturulan sürümü **etkinleştirin**, öncelikle sahne ortamında.
1. Her şeyin doğru çalıştığını onayladıktan sonra, sürüm yayınlamayı üretim ortamında tekrarlayın.
1. **Akamai Property Manager'de**, Wallarm'ı kurmak istediğiniz yeni bir özellik seçin veya oluşturun.
1. Yeni oluşturulan EdgeWorker ile yeni davranış [oluşturun](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1), örneğin **Wallarm Edge** adını verin ve aşağıdaki kriterleri ekleyin:

    ```
    Eğer
    İstek Başlık
    X-EDGEWRK-REAL-IP 
    mevcut değil
    ```
1. **Wallarm Düğümü** adında bir davranış daha oluşturun; **Köken Sunucusu**, [daha önce dağıtılan düğüme](#1-deploy-a-wallarm-node) işaret etsin. **Host Başlığını İlet** seçeneğini **Köken Host Adı**na geçirin ve aşağıdaki kriterleri ekleyin:

    ```
    Eğer
    İstek Başlık
    X-EDGEWRK-REAL-IP 
    var
    ```
1. Yeni özellik değişkeni `PMUSER_WALLARM_MODE` ekleyin; [değer](../../admin-en/configure-wallarm-mode.md) `monitoring` (varsayılan) veya `block`.

    Güvenlik ayarları için **Hidden** seçeneğini seçin.
1. Yeni sürümü kaydedin ve ilk olarak sahne ortamında, ve [sonra](https://techdocs.akamai.com/api-acceleration/docs/test-stage) üretimde dağıtın.

## Test Etme

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize bir test [Yol Gezinme][ptrav-attack-docs] saldırısı ile istekte bulunun:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Konsolu → [ABD Bulutu](https://us1.my.wallarm.com/search) veya [AB Bulutu](https://my.wallarm.com/search) üzerinde **Olaylar** bölümünü açın ve saldırının listede göründüğünden emin olun.

    ![Arayüzdeki saldırılar][attacks-in-ui-image]

    Wallarm düğüm modu engellenmeye ayarlandıysa, talep de engellenecektir.

## Yardıma mı ihtiyacınız var?

Akamai EdgeWorkers ile birlikte Wallarm'ın tarif edilen dağıtımı konusunda herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyacınız olursa, [Wallarm destek](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Uygulama sürecinde karşılaşabileceğiniz herhangi bir sorunu çözmenize ve rehberlik etmenize yardımcı olabilirler.
