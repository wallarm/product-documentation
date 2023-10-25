!!! info "Birkaç Wallarm düğümü dağıtıyorsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümlerinin **aynı sürümde** olması gerekmektedir. Ayrı sunuculara kurulu postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek düğümün kurulumundan önce, sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [kullanımdan kaldırıldı veya yakında kullanımdan kaldırılacak ise ( `4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.

    Kurulu sürümü kontrol etmek için, aşağıdaki komutu konteynırda çalıştırın:

    ```bash
    yum list wallarm-node
    ```
