!!! info "Birden fazla Wallarm düğümü dağıtıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümde** olmalıdır. Ayrı sunuculara kurulu postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek düğümü kurmadan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanım dışı bırakılmışsa veya yakında bırakılacaksa (`4.0` veya altı)][versioning-policy], tüm modülleri en son sürüme yükseltin.

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
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
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
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```