# InsightConnect

Wallarm'i InsightConnect'a bildirim göndermek üzere ayarlayabilirsiniz.

## Entegrasyon kurulumu

Öncelikle, şu şekilde bir API anahtarı oluşturun ve kopyalayın:

1. InsightConnect'ın UI'sini açın → **Ayarlar** → [**API Anahtarları** sayfası](https://insight.rapid7.com/platform#/apiKeyManagement) ve **Yeni Kullanıcı Anahtarı**'nı tıklayın.
2. Bir API anahtarı adı girin (örneğin `Wallarm API`) ve **Oluştur**'a tıklayın.
3. Oluşturulan API anahtarını kopyalayın.
4. Wallarm UI'ye gidin → Amerika veya Avrupa bulutundaki [**Entegrasyonlar**](https://us1.my.wallarm.com/integrations/) ve **InsightConnect**'ı tıklayın.
4. Daha önce kopyaladığınız API anahtarını **API anahtarı** alanına yapıştırın.

İkincil olarak, bir API URL'si oluşturun ve bu şekilde kopyalayın:

1. InsightConnect'ın UI'ına geri dönün, **Otomasyon** → **İş Akışları** sayfasını açın ve Wallarm bildirimi için yeni bir iş akışı oluşturun.
2. Tetikleyici seçilmesi istendiğinde, **API Tetikleyici**'ni seçin.
3. Oluşturulan URL'yi kopyalayın.
4. Wallarm UI'ya geri dönün → **InsightConnect** yapılandırması ve daha önce kopyaladığınız API URL'sini **API URL** alanına yapıştırın.

Üçüncü olarak, Wallarm UI'daki kurulumu tamamlayın:

1. Bir entegrasyon adı girin.
1. Bildirimleri tetiklemek için olay türlerini seçin.

    ![InsightConnect entegrasyonu](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    Kullanılabilir olaylar hakkında detaylar:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Yapılandırma doğruluğunu, Wallarm Bulut'unun kullanılabilirliğini ve bildirim biçimini kontrol etmek için **Entegrasyonu test et**'e tıklayın.

    Bu, `[Test mesajı]` önekiyle test bildirimlerini gönderir:

    ![InsightConnect bildirimini test et](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. **Entegrasyon ekle**'ye tıklayın.

## Ek uyarıların ayarlanması

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Bir entegrasyonun devre dışı bırakılması ve silinmesi

--8<-- "../include/integrations/integrations-disable-delete.md"

## Sistem kullanılamazlığı ve yanlış entegrasyon parametreleri

--8<-- "../include/integrations/integration-not-working.md"