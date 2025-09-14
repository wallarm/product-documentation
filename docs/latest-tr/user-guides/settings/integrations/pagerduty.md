[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

#   PagerDuty

[PagerDuty](https://www.pagerduty.com/), dijital operasyonların güvenilirliğini sağlayarak olayların daha etkili yönetilmesi ve çözümlenmesine yardımcı olan bir olay yönetimi ve müdahale platformudur. Wallarm'ı, olayları PagerDuty'ye gönderecek şekilde yapılandırabilirsiniz.

##  Entegrasyonun ayarlanması

PagerDuty UI'de, herhangi bir mevcut servis için [bir entegrasyon ayarlayın][link-pagerduty-docs] veya özellikle Wallarm için yeni bir servis oluşturun:

1. **Configuration** → **Services**'a gidin.
2. Mevcut servisin ayarlarını açın veya **New Service** düğmesine tıklayın.
3. Yeni bir entegrasyon oluşturun:

    *   Mevcut servisin entegrasyonlarını yapılandırıyorsanız, **Integrations** sekmesine gidin ve **New Integration** düğmesine tıklayın.
    *   Yeni bir servis oluşturuyorsanız, servis adını girin ve **Integration Settings** bölümüne ilerleyin.
4. Entegrasyon adını girin ve entegrasyon türü olarak **Use our API directly** seçeneğini seçin.
5. Ayarları kaydedin:

    *   Mevcut servisin entegrasyonlarını yapılandırıyorsanız, **Add Integration** düğmesine tıklayın.
    *   Yeni bir servis oluşturuyorsanız, kalan ayar bölümlerini yapılandırın ve **Add Service** düğmesine tıklayın.
    
5. Sağlanan **Integration Key** değerini kopyalayın.

Wallarm UI'de:

1. **Integrations** bölümünü açın.
1. **PagerDuty** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **PagerDuty**'yi seçin. 
1. Bir entegrasyon adı girin.
1. **Integration Key** değerini ilgili alana yapıştırın.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![PagerDuty entegrasyonu](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'a tıklayın.

    Bu, `[Test message]` önekiyle test bildirimleri gönderecektir:

    ![Test PagerDuty bildirimi](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıları ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"