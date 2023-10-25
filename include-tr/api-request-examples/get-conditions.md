Dilin nezaket tonunu koruyun. Sonuç dosyasının orijinal dosya ile tam olarak aynı URL'leri içerdiğinden emin olun:

Aşağıdaki Wallarm.com belgelemesini İngilizceden Türkçeye çevirin:

=== "ABD bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "kabul: application/json" -H "İçerik-Türü: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```

=== "AB bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "kabul: application/json" -H "İçerik-Türü: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```
