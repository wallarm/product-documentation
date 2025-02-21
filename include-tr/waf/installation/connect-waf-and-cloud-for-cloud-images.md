Depending on the selected Wallarm deployment approach ([in-line][inline-docs] or [Out-of-Band][oob-docs]), different commands are used to register the instance with the Wallarm Cloud.

=== "In-line"
    Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Cloud'a bağlanır. Bu betik, sağlanan token ile düğümü Wallarm Cloud'a kaydeder, global olarak monitoring [mode][wallarm-mode] moduna ayarlar ve düğümü, `--proxy-pass` bayrağına dayalı olarak yetkili trafiği iletecek şekilde yapılandırır. NGINX'in yeniden başlatılması kurulumu tamamlar.

    Cloud imajından oluşturulan örnekte `cloud-init.py` betiğini şu şekilde çalıştırın:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` mevcut olan ya da mevcut değilse oluşturulacak olan bir düğüm grubunun adını ayarlar. Bu, yalnızca bir API token kullanıldığında uygulanır.
    * `<TOKEN>` tokenın kopyalanmış değeridir.
    * `<PROXY_ADDRESS>`, Wallarm düğümünün yetkili trafiği proxy'lemek için kullanacağı adrestir. Bu, mimarinize bağlı olarak bir uygulama örneğinin IP adresi, yük dengeleyici veya DNS adı vb. olabilir.
=== "Out-of-Band"
    Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Cloud'a bağlanır. Bu betik, sağlanan token ile düğümü Wallarm Cloud'a kaydeder, global olarak monitoring [mode][wallarm-mode] moduna ayarlar ve NGINX'in `location /` bloğunda bulunan [`wallarm_force`][wallarm_force_directive] direktiflerini yalnızca aynalanmış trafik kopyalarını analiz edecek şekilde yapılandırır. NGINX'in yeniden başlatılması kurulumu tamamlar.

    Cloud imajından oluşturulan örnekte `cloud-init.py` betiğini şu şekilde çalıştırın:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` mevcut olan ya da mevcut değilse oluşturulacak olan bir düğüm grubunun adını ayarlar. Bu, yalnızca bir API token kullanıldığında uygulanır.
    * `<TOKEN>` tokenın kopyalanmış değeridir.