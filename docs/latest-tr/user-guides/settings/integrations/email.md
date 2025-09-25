# E-posta Raporu

Zamanlanmış [PDF raporlarının](../../../user-guides/search-and-filters/custom-report.md) ve anlık bildirimlerin teslimi için kullanılacak ek e-posta adresleri tanımlayabilirsiniz. Birincil e-posta adresinize mesaj gönderimi varsayılan olarak yapılandırılmıştır.

Zamanlanmış PDF raporları günlük, haftalık veya aylık olarak gönderilebilir. PDF raporları, seçilen dönem içinde sisteminizde tespit edilen güvenlik açıkları, saldırılar ve olaylar hakkında ayrıntılı bilgi içerir. Bildirimler, tetiklenen olayların kısa ayrıntılarını içerir.

## Entegrasyonun yapılandırılması

1. **Integrations** bölümünü açın.
1. **Email report** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Email report** seçeneğini seçin. 
1. Bir entegrasyon adı girin.
1. E-posta adreslerini ayraç olarak virgül kullanarak girin.
1. Güvenlik raporlarının gönderim sıklığını seçin. Sıklık seçilmezse raporlar gönderilmez.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Email report entegrasyonu](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    Kullanılabilir olaylara ilişkin ayrıntılar:

    --8<-- "../include/integrations/events-for-integrations-mail.md"

    !!! info "Devre dışı bırakılamayan bildirimler"
        Wallarm, kullanıcı e-posta adresinize devre dışı bırakılamayan bazı bildirimler de gönderecektir:

        * [Abonelik](../../../about-wallarm/subscription-plans.md) bildirimleri
        * [API token süresinin dolması](../../../user-guides/settings/api-tokens.md#token-expiration) bildirimleri
        * [Hit sampling](../../../user-guides/events/grouping-sampling.md#sampling-of-hits) bildirimleri

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'a tıklayın.

    Bu işlem, `[Test message]` önekiyle test bildirimleri gönderecektir:

    ![Test e-posta iletisi](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. **Add integration**'a tıklayın.

## Ek uyarıların yapılandırılması

* Belirli bir zaman aralığında (gün, saat vb.) [saldırıların](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) veya olayların sayısının belirlenen sayıyı aşması
* [API'de değişiklikler](../../../api-discovery/track-changes.md) gerçekleşti
* Şirket hesabına yeni bir kullanıcı eklendi

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"