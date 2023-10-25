!!! bilgi "Eğer birden fazla Wallarm düğümü konuşlandırıyorsanız"
    Ortamınıza konuşlandırılmış olan tüm Wallarm düğümleri **aynı sürümlerde** olmalıdır. Ayrı sunuculara kurulmuş olan postanalytics modülleri de **aynı sürümlerde** olmalıdır.

    Ek bir düğümün kurulumundan önce, lütfen sürümünün zaten konuşlandırılan modüllerin sürümüyle eşleştiğinden emin olun. Eğer konuşlandırılmış modül sürümü [yakında kullanımdan kaldırılacak veya kullanımdan kaldırılmış (`4.0` veya daha düşük)][versioning-politikası], tüm modülleri en son sürüme yükseltin.

    Konuşlandırılan Wallarm filtreleme düğümü görüntüsünün sürümü, İmplantasyon şablonunda → `spec.template.spec.containers` bölümünde → Wallarm konteynerinin `image` tarafından belirtilmiştir.