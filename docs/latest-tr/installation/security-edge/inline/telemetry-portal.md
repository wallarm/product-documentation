# Security Edge Inline için Telemetri Portalı <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

[Security Edge Inline](overview.md) için telemetri portalı, Wallarm tarafından işlenen trafikteki metriklere ilişkin gerçek zamanlı içgörüler sunan bir Grafana panosu sağlar.

Pano; toplam işlenen istek sayısı, RPS, tespit edilen ve engellenen saldırılar, dağıtılmış Edge Node sayısı, kaynak tüketimi, 5xx yanıt sayısı vb. gibi temel metrikleri görüntüler.

![!](../../../images/waf-installation/security-edge/inline/telemetry-portal.png)

Node [**Active** durumu](upgrade-and-management.md#statuses) seviyesine ulaştığında **telemetri portalını çalıştırın**. Başlatıldıktan yaklaşık ~5 dakika sonra Security Edge bölümünden doğrudan bağlantı ile erişilebilir hale gelir.

![!](../../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

Grafana ana sayfasından panele ulaşmak için, Dashboards → Wallarm → Portal Inline Overview yolunu izleyin.