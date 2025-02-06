```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # EU Cloud için "api.wallarm.com"
  # US Cloud için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # Deploy rolüne sahip kullanıcının şifresi
  deploy_password: "password"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer, ana uygulama konteynerinizin ports.containerPort
  # tanımındaki ile aynı olmalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # "off": istek işlemesini devre dışı bırakır
  # "monitoring": istekleri işler ancak engellemez
  # "safe_blocking": graylisted IP'lerden kaynaklanan kötü niyetli istekleri engeller
  # "block": tüm istekleri işler ve kötü niyetlileri engeller
  mode: "block"
  # İstek analiz verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
```