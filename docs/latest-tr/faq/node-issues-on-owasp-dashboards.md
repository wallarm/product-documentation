# OWASP Gösterge Panelinde Bildirilen Wallarm düğüm sorunlarını ele alma

Wallarm düğümleri güncellenmediğinde veya Cloud ile senkronizasyon sorunları yaşadığında, [OWASP dashboard](../user-guides/dashboards/owasp-api-top-ten.md) üzerinde, altyapı güvenliğini etkileyebilecek sorunları belirten hata mesajları görünür. Bu makale, bu sorunların nasıl ele alınacağını anlatmaktadır.

Güncel olmayan düğümler, kötü niyetli trafiğin savunmaları aşmasına neden olabilecek önemli güvenlik güncellemelerinden yoksun olabilir. Senkronizasyon sorunları, düğümlerin işlevselliğini aksatarak, Cloud'dan hayati güvenlik politikalarının alınmasını engelleyebilir. Bu sorunlar, uygulama yığını içerisindeki herhangi bir parçada eksik olan güvenlik çözümleri sistemin savunmasız hale gelmesine neden olabileceğinden, esas olarak **OWASP API7 (Güvenlik Yanlış Yapılandırması)** tehdidi ile ilişkilidir. Bunu önlemek için, gösterge paneli düğüm işletim sorunlarına karşı sizi uyarır, örneğin:

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

Güvenli bir ortamı sürdürmek için, Wallarm düğümlerinin düzenli olarak güncellenmesi ve senkronizasyon problemlerinin giderilmesi hayati önem taşır. İşte hata mesajlarıyla nasıl başa çıkılacağına dair talimatlar:

1. Wallarm düğümünüzün sürümü [kullanım ömrünün sonuna yaklaşmış veya sona ermişse](../updating-migrating/versioning-policy.md#version-list), düğümünüzü en son sürüme yükseltmeniz önerilir.
2. Wallarm Cloud senkronizasyonuyla ilgili sorunlarla karşılaşırsanız, [ilgili ayarların](../admin-en/configure-cloud-node-synchronization-en.md) doğru olduğundan emin olun.

Senkronizasyon veya diğer sorunların çözümünde veya başka herhangi bir konuda yardıma ihtiyacınız olursa, [Wallarm destek ekibi](mailto:support@wallarm.com)'nden yardım alabilirsiniz. Analiz için aşağıdaki [logları](../admin-en/configure-logging.md) sağlayın:

* `/opt/wallarm/var/log/wallarm/wcli-out.log` dosyasındaki loglar, `syncnode` betiğinde herhangi bir sorun olup olmadığını kontrol etmek için
* Senkronizasyon sorunu hakkında ek detaylar sağlayacak şekilde, dağıtım seçeneğine bağlı olarak `/var/log/syslog` veya `/var/log/messages` dizinindeki loglar