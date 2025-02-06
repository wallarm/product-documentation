# Datadog

[Datadog](https://www.datadoghq.com/) modern uygulamaların performansı, kullanılabilirliği ve güvenliği hakkında kapsamlı görünürlük sağlayan popüler bir bulut tabanlı izleme ve analiz platformudur. Wallarm Console üzerinden [Datadog API key](https://docs.datadoghq.com/account_management/api-app-keys/) kullanılarak uygun bir entegrasyon oluşturarak, algılanan olay bildirimlerini doğrudan Datadog Logs servisine gönderecek şekilde Wallarm'ı yapılandırabilirsiniz.

## Entegrasyonu Ayarlama

1. Datadog UI'yi açın → **Organization Settings** → **API Keys** ve Wallarm ile entegrasyon için API anahtarını oluşturun.
1. Wallarm Console'u açın → **Integrations** ve **Datadog** entegrasyon ayarlarına geçin.
1. Bir entegrasyon adı girin.
1. Datadog API anahtarını **API key** alanına yapıştırın.
1. [Datadog bölgesini](https://docs.datadoghq.com/getting_started/site/) seçin.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    Kullanılabilir olaylarla ilgili ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Test Datadog günlüğü:

    ![The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    Diğer kayıtlar arasında Wallarm loglarını bulmak için Datadog Logs servisi içerisinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıları Ayarlama

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"