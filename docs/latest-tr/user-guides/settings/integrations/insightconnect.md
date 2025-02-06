# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/) siber güvenlik operasyonlarını kolaylaştırmak, otomatikleştirmek ve yanıt vermek amacıyla tasarlanmış bir güvenlik orkestrasyonu, otomasyon ve yanıt (SOAR) platformudur. Bu platform, kuruluşların güvenlik olaylarını ve tehditlerini tespit etmelerini, araştırmalarını ve müdahale etmelerini kolaylaştırır. Wallarm'u, InsightConnect'e bildirim gönderecek şekilde yapılandırabilirsiniz.

## Entegrasyonun kurulması

İlk olarak, aşağıdaki adımları takip ederek bir API anahtarı oluşturup kopyalayın:

1. InsightConnect'in kullanıcı arayüzünü açın → **Settings** → [**API Keys** sayfası](https://insight.rapid7.com/platform#/apiKeyManagement) ve **New User Key** seçeneğine tıklayın.
2. Bir API anahtarı adı girin (ör. `Wallarm API`) ve **Generate** tuşuna basın.
3. Oluşturulan API anahtarını kopyalayın.
4. Wallarm kullanıcı arayüzüne gidin → **Integrations** bölümüne; [US](https://us1.my.wallarm.com/integrations/) veya [EU](https://my.wallarm.com/integrations/) bulutunda **InsightConnect** seçeneğine tıklayın.
5. Daha önce kopyaladığınız API anahtarını **API key** alanına yapıştırın.

İkinci adımda, aşağıdaki adımları takip ederek bir API URL'si oluşturup kopyalayın:

1. InsightConnect'in kullanıcı arayüzüne geri dönün, **Automation** → **Workflows** sayfasını açın ve Wallarm bildirimi için yeni bir iş akışı oluşturun.
2. Bir tetikleyici seçmeniz istendiğinde, **API Trigger**'ı seçin.
3. Oluşturulan URL'yi kopyalayın.
4. Wallarm kullanıcı arayüzüne geri dönün → **InsightConnect** yapılandırmasına gidin ve daha önce kopyaladığınız API URL'sini **API URL** alanına yapıştırın.

Üçüncü adımda, Wallarm kullanıcı arayüzünde kurulumu tamamlayın:

1. Bir entegrasyon adı girin.
2. Bildirimleri tetikleyecek olay türlerini seçin.

    ![InsightConnect integration](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    Mevcut olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

3. Yapılandırmanın doğruluğunu, Wallarm Cloud'un erişilebilirliğini ve bildirim formatını kontrol etmek için **Test integration**'a tıklayın.

    Bu, `[Test message]` önekiyle test bildirimlerini gönderecektir:

    ![Test InsightConnect notification](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

4. **Add integration**'a tıklayın.

--8<-- "../include/cloud-ip-by-request.md"

## Ek uyarıların kurulması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"