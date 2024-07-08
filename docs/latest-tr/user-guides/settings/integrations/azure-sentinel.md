# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) üzerinde olayları loglamak için Wallarm'ı ayarlayabilirsiniz. 

## Entegrasyonun ayarlanması

Microsoft kullanıcı arayüzünde:

1. Bir çalışma alanında [Microsoft Sentinel çalıştır](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Sentinel Çalışma Alanı ayarlarına devam edin → **Agents** → **Log Analytics agent instructions** ve aşağıdaki verileri kopyalayın:

    * Çalışma Alanı İD
    * Birincil anahtar

Wallarm Konsol kullanıcı arayüzünde:

1. **Entegrasyonlar** bölümünü açın.
1. **Microsoft Sentinel** bloğuna tıklayın veya **Entegrasyon ekle** butonuna tıklayın ve **Microsoft Sentinel**'i seçin.
1. Bir entegrasyon adı girin.
1. Kopyalanan Çalışma Alanı İD ve Birincil Aanhtarı yapıştırın.
1. İsteğe bağlı olarak, Wallarm olayları için Azure Sentinel tablosunu belirtin. Eğer mevcut değilse otomatik olarak oluşturulur.

    Isım olmadan, her olay türü için ayrı tablolar oluşturulur.
1. Bildirim tetiklemek için olay türlerini seçin. 

    ![Sentinel entegrasyonu](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Mevcut olaylar üzerinde bilgiler:

    --8<-- "../include-tr/integrations/advanced-events-for-integrations.md"

1. Konfigürasyon doğruluğunu kontrol etmek, Wallarm Bulut'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Entegrasyonu test et** seçeneğine tıklayın.

    Microsoft Çalışma Alanınızda Wallarm loglarınızı bulabilirsiniz → **Logs** → **Custom Logs**, örneğin Microsoft Sentinel'deki `create_user_CL` test logu aşağıdaki gibi görünür:

    ![Test Sentinel mesajı](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! bilgi "Yeni workspace'lere veri gönderiminde gecikme"
        Wallarm entegrasyonu için Sentinel'da bir Çalışma Alanı oluşturmak tüm servislerin çalışması için 1 saat sürebilir. Bu gecikme, entegrasyon testi ve kullanımı sırasında hataların oluşmasına neden olabilir. Tüm entegrasyon ayarları doğru olmasına rağmen hatalar tekrar ortaya çıkıyorsa, lütfen 1 saat sonra tekrar deneyin.

1. **Entegrasyon ekle**'ye tıklayın.

## Wallarm log türleri

Genel olarak, Wallarm, Sentinel'de aşağıdaki türlerde kayıtlar oluşturabilir:

| Olay | Sentinel log türü |
| ----- | ----------------- |
| Yeni [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| Şirket hesabında yeni [kullanıcı](../../../user-guides/settings/users.md) | `create_user_CL` |
| Şirket hesabından bir kullanıcının silinmesi | `delete_user_CL` |
| Kullanıcı rol güncelleme | `update_user_CL` |
| Bir [entegrasyon](integrations-intro.md)'un silinmesi | `delete_integration_CL` |
| Entegrasyon engellemeleri | `disable_integration_CL` ya da hatalı ayarlar nedeniyle devre dışı bırakıldıysa `integration_broken_CL` |
| Yeni [uygulama](../../../user-guides/settings/applications.md) | `create_application_CL` |
| Bir uygulamanın silinmesi | `delete_application_CL` |
| Uygulama adı güncelleme | `update_application_CL` |
| Yüksek riskli yeni [zafiyet](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| Orta riskli yeni zafiyet | `vuln_medium_CL` |
| Düşük riskli yeni zafiyet | `vuln_low_CL` |
| Yeni [kurallar](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| Bir kuralın silinmesi | `rule_delete_CL` |
| Mevcut bir kuralın değişiklikleri | `rule_update_CL` |
| Yeni [tetikleyici](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| Bir tetikleyicinin silinmesi | `trigger_delete_CL` |
| Mevcut bir tetikleyicinin değişiklikleri | `trigger_update_CL` |
| [Maruz kalan varlıklarda](../../scanner.md) ana bilgisayarlar, hizmetler ve alan adlarındaki güncellemeler | `scope_object_CL` |
| API envanterindeki değişiklikler (eğer ilgili [tetikleyici](../../triggers/triggers.md) aktifse) | `api_structure_changed_CL` |
| Saldırı miktarı eşiği aşıyor (eğer ilgili [tetikleyici](../../triggers/triggers.md) aktifse) | `attacks_exceeded_CL` |
| Yeni engellenmiş IP (eğer ilgili [tetikleyici](../../triggers/triggers.md) aktifse) | `ip_blocked_CL` |

## Bir entegrasyonu devre dışı bırakma ve silme 

--8<-- "../include-tr/integrations/integrations-disable-delete.md"

## Sistem erişilemezliği ve yanlış entegrasyon parametreleri

--8<-- "../include-tr/integrations/integration-not-working.md"