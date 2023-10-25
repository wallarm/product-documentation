# Fluentd

Wallarm'ı, Wallarm Konsolu'ndaki uygun bir entegrasyonu oluşturarak tespit edilen olayların bildirimlerini Fluentd'ye göndermek üzere ayarlayabilirsiniz.

## Bildirim formatı

Wallarm, olay hakkında Wallarm'ın bildirimde bulunduğu JSON nesnelerinin setine bağlı olarak Fluentd'ye **webhooks** aracılığıyla JSON formatında bildirimler gönderir.

Yeni tespit edilen hit'in bildirimi örneği:

```json
[
    {
        "summary": "[Wallarm] Yeni hit tespit edildi",
        "details": {
        "client_name": "TestŞirketi",
        "cloud": "EU",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "BIR_değer",
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

* POST veya PUT isteklerini kabul et
* HTTPS isteklerini kabul et
* Halka açık URL'ye sahip ol

Fluentd yapılandırma örneği:

```bash linenums="1"
<source>
  @type http # HTTP ve HTTPS trafiği için giriş eklentisi
  port 9880 # gelen istekler için port
  <transport tls> # bağlantıların işlenmesi için yapılandırma
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # Fluentd günlüklerini komut satırına yazdırmak için çıktı eklentisi
     output_type json # komut satırına yazdırılan günlüklerin formatı
  </store>
</match>
```

Daha fazla detayı [resmi Fluentd belgelerinde](https://docs.datadoghq.com/integrations/fluentd) bulabilirsiniz.

## Entegrasyonun kurulması

1. Wallarm Konsolu → **Entegrasyonlar** → **Fluentd** üzerinden Fluentd entegrasyon kurulumuna geçin.
1. Entegrasyon adını girin.
1. Hedef Fluentd URL'sini (Webhook URL) belirtin.
1. Gerektiğinde, gelişmiş ayarları yapılandırın:

   --8<-- "../include-tr/integrations/webhook-advanced-settings.md"
1. Bildirimlere tetikleyici olacak olay türlerini seçin.

   ![Fluentd entegrasyonu](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

   Mevcut olaylar hakkında detaylar:

   --8<-- "../include-tr/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu Test Et**'e tıklayın.

   Test Fluentd günlüğü:

   ```json
   [
       {
           summary:"[Test mesajı] [Test ortak(US)] Yeni güvenlik açığı tespit edildi",
           description:"Bildirim türü: vuln

                       Sistemde yeni bir güvenlik açığı tespit edildi.

                       ID: 
                       Başlık: Test
                       Domain: example.com
                       Yol: 
                       Yöntem: 
                       Keşfeden: 
                       Parametre: 
                       Tür: Bilgi
                       Tehdit: Orta

                       Daha fazla detay: https://us1.my.wallarm.com/object/555


                       Müşteri: TestŞirketi
                       Bulut: US
                       ",
           details:{
               client_name:"TestŞirketi",
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

1. **Entegrasyonu Ekle**'ye tıklayın.

## Ek uyarıların ayarlanması

--8<-- "../include-tr/integrations/integrations-trigger-setup.md"

## Fluentd'yi ara veri toplayıcı olarak kullanma

--8<-- "../include-tr/integrations/webhook-examples/overview.md"

Örneğin:

![Webhook akışı](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

Bu şemayı kullanarak Wallarm olaylarını kaydetmek için:

1. Veri toplayıcısını, gelen webhooks'ları okumak ve günlükleri bir sonraki sisteme iletme şeklinde yapılandırın. Wallarm, etkinlikleri webhooks aracılığıyla veri toplayıcılarına gönderir.
1. SIEM sistemini, veri toplayıcıdan günlükleri alıp okumak için ayarlayın.
1. Wallarm'ı, veri toplayıcısına günlükler göndermek üzere ayarlayın.

   Wallarm, herhangi bir veri toplayıcısına webhooks aracılığıyla günlük gönderebilir.

   Wallarm'ı Fluentd veya Logstash ile entegre etmek için, Wallarm Konsolu UI'da ilgili entegrasyon kartlarını kullanabilirsiniz.

   Wallarm'ı diğer veri toplayıcıları ile entegre etmek için, Wallarm Konsolu UI'deki [webhook entegrasyon kartını](webhook.md) kullanabilirsiniz.

Popüler veri toplayıcıları ile entegrasyonun nasıl yapılandırılacağına dair bazı örnekler aşağıda açıklanmıştır:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

   Wallarm, ara veri toplayıcısının kullanılmasını gerektirmeyen [Datadog ile doğal entegrasyonu Datadog API üzerinden destekler](datadog.md).

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem verilemezliği ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"