# ServiceNow

Wallarm'ı [ServiceNow](https://www.servicenow.com/) içinde sorun bileti oluşturacak şekilde ayarlayabilirsiniz.

## Gereksinimler

ServiceNow, şirketlerin kurumsal operasyonlar için dijital iş akışlarını yönetmelerine yardımcı olan bir platformdur. Şirketinizin bu uygulamaları Wallarm ile entegre etmek için sahip olunan bir ServiceNow [örneği ve içinde oluşturulan iş akışı uygulamalarına](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) ihtiyacı vardır.

## Entegrasyonun ayarlanması

ServiceNow kullanıcı arayüzünde:

1. [ServiceNow örneğinizin](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html) adını alın.
1. Örneğe erişim için kullanıcı adı ve şifreyi alın.
1. OAuth kimlik doğrulamasını etkinleştirin ve belirtilen [yerde](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html) açıklanan gibi client ID ve secret'ı alın.

Wallarm kullanıcı arayüzünde:

1. Wallarm Konsolunu açın → **Entegrasyonlar** → **ServiceNow**.
1. Bir entegrasyon adı girin.
1. ServiceNow örneği adını girin.
1. Belirtilen örneğe erişim için kullanıcı adı ve şifreyi girin.
1. OAuth kimlik doğrulama verilerini girin: client ID ve secret.
1. Bildirimleri tetiklemek için etkinlik türlerini seçin.

    ![ServiceNow entegrasyonu](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    Mevcut etkinlikler hakkında detaylar:
    
    --8<-- "../include-tr/integrations/events-for-integrations.md"

1. Konfigürasyon doğruluğunu, Wallarm Bulutu'nun kullanılabilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu test et** seçeneğine tıklayın.

    Bu, ön ek olarak `[Test mesajı]` içeren test bildirimleri gönderecektir.

1. **Entegrasyonu ekle** seçeneğine tıklayın.

## Entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem erişilemezliği ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"