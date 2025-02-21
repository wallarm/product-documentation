[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/

# FAST Düğümüne Kendi SSL Sertifikanızı Yükleme

!!! info "Önkoşullar"
    Bu rehber şunları varsayar:
    
    * Tarayıcınız, FAST düğümünü HTTP veya HTTPS proxy olarak kullanacak şekilde yapılandırılmıştır.
    * Tarayıcınız, FAST düğümü için yükleyeceğiniz SSL sertifikasına zaten güvenir.

!!! warning "Sertifika Gereksinimleri"
    Bu kurulumu başarılı bir şekilde tamamlamak için, SSL sertifikanız ya kök sertifika ya da ara sertifika olmalıdır.
    
    Sertifika ve karşılık gelen özel anahtar [PEM formatında kodlanmış olmalıdır][link-pem-encoding]. Sertifikanız farklı bir kodlamaya sahipse, onu PEM formatına dönüştürmek için [OpenSSL][link-openssl] gibi mevcut herhangi bir sertifika dönüştürme aracını kullanabilirsiniz.

## SSL Sertifikasını Yükleme

FAST düğümüne SSL sertifikası yüklemek için aşağıdaki adımları izleyin:
1.  Zaten PEM formatında kodlanmış bir SSL sertifikasına ve sertifikayı imzalayan özel anahtara sahip olduğunuzdan emin olun.

2.  Sertifika dosyasını ve anahtar dosyasını Docker host üzerindeki aynı dizine yerleştirin. Bu dizini, sonraki adımlarda FAST düğümünün bulunduğu Docker konteynerine mount etmeniz gerekecektir.

3.  Sertifika ve anahtarın bulunduğu FAST düğümünü aşağıdaki ortam değişkenlerini kullanarak belirtin:

    ```
    CA_CERT=<internal path to the certificate>
    CA_KEY=<internal path to the key>
    ```
    
    Yukarıdaki satırlarda, `<internal path to the certificate>` ve `<internal path to the key>` değerlerini, dizini Docker konteynerinde mount ettikten sonra sertifika ve anahtarın bulunması gereken yol ile değiştirin.

4.  Aşağıdaki komutu çalıştırarak FAST düğümü ile Docker konteynerini dağıtın:

    ```
    docker run --name <name> \ 
    -e WALLARM_API_TOKEN=<token> \
    -e ALLOWED_HOSTS=<host list> \
    -e CA_CERT=<internal path to the certificate> \
    -e CA_KEY=<internal path to the key> \
    -v <path to the directory with the certificate and key>:<internal path to the directory> \
    -p <publishing port>:8080 \
    wallarm/fast
    ```
    
    Bu komut aşağıdaki parametreleri tanımlar:
    
    * Konteynerin adı.
    * Hedef uygulamanın token ve host listesini `WALLARM_API_TOKEN` ve `ALLOWED_HOSTS` ortam değişkenleri kullanılarak (sonuncusu zorunlu değildir) belirtir.
    * `CA_CERT` değişkeni ile konteyner içindeki SSL sertifika dosyasının konumunu belirtir.
    * `CA_KEY` değişkeni ile konteyner içindeki özel anahtar dosyasının konumunu belirtir.
    * Uygulamanın yayınlanma portunu.
    
    `docker run` komutunun `-v` seçeneğini kullanarak, Docker host'undaki `<path to the directory with the certificate and key>` dizinini konteynerde mount edin. Bu dizinin içeriği, konteyner içerisinde `<internal path to the directory>` yoluyla kullanılabilir hale gelecektir.
        
    !!! warning "Not"
        `CA_CERT` ve `CA_KEY` ortam değişkenleri ile belirtilen sertifika ve anahtar dosyası yolları, `docker run` komutunun `-v` seçeneği ile belirttiğiniz `<internal path to the directory>` içinde yer alan dosyalara işaret etmelidir.

Artık SSL sertifikanız başarıyla kurulmuş olmalıdır. FAST düğümünüz artık, güvensiz sertifika uyarısı göstermeden HTTPS isteklerini proxy'leyecektir.

## SSL Sertifikası Yükleme Örneği

Aşağıdaki senaryonun geçerli olduğunu varsayalım:
* `cert.pem` ve `cert.key` dosyaları, FAST düğümünün başlatıldığı Docker host'un `/home/user/certs` dizininde yer almaktadır,
* `/home/user/certs` dizininin içeriği, FAST düğümünün bulunduğu konteynerde `/tmp/certs` yolunda erişilebilir olacaktır,
* `fast_token` token'ı kullanılmaktadır,
* Host listesine yalnızca `example.com` dahildir, ve
* FAST düğümü `fast-node` adlı konteynerde çalışacak ve iç portu `8080`, `localhost:8080` üzerinde yayınlanacaktır,

bu durumda SSL sertifikasını FAST düğümüne bağlamak için aşağıdaki komutu çalıştırmanız gerekmektedir:

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