[ptrav-saldırı-belgeleri]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Node.js için AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) sunucusuz, olaya dayalı bir hesaplama hizmetidir ve uygulamalar veya arka uç hizmetler için çeşitli türlerde kod çalıştırmanıza olanak sağlar. Daha sonra sunucu ayarlama veya yönetme ihtiyacı olmaz. Wallarm Node.js kodunu dahil ederek gelen trafiği analiz ve filtreleme için Wallarm düğümüne yönlendirebilirsiniz. Bu makale, trafik analizi ve filtrasyon için özellikle Node.js lambdas olan AWS uygulamanızda Wallarm'ı yapılandırma ile ilgili talimatları sağlar.

<!-- ![Lambda](../../images/waf-installation/gateways/aws-lambda-traffic-flow.png) -->

Çözüm, Wallarm düğümünü dışarıda dağıtmayı ve özel kodu veya politikaları belirli bir platforma enjekte etmeyi içerir. Bu, trafiğin potansiyel tehditlere karşı koruma ve analiz için dış Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın bağlayıcıları olarak adlandırılan bu özellik, Azion Edge, Akamai Edge, Mulesoft, Apigee ve AWS Lambda gibi platformlar ile dış Wallarm düğümü arasındaki temel bağlantıyı oluşturur. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini sağlar.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki durumlar için önerilmiştir:

* Node.js lambdas kullanan AWS'deki uygulamaların güvenliğini sağlama.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli talepleri anında engelleme özellikleri sunan bir güvenlik çözümü gerektirmek.

## Sınırlamalar

