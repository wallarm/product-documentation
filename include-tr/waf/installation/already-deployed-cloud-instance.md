```markdown
!!! info "Eğer birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürüme** sahip olmalıdır. Ayrı sunucularda kurulan postanalytics modülleri de **aynı sürüme** sahip olmalıdır.

    Ek düğüm kurulumu öncesinde, lütfen bu düğümün sürümünün zaten dağıtılmış modüllerin sürümü ile eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanımdan kaldırıldı veya yakında kullanım dışı kalacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en yeni sürüme yükseltin.
    
    Çalışan sürümü kontrol etmek için, çalışan örneğe bağlanın ve aşağıdaki komutu çalıştırın:

    ```
    apt list wallarm-node
    ```
```