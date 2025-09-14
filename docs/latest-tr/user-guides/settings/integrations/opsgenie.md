# Opsgenie

[Opsgenie](https://www.atlassian.com/software/opsgenie), Atlassian tarafından sunulan bir olay yönetimi ve uyarı aracıdır. Wallarm’ı, uyarıları Opsgenie’ye gönderecek şekilde yapılandırabilirsiniz.

## Entegrasyonun ayarlanması

[Opsgenie UI](https://app.opsgenie.com/teams/list) içinde:

1. Ekibinize gidin ➝ **Integrations**.
2. **Add integration** düğmesine tıklayın ve **API** seçin.
3. Yeni entegrasyon için bir ad girin ve **Save Integration**’a tıklayın.
4. Sağlanan API key’i kopyalayın.

Wallarm UI’de:

1. **Integrations** bölümünü açın.
1. **Opsgenie** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Opsgenie**’yi seçin.
1. Bir entegrasyon adı girin.
1. Kopyaladığınız API key’i **API key** alanına yapıştırın.
1. Opsgenie’nin [EU instance'ını](https://docs.opsgenie.com/docs/european-service-region) kullanıyorsanız, listeden uygun Opsgenie API endpoint’ini seçin. Varsayılan olarak US instance endpoint’i ayarlıdır.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Opsgenie entegrasyonu](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    Kullanılabilir olayların ayrıntıları:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim biçimini kontrol etmek için **Test integration**’a tıklayın.

    Bu, “[Test message]” öneki ile test bildirimleri gönderecektir:

    ![Opsgenie test mesajı](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. **Add integration**’a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıların ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Örnek: Bir saniye içinde 2 veya daha fazla olay tespit edilirse Opsgenie bildirimi

Uygulama sunucusu veya veritabanı ile ilgili 1 saniye içinde 2 veya daha fazla olay tespit edilirse bu olaya ilişkin bildirim Opsgenie’ye gönderilecektir.

![Verileri Splunk'a gönderen bir tetikleyici örneği](../../../images/user-guides/triggers/trigger-example3.png)

**Tetiği test etmek için**, korunan kaynağa, aktif bir güvenlik açığını istismar eden saldırı göndermek gerekir. Wallarm Console → **Vulnerabilities** bölümü, uygulamalarınızda tespit edilen aktif güvenlik açıklarını ve bu açıkları istismar eden saldırı örneklerini görüntüler.

Saldırı örneği korunan kaynağa gönderilirse, Wallarm olayı kaydedecektir. İki veya daha fazla kayıtlı olay, aşağıdaki bildirimin Opsgenie’ye gönderilmesini tetikleyecektir:

```
[Wallarm] Trigger: Olay sayısı eşik değerini aştı

Bildirim türü: incidents_exceeded

Algılanan olay sayısı 1'i 1 saniye içinde aştı.
Bu bildirim "Notification about incidents" trigger'ı tarafından tetiklendi.

Tetikleyicinin ek koşulları:
Hedef: sunucu, veritabanı.

Olayları görüntüle:
https://my.wallarm.com/attacks?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Müşteri: TestCompany
Cloud: EU
```

* `Notification about incidents` tetikleyicinin adıdır
* `TestCompany`, Wallarm Console içindeki şirket hesabınızın adıdır
* `EU`, şirket hesabınızın kayıtlı olduğu Wallarm Cloud’dur

!!! info "Kaynağı aktif güvenlik açığı istismarına karşı koruma"
    Kaynağı aktif güvenlik açığı istismarına karşı korumak için, güvenlik açığını zamanında yamalamanızı öneririz. Güvenlik açığı uygulama tarafında yamalanamıyorsa, bu güvenlik açığını istismar eden saldırıları engellemek için lütfen bir [sanal yama](../../rules/vpatch-rule.md) yapılandırın.

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"