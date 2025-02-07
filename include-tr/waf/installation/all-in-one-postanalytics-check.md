To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine test saldırısı içeren isteği gönderebilirsiniz:

```bash
curl http://localhost/etc/passwd
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Attacks** section of Wallarm Console:

Eğer NGINX‑Wallarm ve ayrı postanalytics modülleri doğru şekilde yapılandırıldıysa, saldırı Wallarm Cloud'a yüklenecek ve Wallarm Console'un **Attacks** bölümünde gösterilecektir:

![Attacks in the interface][img-attacks-in-interface]

If the attack was not uploaded to the Cloud, please check that there are no errors in the services operation:

Saldırı Cloud'a yüklenmediyse, lütfen servislerin çalışmasında herhangi bir hata olmadığını kontrol edin:

* Analyze the postanalytics module logs

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    If there is the record like `SystemError binary: failed to bind: Cannot assign requested address`, make sure that the server accepts connection on specified address and port.
    
    `SystemError binary: failed to bind: Cannot assign requested address` gibi bir kayıt varsa, lütfen sunucunun belirtilen adres ve port üzerinden bağlantıyı kabul ettiğinden emin olun.
* On the server with the NGINX‑Wallarm module, analyze the NGINX logs:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    If there is the record like `[error] wallarm: <address> connect() failed`, make sure that the address of separate postanalytics module is specified correctly in the NGINX‑Wallarm module configuration files and separate postanalytics server accepts connection on specified address and port.
    
    `[error] wallarm: <address> connect() failed` gibi bir kayıt varsa, lütfen ayrı postanalytics modülünün adresinin NGINX‑Wallarm modül yapılandırma dosyalarında doğru belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve port üzerinden bağlantıyı kabul ettiğinden emin olun.
* On the server with the NGINX‑Wallarm module, get the statistics on processed requests using the command below and make sure that the value of `tnt_errors` is 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Description of all parameters returned by the statistics service →][statistics-service-all-parameters] 

NGINX‑Wallarm modülünün bulunduğu sunucuda, aşağıdaki komutu kullanarak işlenen isteklerle ilgili istatistikleri alın ve `tnt_errors` değerinin 0 olduğundan emin olun.