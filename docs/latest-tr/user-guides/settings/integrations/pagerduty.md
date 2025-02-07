[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

#   PagerDuty

[PagerDuty](https://www.pagerduty.com/) dijital operasyonların güvenilirliğini sağlayarak kurumların olayları daha etkili yönetip çözmesine yardımcı olan bir olay yönetimi ve müdahale platformudur. Wallarm'ı, olayları PagerDuty'ye gönderecek şekilde yapılandırabilirsiniz.

##  Entegrasyonun Kurulması

PagerDuty arayüzünde, mevcut herhangi bir hizmet için veya Wallarm için özel olarak yeni bir hizmet oluşturarak [bir entegrasyon kurun][link-pagerduty-docs]:

1. **Configuration** → **Services** bölümüne gidin.
2. Mevcut hizmetin ayarlarını açın veya **New Service** düğmesine tıklayın.
3. Yeni bir entegrasyon oluşturun:

    *   Mevcut hizmetin entegrasyonlarını yapılandırıyorsanız, **Integrations** sekmesine gidin ve **New Integration** düğmesine tıklayın.
    *   Yeni bir hizmet oluşturuyorsanız, hizmet adını girin ve **Integration Settings** bölümüne ilerleyin.
4. Entegrasyon adını girin ve entegrasyon türü olarak **Use our API directly** seçeneğini belirleyin.
5. Ayarları kaydedin:

    *   Mevcut hizmetin entegrasyonlarını yapılandırıyorsanız, **Add Integration** düğmesine tıklayın.
    *   Yeni bir hizmet oluşturuyorsanız, diğer ayar bölümlerini yapılandırın ve **Add Service** düğmesine tıklayın.
    
5. Sağlanan **Integration Key** değerini kopyalayın.

Wallarm arayüzünde:

1. **Integrations** bölümünü açın.
1. **PagerDuty** bloğuna tıklayın veya **Add integration** düğmesine tıklayarak **PagerDuty**'yi seçin.
1. Bir entegrasyon adı girin.
1. **Integration Key** değerini ilgili alana yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![PagerDuty integration](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    Mevcut olaylar hakkında ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Bu, `[Test message]` önekiyle test bildirimlerini gönderecektir:

    ![Test PagerDuty notification](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Kurulması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"