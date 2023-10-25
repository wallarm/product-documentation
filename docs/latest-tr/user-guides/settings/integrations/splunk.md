[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk

Wallarm'ı Splunk'a uyarı göndermek üzere ayarlayabilirsiniz.

## Entegrasyonun ayarlanması

Splunk Kullanıcı Arayüzünde:

1. **Ayarlar** ➝ **Veri Ekle** ➝ **İzle**'yi açın.
2. **HTTP Olay Toplayıcısı** seçeneğini seçin, bir entegrasyon adı girin ve **İleri**'yi tıklayın.
3. **Giriş Ayarları** sayfasındaki veri türünü seçmeyi atlayın ve **Ayarları İncele**'ye devam edin.
4. Ayarları **Gönder**'inizi inceleyin.
5. Sağlanan belirteci kopyalayın.

Wallarm Kullanıcı Arayüzünde:

1. **Entegrasyonlar** bölümünü açın.
1. **Splunk** bloğunu tıklayın veya **Entegrasyon ekle** düğmesini tıklayın ve **Splunk**'ı seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan belirteci **HEC belirteci** alanına yapıştırın.
1. Splunk örneğinizin HEC URI'sini ve port numarasını **HEC URI:PORT** alanına yapıştırın. Örneğin: `https://hec.splunk.com:8088`.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Splunk entegrasyonu](../../../images/user-guides/settings/integrations/add-splunk-integration.png)
    
    Mevcut olaylar hakkında ayrıntılar:

    --8<-- "../include-tr/integrations/advanced-events-for-integrations.md"

1. **Entegrasyonu test et**'i tıklayın ve yapılandırma doğruluğunu, Wallarm Bulutunun kullanılabilirliğini ve bildirim biçimini kontrol edin.

    JSON biçiminde test Splunk bildirimi:

    ```json
    {
        summary:"[Test mesajı] [Test ortak(US)] Yeni güvenlik açığı tespit edildi",
        description:"Bildirim tipi: vuln

                    Sisteminizde yeni bir güvenlik açığı tespit edildi.

                    ID: 
                    Başlık: Test
                    Alan Adı: example.com
                    Yol: 
                    Yöntem: 
                    Tarafından Keşfedildi: 
                    Parametre: 
                    Tür: Bilgi
                    Tehdit: Orta

                    Daha fazla ayrıntı: https://us1.my.wallarm.com/object/555


                    Müşteri: Test Company
                    Bulut: US
                    ",
        details:{
            client_name:"Test Company",
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
                threat:"Orta",
                type:"Bilgi"
            }
        }
    }
    ```

1. **Entegrasyon ekle**'yi tıklayın.

--8<-- "../include-tr/cloud-ip-by-request.md"

## Olayların bir gösterge tablosunda organize edilmesi

--8<-- "../include-tr/integrations/application-for-splunk.md"

## Ek uyarıların kurulması

--8<-- "../include-tr/integrations/integrations-trigger-setup.md"

## Entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri 

--8<-- "../include-tr/integrations/integration-not-working.md"