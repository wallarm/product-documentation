# Wallarm'ı Bir Bağlayıcı Olarak Dağıtma

API dağıtımı, Azion Edge, Akamai Edge, Mulesoft, Apigee ve CloudFront gibi harici araçların kullanılması dahil olmak üzere çeşitli şekillerde gerçekleştirilebilir. Bu API'ları Wallarm ile güvence altına almanın bir yolunu arıyorsanız, bu tür durumlar için özel olarak tasarlanmış "connectors" şeklinde bir çözüm sunuyoruz.

## Nasıl Çalışır

Wallarm'ın connector çözümü, API ağ geçitleri veya edge platformlar gibi üçüncü taraf platformlarla entegre olarak trafiği filtreler ve analiz eder. Çözüm, iki ana bileşenle çalışır:

* **Wallarm node**, [Wallarm](../se-connector.md) veya müşteri tarafından barındırılan, trafik analizini ve güvenlik kontrollerini gerçekleştirir.
* Üçüncü taraf platforma enjekte edilen ve trafiğin analiz için Wallarm node'una yönlendirilmesini sağlayan **Wallarm tarafından sağlanan kod paketi veya politika**.

Connector’lar sayesinde, trafik ya [in-line](../inline/overview.md) ya da [out-of-band](../oob/overview.md) olarak analiz edilebilir:

=== "Satır içi trafik akışı"

    Eğer Wallarm, kötü amaçlı etkinliği [engelleyecek şekilde](../../admin-en/configure-wallarm-mode.md) yapılandırılmışsa:

    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "Bant dışı trafik akışı"
    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## Desteklenen Platformlar

Wallarm, aşağıdaki platformlar için connector’lar sunar:

| Connector | Desteklenen trafik akış modu | Bağlayıcı barındırması |
| --- | ---- | ---- |
| [Mulesoft](mulesoft.md) | Satır içi | Security Edge, kendi kendine barındırılan |
| [Apigee](apigee.md) | Satır içi | kendi kendine barındırılan |
| [Akamai EdgeWorkers](akamai-edgeworkers.md) | Satır içi | kendi kendine barındırılan |
| [Azion Edge](azion-edge.md) | Satır içi | kendi kendine barındırılan |
| [Amazon CloudFront](aws-lambda.md) | Satır içi, Bant dışı | Security Edge, kendi kendine barındırılan |
| [Cloudflare](cloudflare.md) | Satır içi, Bant dışı | Security Edge, kendi kendine barındırılan |
| [Kong Ingress Controller](kong-api-gateway.md) | Satır içi | kendi kendine barındırılan |
| [Istio Ingress](istio.md) | Bant dışı | kendi kendine barındırılan |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | Satır içi | kendi kendine barındırılan |
| [Fastly](fastly.md) | Satır içi, Bant dışı | Security Edge, kendi kendine barındırılan |

Aradığınız connector’ı bulamadıysanız, gereksinimlerinizi görüşmek ve potansiyel çözümleri keşfetmek için lütfen [Sales team](mailto:sales@wallarm.com) ile iletişime geçmekten çekinmeyin.