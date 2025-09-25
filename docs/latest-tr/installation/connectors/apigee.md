[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Proxy Bundle ile Apigee Edge

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge), istemci uygulamalarının API’lere erişmesi için giriş noktası görevi gören bir API ağ geçidine sahip bir API yönetim platformudur. Apigee’de API güvenliğini artırmak için, bu makalede anlatıldığı gibi Wallarm’ın API proxy paketini entegre edebilirsiniz.

Çözüm, Wallarm düğümünün harici olarak dağıtılmasını ve belirli bir platforma özel kod veya politikaların enjekte edilmesini içerir. Bu, trafiğin analiz ve potansiyel tehditlere karşı koruma amacıyla harici Wallarm düğümüne yönlendirilmesini sağlar. Wallarm’ın “connectors” olarak adlandırılan bu bileşenleri; Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile harici Wallarm düğümü arasında temel bağlantıyı kurar. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini sağlar.

## Kullanım senaryoları

Bu çözüm aşağıdaki kullanım senaryoları için önerilir:

* Yalnızca tek bir API proxy’si bulunan Apigee platformunda dağıtılmış API’lerin güvence altına alınması.
* Kapsamlı saldırı gözlemi, raporlama ve kötü amaçlı isteklerin anında engellenmesini sunan bir güvenlik çözümüne ihtiyaç duyulması.

## Sınırlamalar

Bu çözüm yalnızca gelen isteklerle çalıştığı için bazı sınırlamalara sahiptir:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemiyle güvenlik açığı keşfi düzgün çalışmaz. Çözüm, test ettiği güvenlik açıklarına tipik olan kötü amaçlı isteklere sunucunun yanıtlarına dayanarak bir API’nin savunmasız olup olmadığını belirler.
* [Wallarm API Discovery](../../api-discovery/overview.md), çözüm yanıt analizi üzerine kurulu olduğundan trafiğinize dayanarak API envanterini keşfedemez.
* Yanıt kodu analizi gerektirdiği için [zorla gezintiye (forced browsing) karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) kullanılamaz.

## Gereksinimler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Apigee platformunu anlama.
* API’lerinizin Apigee üzerinde çalışıyor olması.

## Dağıtım

Apigee platformundaki API’leri güvence altına almak için aşağıdaki adımları izleyin:

1. GCP örneğinde bir Wallarm düğümü dağıtın.
1. Wallarm proxy paketini edinin ve Apigee’ye yükleyin.

### 1. Wallarm düğümü dağıtın
<a name="1-deploy-a-wallarm-node"></a>

Apigee üzerinde Wallarm proxy’sini kullanırken, trafik akışı [in-line](../inline/overview.md) olarak çalışır. Bu nedenle, Google Cloud Platform üzerinde in-line dağıtım için desteklenen Wallarm düğüm dağıtım artefaktlarından birini seçin:

* [GCP Machine Image](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

Dağıtılan düğümü aşağıdaki şablonu kullanarak yapılandırın:

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

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
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

Dağıtım tamamlandıktan sonra, gelen istek yönlendirmesini yapılandırmak için gerekli olacağından düğüm örneğinin IP adresini not edin. IP’nin dahili olabileceğini, harici olmasının gerekmediğini unutmayın.

### 2. Wallarm proxy paketini edinin ve Apigee’ye yükleyin

Entegrasyon, meşru trafiği API’lerinize yönlendirecek bir API proxy’sinin Apigee üzerinde oluşturulmasını içerir. Bunu gerçekleştirmek için Wallarm özel bir yapılandırma paketi sağlar. Apigee’deki API proxy’si için Wallarm paketini edinmek ve [kullanmak](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy) için şu adımları izleyin:

1. Apigee için Wallarm proxy paketini edinmek üzere [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
1. Apigee Edge UI’da, **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle** yolunu izleyin.
1. Wallarm destek ekibinin sağladığı paketi yükleyin.
1. İçe aktarılan yapılandırma dosyasını açın ve `prewall.js` ve `postwall.js` içinde [Wallarm düğüm örneğinin IP adresini](#1-deploy-a-wallarm-node) belirtin.
1. Yapılandırmayı kaydedin ve dağıtın.

## Test

Dağıtılan politikanın işlevselliğini test etmek için şu adımları izleyin:

1. API’nize test amaçlı [Yol Geçişi (Path Traversal)][ptrav-attack-docs] saldırısını içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinde açın ve saldırının listede göründüğünden emin olun.
    
    ![Arayüzde Attacks][attacks-in-ui-image]

    Wallarm düğüm modu blocking olarak ayarlıysa, istek de engellenecektir.

## Yardıma mı ihtiyacınız var?

Apigee ile birlikte Wallarm’ın burada tanımlanan dağıtımı sırasında herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyaç duyarsanız, [Wallarm destek](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Uygulama sürecinde rehberlik sağlar ve karşılaşabileceğiniz sorunların çözümüne yardımcı olurlar.