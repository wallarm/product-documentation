# CI/CD üzerinde OpenAPI Güvenlik Testi <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm tarafından desteklenen CI/CD üzerinde OpenAPI Güvenlik Testi, gölge ve zombi API'ler de dahil olmak üzere kritik API iş senaryolarınızdaki güvenlik açıklarını belirleyip ele almanıza yönelik bir çözüm sunar. Bu makale bu çözümün nasıl çalıştırılacağını ve kullanılacağını açıklar.

Çözüm, Cross-Origin Resource Sharing, dizin geçişi (path traversal), erişim kontrolü kusurları ve daha fazlası gibi zafiyetleri ortaya çıkarmaya yönelik özel olarak tasarlanmış test istekleri üreterek çalışır. Ardından Docker kullanarak CI/CD hattınıza sorunsuz biçimde entegre olur ve API'lerinizi bu zafiyetlere karşı otomatik olarak tarar.

Test etmek istediğiniz uç noktaları seçme esnekliğine sahipsiniz:

* **Otomatik uç nokta keşfi**: [Wallarm API Discovery](../api-discovery/overview.md) modülünden yararlanıyorsanız, API uç noktalarınız gerçek trafik verilerinden otomatik olarak tespit edilir. Bu uç noktalardan hangilerini test edeceğinizi seçebilirsiniz. Bu, güvenlik testinin gölge ve zombi olanlar da dahil aktif olarak kullanılan uç noktalara odaklanmasını sağlayarak API'nizdeki güvenlik açıklarının doğru değerlendirmesini sunar.
* **Manuel spesifikasyon yükleme**: Alternatif olarak, kendi OpenAPI spesifikasyonunuzu yükleyebilir ve çözümü spesifikasyondaki uç noktaları test etmek için kullanabilirsiniz. Bu, güncel bir spesifikasyonunuz varsa ve içindeki belirli uç noktalar üzerinde test çalıştırmak istiyorsanız yararlıdır.

## OpenAPI güvenlik testinin ele aldığı sorunlar

* Bu çözüm, API'lerinizin regresyon testleri sırasında güvenlik testi yapmanıza olanak tanır. API'lerinizin işlevselliğinde değişiklik yaparsanız, Wallarm güvenlik testi bu değişikliklerin herhangi bir güvenlik sorunu oluşturup oluşturmadığını ortaya çıkarabilir.
* Değişikliklerinizi staging ortamına dağıtıp bu aşamada CI/CD hattında güvenlik testlerini çalıştırarak, potansiyel güvenlik açıklarının üretime ulaşmasını ve saldırganlar tarafından istismar edilmesini önleyebilirsiniz.
* [API Discovery](../api-discovery/overview.md) verilerine dayalı güvenlik testinden yararlanırsanız, çözüm gölge ve zombi API'leri de test eder. Bu API'ler, ekibiniz ve dokümantasyonunuz varlıklarından habersiz olsa bile trafik alabilecekleri için modül tarafından otomatik olarak keşfedilir. Zombi API'leri güvenlik test sürecine dahil ederek, çözüm aksi halde gözden kaçabilecek zafiyetleri ele alır ve daha kapsamlı bir güvenlik değerlendirmesi sağlar.

## Gereksinimler

