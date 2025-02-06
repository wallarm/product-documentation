```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.0.0-3
     pullPolicy: Always
  # Wallarm API uç noktası: 
  # AB Cloud için "api.wallarm.com"
  # ABD Cloud için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # Deploy rolüne sahip kullanıcının şifresi
  deploy_password: "password"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer ana uygulama konteynerinizin ports.containerPort tanımına
  # tam olarak uymalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # "off" istek işlemenin devre dışı bırakılmasını sağlar
  # "monitoring" istekleri işler ancak engellemez
  # "safe_blocking" gri listeye alınmış IP'lerden gelen kötü niyetli istekleri engeller
  # "block" tüm istekleri işleyip kötü niyetlileri engeller
  mode: "block"
  # İstek analiz verileri için ayrılan GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
```