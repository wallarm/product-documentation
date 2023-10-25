!!! bilgi " `wallarm-node-tarantool` paket versiyonu"
    `wallarm-node-tarantool` paketi, ayrı bir sunucuda yüklü olan ana NGINX-Wallarm modül paketlerinden aynı veya daha yüksek bir versiyonda olmalıdır.

    Versiyonları kontrol etmek için:

    === "Debian"
        ```bash
        # Ana NGINX-Wallarm modülü olan sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics modülü olan sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Ana NGINX-Wallarm modülü olan sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics modülü olan sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        # Ana NGINX-Wallarm modülü olan sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics modülü olan sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        # Ana NGINX-Wallarm modülü olan sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics modülü olan sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # Ana NGINX-Wallarm modülü olan sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics modülü olan sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```