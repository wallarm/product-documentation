# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) Microsoft tarafından, Azure bulut platformunun bir parçası olarak organizasyonların tüm bulut ve yerel ortamlarında güvenlik tehditlerini ve olaylarını izlemelerine, tespit etmelerine, araştırmalarına ve yanıt vermelerine yardımcı olmak için sunulan bir çözümdür. Wallarm, Microsoft Sentinel'de olay kaydı oluşturacak şekilde yapılandırılabilir.

## Entegrasyonun Ayarlanması

Microsoft kullanıcı arayüzünde:

1. [Bir Çalışma Alanında Microsoft Sentinel'i Çalıştırın](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Sentinel Çalışma Alanı ayarları → **Agents** → **Log Analytics agent instructions** bölümüne gidin ve aşağıdaki verileri kopyalayın:

    * Çalışma Alanı ID'si
    * Birincil anahtar

Wallarm Console kullanıcı arayüzünde:

1. **Integrations** bölümünü açın.
1. Microsoft Sentinel bloğuna tıklayın veya **Add integration** butonuna tıklayıp **Microsoft Sentinel** seçin.
1. Bir entegrasyon adı girin.
1. Kopyaladığınız Çalışma Alanı ID'si ve birincil anahtarı yapıştırın.
1. İsteğe bağlı olarak, Wallarm etkinlikleri için Azure Sentinel tablosunu belirtin. Eğer mevcut değilse, otomatik olarak oluşturulacaktır. 

    Bir isim belirtilmediğinde, her etkinlik türü için ayrı tablolar oluşturulur.
1. Bildirimleri tetiklemek için etkinlik türlerini seçin.

    ![Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Mevcut etkinliklerle ilgili detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Konfigürasyonun doğruluğunu, Wallarm Cloud’un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** butonuna tıklayın.

    Wallarm loglarını Microsoft Workspace’ünüzde, **Logs** → **Custom Logs** bölümünde bulabilirsiniz; örneğin, Microsoft Sentinel’deki test `create_user_CL` logu aşağıdaki gibi görünür:

    ![Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "Yeni çalışma alanlarına veri gönderiminde gecikme"
        Wallarm entegrasyonu için Sentinel üzerinde bir Çalışma Alanı oluşturulması, tüm hizmetlerin çalışması için 1 saate kadar sürebilir. Bu gecikme, entegrasyon testi ve kullanımı sırasında hatalara sebep olabilir. Tüm entegrasyon ayarları doğruysa ancak hatalar devam ediyorsa, lütfen 1 saat sonra tekrar deneyin.

1. **Add integration** butonuna tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Wallarm Loglarının Türleri

Genel olarak, Wallarm Sentinel'de aşağıdaki türde kayıtları loglayabilir:

| Etkinlik | Sentinel log türü |
| -------- | ----------------- |
| Yeni [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| Bir şirket hesabı için yeni [user](../../../user-guides/settings/users.md) | `create_user_CL` |
| Bir şirket hesabından kullanıcının silinmesi | `delete_user_CL` |
| Kullanıcı rolü güncellemesi | `update_user_CL` |
| Bir [integration](integrations-intro.md) silinmesi | `delete_integration_CL` |
| Bir entegrasyonun devre dışı bırakılması | `disable_integration_CL` veya yanlış ayarlar nedeniyle devre dışı bırakıldıysa `integration_broken_CL` |
| Yeni [application](../../../user-guides/settings/applications.md) | `create_application_CL` |
| Bir uygulamanın silinmesi | `delete_application_CL` |
| Uygulama ismi güncellemesi | `update_application_CL` |
| Yeni yüksek riskli [vulnerability](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| Yeni orta riskli vulnerability | `vuln_medium_CL` |
| Yeni düşük riskli vulnerability | `vuln_low_CL` |
| Yeni [rule](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| Bir kuralın silinmesi | `rule_delete_CL` |
| Var olan bir kuralda yapılan değişiklikler | `rule_update_CL` |
| Yeni [trigger](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| Bir tetikleyicinin silinmesi | `trigger_delete_CL` |
| Var olan bir tetikleyicide yapılan değişiklikler | `trigger_update_CL` |
| [exposed assets](../../scanner.md) içindeki host, servis ve domain güncellemeleri | `scope_object_CL` |
| API envanterindeki değişiklikler (ilgili [trigger](../../triggers/triggers.md) aktifse) | `api_structure_changed_CL` |
| Saldırı sayısı eşik değeri aştığında (ilgili [trigger](../../triggers/triggers.md) aktifse) | `attacks_exceeded_CL` |
| Yeni karalisteye alınan IP (ilgili [trigger](../../triggers/triggers.md) aktifse) | `ip_blocked_CL` |

## Bir Entegrasyonun Devre Dışı Bırakılması ve Silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"