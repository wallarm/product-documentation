!!! info "Birden fazla Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümlerinin **aynı sürümde** olması gerekir. Ayrı sunuculara kurulan postanalytics modülleri de **aynı sürümde** olmalıdır.

    Ek düğümün kurulumundan önce, sürümünün halihazırda dağıtılmış modüllerin sürümüyle eşleştiğinden emin olun. Dağıtılmış modül sürümü [kullanımdan kaldırılmış veya yakında kaldırılacak (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Dağıtılan Wallarm filtreleme düğümü imajının sürümü Helm chart yapılandırma dosyasında belirtilir → `wallarm.image.tag`.