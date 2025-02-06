!!! info "Eğer birkaç Wallarm node’u dağıtırsanız"
    Ortamınıza dağıttığınız tüm Wallarm node’larının **aynı sürümde** olması gerekmektedir. Ayrı sunucularda kurulu olan postanalytics modüllerinin de **aynı sürümde** olması gerekmektedir.

    Ek bir node kurulumu yapmadan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle uyumlu olduğunu kontrol edin. Eğer dağıtılmış modül sürümü [deprecated or will be deprecated soon (`4.0` or lower)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuda kurulu olan filtreleme node ve postanalytics'in sürümünü kontrol etmek için:

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

    Farklı sunucularda kurulu olan filtreleme node ve postanalytics'in sürümlerini kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme node'unun kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # Postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtreleme node'unun kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # Postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # Wallarm filtreleme node'unun kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # Postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```