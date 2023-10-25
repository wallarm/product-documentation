# Microsoft Teams

Wallarm'ı Microsoft Teams kanal(lar)ınıza bildirim göndermek üzere ayarlayabilirsiniz. Farklı kanallara bildirim göndermek isterseniz, birkaç Microsoft Teams entegrasyonu oluşturun.

## Entegrasyonu ayarlama

1. **Entegrasyonlar** bölümünü açın.
1. **Microsoft Teams** bloğunu tıklayın veya **Entegrasyon ekle** düğmesini tıklayın ve **Microsoft Teams**'i seçin.
1. Bir entegrasyon adı girin.
1. Bildirimleri göndermek istediğiniz Microsoft Teams kanalının ayarlarını açın ve yeni bir Webhook'u, [talimatları](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) kullanarak yapılandırın.
1. Sağlanan Webhook URL'sini kopyalayın ve değeri Wallarm Konsolu'ndaki **Webhook URL** alanına yapıştırın.
1. Bildirim tetiklemek için olay türlerini seçin.

      ![MS Teams entegrasyonu](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      Kullanılabilir olaylarla ilgili detaylar:
      
      --8<-- "../include-tr/integrations/events-for-integrations.md"

1. **Entegrasyonu test et**'i tıklarak yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol edin.

      Bu, ön ekinin `[Test mesajı]` olduğu test bildirimlerini gönderecektir:

      ```
      [Test mesajı] [Test ortağı] Ağ çevresi değişti

      Bildirim tipi: yeni_kapsam_nesnesi_ips

      Ağ çevresinde yeni IP adresleri keşfedildi:
      8.8.8.8

      İstemci: TestŞirketi
      Bulut: EU
      ```

1. **Entegrasyon ekle**'yi tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include-tr/integrations/integrations-trigger-setup-limited.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem erişilemezliği ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"