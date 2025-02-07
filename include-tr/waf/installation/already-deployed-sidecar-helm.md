```markdown
!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürüme** sahip olmalıdır. Ayrı sunucularda kurulu olan postanalytics modülleri de **aynı sürüme** sahip olmalıdır.

    Ek düğüm kurulumu öncesinde, lütfen sürümünün zaten dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [deprecated veya yakında deprecated olacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Dağıtılan Wallarm filtering node imajının sürümü, Helm chart yapılandırma dosyasında belirtilmiştir → `wallarm.image.tag`.
```