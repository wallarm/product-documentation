[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[saldırılar-arayüzdeki-görüntü]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Apigee Edge: Wallarm Proxy Paketiyle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge), API'lerin müşteri uygulamalarına erişim için giriş noktası olan bir API ağ geçidi hizmeti sunan bir API yönetim platformudur. Apigee'deki API güvenliğini artırmak için, bu makalede ayrıntılarıyla anlatıldığı gibi Wallarm'ın API proxy paketiyle entegrasyon yapabilirsiniz.

Çözüm, Wallarm düğümünü dışarıda konuşlandırmayı ve özel kod veya politikaları belirli bir platforma enjekte etmeyi içerir. Bu, trafik akışının potansiyel tehditlerle analiz edilmesi ve korunması için dış Wallarm düğümüne yönlendirilmesini sağlar. Wallarm'ın konnektörleri olarak adlandırılan bu öğeler, Azion Edge, Akamai Edge, Mulesoft, Apigee ve AWS Lambda gibi platformlar ile dış Wallarm düğümü arasında temel bir bağlantı sağlar. Bu yaklaşım, sorunsuz entegrasyon, güvenli trafik analizi, risk azaltma ve genel platform güvenliğini sağlar.

## Kullanım Durumları

Tüm desteklenen [Wallarm konuşlandırma seçenekleri](../supported-deployment-options.md) arasında, bu çözüm aşağıdaki kullanım durumları için önerilir:

* Yalnızca bir API proxy ile Apigee platformunda konuşlandırılmış API'leri korumak.
* Kapsamlı saldırı gözlemi, raporlama ve kötü niyetli isteklerin anında engellenmesi sunan bir güvenlik çözümü gerektirir.

## Sınırlamalar

Çözüm, yalnızca gelen isteklerle çalıştığı için belirli sınırlamaları vardır:

* [Pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) yöntemiyle güvenlik açığı keşfi düzgün çalışmaz. Çözüm, bir API'nin sunucu yanıtlarına dayalı olarak test ettiği güvenlik açıkları için tipik olan kötü niyetli isteklere karşı savunmasız olup olmadığını belirler.
* [Wallarm API Keşfi](../../api-discovery/overview.md) yanıt analizine dayandığından, trafiğinize dayalı API envanterini keşfedemez.
* Yanıt kodu analizi gerektiren [zorla göz atma karşısında koruma](../../admin-en/configuration-guides/protecting-against-bruteforce.md) mevcut değildir.

## Gereksinimler

Konuşlandırmaya devam etmek için aşağıdaki gereksinimleri karşıladığınızdan emin olun:

* Apigee platformunu anlama.
* API'leriniz Apigee'de çalışıyor.

## Konuşlandırma

Apigee platformundaki API'leri korumak için, aşağıdaki adımları izleyin:

1. GCP örneğinde bir Wallarm düğümü konuşlandırın.
2. Wallarm proxy paketini alın ve Apigee'ye yükleyin.

### 1. Bir Wallarm Düğümü Konuşlandırın

Wallarm proxy Apigee'de kullanılırken, trafik akışı [satır içi](../inline/overview.md) olarak çalışır. Bu nedenle, Google Cloud Platform'da satır içi konuşlandırma için desteklenen Wallarm düğüm konuşlandırma araçlarından birini seçin:

* [GCP Makine Görüntüsü](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

Konuşlandırılan düğümü aşağıdaki şablonu kullanarak yapılandırın:

```
sunucu {
	dinle 80 varsayılan_sunucu;
	dinle [::]:80 varsayılan_sunucu;

	sunucu_adı _;

	erişim_logu kapalı;
	wallarm_modu kapalı;

	konum / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://unix:/tmp/wallarm-nginx.sock;
	}
}

sunucu {
	dinle unix:/tmp/wallarm-nginx.sock;
	
	sunucu_adı _;
	
	wallarm_modu block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	konum / {
		echo_read_request_body;
	}
}
```

Konuşlandırma bittikten sonra, gelen istek yönlendirmesini yapılandırmak için düğüm örneğinin IP adresini alın. IP'nin dışsal olması gerektiğine dair bir gereklilik yoktur; dahili de olabilir.

### 2. Wallarm proxy paketini alın ve Apigee'ye yükleyin

Entegrasyon, meşru trafiği API'lerinize yönlendirecek bir API proxy oluşturmayı içerir. Bunun için Wallarm, özel bir yapılandırma paketi sağlar. Wallarm paketini Apigee'deki API proxy için [kullan](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)arak ve edinmek için aşağıdaki adımları izleyin:

1. Apigee için Wallarm proxy paketini almak için [support@wallarm.com](mailto:support@wallarm.com) ile iletişime geçin.
2. Apigee Edge kullanıcı arayüzünde, **Geliştirmek** → **API Proxies** → **+Proxy** → **Proxy paketi yükle** yolunu izleyin.
3. Wallarm desteği ekibinden alınan paketi yükleyin.
4. İçe aktarılan yapılandırma dosyasını açın ve `prewall.js` ve `postwall.js` dosyalarında [Wallarm düğüm örneğinin IP adresini](#1-deploy-a-wallarm-node) belirtin.
5. Yapılandırmayı kaydedin ve dağıtın.

## Test Etme

Konuşlandırılan politikanın işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. API'nize test [Path Traversal][ptrav-attack-docs] saldırısı ile bir istek gönderin:

    ```
    curl http://<UYGULAMANIZIN_IP_VEYA_ALAN_ADİ>/etc/passwd
    ```
2. Wallarm Konsolu → **Etkinlikler** bölümünü [ABD Bulutu](https://us1.my.wallarm.com/search) veya [AB Bulutu](https://my.wallarm.com/search) üzerinde açın ve saldırının listeye eklenmiş olup olmadığını kontrol edin.
    
    ![Arayüzdeki saldırılar][saldırılar-arayüzdeki-görüntü]

    Eğer Wallarm düğüm modu engelleme modunda ayarlanmışsa, istek ayrıca engellenecektir.

## Yardım mı gerekiyor?

Apigee ile birlikte Wallarm'ın konuşlandırılmasını anlatan bu konuda herhangi bir sorunla karşılaşırsanız veya yardıma ihtiyacınız olursa, [Wallarm desteği](mailto:support@wallarm.com) ekibiyle iletişime geçebilirsiniz. Onlar, uygulama süreci boyunca herhangi bir sorunu çözmenize ve rehberlik etmenize yardımcı olabilecekleri için elinizin altındadırlar.