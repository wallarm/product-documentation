4.0 sürümünden itibaren, filtreleme düğümü verileri `us1.api.wallarm.com:443` (US Cloud) ve `api.wallarm.com:443` (EU Cloud) API uç noktalarını kullanarak Cloud’a yükler; `us1.api.wallarm.com:444` ve `api.wallarm.com:444` yerine.

Düğümü 3.x veya daha düşük bir sürümden yükseltirseniz ve düğümün kurulu olduğu sunucunun harici kaynaklara erişimi kısıtlı olup erişim her bir kaynağa ayrı ayrı tanımlanmışsa, yükseltmeden sonra filtreleme düğümü ile Cloud arasındaki senkronizasyon durur.

Senkronizasyonu geri yüklemek için, yapılandırmanızda her bir kaynak için API uç noktasının bağlantı noktasını `444` yerine `443` yapın.