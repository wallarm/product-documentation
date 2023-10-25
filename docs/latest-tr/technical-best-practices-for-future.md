# Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamalar

Bu makale, Wallarm çözümünün dağıtımı ve bakımı için en iyi uygulamaları formüle eder.

## Üretim ortamında değil, aynı zamanda test ve hazırlıkta da filtreleme düğümlerini dağıtın - teknik en iyi uygulamalar

Wallarm servis kontratlarının çoğu müşterinin dağıttığı Wallarm düğümlerinin sayısını sınırlamaz, bu nedenle filtreleme düğümlerini tüm ortamlarınıza dağıtmak için hiçbir neden yoktur. Bu ortamlar, yazılım geliştirme ve/veya servis operasyon hizmetlerinizin tüm aşamalarını içerir.

Tüm yazılım geliştirme ve/veya servis operasyon hizmetlerinizin aşamalarında filtreleme düğümlerini dağıtarak ve kullanarak, tüm veri akışını doğru bir şekilde test etme ve kritik üretim ortamınızdaki beklenmeyen durumların riskini en aza indirme şansınız daha fazla olur.

## Son kullanıcı IP adreslerinin doğru raporlanmasını yapılandırın - teknik en iyi uygulamalar, bu konuda bir link her dağıtım talimatında bulunmalıdır

Yük dengeleyici veya CDN'nin arkasında bulunan Wallarm filtreleme düğümleri için lütfen filtreleme düğümlerinizin son kullanıcı IP adreslerini doğru bir şekilde raporlamasını yapılandırdığınızdan emin olun (aksi takdirde [IP listesi işlevselliği](../user-guides/ip-lists/overview.md), [Aktif tehdit doğrulaması](detecting-vulnerabilities.md#active-threat-verification) ve bazı diğer özellikler çalışmayacaktır):

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/using-proxy-or-balancer-en.md) (AWS / GCP imajları ve Docker düğüm konteyneri dahil)
* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Filtreleme düğümlerinin doğru izlenmesini etkinleştirin - bunu hem izleme talimatına hem de teknik en iyi uygulamalara taşıyın

Wallarm filtreleme düğümlerinin doğru bir şekilde izlenmesi şiddetle tavsiye edilir. Her Wallarm filtreleme düğümüyle yüklenen `collectd` hizmeti, [link](../admin-en/monitoring/available-metrics.md) içinde listelenen metrikleri toplar.

Filtreleme düğümü izleme ayarı, dağıtım seçeneğine bağlıdır:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/monitoring/intro.md) (AWS / GCP imajları ve Kubernetes yan arabalar dahil)
* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINX tabanlı Docker image için talimatlar](../admin-en/installation-docker-en.md#monitoring-configuration)

## Doğru yedeklilik ve otomatik hata düzeltme işlevselliği uygulayın

Üretim ortamınızdaki her diğer kritik bileşende olduğu gibi, Wallarm düğümleri de düzgün bir yedeklilik seviyesi ve otomatik hata düzeltme işlevi ile mimarlanmalı, dağıtılmalı ve işletilmelidir. Kritik son kullanıcı isteklerini işleyen **en az iki aktif Wallarm filtreleme düğümünüz** olmalıdır. Aşağıdaki makaleler bu konu hakkında ilgili bilgileri sağlar:

* [NGINX tabanlı Wallarm düğümleri için talimatlar](../admin-en/configure-backup-en.md) (AWS / GCP imajları, Docker düğüm konteyneri ve Kubernetes yan arabalar dahil)
* [Wallarm Kubernetes Ingress denetleyicisi olarak dağıtılan filtreleme düğümleri için talimatlar](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)