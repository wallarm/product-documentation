# NGINX Wallarm node kurulumu sonrasında hatalar

NGINX Wallarm node kurulumu sonrasında bazı hatalar meydana gelirse, bunları gidermek için bu sorun giderme kılavuzunu inceleyin. Eğer burada ilgili detayları bulamazsanız, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.

## Dosya İndirme Senaryoları Başarısız

Filtre node kurulumu sonrasında dosya indirme senaryolarınız başarısız oluyorsa, sorun, dosya isteğinin Wallarm yapılandırma dosyasındaki `client_max_body_size` yönergesinde belirlenen limiti aşmasından kaynaklanmaktadır.

Yükleme taleplerini kabul eden adres için `location` yönergesinde `client_max_body_size` değerini değiştirin. Sadece `location` değerini değiştirmek, ana sayfanın büyük isteklerden korunmasını sağlar.

`client_max_body_size` değerini değiştirin:

1. `/etc/nginx/sites-enabled/default` dosyasını düzenleme için açın.
2. Yeni değeri ekleyin:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	`/file/upload` dosya yüklemelerini kabul eden adrestir.

Detaylı yönerge açıklaması [official NGINX documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) sayfasında mevcuttur.

## Neden filtering node, blocking mode'da çalışırken (`wallarm_mode block`) saldırıları engellemiyor?

`wallarm_mode` yönergesinin kullanılması, trafik filtrasyonu modunun yapılandırılmasının birkaç yönteminden sadece biridir. Bu yapılandırma yöntemlerinden bazıları, `wallarm_mode` yönergesindeki değerden daha yüksek önceliğe sahiptir.

`wallarm_mode block` ile engelleme modu yapılandırılmış olmasına rağmen Wallarm filtering node saldırıları engellemiyorsa, lütfen filtrasyon modunun diğer yapılandırma yöntemleriyle geçersiz kılınmadığından emin olun:

* [Wallarm Console'da **Set filtration mode** kuralını](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
* [Wallarm Console’un **General** bölümünde](../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)

[Filtrasyon modu yapılandırma yöntemleri hakkında daha fazla detay →](../admin-en/configure-parameters-en.md)