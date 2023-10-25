# Wallarm API Firewall demo Kubernetes ile

Bu demo, uygulamayı [**httpbin**](https://httpbin.org/) ve Wallarm API Firewall'ı, **httpbin** API'sını koruyan bir proxy olarak dağıtır. Her iki uygulama da Kubernetes'teki Docker konteynerlerinde çalışıyor.

## Sistem gereksinimleri

Bu demo'yu çalıştırmadan önce, sisteminizin aşağıdaki gereksinimleri karşıladığından emin olun:

* Docker Engine 20.x veya daha yeni bir sürümünün [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/) veya [Linux](https://docs.docker.com/engine/install/#server) için yüklenmiş olması
* [Docker Compose](https://docs.docker.com/compose/install/) kurulu olması
* [Mac](https://formulae.brew.sh/formula/make),[Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download) veya Linux için **make**'in kurulu olması (uygun paket yönetim araçları kullanılarak)

Bu demo ortamının çalıştırılması kaynak yoğun olabilir. Lütfen aşağıdaki kaynaklara sahip olduğunuzdan emin olun:

* En az 2 CPU çekirdeği
* En az 6GB geçici hafıza

## Kullanılan kaynaklar

Bu demo'da aşağıdaki kaynaklar kullanılıyor:

* [**httpbin** Docker imajı](https://hub.docker.com/r/kennethreitz/httpbin/)
* [API Firewall Docker imajı](https://hub.docker.com/r/wallarm/api-firewall)

## Demos kodu tanımı

[Demo kodu](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes) **httpbin** ve API Firewall'un dağıtıldığı Kubernetes kümesini çalıştırır.

Kubernetes kümesini çalıştırmak için, bu demo Docker konteynerlerini düğümler olarak kullanarak K8s kümesini dakikalar içinde çalıştırmaya olanak sağlayan [**kind**](https://kind.sigs.k8s.io/) adlı aracı kullanır. Birkaç soyutlama katmanını kullanarak, **kind** ve bağımlılıkları, Kubernetes kümesini başlatan Docker imajına paketlenir.

Demo dağıtımı, aşağıdaki dizinler/dosyalar aracılığıyla yapılandırılır:

* **httpbin** API'si için OpenAPI 3.0 şartnamesi, `volumes/helm/api-firewall.yaml` dosyasında `manifest.body` yolu altında bulunur. Bu spesifikasyonu kullanarak, API Firewall, isteklerin ve yanıtların uygulama adresine uygulama API şemasına uygun olup olmadığını doğrular.

    Bu spesifikasyon, [orijinal **httpbin** API şemasını](https://httpbin.org/spec.json) tanımlamaz. API Firewall özelliklerini daha şeffaf bir şekilde göstermek için, orijinal OpenAPI 2.0 şemasını açıkça dönüştürdük ve karmaşıklaştırdık ve değiştirilen spesifikasyonu `volumes/helm/api-firewall.yaml` > `manifest.body'ye kaydettik.
* `Makefile`, Docker işlemlerini tanımlayan yapılandırma dosyasıdır.
* `docker-compose.yml` geçici Kubernetes kümesinin çalıştırılması için aşağıdaki yapılandırmayı tanımlayan dosyadır:

    * [`docker/Dockerfile`](https://github.com/wallarm/api-firewall/blob/main/demo/kubernetes/docker/Dockerfile) tabanında [**kind**](https://kind.sigs.k8s.io/) düğümünün oluşturulması.
    * Eşzamanlı Kubernetes ve Docker hizmet keşfi sağlayan DNS sunucusunun dağıtımı.
    * Yerel Docker registriesi ve `dind` hizmet dağıtımı.
    * **httpbin** ve [API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) imajlarının yapılandırılması.

## Adım 1: Demo kodunun çalıştırılması

Demo kodunu çalıştırmak için:

1. Demo kodunu içeren GitHub deposunu klonlayın:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. Klonlanan depo'nun `demo/kubernetes` dizinine gidin:

    ```bash
    cd api-firewall/demo/kubernetes
    ```
3. Aşağıdaki komutu kullanarak demo kodunu çalıştırın. Lütfen bu demo'yu çalıştırmanın kaynak yoğun olabileceğini ve demo ortamının başlamasının 3 dakikaya kadar sürebileceğini unutmayın.

    ```bash
    make start
    ```

    * API Firewall tarafından korunan **httpbin** uygulaması http://localhost:8080 adresinde mevcut olacak.
    * API Firewall tarafından korunmayan **httpbin** uygulaması http://localhost:8090 adresinde mevcut olacak. Demo dağıtımını test ederken, farkı görmek için korumasız uygulamaya istekler gönderebilirsiniz.
4. Demo testine devam edin.

## Adım 2: Demoyu test etme

Aşağıdaki isteği kullanarak dağıtılan API Firewall'u test edebilirsiniz:

* API Firewall'un maruz kalan yol dışındaki yollara gönderilen istekleri engellediğini kontrol edin:

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
* API Firewall'un, tam sayı veri tipi gerektiren parametrede geçirilen dize değeri ile istekleri engellediğini kontrol edin:

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

    Bu durum, API Firewall'un uygulamayı Cache-Poisoned DoS saldırılarından koruduğunu gösterir.
* API Firewall'un, aşağıdaki tanımı karşılamayan `int` adlı gereken sorgu parametresiyle istekleri engellediğini kontrol edin:

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

    Tanımı aşağıdaki isteklerle test edin:

    ```bash
    # Gerekli sorgu parametresi eksik olan istek
    curl -sD - http://localhost:8080/get

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # int parametre değeri, geçerli bir aralıkta olan istek
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


    # int parametre değeri, aralığın dışında olan istek
    curl -sD - http://localhost:8080/get?int=5

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int parametre değeri, aralığın dışında olan istek
    curl -sD - http://localhost:8080/get?int=1000

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int parametre değeri, aralığın dışında olan istek
    # POTANSİYEL KÖTÜ: 8 baytlık tam sayı taşması, yığın kayması ile yanıt verebilir
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* API Firewall'un, aşağıdaki tanımı karşılamayan `str` sorgu parametresi olan istekleri engellediğini kontrol edin:

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

    Tanımı aşağıdaki isteklerle test edin ( `int` parametresi hala gereklidir):

    ```bash
    # str parametre değeri, tanımlanan düzenli ifadeye uymayan istek
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # str parametre değeri, tanımlanan düzenli ifadeye uymayan istek
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # str parametre değeri, tanımlanan düzenli ifadeye uyan istek
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


    # str parametre değeri, tanımlanan düzenli ifadeye uymayan istek
    # POTANSİYEL KÖTÜ: SQL Injection
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # Beklenen yanıt
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## Adım 4: Demos kodunun durdurulması

Demos dağıtımını durdurmak ve çevrenizi temizlemek için aşağıdaki komutu kullanın:

```bash
make stop
```