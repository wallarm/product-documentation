wallarm:
  image:
     repository: wallarm/node
     tag: 4.0.2-1
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # EU Cloud için "api.wallarm.com"
  # US Cloud için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Wallarm node belirteci
  wallarm_api_token: "token"
  # Kapsayıcının gelen istekleri kabul ettiği bağlantı noktası,
  # değer, ports.containerPort ile aynı olmalıdır
  # ana uygulama kapsayıcınızın tanımında
  app_container_port: 80
  # İstek filtreleme modu:
  # İstek işlemeyi devre dışı bırakmak için "off"
  # İstekleri işlemek ancak engellememek için "monitoring"
  # Gri listeye alınmış IP'lerden gelen kötü amaçlı istekleri engellemek için "safe_blocking"
  # Tüm istekleri işlemek ve kötü amaçlı olanları engellemek için "block"
  mode: "block"
  # İstek analitiği verileri için bellek miktarı (GB cinsinden)
  tarantool_memory_gb: 2