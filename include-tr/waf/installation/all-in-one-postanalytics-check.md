NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, korunan uygulamanın adresine test saldırısı içeren bir istek gönderebilirsiniz:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarm ve ayrı postanalytics modülleri doğru yapılandırıldıysa, saldırı Wallarm Cloud'a yüklenecek ve Wallarm Console'un **Attacks** bölümünde görüntülenecektir:

![Arayüzdeki Attacks][img-attacks-in-interface]

Saldırı Wallarm Cloud'a yüklenmediyse, lütfen servislerin çalışmasında herhangi bir hata olmadığını kontrol edin:

* postanalytics modülünün günlüklerini analiz edin

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/tarantool-out.log
    ```

    `SystemError binary: failed to bind: Cannot assign requested address` gibi bir kayıt varsa, sunucunun belirtilen adres ve port üzerinden bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, NGINX günlüklerini analiz edin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    `[error] wallarm: <address> connect() failed` gibi bir kayıt varsa, ayrı postanalytics modülünün adresinin NGINX‑Wallarm modülünün yapılandırma dosyalarında doğru belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve port üzerinden bağlantı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülünün bulunduğu sunucuda, aşağıdaki komutu kullanarak işlenen isteklerin istatistiklerini alın ve `tnt_errors` değerinin 0 olduğundan emin olun

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik servisinin döndürdüğü tüm parametrelerin açıklaması →][statistics-service-all-parameters]