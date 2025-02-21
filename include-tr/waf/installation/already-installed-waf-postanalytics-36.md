!!! info "If you deploy several Wallarm nodes"  
    Ortamınıza dağıtılan tüm Wallarm node'lar **aynı sürümde** olmalıdır. Ayrı sunuculara kurulmuş postanalytics modülleri de **aynı sürümde** olmalıdır.  

    Ek node kurulmadan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Eğer dağıtılmış modül sürümü [kullanımdan kaldırıldı ya da yakında kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.  

    Aynı sunucuya kurulmuş filtering node ve postanalytics'in yüklü sürümünü kontrol etmek için:  

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara kurulmuş filtering node ve postanalytics sürümlerini kontrol etmek için:  

    === "Debian"
        ```bash
        # Wallarm filtering node'unun kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtering node'unun kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # Wallarm filtering node'unun kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # Wallarm filtering node'unun kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```