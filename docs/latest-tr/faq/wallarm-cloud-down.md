# Wallarm Cloud kapalı

Eğer Wallarm Cloud kapalıysa, Wallarm düğümleri bazı sınırlamalarla saldırı önleme işlemlerine devam eder. Detaylı bilgi için bu sorun giderme kılavuzunu kullanın.

## Wallarm Cloud kapalıyken Wallarm düğümü nasıl çalışır?

Wallarm Cloud son derece kararlı ve ölçeklenebilir bir hizmettir. Ayrıca, şirketinizin hesap verileri [yedeklemeler](#how-does-wallarm-protect-its-cloud-data-from-loss) ile korunmaktadır.

Ancak, nadir durumlarda Wallarm Cloud geçici olarak kapanır (örneğin, bakım amacıyla duraklatıldığında) ve Wallarm düğümü bazı sınırlamalarla çalışmaya devam eder.

!!! info "Wallarm Cloud durumunu kontrol etme"
    Wallarm Cloud durumunu kontrol etmek için [status.wallarm.com](https://status.wallarm.com/) adresini ziyaret edin. Sorunlardan haberdar olmak için güncellemeleri takip edin.

Çalışmaya devam edenler:

* Düğüm, Cloud ile düğüm arasında gerçekleştirilen son başarılı [senkronizasyon](../admin-en/configure-cloud-node-synchronization-en.md) sırasında düğüme yüklenen kurallar kullanılarak yapılandırılmış [mod](../admin-en/configure-wallarm-mode.md#available-filtration-modes) kapsamında trafiği işlemeye devam eder. Düğüm, Cloud’dan zaman çizelgesine göre yüklenen ve yerel olarak düğümde depolanan aşağıdaki öğelerin en güncel versiyonları sayesinde çalışmaya devam edebilir:

    * [Özel kural seti](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* [IP lists](../user-guides/ip-lists/overview.md) de düğüme yüklenir ve içerisinde depolanır. Yüklenen adresler, ancak geçerlilik tarihi/saatine kadar işlem görmeye devam edecektir.

    Bu tarih/saat bilgileri, Cloud yeniden etkinleştirilip senkronize edilene kadar güncellenmeyecektir; ayrıca Cloud yeniden etkinleştirme/senkronizasyonu gerçekleşene kadar yeni veya silinen adresler olmayacaktır.

    Listelerdeki bazı IP adreslerinin süresinin dolması, bu adreslerle ilişkili [brute force saldırılara](../admin-en/configuration-guides/protecting-against-bruteforce.md) karşı korumanın sona ermesine yol açar.

Çalışmayı durduranlar:

* Düğüm, tespit edilen saldırı ve güvenlik açıklarına ilişkin verileri toplar ancak bu verileri Cloud'a gönderemez. Düğümünüzün [postanalytics modülünün](../admin-en/installation-postanalytics-en.md) topladığı veriler, Cloud’a gönderilmeden önce geçici olarak bellek içi depolamada (Tarantool) saklanır. Cloud yeniden etkinleştirilir etmez, tamponlanmış veriler Cloud’a gönderilecektir.

    !!! warning "Düğüm bellek içi depolama sınırlaması"
        Tampon boyutu [sınırlıdır](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) ve bu sınır aşıldığında eski veriler silinir. Bu nedenle, Cloud’ın kapalı kaldığı süre ve bu süre içinde toplanan bilgi miktarı, Cloud yeniden etkinleştirildikten sonra Wallarm Console’da yalnızca kısmi veriler görmenize sebep olabilir.

* Düğüm, işlenen trafik için [metrics](../admin-en/monitoring/intro.md) toplayabilir fakat bunları Cloud’a gönderemez.
* Açığa çıkan [varlıklar](../user-guides/scanner.md) ve [tipik güvenlik açıkları](../user-guides/vulnerabilities.md) için tarama duracaktır.
* [Triggers](../user-guides/triggers/triggers.md) çalışmayı durdurur ve bu nedenle:
    * [IP lists](../user-guides/ip-lists/overview.md) güncellenmeyecektir.
    * [Trigger tabanlı bildirimler](../user-guides/triggers/triggers.md) görünmeyecektir.
* [Discovering API inventory](../api-discovery/overview.md) çalışmayacaktır.
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) duracaktır.
* [Brute force attacks](../admin-en/configuration-guides/protecting-against-bruteforce.md) tespit edilmeyecektir.
* Entegrasyonlar duracaktır, buna dahil:
    * Anlık ve e-posta [bildirimleri](../user-guides/settings/integrations/integrations-intro.md) görünmeyecektir.
    * Raporlama duracaktır.
* Wallarm Console erişimi olmayacaktır.
* [Wallarm API](../api/overview.md) yanıt vermeyecektir.

Yukarıda açıklanan tüm sistem kapanmasının yanı sıra, bazen yalnızca belirli hizmetlere geçici olarak erişilemeyebilirken diğerleri çalışmaya devam edebilir. Durum böyle ise, [status.wallarm.com](https://status.wallarm.com/) hizmeti ilgili bilgiyi sağlayacaktır.

## Cloud yeniden etkinleştirildikten sonra ne olur?

* Wallarm Console erişimi yeniden sağlanır.
* Düğüm, tamponlanmış bilgiyi Cloud’a gönderir (yukarıdaki sınırlamaları göz önünde bulundurun).
* Triggers, yeni veriye tepki olarak bildirim gönderir ve IP’leri günceller.
* IP’lerde herhangi bir değişiklik varsa, bunlar bir sonraki senkronizasyon sırasında düğüme gönderilir.
* Tamamlanmamış bir [özel kural seti](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down) derlemesi varsa, yeniden başlatılır.
* Cloud ve filtreleme düğümü, normal şekilde zaman çizelgesine göre senkronize olmaya devam eder.

## Wallarm Cloud kapalı olmadan önce Wallarm Console'da kaydedilen ayarların düğüme ulaşmadığı bir durum olabilir mi?

Evet, bu mümkündür. Örneğin, [senkronizasyon](../admin-en/configure-cloud-node-synchronization-en.md) aralığının 3 dakika olduğunu varsayalım ve:

1. Özel kural setinin son derlemesi Cloud üzerinde 21 dakika önce tamamlanmış ve 20 dakika önce düğüme yüklenmiştir.
2. Sonraki 6 senkronizasyon sırasında, yeni bir şey olmadığı için Cloud’dan hiç veri alınmamıştır.
3. Ardından Cloud üzerinde kurallar değiştirildi ve yeni bir derleme başlatıldı – derlemenin tamamlanması 4 dakika sürmesi gerekirken, 2 dakika sonra Cloud kapandı.
4. Düğüm yalnızca tamamlanmış derlemeyi alır; bu nedenle 2 dakikalık senkronizasyonlarda düğüme yüklenecek hiçbir veri olmayacaktır.
5. Bir dakika sonra, düğüm yeni senkronizasyon isteğiyle gelir ancak Cloud yanıt vermez.
6. Düğüm, 24 dakika eskimiş özel kural setine göre filtrelemeye devam eder ve bu süre, Cloud kapalı kaldıkça artmaya devam eder.

## Wallarm Cloud verilerini kayıptan nasıl korur?

Wallarm Cloud, Wallarm Console üzerinden bir kullanıcı tarafından sağlanan ve düğümlerden yüklenen **tüm verileri** saklar. Yukarıda belirtildiği gibi, Wallarm Cloud'un geçici olarak kapanması son derece nadir bir durumdur. Ancak böyle bir durum gerçekleşirse, saklı verilerin etkilenme olasılığı oldukça düşüktür. Bu da, yeniden etkinleştirildikten sonra tüm verilerinizle çalışmaya hemen devam edeceğiniz anlamına gelir.

Wallarm Cloud'un verilerini depolayan sabit disklerin yok edilme olasılığına karşı, Wallarm otomatik olarak yedeklemeler oluşturur ve gerekirse bunlardan geri yükleme yapar:

* RPO: Yedekleme her 24 saatte bir oluşturulur
* RTO: Sistem, en fazla 48 saat içerisinde yeniden kullanılabilir hale gelir
* Son 14 yedek saklanır

!!! info "RPO/RTO koruma ve erişilebilirlik parametreleri"
    * **RPO (recovery point objective)**, veri yedeklemesinin sıklığını belirlemek için kullanılır: verilerin kaybedilebileceği maksimum süreyi tanımlar.
    * **RTO (recovery time objective)**, bir felaket sonrası iş süreçlerini kabul edilebilir bir hizmet seviyesinde geri yüklemek için işletmenin sahip olduğu gerçek zaman miktarıdır; böylece yaşanabilecek tolere edilemez kesintilerin önüne geçilir.

Wallarm felaketten kurtarma (DR) planı ve şirketiniz için olan özellikleri hakkında daha fazla bilgi edinmek için [Wallarm support](mailto:support@wallarm.com) ile iletişime geçin.