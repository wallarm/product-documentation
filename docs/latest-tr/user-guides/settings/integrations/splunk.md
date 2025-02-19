[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

[Splunk](https://www.splunk.com/) loglar, olaylar ve diğer operasyonel ile iş verileri dahil olmak üzere makine üretimli verileri aramak, izlemek ve analiz etmek için tasarlanmış bir platformdur. Wallarm'ı, Splunk'a uyarılar gönderecek şekilde yapılandırabilirsiniz.

##  Entegrasyonun Ayarlanması

Splunk UI'da:

1. **Settings** ➝ **Add Data** ➝ **Monitor** öğelerini açın.
2. **HTTP Event Collector** seçeneğini seçin, bir entegrasyon adı girin ve **Next** butonuna tıklayın.
3. **Input Settings** sayfasında veri türü seçimini atlayıp **Review Settings**'e devam edin.
4. Ayarları gözden geçirin ve **Submit** butonuna tıklayın.
5. Sağlanan token'i kopyalayın.

Wallarm UI'da:

1. **Integrations** bölümünü açın.
1. **Splunk** bloğuna tıklayın veya **Add integration** butonuna tıklayıp **Splunk** seçeneğini seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan token'i **HEC token** alanına yapıştırın.
1. Splunk örneğinizin HEC URI'sini ve port numarasını **HEC URI:PORT** alanına yapıştırın. Örneğin: `https://hec.splunk.com:8088`.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Splunk entegrasyonu](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    Mevcut olaylara ilişkin detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Ayarların doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration** butonuna tıklayın.

    JSON formatında Splunk bildirimi testi:

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

1. **Add integration** butonuna tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Olayların Panoda Düzenlenmesi

--8<-- "../include/integrations/application-for-splunk.md"

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Erişilemezliği ve Hatalı Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"