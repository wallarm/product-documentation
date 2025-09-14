[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   Örnek Uygulamanın İncelenmesi

!!! info "Uygulama hakkında birkaç söz"
    Bu kılavuz, FAST uzantı mekanizmasının yeteneklerini göstermek için zafiyetli [OWASP Juice Shop][link-juice-shop] uygulamasını kullanır.
    
    Bu uygulamanın bir örneğine `ojs.example.local` alan adı üzerinden erişilebildiği varsayılmaktadır. Dağıtılan uygulamaya farklı bir alan adı atanmışsa (bkz. [kurulum talimatları][link-ojs-install-manual]), lütfen `ojs.example.local` değerini uygun alan adıyla değiştirin.
 Bir FAST uzantısını başarıyla oluşturmak için, zafiyetlerini test edeceğiniz web uygulamasının veya API'nin çalışma mekanizmasını (uygulama veya API'nin iç mimarisi, istek ve yanıt formatı, istisna işleme mantığı vb.) anlamanız gerekir.

Zafiyetlerin istismarına yönelik potansiyel birkaç yolu bulmak için OWASP Juice Shop uygulamasını inceleyelim.

Bunu yapmak için, bir tarayıcı kullanarak giriş sayfasına (`http://ojs.example.local/#/login`) gidin, “Email” alanına `'` sembolünü, “Password” alanına `12345` parolasını girin ve “Log in” düğmesine basın. Tarayıcının geliştirici araçları veya Wireshark trafik yakalama yazılımının yardımıyla, “Email” alanında kesme işareti kullanımının sunucuda bir iç hataya neden olduğunu anlayabiliriz. 

Sunucuya yapılan isteğe ait tüm bilgileri analiz ettikten sonra şu sonuçlara varabiliriz:
* Bir kullanıcı giriş yapmaya çalıştığında `POST /rest/user/login` REST API yöntemi çağrılır.
* Giriş bilgileri bu API yöntemine aşağıda gösterildiği gibi JSON formatında aktarılır.
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
Sunucunun yanıtına ait tüm bilgileri analiz ettikten sonra, `email` ve `password` değerlerinin aşağıdaki SQL sorgusunda kullanıldığı sonucuna varabiliriz: 
    
```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

Dolayısıyla, OWASP Juice Shop uygulamasının giriş formu üzerinden SQL enjeksiyon saldırılarına (SQLi) karşı savunmasız olabileceğini varsayabiliriz.

![OWASP Juice Shop uygulamasının giriş formu][img-login]

!!! info "Zafiyetin istismarı"
    İstismar edilebilir zafiyet: SQLi.
    
    Resmi dokümantasyon, giriş formuna `'or 1=1 -- ` e-postası ve herhangi bir parola girilerek SQLi zafiyetinin istismar edilmesini gösterir.
    
    Bu saldırıdan sonra web uygulamasına yönetici olarak giriş yapmış olursunuz.
    
    Alternatif olarak, mevcut yöneticinin e-posta adresini `email` alan değeri olarak içeren bir payload kullanabilirsiniz (`password` alanı herhangi bir değer içerebilir).
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
 Başarılı bir zafiyet istismarının nasıl tespit edileceğini anlamak için, yukarıda belirtilen e-posta ve parola değerlerini kullanarak siteye yönetici olarak giriş yapın. Wireshark uygulamasını kullanarak API sunucusunun yanıtını yakalayın:
* Yanıtın HTTP durumu: `200 OK` (giriş sırasında herhangi bir sorun olursa, sunucu `401 Unauthorized` durumu ile cevap verir). 
* Başarılı kimlik doğrulamasını bildiren, JSON formatındaki sunucu yanıtı:

    ```
    {
        "authentication": {
            "token": "some long token",     # token değeri önemli değildir
            "bid": 1,                       # kullanıcının alışveriş sepeti tanımlayıcısı
            "umail": "admin@juice-sh.op"    # kullanıcının e-posta adresi umail parametresinde tutulur
        }
    }
    ```

![Wireshark uygulaması kullanılarak API sunucusunun yanıtının yakalanması][img-wireshark]