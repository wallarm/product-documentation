# Atlassian Jira

Wallarm'ı, [güvenlik açıkları](../../../glossary-en.md#vulnerability) bulunduğunda Jira'da sorunlar oluşturacak şekilde ayarlayabilirsiniz - hepsi veya sadece seçili risk seviyesi/leri için (yüksek, orta veya düşük).

## Entegrasyonu ayarlama

Jira UI'da: 

1. [Burada](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token) tarif edildiği gibi API belirteci oluşturun.
1. Oluşturulan API belirtecini kopyalayın.

Wallarm UI'da:

1. Wallarm Konsolu'nu açın → **Entegrasyonlar** → **Jira**.
1. Bir entegrasyon adı girin.
1. Jira sunucusunu girin (ör., `https://company-x.atlassian.net/`).
1. Jira kullanıcı e-postasını girin. Jira, bu bilgiyi kimlik doğrulama için gerektirir ve oluşturulan sorunlar için Rapor Eden kişi olarak da kullanılır.
1. Oluşturulan API belirtecini yapıştırın. E-posta ve belirteç, belirtilen Jira sunucusunda Wallarm'ı kimlik doğrulamak için kontrol edilecektir. Kimliği doğrulanmışsa, bu Jira kullanıcısına sunulan alanlar listelenecektir.
1. Sorunların oluşturulacağı Jira alanını seçin. Seçildiğinde, bu alanda desteklenen sorun türlerinin listesi görüntülenir.
1. Oluşturulan sorunların ait olacağı Jira sorun türünü seçin.
1. Bildirimleri tetiklemek için olay türlerini seçin. Tüm güvenlik açıkları veya sadece belirli risk seviye(ler)ine ait olanlar seçilebilir.

    ![Jira entegrasyonu](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. **Entegrasyonu deneme** düğmesine tıklayarak yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim formatını kontrol edin.

    Jira sorun oluşturmayı deneme:

    ![Jira sorun oluşturmayı deneme](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. **Entegrasyon ekle** düğmesine tıklayın.

## Entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"