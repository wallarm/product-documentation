# Datadog

[Datadog](https://www.datadoghq.com/), modern uygulamaların performansı, erişilebilirliği ve güvenliği hakkında kapsamlı görünürlük sağlayan, popüler bulut tabanlı bir izleme ve analitik platformudur. Wallarm, [Datadog API anahtarı](https://docs.datadoghq.com/account_management/api-app-keys/) aracılığıyla Wallarm Console içinde uygun bir entegrasyon oluşturarak tespit edilen olayların bildirimlerini doğrudan Datadog Logs hizmetine gönderebilir.

## Entegrasyonu yapılandırma

1. Datadog UI → **Organization Settings** → **API Keys** bölümünü açın ve Wallarm ile entegrasyon için bir API key oluşturun.
1. Wallarm Console → **Integrations** bölümünü açın ve **Datadog** entegrasyonu kurulumuna ilerleyin.
1. Bir entegrasyon adı girin.
1. Datadog API anahtarını **API key** alanına yapıştırın.
1. [Datadog bölgesini](https://docs.datadoghq.com/getting_started/site/) seçin.
1. Bildirimleri tetikleyecek etkinlik türlerini seçin.

    ![Datadog entegrasyonu](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    Mevcut etkinliklerle ilgili ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration** öğesine tıklayın.

    Test Datadog günlüğü:

    ![Test Datadog günlüğü](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    Wallarm kayıtlarını diğer kayıtlar arasında bulmak için Datadog Logs hizmetinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.

1. **Add integration** öğesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıları yapılandırma

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamıyor ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"