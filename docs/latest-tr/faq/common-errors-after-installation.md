# Wallarm düğümünün kurulumu sonrası hatalar

Eğer Wallarm düğümünün kurulumu sonrası bazı hatalar meydana gelirse, bunları çözümlemek için bu sorun giderme kılavuzunu kontrol edin. Eğer burada ilgili detayları bulamadıysanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.

## Dosya İndirme Senaryoları Başarısız Oluyor

Eğer bir filtre düğümünün kurulumundan sonra dosya indirme senaryolarınız başarısız olursa, sorun, Wallarm yapılandırma dosyasındaki `client_max_body_size` yönergesinde belirlenen limiti aşan istek boyutundadır.

Dosya yüklemelerini kabul eden adres için `location` yönergesindeki `client_max_body_size` değerini değiştirin. Sadece `location` değerini değiştirmek, ana sayfanın büyük istekler almasını engeller.

`client_max_body_size` değerini değiştirin:

1. `/etc/nginx-wallarm` dizinindeki yapılandırma dosyasını düzenlemek üzere açın.
2. Yeni değeri girin:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` dosya yüklemelerini kabul eden adrestir.

Yönerge hakkında detaylı açıklama, [resmi NGINX belgelerinde](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size) mevcuttur.

## "wallarm-node için imzalar doğrulanamadı", "yum devam etmek için yeterli önbelleğe sahip değil", "imzalar doğrulanamadı" hatalarını nasıl düzeltebilirim?

Eğer Wallarm RPM veya DEB paketleri için GPG anahtarları süresi dolmuşsa, aşağıdaki hata mesajlarını alabilirsiniz:

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] repomd.xml imzası wallarm-node_3.6 için doğrulanamadı

Yapılandırılmış depolardan biri başarısız oldu (Wallarm Node for CentOS 7 - 3.6),
ve yum devam etmek için yeterli önbelleğe sahip değil.

W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: The following signatures
couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

Problemi **Debian veya Ubuntu** üzerinde düzeltmek için lütfen adımları takip edin:

1. Wallarm paketleri için yeni GPG anahtarlarını içe aktarın:

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. Wallarm paketlerini güncelleyin:

	```bash
	sudo apt update
	```

Problemi **CentOS** üzerinde düzeltmek için lütfen adımları takip edin:

1. Daha önce eklenmiş olan depoyu kaldırın:

	```bash
	sudo yum remove wallarm-node-repo
	```
2. Önbelleği temizleyin:

	```bash
	sudo yum clean all
	```
3. Uygun CentOS ve Wallarm düğüm sürümleri için komutu kullanarak yeni bir depo ekleyin:

	=== "CentOS 7.x veya Amazon Linux 2.0.2021x ve altı"
		```bash
		# Filtreleme düğümü ve postanalytics modülü 4.4 sürümü
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# Filtreleme düğümü ve postanalytics modülü 4.6 sürümü
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm

		# Filtreleme düğümü ve postanalytics modülü 4.8 sürümü
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
		```
	=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
		```bash
		# Filtreleme düğümü ve postanalytics modülü 4.4 sürümü
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# Filtreleme düğümü ve postanalytics modülü 4.6 sürümü
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm

		# Filtreleme düğümü ve postanalytics modülü 4.8 sürümü
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
		```		
4. Gerektiğinde işlemi onaylayın.

## Filtreleme düğümü engelleme modunda (`wallarm_mode block`) çalışırken neden saldırıları engellemiyor?

`wallarm_mode` yönergesini kullanmak, trafik filtrasyon modu yapılandırmasının sadece birkaç yönteminden biridir. Bu yapılandırma yöntemlerinden bazıları, `wallarm_mode` yönergesinin değerinden daha yüksek bir önceliğe sahiptir.

Eğer `wallarm_mode block` üzerinden engelleme modunu yapılandırdıysanız ancak Wallarm filtreleme düğümü saldırıları engellemiyorsa, lütfen filtrasyon modunun diğer yapılandırma yöntemleri kullanılarak geçersiz kılınmadığından emin olun:

* [**Filtrasyon modunu ayarla** kurallarını](../user-guides/rules/wallarm-mode-rule.md) kullanarak
* Wallarm Console'un [**Genel** bölümünde](../user-guides/settings/general.md)

[Filtrasyon modu yapılandırma yöntemleri hakkında daha fazla detay →](../admin-en/configure-parameters-en.md)