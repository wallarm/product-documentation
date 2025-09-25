!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek düğümü kurmadan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [kullanımdan kaldırılmışsa veya yakında kaldırılacaksa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.

    Yüklü sürümü kontrol etmek için, konteyner içinde aşağıdaki komutu çalıştırın:

    ```bash
    apt list wallarm-node
    ```