# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/), kuruluşların siber güvenlik operasyonlarını kolaylaştırıp otomatikleştirmesine yardımcı olmak için tasarlanmış bir güvenlik orkestrasyonu, otomasyon ve yanıt (SOAR) platformudur; güvenlik olaylarını ve tehditleri tespit etmeyi, araştırmayı ve yanıtlamayı kolaylaştırır. Wallarm'ı InsightConnect'e bildirim gönderecek şekilde ayarlayabilirsiniz.

## Entegrasyonu yapılandırma

Önce, aşağıdaki şekilde bir API key oluşturup kopyalayın:

1. InsightConnect'in UI'sini açın → **Settings** → [**API Keys** page](https://insight.rapid7.com/platform#/apiKeyManagement) ve **New User Key**'e tıklayın.
2. Bir API key adı girin (ör. `Wallarm API`) ve **Generate**'e tıklayın.
3. Oluşturulan API key'i kopyalayın.
4. Wallarm UI'ye gidin → [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) cloud'daki **Integrations** bölümüne gidin ve **InsightConnect**'e tıklayın.
4. Daha önce kopyaladığınız API key'i **API key** alanına yapıştırın.

İkinci olarak, aşağıdaki gibi bir API URL oluşturup kopyalayın:

1. InsightConnect'in UI'sine geri dönün, **Automation** → **Workflows** sayfasını açın ve Wallarm bildirimi için yeni bir workflow oluşturun.
2. Tetikleyici seçmeniz istendiğinde, **API Trigger**'ı seçin.
3. Oluşturulan URL'yi kopyalayın.
4. Wallarm UI'ye geri dönün → **InsightConnect** yapılandırmasına gidin ve daha önce kopyaladığınız API URL'sini **API URL** alanına yapıştırın.

Üçüncü olarak, kurulumu Wallarm UI'de tamamlayın:

1. Bir entegrasyon adı girin.
1. Bildirimleri tetikleyecek olay türlerini seçin.

    ![InsightConnect entegrasyonu](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    Mevcut olaylara ilişkin ayrıntılar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırmanın doğruluğunu, Wallarm Cloud'un kullanılabilirliğini ve bildirim biçimini kontrol etmek için **Test integration**'a tıklayın.

    Bu işlem, `[Test message]` ön ekine sahip test bildirimleri gönderecektir:

    ![Test InsightConnect bildirimi](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıları yapılandırma

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonu devre dışı bırakma ve silme

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamaması ve hatalı entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"