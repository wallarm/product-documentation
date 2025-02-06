# Filtreleme Düğümü İşleyişini Kontrol Etme

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

Her şey doğru yapılandırılmışsa, Wallarm istekleri filtreler ve yapılandırma dosyası ayarlarına uygun olarak filtrelenen istekleri proxy'ler.

Doğru işleyişi kontrol etmek için şunları yapmalısınız:

1. `wallarm-status` isteğini çalıştırın.
2. Test saldırısı gerçekleştirin.

    
## 1. `wallarm-status` isteğini çalıştırın

`/wallarm-status` URL'sine istek göndererek filtreleme düğümü istatistiklerine ulaşabilirsiniz.

Aşağıdaki komutu çalıştırın:

```
curl http://127.0.0.8/wallarm-status
```

Çıktı şu şekilde olacaktır:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

Bu, filtreleme düğümü istatistik servisinin çalıştığı ve düzgün şekilde işlediği anlamına gelir.

!!! info "İstatistik Servisi"
    İstatistik servisi ve nasıl yapılandırılacağı hakkında daha fazla bilgiyi [buradan][doc-stat-service] okuyabilirsiniz.

## 2. Test saldırısı gerçekleştirin

Wallarm'ın saldırıları doğru şekilde tespit edip etmediğini kontrol etmek için, korunmakta olan kaynağa kötü niyetli bir istek gönderin.

Örneğin:

```
http://<resource_URL>/etc/passwd
```

Wallarm, istekte [Path Traversal](../attacks-vulns-list.md#path-traversal) tespit etmelidir.

Artık `wallarm-status` isteği çalıştırıldığında saldırı sayacı artacak, bu da filtreleme düğümünün normal çalıştığını gösterir.

Wallarm filtreleme düğümü ayarları hakkında daha fazla bilgi edinmek için [Configuration options][doc-configure-parameters] bölümüne bakın.