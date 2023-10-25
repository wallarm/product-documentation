!!! bilgi "Eğer birkaç Wallarm düğümü dağıtırsanız"
    Ortamınıza dağıtılan tüm Wallarm düğümlerinin **aynı sürümlerde** olması gerekir. Ayrı sunucularda kurulu postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek bir düğümün kurulumundan önce, sürümünün zaten dağıtılan modüllerin sürümüyle eşleştiğinden emin olun. Eğer dağıtılan modülün sürümü [yakında kullanımdan kalkmış veya kullanımdan kalkacak (`4.0` veya altı)][versioning-policy] ise, tüm modülleri en son sürüme yükseltin.

    Dağıtılan Wallarm filtre düğümü görüntüsünün sürümü, Helm chart yapılandırma dosyasında belirtilmiştir → `wallarm.image.tag`.