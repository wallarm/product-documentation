# Amazon S3

Amazon S3 kovanınızda tespit edilen hitler hakkındaki bilgileri içeren dosyaları göndermek üzere Wallarm'ı ayarlayabilirsiniz. Bilgiler, her 10 dakikada bir JSON formatında dosyalar halinde gönderilecektir.

Her bir hit için veri alanları:

* `time` - Unix Zaman Damgası formatında hit tespitinin tarihi ve saati
* `request_id`
* `ip` - saldırganın IP'si
* Hit kaynak tipi: `datacenter`, `tor`, `remote_country`
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

Dosyalar, entegrasyon kurulumu sırasında seçiminize bağlı olarak, JSON Dizisi veya Yeni Satıra Sınırlı JSON (NDJSON) formatı olacak şekilde, `wallarm_hits_{timestamp}.json` veya `wallarm_hits_{timestamp}.jsonl` adlandırma kuralına göre S3 kovanınıza kaydedilecektir.

## Entegrasyonun ayarlanması

Amazon S3 ile entegrasyon kurarken, hangi yetkilendirme yöntemini kullanacağınıza karar vermeniz gerekmektedir:

* **Rol ARN ile (önerilir)** - kaynaklara erişimi vermek için dış kimlik ile roller kullanma yöntemi, AWS tarafından "kafa karışıklığına uğramış mübaşir" saldırılarını önlemeye yardımcı olan ve güvenliği artıran bir yöntem olarak [önerilir](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console). Wallarm, organizasyon hesabınız için benzersiz bir kimlik sağlar.
* **Gizli erişim anahtarı ile** - sadece entegrasyonda kullanılan S3 kovanına yazma izni olan ayrı bir IAM kullanıcısının erişim anahtarını kullanmanız [önerilir](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) olan daha yaygın, daha basit bir yöntem.

Amazon S3 entegrasyonunu ayarlamak için:

1. Wallarm için bir Amazon S3 kovası oluşturun. Bunun için [talimatlara](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) göz atın.
1. Seçtiğiniz yetkilendirme yöntemine bağlı olarak farklı adımları uygulayın.

    === "Rol ARN"

        1. AWS UI'da, S3 → kovanınız → **Özellikler** sekmesine gidin ve kovanınızın **AWS Bölge** kodunu ve **Amazon Kaynak Adı (ARN)**'ını kopyalayın.

            Örneğin, bir bölge olarak `us-west-1` ve ARN olarak `arn:aws:s3:::test-bucket-json`.

        1. Wallarm Konsolu UI'da, **Entegrasyonlar** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Entegrasyon ekle** düğmesine tıklayın ve **AWS S3**'ü seçin.
        1. Bir entegrasyon adı girin.
        1. Daha önce kopyaladığınız S3 kovanınızın AWS bölge kodunu girin.
        1. S3 kovanınızın adını girin.
        1. Sağlanan Wallarm hesap ID'sini kopyalayın.
        1. Sağlanan dış kimliği kopyalayın.
        1. AWS UI'da, IAM → **Erişim Yönetimi** → **Roller** altında [yeni bir rol](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) oluşturmayı başlatın.
        1. **AWS hesabı** → **Başka bir AWS Hesabı**nı güvenilir varlık türü olarak seçin.
        1. Wallarm **Hesap ID**'sini yapıştırın.
        1. **Dış kimlik gerektir**'i seçin ve Wallarm tarafından sağlanan dış kimliği yapıştırın.
        1. **Sonraki**'ye tıklayın ve rolünüz için politika oluşturun:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<KOVANIZIN_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. Rol oluşturmayı tamamlayın ve rolün ARN'sini kopyalayın.
        1. Wallarm Konsolu UI'da, entegrasyon oluşturma iletişim kutunuzda, **Rol ARN** sekmesinde, rolün ARN'sini yapıştırın.

            ![Amazon S3 entegrasyonu](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Gizli erişim anahtarı"

        1. AWS UI'da, S3 → kovanınız → **Özellikler** sekmesine gidin ve kovanınızın **AWS Bölge** kodunu kopyalayın, örneğin `us-west-1`.
        1. IAM → Gösterge Tablosu → **Erişim anahtarlarını yönet** → **Erişim anahtarları** bölümüne gidin.
        1. Erişim anahtarının ID'sini bir yerlerde saklıyorsanız getirin veya [burada](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/) açıklandığı gibi yeni bir anahtar oluşturun/kayıp anahtarı geri yükleyin. Ancak aktif anahtarınıza ve ID'sine ihtiyacınız olacak.
        1. Wallarm Konsolu UI'da, **Entegrasyonlar** bölümünü açın.
        1. **AWS S3** bloğuna tıklayın veya **Entegrasyon ekle** düğmesine tıklayın ve **AWS S3**'ü seçin.
        1. Bir entegrasyon adı girin.
        1. Daha önce kopyaladığınız S3 kovanınızın AWS bölge kodunu girin.
        1. S3 kovanınızın adını girin.
        1. **Gizli erişim anahtarı** sekmesinde, erişim anahtarı ID'sini ve anahtarı kendisini girin.

1. Wallarm verisi için bir format seçin: ya bir JSON Dizisi ya da bir Yeni Satıra Sınırlı JSON (NDJSON).
1. **Düzenli bildirimler** bölümünde, son 10 dakikadaki hitlerin gönderilmesinin seçili olduğunu kontrol edin. Seçilmezse, veri S3 kovasına gönderilmez.
1. **Entegrasyonu test et**'i tıklayın ve yapılandırmanın doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol edin.

    Amazon S3 için, entegrasyon testi, veriyle JSON dosyasını kovanınıza gönderir. İşte son 10 dakikada tespit edilen hitlere ait verilerle bir JSON dosyasının örneği:

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
    === "Yeni Satıra Sınırlı JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. **Entegrasyon ekle**'i tıklayın.

Depolanan veri miktarını kontrol etmek için, Amazon S3 kovanınızdaki eski nesnelerin otomatik olarak silinmesini ayarlamak [önerilir](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html).

## Entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlık durumu ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"