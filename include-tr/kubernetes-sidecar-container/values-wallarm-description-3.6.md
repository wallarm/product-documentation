wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # "api.wallarm.com" EU Cloud için
  # "us1.api.wallarm.com" US Cloud için
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # Deploy rolüne sahip kullanıcının parolası
  deploy_password: "password"
  # Kapsayıcının gelen istekleri kabul ettiği bağlantı noktası,
  # değerin ports.containerPort ile aynı olması gerekir
  # ana uygulama kapsayıcınızın tanımında
  app_container_port: 80
  # İstek filtreleme modu:
  # "off" istek işlemesini devre dışı bırakmak için
  # "monitoring" istekleri işlemek ancak engellememek için
  # "safe_blocking" gri listeye alınmış IP'lerden gelen kötü amaçlı istekleri engellemek için
  # "block" tüm istekleri işlemek ve kötü amaçlı olanları engellemek için
  mode: "block"
  # İstek analitiği verileri için bellek miktarı (GB cinsinden)
  tarantool_memory_gb: 2