# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls), veya Amazon Simple Storage Service, Amazon Web Services (AWS) tarafından sunulan ölçeklenebilir bir bulut depolama hizmetidir. Veri yedekleme, arşivleme, içerik dağıtımı, web sitesi barındırma ve uygulama veri depolama gibi çeşitli amaçlar için kullanılır. Wallarm’ı, tespit edilen hits hakkında bilgileri Amazon S3 bucket’ınıza gönderecek şekilde yapılandırabilirsiniz. Bilgiler, her 10 dakikada bir JSON formatındaki dosyalar halinde gönderilecektir.

Her hit için veri alanları:

* `time` - Unix Timestamp biçiminde hit tespit tarih ve saati
* `request_id`
* `ip` - saldırganın IP’si
* Hit kaynak türü: `datacenter`, `tor`, `remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload` 
* `point`
* `tags`

Dosyalar, S3 bucket’ınıza `wallarm_hits_{timestamp}.json` veya `wallarm_hits_{timestamp}.jsonl` adlandırma kuralı kullanılarak kaydedilecektir. Biçim, entegrasyon kurulumu sırasında seçiminize bağlı olarak JSON Dizisi veya Yeni Satırla Ayrılmış JSON (NDJSON) olacaktır.

## Entegrasyonu yapılandırma

Amazon S3 ile entegrasyonu yapılandırırken hangi yetkilendirme yöntemini kullanacağınıza karar vermelisiniz:

* **Rol ARN’si aracılığıyla (önerilir)** - kaynaklara erişim vermek için harici kimlik (external ID) seçeneğine sahip rollerin kullanılması, güvenliği artıran ve "confused deputy" saldırılarını önleyen bir yöntem olarak AWS tarafından [önerilir](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console). Wallarm, kuruluş hesabınız için benzersiz bir kimlik sağlar.
* **Gizli erişim anahtarı ile** - daha yaygın ve daha basit bir yöntem olup AWS IAM kullanıcınızın paylaşılan [erişim anahtarı](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)nı gerektirir. Bu yöntemi seçerseniz, entegrasyonda kullanılan S3 bucket’ına yalnızca yazma iznine sahip ayrı bir IAM kullanıcısının erişim anahtarını kullanmanız önerilir.

Bir Amazon S3 entegrasyonu kurmak için:

1. Wallarm için bir Amazon S3 bucket’ı oluşturmak üzere [talimatları](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) izleyin.
1. Seçilen yetkilendirme yöntemine bağlı olarak farklı adımları uygulayın.

    === "Rol ARN’si"

        1. AWS UI’da, S3 → bucket’ınız → **Properties** sekmesine gidin ve bucket’ınızın **AWS Region** kodunu ve **Amazon Resource Name (ARN)** değerini kopyalayın.

            Örneğin, bölge olarak `us-west-1` ve ARN olarak `arn:aws:s3:::test-bucket-json`.

        1. Wallarm Console UI’da, **Integrations** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **AWS S3**’ü seçin.
        1. Bir entegrasyon adı girin.
        1. S3 bucket’ınızın daha önce kopyaladığınız AWS bölge kodunu girin.
        1. S3 bucket adınızı girin.
        1. Sağlanan Wallarm account ID’yi kopyalayın.
        1. Sağlanan external ID’yi kopyalayın.
        1. AWS UI’da, IAM → **Access Management** → **Roles** altında [new role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) oluşturmayı başlatın.
        1. Trusted entity type olarak **AWS account** → **Another AWS Account** seçin.
        1. Wallarm **Account ID**’sini yapıştırın.
        1. **Require external ID** seçeneğini işaretleyin ve Wallarm tarafından sağlanan external ID’yi yapıştırın.
        1. **Next**’e tıklayın ve rolünüz için ilke (policy) oluşturun:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<YOUR_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. Rol oluşturmayı tamamlayın ve rolün ARN’sini kopyalayın.
        1. Wallarm Console UI’da, entegrasyon oluşturma iletişim kutunuzda, **Role ARN** sekmesinde rolünüzün ARN’sini yapıştırın.

            ![Amazon S3 entegrasyonu](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Gizli erişim anahtarı"

        1. AWS UI’da, S3 → bucket’ınız → **Properties** sekmesine gidin ve bucket’ınızın **AWS Region** kodunu kopyalayın; örneğin `us-west-1`.
        1. IAM → Dashboard → **Manage access keys** → **Access keys** bölümüne gidin.
        1. Bir yerde sakladığınız erişim anahtarının kimliğini (ID) alın veya [burada](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/) açıklandığı gibi yeni bir anahtar oluşturun/kaybolan anahtarı geri yükleyin. Her durumda, etkin anahtarınıza ve onun ID’sine ihtiyacınız olacaktır.
        1. Wallarm Console UI’da, **Integrations** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **AWS S3**’ü seçin.
        1. Bir entegrasyon adı girin.
        1. S3 bucket’ınızın daha önce kopyaladığınız AWS bölge kodunu girin.
        1. S3 bucket adınızı girin.
        1. **Secret access key** sekmesinde, erişim anahtarı ID’sini ve anahtarın kendisini girin.

1. Wallarm verileri için biçimi seçin: JSON Dizisi veya Yeni Satırla Ayrılmış JSON (NDJSON).
1. **Regular notifications** bölümünde, son 10 dakikadaki hits öğelerinin gönderilmek üzere seçili olduğundan emin olun. Seçilmemişse, veriler S3 bucket’ına gönderilmeyecektir.
1. Yapılandırmanın doğruluğunu, Wallarm Cloud’a erişilebilirliği ve bildirim biçimini kontrol etmek için **Test integration**’a tıklayın.

    Amazon S3 için, entegrasyon testi verilerle birlikte JSON dosyasını bucket’ınıza gönderir. İşte son 10 dakikada tespit edilen hits verilerini içeren JSON dosyasına bir örnek:

    === "JSON Dizisi"
        ```json
        [
        {
            "time":"1687241470",
            "request_id":"d2a900a6efac7a7c893a00903205071a",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        },
        {
            "time":"1687241475",
            "request_id":"b457fccec9c66cdb07eab7228b34eca6",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        }
        ]
        ```
    === "Yeni Satırla Ayrılmış JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. **Add integration**’a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

Saklanan veri miktarını kontrol etmek için, Amazon S3 bucket’ınızdan eski nesnelerin otomatik silinmesini [burada](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) açıklandığı şekilde yapılandırmanız önerilir.

## Entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"