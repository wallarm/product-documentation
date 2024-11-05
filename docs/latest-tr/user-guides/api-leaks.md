# API Sızıntılarını Yönetme

**API Sızıntıları** modülü, API belirteçlerinin sızıntıları için binlerce halka açık depoyu ve kaynağı aktif olarak tarar ve API portföyünüze saldırılara veya başka zararlara karşı korumak için sızdırılan belirteçleri engellemenize izin verir. Bu makale, API sızıntılarını nasıl yöneteceğinizi anlatmaktadır.

Temel yeteneklerin bir özetini görmek için lütfen **API Sızıntıları** modülünün [genel bakışına](../api-attack-surface/security-issues.md) başvurun.

## API Sızıntılarına Erişim

Wallarm konsolunda, aşağıda belirtildiği gibi çalışmak üzere **API Sızıntıları** bölümünü kullanın.

* **API Sızıntıları** modülünü etkinleştirmek için lütfen [Wallarm teknik desteğine](mailto:support@wallarm.com) bir istekte bulunun.
* Bu bölüme erişebilecek ve sızıntıları yönetebilecek olanlar yalnızca **Yönetici** veya **Global yönetici** [rolüne](../user-guides/settings/users.md#user-roles) sahip kullanıcılardır.
* **Analizci** veya **Global analizci** rolüne sahip kullanıcılarsa bu bölüme erişebilir, ancak sızıntıları yönetemezler.

## Yeni API sızıntıları

Yeni sızıntıları kaydetmek için iki yol vardır:

* Otomatik - Wallarm, binlerce halka açık depoyu ve kaynağı aktif olarak tarar ve yeni sızıntıları listeye ekler. **Durum**a göre sıralayın ve `Açık` sızıntıları görüntüleyin - bunlar dikkatinizi gerektirir.
* Manuel - API sızıntılarını manuel olarak ekleyin. Her biri, sızdırılan belirteçlerin bir setidir.

![API Sızıntıları - Manuel ekleme](../images/api-attack-surface/api-leaks-add-manually.png)

## Etkileşimli görselleştirme

**API Sızıntıları** bölümü, bulunan API sızıntılarına ilişkin mevcut durumunuz için zengin bir görsel temsil sağlar. Sızıntıları risk seviyelerine ve kaynaklara göre filtrelemek için diyagram unsurlarını tıklayarak grafikleri kullanın ve bulunan sızıntılarla mevcut durumu hızlıca analiz edin.

![API Sızıntıları - Görselleştirme](../images/api-attack-surface/api-leaks-visual.png)

## Karar verme

API sızıntısının nasıl eklendiğine bakılmaksızın - otomatik olarak veya manuel olarak - ne yapılacağına dair karar her zaman sizindir. Bu kararları şu şekilde yönetebilirsiniz:

* Sızdırılan belirteçlerin tüm kullanım girişimlerini engellemek için sanal yama uygulayın.

    Bir [sanal yama kuralı](../user-guides/rules/vpatch-rule.md) oluşturulacaktır.

* Yanlışlıkla eklendiğini düşünüyorsanız sızıntıyı yanlış olarak işaretleyin.
* Tüm sızdırılan belirteçler yeniden oluşturulduğunda veya kaldırıldığında korumayı durdurmak için sızıntıları kapatın. Bu, sanal yama kuralını kaldıracaktır.
* Bir sızıntı kapansa bile, silinmez. Korunmayı tekrar başlatmak için yeniden açın ve ardından düzeltme uygulayın.

## Sızdırılan belirteçlerin kullanılma girişimleri

Wallarm Konsolu → **Olaylar**da, sızdırılan belirteçlerin kullanım girişimlerini görmek için **Tür** filtresini `Sanal Yama` (`vpatch`) olarak ayarlayın.

![Olaylar - vpatch aracılığıyla API sızıntıları](../images/api-attack-surface/api-leaks-in-events.png)

Şimdilik, sızdırılan belirteçlerin kullanılma girişimlerini `vpatch` uygulandıysa takip edebilirsiniz.