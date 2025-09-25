[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup


# Detect aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, herhangi bir FAST uzantı türünün çalışması için zorunludur (YAML dosyası `detect` bölümünü içermelidir).
  
    Uzantı türleri hakkında ayrıntılı bilgiyi [burada][link-ext-logic] okuyun.

!!! info "İstek öğelerini tanımlama söz dizimi"
    Bir FAST uzantısı oluştururken, noktaları kullanarak çalışmanız gereken istek öğelerini doğru şekilde tanımlayabilmek için uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını anlamanız gerekir. 

    Ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.

Bu aşama, bir test isteği tarafından bir güvenlik açığının başarıyla istismar edilip edilmediğine ilişkin sonucu çıkarabilmek için sunucu yanıtında aranacak parametreleri belirtir.

`detect` bölümünün yapısı aşağıdaki gibidir:

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

Bu bölüm, parametrelerin bir kümesini içerir. Parametrelerin her biri yanıtın tek bir öğesini açıklar. Bazı parametreler, değer olarak başka parametrelerin bir dizisini içerebilir ve böylece bir hiyerarşi oluşturur.

Bir parametre aşağıdaki özelliklere sahip olabilir:
* İsteğe bağlı olabilir (parametre istekte bulunabilir veya bulunmayabilir). `detect` bölümündeki tüm parametreler bu özelliği sağlar.
 
    !!! warning "`detect` bölümünde gerekli olan parametreler hakkında not"
        Her iki `oob` ve `response` parametresi isteğe bağlı olsa da, `detect` bölümünde bunlardan birinin bulunması gerekir. Aksi takdirde, Detect aşaması çalışamaz. `detect` bölümü her iki parametreyi de içerebilir.

* Atanmış bir değere sahip olmayabilir.  
    
    ??? info "Örnek"
        ```
        - response
        ```    

* Dize veya sayı olarak belirtilmiş tek bir değere sahip olabilir.
    
    ??? info "Örnek"
        ```
        - status: 500
        ```

* Dize veya sayı dizisi olarak belirtilen birden çok atanmış değerden birine sahip olabilir. 
    
    ??? info "Örnek"
        ```
            - status: 
                - 404
                - 500
        ```

* Değer olarak başka parametreler içerebilir (parametreler bir dizi olarak belirtilir).
    
    ??? info "Örnek"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

`detect` bölümünün parametreleri için kabul edilebilir değerler aşağıdaki bölümlerde açıklanmıştır:
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