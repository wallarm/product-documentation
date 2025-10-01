Postanalytics, bellek içi depolama wstore’u kullanır. wstore veritabanı, bir filtreleme düğümü tarafından işlenen veri akışının yerel bir kopyasını dairesel bir arabellekte tutmak için kullanılır; buna istek/yanıt üstbilgileri ve istek gövdeleri dahildir (ancak yanıt gövdeleri dahil değildir).

Bir filtreleme düğümünü verimli kılmak için veritabanının, veri serileştirme için yaklaşık 2x ek yükle birlikte, en az 15 dakikalık iletilen veriyi tutması gerekir. Bu noktalara göre, bellek miktarı şu formülle tahmin edilebilir:

```
Dakika başına bayt cinsinden istek işleme hızı * 15 * 2
```

Örneğin, bir filtreleme düğümü tepe noktada son kullanıcı isteklerinde 50 Mbps işliyorsa, gerekli wstore veritabanı bellek tüketimi aşağıdaki gibi tahmin edilebilir:

```
50 Mbps / 8 (bir baytta bit sayısı) * 60 (bir dakikadaki saniye sayısı) * 15 * 2 = 11,250 MB (ya da ~ 11 GB)
```