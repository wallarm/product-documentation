# Wallarm Sorun Giderme

Bu bölüm, Wallarm ile ilgili en yaygın sorun giderme durumlarını açıklar, olası sorunlara yönelik çözümler ve bunları araştırıp çözmek için kullanabileceğiniz araçlar hakkında bilgi sağlar.

## Araçlar

Wallarm ile çalışırken bir sorun yaşarsanız, elinizdeki araçlar şunlardır:

* İşlerin nasıl çalıştığının mantığını açıklayan bu dokümantasyon
* Dokümantasyondaki bu **Sorun Giderme** bölümü

    !!! info "Dokümantasyon nasıl kullanılır"
        Aramayı kullanın, AI botuna sorun, sol menüdeki konulara göz atın.

* Wallarm [hizmet durum sayfası](#wallarm-service-status-page)
* Wallarm [filtreleme düğümü günlükleri](../admin-en/configure-logging.md)
* Wallarm [filtreleme düğümü istatistikleri](../admin-en/configure-statistics-service.md)
* Wallarm [API](../api/overview.md)

## Wallarm hizmet durum sayfası

Wallarm durum sayfası https://status.wallarm.com, her [Wallarm Cloud](../about-wallarm/overview.md#how-wallarm-works) için Wallarm Console ve Wallarm API hizmetlerinin erişilebilirliğine ilişkin anlık ve geçmiş verileri görüntüler:

![Wallarm durum sayfası](../images/status-page.png)

### Durumlar

* **Düşük performans**, hizmetin çalıştığı ancak yavaş olduğu veya başka şekilde küçük ölçekte etkilendiği anlamına gelir.
* **Kısmi kesinti**, bazı müşteriler için hizmetlerin tamamen çalışmadığı anlamına gelir.
* **Büyük çaplı kesinti**, hizmetlerin tamamen kullanılamaz olduğu anlamına gelir.

### Bildirimler

Evet, güncellemelere aboneyseniz. Abone olmak için lütfen **SUBSCRIBE TO UPDATES** öğesine tıklayın ve abonelik kanalını seçin:

* **Email**: Wallarm bir olayı oluşturduğunda, güncellediğinde veya çözdüğünde bildirim almak için.
* **SMS**: Wallarm bir olayı oluşturduğunda veya çözdüğünde bildirim almak için.
* **Slack**: Olay güncellemelerini ve bakım durumu mesajlarını almak için.
* **Webhook**: Wallarm bir olayı oluşturduğunda, bir olayı güncellediğinde, bir olayı çözdüğünde veya bir hizmet durumunu değiştirdiğinde bildirim almak için.

### Olayların otomatik oluşturulması

Hizmetlerde kesinti yaşandığında olaylar oluşturulur. Kesintiyle ilgili bir etkinlik sırasında, sorunu, bu konuda ne yaptığımızı ve sorunun ne zaman düzeltileceğini beklediğimizi açıklayan bir sayfa ekleriz.

Zaman ilerledikçe olayın nedeni belirlenir, belirlenen olay düzeltilir ve olay durumu mevcut durumu yansıtacak şekilde güncellenir.