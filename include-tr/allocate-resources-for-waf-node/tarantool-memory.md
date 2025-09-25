Postanalytics, bellek içi depolama Tarantool'u kullanır. Tarantool veritabanı, bir filtreleme düğümü tarafından işlenen veri akışının, istek/yanıt başlıkları ve istek gövdeleri (ancak yanıt gövdeleri değil) dahil olmak üzere, yerel bir kopyasını dairesel bir arabellekte tutmak için kullanılır. 

Bir filtreleme düğümünü verimli kılmak için, veritabanı veri serileştirme için yaklaşık 2x ek yük ile en az 15 dakikalık iletilen veriyi saklamalıdır. Bu noktalar dikkate alındığında, bellek miktarı şu formülle tahmin edilebilir:

```
Dakikada bayt cinsinden istek işleme hızı * 15 * 2
```

Örneğin, bir filtreleme düğümü uç kullanıcı isteklerinde tepe noktada 50 Mbps işliyorsa, gerekli Tarantool veritabanı bellek tüketimi aşağıdaki gibi tahmin edilebilir:

```
50 Mbps / 8 (bir bayttaki bit sayısı) * 60 (bir dakikadaki saniye sayısı) * 15 * 2 = 11,250 MB (veya ~ 11 GB)
```