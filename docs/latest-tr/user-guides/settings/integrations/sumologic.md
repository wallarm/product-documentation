# Sumo Logic

[Sumo Logic](https://www.sumologic.com/) kurumlara BT operasyonları, güvenlik ve uygulama performansı hakkında gerçek zamanlı içgörüler sağlayan bulut yerel, makine verisi analitiği platformudur. Wallarm'u Sumo Logic'e mesaj gönderecek şekilde yapılandırabilirsiniz.

## Entegrasyonu Ayarlama

Sumo Logic kullanıcı arayüzünde:

1. Aşağıdaki [talimatları](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector) izleyerek bir Hosted Collector yapılandırın.
2. Aşağıdaki [talimatları](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source) izleyerek bir HTTP Logs & Metrics Source yapılandırın.
3. Sağlanan **HTTP Source Address (URL)** değerini kopyalayın.

Wallarm kullanıcı arayüzünde:

1. **Integrations** bölümünü açın.
1. **Sumo Logic** bloğuna tıklayın veya **Add integration** düğmesine tıklayarak **Sumo Logic**'i seçin.
1. Bir entegrasyon adı girin.
1. Kopyaladığınız **HTTP Source Address (URL)** değerini **HTTP Source Address (URL)** alanına yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    Mevcut olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Sumo Logic bildirimini test edin:

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

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Hatalı Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"