```
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Her zaman
  # Wallarm API endpoint: 
  # "api.wallarm.com" Avrupa Bulutu için
  # "us1.api.wallarm.com" ABD Bulutu için
  wallarm_host_api: "api.wallarm.com"
  # Wallarm düğümü tokeni
  wallarm_api_token: "token"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değeri ports.containerPort ile aynı olmalıdır
  # ana uygulama konteynerinizin tanımında
  app_container_port: 80
  # İstek filtreleme modu:
  # İstek işlemeyi devre dışı bırakmak için "off"
  # Istekleri işleyip bloklamamak için "monitoring"
  # Gri listelenmiş IP'lerden kaynaklanan zararlı istekleri engellemek için "safe_blocking"
  # Tüm istekleri işlemek ve zararlı olanları engellemek için "block"
  mode: "block"
  # İstek analiz verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
```