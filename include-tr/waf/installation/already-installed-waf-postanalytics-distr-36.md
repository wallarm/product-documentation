```markdown
!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri aynı sürümlerde olmalıdır. Ayrı sunuculara kurulmuş olan postanalytics modülleri de aynı sürümlerde olmalıdır.

    Ek düğüm kurulmadan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümü ile uyumlu olduğundan emin olun. Eğer dağıtılan modül sürümü [deprecated or will be deprecated soon (`4.0` or lower)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Aynı sunucuda dağıtılan filtering node ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunucularda dağıtılan filtering node ve postanalytics modülünün sürümünü kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtering node yüklü sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics yüklü sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtering node yüklü sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics yüklü sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # Wallarm filtering node yüklü sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics yüklü sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
```