Çözümün yalnızca gelen isteklerle çalıştığı belirli sınırlamaları vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#pasif-detection) yöntemiyle zafiyet tespiti düzgün çalışmaz. Çözüm, hedefine ulaşılan sunucu yanıtlarına dayanarak bir API'nin zafiyete sahip olup olmadığını belirler.
* [Wallarm API Keşfi](../../api-discovery/overview.md), trafik verilerinize dayanarak API envanterini bulamaz çünkü çözüm yanıt analizine dayanır.
* [Zorla gezinmeye karşı koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir çünkü yanıt kodu analizi gerektirir.

Başka sınırlamalar da vardır:

* HTTP paket gövdesi boyutu, İzleyici isteği seviyesinde 40 KB'a kadar ve Kök İstek seviyesinde 1 MB'a kadar sınırlıdır.
* Wallarm düğümünden maksimum yanıt süresi, İzleyici istekleri için 5 saniye ve Köken İstekleri için 30 saniye ile sınırlıdır.
* Lambda@Edge, özel ağlar (VPC) içinde çalışmaz.
* Eş zamanlı olarak işlenen isteklerin maksimum sayısı bölgedeki her işlem için 1.000'dir (Varsayılan Kotalar), ancak on binlerce olabilecek şekilde arttırılabilir.

## Gereklilikler

Dağıtıma devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* AWS Lambda teknolojilerine hakim olmak.
* AWS üzerinde çalışan API'ler veya trafik.

## Dağıtım

AWS'deki uygulamaları Node.js lambdas kullanarak Wallarm ile güvence altına almak için aşağıdaki adımları izleyin:

1. AWS örneğinde bir Wallarm düğümü dağıtın.
1. AWS Lambda için Wallarm Node.js scriptini alın ve çalıştırın.

### 1. Bir Wallarm düğümü dağıtın

Wallarm'ı AWS Lambda ile entegre ederken, trafik akışı [in-line](../inline/overview.md) olarak işler. Bu nedenle, AWS'deki in-line dağıtım için desteklenen Wallarm düğümü dağıtım bileşenlerinden birini seçin:

* [AWS AMI](../packages/aws-ami.md)
* [Amazon Elastic Container Service (ECS)](../cloud-platforms/aws/docker-container.md)

Dağıtılan düğümde aşağıdaki şablonu kullanarak ayarları yapın:

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

	real_ip_header X-Lambda-Real-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

Aşağıdaki yapılandırmalara özellikle dikkat edin:

* HTTPS trafiği için TLS/SSL sertifikaları: Wallarm düğümünün güvenli HTTPS trafiğini işleyebilmesi için TLS/SSL sertifikalarını buna göre yapılandırın. Spesifik yapılandırma, seçilen dağıtım yöntemine bağlı olacaktır. Örneğin, NGINX'i kullanıyorsanız, rehberlik için [makalesine](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) başvurabilirsiniz.
* [Wallarm işletim modu](../../admin-en/configure-wallarm-mode.md) yapılandırması.

### 2. AWS Lambda için Wallarm Node.js scriptini alın ve çalıştırın

AWS Lambda'da Wallarm Node.js scriptini alıp çalıştırmak için aşağıdaki adımları izleyin:

1. [support@wallarm.com](mailto:support@wallarm.com) adresine başvurarak Wallarm Node.js'yi alın.
1. [new IAM policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) oluşturun with the following permissions: 

    ```
    lambda:CreateFunction, 
    lambda:UpdateFunctionCode, 
    lambda:AddPermission, 
    iam:CreateServiceLinkedRole, 
    lambda:GetFunction, 
    lambda:UpdateFunctionConfiguration, 
    lambda:DeleteFunction, 
    cloudfront:UpdateDistribution, 
    cloudfront:CreateDistribution, 
    lambda:EnableReplication. 
    ```
1. AWS Lambda hizmetinde, çalışma zamanı olarak Node.js 14.x'ı ve önceki adımda oluşturulan rolü kullanarak yeni bir fonksiyon oluşturun. **Temel Lambda izinleri ile yeni bir rol oluştur** seçeneğini seçin.
1. Kod kaynak editöründe, Wallarm destek ekibinden aldığınız kodu yapıştırın.
1. Yapıştırılan kodda, `WALLARM_NODE_HOSTNAME` ve `WALLARM_NODE_PORT` değerlerini [önceden dağıtılan Wallarm düğümüne](#1-deploy-a-wallarm-node) işaret edecek şekilde güncelleyin.
    
    Trafiği 443/SSL üzerinden filtreleme düğümüne göndermek için aşağıdaki yapılandırmayı kullanın:

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```

    Kendi kendine imzalı bir sertifika kullanıyorsanız, sertifika talebinin sıkı uygulamasını devre dışı bırakmak için aşağıdaki değişikliği yapın:

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // only need if self-signed cert
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
1. IAM bölümüne geri dönün ve yeni oluşturulan rolü düzenleyin ve aşağıdaki politikaları ekleyin: `AWSLambda_FullAccess`, `AWSLambdaExecute`, `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole` ve önceki adımda oluşturulan `LambdaDeployPermissions`.
1. Güven İlişkilerinde, **Service** kısmına aşağıdaki değişikliği ekleyin:

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
1. Lambda → Functions → <YOUR_FUNCTION> yolunu izleyin ve **Add Trigger**'ı tıklayın.
1. Lambda@Edge'te dağıtım seçeneklerine gidin, **Deploy to Lambda@Edge**'i tıklayın ve Wallarm işleyicisine sahip olması gereken CloudFront Dağıtımını seçin veya yeni bir tane oluşturun.

    Bu süreç sırasında, CloudFront etkinliği için **Viewer request**'i seçin ve **Include body** kutusunu işaretleyin.

## Test Etme

Dağıtılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize test [Path Traversal][ptrav-saldırı-belgeleri] saldırısını içeren bir istek gönderin:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Events** bölümünü [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) üzerinde açın ve saldırının listeye eklenip eklenmediğini kontrol edin. 
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm düğüm modu engelleme olarak ayarlandıysa, istek de engellenecektir.

## Yardıma mı İhtiyacınız Var?

AWS Lambda'yla birlikte Wallarm'ın açıklanan dağıtımında herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyacınız olursa, [Wallarm desteği](mailto:support@wallarm.com) ile iletişime geçebilirsiniz. Uygulama süreci sırasında karşılaştığınız her türlü problemi çözmek ve rehberlik etmek için yardımcı olabilirler.