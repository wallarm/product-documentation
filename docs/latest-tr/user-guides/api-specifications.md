# API Özelliklerinizi Yükleme <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Konsol Arayüzündeki **API Özellikleri** bölümünde, Wallarm'ın parazit (gölge, yetim ve zombi) API'leri ortaya çıkarmak için kullandığı API özelliklerinizi saklayabilirsiniz. Bu makale bu bölümün nasıl kullanılacağı hakkında bilgi vermektedir.

**Yöneticiler** ve **Global Yöneticiler**, özellikler ekleyebilir, kaldırabilir ve indirebilir ve parazit API algılama ayarlarını değiştirebilir. Diğer [rollerdeki](../user-guides/settings/users.md#user-roles) kullanıcılar sadece yüklenmiş özelliklerin listesini görüntüleyebilir.

## Gölge, yetim ve zombi API'yi ortaya çıkarma

[**API Keşif**](../api-discovery/overview.md) kullanımda olduğunda, **API Özellikleri** bölümünde yüklediğiniz API özellikleri, API Keşfinin otomatik olarak tespit ettiği şeyle karşılaştırılabilir. Bu karşılaştırmanın sonucunda, Wallarm [parazit (gölge, yetim ve zombi) API'leri bulur ve gösterir](../api-discovery/overview.md#shadow-orphan-and-zombie-apis).

Karşılaştırma yapmak için:

1. **API Özellikleri** bölümüne gidin ve **Özellik yükle**'ye tıklayın.
1. Yüklemek için bir özellik seçin. OpenAPI 3.0 JSON veya YAML formatında olmalıdır.
1. Karşılaştırma parametrelerini ayarlayın:

    * Uygulama(lar) ve ana bilgisayar(lar) - sadece seçili uygulamalar/ana bilgisayarlara ait uç noktalar karşılaştırılacak. **Mevcut ve gelecekte keşfedilen tüm uygulamaları ana bilgisayarlarla karşılaştır** seçeneğini seçerseniz, şu anda bilinen tüm ana bilgisayarlar ve gelecekte keşfedilecek tüm ana bilgisayarlar karşılaştırmaya dahil edilecektir.

        Karşılaştırma ayarlarını daha sonra herhangi bir zamanda değiştirebilirsiniz - bundan sonra karşılaştırma yeniden yapılacak ve yeni sonuçlar sağlanacaktır.

    * Nereden yükleneceği: yerel makineniz veya URL. URL'ler için, başlık alanları aracılığıyla kimlik doğrulama için bir belirteç belirtebilirsiniz.
    * Karşılaştırmanın, özellik yüklendikten hemen sonra mı yoksa her saat başı mı gerçekleştirilmesi gerektiği. Saatlik karşılaştırma, API Keşfinin daha fazla uç nokta keşfettikçe ek parazit API'leri bulmayı sağlar. URL'den yüklenen özellik, her karşılaştırmadan önce güncellenir.

    ![API Keşfi - API Özellikleri - parazit API'leri bulmak için API özelliklerini yükleme](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    Lütfen karşılaştırmayı herhangi bir anda manuel olarak yeniden başlatabileceğinizi unutmayın: özellik menüsü → **Karşılaştırmayı Yeniden Başlat**.

1. Yüklemeye başlayın.

    Yükleme tamamlandığında, her bir özellik için parazit (gölge, yetim ve zombi) API'lerin sayısı **API Özellikleri** listesinde gösterilir. Ayrıca parazit API'ler  **API Keşfi** bölümünde de [gösterilir](api-discovery.md#displaying-shadow-orphan-and-zombie-api).

    ![API Özellikleri bölümü](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## Daha önce yüklenmiş özellikleri indirme

Daha önce yüklediğiniz özellikleri **API Özellikleri** → özellik ayrıntıları penceresi → **Özellik indir** üzerinden indirebilirsiniz.