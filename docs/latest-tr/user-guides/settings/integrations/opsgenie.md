# Opsgenie

[Opsgenie](https://www.atlassian.com/software/opsgenie), Atlassian tarafından geliştirilen bir olay yönetimi ve uyarı aracıdır. Wallarm'ı, Opsgenie'e uyarı gönderecek şekilde yapılandırabilirsiniz.

## Entegrasyonun Kurulması

[Opsgenie UI](https://app.opsgenie.com/teams/list) üzerinde:

1. Ekibinize gidin ➝ **Integrations**.
2. **Add integration** düğmesine tıklayın ve **API** seçeneğini seçin.
3. Yeni entegrasyon için bir isim girin ve **Save Integration** düğmesine tıklayın.
4. Sağlanan API anahtarını kopyalayın.

Wallarm UI üzerinde:

1. **Integrations** bölümünü açın.
1. **Opsgenie** bloğuna tıklayın veya **Add integration** düğmesine tıklayarak **Opsgenie** seçeneğini seçin.
1. Bir entegrasyon adı girin.
1. Kopyaladığınız API anahtarını **API key** alanına yapıştırın.
1. Opsgenie'nin [EU instance](https://docs.opsgenie.com/docs/european-service-region) sürümünü kullanıyorsanız, listeden uygun Opsgenie API uç noktasını seçin. Varsayılan olarak US instance uç noktası ayarlıdır.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Opsgenie integration](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    Kullanılabilir olaylar hakkında detaylar:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Bu, `[Test message]` önekiyle test bildirimlerini gönderecektir:

    ![Test Opsgenie message](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek Uyarıların Kurulması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: Bir saniyede 2 veya daha fazla olay tespit edilirse Opsgenie bildirimi

Eğer bir saniyede uygulama sunucusu veya veritabanıyla ilgili 2 veya daha fazla olay tespit edilirse, bu olayla ilgili bildirim Opsgenie'e gönderilecektir.

![Example of a trigger sending the data to Splunk](../../../images/user-guides/triggers/trigger-example3.png)

**Tetikleyiciyi test etmek** için, korumalı kaynağa aktif bir açığı kullanan saldırının gönderilmesi gerekmektedir. Wallarm Console → **Vulnerabilities** bölümü, uygulamalarınızda tespit edilen aktif açıkları ve bu açıkları kullanan saldırı örneklerini gösterir.

Eğer saldırı örneği korumalı kaynağa gönderilirse, Wallarm olayı kaydedecektir. İki veya daha fazla kaydedilen olay, aşağıdaki bildirimin Opsgenie'e gönderilmesini tetikleyecektir:

```
[Wallarm] Trigger: The number of incidents exceeded the threshold

Notification type: incidents_exceeded

The number of detected incidents exceeded 1 in 1 second.
This notification was triggered by the "Notification about incidents" trigger.

Additional trigger’s clauses:
Target: server, database.

View events:
https://my.wallarm.com/attacks?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about incidents` tetikleyici adıdır  
* `TestCompany` Wallarm Console’daki şirket hesabınızın adıdır  
* `EU` şirket hesabınızın kayıtlı olduğu Wallarm Cloud’dur  

!!! info "Kaynağın aktif güvenlik açığı kullanımına karşı korunması"
    Kaynağın aktif güvenlik açığı kullanılarak saldırıya uğramasını önlemek için, açığın zamanında yamalanmasını öneririz. Eğer güvenlik açığı uygulama tarafında yamalanamıyorsa, bu açığı kullanan saldırıları engellemek amacıyla lütfen bir [virtual patch](../../rules/vpatch-rule.md) yapılandırın.

## Bir Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"