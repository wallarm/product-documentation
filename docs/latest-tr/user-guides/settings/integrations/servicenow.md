# ServiceNow

[ServiceNow](https://www.servicenow.com/) kurumsal işletmeler için çeşitli IT servis yönetimi (ITSM) ve iş süreci otomasyonu çözümleri sunan bulut tabanlı bir platformdur. Wallarm'ı, ServiceNow'da sorun biletleri oluşturacak şekilde yapılandırabilirsiniz.

## Gereksinimler

ServiceNow, şirketlerin kurumsal işlemler için dijital iş akışlarını yönetmelerine yardımcı olan bir platformdur. Şirketiniz, bu uygulamaları Wallarm ile entegre etmek için sahip olunan bir ServiceNow [örneğe ve bu örnek içinde oluşturulmuş iş akışı uygulamalarına](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) ihtiyaç duymaktadır.

## Entegrasyonun Kurulması

ServiceNow kullanıcı arayüzünde:

1. [ServiceNow örneğinizin](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html) adını alın.
1. Örneğe erişmek için kullanıcı adı ve şifre edinin.
1. OAuth kimlik doğrulamayı etkinleştirin ve [burada](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html) anlatıldığı gibi istemci ID ve gizli anahtarını alın.

Wallarm kullanıcı arayüzünde:

1. Wallarm Console'u açın → **Integrations** → **ServiceNow**.
1. Bir entegrasyon adı girin.
1. ServiceNow örneğinin adını girin.
1. Belirtilen örneğe erişmek için kullanıcı adı ve şifre girin.
1. OAuth kimlik doğrulama verilerini girin: istemci ID ve gizli anahtar.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![ServiceNow integration](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    Mevcut olaylar hakkında detaylar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırma doğruluğunu, Wallarm Cloud'un uygunluğunu ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Bu, `[Test message]` önekiyle test bildirimlerini gönderecektir.

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılabilir Olmaması ve Hatalı Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"