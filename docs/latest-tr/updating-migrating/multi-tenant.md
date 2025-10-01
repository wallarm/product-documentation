[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# Çok kiracılı düğümün yükseltilmesi

Bu talimatlar, çok kiracılı düğümü en yeni 6.x sürümüne yükseltmek için adımları açıklar.

Ömrü sona ermiş çok kiracılı düğümü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/multi-tenant.md) kullanın.

## Gereksinimler

* İlerleyen komutların, [technical tenant account](../installation/multi-tenant/overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolüne sahip kullanıcı tarafından yürütülmesi
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` ya da EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` erişimi. Lütfen bu erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları ve API spesifikasyonları güncellemelerini indirmek ve allowlist'e, denylist'e veya graylist'e alınmış ülkeleriniz, bölgeleriniz ya da veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim.

    --8<-- "../include/wallarm-cloud-ips.md"

## Standart yükseltme prosedürünü izleyin

Standart prosedürler şunlardır:

* [DEB/RPM paketlerinden Wallarm'ı yükseltme](nginx-modules.md)
* [Hepsi bir arada yükleyici ile Wallarm'ı yükseltme](nginx-modules.md)
* [postanalytics modülünü yükseltme](separate-postanalytics.md)
* [Wallarm Docker NGINX tabanlı imajını yükseltme](docker-container.md)
* [Entegre Wallarm modülleri ile NGINX Ingress controller'ı yükseltme](ingress-controller.md)
* [Sidecar proxy'yi yükseltme](sidecar-proxy.md)
* [Bulut düğümü imajını yükseltme](cloud-image.md)

!!! warning "Çok kiracılı düğümün oluşturulması"
    Wallarm düğümü oluşturulurken, lütfen şu seçeneği belirleyin: **Multi-tenant node**:

    ![Çok kiracılı düğüm oluşturma](../images/user-guides/nodes/create-multi-tenant-node.png)