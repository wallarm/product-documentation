# Datadog

Wallarm'ı, uygun bir entegrasyon oluşturarak Datadog Günlükleri servisine direkt olarak tespit edilen olayların bildirimlerini göndermek üzere ayarlayabilirsiniz. Bu entegrasyon, Wallarm Konsolunda [Datadog API Anahtarı](https://docs.datadoghq.com/account_management/api-app-keys/) üzerinden gerçekleştirilir.

## Entegrasyon kurma

1. Datadog UI'ı açınız → **Kuruluş Ayarları** → **API Anahtarları** ve Wallarm ile entegrasyon için API anahtarını oluşturun.
1. Wallarm Konsolunu açınız → **Entegrasyonlar** ve **Datadog** entegrasyon kurulumuna devam edin.
1. Bir entegrasyon adı girin.
1. **API Anahtarı** alanına Datadog API anahtarını yapıştırın.
1. [Datadog bölgesini](https://docs.datadoghq.com/getting_started/site/) seçin. 
1. Bildirimlere tetikleme yapacak olay türlerini seçin.

    ![Datadog entegrasyonu](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    Kullanılabilir olaylar hakkında ayrıntılar:

    --8<-- "../include-tr/integrations/advanced-events-for-integrations.md"

1. **Entegrasyonu Test Et** düğmesine tıklayarak yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim formatını kontrol edin.

    Test Datadog günlüğü:

    ![Test Datadog Günlüğü](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    Wallarm günlüklerini diğer kayıtlar arasında bulmak için, Datadog Günlükleri servisinde `source:wallarm_cloud` arama etiketini kullanabilirsiniz.

1. **Entegrasyon Ekle** düğmesine tıklayın.

## Ek uyarılar kurulumu

--8<-- "../include-tr/integrations/integrations-trigger-setup.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem erişilemezliği ve hatalı entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"