```markdown
!!! info "If you deploy several Wallarm nodes"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürüme** sahip olmalıdır. Ayrı sunucularda kurulu postanalytics modülleri de **aynı sürüme** sahip olmalıdır.

    Ek bir düğüm kurulmadan önce, lütfen yeni düğümün sürümünün zaten dağıtılmış modüllerin sürümü ile uyumlu olduğundan emin olun. Dağıtılmış modül sürümü [kullanımdan kaldırıldı ya da yakında kullanımdan kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Kurulu sürümü kontrol etmek için, konteynerde aşağıdaki komutu çalıştırın:

    ```bash
    yum list wallarm-node
    ```
```