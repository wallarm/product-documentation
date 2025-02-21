# Logstash

[Logstash](https://www.elastic.co/logstash), Elastic tarafından geliştirilen açık kaynaklı bir veri işleme ve log yönetimi aracıdır. Wallarm'ı, tespit edilen olay bildirimlerini Logstash'e gönderecek şekilde yapılandırabilirsiniz.

## Bildirim Formatı

Wallarm, bildirimleri **webhook** aracılığıyla JSON formatında Logstash'e gönderir. JSON nesnelerinin kümesi, Wallarm'ın bildirim yaptığı olaya bağlıdır.

Yeni tespit edilen hit bildirimine bir örnek:

```json
[
    {
        "summary": "[Wallarm] New hit detected",
        "details": {
        "client_name": "TestCompany",
        "cloud": "EU",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "SOME_value",
            "path": "/news/some_path",
            "payloads": [
                "say ni"
            ],
            "point": [
                "post"
            ],
            "probability": 0.01,
            "remote_country": "PL",
            "remote_port": 0,
            "remote_addr4": "8.8.8.8",
            "remote_addr6": "",
            "tor": "none",
            "request_time": 1603834606,
            "create_time": 1603834608,
            "response_len": 14,
            "response_status": 200,
            "response_time": 5,
            "stamps": [
                1111
            ],
            "regex": [],
            "stamps_hash": -22222,
            "regex_hash": -33333,
            "type": "sqli",
            "block_status": "monitored",
            "id": [
                "hits_production_999_202010_v_1",
                "c2dd33831a13be0d_AC9"
            ],
            "object_type": "hit",
            "anomaly": 0
            }
        }
    }
]
```

## Gereksinimler

Logstash yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmek
* HTTPS isteklerini kabul etmek
* Genel bir URL’ye sahip olmak

Logstash yapılandırma örneği:

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafiği için input eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafiğinin işlenmesi
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  stdout {} # komut satırında Logstash loglarını yazdırmak için output eklentisi
  ...
}
```

Daha fazla detayı [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) bulabilirsiniz.

## Entegrasyonu Ayarlama

1. Wallarm Console → **Integrations** → **Logstash** bölümüne giderek Logstash entegrasyon ayarlarına devam edin.
1. Entegrasyon adını girin.
1. Hedef Logstash URL'sini (Webhook URL) belirtin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Bildirimleri tetikleyecek olay tiplerini seçin.

    ![Logstash integration](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    Kullanılabilir olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** butonuna tıklayın.

    Test Logstash logu:

    ```json
    [
        {
            summary:"[Test message] [Test partner(US)] New vulnerability detected",
            description:"Notification type: vuln

                        New vulnerability was detected in your system.

                        ID: 
                        Title: Test
                        Domain: example.com
                        Path: 
                        Method: 
                        Discovered by: 
                        Parameter: 
                        Type: Info
                        Threat: Medium

                        More details: https://us1.my.wallarm.com/object/555


                        Client: TestCompany
                        Cloud: US
                        ",
            details:{
                client_name:"TestCompany",
                cloud:"US",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"example.com",
                    id:null,
                    method:null,
                    parameter:null,
                    path:null,
                    title:"Test",
                    discovered_by:null,
                    threat:"Medium",
                    type:"Info"
                }
            }
        }
    ]
    ```

1. **Add integration** butonuna tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıları Ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Araca Ara Toplayıcı Olarak Logstash Kullanma

--8<-- "../include/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını loglamak için:

1. Gelen webhook'ları okuyup logları bir sonraki sisteme iletecek şekilde veri toplayıcıyı yapılandırın. Wallarm, olayları webhook'lar aracılığıyla veri toplayıcılara gönderir.
1. Veri toplayıcıdan logları alıp okuyacak şekilde bir SIEM sistemini yapılandırın.
1. Wallarm'ı, logları veri toplayıcıya gönderecek şekilde yapılandırın.

    Wallarm, logları webhook'lar aracılığıyla herhangi bir veri toplayıcıya gönderebilir.

    Wallarm'ı Fluentd veya Logstash ile entegre etmek için, Wallarm Console UI'da ilgili entegrasyon kartlarını kullanabilirsiniz.

    Wallarm'ı diğer veri toplayıcıları ile entegre etmek için, Wallarm Console UI'da bulunan [webhook integration card](webhook.md) kullanılabilir.

Popüler veri toplayıcılara logları SIEM sistemlerine iletmek için entegrasyonun nasıl yapılandırılacağına dair bazı örnekleri açıkladık:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm ayrıca [Datadog API aracılığıyla Datadog ile yerel entegrasyonu](datadog.md) desteklemektedir. Yerel entegrasyon için ara veri toplayıcının kullanılmasına gerek yoktur.

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"