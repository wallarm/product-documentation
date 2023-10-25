NGINX‑Wallarm ve ayrı postanalytics modüllerinin etkileşimini kontrol etmek için, test saldırısı ile bir istekte bulunabilirsiniz. Bunun için korunan uygulamanın adresine gönderim yapmanız gerekmektedir:

```bash
curl http://localhost/etc/passwd
```

Eğer NGINX‑Wallarm ve ayrı postanalytics modülleri doğru bir şekilde yapılandırıldıysa, saldırı Wallarm Cloud'a yüklenecek ve Wallarm Konsolu'nun **Etkinlikler** bölümünde görüntülenecektir:

![Arayüzdeki saldırılar][img-attacks-in-interface]

Eğer saldırı Cloud'a yüklenmediyse, lütfen hizmetlerin çalışmasında herhangi bir hata olup olmadığını kontrol edin:

* postanalytics servisinin `wallarm-tarantool` durumunun `aktif` olduğundan emin olun

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![wallarm-tarantool durumu][tarantool-status]
* postanalytics modül loğlarını inceleyin

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
    ```

    Eğer `SystemError binary: failed to bind: Cannot assign requested address` gibi bir kayıt varsa, belirtilen adres ve portta bağlantıyı kabul edip etmediğini kontrol edin.
* NGINX‑Wallarm modülü olan sunucuda, NGINX loğlarını inceleyin:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    Eğer `[hata] wallarm: <adres> connect() başarısız oldu` gibi bir kayıt varsa, NGINX‑Wallarm modülü yapılandırma dosyalarında ayrı postanalytics modülünün adresinin doğru belirtildiğinden ve ayrı postanalytics sunucusunun belirtilen adres ve portta bağlantıyı kabul ettiğinden emin olun.
* NGINX‑Wallarm modülü olan sunucuda, aşağıdaki komutu kullanarak işlenmiş istekler hakkında istatistikleri alın ve `tnt_errors` değerinin 0 olduğundan emin olun

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [İstatistik servisi tarafından döndürülen tüm parametrelerin açıklaması →][statistics-service-all-parameters]