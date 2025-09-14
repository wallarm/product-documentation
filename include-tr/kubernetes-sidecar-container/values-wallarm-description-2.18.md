```
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # EU Cloud için "api.wallarm.com"
  # US Cloud için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # "Deploy" rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # "Deploy" rolüne sahip kullanıcının parolası
  deploy_password: "password"
  # Kapsayıcının gelen istekleri kabul ettiği bağlantı noktası,
  # değer, ana uygulama kapsayıcınızın tanımındaki
  # ports.containerPort ile aynı olmalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # "off" istek işlemeyi devre dışı bırakmak için
  # "monitoring" istekleri işlemek ama engellememek için
  # "block" tüm istekleri işlemek ve kötü amaçlı olanları engellemek için
  mode: "block"
  # İstek analizi verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
  # "IP Blocking" işlevini etkinleştirmek için "true" olarak ayarlayın
  enable_ip_blocking: "false"
```