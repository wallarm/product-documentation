!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek düğümün kurulumundan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanımdan kaldırılmışsa veya yakında kaldırılacaksa (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son sürüme yükseltin.

    Dağıtılan Wallarm filtreleme düğümü imajının sürümü, Deployment şablonunda → `spec.template.spec.containers` bölümünde → Wallarm konteynerinin `image` alanında belirtilir.