```markdown
# Gönderme Aşaması

!!! info "Aşamanın Kapsamı"
    Bu aşama, herhangi bir değiştirmeyen uzantının çalışabilmesi için zorunludur (YAML dosyası `send` bölümünü içermelidir).
    
    Değiştiren bir uzantıda bu aşama bulunmaz, çünkü Gönderme aşaması, diğer aşamalarla (Detect aşaması ve örtük Collect aşaması hariç) birleştirildiğinde diğer aşamaların kullanılamaz hale gelmesine neden olur.
    
    Uzantı türleri hakkında detaylı bilgi almak için [burayı][link-ext-logic] okuyun.

Bu aşama, hedef uygulamayı güvenlik açıkları açısından test etmek için önceden tanımlanmış test isteklerini gönderir. Test isteklerinin gönderileceği host, gelen temel isteklerdeki `Host` başlığı değerine göre belirlenir.

`send` bölümü şu yapıya sahiptir:

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

Uzantı YAML dosyasındaki `send` bölümü, bir veya daha fazla parametre kümesi içerir. Her parametre, `<anahtar: değer>` çiftleri olarak belirtilir. Verilen bir parametre kümesi, test isteği olarak gönderilecek tek bir HTTP isteğini tanımlar. Aşağıdaki parametreler bu kümenin parçasıdır:

* `method`: İsteğin kullanılacak HTTP yöntemidir.

    Bu, zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "İzin verilen parametre değerleri listesi"

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

* `url`: bir URL stringi. İstek bu URI'ya yönlendirilecektir.

    Bu, zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "Örnek"
        `url: '/en/login.php'`

* `headers`: `başlık adı: başlık değeri` formatında bir veya daha fazla HTTP başlık içeren bir dizidir.

    Oluşturulan HTTP isteğinde herhangi bir başlık kullanılmıyorsa, bu parametre atlanabilir.
    
    FAST, `headers` dizisinde eksik olsa bile, oluşturulan HTTP isteğinin doğru olması için gereken başlıkları otomatik olarak ekler (örneğin, `Host` ve `Content-Length`).
    
    ??? info "Örnek"
        ```
        headers:
        - 'Accept-Language': 'en-US,en;q=0.9'
        - 'Content-Type': 'application/xml'
        ```
      
    !!! info "`Host` başlığı ile çalışma"
        Gerekirse, temel istekten çıkarılan değerden farklı bir `Host` başlığını test isteğine ekleyebilirsiniz. 
        
        Örneğin, Send bölümünde bir test isteğine `Host: demo.com` başlığını eklemek mümkündür.
    
        İlgili uzantı çalışıyorsa ve FAST node, `Host: example.com` başlığına sahip bir temel istek alırsa, `Host: demo.com` başlığına sahip test isteği `example.com` host’una gönderilecektir. Oluşan istek buna benzer:

        ```
        curl -k -g -X POST -L -H "Host: demo.com" -H "Content-Type: application/json" "http://example.com/app" --data "{"field":"value"}"
        ```
    
* `body`: İsteğin gövdesini içeren bir string. Gerekli ise, özel karakterleri doğru şekilde kaçırarak istenilen herhangi bir istek gövdesini belirtebilirsiniz.

    Bu, zorunlu bir parametredir: her parametre kümesinde bulunmalıdır.
    
    ??? info "Örnek"
        `body: 'field1=value1&field2=value2`

Eğer `send` bölümü, `N` HTTP isteğini tanımlayan `N` parametre kümesiyle doldurulmuşsa, tek bir gelen temel istek için FAST node, temel istekte belirtilen `Host` başlığına sahip host üzerinde bulunan hedef uygulamaya `N` test isteği gönderecektir.
```