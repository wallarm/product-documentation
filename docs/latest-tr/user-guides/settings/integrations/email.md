# E-posta Raporu

Planlanmış [PDF raporlarının](../../../user-guides/search-and-filters/custom-report.md) teslimatı ve anlık bildirimler için ek e-posta adresleri belirleyebilirsiniz. Birincil e-posta adresinize mesaj gönderimi varsayılan olarak yapılandırılmıştır.

Planlanmış PDF raporlar günlük, haftalık veya aylık olarak gönderilebilir. PDF raporlar, seçilen dönem boyunca sisteminizde tespit edilen güvenlik açıkları, saldırılar ve olaylar hakkında ayrıntılı bilgiler içerir. Bildirimler, tetiklenen olayların kısa özetlerini sunar.

## Entegrasyonu Ayarlama

1. **Integrations** bölümünü açın.
1. **Email report** bloğuna tıklayın veya **Add integration** düğmesine tıklayarak **Email report** seçeneğini belirleyin.
1. Bir entegrasyon adı girin.
1. Virgül ile ayırarak e-posta adreslerini girin.
1. Güvenlik raporlarının gönderim sıklığını seçin. Sıklık seçilmezse, raporlar gönderilmeyecektir.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![Email report integration](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    Mevcut olaylar hakkındaki ayrıntılar:

    --8<-- "../include/integrations/events-for-integrations-mail.md"

    !!! info "Devre dışı bırakılamayan bildirimler"
        Wallarm, devre dışı bırakılamayan bazı bildirimleri kullanıcı e-posta adresinize de gönderecektir:

        * [Subscription](../../../about-wallarm/subscription-plans.md) bildirimleri
        * [API token expiration](../../../user-guides/settings/api-tokens.md#token-expiration) bildirimleri
        * [Hit sampling](../../../user-guides/events/grouping-sampling.md#sampling-of-hits) bildirimleri

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Bu işlem, `[Test message]` önekiyle test bildirimlerini gönderecektir:

    ![Test email message](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. **Add integration** düğmesine tıklayın.

## Ek Uyarıları Ayarlama

* Belirlenen zaman diliminde (gün, saat vb.) [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olay sayısının belirlenen değeri aşması
* API'de [Changes in API](../../../api-discovery/track-changes.md) meydana gelmesi
* Yeni kullanıcının şirket hesabına eklenmesi

## Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Erişilemez Olduğunda ve Hatalı Entegrasyon Parametrelerinde

--8<-- "../include/integrations/integration-not-working.md"