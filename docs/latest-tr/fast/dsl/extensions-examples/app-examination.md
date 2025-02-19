[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   Örnek Uygulamanın İncelenmesi

!!! info "Uygulama Hakkında Birkaç Kelime"
    Bu kılavuz, FAST uzantı mekanizmasının yeteneklerini göstermek için savunmasız [OWASP Juice Shop][link-juice-shop] uygulamasını kullanır.
    
    Bu uygulamanın bir örneğinin `ojs.example.local` alan adı üzerinden erişilebilir olduğu varsayılmaktadır. Dağıtılan uygulamaya farklı bir alan adı atanmışsa (bkz. [installation instructions][link-ojs-install-manual]), lütfen `ojs.example.local` değerini uygun alan adı ile değiştirin.
 Başarılı bir FAST uzantısı oluşturmak için, test edilmesi gereken web uygulaması veya API'nın çalışma mekanizmasını (uygulamanın veya API'nın iç mimarisi, istek ve yanıt formatı, hata yönetimi mantığı vb.) anlamanız gerekmektedir.

OWASP Juice Shop uygulamasını, potansiyel güvenlik açığı sömürü yollarını tespit etmek amacıyla inceleyelim.

Bunu gerçekleştirmek için, bir tarayıcı üzerinden giriş sayfasına (`http://ojs.example.local/#/login`) gidin, “Email” alanına `'` sembolünü ve “Password” alanına `12345` şifresini girin, ardından “Log in” butonuna basın. Tarayıcının geliştirici araçları veya Wireshark trafiği yakalama yazılımı yardımıyla, “Email” alanına apostrof sembolü girilmesinin sunucuda dahili bir hataya neden olduğunu tespit edebiliyoruz.

Sunucuya yapılan istekten elde edilen tüm bilgileri analiz ettikten sonra aşağıdaki sonuçlara varabiliriz:
* Bir kullanıcı giriş yapmaya çalıştığında `POST /rest/user/login` REST API yöntemi çağrılır.
* Giriş yapmak için gerekli kimlik bilgileri, aşağıda gösterildiği gibi JSON formatında bu API yöntemine iletilir.
    
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

Bu nedenle, giriş formu aracılığıyla OWASP Juice Shop'un SQL enjeksiyonu saldırılarına (SQLi) karşı savunmasız olabileceğini varsayabiliriz.

![The OWASP Juice Shop application login form][img-login]

!!! info "Güvenlik Açığının Sömürülmesi"
    Sömürülebilir güvenlik açığı: SQLi.
    
    Resmi dokümantasyon, giriş formuna `'or 1=1 -- ` email değeri ve herhangi bir şifre girerek SQLi açığını sömürür.
    
    Bu saldırı sonrasında web uygulaması yöneticisi olarak giriş yapmış olacaksınız.
    
    Alternatif olarak, mevcut yöneticinin email'ini `email` alanı değeri olarak içeren yükü kullanabilirsiniz ( `password` alanında herhangi bir değer olabilir).
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
 Başarılı bir güvenlik açığı sömürme durumunu nasıl tespit edeceğinizi anlamak için, yukarıda belirtilen email ve şifre değerlerini kullanarak siteye yönetici olarak giriş yapın. API sunucusunun yanıtını Wireshark uygulamasını kullanarak yakalayın:
* Yanıtın HTTP durumu: `200 OK` (giriş sırasında herhangi bir sorun olursa sunucu `401 Unauthorized` durumu ile yanıt verecektir). 
* Başarılı bir kimlik doğrulama hakkında bilgi veren, JSON formatındaki sunucu yanıtı:

    ```
    {
        "authentication": {
            "token": "some long token",     # token değeri önemli değildir
            "bid": 1,                       # kullanıcının alışveriş sepeti tanımlayıcısı
            "umail": "admin@juice-sh.op"    # kullanıcının email adresi umail parametresinde saklanır
        }
    }
    ```

![Intercepting the API server's response using the Wireshark application][img-wireshark]