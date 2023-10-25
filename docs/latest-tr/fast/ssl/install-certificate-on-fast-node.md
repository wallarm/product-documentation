[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/

# Kendi SSL Sertifikanızı FAST Noda Kurma

!!! bilgi "Önkoşullar"
    Bu rehber, aşağıdakileri varsaymaktadır:
    
    * Tarayıcınız, bir HTTP veya HTTPS proxy olarak bir FAST nodunu kullanacak şekilde yapılandırılmıştır.
    * Tarayıcınız, FAST noduna kurmayı planladığınız SSL sertifikasını zaten güvenir.

!!! uyarı "Sertifika gereksinimleri"
    Bu kurulumu başarıyla tamamlamak için, SSL sertifikanız bir kök sertifika veya ara sertifika olmalıdır.
    
    Sertifika ve ilgili özel anahtarın [PEM kullanarak kodlanmış olması][link-pem-encoding] gerekir. Sertifikanızın farklı bir kodlaması varsa, onu PEM kodlu bir sertifikaya dönüştürmek için herhangi bir sertifika dönüştürme aracını, örneğin [OpenSSL][link-openssl] kullanabilirsiniz.

##  SSL Sertifikasını Kurma

Bir SSL sertifikasını FAST noduna kurmak için, bu adımları izleyin:
1.  Zaten bir SSL sertifikanız olduğundan ve sertifikayı imzalayan özel anahtarın PEM formatında olduğundan emin olun.

2.  Sertifika dosyasını ve anahtar dosyasını, Docker ana bilgisayarda aynı dizine yerleştirin. Bu dizini, bir sonraki adımlarda Docker konteynerine FAST nod ile birlikte monte etmek gerekecektir.

3.  Sertifikanın ve anahtarın bulunduğu FAST nodunu, aşağıdaki çevre değişkenlerini kullanarak belirtin:

    ```
    CA_CERT=<sertifikaya dahili yol>
    CA_KEY=<anahtara dahili yol>
    ```
    
    Yukarıdaki satırlarda, `<sertifikaya dahili yol>` ve `<anahtara dahili yol>` değerlerini, Docker konteynerindeki dizini monte ettikten sonraki sertifika ve anahtarın beklenen yoluna değiştirin.

4.  Aşağıdaki komutu çalıştırarak Docker konteynerini FAST nod ile birlikte dağıtın:

    ```
    docker run --name <name> \ 
    -e WALLARM_API_TOKEN=<token> \
    -e ALLOWED_HOSTS=<host list> \
    -e CA_CERT=<sertifikaya dahili yol> \
    -e CA_KEY=<anahtara dahili yol> \
    -v <sertifikanın ve anahtarın bulunduğu dizine yol>:<dizine dahili yol> \
    -p <yayınlama portu>:8080 \
    wallarm/fast
    ```
    
    Bu komut aşağıdaki parametreleri tanımlar:
    
    * Konteynerin adı.
    * Hedef uygulamanın tokeni ve `WALLARM_API_TOKEN` ve `ALLOWED_HOSTS` çevre değişkenleri ile host listesi (sonuncusu zorunlu değildir).
    * `CA_CERT` değişkeni kullanılarak konteyner içinde SSL sertifika dosyasının konumu.
    * `CA_KEY` değişkeni kullanılarak konteyner içinde özel anahtar dosyasının konumu.
    * Uygulamanın yayınlama portu.
    
    `<sertifikanın ve anahtarın bulunduğu dizine yol>` ile Docker ana bilgisayarının dizinini `docker run` komutunun `-v` seçeneğini kullanarak konteynerine monte edin. Bu dizinin içeriği, konteyner içinde `<dizine dahili yol>` yolunda kullanılabilir hale gelir.
        
    !!! uyarı "Not"
        `CA_CERT` ve `CA_KEY` çevre değişkenleri ile belirtilen sertifika ve anahtar dosyalarının yolları, `docker run` komutunun `-v` seçeneği ile belirttiğiniz `<dizine dahili yol>` parametresindeki dosyalara işaret etmelidir.

Artık SSL sertifikanızın başarıyla kurulmuş olması gerekmektedir. FAST nod örneğiniz artık HTTPS isteklerini hiçbir güvenilmeyen sertifika mesajı olmadan proxy’e yönlendirecektir.


##  Bir SSL Sertifikasını Kurma Örneği

Aşağıdakilerin durum olduğunu varsayalım:
* SSL sertifikasının ve ilgili özel anahtarın olduğu `cert.pem` ve `cert.key` dosyaları, FAST nodun başlatıldığı Docker ana bilgisayarının `/home/user/certs` dizininde yer alıyor,
* `/home/user/certs` dizininin içeriği, `/tmp/certs` yolundaki FAST nod ile birlikte konteyner içinde kullanılabilir olacak,
* `fast_token` tokeni kullanılıyor,
* Sadece `example.com` host listesine dahil edilmiş, ve
* FAST nod, `fast-node` adlı konteynerde çalışacak ve dahili port `8080`'i `localhost:8080`'de yayınlayacak,

daha sonra SSL sertifikasını FAST noduna bağlamak için aşağıdaki komutu yürütmeniz gerekiyor:

```
docker run --name fast-node \
-e WALLARM_API_TOKEN="fast_token" \
-e ALLOWED_HOSTS="example.com" \
-e CA_CERT="/tmp/certs/cert.pem" \
-e CA_KEY="/tmp/certs/cert.key" \
-v /home/user/certs:/tmp/certs \
-p 8080:8080 \
wallarm/fast
```