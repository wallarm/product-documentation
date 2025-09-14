!!! info "Birden fazla Wallarm düğümü dağıtıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri aynı sürümde olmalıdır. Ayrı sunuculara kurulmuş postanalytics modülleri de aynı sürümde olmalıdır.

    Ek düğümü kurmadan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanım dışı ya da yakında kullanım dışı bırakılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya kurulu filtreleme düğümünün ve postanalytics modülünün sürümünü kontrol etmek için:

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

    Farklı sunuculara kurulu filtreleme düğümü ve postanalytics modülünün sürümünü kontrol etmek için:

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
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```