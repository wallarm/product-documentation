# Fluentd

[Fluentd](https://www.fluentd.org/) açık kaynaklı, çok yönlü ve hafif veri toplayıcı (aggregator) ve taşıma aracı olarak hizmet veren bir veri toplama yazılım aracıdır. Wallarm'ı, Wallarm Console'da uygun bir entegrasyon oluşturarak tespit edilen olayların bildirimlerini Fluentd'ye gönderecek şekilde yapılandırabilirsiniz.

## Bildirim Formatı

Wallarm, bildirimleri JSON formatında **webhooks** aracılığıyla Fluentd'ye gönderir. JSON nesnelerinin seti, Wallarm'ın bildirdiği olaya bağlı olarak değişir.

Yeni bir hit tespit bildirimine örnek:

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
* Genel (public) URL'ye sahip olmalıdır

Fluentd yapılandırma örneği:

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için giriş eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantı yönetimi için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # komut satırında Fluentd günlüklerini yazdırmak için çıkış eklentisi
     output_type json # komut satırında yazdırılan günlüklerin formatı
  </store>
</match>
```

Daha fazla detayı [official Fluentd documentation](https://docs.datadoghq.com/integrations/fluentd) adresinde bulabilirsiniz.

## Entegrasyon Kurulumu

1. Wallarm Console → **Integrations** → **Fluentd** bölümünden Fluentd entegrasyon kurulumuna geçin.
1. Entegrasyon adını girin.
1. Hedef Fluentd URL'sini (Webhook URL) belirtin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Fluentd entegrasyonu](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    Mevcut olaylarla ilgili detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** seçeneğine tıklayın.

    Test Fluentd günlük örneği:

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

1. **Add integration** seçeneğine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Fluentd'yi Orta Düzey Veri Toplayıcı Olarak Kullanma

--8<-- "../include/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook akış şeması](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını kaydetmek için:

1. Gelen webhooks'u okuyup günlükleri bir sonraki sisteme iletecek şekilde veri toplayıcıyı yapılandırın. Wallarm, olayları webhooks aracılığıyla veri toplayıcılara gönderir.
1. Veri toplayıcıdan günlükleri alıp okuyacak şekilde bir SIEM sistemini yapılandırın.
1. Wallarm'ı, günlükleri veri toplayıcıya gönderecek şekilde yapılandırın.

    Wallarm, webhooks aracılığıyla herhangi bir veri toplayıcıya günlük gönderebilir.

    Wallarm'ı Fluentd veya Logstash ile entegre etmek için, Wallarm Console UI'de ilgili entegrasyon kartlarını kullanabilirsiniz.

    Wallarm'ı diğer veri toplayıcılarıyla entegre etmek için Wallarm Console UI'de bulunan [webhook integration card](webhook.md) kartını kullanabilirsiniz.

Popüler veri toplayıcılara günlük ileten SIEM sistemleri ile entegrasyon nasıl yapılandırılır örneklerini aşağıda açıkladık:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm ayrıca [Datadog API üzerinden Datadog ile yerel entegrasyonu](datadog.md) desteklemektedir. Yerel entegrasyon, ara veri toplayıcı kullanılmasını gerektirmez.

## Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"