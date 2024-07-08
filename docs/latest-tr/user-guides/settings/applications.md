# Uygulamaları Ayarlama

Eğer şirketinizde birden fazla uygulamanız varsa, tüm şirketin trafiğinin istatistiklerini görmekten öte, her bir uygulama için istatistikleri ayrı ayrı görmenin çok kullanışlı olabileceğini fark edebilirsiniz. Trafikleri uygulamalar arasında ayırmak için Wallarm sistemindeki "uygulama" varlığını kullanabilirsiniz.

!!! uyarı "CDN düğümü için uygulama konfigürasyonunun desteklenmesi"
    Uygulamaları [Wallarm CDN düğümleri](../../installation/cdn-node.md) için yapılandırmak üzere [Wallarm destek ekibi](mailto:support@wallarm.com)nden talepte bulunun.

Uygulamaları kullanmak sizin:
  
* Her bir uygulama için etkinlikleri ve istatistikleri ayrı ayrı görmeyi
* Belirli uygulamalar için [tetikleyicileri](../triggers/triggers.md), [kuralları](../rules/rules.md) ve diğer Wallarm özelliklerini yapılandırmayı
* [Wallarm'ı ayrı ortamlarda](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) yapılandırmayı

sağlar.

Wallarm'ın uygulamalarınızı tanıması için, onlara düğüm konfigürasyonundaki uygun direktif aracılığıyla benzersiz tanımlayıcılar atamanız gereklidir. Tanımlayıcılar, hem uygulama alanlarına hem de alan yollarına ayarlanabilir.

Varsayılan olarak, Wallarm her uygulamanın `-1` kimliği (ID) olan `default` uygulama olduğunu kabul eder.

## Bir uygulama eklemek

1. (İsteğe Bağlı) Bir uygulamayı Wallarm Console → **Settings** → **Applications**'a ekleyin.

    ![Bir uygulama eklemek](../../images/user-guides/settings/configure-app.png)

    !!! uyarı "Yönetici erişimi"
        Yalnızca **Administrator** rolüne sahip kullanıcılar **Settings** → **Applications** bölümüne erişebilir.
2. Bir uygulamaya düğüm konfigürasyonu üzerinden benzersiz bir kimlik atayın:

    * Wallarm, NGINX module, cloud marketplace image, NGINX-based Docker container where the configuration file is mounted, or a sidecar container olarak kurulduysa [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) direktifi.
    * Wallarm kurulumu, NGINX tabanlı bir Docker konteyneri olarak yapıldıysa [çevre değişkeni](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION`.
    * Wallarm, Ingress controller olarak kurulmuşsa [Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application`.
    * Wallarm, configuration file mounted olan bir Envoy tabanlı Docker konteyneri olarak kurulmuşsa [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) parametresi.

    Değer, `0` hariç olumlu bir tam sayı olabilir.

    Belirtilen kimlikle bir uygulama Wallarm Console → **Settings** → **Applications**'a eklenmemişse, otomatik olarak listeye eklenecektir. Uygulama adı, belirtilen tanımlayıcıya dayanarak otomatik olarak oluşturulacaktır (örneğin, ID'si `-1` olan uygulama için `Application #1`). Ad, daha sonra Wallarm Console üzerinden değiştirilebilir.

Uygulama doğru şekilde yapılandırılmışsa, bu uygulamaya yönelik saldırıların ayrıntılarında adı görüntülenir. Uygulama konfigürasyonunuzu test etmek için, uygulama adresine [test saldırısı](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) gönderebilirsiniz.

## Otomatik uygulama tanımlama

Şunun temelinde otomatik bir uygulama tanımlama ayarlayabilirsiniz:

* Belirli istek başlıkları
* `map` NGINX directive kullanarak belirli bir istek başlığı veya URL'lerin parçası

!!! bilgi "Sadece NGINX"
    Listelenen yaklaşımlar sadece NGINX tabanlı düğüm dağıtımları için geçerlidir.

### Belirli istek başlıklarına dayalı uygulama tanımlama

Bu yaklaşım iki adımdan oluşur:

1. Ağı, her isteğe uygulama kimliği ile başlık ekleyecek şekilde yapılandırın.
1. Bu başlığın değerini `wallarm_application` direktifi için değer olarak kullanın. Aşağıdaki örneğe bakın.

NGINX configuration file (`/etc/nginx/default.conf`) örneği:

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

Saldırı isteği örneği:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

Bu istek, şunları yapar:

* Bir saldırı olarak kabul edilir ve **Events** bölümüne eklenir.
* Kimliği `222` olan uygulama ile ilişkilendirilir.
* Eşleşen bir uygulama yoksa, **Settings** → **Applications**'a eklenir ve otomatik olarak `Application #222` olarak adlandırılır.

![Başlık isteğinin temelinde bir uygulama eklemek](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINX directive'ini kullanarak belirli bir istek başlığı veya URL'lerin parçasına dayalı uygulama tanımlama 

Belirli bir istek başlığı veya bitiş noktası URL'lerinin parçasına dayalı uygulamalar ekleyebilir ve bunun için `map` NGINX directive'ini kullanabilirsiniz. Directive'ın ayrıntılı açıklamasını NGINX [belgelerinde](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) bulabilirsiniz.

## Bir uygulamayı silme

Uygulamayı Wallarm sisteminden silmek için, uygun directive'ı düğüm konfigürasyon dosyasından silin. Eğer uygulama yalnızca **Settings** → **Applications** bölümünden silinirse, listeye geri yüklenir.