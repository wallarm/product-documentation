# Sumo Logic

[Sumo Logic](https://www.sumologic.com/), kuruluşlara BT operasyonları, güvenlik ve uygulama performansı hakkında gerçek zamanlı içgörüler sağlayan bulut-yerel bir makine verisi analitiği platformudur.  Wallarm'ı Sumo Logic'e mesajlar gönderecek şekilde yapılandırabilirsiniz.

## Entegrasyonu yapılandırma

Sumo Logic UI'de:

1. [Talimatları](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector) izleyerek bir Hosted Collector yapılandırın.
2. [Talimatları](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source) izleyerek bir HTTP Logs & Metrics Source yapılandırın.
3. Sağlanan **HTTP Source Address (URL)** değerini kopyalayın.

Wallarm UI'de:

1. **Integrations** bölümünü açın.
1. **Sumo Logic** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Sumo Logic**'i seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan HTTP Source Address (URL) değerini **HTTP Source Address (URL)** alanına yapıştırın.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Sumo Logic entegrasyonu](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'a tıklayın.

    Sumo Logic test bildirimi:

    ```json
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
    ```

1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıları yapılandırma

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"