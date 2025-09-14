Seçilen Wallarm dağıtım yaklaşımına ([Hat içi][inline-docs] veya [Bant Dışı][oob-docs]) bağlı olarak, örneği Wallarm Cloud'a kaydetmek için farklı komutlar kullanılır.

=== "Hat içi"
    Bulut örneğinin düğümü [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, genel olarak izleme [modu][wallarm-mode]na ayarlar ve düğümü meşru trafiği `--proxy-pass` bayrağına göre iletecek şekilde yapılandırır. NGINX'in yeniden başlatılması kurulumu tamamlar.

    Bulut imajından oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`, bir düğüm grup adını ayarlar (varsa mevcut; yoksa oluşturulacaktır). Yalnızca bir API token kullanılıyorsa uygulanır.
    * `<TOKEN>`, kopyaladığınız token değeridir.
    * `<PROXY_ADDRESS>`, Wallarm düğümünün meşru trafiği ileteceği adresidir. Mimarinizine bağlı olarak bir uygulama örneğinin IP'si, yük dengeleyici veya DNS adı vb. olabilir.
=== "Bant Dışı"
    Bulut örneğinin düğümü [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, genel olarak izleme [modu][wallarm-mode]na ayarlar ve yalnızca yansıtılmış trafik kopyalarını analiz etmek için NGINX'in `location /` bloğunda [`wallarm_force`][wallarm_force_directive] yönergelerini ayarlar. NGINX'in yeniden başlatılması kurulumu tamamlar.

    Bulut imajından oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`, bir düğüm grup adını ayarlar (varsa mevcut; yoksa oluşturulacaktır). Yalnızca bir API token kullanılıyorsa uygulanır.
    * `<TOKEN>`, kopyaladığınız token değeridir.