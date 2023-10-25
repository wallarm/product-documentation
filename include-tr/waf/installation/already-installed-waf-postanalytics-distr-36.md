!!! info "Eğer birden fazla Wallarm düğümü kullanıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümlerinin **aynı sürümlerde** olması gerekmektedir. Ayrı sunuculara kurulu postanalytics modüllerinin de **aynı sürümlerde** olması gerekmektedir.

    Ek bir düğümün kurulumu öncesi, lütfen sürümünün zaten dağıtılan modüllerin sürümüyle eşleştiğinden emin olun. Eğer dağıtılan modül sürümü [eski sürüm veya yakında eski sürüm olacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucu üzerinde dağıtılan filtreleme düğümünün ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunucularına dağıtılan filtreleme düğümünün ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics kurulumunun yapıldığı sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics kurulumunun yapıldığı sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics kurulumunun yapıldığı sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```