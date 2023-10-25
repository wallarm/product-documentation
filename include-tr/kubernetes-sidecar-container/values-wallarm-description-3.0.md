```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Her zaman
  # Wallarm API uç noktası: 
  # EU Cloud için "api.wallarm.com" 
  # US Cloud için "us1.api.wallarm.com" 
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "kullanıcı adı"
  # Deploy rolüne sahip kullanıcının şifresi
  deploy_password: "şifre"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer, ana uygulama konteynırınızın tanımındaki ports.containerPort ile aynı olmalıdır 
  app_container_port: 80
  # İstek filtrasyon modu:
  # istek işlemeyi devre dışı bırakmak için "off"
  # istekleri işlemek ama engellememek için "monitoring"
  # gri listeye alınan IP'lerden gelen zararlı istekleri engellemek için "safe_blocking" 
  # tüm istekleri işleyip zararlı olanları engellemek için "block"
  mode: "block"
  # İstek analitik verileri için GB cinsinden bellek miktarı 
  tarantool_memory_gb: 2
```
