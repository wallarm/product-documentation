# Slack

[Slack](https://slack.com/) yaygın olarak kullanılan bulut tabanlı ekip işbirliği ve mesajlaşma platformudur. Kurumlar içerisinde ekiplerin mesaj alışverişi yapabilmesi, dosya paylaşabilmesi ve diğer araçlar ile hizmetler entegrasyonu gerçekleştirebilmesi için merkezi bir alan sağlayarak iletişimi ve işbirliğini kolaylaştırmak üzere tasarlanmıştır. Wallarm'ı, Slack kanal(lar)ınıza bildirim gönderecek şekilde yapılandırabilirsiniz. Farklı Slack kanallarına veya hesaplarına bildirim göndermek istiyorsanız, birden fazla Slack entegrasyonu oluşturun.

## Entegrasyonun Ayarlanması

1. **Entegrasyonlar** bölümünü açın.
1. **Slack** bloğuna tıklayın veya **Entegrasyon ekle** butonuna tıklayın ve **Slack** seçeneğini belirleyin.
1. Bir entegrasyon adı girin.
1. [Slack'deki Webhook ayarlarını](https://my.slack.com/services/incoming-webhook/) açın ve mesajların gönderileceği kanalı seçerek yeni bir Webhook ekleyin.
1. Verilen Webhook URL'sini kopyalayın ve değeri Wallarm UI'deki **Webhook URL** alanına yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Mevcut olaylar hakkında ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu Test Et** butonuna tıklayın.

    Bu, önek `[Test message]` ile test bildirimleri gönderecektir:

    ```
    [Test message] [Test partner] Network perimeter has changed

    Notification type: new_scope_object_ips

    New IP addresses were discovered in the network perimeter:
    8.8.8.8

    Client: TestCompany
    Cloud: EU
    ```

1. **Entegrasyonu Ekle** butonuna tıklayın.

## Ekstra Uyarıların Ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: Bir dakikada 2 veya daha fazla SQLi [hits](../../../glossary-en.md#hit) tespit edilirse Slack bildirimi

Eğer 2 veya daha fazla SQLi [hits](../../../glossary-en.md#hit) korumalı kaynağa gönderilirse, bu olay hakkında bildirim Slack kanalına gönderilecektir.

![Example of a trigger sending the notification to Slack](../../../images/user-guides/triggers/trigger-example1.png)

**Tetikleyiciyi test etmek için:**

Korumalı kaynağa aşağıdaki istekleri gönderin:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```

Slack kanalını açın ve **wallarm** kullanıcısından gelen aşağıdaki bildirimin alındığını kontrol edin:

```
[Wallarm] Trigger: The number of detected hits exceeded the threshold

Notification type: attacks_exceeded

The number of detected hits exceeded 1 in 1 minute.
This notification was triggered by the "Notification about SQLi hits" trigger.

Additional trigger’s clauses:
Attack type: SQLi.

View events:
https://my.wallarm.com/attacks?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about SQLi hits` tetikleyici adıdır  
* `TestCompany`, Wallarm Console'daki şirket hesabınızın adıdır  
* `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud'dur

### Örnek: Hesaba yeni kullanıcı eklenirse Slack ve e-posta bildirimi

Wallarm Console'daki şirket hesabına **Administrator** veya **Analyst** rolüne sahip yeni bir kullanıcı eklendiğinde, bu olay hakkında bildirim entegrasyonda belirtilen e-posta adresine ve Slack kanalına gönderilecektir.

![Example of a trigger sending the notification to Slack and by email](../../../images/user-guides/triggers/trigger-example2.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Ayarlar** → **Kullanıcılar** bölümünü açın ve yeni bir kullanıcı ekleyin. Örneğin:

    ![Added user](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. E-posta gelen kutunuzu açın ve aşağıdaki mesajın alındığını kontrol edin:

    ![Email about new user added](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack kanalını açın ve **wallarm** kullanıcısından gelen aşağıdaki bildirimin alındığını kontrol edin:

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    Yeni kullanıcı John Smith <johnsmith@example.com>, rolü Analyst olarak, John Doe <johndoe@example.com> tarafından şirket hesabına eklendi.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` ve `johnsmith@example.com` eklenen kullanıcı hakkında bilgilerdir  
    * `Analyst`, eklenen kullanıcının rolüdür  
    * `John Doe` ve `johndoe@example.com`, yeni kullanıcı ekleyen kullanıcıya ait bilgilerdir  
    * `Added user` tetikleyici adıdır  
    * `TestCompany`, Wallarm Console'daki şirket hesabınızın adıdır  
    * `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud'dur

## Bir entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"