Versiyon 4.0 ile başlayarak, filtreleme düğümü `us1.api.wallarm.com:443` (US Cloud) ve `api.wallarm.com:443` (EU Cloud) API uç noktalarını, `us1.api.wallarm.com:444` ve `api.wallarm.com:444` yerine bulut'a veri yükler.

Eğer düğümü sürüm 3.x veya daha düşük bir versiyondan yükseltir ve konuşlandırılmış düğümün bulunduğu sunucunuzun dış kaynaklara sınırlı erişimi varsa ve erişim her kaynak için ayrı ayrı verilmişse, yükseltme sonrası filtreleme düğümü ve bulut arasındaki senkronizasyon durur.

Senkronizasyonu geri yüklemek için, yapılandırmanızdaki her kaynak için API uç noktası için `444` portunu `443` ile değiştirin.