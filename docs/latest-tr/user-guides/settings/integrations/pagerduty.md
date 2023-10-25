[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

# PagerDuty

Wallarm'ı PagerDuty'ye olaylar göndermek üzere ayarlayabilirsiniz.

## Entegrasyonu ayarlama

PagerDuty arayüzünde, mevcut herhangi bir hizmet için bir entegrasyon [kurun][link-pagerduty-docs] veya Wallarm için özel bir hizmet oluşturun:

1. **Yapılandırma** → **Hizmetler**'e gidin.
2. Mevcut hizmetin ayarlarını açın veya **Yeni Hizmet** düğmesini tıklayın.
3. Yeni bir entegrasyon oluşturun:

    *   Mevcut hizmetin entegrasyonlarını yapılandırıyorsanız, **Entegrasyonlar** sekmesine gidin ve **Yeni Entegrasyon** düğmesini tıklayın.
    *   Yeni bir hizmet oluşturuyorsanız, hizmet adını girin ve **Entegrasyon Ayarları** bölümüne gidin.
4. Entegrasyon adını girin ve entegrasyon türü olarak **API'mizi doğrudan kullanın** seçeneğini seçin.
5. Ayarları kaydedin:

    *   Mevcut hizmetin entegrasyonlarını yapılandırıyorsanız, **Entegrasyon Ekle** düğmesini tıklayın.
    *   Yeni bir hizmet oluşturuyorsanız, ayarlar bölümlerinin geri kalanını yapılandırın ve **Hizmet ekle** düğmesini tıklayın.
    
5. Verilen **Entegrasyon Anahtarı**'nı kopyalayın.

Wallarm arayüzünde:

1. **Entegrasyonlar** bölümünü açın.
1. **PagerDuty** bloğunu tıklayın veya **Entegrasyon ekle** düğmesini tıklayın ve **PagerDuty**'yi seçin. 
1. Entegrasyon adını girin.
1. **Entegrasyon Anahtarı** değerini uygun alana yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![PagerDuty entegrasyonu](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    Mevcut olaylar hakkında ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Entegrasyonu test et**'e tıklayarak yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol edin.

    Bu, önek `[Test mesajı]` olan test bildirimlerini gönderir:

    ![PagerDuty bildirimi testi](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. **Entegrasyon ekle**'ye tıklayın.

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"
