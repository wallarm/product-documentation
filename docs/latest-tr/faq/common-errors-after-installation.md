# Son Kullanıcı Sorun Giderme

NGINX Wallarm düğümü kurulumu sonrasında bazı hatalar oluşursa, bunları gidermek için bu sorun giderme kılavuzunu kontrol edin. Burada ilgili ayrıntıları bulamazsanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Kullanıcı dosya indiremiyor

Filtre düğümü kurduktan sonra dosya indirme senaryolarınız başarısız oluyorsa, sorun, istek boyutunun Wallarm yapılandırma dosyasındaki `client_max_body_size` yönergesinde belirlenen sınırı aşmasıdır.

Dosya yüklemelerini kabul eden adres için `location` yönergesinde `client_max_body_size` değerini değiştirin. Yalnızca ilgili `location` içindeki değeri değiştirmek, ana sayfanın büyük istekler almasını önler.

`client_max_body_size` değerini değiştirin:

1. Düzenlemek üzere `/etc/nginx/sites-enabled/default` dosyasını açın (Docker konteyneri çalıştırıyorsanız `/etc/nginx/http.d/default.conf`).
2. Yeni değeri girin:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	`/file/upload`, dosya yüklemelerini kabul eden adrestir.

Yönergenin ayrıntılı açıklaması [resmi NGINX dokümantasyonunda](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) mevcuttur.