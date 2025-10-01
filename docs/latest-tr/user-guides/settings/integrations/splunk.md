[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

[Splunk](https://www.splunk.com/), günlükler, olaylar ve diğer operasyonel ile iş verileri dahil olmak üzere makine tarafından üretilen verileri aramak, izlemek ve analiz etmek için tasarlanmış bir platformdur. Wallarm'ı Splunk'a uyarılar gönderecek şekilde yapılandırabilirsiniz.

##  Entegrasyonun yapılandırılması

Splunk UI'de:

1. **Settings** ➝ **Add Data** ➝ **Monitor**'ü açın.
2. **HTTP Event Collector** seçeneğini seçin, bir entegrasyon adı girin ve **Next**'e tıklayın.
3. **Input Settings** sayfasında veri türü seçimini atlayın ve **Review Settings**'e ilerleyin.
4. Ayarları gözden geçirip **Submit**'e tıklayın.
5. Sağlanan token'ı kopyalayın.

Wallarm UI'de:

1. **Integrations** bölümünü açın.
1. **Splunk** bloğunu tıklayın veya **Add integration** düğmesine tıklayıp **Splunk**'u seçin.
1. Bir entegrasyon adı girin.
1. Kopyaladığınız token'ı **HEC token** alanına yapıştırın.
1. Splunk örneğinizin HEC URI'sini ve port numarasını **HEC URI:PORT** alanına yapıştırın. Örneğin: `https://hec.splunk.com:8088`.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Splunk entegrasyonu](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**'a tıklayın.

    JSON formatında Splunk test bildirimi:

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

## Ek uyarıların yapılandırılması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Olayların bir gösterge panosunda düzenlenmesi

--8<-- "../include/integrations/application-for-splunk.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"