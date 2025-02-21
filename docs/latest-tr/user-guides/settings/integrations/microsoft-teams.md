# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software), ekip çalışmalarını kolaylaştırmak ve kuruluşların ofiste, uzaktan veya her ikisinin birleşiminde çalışırken etkili biçimde iletişim kurmalarını, işbirliği yapmalarını ve projeleri yönetmelerini sağlamak amacıyla tasarlanmış bir işbirliği ve iletişim platformudur. Wallarm’ı, Microsoft Teams kanalınıza(lar) bildirim gönderecek şekilde ayarlayabilirsiniz. Eğer bildirimleri birden fazla farklı kanala göndermek istiyorsanız, birkaç farklı Microsoft Teams entegrasyonu oluşturun.

## Entegrasyonu Kurma

1. **Integrations** bölümünü açın.
1. **Microsoft Teams** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Microsoft Teams** seçeneğini belirleyin.
1. Bir entegrasyon adı girin.
1. Bildirimlerin gönderileceği Microsoft Teams kanalının ayarlarını açın ve [talimatları](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) kullanarak yeni bir Webhook yapılandırın.
1. Sağlanan Webhook URL'sini kopyalayın ve değeri Wallarm Console’daki **Webhook URL** alanına yapıştırın.
1. Bildirimleri tetikleyecek olay türlerini seçin.

      ![MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      Mevcut olaylar hakkında detaylı bilgi:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration** düğmesine tıklayarak yapılandırmanın doğruluğunu, Wallarm Cloud’un kullanılabilirliğini ve bildirim formatını kontrol edin.

      Bu, ön eki `[Test message]` ile test bildirimlerini gönderecektir:

      ```
      [Test message] [Test partner] Network perimeter has changed

      Notification type: new_scope_object_ips

      New IP addresses were discovered in the network perimeter:
      8.8.8.8

      Client: TestCompany
      Cloud: EU
      ```

1. **Add integration** düğmesine tıklayın.

## Ek Bildirimlerin Kurulması

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Bir Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Hatalı Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"