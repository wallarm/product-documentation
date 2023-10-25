# Logstash

Wallarm, tespit edilen olayların bildirimlerini Logstash'e göndermek üzere ayarlanabilir.

## Bildirim formatı

Wallarm, JSON formatında **webhooks** aracılığıyla Logstash'e bildirimler gönderir. JSON nesnelerinin kümesi, Wallarm'ın bildirimde bulunduğu olaya bağlıdır.

Yeni tespit edilen bir vuruşun bildirimi örneği:

```json
[
    {
        "summary": "[Wallarm] Yeni vuruş tespit edildi",
        "details": {
        "client_name": "TestŞirketi",
        "cloud": "AB",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "BIR_DEGER",
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

Logstash yapılandırmasının aşağıdaki gereksinimleri karşılaması gerekir:

* POST veya PUT isteklerini kabul etme
* HTTPS isteklerini kabul etme
* Açık URL'ye sahip olma

Logstash yapılandırma örneği:

```bash linenums="1"
input {
  http { # HTTP and HTTPS trafiği için giriş eklentisi
    port => 5044 # gelen istekler için port
    ssl => true # HTTPS trafiği işleme
    ssl_certificate => "/etc/server.crt" # Logstash TLS sertifikası
    ssl_key => "/etc/server.key" # TLS sertifikası için özel anahtar
  }
}
output {
  stdout {} # Logstash günlüklerini komut satırında yazdırmak için çıkış eklentisi
  ...
}
```

Daha fazla ayrıntıyı [resmi Logstash belgelerinde](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) bulabilirsiniz.

## Entegrasyonun Ayarlanması

1. Wallarm Konsolu → **Entegrasyonlar** → **Logstash**'deki Logstash entegrasyonu kurulumuna ilerleyin.
1. Entegrasyon adını girin.
1. Hedef Logstash URL'sini (Webhook URL) belirtin.
1. Gerekirse gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Logstash entegrasyonu](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    Mevcut olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Bulut'unun erişilebilirliğini ve bildirim biçimini kontrol etmek için **Entegrasyonu Test Et**'e tıklayın.

    Test Logstash gümberti:

    ```json
    [
        {
            summary:"[Test mesajı] [Test ortağı(ABD)] Yeni açıklık tespit edildi",
            description:"Bildirim türü: vuln

                        Sisteminizde yeni bir açıklık tespit edildi.

                        ID: 
                        Başlık: Test
                        Alan adı: example.com
                        Yol: 
                        Metod: 
                        Tespit eden: 
                        Parametre: 
                        Tür: Bilgi
                        Tehdit: Orta

                        Daha fazla detay: https://us1.my.wallarm.com/object/555


                        Müşteri: TestŞirketi
                        Bulut: ABD
                        ",
            details:{
                client_name:"TestŞirketi",
                cloud:"ABD",
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
                    threat:"Orta",
                    type:"Bilgi"
                }
            }
        }
    ]
    ```

1. **Entegrasyon Ekle**'ye tıklayın.

## Ek uyarıların ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Logstash'ın ara veri toplayıcı olarak kullanılması

--8<-- "../include/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook akışı](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını günlüğe almak için:

1. Veri toplayıcısını, gelen webhooks'u okumak ve günlükleri bir sonraki sisteme yönlendirmek üzere yapılandırın. Wallarm, olayları webhooks aracılığıyla veri toplayıcılara gönderir.
1. Veri toplayıcıdan günlükleri almak ve okumak üzere bir SIEM sistemini yapılandırın.
1. Wallarm'ı, günlükleri veri toplayıcıya göndermek üzere yapılandırın.

    Wallarm, günlükleri webhooks aracılığıyla herhangi bir veri toplayıcıya gönderebilir.

    Wallarm'ı Fluentd veya Logstash ile entegre etmek için, Wallarm Konsol UI'da ilgili entegrasyon kartlarını kullanabilirsiniz.

    Wallarm'ı diğer veri toplayıcılarla entegre etmek için, Wallarm Konsol UI'deki [webhook entegrasyon kartını](webhook.md) kullanabilirsiniz.

SIEM sistemlerine günlükleri ileten popüler veri toplayıcılarla entegrasyonun nasıl yapılandırılacağına dair bazı örnekleri anlattık:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm ayrıca [Datadog API aracılığıyla Datadog ile doğal entegrasyonu](datadog.md) da destekler. Doğal entegrasyon, ara veri toplayıcının kullanılmasını gerektirmez.

## Bir entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"