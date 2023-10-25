[link-ext-logic]:       logic.md

# Gönderme Aşaması

!!! bilgi "Aşamanın Kapsamı"
    Bu aşama, değiştirilmeyen bir uzantının işlemesi için zorunludur (YAML dosyası `send` bölümünü içermelidir).
    
    Bu aşamanın, birleşik haldeyken diğer aşamaları kullanılamaz hale getireceği için (Detect aşaması ve implicit Collect aşaması dışında) bir değiştirici uzantıda bulunmadığını unutmayın.
    
    Uzantı türlerini ayrıntılı olarak [burada][link-ext-logic] okuyun.
    
Bu aşama, önceden tanımlanmış test isteklerini bir hedef uygulamanın zafiyetlerini test etmek için gönderir. Test taleplerinin gönderilmesi gereken host, gelen temel isteklerdeki `Host` başlık değeri tarafından belirlenir.

`send` bölümü aşağıdaki yapıya sahiptir:

```
send:
  - method: <HTTP yöntemi>
    url: <URI>
    headers:
    - header 1: değer
    ...
    - header N: değer
    body: <istek gövdesi>
  ...
  - method: <HTTP yöntemi>
    ...
```

Uzantı YAML dosyasındaki `send` bölümü bir veya daha fazla parametre seti içerir. Her parametre bir `<key: value>` çifti olarak belirtilir. Belirli bir parametre seti, bir test isteği olarak gönderilecek tek bir HTTP isteğini tanımlar. Aşağıdaki parametreler setin bir parçasıdır:

* `method`: İsteğin kullanacağı HTTP yöntemi.

   Bu zorunlu bir parametredir: her parametre setinde bulunmalıdır.

    ??? bilgi "İzin verilen parametre değerlerinin listesi"

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

    ??? bilgi "Örnek"
        `method: 'POST'`

* `url`: Bir URL dizesi. İstek bu URI'ye hedeflenecektir.

   Bu zorunlu bir parametredir: her parametre setinde bulunmalıdır.
    
    ??? bilgi "Örnek"
        `url: '/en/login.php'`

* `headers`: `header name: header value` formatında bir veya daha fazla HTTP başlığı içeren bir dizi.

   Oluşturulan HTTP isteği hiçbir başlık kullanmıyorsa, bu parametre atlanabilir.
    
   FAST, sonuçta doğru olan HTTP isteğini gerektiren başlıkları otomatik olarak ekler (bunlar `headers` dizisinde eksik olsa bile); örneğin, `Host` ve `Content-Length`.
    
    ??? bilgi "Örnek"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
        
    !!! bilgi "`Host` başlığı ile çalışma"
        Gerekirse, bir temel istekten çıkarılan bir `Host` başlığından farklı bir `Host` başlığı ekleyebilirsiniz.
        
        Örneğin, Send bölümündeki bir test isteğine `Host: demo.com` başlığını eklemek mümkündür.
    
        İlgili uzantı çalışıyorsa ve FAST düğümü `Host: example.com` başlığı olan bir temel istek alırsa, `Host: demo.com` başlığı olan istek `example.com` hostuna gönderilir. Sonuçtaki istek bu şekildedir:

        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```
        
* `body`: İsteğin gövdesini içeren bir dize. Sonuç dizesinde özel karakterler varsa kaçış karakteri ekleyerek istediğiniz istek gövdesini belirtebilirsiniz.

   Bu zorunlu bir parametredir: her parametre setinde bulunmalıdır.
    
    ??? bilgi "Örnek"
        `body: 'field1=value1&field2=value2`

Eğer `send` bölümü `N` parametre seti ile doldurulmuşsa, bu setler `N` HTTP isteğini tanımlar, ve bu durumda, tek bir gelen temel istek için, FAST düğümü temel isteğin `Host` başlığında belirtilen bir hosttaki hedef uygulamaya `N` test isteği gönderir.