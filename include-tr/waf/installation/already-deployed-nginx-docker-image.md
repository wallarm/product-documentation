!!! info "If you deploy several Wallarm nodes"
    Ortamınıza dağıtılan tüm Wallarm node'ları **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulu postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek node kurulmadan önce, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle uyumlu olduğundan emin olun. Eğer dağıtılmış modül sürümü [deprecated or will be deprecated soon (`4.0` or lower)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Kurulu sürümü kontrol etmek için, konteyner içinde aşağıdaki komutu çalıştırın:

    ```bash
    apt list wallarm-node
    ```