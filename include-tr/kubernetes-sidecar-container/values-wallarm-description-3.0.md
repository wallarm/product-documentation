wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # "api.wallarm.com" EU Cloud için
  # "us1.api.wallarm.com" US Cloud için
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # Deploy rolüne sahip kullanıcının parolası
  deploy_password: "password"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer ana uygulama konteynerinizin tanımındaki ports.containerPort ile aynı olmalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # İstek işlemeyi devre dışı bırakmak için "off"
  # İstekleri işlemek ancak engellememek için "monitoring"
  # Gri listeye alınmış IP adreslerinden gelen kötü amaçlı istekleri engellemek için "safe_blocking"
  # Tüm istekleri işlemek ve kötü amaçlı olanları engellemek için "block"
  mode: "block"
  # İstek analitiği verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2