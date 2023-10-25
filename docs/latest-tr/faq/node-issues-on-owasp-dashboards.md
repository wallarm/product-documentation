# OWASP panoları tarafından uyarılan Wallarm düğüm sorunlarına nasıl yanıt verilir

Wallarm düğümleri güncellenmezse veya Bulut ile senkronizasyon sorunlarıyla karşılaşırsa, [OWASP panoları](../user-guides/dashboards/owasp-api-top-ten.md) üzerinde altyapı güvenliğini etkileyebilecek sorunları gösteren hata mesajları görünür. Bu makale, bu sorunlara nasıl yanıt verileceğini açıklar.

Güncellenmeyen düğümler, önemli güvenlik güncellemelerinden yoksun olabilir, kötü niyetli trafiğin savunmaları atlatmasına izin verebilir. Senkronizasyon sorunları, düğümlerin Bulut'tan hayati güvenlik politikalarını almasını engelleyebilir. Bu sorunlar, çoğunlukla **OWASP API7 (Güvenlik Yapılandırma Hatası)** tehdidi ile ilgilidir; uygulama yığınının herhangi bir parçasında eksik güvenlik çözümü, sistemi savunmasız hale getirebilir. Bunu önlemek için, pano size düğüm işletim sorunları hakkında uyarır, örneğin:

![Node sorunlarıyla OWASP pano](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

Güvenli bir ortamı sürdürmek için, düzenli olarak Wallarm düğümlerini güncellemek ve senkronizasyon sorunlarına yanıt vermek çok önemlidir. İşte hata mesajlarını nasıl ele alacağınıza dair talimatlar:

1. Wallarm düğüm sürümünüz [ömür sonuna yaklaşıyorsa](../updating-migrating/versioning-policy.md#version-list), düğümünüzü en son sürüme yükseltmeniz önerilir.
1. Wallarm Cloud senkronizasyonunda sorunlarla karşılaşırsanız, [ilgili ayarların](../admin-en/configure-cloud-node-synchronization-en.md) doğru olduğundan emin olun.

Senkronizasyon veya diğer sorunların çözümünde veya başka herhangi bir talepte yardıma ihtiyacınız varsa, [Wallarm destek ekibi](mailto:support@wallarm.com)nden yardım alabilirsiniz. Onlara aşağıdaki [kayıtları](../admin-en/configure-logging.md) analiz için sunun:

* `syncnode` betiği ile ilgili sorunları kontrol etmek için `/var/log/wallarm/syncnode.log`'dan kayıtlar
* Senkronizasyon sorunu hakkında ek bilgiler sağlamak için `/var/log/syslog` veya `/var/log/messages` dizininden (dağıtım seçeneğine bağlı olarak) kayıtlar