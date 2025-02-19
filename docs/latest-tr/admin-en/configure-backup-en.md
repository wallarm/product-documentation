# Failover Yöntemini Yapılandırma

Bir filtre düğümünü [reverse proxy](../glossary-en.md#reverse-proxy) olarak dağıtmak, filtre düğümünün yüksek kullanılabilirliğe sahip olmasını gerektirir. Filtre düğümünün arızalanması, örneğin güç kesintisi nedeniyle, web uygulamasının çalışmasını kısıtlar. Wallarm'ın yüksek kullanılabilirliğini sağlamak için bu bölümde açıklanan failover yöntemlerinden birinin kullanılmasını öneririz.

Bir failover yöntemi, ana filtre düğümü arızalandığında trafiğin otomatik olarak yönlendirileceği ek düğümler ekler.

## Data Center Failover

Web uygulaması ve filtre düğümleri bir veri merkezindeyse, veri merkezinin "Failover IP" hizmetini kullanın.

## VRRP or CARP

Her filtre düğümünde, düğümlerin kullanılabilirliğini izleyen ve düğümler devre dışı kaldığında trafiği yönlendirmeye başlayan bir `keepalived` veya `ucarp` daemon'ı başlatın. Bu, her düğümde bir failover‑IP başlatarak ve trafiği DNS dengelemesiyle dağıtarak, trafik yük dengeleme için de kullanılabilecek standart bir yüksek kullanılabilirlik yöntemidir.

!!! info "Working with NGINX Plus"
    Wallarm, özel bir VRRP wrapper ile [NGINX Plus](https://www.nginx.com/products/nginx/) üzerinde çalışacak şekilde yapılandırılabilir.

    CentOS ve Debian dahil olmak üzere çoğu Linux dağıtımında, bu yapıyı yükleyebilecek özel paketler bulunmaktadır.
    
    NGINX Plus ile Wallarm kurulumu, all-in-one installer kullanılarak gerçekleştirilir, ayrıntılı talimatlar için [buraya](../installation/nginx/all-in-one.md) bakınız.

## Hardware L3 or L4 Load Balancer

Katman 3 veya Katman 4 yük dengeleyici, iyi bir yüksek kullanılabilirlik çözümüdür.

## DNS Load Balancing

DNS ayarlarında birkaç IP adresi belirtin. Bu yöntem yük dengeleme amacı taşısa da, yüksek kullanılabilirlik yöntemi olarak da faydalı olabilir.