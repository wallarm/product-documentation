# Opsgenie

Wallarm'ı Opsgenie'ye uyarı göndermek üzere ayarlayabilirsiniz.

## Entegrasyonu ayarlama

[Opsgenie UI](https://app.opsgenie.com/teams/list)'da:

1. Ekibinize gidin ➝ **Entegrasyonlar**.
2. **Entegrasyon ekle** düğmesini tıklayın ve **API** seçin.
3. Yeni bir entegrasyon için ad girin ve **Entegrasyonu Kaydet**'i tıklayın.
4. Sağlanan API anahtarını kopyalayın.

Wallarm UI'ında:

1. **Entegrasyonlar** bölümünü açın.
1. **Opsgenie** bloğunu tıklayın veya **Entegrasyon ekle** düğmesini tıklayın ve **Opsgenie** seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan API anahtarını **API anahtarı** alanına yapıştırın.
1. Opsgenie'nin [AB örneğini](https://docs.opsgenie.com/docs/european-service-region) kullanıyorsanız, listeden uygun Opsgenie API uç noktasını seçin. Varsayılan olarak, ABD örneği uç noktası ayarlanmıştır.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Opsgenie entegrasyonu](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    Mevcut olaylar hakkında ayrıntılar:
      
    --8<-- "../include-tr/integrations/events-for-integrations.md"

1. Ayarları doğrulamak, Wallarm Bulut'unun mevcudiyetini kontrol etmek ve bildirim formatını denetlemek için **Entegrasyonu test et**'i tıklayın.

    Bu, `[Test mesajı]` öneki ile test bildirimlerini gönderir:

    ![Opsgenie mesajını test et](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. **Entegrasyon ekle**'yi tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include-tr/integrations/integrations-trigger-setup.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem erişilemezliği ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"