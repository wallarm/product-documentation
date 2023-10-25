# Sumo Logic

Wallarm'ı Sumo Logic'e mesaj göndermek üzere ayarlayabilirsiniz.

## Entegrasyonu ayarlama

Sumo Logic UI'da:

1. [Talimatlara](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector) göre bir Hosted Collector yapılandırın.
2. [Talimatlara](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source) göre bir HTTP Logs & Metrics Kaynağı yapılandırın.
3. Sağlanan **HTTP Kaynak Adresini (URL)** kopyalayın.

Wallarm UI'da:

1. **Entegrasyonlar** bölümünü açın.
1. **Sumo Logic** bloğuna tıklayın veya **Entegrasyon ekle** düğmesine tıklayın ve **Sumo Logic** seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan HTTP Kaynak Adresi (URL) değerini **HTTP Kaynak Adresi (URL)** alanına yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Sumo Logic entegrasyonu](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    Mevcut olaylar hakkında ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırma doğruluğunu, Wallarm Bulutu'nun mevcudiyetini ve bildirim formatını kontrol etmek için **Entegrasyonu test et**'e tıklayın.

    Test Sumo Logic bildirimi:

    ```json
    {
        summary:"[Test mesajı] [Test ortağı(ABD)] Yeni güvenlik açığı tespit edildi",
        description:"Bildirim tipi: güvenlik açığı

                    Sisteminizde yeni bir güvenlik açığı tespit edildi.

                    ID: 
                    Başlık: Test
                    Alan adı: example.com
                    Yol: 
                    Yöntem: 
                    Tespit eden: 
                    Parametre: 
                    Tür: Bilgi
                    Tehdit: Orta

                    Daha fazla ayrıntı: https://us1.my.wallarm.com/object/555


                    Müşteri: TestŞirketi
                    Bulut: ABD
                    ",
        details:{
            client_name:"TestŞirketi",
            cloud:"ABD",
            notification_type:"güvenlik açığı",
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
    ```

1. **Entegrasyon ekle** düğmesine tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem mevcudiyeti ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"