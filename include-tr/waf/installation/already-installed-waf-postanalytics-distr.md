```markdown
!!! info "Eğer birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek düğüm kurulmadan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Eğer dağıtılmış modül sürümü [deprecated or will be deprecated soon (`4.0` or lower)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuya dağıtılan filtreleme düğümü ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara dağıtılan filtreleme düğümü ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics’in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics’in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
```