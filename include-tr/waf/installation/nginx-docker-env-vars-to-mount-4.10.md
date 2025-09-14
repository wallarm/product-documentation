Ortam değişkeni | Açıklama| Gerekli
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm düğümü veya API belirteci. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul>Varsayılan olarak: `api.wallarm.com`. | Hayır
`WALLARM_LABELS` | <p>Düğüm 4.6'dan itibaren kullanılabilir. Yalnızca `WALLARM_API_TOKEN` `Deploy` rolüne sahip [API belirteci][api-token] olarak ayarlanmışsa çalışır. Düğüm örneklerini gruplamak için `group` etiketini ayarlar, örneğin:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...düğüm örneğini `<GROUP>` örnek grubuna yerleştirir (varsa mevcut olana, yoksa oluşturulur).</p> | Evet (API belirteçleri için)