[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# Çok kiracılı node'un yükseltilmesi

Bu yönergeler, 4.x sürümündeki çok kiracılı node'un 5.0 sürümüne yükseltilmesi için izlenecek adımları tanımlar.

Ömrünü tamamlamış (3.6 veya daha düşük) çok kiracılı node'u yükseltmek için lütfen [farklı talimatları](older-versions/multi-tenant.md) kullanın.

## Gereksinimler

* Kullanıcının, [technical tenant account](../installation/multi-tenant/overview.md#tenant-accounts) altında eklenmiş **Global administrator** rolü ile sonraki komutları çalıştırması
* ABD Wallarm Cloud ile çalışılıyorsa `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışılıyorsa `https://api.wallarm.com` adresine erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları güncellemelerini ve API spesifikasyonlarını indirmek ile beyaz listeye, kara listeye veya gri listeye alınan ülkeler, bölgeler ya da veri merkezleri için doğru IP'leri elde edebilmek amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Standart yükseltme prosedürünü izleyin

Standart prosedürler şunlardır:

* [DEB/RPM paketlerinden Wallarm'ın yükseltilmesi](nginx-modules.md)
* [Hepsi bir arada yükleyici ile Wallarm'ın yükseltilmesi](nginx-modules.md)
* [postanalytics modülünün yükseltilmesi](separate-postanalytics.md)
* [Wallarm Docker NGINX tabanlı görüntüsünün yükseltilmesi](docker-container.md)
* [Entegre Wallarm modüllerine sahip NGINX Ingress denetleyicisinin yükseltilmesi](ingress-controller.md)
* [Sidecar proxy'nin yükseltilmesi](sidecar-proxy.md)
* [cloud node görüntüsünün yükseltilmesi](cloud-image.md)

!!! warning "Çok kiracılı node oluşturma"
    Wallarm node oluşturma sırasında lütfen **Multi-tenant node** seçeneğini belirleyin:

    ![Multi-tenant node creation](../images/user-guides/nodes/create-multi-tenant-node.png)