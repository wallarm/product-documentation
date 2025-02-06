# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira), Atlassian tarafından geliştirilen yaygın kullanılan bir proje yönetimi ve sorun takip yazılımıdır. Wallarm'ı, [vulnerabilities](../../../glossary-en.md#vulnerability) tespit edildiğinde, tüm risk seviyeleri veya yalnızca seçilen risk düzeyi(ler) - yüksek, orta veya düşük - için Jira'da sorun oluşturacak şekilde yapılandırabilirsiniz.

## Entegrasyonu Kurma

Jira UI'de: 

1. [Burada](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token) açıklandığı gibi API token'ı oluşturun.
1. Oluşturulan API token'ını kopyalayın.

Wallarm UI'de:

1. Wallarm Console → **Integrations** → **Jira** bölümünü açın.
1. Bir entegrasyon adı girin.
1. Jira host'unu girin (örneğin, `https://company-x.atlassian.net/`).
1. Jira'nın kimlik doğrulama için istediği ve oluşturulan sorunlarda Reporter'ı belirlemek için kullanılacak olan Jira kullanıcı e-posta adresini girin.
1. Oluşturulan API token'ını yapıştırın. Belirtilen Jira host'unda Wallarm'ın kimlik doğrulaması için e-posta ve token kontrol edilecektir. Başarılı olursa, bu Jira kullanıcısına ait mevcut alanlar listelenecektir.
1. Sorun oluşturulacak Jira alanını seçin. Seçildiğinde, bu alanda desteklenen sorun türlerinin listesi gösterilecektir.
1. Oluşturulan sorunların ait olacağı Jira sorun türünü seçin.
1. Bildirimleri tetiklemek için olay türlerini seçin. Tüm vulnerabilities veya yalnızca belirli risk düzeylerindeki olaylar seçilebilir.

    ![Jira integration](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol etmek için **Test integration** düğmesine tıklayın.

    Test Jira issue creation:

    ![Test Jira issue creation](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. **Add integration** düğmesine tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Entegrasyonu Devre Dışı Bırakma ve Silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem Kullanılamazlığı ve Yanlış Entegrasyon Parametreleri

--8<-- "../include/integrations/integration-not-working.md"