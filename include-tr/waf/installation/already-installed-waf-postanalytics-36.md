!!! info "Eğer birden çok Wallarm düğümünü kullanıyorsanız"
    Tüm Wallarm düğümleri, ortamınıza **aynı sürümler** olarak dağıtılmalıdır. Farklı sunucularda kurulu postanalytics modülleri de **aynı sürümler** olmalıdır.

    Ek bir düğümün kurulumundan önce, lütfen sürümünün zaten dağıtılan modüllerin sürümüyle eşleştiğinden emin olun. Eğer dağıtılan modül sürümü [yakında kullanımdan kalkacak veya çoktan kalkmışsa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya kurulu filtreleme düğümü ve postanalytics'in yüklenmiş sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```
    
    Farklı sunuculara kurulu filtreleme düğümü ve postanalytics sürümlerini kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtreleme düğümünün yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        # Wallarm filtreleme düğümünün yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        # Wallarm filtreleme düğümünün yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```