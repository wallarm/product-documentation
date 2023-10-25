# Webhook

Wallarm'ı, gelen web kancalarını HTTPS protokolü üzerinden kabul eden herhangi bir sisteme anında bildirimler göndermek üzere ayarlayabilirsiniz.

## Bildirim formatı

Bildirimler JSON formatında gönderilir. JSON nesneleri kümesi, bildirimin gönderildiği olaya bağlıdır. Örneğin:

* İsabet belirlendi

    ```json
    [
        {
            "summary": "[Wallarm] Yeni bir isabet belirlendi",
            "details": {
            "client_name": "TestFirması",
            "cloud": "AB",
            "notification_type": "new_hits",
            "hit": {
                "domain": "www.ornek.com",
                "heur_distance": 0.01111,
                "method": "POST",
                "parameter": "SOME_value",
                "path": "/haber/bir_yolu",
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
* Güvenlik açığı belirlendi

    ```json
    [
        {
            summary:"[Wallarm] Yeni bir güvenlik açığı belirlendi",
            description:"Bildirim türü: vuln

                        Sisteminizde yeni bir güvenlik açığı belirlendi.

                        ID: 
                        Başlık: Test
                        Alan adı: ornek.com
                        Sayfa: 
                        Yöntem: 
                        Tarafından Keşfedildi: 
                        Parametre: 
                        Tür: Bilgi
                        Tehdit: Orta

                        Daha fazla detay: https://us1.my.wallarm.com/object/555


                        Müşteri: TestFirması
                        Cloud: ABD
                        ",
            details:{
                client_name:"TestFirması",
                cloud:"ABD",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"ornek.com",
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

## Entegrasyonu ayarlama

1. Wallarm UI → **Entegrasyonlar**ı açın.
1. **Webhook** bloğuna tıklayın veya **Entegrasyon ekleyin** düğmesine tıklayın ve **Webhook** seçin.
1. Bir entegrasyon adı girin.
1. Hedef Webhook URL'sini girin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Gelişmiş ayarlar örneği](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Webhook entegrasyonu](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    Kullanılabilir olaylar hakkında ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Entegrasyonu test et** tıklayın ve yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol edin.

    Test webhook örneği:

    ```json
    [
        {
            summary:"[Test mesajı] [Test ortağı(ABD)] Yeni güvenlik açığı tespit edildi",
            description:"Bildirim türü: vuln

                        Sisteminizde yeni bir güvenlik açığı belirlendi.

                        ID: 
                        Başlık: Test
                        Alan adı: ornek.com
                        Sayfa: 
                        Yöntem: 
                        Tarafından Keşfedildi: 
                        Parametre: 
                        Tür: Bilgi
                        Tehdit: Orta

                        Daha fazla detay: https://us1.my.wallarm.com/object/555


                        Müşteri: TestFirması
                        Cloud: ABD
                        ",
            details:{
                client_name:"TestFirması",
                cloud:"ABD",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"ornek.com",
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

1. **Entegrasyon ekle** öğesine tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"