!!! info "Eğer birden fazla Wallarm node'u dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm node'ları **aynı sürümde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek node kurulmadan önce, lütfen yeni modülün sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [kullanımdan kaldırıldı veya yakında kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya dağıtılan filtering node ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara dağıtılan filtering node ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtering node'unun yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtering node'unun yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtering node'unun yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in yüklü olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```