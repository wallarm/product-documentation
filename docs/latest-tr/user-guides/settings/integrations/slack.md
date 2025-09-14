# Slack

[Slack](https://slack.com/), bulut tabanlı, ekip iş birliği ve mesajlaşma için yaygın olarak kullanılan bir platformdur. Kuruluşlar içinde iletişim ve iş birliğini kolaylaştırmak için, ekiplerin mesaj alışverişinde bulunabileceği, dosya paylaşabileceği ve diğer araçlar ve hizmetlerle entegre olabileceği merkezi bir alan sağlar. Wallarm’ı Slack kanal(lar)ınıza bildirim gönderecek şekilde ayarlayabilirsiniz. Birden fazla farklı Slack kanalına veya hesabına bildirim göndermek isterseniz, birden fazla Slack entegrasyonu oluşturun.

## Entegrasyonun yapılandırılması

1. **Integrations** bölümünü açın.
1. **Slack** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Slack**’i seçin.
1. Bir entegrasyon adı girin.
1. [Slack'te Webhook ayarları](https://my.slack.com/services/incoming-webhook/) sayfasını açın ve mesajların gönderileceği kanalı seçerek yeni bir Webhook ekleyin.
1. Sağlanan Webhook URL’sini kopyalayın ve değeri Wallarm UI içindeki **Webhook URL** alanına yapıştırın.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Slack entegrasyonu](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Kullanılabilir olaylar hakkında ayrıntılar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**’a tıklayın.

    Bu, başında `[Test message]` ön eki bulunan test bildirimlerini gönderecektir:

    ```
    [Test message] [Test partner] Ağ çevresi değişti

    Bildirim türü: new_scope_object_ips

    Ağ çevresinde yeni IP adresleri keşfedildi:
    8.8.8.8

    Müşteri: TestCompany
    Cloud: EU
    ```

1. **Add integration**’a tıklayın.

## Ek uyarıların yapılandırılması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: Bir dakika içinde 2 veya daha fazla SQLi hits tespit edilirse Slack bildirimi

Korumalı kaynağa 2 veya daha fazla SQLi [hits](../../../glossary-en.md#hit) gönderilirse, bu olayla ilgili bir bildirim Slack kanalına gönderilecektir.

![Slack'e bildirim gönderen tetikleyici örneği](../../../images/user-guides/triggers/trigger-example1.png)

**Tetikleyiciyi test etmek için:**

Aşağıdaki istekleri korunan kaynağa gönderin:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Slack kanalını açın ve **wallarm** kullanıcısından aşağıdaki bildirimin geldiğini kontrol edin:

```
[Wallarm] Trigger: Algılanan hits sayısı eşiği aştı

Bildirim türü: attacks_exceeded

Algılanan hits sayısı 1 dakikada 1'i aştı.
Bu bildirim, "Notification about SQLi hits" tetikleyicisi tarafından tetiklendi.

Ek tetikleyici koşulları:
Saldırı türü: SQLi.

Olayları görüntüle:
https://my.wallarm.com/attacks?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Müşteri: TestCompany
Cloud: EU
```

* `Notification about SQLi hits`, tetikleyicinin adıdır
* `TestCompany`, Wallarm Console içindeki şirket hesabınızın adıdır
* `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud’tur

### Örnek: Hesaba yeni kullanıcı eklendiğinde Slack ve e‑posta bildirimi

Wallarm Console içindeki şirket hesabına **Administrator** veya **Analyst** rolüne sahip yeni bir kullanıcı eklendiğinde, bu olayla ilgili bildirim entegrasyonda belirtilen e‑posta adresine ve Slack kanalına gönderilecektir.

![Slack'e ve e-posta ile bildirim gönderen tetikleyici örneği](../../../images/user-guides/triggers/trigger-example2.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Console → **Settings** → **Users** bölümünü açın ve yeni bir kullanıcı ekleyin. Örneğin:

    ![Eklenen kullanıcı](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. E‑posta Gelen Kutunuzu açın ve aşağıdaki mesajın geldiğini kontrol edin:

    ![Yeni kullanıcı eklendiğine dair e-posta](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack kanalını açın ve **wallarm** kullanıcısından aşağıdaki bildirimin geldiğini kontrol edin:

    ```
    [Wallarm] Trigger: Şirket hesabına yeni kullanıcı eklendi
    
    Bildirim türü: create_user
    
    Analyst rolüne sahip yeni kullanıcı John Smith <johnsmith@example.com>, John Doe <johndoe@example.com> tarafından şirket hesabına eklendi.
    Bu bildirim, "Added user" tetikleyicisi tarafından tetiklendi.

    Müşteri: TestCompany
    Cloud: EU
    ```

    * `John Smith` ve `johnsmith@example.com`, eklenen kullanıcıya ilişkin bilgilerdir
    * `Analyst`, eklenen kullanıcının rolüdür
    * `John Doe` ve `johndoe@example.com`, yeni kullanıcıyı ekleyen kullanıcıya ilişkin bilgilerdir
    * `Added user`, tetikleyicinin adıdır
    * `TestCompany`, Wallarm Console içindeki şirket hesabınızın adıdır
    * `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud’tur

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"