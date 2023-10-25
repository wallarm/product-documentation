Postanalytics, bellek depolama Tarantool'u kullanır. Tarantool veritabanı, bir filtreleme düğümüm tarafından işlenen veri akışının yerel bir kopyasını, istek/yanıt başlıklarını ve istek gövdelerini (ancak yanıt gövdelerini değil) dairesel bir tamponda tutmak için kullanılır.

Bir filtreleme düğümünün verimli olmasını sağlamak için, veritabanının veri serileştirmesi için yaklaşık 2x fazladan olmak üzere iletilen verinin en az 15 dakikasını saklaması gerekmektedir. Bu noktaları takip edersek, bellek miktarı aşağıdaki formülle tahmin edilebilir:

```
Dakikada bayt cinsinden istek işleme hızı * 15 * 2
```

Örneğin, bir filtreleme düğümü zirvede son kullanıcı isteklerinin 50 Mbps'sini işliyorsa, gerekli Tarantool veritabanı bellek tüketimi şu şekilde tahmin edilebilir:

```
50 Mbps / 8 (bir bayttaki bit sayısı) * 60 (bir dakikadaki saniye sayısı) * 15 * 2 = 11,250 MB (veya ~ 11 GB)
```