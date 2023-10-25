# E-posta Raporu

Ek e-posta adresleri belirleyebilirsiniz, bunlar programlanmış [PDF raporlarının](../../../user-guides/search-and-filters/custom-report.md) ve anlık bildirimlerin tesliminde kullanılacaktır. Mesajları ana e-posta adresinize gönderme varsayılan olarak ayarlanmıştır.

Programlanmış PDF raporları günlük, haftalık veya aylık olarak gönderilebilir. PDF raporlar seçilen dönem boyunca sistemde tespit edilen açıklıklar, saldırılar ve olaylar hakkında ayrıntılı bilgiler içerir.

Bildirimler tetiklenen olayların kısa ayrıntılarını içerir.

## Entegrasyonu ayarlama

1. **Entegrasyonlar** bölümünü açın.
1.**E-posta raporu** blokuna tıklayın veya **Entegrasyon ekle** düğmesine tıklayın ve **E-posta raporu** seçeneğini seçin.
1. Bir entegrasyon adı girin.
1. E-posta adreslerini virgül kullanarak ayırarak girin.
1. Güvenlik raporlarının gönderilme sıklığını seçin. Sıklık seçilmemişse, raporlar gönderilmez.
1. Bildirimlere tetikleme yapacak olay türlerini seçin.

    ![E-posta raporu entegrasyonu](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    Kullanılabilir olaylar hakkında ayrıntılar:

    --8<-- "../include/integrations/events-for-integrations-mail.md"

1. Ayar doğruluğunu kontrol etmek, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu Test Et**'i tıklayın.

    Bu, ön eki '[Test mesajı]' olan test bildirimlerini gönderecektir:

    ![Test e-posta mesajı](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. **Entegrasyon Ekle**'yi tıklayın.

## Ek uyarılar ayarlama

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"
