Starting with version 4.0, the filtering node uploads data to the Cloud using the `us1.api.wallarm.com:443` (US Cloud) and `api.wallarm.com:443` (EU Cloud) API endpoints instead of `us1.api.wallarm.com:444` and `api.wallarm.com:444`.
Sürüm 4.0'dan itibaren, filtering node, `us1.api.wallarm.com:444` ve `api.wallarm.com:444` yerine `us1.api.wallarm.com:443` (US Cloud) ve `api.wallarm.com:443` (EU Cloud) API uç noktalarını kullanarak Buluta veri yüklüyor.

If you upgrade the node from the version 3.x or lower and your server with the deployed node has a limited access to the external resources and the access is granted to each resource separately, then after upgrade the synchronization between the filtering node and the Cloud will stop.
Eğer node'u sürüm 3.x veya daha düşük bir sürümden yükselttiyseniz ve node'un yüklü olduğu sunucunuzun harici kaynaklara erişimi sınırlıysa ve bu erişim her kaynak için ayrı ayrı tanımlanmışsa, yükseltmeden sonra filtering node ile Bulut arasındaki senkronizasyon kesilecektir.

To restore the synchronization, in your configuration, change port `444` to `443` for API endpoint for each resource.
Senkronizasyonu yeniden sağlamak için, konfigürasyonunuzda, her kaynak için API uç noktasında port `444`'ü `443` olarak değiştirin.