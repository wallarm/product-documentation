```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.2.1-1
     pullPolicy: Her zaman
  # Wallarm API bitiş noktası: 
  # Avrupa Bulutu için "api.wallarm.com"
  # Amerika Bulutu için "us1.api.wallarm.com"
  wallarm_host_api: "api.wallarm.com"
  # Yayın rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "kullanıcı adı"
  # Yayın rolüne sahip kullanıcının şifresi
  deploy_password: "şifre"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değer, ana uygulama konteynerinizin tanımındaki ports.containerPort ile aynı olmalıdır
  app_container_port: 80
  # İstek filtreleme modu:
  # İstek işlemeyi devre dışı bırakmak için "kapalı"
  # İstekleri işlemek ama engellememek için "izleme"
  # Gri listeye alınan IP'lerden gelen zararlı istekleri engellemek için "güvenli_engelleme"
  # Tüm istekleri işlemek ve zararlı olanları engellemek için "engelle"
  mode: "engelle"
  # İstek analitik verileri için GB cinsinden hafıza miktarı
  tarantool_memory_gb: 2
```