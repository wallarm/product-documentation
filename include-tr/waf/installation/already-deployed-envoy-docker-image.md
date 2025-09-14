!!! info "Birden fazla Wallarm node dağıtıyorsanız"
    Ortamınıza dağıtılmış tüm Wallarm node'lar **aynı sürümde** olmalıdır. Ayrı sunuculara kurulmuş postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek node'u kurmadan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanımdan kaldırılmış veya yakında kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Yüklü sürümü kontrol etmek için, konteyner içinde aşağıdaki komutu çalıştırın:

    ```bash
    yum list wallarm-node
    ```