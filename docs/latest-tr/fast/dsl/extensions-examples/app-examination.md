[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   Örnek Uygulamanın İncelemesi

!!! bilgi "Uygulama hakkında birkaç söz"
    Bu rehber, FAST uzantı mekanizmasının yeteneklerini göstermek için hassas [OWASP Juice Shop][link-juice-shop] uygulamasını kullanır.
    
    Bu uygulamanın bir örneğinin `ojs.example.local` alan adı üzerinden erişilebilir olduğu varsayılır. Dağıtılan uygulamaya farklı bir alan adı atanmışsa ( [kurulum talimatlarına][link-ojs-install-manual] bakınız), lütfen `ojs.example.local` yerine uygun alan adını kullanın.
    Bir FAST uzantısı başarılı bir şekilde oluşturabilmek için, zafiyet testi yapmanız gereken web uygulamasının ya da API'nin çalışma mekanizmasını anlamanız gerekir (uygulamanın veya API'nın dahili mimarisi, istek ve yanıt formatı, hata işleme mantığı, vb).

OWASP Juice Shop uygulamasının bir incelemesini yapalım ve potansiyel zafiyetlerin sömürülme yollarını bulalım.

Bunun için, bir tarayıcı kullanarak giriş sayfasına (`http://ojs.example.local/#/login`) gidin, "E-posta" alanına `'` sembolünü ve "Parola" alanına `12345` şifresini girin ve "Oturum Aç" düğmesine basın. Tarayıcının geliştirici araçları veya Wireshark trafik yakalama yazılımının yardımıyla, "E-posta" alanında kesme işareti kullanmanın sunucuda dahili bir hataya neden olduğunu anlayabiliriz.

Sunucuya yapılan tüm taleplerin bilgilerini analiz ettikten sonra, aşağıdaki sonuçlara ulaşabiliriz:
* Bir kullanıcı oturum açmaya çalıştığında `POST /rest/user/login` REST API metodu çağrılır.
* Bu API metoduna oturum açma kimlik bilgileri aşağıda gösterildiği gibi JSON formatında aktarılır.

    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
Sunucunun yanıtındaki tüm bilgileri analiz ettikten sonra, `email` ve `password` değerlerinin aşağıdaki SQL sorgusunda kullanıldığı sonucuna varabiliriz: 

```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

Dolayısıyla, OWASP Juice Shop'un giriş formu aracılığıyla SQL enjeksiyonu saldırılarına (SQLi) karşı hassas olabileceğini varsayabiliriz.

![OWASP Juice Shop uygulamasının giriş formu][img-login]

!!! bilgi "Zafiyetin sömürülmesi"
    Sömürülebilir zafiyet: SQLi.
    
    Resmi belgeleme, SQLi zafiyetini giriş formuna `'or 1=1 -- ` e-postası ve herhangi bir parola girerek sömürür.
    
    Bu saldırıyı gerçekleştirdikten sonra web uygulamasının yöneticisi olarak oturum açmış olacaksınız.
    
    Alternatif olarak, `email` alanına mevcut yöneticinin e-postasını içeren yükü kullanabilirsiniz ( `password` alanı herhangi bir değer içerebilir).
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
    Başarılı bir zafiyet sömürme durumunu nasıl algılayacağınızı anlamak için yukarıda belirtilen e-posta ve parola değerlerini kullanarak siteye yönetici olarak oturum açın. Wireshark uygulamasını kullanarak API sunucusunun yanıtını yakalayın:
* Yanıtın HTTP durumu: `200 OK` (oturum açma sırasında herhangi bir sorun olursa, sunucu `401 Unauthorized` durumu ile yanıt verir).
* Başarılı bir kimlik doğrulama hakkında bilgi veren JSON formatında sunucunun yanıtı:

    ```
    {
        "authentication": {
            "token": "some long token",     # token değeri önemli değil
            "bid": 1,                       # alışveriş sepeti tanımlayıcısı
            "umail": "admin@juice-sh.op"    # kullanıcının e-posta adresi umail parametresinde saklanır
        }
    }
    ```

![Wireshark uygulaması ile API sunucusunun yanıtını yakalama][img-wireshark]