# Filtreleme düğümünün çalışmasını kontrol etme

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

Her şey doğru bir şekilde yapılandırıldıysa, Wallarm istekleri filtreler ve filtrelenmiş istekleri yapılandırma dosyası ayarlarına uygun olarak proxyler.

Doğru çalışmayı kontrol etmek için:

1. `wallarm-status` isteğini çalıştırın.
2. Bir test saldırısı başlatın.

## 1. `wallarm-status` isteğini çalıştırın

`/wallarm-status` URL'sini isteyerek filtreleme düğümü işlem istatistiklerini alabilirsiniz.

Komutu çalıştırın:

```
curl http://127.0.0.8/wallarm-status
```

Çıktı aşağıdaki gibi olacaktır:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

Bu, filtreleme düğümü istatistik servisinin çalıştığını ve düzgün bir şekilde çalıştığını göstermektedir.

!!! Bilgi "The statistics service"
    İstatistik servisi hakkında ve nasıl yapılandırılacağı hakkında daha fazla bilgiyi [burada][doc-stat-service] bulabilirsiniz.

## 2. Bir Test Saldırısı Başlatın

Wallarm'ın saldırıları doğru bir şekilde tespit edip edemediğini kontrol etmek için, korunan kaynağa kötü amaçlı bir istekte bulunun.

Örneğin:

```
http://<kaynak_URL>/etc/passwd
```

Wallarm, istekte [Path Traversal](../attacks-vulns-list.md#path-traversal) tespit etmelidir.

Şimdi `wallarm-status` isteği gerçekleştirildiğinde saldırı sayısının sayacı artacak, bu da filtreleme düğümünün normal şekilde çalıştığını göstermektedir.

Wallarm filtreleme düğümü ayarları hakkında daha fazla bilgi edinmek için, [Yapılandırma seçenekleri][doc-configure-parameters] bölümüne bakın.