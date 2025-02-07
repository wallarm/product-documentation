```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # Wallarm API noktası:
  # EU Cloud için "api.wallarm.com"
  # US Cloud için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Wallarm düğüm tokeni
  wallarm_api_token: "token"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değerin ana uygulama konteyner tanımındaki
  # ports.containerPort ile aynı olması gerekir
  app_container_port: 80
  # İstek filtreleme modu:
  # İşlemeyi devre dışı bırakmak için "off"
  # İstekleri işleyip engellemeden "monitoring"
  # Graylisted IP'lerden kaynaklanan kötü niyetli istekleri engellemek için "safe_blocking"
  # Tüm istekleri işleyip kötü niyetlileri engellemek için "block"
  mode: "block"
  # İstek analiz verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
```