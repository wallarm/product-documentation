# Telegram

[Telegram](https://telegram.org/), bulut tabanlı bir anlık mesajlaşma platformu ve sosyal medya uygulamasıdır. Wallarm’ı zamanlanmış raporları ve anlık bildirimleri Telegram’a gönderecek şekilde ayarlayabilirsiniz.

Zamanlanmış raporlar günlük, haftalık veya aylık olarak gönderilebilir. Raporlar, seçilen dönem boyunca sisteminizde tespit edilen güvenlik açıkları, saldırılar ve olaylar hakkında ayrıntılı bilgiler içerir. Bildirimler, tetiklenen olaylara ilişkin kısa ayrıntılar içerir.

## Entegrasyonu ayarlama

1. **Integrations** bölümünü açın.
1. **Telegram** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Telegram**’ı seçin.
1. Wallarm bildirimlerini alacak Telegram grubuna [@WallarmUSBot](https://t.me/WallarmUSBot) (Wallarm US Cloud kullanıyorsanız) veya [@WallarmBot](https://t.me/WallarmBot) (Wallarm EU Cloud kullanıyorsanız) ekleyin ve kimlik doğrulama bağlantısını izleyin.
1. Wallarm UI’a yönlendirildikten sonra botu doğrulayın.
1. Bir entegrasyon adı girin.
1. Güvenlik raporlarının gönderim sıklığını seçin. Sıklık seçilmezse raporlar gönderilmez.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Telegram entegrasyonu](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    Kullanılabilir olaylarla ilgili ayrıntılar:

    --8<-- "../include/integrations/events-for-integrations.md"

    Telegram ile entegrasyon, yalnızca bu entegrasyon zaten oluşturulmuşsa test edilebilir.

1. **Add integration**’a tıklayın.
1. Oluşturulan entegrasyon kartını yeniden açın.
1. Yapılandırmanın doğruluğunu, Wallarm Cloud kullanılabilirliğini ve bildirim biçimini kontrol etmek için **Test integration**’a tıklayın.

    Bu işlem, önek “[Test message]” ile test bildirimleri gönderecektir:

    ```
    [Test message] [Test partner] Ağ çevresi değişti

    Bildirim türü: new_scope_object_ips

    Ağ çevresinde yeni IP adresleri keşfedildi:
    8.8.8.8

    Müşteri: TestCompany
    Bulut: EU
    ```

[@WallarmUSBot](https://t.me/WallarmUSBot) veya [@WallarmBot](https://t.me/WallarmBot) ile doğrudan sohbet de başlatabilirsiniz. Bot, raporları ve bildirimleri de gönderir.

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamıyorluğu ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"