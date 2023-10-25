```
wallarm:
  resim:
     deposu: wallarm/node
     etiket: 2.18.1-5
     pullPolicy: Her zaman
  # Wallarm API uç noktası: 
  # "api.wallarm.com" AB Bulutu için
  # "us1.api.wallarm.com" ABD Bulutu için
  wallarm_host_api: "api.wallarm.com"
  # Mevduat görevine sahip kullanıcının adı
  deploy_username: "kullanıcı_adı"
  # Dağıtım rolune sahip kullanıcının şifresi
  deploy_password: "şifre"
  # Konteynerin gelen istekleri kabul ettiği port,
  # değerin ports.containerPort ile
  # ana uygulama konteynerinizin tanımına aynı olması gerekir
  app_container_port: 80
  # İstek filtreleme modu:
  # İsteği işlemeyi devre dışı bırakmak için "kapalı"
  # İstekleri işleyin fakat engellemeyin "izleme"
  # Kötü amaçlı olanları engellemek için tüm istekleri işleyin "engelle"
  mod: "engelle"
  # İstek analiz verileri için GB cinsinden bellek miktarı
  tarantool_memory_gb: 2
  # IP Engelleme işlevini etkinleştirmek için "doğru" olarak ayarlayın
  enable_ip_blocking: "yanlış"
```