```yaml
wallarm:
  image:
     repository: wallarm/node
     tag: 2.18.1-5
     pullPolicy: Always
  # Wallarm API uç noktası:
  # "api.wallarm.com" - EU Cloud için
  # "us1.api.wallarm.com" - US Cloud için
  wallarm_host_api: "api.wallarm.com"
  # Deploy rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "username"
  # Deploy rolüne sahip kullanıcının şifresi
  deploy_password: "password"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer, ana uygulama konteynerinizin tanımında bulunan ports.containerPort ile aynı olmalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # "off" isteğe ilişkin işlemi devre dışı bırakmak için
  # "monitoring" isteği işleyip engellememek için
  # "block" tüm istekleri işleyip kötü amaçlı olanları engellemek için
  mode: "block"
  # İstek analiz verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
  # IP Engelleme işlevselliğini etkinleştirmek için "true" olarak ayarlayın
  enable_ip_blocking: "false"
```