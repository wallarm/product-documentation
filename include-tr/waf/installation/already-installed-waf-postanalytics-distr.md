!!! info "Birden fazla Wallarm düğümü dağıtıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek düğümün kurulumundan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanım dışı bırakılmış veya yakında kullanım dışı bırakılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya dağıtılmış filtreleme düğümünün ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara dağıtılmış filtreleme düğümü ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```