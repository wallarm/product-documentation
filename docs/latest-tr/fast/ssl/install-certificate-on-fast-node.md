[link-openssl]:                 https://www.openssl.org/docs/man1.0.2/man1/x509.html
[link-pem-encoding]:            https://www.ssl.com/guide/pem-der-crt-and-cer-x-509-encodings-and-conversions/


#   FAST node'a Kendi SSL Sertifikanızı Yükleme

!!! info "Önkoşullar"
    Bu kılavuz şunları varsayar:
    
    * Tarayıcınız, HTTP veya HTTPS proxy olarak bir FAST node kullanacak şekilde yapılandırılmıştır.
    * Tarayıcınız, FAST node için yükleyeceğiniz SSL sertifikasına zaten güvenmektedir.

!!! warning "Sertifika gereksinimleri"
    Bu kurulumu başarıyla tamamlamak için SSL sertifikanız kök sertifika veya ara sertifika olmalıdır.
    
    Sertifika ve karşılık gelen özel anahtar [PEM kullanılarak kodlanmış][link-pem-encoding] olmalıdır. Sertifikanız farklı bir kodlamadaysa, [OpenSSL][link-openssl] gibi mevcut herhangi bir sertifika dönüştürme aracını kullanarak PEM kodlamalı sertifikaya dönüştürebilirsiniz.

##  SSL Sertifikasını Yükleme

FAST node'a bir SSL sertifikası yüklemek için aşağıdaki adımları izleyin:
1.  PEM formatında, sertifikayı imzalayan özel anahtar ile birlikte bir SSL sertifikasına sahip olduğunuzdan emin olun.

2.  Sertifika dosyasını ve anahtar dosyasını Docker ana makinesinde aynı dizine yerleştirin. Sonraki adımlarda bu dizini FAST node içeren Docker konteynerine bağlamak gerekecektir.

3.  Sertifika ve anahtarın bulunduğu yerleri aşağıdaki ortam değişkenleri ile FAST node'a belirtin:

    ```
    CA_CERT=<internal path to the certificate>
    CA_KEY=<internal path to the key>
    ```
    
    Yukarıdaki satırlarda, `docker` konteynerine dizini bağladıktan sonra beklenen sertifika ve anahtar yolu ile `<internal path to the certificate>` ve `<internal path to the key>` değerlerini değiştirin.

4.  FAST node ile Docker konteynerini aşağıdaki komutu çalıştırarak dağıtın:

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
    * `WALLARM_API_TOKEN` ve `ALLOWED_HOSTS` ortam değişkenlerini kullanarak hedef uygulamanın token'ı ve ana makine listesi (`ALLOWED_HOSTS` zorunlu değildir).
    * `CA_CERT` değişkeni ile konteyner içindeki SSL sertifikası dosyasının konumu.
    * `CA_KEY` değişkeni ile konteyner içindeki özel anahtar dosyasının konumu.
    * Uygulamanın yayınlanan bağlantı noktası.
    
    `docker run` komutunun `-v` seçeneğini kullanarak Docker ana makinesindeki `<path to the directory with the certificate and key>` dizinini konteynere bağlayın. Bu dizinin içeriği konteyner içinde `<internal path to the directory>` yolunda kullanılabilir hale gelir. 
        
    !!! warning "Not"
        `CA_CERT` ve `CA_KEY` ortam değişkenleriyle belirtilen sertifika ve anahtar dosyalarının yolları, `docker run` komutunun `-v` seçeneğiyle belirttiğiniz `<internal path to the directory>` parametresindeki dosyalara işaret etmelidir.   

Artık SSL sertifikanız başarıyla yüklenmiş olmalıdır. FAST node örneğiniz, güvenilmeyen sertifika mesajları olmadan HTTPS isteklerine aracılık edecektir.


##  SSL Sertifikası Yükleme Örneği

Aşağıdakilerin geçerli olduğunu varsayalım:
* SSL sertifikasını ve karşılık gelen özel anahtarı içeren `cert.pem` ve `cert.key` dosyaları, FAST node'un başlatıldığı Docker ana makinesindeki `/home/user/certs` dizininde bulunuyor,
* `/home/user/certs` dizininin içeriği, FAST node bulunan konteyner içinde `/tmp/certs` yolunda erişilebilir olacak,
* Token olarak `fast_token` kullanılıyor,
* Ana makine listesinde yalnızca `example.com` var, ve
* FAST node `fast-node` adlı konteynerde çalışacak ve iç bağlantı noktası `8080` `localhost:8080` olarak yayınlanacak,

bu durumda SSL sertifikasını FAST node'a bağlamak için aşağıdaki komutu çalıştırmalısınız:

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