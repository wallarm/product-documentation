```markdown
!!! info "Eğer birkaç Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara yüklenen postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek düğüm kurulumu öncesinde, lütfen sürümün hali hazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılan modül sürümü [kullanımdan kaldırılmış veya yakında kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Dağıtılan Wallarm filtering node imajının sürümü, Deployment template → `spec.template.spec.containers` bölümündeki Wallarm container'ının `image` kısmında belirtilmiştir.
```