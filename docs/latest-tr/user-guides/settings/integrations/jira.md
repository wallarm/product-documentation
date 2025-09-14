# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira), Atlassian tarafından geliştirilen, yaygın olarak kullanılan bir proje yönetimi ve issue takip yazılımıdır. [Zafiyetler](../../../glossary-en.md#vulnerability) tespit edildiğinde, seçilen risk düzeyi/düzeyleri (yüksek, orta veya düşük) için veya tümü için, Jira'da issue oluşturacak şekilde Wallarm'ı yapılandırabilirsiniz.

## Entegrasyonu yapılandırma

Jira UI'da: 

1. API belirtecini [burada](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token) açıklandığı gibi oluşturun.
1. Oluşturulan API belirtecini kopyalayın.

Wallarm UI'da:

1. Wallarm Console → **Integrations** → **Jira**'yı açın.
1. Bir entegrasyon adı girin.
1. Jira host'unu girin (ör. `https://company-x.atlassian.net/`).
1. Kimlik doğrulama için Jira'nın gerektirdiği ve oluşturulan issue'lar için Reporter'ı tanımlamakta da kullanılacak olan Jira kullanıcı e‑postasını girin.
1. Oluşturulan API belirtecini yapıştırın. Belirtilen Jira host'unda Wallarm'ı kimlik doğrulamak için e‑posta ve belirteç kontrol edilecektir. Başarılı olursa, bu Jira kullanıcısının erişebildiği alanlar listelenecektir.
1. Issue'ların oluşturulacağı Jira alanını seçin. Seçildiğinde, bu alanda desteklenen issue türleri listelenecektir.
1. Oluşturulan issue'ların ait olacağı Jira issue türünü seçin.
1. Bildirimleri tetikleyecek olay türlerini seçin. Tüm zafiyetler veya yalnızca belirli risk düzey(ler)indekiler seçilebilir.

    ![Jira entegrasyonu](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. Yapılandırmanın doğruluğunu, Wallarm Cloud kullanılabilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'ı tıklayın.

    Jira issue oluşturmayı test edin:

    ![Jira issue oluşturmayı test etme](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistemin kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"