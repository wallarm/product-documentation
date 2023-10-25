!!! bilgi "Eğer birden fazla Wallarm düğümü dağıtıyorsanız"
    Ortamınıza yerleştirilmiş tüm Wallarm düğümleri **aynı sürümlerden** olmalıdır. Ayrı sunucularda kurulu postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek bir düğümün kurulumundan önce, lütfen sürümünün zaten dağıtılan modüllerin sürümüyle eşleştiğini kontrol edin. Dağıtılan modül sürümü [yakında kullanımdan kalkacak veya kullanımdan kalkacaksa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.
   
    Başlatılan sürümü kontrol etmek için, çalışan örneğe bağlanın ve aşağıdaki komutu çalıştırın:

    ```
    apt list wallarm-node
    ```
