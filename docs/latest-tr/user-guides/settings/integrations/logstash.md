# Logstash

[Logstash](https://www.elastic.co/logstash), Elastic tarafından geliştirilen açık kaynaklı bir veri işleme ve log yönetimi aracıdır. Wallarm’ı tespit edilen olayların bildirilerini Logstash’e gönderecek şekilde yapılandırabilirsiniz.

## Bildirim formatı

Wallarm, Logstash’e JSON formatında **webhook**’lar üzerinden bildirim gönderir. JSON nesnelerinin kümesi, Wallarm’ın bildirdiği olaya bağlıdır.

Tespit edilen yeni hit bildirimi örneği:

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

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Herkese açık bir URL’ye sahip olmalıdır

Logstash yapılandırma örneği:

```bash linenums="1"
input {
  http { # HTTP ve HTTPS trafiği için input eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafiği işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  stdout {} # Logstash loglarını komut satırında yazdırmak için output eklentisi
  ...
}
```

Daha fazla ayrıntıyı [resmi Logstash dokümantasyonunda](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) bulabilirsiniz.

## Entegrasyonun ayarlanması

1. Wallarm Console → **Integrations** → **Logstash** içinde Logstash entegrasyon kurulumuna ilerleyin.
1. Entegrasyon adını girin.
1. Hedef Logstash URL’sini belirtin (Webhook URL).
1. Gerekirse gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Logstash entegrasyonu](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını doğrulamak için **Test integration**’a tıklayın.

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

1. **Add integration**’a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıların ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Ara veri toplayıcı olarak Logstash kullanımı

--8<-- "../include/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook akışı](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını loglamak için:

1. Gelen webhook’ları okumak ve logları bir sonraki sisteme iletmek üzere veri toplayıcıyı yapılandırın. Wallarm, olayları veri toplayıcılara webhook’lar aracılığıyla gönderir.
1. Bir SIEM sistemini, logları veri toplayıcıdan alıp okumak üzere yapılandırın.
1. Wallarm’ı logları veri toplayıcıya gönderecek şekilde yapılandırın.

    Wallarm, webhook’lar aracılığıyla logları herhangi bir veri toplayıcıya gönderebilir.

    Wallarm’ı Fluentd veya Logstash ile entegre etmek için Wallarm Console UI içindeki ilgili integration cards kullanılabilir.

    Wallarm’ı diğer veri toplayıcılarla entegre etmek için Wallarm Console UI içindeki [webhook integration card](webhook.md) kullanılabilir.

Logları SIEM sistemlerine ileten popüler veri toplayıcılarla entegrasyonun nasıl yapılandırılacağına dair bazı örnekleri anlattık:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm ayrıca [Datadog API aracılığıyla Datadog ile yerel entegrasyonu](datadog.md) destekler. Yerel entegrasyon, ara bir veri toplayıcı kullanımını gerektirmez.

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"