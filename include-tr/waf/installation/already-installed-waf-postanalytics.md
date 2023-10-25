!!! info "Eğer birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulu postanalitik modülleri de **aynı sürümlerde** olmalıdır.

    Ek bir düğümün kurulumundan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [eskimiş veya yakında eski olacaksa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en yeni sürüme yükseltin.

    Aynı sunucuya kurulu filtreleme düğümünün ve postanalytics'in kurulu olduğu sürümü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara kurulu filtreleme düğümü ve postanalytics sürümlerini kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve daha düşük"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