* Aktif bir **Advanced API Security** [abonelik planı](../about-wallarm/subscription-plans.md#core-subscription-plans). Farklı bir plandaysanız, gerekli plana geçiş için lütfen [satış ekibimizle](mailto:sales@wallarm.com) iletişime geçin.

## Güvenlik testlerini çalıştırma

OpenAPI Security Testing özelliğini kontrol etmek ve özelleştirmek için test politikalarını kullanabilirsiniz. Bir test politikası oluşturulduğunda, Docker kullanarak CI/CD hattınıza güvenlik testini entegre edip çalıştırmanızı sağlayan bir komut alırsınız.

OpenAPI güvenlik testini çalıştırmak için şu adımları izleyin:

1. [US Cloud](https://us1.my.wallarm.com/security-testing) veya [EU Cloud](https://my.wallarm.com/security-testing) bağlantısını izleyerek Wallarm Console → **OpenAPI Testing** bölümüne gidin ve **Create testing policy**.

    ![!Politika oluşturma](../images/user-guides/openapi-testing/create-testing-policy.png)
1. Test etmek istediğiniz API uç noktalarını, [otomatik olarak keşfedilmiş](../api-discovery/overview.md) API envanterinizden seçin veya JSON formatında bir OpenAPI 3.0 spesifikasyonu yükleyin.

    API Discovery modülü yeni uç noktaları otomatik olarak belirlese de, bunları mevcut zafiyet test politikalarına otomatik olarak dahil etmez. Sonuç olarak, yeni keşfedilen her uç nokta için ayrı bir politika gereklidir.
1. API uç noktalarınızda test etmek istediğiniz zafiyet türlerini seçin.
1. Gerekirse, kimlik doğrulama başlıkları veya Wallarm test istekleri için göstergeler gibi güvenlik testi için özel başlıklar ekleyin.

    Bu başlıklar, her uç noktaya gönderilen her istek için kullanılacaktır.
1. Sağlanan Docker komutunu kopyalayın ve otomatik doldurulmamış ortam değişkenlerinin değerlerini girin.
1. Komutu otomatik test için CI/CD hattınıza entegre edin.

Docker komut örneği:

=== "US Cloud"
    ```
    docker run -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```
=== "EU Cloud"
    ```
    docker run -e WALLARM_API_HOST=api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```

[Docker konteynerinin](https://hub.docker.com/r/wallarm/oas-fast-scanner) kabul ettiği ortam değişkenlerinin listesi aşağıda verilmiştir:

Environment variable | Description| Required?
--- | ---- | ----
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul> | Yes
`WALLARM_API_TOKEN` | **OpenAPI testing** izinlerine sahip [Wallarm API belirteci](../user-guides/settings/api-tokens.md). | Yes
`WALLARM_TESTING_POLICY_ID` | Wallarm test politikası kimliği. Politika oluşturulduğunda otomatik olarak üretilir. | Yes
`TARGET_URL` | Test etmek istediğiniz API uç noktalarının barındırıldığı URL. Test istekleri bu hosta gönderilir; ör. staging veya yerel derleme. | Yes

Değişkenleri konteynere iletmek için daha güvenli bir yaklaşım olarak, otomatik doldurulmamış konteyner ortam değişkenlerinin değerlerini makinenizde yerel ortam değişkenleri olarak kaydetmeniz önerilir. Bunu terminalinizde aşağıdaki komutları çalıştırarak yapabilirsiniz:

```
export WALLARM_API_TOKEN=<VALUE>
export WALLARM_SCANNER_TARGET_URL=<VALUE>
```

Güvenlik testi sonuçlarını bir ana makinede kaydetmek için, Docker komutunun `-v` seçeneğindeki `${WALLARM_REPORT_PATH}` değişkeninde istenen ana makine yolunu belirtin.

## Güvenlik testi sonuçlarının yorumlanması

Güvenlik testleri çalıştırılırken, Wallarm test politikanızda seçtiğiniz zafiyetleri ortaya çıkarmak üzere özel olarak tasarlanmış bir dizi tipik test isteği üretir. Bu test istekleri, politikanızda tanımlanan uç noktalara sırayla gönderilir.

Oluşturulan isteklere verilen yanıtları analiz ederek, Wallarm API uç noktalarınızda mevcut açık güvenlik açıklarını belirler. Ardından Docker konteynerinin standart çıktısı (stdout) üzerinden `0` veya `1` kodu döner:

* `0` kodu, açık güvenlik açığı tespit edilmediğini belirtir.
* `1` kodu, açık güvenlik açıklarının bulunduğunu belirtir.

Belirli zafiyetler için `1` kodu alırsanız, bunları gidermek üzere uygun önlemleri almak önemlidir.

## Güvenlik testi raporu oluşturma

Zafiyetleri ortaya çıkaran isteklere ilişkin ayrıntılı bilgiler sağlayan bir güvenlik raporu alabilirsiniz. Rapor CSV, YAML ve JSON dahil birden çok formatta üretilir.

Güvenlik testi sonuçlarını bir ana makinede kaydetmek için, Docker komutunun `-v ${WALLARM_REPORT_PATH}:/app/reports` seçeneğindeki `${WALLARM_REPORT_PATH}` yolunda istenen ana makine yolunu belirtin.

Rapor dosyalarının başarıyla kaydedilmesi için, belirtilen ana makine yolunun Docker konteyneri tarafından yazılabilir olduğundan emin olmak önemlidir.

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

Varsayılan olarak, güvenlik raporları Docker konteyneri içinde `/app/reports` dizinine kaydedilir. `-v` seçeneğini kullanarak `/app/reports` içeriğini belirtilen ana makine dizinine bağlarsınız.

## Güvenlik politikalarını yönetme

Wallarm Console'un **OpenAPI Testing** bölümünde, hesabınızla ilişkili güvenlik test politikaları listesini yönetebilirsiniz. Farklı politikalar; yerel test ve staging gibi farklı hizmetler, ekipler, amaçlar ve test aşamaları için kullanılabilir.

Gereksinimlerinize uygun olacak şekilde mevcut politikaları düzenleyebilir ve silebilirsiniz.

![!Politika listesi](../images/user-guides/openapi-testing/testing-policies-list.png)