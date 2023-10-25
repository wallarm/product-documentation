```
wallarm:
  image:
     repository: wallarm/node
     tag: 3.6.2-1
     pullPolicy: Her zaman
  # Wallarm API bit noktası: 
  # "api.wallarm.com" Avrupa Bulutu için
  # "us1.api.wallarm.com" Amerika Bulutu için
  wallarm_host_api: "api.wallarm.com"
  # Dağıtım rolüne sahip kullanıcının kullanıcı adı
  deploy_username: "KullaniciAdi"
  # Dağıtım rolüne sahip kullanıcının şifresi
  deploy_password: "sifre"
  # Konteynırın gelen istekleri kabul ettiği port,
  # bu değerin, ana uygulamanızın konteynırı tanımındaki ports.containerPort'a tam olarak eşit olması gerekmektedir
  app_container_port: 80
  # İstek filtreleme modu:
  # İstek işlemeyi devre dışı bırakmak için "off"
  # İstekleri işlemek ama onları engellememek için "monitoring"
  # Gri listeye alınmış IP'lerden gelen kötü niyetli istekleri engellemek için "safe_blocking"
  # Tüm istekleri işleyip kötü niyetli olanları engellemek için "block"
  mode: "block"
  # İstek analitiği verileri için bellektaki GB cinsinden miktar
  tarantool_memory_gb: 2
```
