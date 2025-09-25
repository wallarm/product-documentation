# Fluentd

[Fluentd](https://www.fluentd.org/), çok yönlü ve hafif bir veri toplayıcı ve taşıma mekanizması olarak hizmet veren açık kaynaklı bir veri toplama yazılım aracıdır. Wallarm Console içinde uygun bir entegrasyon oluşturarak Wallarm’ın tespit edilen olay bildirimlerini Fluentd’ye göndermesini yapılandırabilirsiniz.

## Bildirim formatı

Wallarm, Fluentd’ye JSON formatında **webhook**’lar üzerinden bildirimler gönderir. JSON nesnelerinin kümesi, Wallarm’ın bildirdiği olaya bağlıdır.

Yeni hit tespiti bildirimine örnek:

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

Fluentd yapılandırması aşağıdaki gereksinimleri karşılamalıdır:

* POST veya PUT isteklerini kabul etmelidir
* HTTPS isteklerini kabul etmelidir
* Genel erişilebilir bir URL’ye sahip olmalıdır

Fluentd yapılandırma örneği:

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için input eklentisi
  port 9880 # Gelen istekler için port
  <transport tls> # Bağlantıların işlenmesine yönelik yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # Fluentd günlüklerini komut satırında yazdıran output eklentisi
     output_type json # Komut satırında yazdırılan günlüklerin biçimi
  </store>
</match>
```

Daha fazla ayrıntıyı [resmi Fluentd belgelerinde](https://docs.datadoghq.com/integrations/fluentd) bulabilirsiniz.

## Entegrasyonu yapılandırma

1. Wallarm Console → Integrations → Fluentd içinde Fluentd entegrasyonu kurulumuna gidin.
1. Entegrasyon adını girin.
1. Hedef Fluentd URL’sini belirtin (Webhook URL).
1. Gerektiğinde gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Fluentd entegrasyonu](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    Kullanılabilir olayların ayrıntıları:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**’a tıklayın.

    Test Fluentd günlüğü:

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

## Ek uyarıları yapılandırma

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Fluentd’yi ara veri toplayıcı olarak kullanma

--8<-- "../include/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook akışı](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını kaydetmek için:

1. Gelen webhook’ları okuyup günlükleri bir sonraki sisteme iletecek şekilde veri toplayıcıyı yapılandırın. Wallarm, olayları veri toplayıcılara webhook’lar üzerinden gönderir.
1. SIEM sistemini, veri toplayıcıdan günlükleri alıp okumak üzere yapılandırın.
1. Wallarm’ı günlükleri veri toplayıcıya gönderecek şekilde yapılandırın.

    Wallarm, webhook’lar aracılığıyla herhangi bir veri toplayıcıya günlük gönderebilir.

    Wallarm’ı Fluentd veya Logstash ile entegre etmek için Wallarm Console UI içindeki ilgili integration cards kullanabilirsiniz.

    Wallarm’ı diğer veri toplayıcılarla entegre etmek için Wallarm Console UI içinde [webhook integration card](webhook.md) kullanabilirsiniz.

Günlükleri SIEM sistemlerine ileten popüler veri toplayıcılarla entegrasyonun nasıl yapılandırılacağına ilişkin bazı örnekleri açıkladık:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm ayrıca [Datadog API üzerinden Datadog ile yerel entegrasyonu](datadog.md) destekler. Yerel entegrasyon, ara veri toplayıcı kullanımını gerektirmez.

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"