[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Politikasıyla MuleSoft

[MuleSoft](https://www.mulesoft.com/), müşteri uygulamalarının API'lere erişim noktası olarak hizmet veren bir API ağ geçidi ile hizmetler arasında kesintisiz bağlantı ve veri entegrasyonunu sağlayan bir entegrasyon platformudur. Wallarm ile, Wallarm politikasını kullanarak MuleSoft AnyPoint platformunda API'leri güvence altına alabilirsiniz. Bu makale, politikayı nasıl ekleyip kullanacağınızı açıklar.

Aşağıdaki diyagram, Wallarm politikası MuleSoft AnyPoint platformunda API'lere ekli olduğunda ve Wallarm kötü niyetli aktiviteyi engellemek için yapılandırıldığında yüksek seviye trafik akışını gösterir.

![MuleSoft ile Wallarm politikası](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

Çözüm, Wallarm düğümünü harici olarak dağıtmayı ve belirli bir platforma özelleşmiş kodlar veya politikalar eklemeyi içerir. Bu, trafiğin potansiyel tehditlere karşı analiz ve koruma için harici Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın bağlayıcıları olarak adlandırılan bu özellikler Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile harici Wallarm düğümü arasındaki esas bağlantıyı oluştururlar. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini sağlar.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım durumları için önerilir:

* Yalnızca bir politika ile MuleSoft AnyPoint platformunda dağıtılan API'leri güvence altına alma.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellendiği bir güvenlik çözümü gerektiren durumlar için.

## Sınırlamalar

Çözüm, yalnızca gelen isteklerle çalıştığı için belirli sınırlamalara sahiptir:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemiyle güvenlik açığı keşfi düzgün çalışmaz. Çözüm, denediği güvenlik açıklarına tipik olan kötü amaçlı isteklere sunucu yanıtlarına dayanarak bir API'nin savunmasız olup olmadığını belirler.
* [Wallarm API Keşfi](../../api-discovery/overview.md), çözümün yanıt analizine dayandığı için trafik üzerinden API envanterini keşfedemez.
* Yanıt kodu analizini gerektirdiği için [zorlanmış göz atma karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Mulesoft platformunun anlaşılması.
* [Maven ('mvn')](https://maven.apache.org/install.html) 3.8 veya daha önce bir sürümünün yüklenmiş olması. Maven'in daha yüksek sürümleri Mule eklentisi ile uyumluluk sorunları yaşayabilir.
* Organizasyonunuzun MuleSoft AnyPoint Platform hesabına sanat eserlerini yüklemenize olanak sağlayan MuleSoft Exchange katılımcı rolüne sahip olmanız gerekmektedir.
* [MuleSoft Exchange kimlik bilgilerinizin (kullanıcı adı ve parola)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) `<MAVEN_DIRECTORY>/conf/settings.xml` dosyasında belirtildiğinden emin olun.
* Uygulamanızın ve API'nizin MuleSoft'ta bağlantılı ve çalışır durumda olduğundan emin olun.

## Dağıtım

MuleSoft AnyPoint platformunda API'lere Wallarm politikasını kullanarak güvenlik sağlamak için aşağıdaki adımları izleyin:

1. Kullanılabilir dağıtım seçeneklerinden birini kullanarak bir Wallarm düğümü dağıtın.
1. Wallarm politikasını elde edin ve Mulesoft Exchange'e yükleyin.
1. Wallarm politikasını API'nize ekleyin.

### 1. Bir Wallarm düğümü dağıtın

Wallarm politikası kullanılırken, trafik akışı [hatta](../inline/overview.md) dir.

1. Hatta dağıtım için [desteklenen Wallarm düğüm dağıtım çözümleri veya sanat eserlerinden](../supported-deployment-options.md#in-line) birini seçin ve sağlanan dağıtım talimatlarını izleyin.
1. Dağıtılan düğümü aşağıdaki şablonu kullanarak yapılandırın:

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

        real_ip_header X-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    Lütfen aşağıdaki yapılandırmalara dikkat edin:

    * HTTPS trafiği için TLS/SSL sertifikaları: Wallarm düğümünün güvenli HTTPS trafiğini yönetmesini sağlamak için TLS/SSL sertifikalarını buna göre yapılandırın. Spesifik yapılandırma, seçilen dağıtım yöntemine bağlıdır. Örneğin, NGINX kullanıyorsanız, yönergeler için [makalesine](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) başvurabilirsiniz.
    * [Wallarm işlem modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.

1. Dağıtım tamamlandığında, gelen isteğin yönlendirileceği adresi belirlemek için daha sonra kullanacağınız düğüm örneği IP'sini bir yere not edin.

### 2. Wallarm politikasını MuleSoft Exchange'e elde edin ve yükleyin

Wallarm politikasını elde etmek ve [yüklemek](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) için, MuleSoft Exchange'e aşağıdaki adımları izleyin:

1. Wallarm MuleSoft politikasını edinmek için [support@wallarm.com](mailto:support@wallarm.com) 'a başvurun.
1. Alındığında politika arşivini çıkarın.
1. Politika dizinine gidin:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. `pom.xml` dosyası içinde üst tarafta bulunan 'groupId' parametresine MuleSoft organizasyon kimliğinizi belirtin.

    Organizasyon kimliğinizi MuleSoft Anypoint Platform → **Erişim Yönetimi** → **Organizasyon** → organizasyonunuzu seçin → kimliğini kopyalayarak bulabilirsiniz.
1. Maven '.m2' klasörünüzde, Exchange kimlik bilgilerinizi 'settings.xml' dosyasına girin:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <servers>
        <server>
          <id>exchange-server</id>
          <username>myusername</username>
          <password>mypassword</password>
        </server>
      </servers>
    </settings>
    ```
1. Aşağıdaki komutu kullanarak politikayı MuleSoft'a dağıtın:

    ```
    mvn clean deploy
    ```

Özel politikanız şimdi MuleSoft AnyPoint Platform Exchange'de kullanılabilir durumda.

![MuleSoft ile Wallarm politikası](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Wallarm politikasını API'nize ekleyin

Wallarm politikasını tüm API'lere veya bireysel bir API'ye ekleyebilirsiniz.

#### Politikanın tüm API'lere eklenmesi

Wallarm politikasını tüm API'lere uygulamak için [Mulesoft'un Otomatik politika opsiyonunu](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying) kullanarak aşağıdaki adımları izleyin:

1. Anypoint Platformunuzda, **API Manager** → **Automated Policies** yolunu izleyin.
1. **Add automated privacy** seçeneğine tıklayın ve Exchange'den Wallarm politikasını seçin.
1. [Wallarm düğüm örneği](#1-deploy-a-wallarm-node) üzerindeki IP adresi olan `WLRM REPORTING ENDPOINT`i belirtin, `http://` veya `https://` ekleyin.
1. Gerekirse, Wallarm'ın tek bir isteği işlemek için maksimum zamanını değiştirerek `WALLARM NODE REQUEST TIMEOUT` değerini değiştirin.
1. Politikayı uygulayın.

![Wallarm politikası](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Politikanın bireysel bir API'ye eklenmesi

Bir API'yı Wallarm politikasıyla güvence altına almak için aşağıdaki adımları izleyin:

1. Anypoint Platformunuzda, **API Manager** yolunu izleyin ve istenen API'yi seçin.
1. **Policies** → **Add policy** yolunu izleyin ve Wallarm politikasını seçin.
1. [Wallarm düğüm örneği](#1-deploy-a-wallarm-node) üzerindeki IP adresi olan `WLRM REPORTING ENDPOINT`i belirtin, `http://` veya `https://` ekleyin.
1. Gerekirse, Wallarm'ın tek bir isteği işlemek için maksimum zamanını değiştirerek `WALLARM NODE REQUEST TIMEOUT` değerini değiştirin.
1. Politikayı uygulayın.
![Wallarm politikası](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Test Etme

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. Test [Yol Seyrüseferi][ptrav-attack-docs] saldırısını API'nize gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. [ABD Bulutu](https://us1.my.wallarm.com/search) veya [AB Bulutu](https://my.wallarm.com/search) üzerinde Wallarm Konsolu → **Events** bölümünü açın ve bu saldırının listede gösterildiğinden emin olun.
    
    ![Arayüzdeki saldırılar][attacks-in-ui-image]

    Eğer Wallarm düğüm modu engelleme moduna ayarlandıysa, istek de engellenecektir.

Eğer çözüm beklendiği gibi çalışmazsa, MuleSoft AnyPoint Platform → **Runtime Manager** → uygulamanız → **Logs** yoluyla API'nizin loglarına başvurabilirsiniz.

API'nize uygulanan politikaları gözden geçirerek API'ye politikanın uygulanıp uygulanmadığını da kontrol edebilirsiniz. **API Manager** 'da API'nıza gidin ve **Policies** sekmesindeki uygulanmış politikalara göz atın. Otomatik politikalar için, kapsanan API'leri görmek ve herhangi bir ayrıcalığın nedenlerini görmek için **See covered APIs** seçeneğini kullanabilirsiniz.

## Güncelleme ve Kaldırma

Dağıtılmış Wallarm politikasını güncellemek için aşağıdaki adımları izleyin:

1. Şu anda dağıtılmış olan Wallarm politikasını kaldırın, otomatik politika listesinde veya bireysel bir API'ye uygulanan politika listesinde **Remove policy** seçeneğini kullanarak.
1. Yukarıdaki 2-3 adımları izleyerek yeni politikayı ekleyin.
1. Yeni politikanın uygulanmasını sağlamak için **Runtime Manager** 'daki uygulamaları yeniden başlatın.

Politikayı kaldırmak için, yalnızca güncelleme sürecinin ilk adımını gerçekleştirin.

## Yardıma mı ihtiyacınız var?

Eğer herhangi bir sorunla karşılaşırsanız veya Wallarm'ın politikasıyla MuleSoft'ın birlikte kullanılması ile ilgili olarak açıklanan dağıtımda yardıma ihtiyacınız olursa, [Wallarm support](mailto:support@wallarm.com) ekibine başvurabilirsiniz. İhtiyacınız olan yardımı ve uygulama sürecinde karşılaşabileceğiniz herhangi bir sorunu çözmek için size yardımcı olabilirler.