[link-ext-logic]:       logic.md

# Gönder Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, değişiklik yapmayan bir uzantının çalışması için zorunludur (YAML dosyasında `send` bölümü bulunmalıdır).
    
    Bu aşama, değiştirici bir uzantıda bulunmaz; çünkü Gönder (Send) aşaması diğer aşamalarla birleştirildiğinde (Tespit (Detect) aşaması ve örtük Toplama (Collect) aşaması hariç) onları kullanılamaz hâle getirir.
    
    Uzantı türleri hakkında ayrıntılı bilgiyi [burada][link-ext-logic] okuyun.

 Bu aşama, önceden tanımlanmış test isteklerini göndererek hedef uygulamayı zafiyetler için test eder. Test isteklerinin gönderileceği ana makine, gelen temel isteklerdeki `Host` üstbilgisi değerine göre belirlenir.

`send` bölümü aşağıdaki yapıya sahiptir:

```
send:
  - method: <HTTP method>
    url: <URI>
    headers:
    - header 1: value
    ...
    - header N: value
    body: <the request body>
  ...
  - method: <HTTP method>
    ...
```

Uzantının YAML dosyasındaki `send` bölümü bir veya daha fazla parametre kümesi içerir. Her bir parametre bir `<key: value>` çifti olarak belirtilir. Belirli bir parametre kümesi, test isteği olarak gönderilecek tek bir HTTP isteğini tanımlar. Küme şu parametreleri içerir:

* `method`: isteğin kullanacağı HTTP yöntemi.

    Bu zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "İzin verilen parametre değerlerinin listesi"

        * `GET`
        * `POST`
        * `PUT`
        * `HEAD`
        * `OPTIONS`
        * `PATCH`
        * `COPY`
        * `DELETE`
        * `LOCK`
        * `UNLOCK`
        * `MOVE`
        * `TRACE`

    ??? info "Örnek"
        `method: 'POST'`

* `url`: bir URL dizgesi. İstek bu URI'yi hedefleyecektir.

    Bu zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "Örnek"
        `url: '/en/login.php'`

* `headers`: `üstbilgi adı: üstbilgi değeri` biçiminde bir veya daha fazla HTTP üstbilgisi içeren bir dizi.

    Oluşturulan HTTP isteği herhangi bir üstbilgi kullanmıyorsa, bu parametre atlanabilir.
    
    FAST, ortaya çıkan HTTP isteğinin doğru olması için gerekli üstbilgileri (`headers` dizisinde eksik olsalar bile) otomatik olarak ekler; örneğin, `Host` ve `Content-Length`.
    
    ??? info "Örnek"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
      
    !!! info "`Host` üstbilgisiyle çalışma"
        Gerekirse, temel istekten çıkarılandan farklı bir `Host` üstbilgisini test isteğine ekleyebilirsiniz. 
        
        Örneğin, Gönder (Send) bölümünde bir test isteğine `Host: demo.com` üstbilgisi eklemek mümkündür.
    
        İlgili uzantı çalışıyorsa ve FAST düğümü `Host: example.com` üstbilgisine sahip bir temel istek alırsa, `Host: demo.com` üstbilgili test isteği `example.com` ana makinesine gönderilir. Ortaya çıkan istek aşağıdakine benzer:

        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```
    
* `body`: isteğin gövdesini içeren bir dizge. Ortaya çıkan dizgede, varsa, özel karakterleri uygun şekilde kaçışladığınız sürece gerekli herhangi bir istek gövdesini belirtebilirsiniz.

    Bu zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "Örnek"
        `body: 'field1=value1&field2=value2`

Eğer `send` bölümü `N` HTTP isteğini tanımlayan `N` parametre kümesiyle doldurulmuşsa, tek bir gelen temel istek için, FAST düğümü, temel isteğin `Host` üstbilgisinde belirtilen ana makinede bulunan hedef uygulamaya `N` test isteği gönderecektir.