# Wallarm solution deployment and maintenance best practices

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları formüle eder.

## Filtreleme düğümlerini sadece üretim ortamında değil, test ve hazırlık ortamlarında da dağıtın - технические бест практисы

Wallarm servis sözleşmelerinin çoğu, müşteri tarafından dağıtılan Wallarm düğümlerinin sayısını sınırlamadığı için, geliştirme, test, hazırlık vb. tüm ortamlarınızda filtreleme düğümlerini dağıtmamanız için hiçbir neden yoktur.

Yazılım geliştirme ve/veya servis operasyon faaliyetlerinizin tüm aşamalarında filtreleme düğümlerini dağıtıp kullandığınızda, tüm veri akışını doğru şekilde test etme ve kritik üretim ortamınızda beklenmeyen herhangi bir durum riskini minimize etme şansınız daha yüksek olur.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın - технические бест практисы,плюс ссылка на это должна быть в каждой инструкции по деплою

Yük dengeleyici veya CDN arkasında bulunan Wallarm filtreleme düğümleri için, filtreleme düğümlerinizin (aksi takdirde [IP list functionality](user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing) ve bazı diğer özelliklerin çalışmayacağı) son kullanıcı IP adreslerini doğru şekilde raporlayacak şekilde yapılandırıldığından emin olun:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP görüntüleri ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerinin doğru izlenmesini sağlayın - перенести как в инструкцию по мониторингу,так и в технические бест практисы

Wallarm filtreleme düğümlerinin doğru şekilde izlenmesi şiddetle tavsiye edilir. Her Wallarm filtreleme düğümü ile birlikte kurulan `collectd` servisi, [linkte](../admin-en/monitoring/available-metrics.md) listelenen metrikleri toplar.

Filtreleme düğümünün izlenmesi kurulumu, dağıtım seçeneğine bağlıdır:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/monitoring/intro.md) (AWS / GCP görüntüleri ve Kubernetes sidecar'ları dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker görüntüsü için talimatlar](../admin-en/installation-docker-en.md#monitoring-configuration)

## Uygun yedeklilik ve otomatik hata devriyet fonksiyonelliğini uygulayın

Üretim ortamınızdaki diğer kritik bileşenlerde olduğu gibi, Wallarm düğümleri de uygun yedeklilik ve otomatik hata devriyet düzeyiyle mimaride, dağıtımda ve işletmede olmalıdır. Kritik son kullanıcı isteklerini ele alan **en az iki aktif Wallarm filtreleme düğümüne** sahip olmalısınız. Aşağıdaki makaleler bu konu hakkında ilgili bilgiler sağlar:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/configure-backup-en.md) (AWS / GCP görüntüleri, Docker düğüm konteyneri ve Kubernetes sidecar'ları dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)