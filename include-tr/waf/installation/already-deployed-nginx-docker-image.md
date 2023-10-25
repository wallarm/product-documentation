!!! bilgi "Eğer birden fazla Wallarm düğümü dağıtırsanız"
    Çevrenize dağıtılmış tüm Wallarm düğümleri **aynı sürümler** olmalıdır. Ayrı sunuculara yüklenmiş postanalitik modülleri **aynı sürümler** olmalıdır.

    Ek düğümün yüklenmesi öncesinde, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağınık modül sürümü [yakında kullanımdan kalkacak veya kullanımdan kalkacak olan (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme güncelleyin.

    Yüklenmiş sürümü kontrol etmek için aşağıdaki komutu konteynırda çalıştırın:

    ```bash
    apt list wallarm-node
    ```