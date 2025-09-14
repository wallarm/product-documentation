# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software), ekip çalışmasını kolaylaştırmak ve kuruluşların ister ofiste, ister uzaktan, ister her ikisinin birleşimiyle çalışsın, etkili şekilde iletişim kurmasını, işbirliği yapmasını ve projeleri yönetmesini sağlamak üzere tasarlanmış bir işbirliği ve iletişim platformudur. Wallarm’ı Microsoft Teams kanal(lar)ınıza bildirim gönderecek şekilde yapılandırabilirsiniz. Birden fazla farklı kanala bildirim göndermek istiyorsanız, birden fazla Microsoft Teams entegrasyonu oluşturun.

## Entegrasyonu ayarlama

1. **Integrations** bölümünü açın.
1. **Microsoft Teams** bloğunu tıklayın veya **Add integration** düğmesini tıklayıp **Microsoft Teams** seçin.
1. Bir entegrasyon adı girin.
1. Bildirimleri göndermek istediğiniz Microsoft Teams kanalının ayarlarını açın ve [talimatlar](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) kullanarak yeni bir Webhook yapılandırın.
1. Sağlanan Webhook URL’sini kopyalayın ve değeri Wallarm Console içindeki **Webhook URL** alanına yapıştırın.
1. Bildirimleri tetikleyecek olay türlerini seçin.

      ![MS Teams entegrasyonu](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      Mevcut olaylar hakkında ayrıntılar:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud kullanılabilirliğini ve bildirim biçimini kontrol etmek için **Test integration**’ı tıklayın.

      Bu, “[Test message]” önekiyle test bildirimlerini gönderecektir:

      ```
      [Test message] [Test partner] Network perimeter has changed

      Notification type: new_scope_object_ips

      New IP addresses were discovered in the network perimeter:
      8.8.8.8

      Client: TestCompany
      Cloud: EU
      ```

1. **Add integration**’ı tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"