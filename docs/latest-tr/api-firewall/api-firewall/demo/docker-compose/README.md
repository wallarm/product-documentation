# Docker Compose ile Wallarm API Firewall demosu

Bu demo, uygulamayı [**httpbin**](https://httpbin.org/) ve Wallarm API Firewall'u **httpbin** API'sini koruyacak bir proxy olarak dağıtır. Tüm bu uygulamalar Docker kapsayıcıları içinde çalışır ve Docker Compose kullanılarak birbirine bağlanır.

## Sistem gereksinimleri

Bu demo'yu çalıştırmadan önce, sisteminizin aşağıdaki gereksinimleri karşıladığından emin olun:

* [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/) veya [Linux](https://docs.docker.com/engine/install/#server) için yüklenmiş Docker Engine 20.x veya sonrası
* Yüklenmiş [Docker Compose](https://docs.docker.com/compose/install/)
* [Mac](https://formulae.brew.sh/formula/make), [Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download) veya Linux (uyumlu paket yönetim programları kullanılarak) için yüklenmiş **make**

## Kullanılan kaynaklar

Bu demo'da aşağıda belirtilen kaynaklar kullanılır:

* [**httpbin** Docker imajı](https://hub.docker.com/r/kennethreitz/httpbin/)
* [API Firewall Docker imajı](https://hub.docker.com/r/wallarm/api-firewall)

## Demo kodu açıklaması

[Demo kodu](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose) aşağıdaki yapılandırma dosyalarını içerir:

* `volumes` dizininde bulunan aşağıdaki OpenAPI 3.0 şartnameleri: 
    * `httpbin.json`, [**httpbin** OpenAPI 2.0 şartnamesi](https://httpbin.org/spec.json)'nin OpenAPI 3.0 şartnamesi biçimine dönüştürülmüş halidir. 
    * `httpbin-with-constraints.json`, ek API kısıtlamaları açık bir şekilde ekli **httpbin** OpenAPI 3.0 şartnamesidir.

    Bu dosyalar her ikisi de demo dağıtımını test etmek için kullanılacaktır.
* `Makefile`, Docker rutinlerini tanımlayan yapılandırma dosyasıdır.
* `docker-compose.yml`, **httpbin** ve [API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) imajlarının yapılandırmasını tanımlayan dosyadır.

## Adım 1: Demo kodunun çalıştırılması

Demo kodunu çalıştırmak için:

1. Demo kodunu içeren GitHub deposunu kopyalayın:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. Klonlanan deposunun `demo/docker-compose` dizinine geçin:

    ```bash
    cd api-firewall/demo/docker-compose
    ```
3. Aşağıdaki komutu kullanarak demo kodunu çalıştırın:

    ```bash
    make start
    ```

    * API Firewall tarafından korunan uygulama **httpbin**, http://localhost:8080 adresinde mevcut olacaktır.
    * API Firewall tarafından korunmayan uygulama **httpbin**, http://localhost:8090 adresinde mevcut olacak. Demo dağıtımını test ederken, farkı kontrol etmek için korunmayan uygulamaya istekler gönderebilirsiniz.
4. Demo testine devam edin.

## Adım 2: Orijinal OpenAPI 3.0 şartnamesine dayalı demo testi

Varsayılan olarak, bu demo, orijinal **httpbin** OpenAPI 3.0 şartnamesi kullanılarak çalışır. Bu demo seçeneğini test etmek için aşağıdaki istekleri kullanabilirsiniz:

* API Firewall'ün, maruz kalmayan yola gönderilen istekleri engellediğini kontrol edin:

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```

    Beklenen yanıt:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* API Firewall'ün, tam sayı veri tipi gerektiren parametreye dize değeri ile yapılan istekleri engellediğini kontrol edin:

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    Beklenen yanıt:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    Bu durum, API Firewall'un uygulamayı Önbellek Zehirlenmeli DoS saldırılarına karşı koruduğunu gösterir.

## Adım 3: Daha katı OpenAPI 3.0 şartnamesine dayalı demo testi

Öncelikle, lütfen demo'da kullanılan OpenAPI 3.0 şartnamesi yolunu güncelleyin:

1. `docker-compose.yml` dosyasında, `APIFW_API_SPECS` ortam değişkeni değerini, daha katı OpenAPI 3.0 şartnamesinin yoluna (`/opt/resources/httpbin-with-constraints.json`) ile değiştirin.
2. Aşağıdaki komutları kullanarak demo'yu yeniden başlatın:

    ```bash
    make stop
    make start
    ```

Sonra, demo seçeneğini test etmek için aşağıdaki yöntemleri kullanabilirsiniz:

* API Firewall'ün, aşağıdaki tanımlamaya uymayan, gereken `int` sorgu parametresi ile yapılan istekleri engellediğini kontrol edin:

    ```json
    ...
    {
      "in": "query",
      "name": "int",
      "schema": {
        "type": "integer",
        "minimum": 10,
        "maximum": 100
      },
      "required": true
    },
    ...
    ```

    Aşağıdaki istekleri kullanarak tanımlamayı test edin:

    ```bash
    # Gerekli sorgu parametresi eksik olan istek
    curl -sD - http://localhost:8080/get

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # int parametresi geçerli bir aralıkta olan istek
    curl -sD - http://localhost:8080/get?int=15

    # Beklenen yanıt
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # int parametresi aralık dışında olan istek
    curl -sD - http://localhost:8080/get?int=5

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int parametresi aralık dışında olan istek
    curl -sD - http://localhost:8080/get?int=1000

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int parametresi aralık dışında olan istek
    # POTANSİYEL TEHLİKE: 8-byte tamsayı taşması, yığın bırakmayla yanıt verebilir
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* API Firewall'ün, aşağıdaki tanıma uymayan `str` sorgu parametresi ile yapılan istekleri engellediğini kontrol edin:

    ```json
    ...
    {
      "in": "query",
      "name": "str",
      "schema": {
        "type": "string",
        "pattern": "^.{1,10}-\\d{1,10}$"
      }
    },
    ...
    ```

    Tanımı test etmek için aşağıdaki istekleri kullanın (`int` parametresi hala gereklidir):

    ```bash
    # str parametre değerinin tanımlanan düzenli ifadeye uymadığı istek
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # str parametre değerinin tanımlanan düzenli ifadeye uymadığı istek
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # str parametre değerinin tanımlanan düzenli ifadeye uyduğu istek
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # Beklenen yanıt
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # str parametre değerinin tanımlanan düzenli ifadeye uymadığı istek
    # POTANSİYEL TEHLİKE: SQL Enjeksiyonu
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## Adım 4: Demo kodunun durdurulması

Demo dağıtımını durdurmak ve ortamınızı temizlemek için aşağıdaki komutu kullanın:

```bash
make stop
```