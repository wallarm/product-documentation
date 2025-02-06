# Telegram

[Telegram](https://telegram.org/) bulut tabanlı anlık mesajlaşma platformu ve sosyal medya uygulamasıdır. Wallarm'u, Telegram'a planlı raporlar ve anlık bildirimler gönderecek şekilde yapılandırabilirsiniz.

Planlı raporlar günlük, haftalık veya aylık olarak gönderilebilir. Raporlar, seçilen dönem boyunca sisteminizde tespit edilen güvenlik açıkları, saldırılar ve olaylar hakkında ayrıntılı bilgiler içerir. Bildirimler ise tetiklenen olayların kısa detaylarını sunar.

## Entegrasyonu yapılandırma

1. **Entegrasyonlar** bölümünü açın.
1. **Telegram** bloğuna tıklayın veya **Entegrasyon ekle** düğmesine basıp **Telegram** seçeneğini seçin.
1. Wallarm bildirimlerini alacak Telegram grubuna [@WallarmUSBot](https://t.me/WallarmUSBot) (Wallarm US Cloud kullanıyorsanız) veya [@WallarmBot](https://t.me/WallarmBot) (Wallarm EU Cloud kullanıyorsanız) ekleyin ve kimlik doğrulama bağlantısını takip edin.
1. Wallarm UI'ya yönlendirildikten sonra botu kimlik doğrulayın.
1. Bir entegrasyon adı girin.
1. Güvenlik raporlarının gönderilme sıklığını belirleyin. Sıklık seçilmezse raporlar gönderilmeyecektir.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Telegram entegrasyonu](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    Kullanılabilir olaylara ilişkin detaylar:

    --8<-- "../include/integrations/events-for-integrations.md"

    Telegram entegrasyonu, ancak bu entegrasyonun önceden oluşturulmuş olması halinde test edilebilir.

1. **Entegrasyon ekle**'ye tıklayın.
1. Oluşturulan entegrasyon kartını tekrar açın.
1. Konfigürasyon doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu test et** düğmesine tıklayın.

    Bu, `[Test message]` öneki ile test bildirimlerini gönderecektir:

    ```
    [Test message] [Test partner] Ağ çevresi değişti

    Bildirim tipi: new_scope_object_ips

    Ağ çevresinde yeni IP adresleri keşfedildi:
    8.8.8.8

    Müşteri: TestCompany
    Cloud: EU
    ```

[@WallarmUSBot](https://t.me/WallarmUSBot) veya [@WallarmBot](https://t.me/WallarmBot) ile sohbeti doğrudan başlatabilirsiniz. Bot raporlar ve bildirimler de gönderecektir.

## Ek uyarıları yapılandırma

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"