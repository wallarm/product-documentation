# ServiceNow

[ServiceNow](https://www.servicenow.com/), işletmeler için bir dizi BT hizmet yönetimi (ITSM) ve iş süreçleri otomasyonu çözümü sağlayan bulut tabanlı bir platformdur. Wallarm’ı, ServiceNow içinde sorun kayıtları oluşturacak şekilde yapılandırabilirsiniz.

## Gereksinimler

ServiceNow, şirketlerin kurumsal operasyonlar için dijital iş akışlarını yönetmesine yardımcı olan bir platformdur. Bu uygulamaları Wallarm ile entegre edebilmek için şirketinizin size ait bir ServiceNow [örneği ve içinde geliştirilen iş akışı uygulamalarına](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) sahip olması gerekir.

## Entegrasyonun yapılandırılması

ServiceNow UI:

1. [ServiceNow örneğinizin](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html) adını alın.
1. Örneğe erişmek için kullanıcı adı ve parolayı edinin.
1. OAuth kimlik doğrulamayı etkinleştirin ve [burada](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html) açıklandığı gibi client ID ve secret alın.

Wallarm UI:

1. Wallarm Console → **Integrations** → **ServiceNow** bölümünü açın.
1. Bir entegrasyon adı girin.
1. ServiceNow örneğinin adını girin.
1. Belirtilen örneğe erişmek için kullanıcı adı ve parolayı girin.
1. OAuth kimlik doğrulama verilerini girin: client ID ve secret.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![ServiceNow entegrasyonu](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**’a tıklayın.

    Bu işlem, başında “[Test message]” öneki olan test bildirimlerini gönderecektir.

1. **Add integration**’a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"