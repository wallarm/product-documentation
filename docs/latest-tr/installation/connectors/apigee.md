```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Apigee Edge with Wallarm Proxy Bundle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge) bir API geçidi olarak işlev gören ve API'lere erişim için istemci uygulamalarının giriş noktası olan API yönetim platformudur. Apigee'de API güvenliğini artırmak için, bu makalede detaylandırıldığı üzere Wallarm'ın API proxy bundle'ını entegre edebilirsiniz.

Çözüm, Wallarm node'unun dışarıda konuşlandırılmasını ve belirli platforma özel kullanıcı kodu veya politikaların enjekte edilmesini içerir. Bu, trafiğin analiz ve potansiyel tehditlere karşı korunma amacıyla dış Wallarm node'una yönlendirilmesini sağlar. Wallarm'ın konnektörleri olarak adlandırılan bu yapı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve AWS Lambda gibi platformlar ile dış Wallarm node'u arasındaki temel bağlantıyı oluşturur. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltımı ve genel platform güvenliği sağlar.

## Kullanım Durumları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım durumları için önerilen seçenektir:

* Apigee platformunda yalnızca bir API proxy ile konuşlandırılan API'lerin güvenliğinin sağlanması.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellenmesini sunan bir güvenlik çözümünün gerekliliği.

## Sınırlamalar

Çözümün yalnızca gelen isteklere yönelik çalışması nedeniyle bazı sınırlamaları vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemi kullanılarak gerçekleştirilen açıklık keşfi düzgün çalışmaz. Çözüm, test ettiği zaafiyetlere özgü kötü niyetli isteklere sunucunun vereceği yanıtlar üzerinden, bir API'nin savunmasız olup olmadığını belirler.
* [Wallarm API Discovery](../../api-discovery/overview.md) trafiğinize dayanan API envanterini keşfedemez, çünkü çözüm yanıt analizi üzerine kuruludur.
* [Zorlanarak göz atmaya karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) yanıt kodu analizine ihtiyaç duyduğundan devreye alınmaz.

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Apigee platformunun anlaşılması.
* API'lerinizin Apigee üzerinde çalışıyor olması.

## Dağıtım

Apigee platformundeki API'leri korumak için aşağıdaki adımları takip edin:

1. GCP örneğinde bir Wallarm node'u konuşlandırın.
1. Wallarm proxy bundle'ını edinin ve Apigee'ye yükleyin.

### 1. Wallarm Node'u Konuşlandırma

Apigee'de Wallarm proxy kullanılırken trafik akışı [in-line](../inline/overview.md) çalışır. Bu nedenle, Google Cloud Platform üzerinde in-line konuşlandırma için desteklenen Wallarm node dağıtım artefaktlarından birini seçin:

* [GCP Machine Image](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

Konuşlandırılan node'u aşağıdaki şablon kullanılarak yapılandırın:

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

Dağıtım tamamlandıktan sonra, gelen istek yönlendirmesini yapılandırmak için gerekli olacağından node örneğinin IP adresini not alın. IP adresinin dahili olabileceğini unutmayın; dışarıdan erişilebilir olması zorunlu değildir.

### 2. Wallarm Proxy Bundle'ını Edinme ve Apigee'ye Yükleme

Entegrasyon, API trafiğini API'lerinize yönlendiren bir API proxy oluşturmayı içerir. Bunu gerçekleştirmek için Wallarm, özel bir yapılandırma bundle'ı sağlar. Apigee'de API proxy için Wallarm bundle'ını edinmek ve [kullanmak](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy) amacıyla aşağıdaki adımları izleyin:

1. Wallarm proxy bundle'ını edinmek için [support@wallarm.com](mailto:support@wallarm.com) ile iletişim kurun.
1. Apigee Edge UI'da **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle** yolunu izleyin.
1. Wallarm destek ekibi tarafından sağlanan bundle'ı yükleyin.
1. İçe aktarılan yapılandırma dosyasını açın ve `prewall.js` ile `postwall.js` içerisinde [Wallarm node örneğinin IP adresini](#1-deploy-a-wallarm-node) belirtin.
1. Yapılandırmayı kaydedin ve dağıtın.

## Test

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize, test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede görüntülendiğinden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm node modu bloklama olarak ayarlanmışsa, istek de engellenecektir.

## Yardıma mı İhtiyacınız Var?

Wallarm ile Apigee entegrasyonunun açıklanan dağıtımı sırasında herhangi bir sorunla karşılaşırsanız veya yardım gerekirse, [Wallarm support](mailto:support@wallarm.com) ekibi ile iletişime geçebilirsiniz. Uygulama sürecinde karşılaşabileceğiniz her türlü sorunun çözülmesinde sizlere rehberlik sağlamaya hazırdırlar.
```