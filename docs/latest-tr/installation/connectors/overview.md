# Wallarm'ı Bir Bağlayıcı Olarak Dağıtma

API dağıtımı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve CloudFront gibi harici araçlar kullanmak dahil olmak üzere çeşitli şekillerde yapılabilir. Bu API'leri Wallarm ile güvence altına almanın bir yolunu arıyorsanız, özellikle bu tür durumlar için tasarlanmış "bağlayıcılar" biçiminde bir çözüm sunuyoruz.

## Nasıl çalışır

Wallarm'ın bağlayıcı çözümü, trafiği filtrelemek ve analiz etmek için API ağ geçitleri veya uç platformları gibi üçüncü taraf platformlarla entegre olur. Çözüm iki ana bileşen ile çalışır:

* **Wallarm node**, [Wallarm](../security-edge/se-connector.md) veya müşteri tarafından barındırılır ve trafik analizi ile güvenlik kontrollerini gerçekleştirir.
* Üçüncü taraf platforma enjekte edilerek trafiği analiz için Wallarm node'a yönlendiren **Wallarm tarafından sağlanan kod paketi veya politika**.

Bağlayıcılarla trafik ya [satır içi](../inline/overview.md) ya da [bant dışı](../oob/overview.md) analiz edilebilir:

=== "Satır içi trafik akışı"

    Wallarm, kötü amaçlı etkinliği [engelleyecek](../../admin-en/configure-wallarm-mode.md) şekilde yapılandırılmışsa:

    ![görsel](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "Bant dışı trafik akışı"
    ![görsel](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## Desteklenen platformlar

Wallarm aşağıdaki platformlar için bağlayıcılar sunar:

| Bağlayıcı | Desteklenen trafik akışı modu | Bağlayıcı barındırma |
| --- | ---- | ---- |
| [MuleSoft Mule Gateway](mulesoft.md) | Satır içi | Security Edge, kendi barındırmalı |
| [MuleSoft Flex Gateway](mulesoft-flex.md) | Satır içi, bant dışı | Kendi barındırmalı |
| [Apigee](apigee.md) | Satır içi |Kendi barındırmalı |
| [Akamai](akamai-edgeworkers.md) | Satır içi, bant dışı |Kendi barındırmalı |
| [Azion Edge](azion-edge.md) | Satır içi |Kendi barındırmalı |
| [Amazon CloudFront](aws-lambda.md) | Satır içi, bant dışı | Security Edge, kendi barındırmalı |
| [Cloudflare](cloudflare.md) | Satır içi, bant dışı | Security Edge, kendi barındırmalı |
| [Kong Ingress Controller](kong-api-gateway.md) | Satır içi | Kendi barındırmalı |
| [Istio Ingress](istio.md) | Satır içi, bant dışı | Kendi barındırmalı |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | Satır içi | Kendi barındırmalı |
| [Fastly](fastly.md) | Satır içi, bant dışı | Security Edge, kendi barındırmalı |
| [IBM DataPower](ibm-api-connect.md) | Satır içi | Security Edge, kendi barındırmalı |

Aradığınız bağlayıcıyı bulamadıysanız, gereksinimlerinizi görüşmek ve olası çözümleri keşfetmek için lütfen [Satış ekibimiz](mailto:sales@wallarm.com) ile iletişime geçmekten çekinmeyin.

!!! info "Dağıtım alternatifleri"
    Yönetilen bir satır içi seçenek mi istiyorsunuz? [Security Edge](../security-edge/overview.md)'i inceleyin.

    Geleneksel kendi yönetimli dağıtımlar (VM'ler, Kubernetes, bulut ortamları) için bkz. [Kendi Barındırılan Node Dağıtımı](../supported-deployment-options.md).