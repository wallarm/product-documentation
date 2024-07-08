# Wallarm Bulutu Çalışmıyor

Wallarm Bulutu çalışmıyor olsa bile, Wallarm düğümleri bazı kısıtlamalarla saldırı önleme işlemlerine devam eder. Daha fazla bilgi için bu sorun giderme kılavuzunu kullanın.

## Wallarm Bulutu çalışmadığında Wallarm düğümü nasıl çalışır?

Wallarm Bulutu, son derece kararlı ve ölçeklenebilir bir hizmettir. Ek olarak, şirketinizin tüm hesap verileri [yedeklemeler](#how-does-wallarm-protect-its-cloud-data-from-loss) tarafından korunmaktadır.

Ancak, nadir durumlarda Wallarm Bulutu geçici olarak durursa (örneğin, bakım için duraklatıldığında), bir Wallarm düğümü bazı kısıtlamalarla işlemeye devam eder.

!!! bilgi "Wallarm Bulut durumunu kontrol etme"
    Wallarm Bulut durumunu kontrol etmek için, [status.wallarm.com](https://status.wallarm.com/) adresini ziyaret edin. Bilgilendirilmek için güncelleme abonelikleri oluşturun.

Devam eden işlemler:

* Düğüm ile Bulut arasında son başarılı [senkronizasyon](../admin-en/configure-wallarm-mode.md#available-filtration-modes) sırasında düğüme yüklenen kuralları kullanarak yapılandırılan [modda](../admin-en/configure-cloud-node-synchronization-en.md) trafik işlemi. Düğümün devam etmesiyle, aşağıdaki unsurların en son sürümleri programlanmış zamanda Bulut'tan yüklenir ve düğümde yerel olarak saklanır:

    * [Özel kural seti](../user-guides/rules/rules.md)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* [IP listeleri](../user-guides/ip-lists/overview.md) de düğüme yüklenir ve içinde saklanır. Yüklenen adresler geçerlilik süresi/dakikası sona erene kadar işlenecektir.

    Bu tarihler/saatler, Bulut'un kurtarıldığı ve senkronizasyon sağlandığı zamana kadar güncellenmeyecektir; ayrıca yeni/kaldırılan adresler de Bulut'un kurtarılması/senkronizasyonu tamamlanana kadar olmayacaktır.

    Listedeki bazı IP adreslerinin süresinin dolması, bu adreslerle ilgili [kaba kuvvet saldırılarına](../admin-en/configuration-guides/protecting-against-bruteforce.md) karşı korumanın sona ermesine neden olur.

Çalışmayı durduranlar:

* Düğüm, tespit edilen saldırılar ve güvenlik açıkları hakkındaki verileri toplar ancak Bulut'a gönderemez. [postanalytics modülü](../admin-en/installation-postanalytics-en.md) bulunan düğümünüzün, toplanan verilerin Bulut'a gönderilmesinden önce geçici olarak saklandığı bir bellek içi saklama alanı (Tarantool) olduğunu unutmayın. Bulut kurtarıldığında, tamponlanmış veri Bulut'a gönderilir.

    !!! uyarı "Düğümün bellek içi depolama sınırlaması"
        Tampon boyutu [kısıtlıdır](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) ve aşıldığında, eski veriler silinir. Bu nedenle, Bulut'un kapalı olduğu süre ve bu süre boyunca toplanan bilgiler miktarı, Bulut'un kurtarılmasının ardından Wallarm Console'unda yalnızca bazı verileri almanıza neden olabilir.

* Düğüm, işlenen trafikle ilgili [metrikleri](../admin-en/monitoring/intro.md) toplar ancak Bulut'a gönderemez.
* [Maruz kalan varlıklar](../user-guides/scanner.md) ve [tipik güvenlik açıklıkları](../user-guides/vulnerabilities.md) için tarama durur.
* [Tetikleyiciler](../user-guides/triggers/triggers.md) çalışmayı durdurur ve dolayısıyla:
    * [IP listeleri](../user-guides/ip-lists/overview.md) güncellenmez.
    * [Tetikleyiciye bağlı bildirimler](../user-guides/triggers/triggers.md) çıkmaz.
* [API envanterini keşfetme](../api-discovery/overview.md) işlemi çalışmayı durdurur.
* [Aktif tehdit doğrulama](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) durur.
* [Kaba kuvvet saldırıları](../admin-en/configuration-guides/protecting-against-bruteforce.md) tespit edilmez.
* Entegrasyonlar durdurulur, aşağıdakiler dahil:
    * Anlık ve e-posta [bildirimleri](../user-guides/settings/integrations/integrations-intro.md) çıkmaz.
    * Raporlama durur.
* Wallarm Console’ye erişim yok.
* [Wallarm API](../api/overview.md) yanıt vermez.

Yukarıda açıklanan tam kapalı durum dışında, bazen yalnızca belirli servisler geçici olarak erişilemez olabilirken diğerleri işlemeye devam eder. Bu durumda, [status.wallarm.com](https://status.wallarm.com/) hizmeti size ilgili bilgileri sağlayacaktır.

## Bulut kurtarma sonrası ne olur?

Bulut kurtarma sonrası:

* Wallarm Console'a erişim geri yüklenir.
* Düğüm, tamponlanmış bilgileri Bulut'a gönderir (yukarıdaki sınırlamaları dikkate alın).
* Tetikleyiciler, yeni verilere bildirim göndererek ve IP'leri güncelleyerek tepki verir.
* Eğer IP'lerde herhangi bir değişiklik varsa, bu, bir sonraki senkronizasyon sırasında düğüme gönderilir.
* Eğer bitmemiş bir [özel kural seti](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down) oluşturulmuşsa, bu yeniden başlatılır.
* Bulut ve filtreleme düğümü, genellikle olduğu gibi bir programda senkronize olur.

## Wallarm Bulutu kapalıyken düğümün Wallarm Console'da kaydedilen ayarları alamadığı bir durum var mı?

Evet, bu mümkün. Örneğin, [senkronizasyon](../admin-en/configure-cloud-node-synchronization-en.md) aralığının 3 dakika olduğunu ve:

1. Özel kural setinin son inşası Bulut üzerinde 21 dakika önce tamamlandı ve 20 dakika önce düğüme yüklendi.
2. Sonraki 6 senkronizasyonda Bulut'tan hiçbir şey alınmadı çünkü yeni bir şey yoktu.
3. Daha sonra kurallar Bulut'ta değiştirildi ve yeni bir inşa başladı - inşanın tamamlanması 4 dakika sürdü ancak 2 dakika sonra Bulut kapandı.
4. Bir düğüm yalnızca tamamlanan inşayı alır, bu yüzden 2 dakika içindeki senkronizasyonlar düğüme yüklenecek bir şey vermez.
5. 1 dakika daha geçtikten sonra, düğüm yeni bir senkronizasyon talebiyle gelir ancak Bulut yanıt vermez.
6. Düğüm, 24 dakika önceki özel kural setine göre filtrelemeye devam eder ve bu yaş artar ve Bulut kapalıyken artmaya devam eder.

## Wallarm Bulut verilerini kayıptan nasıl korur?

Wallarm Bulutu, bir kullanıcının Wallarm Console`da sağladığı ve düğümlerden yüklenen **tüm verileri** kaydeder. Yukarıda belirtildiği gibi, Wallarm Bulut'unun geçici olarak durması son derece nadir bir durumdur. Ancak, bu durum gerçekleşirse, durumun kaydedilen verileri etkileme olasılığı önemli ölçüde düşüktür. Bu da, kurtarma sonrası tüm verilerinizle hemen çalışmaya devam edeceğiniz anlamına gelir.

Wallarm Bulut'un gerçek verilerini saklayan sabit disklerin yok olma şansı düşük bir durumla başa çıkmak için, Wallarm otomatik olarak yedeklemeler oluşturur ve gerektiğinde bunları geri yükler:

* RPO: yedekleme her 24 saatte bir oluşturulur
* RTO: sistem en fazla 48 saat sonra tekrar kullanılabilir olacaktır.
* 14 güncel yedekleme saklanır

!!! bilgi "RPO/RTO koruma ve kullanılabilirlik parametreleri"
    * **RPO (geri dönüş noktası objektifi)**, veri yedekleme sıklığının belirlenmesi için kullanılır: verilerin kaybolabileceği maksimum süreyi tanımlar.
    * **RTO (geri dönüş süresi objektifi)**, bir felaketi önlemek için kabul edilebilir hizmet düzeyinde süreçleri geri yüklemek için bir işletmenin gerçek zamanıdır.

Wallarm felaket kurtarma (DR) planı ve şirketiniz için özellikleri hakkında daha fazla bilgi için, [Wallarm destek servisiyle](mailto:support@wallarm.com) iletişime geçin.