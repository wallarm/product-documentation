# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/), Microsoft tarafından Azure bulut platformunun bir parçası olarak sunulan, kuruluşların tüm bulut ve şirket içi ortamları genelinde güvenlik tehditlerini ve olaylarını izlemelerine, tespit etmelerine, araştırmalarına ve yanıt vermelerine yardımcı olan bir çözümdür. Wallarm'ı Microsoft Sentinel'de olayları kaydedecek şekilde yapılandırabilirsiniz.

## Entegrasyonun yapılandırılması

Microsoft UI'da:

1. [Microsoft Sentinel'ı bir Workspace üzerinde çalıştırın](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Sentinel Workspace settings → **Agents** → **Log Analytics agent instructions** bölümüne gidin ve aşağıdaki verileri kopyalayın:

    * Workspace ID
    * Primary key

Wallarm Console UI'da:

1. **Integrations** bölümünü açın.
1. **Microsoft Sentinel** bloğuna tıklayın veya **Add integration** düğmesine tıklayıp **Microsoft Sentinel** seçin.
1. Bir integration adı girin.
1. Kopyaladığınız Workspace ID ve Primary key değerlerini yapıştırın.
1. İsteğe bağlı olarak, Wallarm olayları için Azure Sentinel tablosunu belirtin. Eğer yoksa otomatik olarak oluşturulacaktır. 

    İsim verilmezse, her olay türü için ayrı tablolar oluşturulur.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![Sentinel entegrasyonu](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Kullanılabilir olaylar hakkında ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud erişilebilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'a tıklayın.

    Wallarm loglarını Microsoft Workspace'inizde → **Logs** → **Custom Logs** altında bulabilirsiniz; örneğin test amaçlı `create_user_CL` logu Microsoft Sentinel'de aşağıdaki gibi görünür:

    ![Sentinel test iletisi](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "Yeni workspaces için veri gönderiminde gecikme"
        Wallarm entegrasyonu için Sentinel üzerinde bir Workspace oluşturulduğunda tüm hizmetlerin çalışır duruma gelmesi 1 saate kadar sürebilir. Bu gecikme, entegrasyonun test edilmesi ve kullanımı sırasında hatalara yol açabilir. Tüm entegrasyon ayarları doğruysa ancak hatalar görünmeye devam ediyorsa, lütfen 1 saat sonra tekrar deneyin.

1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Wallarm günlük türleri

Genel olarak, Wallarm Sentinel'e aşağıdaki türlerde kayıtlar yazabilir:

| Olay | Sentinel log türü |
| ----- | ----------------- |
| Yeni [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| Şirket hesabında yeni [user](../../../user-guides/settings/users.md) | `create_user_CL` |
| Şirket hesabından bir user silinmesi | `delete_user_CL` |
| User rolü güncellemesi | `update_user_CL` |
| Bir [integration](integrations-intro.md) silinmesi | `delete_integration_CL` |
| Bir integration'ın devre dışı bırakılması | `disable_integration_CL` veya yanlış ayarlar nedeniyle devre dışı bırakıldıysa `integration_broken_CL` |
| Yeni [application](../../../user-guides/settings/applications.md) | `create_application_CL` |
| Bir application silinmesi | `delete_application_CL` |
| Application adının güncellenmesi | `update_application_CL` |
| Yüksek riskli yeni [vulnerability](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| Orta riskli yeni vulnerability | `vuln_medium_CL` |
| Düşük riskli yeni vulnerability | `vuln_low_CL` |
| Yeni [rule](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| Bir rule silinmesi | `rule_delete_CL` |
| Mevcut bir rule'da değişiklikler | `rule_update_CL` |
| Yeni [trigger](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| Bir trigger silinmesi | `trigger_delete_CL` |
| Mevcut bir trigger'da değişiklikler | `trigger_update_CL` |
| API envanterinde değişiklikler (ilgili [trigger](../../triggers/triggers.md) etkinse) | `api_structure_changed_CL` |
| Saldırı sayısı eşik değeri aşıyor (ilgili [trigger](../../triggers/triggers.md) etkinse) | `attacks_exceeded_CL` |
| Yeni denylisted IP (ilgili [trigger](../../triggers/triggers.md) etkinse) | `ip_blocked_CL` |

## Bir integration'ı devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve hatalı integration parametreleri

--8<-- "../include/integrations/integration-not-working.md"