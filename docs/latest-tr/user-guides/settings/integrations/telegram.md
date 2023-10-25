# Telegram

Wallarm'ı planlanmış raporlar ve anlık bildirimler göndermek üzere Telegram'a ayarlayabilirsiniz.

Planlanmış raporlar günlük, haftalık veya aylık olarak gönderilebilir. Raporlar, seçilen dönem boyunca sisteminizde tespit edilen güvenlik açıkları, saldırılar ve olaylar hakkında ayrıntılı bilgi içerir.

Bildirimler, tetiklenen olayların kısa detaylarını içerir.

## Entegrasyonu Ayarlama

1. **Entegrasyonlar** bölümünü açın.
1. **Telegram** bloğuna tıklayın veya **Entegrasyon ekle** düğmesine tıklayın ve **Telegram** seçin.
1. Wallarm bildirimlerini alan Telegram grubuna [@WallarmUSBot](https://t.me/WallarmUSBot) ekleyin (Wallarm US Cloud kullanıyorsanız) veya [@WallarmBot](https://t.me/WallarmBot) ekleyin (Wallarm EU Cloud kullanıyorsanız) ve kimlik doğrulama bağlantısını izleyin.
1. Wallarm UI'ya yönlendirildikten sonra botu kimlik doğrulayın.
1. Bir entegrasyon adı girin.
1. Güvenlik raporlarının gönderilme sıklığını seçin. Sıklık seçilmezse, raporlar gönderilmez.
1. Bildirimleri tetiklemek üzere olay türlerini seçin.

    ![Telegram entegrasyonu](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    Mevcut olaylarla ilgili detaylar:

    --8<-- "../include/integrations/events-for-integrations.md"

    Telegram ile entegrasyon yalnızca bu entegrasyon zaten oluşturulmuşsa test edilebilir.

1. **Entegrasyon ekle** bölümüne tıklayın.
1. Oluşturulan entegrasyon kartını tekrar açın.
1. **Entegrasyonu test et** bölümüne tıklayarak yapılandırma doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol edin.

    Bu, `[Test mesajı]` önekli test bildirimlerini gönderecektir:

    ```
    [Test mesajı] [Test partner] Ağ sınırları değiştirildi

    Bildirim türü: new_scope_object_ips

    Ağ çevresinde yeni IP adresleri tespit edildi:
    8.8.8.8

    Müşteri: TestŞirketi
    Bulut: EU
    ```

Ayrıca, [@WallarmUSBot](https://t.me/WallarmUSBot) ile veya [@WallarmBot](https://t.me/WallarmBot) ile doğrudan sohbete de başlayabilirsiniz. Bot da raporlar ve bildirimler gönderecektir.

## Ek Uyarıları Ayarlama

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Erişilemezliği ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"