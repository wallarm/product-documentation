# Webhook

Wallarm'ı, HTTPS protokolü üzerinden gelen webhook'ları kabul eden herhangi bir sisteme anında bildirim gönderecek şekilde ayarlayabilirsiniz.

## Bildirim Formatı

Bildirimler, entegrasyon kurulumu sırasında seçiminize bağlı olarak JSON Array veya New Line Delimited JSON (NDJSON) formatında gönderilir. JSON nesneleri kümesi, bildirimin gönderildiği olaya bağlıdır. Örneğin:

* Hit tespit edildi

    === "JSON Array"
        ```json
        [
        {
            "summary": "[Wallarm] Yeni hit tespit edildi",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 20.714285714285715,
                "method": "GET",
                "path": "/",
                "payloads": [
                  "1' select version();"
                ],
                "point": [
                  "get",
                  "id"
                ],
                "probability": 20.714285714285715,
                "remote_country": null,
                "remote_port": 41253,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519823,
                "create_time": 1703519826,
                "response_len": 345,
                "response_status": 404,
                "response_time": 359,
                "stamps": [
                  7965
                ],
                "regex": [],
                "stamps_hash": 271168947,
                "regex_hash": -2147483648,
                "type": "sqli",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "rest",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 1.0357142857142858,
                "parameter": "GET_id_value",
                "applications": [
                  "default"
                ]
              }
           }
        },
        {
            "summary": "[Wallarm] Yeni hit tespit edildi",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 2.5,
                "method": "GET",
                "path": "/etc/passwd",
                "payloads": [
                  "/etc/passwd"
                ],
                "point": [
                  "uri"
                ],
                "probability": 2.5,
                "remote_country": null,
                "remote_port": 41254,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519826,
                "create_time": 1703519829,
                "response_len": 345,
                "response_status": 404,
                "response_time": 339,
                "stamps": [
                  2907
                ],
                "regex": [],
                "stamps_hash": -1063984326,
                "regex_hash": -2147483648,
                "type": "ptrav",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "none",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 0.22727272727272727,
                "parameter": "URI_value",
                "applications": [
                  "default"
                ]
              }
           }
        }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] Yeni hit tespit edildi","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":20.714285714285715,"method":"GET","path":"/","payloads":["1' select version();"],"point":["get","id"],"probability":20.714285714285715,"remote_country":null,"remote_port":41253,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519823,"create_time":1703519826,"response_len":345,"response_status":404,"response_time":359,"stamps":[7965],"regex":[],"stamps_hash":271168947,"regex_hash":-2147483648,"type":"sqli","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"rest","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":1.0357142857142858,"parameter":"GET_id_value","applications":["default"]}}
        {"summary":"[Wallarm] Yeni hit tespit edildi","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":2.5,"method":"GET","path":"/etc/passwd","payloads":["/etc/passwd"],"point":["uri"],"probability":2.5,"remote_country":null,"remote_port":41254,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519826,"create_time":1703519829,"response_len":345,"response_status":404,"response_time":339,"stamps":[2907],"regex":[],"stamps_hash":-1063984326,"regex_hash":-2147483648,"type":"ptrav","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"none","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":0.22727272727272727,"parameter":"URI_value","applications":["default"]}}
        ```
* Zafiyet tespit edildi

    === "JSON Array"
        ```json
        [
            {
                summary:"[Wallarm] Yeni zafiyet tespit edildi",
                description:"Bildirim tipi: vuln

                            Sisteminizde yeni bir zafiyet tespit edildi.

                            ID: 
                            Başlık: Test
                            Domain: example.com
                            Path: 
                            Method: 
                            Tespit eden: 
                            Parametre: 
                            Tip: Info
                            Tehdit: Medium

                            Daha fazla detay: https://us1.my.wallarm.com/object/555


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
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] Yeni zafiyet tespit edildi","description":"Bildirim tipi: vuln\nSisteminizde yeni bir zafiyet tespit edildi.\nID: \nBaşlık: Test\nDomain: example.com\nPath: \nMethod: \nTespit eden: \nParametre: \nTip: Info\nTehdit: Medium\nDaha fazla detay: https://us1.my.wallarm.com/object/555\nClient: TestCompany\nCloud: US","details":{"client_name":"TestCompany","cloud":"US","notification_type":"vuln","vuln_link":"https://us1.my.wallarm.com/object/555","vuln":{"domain":"example.com","id":null,"method":null,"parameter":null,"path":null,"title":"Test","discovered_by":null,"threat":"Medium","type":"Info"}}}
        ```

## Entegrasyonun Ayarlanması

1. Wallarm UI'i açın → **Integrations**.
1. **Webhook** bloğuna tıklayın veya **Add integration** butonuna tıklayıp **Webhook** seçeneğini seçin.
1. Bir entegrasyon adı girin.
1. Hedef Webhook URL'sini girin.
1. Gerekirse, gelişmiş ayarları yapılandırın:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Gelişmiş ayarlar örneği](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Webhook entegrasyonu](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    Mevcut olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**'a tıklayın. Test bildirimleri, New Line Delimited JSON (NDJSON) seçilmiş olsa bile her zaman JSON Array formatında gönderilir.
1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: IP adresi denylist'e eklendiğinde Webhook URL'sine bildirim gönderilmesi

Bir IP adresi denylist'e eklendiğinde, bu olay hakkında webhook, Webhook URL'sine gönderilecektir.

![Kara listeye alınan IP için tetikleyici örneği](../../../images/user-guides/triggers/trigger-example4.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console'u açın → **IP lists** → **Denylist** ve IP adresini denylist'e ekleyin. Örneğin:

    ![IP'nin denylist'e eklenmesi](../../../images/user-guides/triggers/test-ip-blocking.png)
2. Aşağıdaki webhook'un Webhook URL'sine gönderildiğini doğrulayın:

    ```
    [
        {
            "summary": "[Wallarm] Tetikleyici: Yeni IP adresi kara listeye alındı",
            "description": "Bildirim tipi: ip_blocked\n\nIP adresi 1.1.1.1, Produces many attacks nedeniyle 2021-06-10 02:27:15 +0300 tarihine kadar kara listeye alındı. Wallarm Console'un \"Denylist\" bölümünde engellenen IP adreslerini inceleyebilirsiniz.\nBu bildirim, \"Notification about denylisted IP\" tetikleyicisi tarafından tetiklendi. IP, Application #8 uygulaması için engellendi.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notification about denylisted IP",
            "application": "Application #8",
            "reason": "Produces many attacks",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notification about denylisted IP` tetikleyici adı
    * `TestCompany` Wallarm Console'daki şirket hesabınızın adıdır
    * `EU` şirket hesabınızın kayıtlı olduğu Wallarm Cloud'tur

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"
