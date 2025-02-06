# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls), veya Amazon Simple Storage Service, Amazon Web Services (AWS) tarafından sunulan ölçeklenebilir bir bulut depolama hizmetidir. Veri yedeklemesi, veri arşivlemesi, içerik dağıtımı, web sitesi barındırma ve uygulama veri depolama gibi çeşitli amaçlar için kullanılır. Wallarm'ı, algılanan hit'ler hakkında bilgilerin bulunduğu dosyaları Amazon S3 bucket'ınıza gönderecek şekilde ayarlayabilirsiniz. Bilgiler, her 10 dakikada bir JSON formatındaki dosyalar halinde gönderilecektir.

Her hit için veri alanları:

* `time` - hit tespit tarih ve saati Unix Timestamp formatında
* `request_id`
* `ip` - saldırganın IP'si
* Hit kaynağı türü: `datacenter`, `tor`, `remote_country`
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

Dosyalar, `wallarm_hits_{timestamp}.json` veya `wallarm_hits_{timestamp}.jsonl` adlandırma kuralları kullanılarak S3 bucket'ınıza kaydedilecektir. Format, JSON Array veya New Line Delimited JSON (NDJSON) seçeneklerinden entegrasyon kurulumu sırasında tercihinize bağlı olacaktır.

## Entegrasyonu Ayarlama

Amazon S3 ile entegrasyonu kurarken, kullanacağınız yetkilendirme yöntemine karar vermeniz gerekir:

* **Via role ARN (recommended)** - dış ID seçeneğine sahip roller kullanarak kaynaklara erişim izni vermek, AWS tarafından [recommended](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console) yöntemi olarak tavsiye edilir; bu yöntem, güvenliği artırır ve "confused deputy" saldırılarını önler. Wallarm, organizasyon hesabınıza özel benzersiz bir ID sağlar.
* **Via secret access key** - daha yaygın, daha basit bir yöntem olup, AWS IAM kullanıcınızın paylaşılan [access key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) gerektirir. Bu yöntemi seçtiğinizde, entegrasyonda kullanılan S3 bucket'a yalnızca yazma iznine sahip ayrı bir IAM kullanıcısının access key'ini kullanmanız tavsiye edilir.

Bir Amazon S3 entegrasyonu ayarlamak için:

1. Wallarm için bir Amazon S3 bucket'ı, [talimatları](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) izleyerek oluşturun.
1. Seçtiğiniz yetkilendirme yöntemine bağlı olarak farklı adımları takip edin.

    === "Role ARN"

        1. AWS UI'da, S3 → bucket'ınızı → **Properties** sekmesine gidin ve bucket'ınızın **AWS Region** ve **Amazon Resource Name (ARN)** kodunu kopyalayın.

            Örneğin, bölge olarak `us-west-1` ve ARN olarak `arn:aws:s3:::test-bucket-json`.

        1. Wallarm Console UI'da, **Integrations** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Add integration** butonuna tıklayıp **AWS S3**'ü seçin.
        1. Bir entegrasyon adı girin.
        1. Daha önce kopyaladığınız S3 bucket'ınızın AWS bölge kodunu girin.
        1. S3 bucket adınızı girin.
        1. Sağlanan Wallarm hesap kimliğini kopyalayın.
        1. Sağlanan dış ID'yi kopyalayın.
        1. AWS UI'da, IAM → **Access Management** → **Roles** altında [yeni rol](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) oluşturmayı başlatın.
        1. Güvenilen varlık türü olarak **AWS account** → **Another AWS Account**'ı seçin.
        1. Wallarm **Account ID**'sini yapıştırın.
        1. **Require external ID** seçeneğini seçin ve Wallarm tarafından sağlanan dış ID'yi yapıştırın.
        1. **Next** butonuna tıklayın ve rolünüz için aşağıdaki policy'i oluşturun:

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
        1. Rol oluşturmayı tamamlayın ve rolün ARN'sini kopyalayın.
        1. Wallarm Console UI'daki entegrasyon oluşturma diyaloğunda, **Role ARN** sekmesinde rolünüzün ARN'sini yapıştırın.

            ![Amazon S3 integration](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. AWS UI'da, S3 → bucket'ınızı → **Properties** sekmesine gidin ve bucket'ınızın **AWS Region** kodunu kopyalayın, örneğin `us-west-1`.
        1. IAM → Dashboard → **Manage access keys** → **Access keys** bölümüne gidin.
        1. Depoladığınız veya yeni oluşturduğunuz/kaybolan anahtarı geri yüklediğiniz access key ID'sini alın; her durumda, aktif anahtarınıza ve anahtar ID'nize ihtiyacınız olacak.
        1. Wallarm Console UI'da, **Integrations** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Add integration** butonuna tıklayıp **AWS S3**'ü seçin.
        1. Bir entegrasyon adı girin.
        1. Daha önce kopyaladığınız S3 bucket'ınızın AWS bölge kodunu girin.
        1. S3 bucket adınızı girin.
        1. **Secret access key** sekmesinde, access key ID ve anahtarın kendisini girin.

1. Wallarm verileri için JSON Array veya New Line Delimited JSON (NDJSON) formatından birini seçin.
1. **Regular notifications** bölümünde, son 10 dakikadaki hit'lerin gönderilmek üzere seçili olduğundan emin olun. Seçilmezse, veriler S3 bucket'ınıza gönderilmeyecektir.
1. Yapılandırma doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration** butonuna tıklayın.

    Amazon S3 için, entegrasyon testi verilerin bulunduğu JSON dosyasını bucket'ınıza gönderir. İşte son 10 dakikada tespit edilen hit'lere ait verilerin bulunduğu JSON dosyasının örneği:

    === "JSON Array"
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
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. **Add integration** butonuna tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

Saklanan veri miktarını kontrol altında tutmak için, Amazon S3 bucket'ınızdaki eski nesnelerin otomatik olarak silinmesini ayarlamanız [burada](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) tarif edildiği şekilde tavsiye edilir.

## Bir Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kesintisi ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"