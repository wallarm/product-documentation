# Bir Failover Yönteminin Yapılandırılması

Bir filtre düğümünü bir [reverse proxy](../glossary-en.md#reverse-proxy) olarak dağıtmak, filtre düğümünün yüksek derecede kullanılabilir olmasını gerektirir. Filtre düğümünün başarısız olması, örneğin elektrik kesintisi nedeniyle, web uygulamasının işlemlerini sınırlar. Wallarm'ın yüksek erişilebilirliğini sağlamak için, size bu bölümde açıklanan failover yöntemlerinden birini kullanmanız önerilir.

Bir failover yöntemi, ana filtre düğümü başarısız olduğunda trafiğin otomatik olarak yönlendirildiği ek düğümler sunar.

## Veri Merkezi Failover

Eğer web uygulaması ve filtre düğümleri bir veri merkezindeyse, veri merkezinin "Failover IP" hizmetini kullanın

## VRRP veya CARP 

Her filtre düğümünde, düğümlerin erişilebilirliğini izleyen ve düğümler aşağı inerse trafiği yönlendirmeye başlayan bir `keepalived` veya `ucarp` dæmon'u başlatın. Bu, bir failover-IP'yi her düğümde başlatarak ve trafiği DNS dengesi ile dağıtarak trafik yük dengesini sağlamak amacıyla da kullanılabilecek standart bir yüksek erişilebilirlik yöntemidir.

!!! bilgi "NGINX Plus ile Çalışma"
    Wallarm, özel bir VRRP sarmalayıcı ile [NGINX Plus](https://www.nginx.com/products/nginx/) üzerinde çalışacak şekilde ayarlanabilir.

    CentOS ve Debian dahil olmak üzere çoğu Linux dağıtımı, bu inşayı kurabilecek özelleştirilmiş paketlere sahiptir.
    
    Wallarm'ın NGINX Plus ile kurulumu hakkında bilgi almak için, [«NGINX Plus ile Kurulum»](../installation/nginx-plus.md) sayfasındaki detaylı talimatlara bakın.

## Donanım L3 veya L4 Yük Dengesi

Bir katman 3 veya katman 4 yük dengeleyicisi iyi bir yüksek kullanılabilirlik çözümüdür.

## DNS Yük Dengesi

DNS ayarlarında birden çok IP adresi belirtin. Bu yöntem yük dengesini hedeflemekle birlikte, yüksek erişilebilirlik yöntemi olarak da kullanışlı bulabilirsiniz.
