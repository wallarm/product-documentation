# Wallarm Cloud Devre Dışı

Wallarm Cloud devre dışıysa, Wallarm düğümleri bazı sınırlamalarla saldırıların azaltılmasına devam eder. Daha fazlasını öğrenmek için bu sorun giderme kılavuzunu kullanın.

## Wallarm Cloud devre dışıysa Wallarm düğümü nasıl çalışır?

Wallarm Cloud son derece kararlı ve ölçeklenebilir bir hizmettir. Ek olarak, şirketinizin tüm hesap verileri [yedeklemeler](#how-does-wallarm-protect-its-cloud-data-from-loss) ile korunur.

Ancak, nadir durumlarda Wallarm Cloud geçici olarak devre dışı kalırsa (örneğin bakım için duraklatıldığında), bir Wallarm düğümü bazı sınırlamalarla birlikte çalışmaya devam eder.

!!! info "Wallarm Cloud durumunun kontrol edilmesi"
    Wallarm Cloud durumunu kontrol etmek için [status.wallarm.com](https://status.wallarm.com/) adresini ziyaret edin. Haberdar olmak için güncellemelere abone olun.

Çalışmaya devam edenler:

* Cloud ile düğüm arasındaki son başarılı [senkronizasyon](../admin-en/configure-cloud-node-synchronization-en.md) sırasında düğüme yüklenen kuralları kullanarak yapılandırılmış [mode](../admin-en/configure-wallarm-mode.md#available-filtration-modes) içinde trafiğin işlenmesi. Aşağıdaki öğelerin en son sürümleri programa göre Cloud’dan düğüme yüklenip düğüm üzerinde yerel olarak saklandığından düğüm çalışmayı sürdürebilir:

    * [Özel kural seti](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)

* [IP lists](../user-guides/ip-lists/overview.md) de düğüme yüklenir ve onun içinde saklanır. Yüklenen adresler yalnızca son kullanma tarih/saatine kadar işlenmeye devam eder.

    Bu tarih/saatler Cloud geri yüklenip senkronize edilene kadar güncellenmeyecektir; ayrıca Cloud geri yüklenip senkronize edilene kadar yeni adres ekleme/kaldırma da olmayacaktır.

    Listelerdeki bazı IP adreslerinin süresinin dolması, bu adreslerle ilişkili [brute force saldırıları](../admin-en/configuration-guides/protecting-against-bruteforce.md) için korumanın durmasına yol açar.

* Cloud’dan düğüme yapılan son başarılı yükleme sırasında düğüme yüklenen spesifikasyonlar kullanılarak [API Specification Enforcement](../api-specification-enforcement/overview.md).

Çalışmayı durduranlar:

* [API Attack Surface Management (AASM)](../api-attack-surface/overview.md).
* [Credential Stuffing Detection](../about-wallarm/credential-stuffing.md).
* [API Abuse Prevention](../api-abuse-prevention/overview.md).
* Düğüm, tespit edilen saldırılar ve güvenlik açıklarına ilişkin verileri toplar ancak bunları Cloud’a gönderemez. Düğümünüzün [postanalytics module](../admin-en/installation-postanalytics-en.md) bileşeninde, toplanan verilerin Cloud’a gönderilmeden önce geçici olarak saklandığı bellek içi bir depolama (wstore) bulunur. Cloud geri geldiğinde, arabelleğe alınan veriler ona gönderilir.

    !!! warning "Düğümün bellek içi depolama sınırı"
        Arabellek boyutu [sınırlıdır](../admin-en/configuration-guides/allocate-resources-for-node.md#wstore) ve aşıldığında eski veriler silinir. Bu nedenle Cloud’un devre dışı kaldığı süre ve bu süre zarfında toplanan bilgi miktarı, Cloud geri geldikten sonra Wallarm Console içinde yalnızca bazı verileri görmenize yol açabilir.

* Düğüm, işlenen trafik için [metrikleri](../admin-en/configure-statistics-service.md) toplar ancak Cloud’a gönderemez.
* [API Sessions](../api-sessions/overview.md) - Cloud devre dışıyken gerçekleşen meşru isteklerle ilgili tüm bilgiler kaybolur; saldırılarla ilgili bilgiler (Cloud geri geldikten sonra Cloud’a yüklenerek) sunulacaktır.
* [Triggers](../user-guides/triggers/triggers.md) çalışmayı durdurur ve dolayısıyla:
    * [IP lists](../user-guides/ip-lists/overview.md) güncellenmeyi durdurur.
    * [Trigger-based notifications](../user-guides/triggers/triggers.md) görünmez.
* [Discovering API inventory](../api-discovery/overview.md) çalışmaz.
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) durur.
* [Brute force saldırıları](../admin-en/configuration-guides/protecting-against-bruteforce.md) tespit edilmez.
* Entegrasyonlar durur; buna şunlar dahildir:
    * Anlık ve e-posta [notifications](../user-guides/settings/integrations/integrations-intro.md) görünmez.
    * Raporlama durur.
* Wallarm Console’a erişim yok.
* [Wallarm API](../api/overview.md) yanıt vermez.

Yukarıda açıklanan komple devre dışı durumun yanı sıra, bazen yalnızca belirli hizmetler geçici olarak erişilemez olabilirken diğerleri çalışmaya devam edebilir. Bu durumdaysa, [status.wallarm.com](https://status.wallarm.com/) hizmeti size ilgili bilgiyi sağlayacaktır.

## Cloud geri geldikten sonra ne olur?

Cloud geri geldikten sonra:

* Wallarm Console’a erişim geri gelir.
* Düğüm, arabelleğe alınan bilgileri Cloud’a gönderir (yukarıdaki sınırlamaları dikkate alın).
* Triggers yeni verilere tepki vererek bildirimler gönderir ve IP’leri günceller.
* IP’lerde herhangi bir değişiklik varsa, bir sonraki senkronizasyon sırasında düğüme gönderilir.
* [tamamlanmamış özel kural seti](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down) oluşturma işlemi varsa, yeniden başlatılır.
* Cloud ile filtreleme düğümü, planlandığı şekilde normal biçimde senkronize olur.

## Wallarm Cloud devre dışı kalmadan önce Wallarm Console’da kaydedilen ayarları düğümün alamadığı bir durum olabilir mi?

Evet, bu mümkündür. Örneğin, [senkronizasyon](../admin-en/configure-cloud-node-synchronization-en.md) aralığının 3 dakika olduğunu ve:

1. Özel kural setinin son derlemesinin Cloud üzerinde 21 dakika önce tamamlandığını ve düğüme 20 dakika önce yüklendiğini.
2. Sonraki 6 senkronizasyon sırasında Cloud’dan hiçbir şey alınmadığını çünkü yeni bir şey olmadığını.
3. Daha sonra Cloud üzerinde kuralların değiştirildiğini ve yeni bir derlemenin başladığını - derlemenin tamamlanması 4 dakika sürdü ancak 2 dakika içinde Cloud devre dışı kaldı.
4. Bir düğüm yalnızca tamamlanmış derlemeyi alır, dolayısıyla 2 dakika boyunca yapılan senkronizasyonlarda düğüme yüklenecek bir şey olmayacaktır.
5. 1 dakika sonra, düğüm yeni bir senkronizasyon isteğiyle gelir ancak Cloud yanıt vermez.
6. Düğüm, 24 dakikalık bir geçmişe sahip özel kural setine göre filtrelemeye devam eder ve Cloud devre dışıyken bu süre artar.

## Wallarm, Cloud verilerini kayıptan nasıl korur?

Wallarm Cloud, Wallarm Console’da bir kullanıcı tarafından sağlanan ve düğümlerden kendisine yüklenen **tüm verileri** saklar. Yukarıda belirtildiği gibi, Wallarm Cloud’un geçici olarak devre dışı kalması son derece nadir bir durumdur. Ancak bu gerçekleşirse, devre dışı kalma durumunun kaydedilmiş verileri etkileme olasılığı oldukça düşüktür. Bu, geri yüklemeden hemen sonra tüm verilerinizle çalışmaya anında devam edeceğiniz anlamına gelir.

Wallarm Cloud’un gerçek verilerini depolayan sabit disklerin yok edildiği düşük olasılıkla başa çıkmak için Wallarm otomatik olarak yedeklemeler oluşturur ve gerekirse bunlardan geri yükler:

* RPO: yedekleme her 24 saatte bir oluşturulur
* RTO: sistem en fazla 48 saat içinde tekrar kullanılabilir hale gelir
* En son 14 yedekleme saklanır

!!! info "RPO/RTO koruma ve erişilebilirlik parametreleri"
    * **RPO (recovery point objective)**, veri yedekleme sıklığını belirlemek için kullanılır: verilerin kaybolabileceği en fazla süreyi tanımlar.
    * **RTO (recovery time objective)**, bir işletmenin, kesintiyle ilişkili tolere edilemez sonuçlardan kaçınmak için bir felaket sonrası kabul edilebilir hizmet seviyesinde süreçlerini geri yüklemek zorunda olduğu gerçek zaman miktarıdır.

Wallarm olağanüstü durum kurtarma (DR) planı ve şirketinize özgü özellikleri hakkında daha fazla bilgi için [Wallarm desteğiyle iletişime geçin](mailto:support@wallarm.com).