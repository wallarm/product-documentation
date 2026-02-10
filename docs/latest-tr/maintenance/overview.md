# Bakım

Bu bölüm, Wallarm dağıtımınızın bakımı, izlenmesi ve yükseltilmesi konusunda kapsamlı bir rehberlik sağlayarak optimum performans ve güvenlik sağlar.

## Dahil Olan İçerik

* **Düğümler ve Altyapı**
    * [Düğüm Genel Bakış](../user-guides/nodes/nodes.md) - Wallarm düğümlerini yönetme ve izleme
    * [Kaynak Tahsisi](../admin-en/configuration-guides/allocate-resources-for-node.md) - CPU ve bellek kaynaklarını yapılandırma
    * [Bulut Senkronizasyonu](../admin-en/configure-cloud-node-synchronization-en.md) - Wallarm Cloud ile düğüm senkronizasyonunu yapılandırma
    * [Proxy Yapılandırması](../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md) - Wallarm API erişimi için proxy kurulumu
    * [Engelleme Sayfası Yapılandırması](../admin-en/configuration-guides/configure-block-page-and-code.md) - Engelleme sayfalarını ve yanıt kodlarını özelleştirme
    * [Geçersiz Başlıkları İşleme](../admin-en/configuration-guides/handling-invalid-headers.md) - Geçersiz HTTP başlıkları için davranış yapılandırması
    * [JA3 Parmak İzi](../admin-en/enabling-ja3.md) - Gelişmiş güvenlik için TLS parmak izi alma özelliğini etkinleştirme
    * [Terraform Sağlayıcısı](../admin-en/managing/terraform-provider.md) - Wallarm altyapısını kod olarak yönetme

* **İzleme ve Metrikler**
    * **NGINX Düğüm Metrikleri**
        * [Genel Bakış](../admin-en/nginx-node-metrics.md) - NGINX düğümü metrik toplama sistemine giriş
        * [Postanalitik Metrikleri](../admin-en/wstore-metrics.md) - Postanalitik modülü metrikleri
        * [wcli Kontrolör Metrikleri](../admin-en/wcli-metrics.md) - wcli kontrolör metrikleri
        * [API Güvenlik Duvarı Metrikleri](../admin-en/apifw-metrics.md) - API güvenlik duvarı metrikleri
    * **Yerel Düğüm Metrikleri**
        * [Genel Bakış](../admin-en/native-node-metrics.md) - Yerel düğüm metrik toplama sistemine giriş
    * [İstatistik Hizmeti](../admin-en/configure-statistics-service.md) - İstatistik toplamayı yapılandırma
    * [Düğüm Günlükleme](../admin-en/configure-logging.md) - Günlük seviyelerini ve çıktıyı yapılandırma
    * [Yük Devretme Yapılandırması](../admin-en/configure-backup-en.md) - Yük devretme mekanizmalarını kurma
    * [Sağlık Kontrolü](../admin-en/uat-checklist-en.md) - Düğüm sağlığını ve işlevselliğini doğrulama

* **Yükseltmeler ve Geçiş**
    * [Sürümlendirme Politikası](../updating-migrating/versioning-policy.md) - Wallarm sürümlendirme ve destek yaşam döngüsünü anlama
    * [Genel Öneriler](../updating-migrating/general-recommendations.md) - Yükseltmeler için en iyi uygulamalar
    * [Yenilikler](../updating-migrating/what-is-new.md) - Yeni sürümler için önemli değişiklikler ve geçiş rehberi
    * **Değişiklik Günlükleri**
        * [NGINX Düğüm Değişiklik Günlüğü](../updating-migrating/node-artifact-versions.md) - NGINX tabanlı düğümler için sürüm notları
        * [Native Düğüm Değişiklik Günlüğü](../updating-migrating/native-node/node-artifact-versions.md) - Native düğümler için sürüm notları
        * [Bağlayıcı Kod Paketi](../installation/connectors/code-bundle-inventory.md) - Bağlayıcı sürüm notları
    * **NGINX Düğüm Yükseltmeleri**
        * [DEB/RPM Paketleri](../updating-migrating/nginx-modules.md)
        * [Postanalytics Modülü](../updating-migrating/separate-postanalytics.md)
        * [Hepsi Bir Arada Yükleyici](../updating-migrating/all-in-one.md)
        * [Docker İmajı](../updating-migrating/docker-container.md)
        * [Ingress Controller](../updating-migrating/ingress-controller.md)
        * [Ingress Controller Kullanımdan Kaldırma](../updating-migrating/nginx-ingress-retirement.md)
        * [Sidecar Proxy](../updating-migrating/sidecar-proxy.md)
        * [Bulut İmajı](../updating-migrating/cloud-image.md)
        * [Çok Kiracılı Düğüm](../updating-migrating/multi-tenant.md)
    * **Native Düğüm Yükseltmeleri**
        * [Hepsi Bir Arada Yükleyici](../updating-migrating/native-node/all-in-one.md)
        * [Helm Chart](../updating-migrating/native-node/helm-chart.md)
        * [Docker İmajı](../updating-migrating/native-node/docker-image.md)

* **İşlemler**
    * [İstek Hacmini Öğrenme](../admin-en/operation/learn-incoming-request-number.md) - Faturalandırma ve kapasite planlaması için API istek hacmini belirleme
    * [Tarayıcı IP Adresleri](../admin-en/scanner-addresses.md) - İzin listesi için Wallarm tarayıcı IP adresleri

* **Sorun Giderme**
    * [Genel Bakış](../troubleshooting/overview.md) - Genel sorun giderme rehberliği
    * [Tespit ve Engelleme](../troubleshooting/detection-and-blocking.md) - Saldırı tespit sorunlarını giderme
    * [Tespit Araçları](../troubleshooting/detection-tools-tuning.md) - Tespit mekanizmalarını ince ayarlama
    * [Performans](../troubleshooting/performance.md) - Performans sorunlarını ele alma
    * [Gerçek İstemci IP](../admin-en/using-proxy-or-balancer-en.md) - Doğru istemci IP tespitini yapılandırma
    * [Son Kullanıcı Sorunları](../faq/common-errors-after-installation.md) - Kurulum sonrası yaygın hatalar
    * [Wallarm Ingress Controller](../faq/ingress-installation.md) - Ingress'e özgü sorunlar
    * [Wallarm Cloud Çalışmıyor](../faq/wallarm-cloud-down.md) - Bulut kullanılamama durumunu ele alma
    * [OWASP Gösterge Paneli Uyarıları](../faq/node-issues-on-owasp-dashboards.md) - Gösterge paneli uyarılarını çözme
    * [NGINX Hata Günlüğü](../troubleshooting/wallarm-issues-in-nginx-error-log.md) - NGINX hata mesajlarını yorumlama
    * [NGINX'te Dinamik DNS](../admin-en/configure-dynamic-dns-resolution-nginx.md) - Dinamik DNS çözümlemeyi yapılandırma
