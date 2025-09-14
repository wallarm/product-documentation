# Bir Failover Yönteminin Yapılandırılması

Bir filtre düğümünü bir [ters proxy](../glossary-en.md#reverse-proxy) olarak dağıtmak, filtre düğümünün yüksek erişilebilir olmasını gerektirir. Örneğin elektrik kesintisi nedeniyle filtre düğümünün arızalanması, API'nin çalışmasını kısıtlar. Wallarm'ın yüksek erişilebilirliğini sağlamak için, bu bölümde açıklanan failover yöntemlerinden birini kullanmanız önerilir.

Bir failover yöntemi, ana filtre düğümü arızalanırsa trafiğin otomatik olarak yönlendirileceği ek düğümler ekler.

## Veri Merkezi Failover'ı

API'niz ve filtre düğümleriniz bir veri merkezindeyse, veri merkezinin "Failover IP" hizmetini kullanın

## VRRP veya CARP 

Her filtre düğümünde, düğümlerin erişilebilirliğini izleyen ve düğümler devre dışı kalırsa trafiği iletmeye başlayan bir `keepalived` veya `ucarp` daemon'u başlatın. Bu, her düğümde bir failover‑IP başlatarak ve trafiği DNS dengelemesiyle dağıtarak trafik yük dengeleme için de kullanılabilen standart bir yüksek erişilebilirlik yöntemidir.

!!! info "NGINX Plus ile çalışma"
    Wallarm, özel bir VRRP sarmalayıcı ile [NGINX Plus](https://www.nginx.com/products/nginx/) üzerinde çalışacak şekilde yapılandırılabilir.

    CentOS ve Debian dahil çoğu Linux dağıtımı, bu derlemeyi kurabilen özel paketlere sahiptir.
    
    NGINX Plus ile Wallarm kurulumu hepsi bir arada yükleyici kullanılarak gerçekleştirilir, ayrıntılı talimatlar için [buraya](../installation/nginx/all-in-one.md) bakın.

## Donanım L3 veya L4 Yük Dengeleyici

Katman 3 veya katman 4 bir yük dengeleyici, iyi bir yüksek erişilebilirlik çözümüdür.

## DNS Yük Dengeleme

DNS ayarlarında birden fazla IP adresi belirtin. Bu yöntem esasen yük dengelemeyi hedeflese de, yüksek erişilebilirlik yöntemi olarak da faydalı bulabilirsiniz.