```markdown
[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup

# Algılama Aşaması

!!! info "Aşamanın Kapsamı"
    Bu aşama, FAST uzantı türlerinin çalışabilmesi için zorunludur (YAML dosyasında `detect` bölümü bulunmalıdır).
  
    Uzantı türleri hakkında detaylı bilgiyi [buradan][link-ext-logic] okuyabilirsiniz.

!!! info "İstek öğeleri açıklama sözdizimi"
    Bir FAST uzantısı oluştururken, uygulamaya gönderilen HTTP isteğinin yapısını ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. Böylece, çalışmanız gereken istek öğelerini noktalar kullanarak doğru bir biçimde tanımlayabilirsiniz. 

    Daha ayrıntılı bilgi için, lütfen [buraya][link-points] tıklayın.

Bu aşama, test isteği ile bir açığın başarıyla sömürüldüğüne dair bir sonuç çıkarabilmek için sunucu yanıtında aranacak parametreleri belirler.

`detect` bölümü aşağıdaki yapıya sahiptir:

```
detect:
  - oob:
    - dns
  - response:
    - status:
      - value 1
      - …
      - value S
    - headers:
      - header 1: 
        - value 1
        - …
        - value T
      - header …
      - header N:
        - value 1
        - …
        - value U
    - body:
      - html:
        - tag:
          - value 1
          - …
          - value V
        - attr:
          - value 1
          - …
          - value W
        - attribute:
          - value 1
          - …
          - value X
        - js:
          - value 1
          - …
          - value Y
        - href:
          - value 1
          - …
          - value Z
```

Bu bölüm, parametre setini içerir. Parametrelerin her biri, yanıtın tek bir öğesini tanımlar. Bazı parametreler, değer olarak diğer parametrelerden oluşan bir diziyi içerebilir ve böylece bir hiyerarşi oluşturur.

Parametrenin aşağıdaki özellikleri olabilir:
* Opsiyonel olabilir (parametre, istekten mevcut veya mevcut olmayabilir). `detect` bölümündeki tüm parametreler bu özelliğe sahiptir.
 
    !!! warning "`detect` bölümünde gerekli olan parametrelerle ilgili bir not"
        Hem `oob` hem de `response` parametrelerinin opsiyonel olmasına rağmen, `detect` bölümünde bunlardan biri bulunmalıdır. Aksi takdirde, Algılama aşaması çalışamaz. `detect` bölümü her iki parametreyi de içerebilir.

* Atanmış bir değeri olmayabilir.  
    
    ??? info "Örnek"
        ```
        - response
        ```    

* Tek bir değeri dize veya sayı olarak belirtebilir.
    
    ??? info "Örnek"
        ```
        - status: 500
        ```

* Dize veya sayı dizisi olarak belirtilen birden fazla değerden birine sahip olabilir. 
    
    ??? info "Örnek"
        ```
            - status: 
                - 404
                - 500
        ```

* Değer olarak başka parametreleri içerebilir (parametreler dizi olarak belirtilir).
    
    ??? info "Örnek"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

detect bölümündeki parametreler için kabul edilebilir değerler aşağıdaki bölümlerde açıklanmıştır:
* [oob][anchor1],
* [response][anchor2],
    * [status][anchor3],
    * [headers][anchor4],
    * [body][anchor5],
        * [html][anchor6],
            * attr,
            * attribute,
            * href,
            * js,
            * tag.
```