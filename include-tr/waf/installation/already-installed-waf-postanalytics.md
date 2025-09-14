!!! info "Birden fazla Wallarm düğümü dağıtıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek bir düğüm kurmadan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [artık desteklenmiyor veya yakında destekten kalkacaksa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya kurulu filtreleme düğümü ve postanalytics'in yüklü sürümünü kontrol etmek için:

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

    Farklı sunuculara kurulu filtreleme düğümü ve postanalytics'in sürümlerini kontrol etmek için:

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