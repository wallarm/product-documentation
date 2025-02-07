Environment variable | Açıklama | Gerekli
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node veya API jetonu. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>Varsayılan olarak: `api.wallarm.com`. | Hayır
`WALLARM_LABELS` | <p>node 4.6 ve sonrasında kullanılabilir. Yalnızca `WALLARM_API_TOKEN` [API token][api-token] ile `Deploy` rolü atandıysa çalışır. Node örnek gruplaması için `group` etiketini ayarlar, örneğin:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...node örneğini `<GROUP>` örnek grubuna yerleştirir (varsa mevcut, yoksa oluşturulur).</p> | Evet (API jetonları için)