Ortam değişkeni | Açıklama| Gerekli
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm düğümü veya API belirteci. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` ABD Bulutu için</li><li>`api.wallarm.com` AB Bulutu için</li></ul>Varsayılan olarak: `api.wallarm.com`. | Hayır
`WALLARM_LABELS` | <p>Düğüm 4.6'dan itibaren kullanılabilir. Yalnızca `WALLARM_API_TOKEN`, `Deploy` rolüne sahip [API belirteci][api-token] olarak ayarlandığında çalışır. Düğüm örneği gruplandırması için `group` etiketini ayarlar, örneğin:</p> <p>`WALLARM_LABELS="group=<GRUP>"`</p> <p>...düğüm örneğini mevcut olan `<GRUP>` örneği grubuna yerleştirir veya mevcut değilse, oluşturulur.</p> | Evet (API belirteçleri için)