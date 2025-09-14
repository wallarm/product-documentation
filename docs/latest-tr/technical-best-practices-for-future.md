# Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamalar

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları ortaya koymaktadır.


## Filtreleme düğümlerini yalnızca üretim ortamında değil, test ve hazırlık (staging) ortamlarında da dağıtın - teknik en iyi uygulamalar

Wallarm hizmet sözleşmelerinin çoğu, müşteri tarafından dağıtılan Wallarm düğümlerinin sayısını sınırlamaz; dolayısıyla geliştirme, test, hazırlık (staging) vb. dahil tüm ortamlarınıza filtreleme düğümlerini dağıtmamak için bir neden yoktur.

Filtreleme düğümlerini yazılım geliştirme ve/veya hizmet işletimi faaliyetlerinizin tüm aşamalarında dağıtıp kullanarak, tüm veri akışını doğru şekilde test etme ve kritik üretim ortamınızda beklenmedik durumların riskini en aza indirme şansınız artar.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın - teknik en iyi uygulamalar, ayrıca buna bağlantı her dağıtım talimatında olmalı

Yük dengeleyici veya CDN arkasında bulunan Wallarm filtreleme düğümleri için, filtreleme düğümlerinizi son kullanıcı IP adreslerini doğru şekilde raporlayacak biçimde yapılandırdığınızdan emin olun (aksi halde [IP list işlevi](user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing) ve bazı diğer özellikler çalışmayacaktır):

* [NGINX tabanlı Wallarm düğümleri için yönergeler](../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için yönergeler](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerinin doğru şekilde izlenmesini etkinleştirin - hem izleme talimatına hem de teknik en iyi uygulamalara taşınmalı

Wallarm filtreleme düğümlerinin doğru şekilde izlenmesini etkinleştirmeniz şiddetle önerilir. Filtreleme düğümü izlemesini kurma yöntemi, dağıtım seçeneğine bağlıdır:

* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için yönergeler](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker imajı için yönergeler](../admin-en/installation-docker-en.md#monitoring-configuration)

## Uygun yedeklilik ve otomatik failover işlevselliğini uygulayın

Üretim ortamınızdaki diğer tüm kritik bileşenlerde olduğu gibi, Wallarm düğümleri de uygun düzeyde yedeklilik ve otomatik geçiş (failover) ile tasarlanmalı, dağıtılmalı ve işletilmelidir. Kritik son kullanıcı isteklerini işleyen **en az iki aktif Wallarm filtreleme düğümünüz** olmalıdır. Aşağıdaki makaleler konu hakkında ilgili bilgiler sağlar:

* [NGINX tabanlı Wallarm düğümleri için yönergeler](../admin-en/configure-backup-en.md) (AWS / GCP imajları, Docker düğüm konteyneri ve Kubernetes sidecar'ları dahil)
* [Wallarm Kubernetes Ingress controller olarak dağıtılan filtreleme düğümleri için yönergeler](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)