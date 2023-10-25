[link-points]: ../points/intro.md
[link-ext-logic]: ../logic.md

[anchor1]: parameters.md#oob
[anchor2]: parameters.md#response
[anchor3]: parameters.md#checking-the-http-statuses
[anchor4]: parameters.md#checking-the-http-headers
[anchor5]: parameters.md#checking-the-body-of-the-http-response
[anchor6]: parameters.md#checking-the-html-markup


# Algılama Aşaması

!!! info "Aşamanın kapsamı"
    Bu aşama, herhangi bir FAST eklenti türünün çalışması için zorunludur (YAML dosyası `detect` bölümünü içermelidir).
  
    Eklenti türleri hakkında ayrıntılı bilgi [burada][link-ext-logic].

!!! info "İstek öğeleri tanım sözdizimi"
    Bir FAST eklentisi oluştururken, uygulamaya gönderilen HTTP isteğinin ve uygulamadan alınan HTTP yanıtının yapısını doğru bir şekilde helifleriyle anlamalısınız.

    Ayrıntılı bilgiyi görmek için bu [bağlantıya][link-points] gidin.

Bu aşama, test isteğin bir güvenlik açığını başarıyla sömürüp sömürmediği hakkında bir sonuca varmak için sunucu yanıtı arasında aranacak parametreleri belirtir.

`detect` bölümü şu yap'étta:

```
detect:
  - oob:
    - dns
  - response:
    - status:
      - değer 1
      - …
      - değer S
    - headers:
      - header 1: 
        - değer 1
        - …
        - değer T
      - header …
      - header N:
        - değer 1
        - …
        - değer U
    - body:
      - html:
        - tag:
          - değer 1
          - …
          - değer V
        - attr:
          - değer 1
          - …
          - değer W
        - attribute:
          - değer 1
          - …
          - değer X
        - js:
          - değer 1
          - …
          - değer Y
        - href:
          - değer 1
          - …
          - değer Z
```

Bu bölüm, parametrelerin setini içerir. Parametreler, yanıtın tek bir öğesini tanımlar. Parametrelerin bazıları değer olarak diğer parametrelerin bir dizisini içerebilir, bir hiyerarşi yaratır.

Parametrenin aşağıdaki özellikleri olabilir:
* İsteğe bağlı olabilir (parametre istekte bulunabilir veya eksik olabilir). `detect` bölümündeki tüm parametreler bu özelliği karşılar.
 
    !!! warning "`detect` bölümünde gerekli olan parametreler hakkında bir not"
        Hem `oob` hem de `response` parametreleri isteğe bağlı olmasına rağmen, bunlardan biri `detect` bölümünde bulunmalıdır. Aksi takdirde, Algılama aşaması çalışamaz. `detect` bölümü ayrıca bu iki parametreyi de içerebilir.

* Atanan bir değeri olmayabilir.  
    
    ??? info "Örnek"
        ```
        - response
        ```

* Tek bir değeri, bir dizi veya numara olarak belirtilmiş olabilir.
    
    ??? info "Örnek"
        ```
        - status: 500
        ```

* Bir dizi veya numara dizisi olarak belirtilen birçok atanan değerden birine sahip 
 
    ??? info "Örnek"
        ```
            - status: 
                - 404
                - 500
        ```

* Diğer parametreleri değer olarak içerebilir (parametreler bir dizi olarak belirtilir).
    
    ??? info "Örnek"
        ```
            - headers: 
                - "Cookie": "örnek"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

Algılama bölümünün parametrelerinin kabul edilebilir değerleri aşağıdaki bölümlerde açıklanmıştır:
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
