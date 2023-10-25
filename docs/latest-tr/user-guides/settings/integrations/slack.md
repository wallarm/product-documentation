# Slack

Wallarm, bildirimleri Slack kanal(larınız)a göndermek üzere ayarlanabilir. Çeşitli Slack kanallarına veya hesaplara bildirim göndermek isterseniz, birkaç Slack entegrasyonu oluşturun.

## Entegrasyonun Ayarlanması

1. **Entegrasyonlar** bölümünü açın.
1. **Slack** bloğunu tıklayın veya **Entegrasyon ekle** düğmesini tıklayın ve **Slack** seçin.
1. Bir entegrasyon adı girin.
1. [Slack Webhook ayarlarına](https://my.slack.com/services/new/incoming-webhook/) gidin ve iletilerin gönderileceği kanalı seçerek yeni bir Webhook ekleyin.
1. Sağlanan Webhook URL'sini kopyalayın ve bu değeri Wallarm kullanıcı arayüzündeki **Webhook URL** alanına yapıştırın.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Slack entegrasyonu](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Mevcut olaylar hakkında ayrıntılar:

    --8<-- "../include/integrations/events-for-integrations.md"

1. **Entegrasyonu test et** tıklayın ve yapılandırma doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim biçimini kontrol edin.

    Bu, önek `[Test mesajı]` olan test bildirimlerini gönderir:

    ```
    [Test mesajı] [Test partner] Ağ sınırları değişti

    Bildirim türü: new_scope_object_ips

    Ağ sınırlarında yeni IP adresleri keşfedildi:
    8.8.8.8

    Müşteri: TestŞirketi
    Bulut: EU
    ```

1. **Entegrasyon ekle** tıklayın.

## Ek uyarıların kurulması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: Bir dakikada 2 veya daha fazla SQLi tespit edildiğinde Slack bildirimi

2 veya daha fazla SQLi [vuruş](../../../glossary-en.md#hit) korunan kaynağa gönderilirse, bu olay hakkındaki bir bildirim Slack kanalına gönderilir.

![Bildirimin notification'a gönderilmesi örneği](../../../images/user-guides/triggers/trigger-example1.png)

**Tetikleyiciyi test etmek için:**

Aşağıdaki talepleri korunan kaynağa gönderin:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Slack kanalını açın ve **wallarm** kullanıcısından aşağıdaki bildirimin alındığını kontrol edin:

```
[Wallarm] Tetikleyici: Tespit edilen vuruşların sayısı eşiği aştı

Bildirim türü: attacks_exceeded

Tespit edilen vuruşların sayısı, 1 dakika içinde 1'i aştı.
Bu bildirim, "SQLi vuruşları hakkında bildirim" tetikleyicisi tarafından tetiklendi.

Ek tetikleyicinin maddeleri:
Saldırı türü: SQLi.

Etkinlikleri görüntüle:
https://my.wallarm.com/search?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Müşteri: TestŞirketi
Bulut: EU
```

* `SQLi vuruşları hakkında bildirim` tetikleyici adıdır
* `TestŞirketi` Wallarm Konsolundaki şirket hesabınızın adıdır
* `EU` şirket hesabınızın kayıtlı olduğu Wallarm Bulutudur

### Örnek: Hesaba yeni bir kullanıcı eklendiğinde Slack ve e-posta bildirimi

**Yönetici** veya **Analizci** rolündeki yeni bir kullanıcı, Wallarm Konsolundaki şirket hesabına eklendiğinde, bu olay hakkındaki bildirim, entegrasyonda belirtilen e-posta adresine ve Slack kanalına gönderilir.

![Bir tetikleyicinin bildirimi Slack'a ve e-posta yoluyla göndermesi örneği](../../../images/user-guides/triggers/trigger-example2.png)

**Tetikleyiciyi test etmek için:**

1. Wallarm Konsolu'nu açın → **Ayarlar** → **Kullanıcılar** ve yeni bir kullanıcı ekleyin. Örneğin:

    ![Eklenen kullanıcı](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. E-posta gelen kutunuzu açın ve aşağıdaki mesajın alındığını kontrol edin:

    ![Yeni kullanıcı hakkında e-posta](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slack kanalını açın ve **wallarm** kullanıcısından aşağıdaki bildirimin alındığını kontrol edin:

    ```
    [Wallarm] Tetikleyici: Şirket hesabına yeni bir kullanıcı eklendi

    Bildirim türü: create_user
    
    Yeni bir kullanıcı olan John Smith <johnsmith@example.com> Analizci rolüyle John Doe <johndoe@example.com> tarafından şirket hesabına eklendi.
    Bu bildirim, "Kullanıcı eklendi" tetikleyicisi tarafından tetiklendi.

    Müşteri: TestŞirketi
    Bulut: EU
    ```

    * `John Smith` ve `johnsmith@example.com` eklenen kullanıcı hakkında bilgidir
    * `Analizci` eklenen kullanıcının rolüdür
    * `John Doe` ve `johndoe@example.com` yeni bir kullanıcı ekleyen kullanıcı hakkında bilgidir
    * `Kullanıcı eklendi` tetikleyici adıdır
    * `TestŞirketi` Wallarm Konsolundaki şirket hesabınızın adıdır
    * `EU` şirket hesabınızın kayıtlı olduğu Wallarm Bulutudur

## Entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"