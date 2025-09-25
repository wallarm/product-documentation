!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek bir düğümü kurmadan önce, sürümünün hâlihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [kullanımdan kaldırılmış ya da yakında kullanımdan kaldırılacaksa (`4.0` veya altı)][versioning-policy], tüm modülleri en son sürüme yükseltin.
    
    Çalışmakta olan sürümü kontrol etmek için, çalışan örneğe bağlanın ve aşağıdaki komutu çalıştırın:

    ```
    apt list wallarm-node
    ```