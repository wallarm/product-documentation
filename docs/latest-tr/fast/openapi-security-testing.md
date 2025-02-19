# CI/CD Üzerinde OpenAPI Güvenlik Testi <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm destekli CI/CD üzerinde OpenAPI Güvenlik Testi, kritik API iş senaryolarınızdaki, shadow ve zombie API'ler dahil, güvenlik açıklarını tespit etmek ve gidermek için bir çözüm sunar. Bu makale, bu çözümün nasıl çalıştırılacağını ve kullanılacağını açıklamaktadır.

Çözüm, Cross-Origin kaynak paylaşımı, path traversal, erişim kontrolü hataları ve benzeri güvenlik açıklarını ortaya çıkarmak için özel olarak tasarlanmış test istekleri oluşturarak çalışır. Daha sonra Docker kullanılarak CI/CD hattınıza sorunsuzca entegre edilir ve API'leriniz bu açıklar açısından otomatik olarak taranır.

Teste tabi tutulmasını istediğiniz uç noktaları seçme esnekliğine sahipsiniz:

* **Otomatik uç nokta keşfi**: [Wallarm's API Discovery](../api-discovery/overview.md) modülünden yararlandığınızda, API uç noktalarınız gerçek trafik verilerinden otomatik olarak tespit edilir. Daha sonra test etmek istediğiniz uç noktalardan hangilerini belirleyeceğinizi seçebilirsiniz. Bu, shadow ve zombie uç noktaları da dahil olmak üzere aktif olarak kullanılan uç noktalara yönelik güvenlik testlerinin uygulanmasını sağlar ve API'nizin açıklarına dair doğru bir değerlendirme sunar.
* **Manuel şema yükleme**: Alternatif olarak, kendi OpenAPI şemanızı yükleyebilir ve şemada yer alan uç noktalarda testler gerçekleştirmek için çözümü kullanabilirsiniz. Bu seçenek, güncel bir şemaya sahipseniz ve şema içinde belirtilen belirli uç noktalarda test çalıştırmak istiyorsanız kullanışlıdır.

## OpenAPI güvenlik testinin ele aldığı konular

* Bu çözüm, API’lerinizin regresyon testleri sırasında güvenlik testi yapmanıza olanak tanır. API’lerinizde fonksiyonalite ile ilgili değişiklikler yaptığınızda, Wallarm güvenlik testi yaptığınız değişikliklerin herhangi bir güvenlik açığı doğurup doğurmadığını ortaya çıkarabilir.
* Değişikliklerinizi staging ortamına dağıtıp bu aşamada CI/CD hattında güvenlik testi çalıştırarak, potansiyel güvenlik açıklarının production ortamına ulaşmasını ve saldırganlar tarafından kullanılmasını önleyebilirsiniz.
* [API Discovery](../api-discovery/overview.md) ile elde edilen verilere dayalı güvenlik testlerinden yararlanıyorsanız, testler shadow ve zombie API’leri de kapsar. Ekibiniz ve dokümantasyonunuz bu API'lerin varlığının farkında olmasa bile, modül tarafından trafik aldığı için otomatik olarak tespit edilirler. Zombie API'lerin güvenlik test sürecine dahil edilmesi, aksi halde fark edilmeyebilecek açıklara karşı daha kapsamlı bir güvenlik değerlendirmesi sağlar.

## Gereksinimler

* Aktif bir **Advanced API Security** [abonelik planı](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security). Eğer farklı bir plan kullanıyorsanız, gerekli plana geçiş yapabilmek için lütfen [sales team](mailto:sales@wallarm.com) ile iletişime geçin.

## Güvenlik testlerini çalıştırma

OpenAPI Güvenlik Testi özelliğini kontrol etmek ve özelleştirmek için test politikalarından yararlanabilirsiniz. Bir test politikası oluşturulduktan sonra, CI/CD hattınıza Docker kullanarak entegre edip güvenlik testlerini çalıştırmanızı sağlayan bir komut elde edersiniz.

OpenAPI güvenlik testlerini çalıştırmak için aşağıdaki adımları izleyin:

1. Wallarm Console → **OpenAPI Testing** bölümüne gidin. Bunun için [US Cloud](https://us1.my.wallarm.com/security-testing) veya [EU Cloud](https://my.wallarm.com/security-testing) linkini takip edin ve **Create testing policy** seçeneğine tıklayın.

    ![!Policy create](../images/user-guides/openapi-testing/create-testing-policy.png)
1. Otomatik olarak keşfedilen [API envanterinizden](../api-discovery/overview.md) veya JSON formatında bir OpenAPI 3.0 şeması yükleyerek test etmek istediğiniz API uç noktalarını seçin.

    API Discovery modülü yeni uç noktaları otomatik olarak belirlese de, mevcut güvenlik açığı test politikalarına otomatik olarak dahil etmez. Sonuç olarak, her yeni keşfedilen uç nokta için ayrı bir politika gerekmektedir.
1. API uç noktalarınızda test etmek istediğiniz güvenlik açığı türlerini seçin.
1. Gerekirse, kimlik doğrulama başlıkları veya Wallarm test istekleri için göstergeler gibi, güvenlik testi için özel başlıklar ekleyin.

    Bu başlıklar, her uç noktaya yapılan her istekte kullanılacaktır.
1. Sağlanan Docker komutunu kopyalayın ve otomatik olarak doldurulmayan ortam değişkenleri için değerleri girin.
1. Komutu, otomatik testler için CI/CD hattınıza entegre edin.

Docker komutu örneği:

=== "US Cloud"
    ```
    docker run -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```
=== "EU Cloud"
    ```
    docker run -e WALLARM_API_HOST=api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```

[Docker container](https://hub.docker.com/r/wallarm/oas-fast-scanner) tarafından kabul edilen ortam değişkenlerinin listesi aşağıda verilmiştir:

Environment variable | Açıklama | Gereklilik
--- | ---- | ----
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul> | Evet
`WALLARM_API_TOKEN` | **OpenAPI testing** izinlerine sahip [Wallarm API token](../user-guides/settings/api-tokens.md). | Evet
`WALLARM_TESTING_POLICY_ID` | Wallarm test politikası ID'si. Politika oluşturulduğunda otomatik olarak üretilir. | Evet
`TARGET_URL` | Test etmek istediğiniz API uç noktalarının barındırıldığı URL. Test istekleri bu hosta gönderilir, örneğin staging veya local build ortamları. | Evet

Ortam değişkenlerini container'a geçirmenin daha güvenli bir yolu olarak, otomatik olarak doldurulmayan container ortam değişkenlerini makinenizde yerel ortam değişkenleri olarak kaydetmeniz önerilir. Bunu terminalinizde aşağıdaki komutları çalıştırarak yapabilirsiniz:

```
export WALLARM_API_TOKEN=<VALUE>
export WALLARM_SCANNER_TARGET_URL=<VALUE>
```

Güvenlik testi sonuçlarını host makinenizde saklamak için, Docker komutunun `-v` seçeneğindeki `${WALLARM_REPORT_PATH}:/app/reports` ifadesinde, istenen host makine yolunu belirtin.

## Güvenlik testi sonuçlarının yorumlanması

Güvenlik testlerini çalıştırdığınızda, Wallarm, test politikanızda seçilen güvenlik açıklarını ortaya çıkarmak üzere özel olarak tasarlanmış tipik test istekleri serisi oluşturur. Bu test istekleri, politikanızda tanımlı uç noktalara sırasıyla gönderilir.

Oluşturulan isteklere verilen yanıtları analiz ederek, Wallarm, API uç noktalarınızda mevcut olan açıkları belirler. Ardından, Docker container'ının stdout (standart çıktı) üzerinden `0` veya `1` kodu döner:

* `0` kodu, herhangi bir açık bulunmadığını gösterir.
* `1` kodu, açıkların mevcut olduğunu gösterir.

Belirli güvenlik açıkları için `1` kodu alırsanız, bu açıkları gidermek için gerekli önlemleri almanız önemlidir.

## Güvenlik testi raporu oluşturma

Güvenlik açıklarını ortaya çıkaran istekler hakkında detaylı bilgi sağlayan bir güvenlik raporunu elde edebilirsiniz. Rapor CSV, YAML ve JSON dahil olmak üzere birden fazla formatta oluşturulur.

Güvenlik testi sonuçlarını host makinenizde saklamak için, Docker komutundaki `-v ${WALLARM_REPORT_PATH}:/app/reports` ifadesindeki `${WALLARM_REPORT_PATH}` yolunda istediğiniz host makine yolunu belirtin.

Belirtilen host makine yolunun, Docker container'ının rapor dosyalarını başarıyla kaydedebilmesi için uygun yazma izinlerine sahip olduğundan emin olun.

JSON rapor örneği:

```json
[
    {
        "type":"ptrav",
        "threat":80,
        "payload":"/../../../../../../../../../etc/passwd",
        "exploit_example":"curl -v -X GET -H 'x-test-id: 123' http://app:8000/files?path=/../../../../../../../../../etc/passwd\n\n{\"file_contents\":\"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\n",
        "name":"LFI-linux-replace",
        "path":"/files",
        "method":"get",
        "url":"http://app:8000"
    },
    {
        "type":"xss",
        "threat":60,
        "payload":"'wwra92w><wwra92w><",
        "exploit_example":"curl -v -X GET -H 'x-test-id: 123' http://app:8000/html_page?query='wwra92w><wwra92w><\n\n<html><body>'wwra92w><wwra92w><</body></html>",
        "name":"xss-html-injections",
        "path":"/html_page",
        "method":"get",
        "url":"http://app:8000"
    }
]
```

Varsayılan olarak, güvenlik raporları Docker container içinde `/app/reports` dizininde saklanır. `-v` seçeneğini kullanarak, `/app/reports` içeriğini belirttiğiniz host makine dizinine mount edersiniz.

## Güvenlik politikalarının yönetimi

Wallarm Console'daki **OpenAPI Testing** bölümünde, hesabınıza bağlı güvenlik testi politikalarının listesini yönetme yetkisine sahipsiniz. Farklı hizmetler, ekipler, amaçlar ve test aşamaları (local testing ve staging gibi) için farklı politikalar kullanılabilir.

Mevcut politikaları ihtiyaçlarınıza uygun şekilde düzenleyebilir veya silebilirsiniz.

![!Policies list](../images/user-guides/openapi-testing/testing-policies-list.png)