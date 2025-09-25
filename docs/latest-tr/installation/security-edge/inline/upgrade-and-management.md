# Security Edge Inline'ı Yönetme <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

[Security Edge Inline](overview.md) dağıtımınızı Wallarm Console üzerinden yapılandırma ayarlarını güncelleyerek, Node sürümlerini yükselterek, durumu izleyerek ve dağıtımı silerek yönetin.

## Durumlar

Edge Node bölümü, origin'leriniz, hostlarınız ve bölgeleriniz için dağıtım ve yapılandırma durumuna ilişkin gerçek zamanlı durumlar sağlar:

=== "Hostlar"
    ![!](../../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origin'ler"
    ![!](../../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Bölgeler"
    ![!](../../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "Düğümler"
    **Nodes** sekmesi her bir Edge Node için teknik ayrıntılar sağlar. Bu görünüm öncelikle sorun gidermede yardımcı olması için Wallarm Support içindir. Node sayısı trafik talebine bağlıdır ve Wallarm'ın otomatik ölçeklendirmesi tarafından otomatik olarak yönetilir.

    ![!](../../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**: Sertifika verilmesi için (uygunsa) DNS'e [sertifika CNAME kayıtlarının](deployment.md#5-certificate-cname-configuration) eklenmesi bekleniyor.
* **Pending traffic CNAME** veya **Pending traffic A record**: Dağıtım tamamlandı, trafiği Edge Node'a yönlendirmek için [trafik CNAME veya A kaydının](deployment.md#6-routing-traffic-to-the-edge-node) eklenmesi bekleniyor.
* **Deploying**: Edge Node şu anda kuruluyor ve yakında kullanıma hazır olacak.
* **Active**: Edge Node tamamen çalışır durumda ve yapılandırıldığı şekilde trafiği filtreliyor.
* **Cert CNAME error**: DNS'te [sertifika CNAME](deployment.md#5-certificate-cname-configuration) doğrulanırken bir sorun oluştu. Lütfen CNAME'in doğru yapılandırıldığını kontrol edin (uygunsa).
* **Deployment failed**: Edge Node dağıtımı başarısız oldu; örn. sertifika CNAME'in 14 gün içinde eklenmemesi nedeniyle. Yapılandırma ayarlarını kontrol edin ve yeniden dağıtmayı deneyin veya yardım almak için [Wallarm Support ekibi](https://support.wallarm.com) ile iletişime geçin.
* **Degraded**: Edge Node bölgede aktif ancak sınırlı işlevselliğe sahip olabilir veya küçük sorunlar yaşıyor olabilir. Yardım almak için lütfen [Wallarm Support ekibi](https://support.wallarm.com) ile iletişime geçin.

Hostlar ve origin'ler başına RPS ve istek sayısı [sürüm](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer) 5.3.0'dan itibaren döndürülür.

## Edge Inline'ı Yükseltme

**Admin settings** içinde **Auto update** etkinleştirildiğinde, Edge Node, yeni bir minor veya patch sürümü yayınlandığında (seçilen seçeneğe bağlı olarak) otomatik olarak yükseltilir. Tüm başlangıç ayarlarınız korunur. Auto update varsayılan olarak kapalıdır.

![!](../../../images/waf-installation/security-edge/inline/admin-settings.png)

Edge Node'u manuel olarak yükseltmek için **Configure** → **Admin settings** bölümüne gidin ve listeden bir sürüm seçin. En iyi performans ve güvenlik için en son sürümün kullanılması önerilir.

Yeni bir major sürüme yükseltme yalnızca manuel olarak yapılabilir.

Sürümlerin değişiklik günlüğü için [makaleye](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer) bakın. Edge Node sürümü, bağlı makaledeki aynı sürüme karşılık gelen `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` biçimini izler. Edge Node sürümündeki build numarası küçük değişiklikleri belirtir.

## Edge Inline'ı Silme

Edge dağıtımınızı silmek için **Configure** → **Admin settings** → **Delete inline**'a tıklayın.

Nodes'ları silip yeniden oluşturmayı planlıyorsanız, [mevcut dağıtımın ayarlarını](deployment.md) ayarlayabilirsiniz; Nodes güncellenmiş yapılandırmayla yeniden dağıtılacaktır.

Aboneliğinizin süresi dolarsa, Edge Node 14 gün sonra otomatik olarak silinir.