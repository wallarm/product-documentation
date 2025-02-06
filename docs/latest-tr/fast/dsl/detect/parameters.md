[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   Algılama Aşaması Parametre Açıklaması

!!! warning "Algılama Aşaması'nda Bir Güvenlik Açığı Tespiti"
    Bir sunucunun yanıtını kullanarak Algılama Aşaması'nda güvenlik açığı tespiti yapabilmek için, ya yanıtın `response` parametresinde tanımlanan yanıt öğelerinden birini içermesi ya da `oob` parametresinde tanımlanan Out-of-Band DNS işaretçilerinden birinin tetiklenmesi gerekmektedir (ayrıntılı bilgi için aşağıdaki [anchor1] bağlantısına bakınız). Aksi takdirde, hiçbir güvenlik açığı bulunmamış sayılacaktır.

!!! info "İşaretçi İşlem Mantığı"
    Algılama Aşaması, sunucunun yanıtında herhangi bir payload'dan işaretçi tespit ederse, saldırı başarılı sayılır; yani güvenlik açığı başarılı bir şekilde istismar edilmiştir. İşaretçilerle çalışan Algılama Aşaması hakkında ayrıntılı bilgi için bu [link][link-markers] bağlantısına bakınız.

##  OOB

`oob` parametresi, test isteği tarafından Out-Of-Band işaretçilerinin tetiklenmesini kontrol eder.

![`oob` parameter structure][img-oob]

!!! info "Sunucu Yanıtında OOB İşaretçisi Tespiti"
    Eğer sunucunun yanıtında OOB işaretçisi tespit edilirse, hedef uygulamada güvenlik açığının bulunduğu varsayılır.

* Eğer yalnızca `oob` belirtilmişse, en az bir Out-of-Band işaretçisinin tetiklenmesi beklenir.
    
    ```
    - oob 
    ```

* Tetiklenmesini kontrol etmek için Out-of-Band işaretçisinin tam türünü de belirtebilirsiniz.
    
    En az bir `DNS_MARKER` işaretçisinin tetiklenmesi beklenir:
    
    ```
    - oob:
      - dns
    ```

    !!! info "Mevcut OOB İşaretçileri"
        Şu anda, kullanılabilir tek Out-of-Band işaretçisi bulunmaktadır: `DNS_MARKER`.

!!! info "Out-of-Band Saldırı Mekanizması"
    Out-of-Band (kaynak yükleme) saldırı mekanizması, adının hakkını verir. Saldırıyı gerçekleştirirken, kötü niyetli kişi sunucuyu dış kaynaktan zararlı içerik indirmeye zorlar.
    
    Örneğin, bir OOB DNS saldırısı gerçekleştirirken, kötü niyetli kişi alan adını `<img>` etiketi içerisine şu şekilde yerleştirebilir: `<img src=http://vulnerable.example.com>`.
    
    Zararlı istek alındığında, sunucu DNS kullanarak alan adını çözer ve kötü niyetlisinin kontrolündeki kaynağa yönlendirir.

##  Yanıt

Bu parametre, test isteğine verilen sunucu yanıtında gerekli öğelerin bulunup bulunmadığını kontrol eder. Eğer bu öğelerden en az biri bulunursa, güvenlik açığının tespit edildiği varsayılır.

![`response` parameter structure][img-response]

* Yanıt, herhangi bir işaretçi içermelidir.
    
    ```
    - response
    ```

### HTTP Durum Kodlarının Kontrolü

![`HTTP Status` parameter structure][img-http-status]

* Yanıt, belirli bir HTTP durum kodunu içermelidir.
    ```
    - response:
      - status: value
    ```
    
    ??? info "Örnek"
        `- status: 500` — durum kodu `500` değerini almalıdır.
            
        `- status: '5\d\d'` — bu düzenli ifade tüm `5xx` durum kodlarını kapsar.

* Yanıt, listeden herhangi bir HTTP durum kodunu içermelidir.
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "Örnek"
        HTTP durum kodu, aşağıdaki değerlerden birini içermelidir: `500`, `404`, herhangi bir `2xx` durumu.
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### HTTP Başlıklarının Kontrolü

![`headers` parameter structure][img-headers]

* Yanıt başlıkları, herhangi bir işaretçi içermelidir.
    
    ```
    - response:
      - headers
    ```

* Yanıt başlıkları, belirli verileri içermelidir (burada `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "Örnek"
        * HTTP başlıklarının en az biri, bir alt dizi olarak `qwerty` içermelidir.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * Bu düzenli ifade, sayısal bir değere sahip herhangi bir başlığı kapsar.
                
            ```
                - response:
                  - headers: '\d+'
            ```    

* Belirli bir yanıt başlığı, belirli verileri içermelidir (burada `header_#` ve `header_#_value` düzenli ifadeler olabilir).
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "Örnek"
        `Cookie` başlığı, `uid=123` bilgisini içermelidir. `X-` ile başlayan tüm başlıklar herhangi bir veri içermemelidir.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    

* Belirli yanıt başlıkları, belirtilen listedeki verilerden birini içermelidir (burada `header_#` ve `header_#_value_#` düzenli ifadeler olabilir).

    ```
    - response:
      - headers:
        - header_1:
          - header_1_value_1
          - …
          - header_1_value_K
        - …
        - header_N: 
          - header_N_value_1
          - …
          - header_N_value_K
    ```
    
    ??? info "Örnek"
        `Cookie` başlığı, aşağıdaki veri seçeneklerinden birini içermelidir: `"test=qwerty"`, `"uid=123"`. `X-` ile başlayan tüm başlıklar herhangi bir veri içermemelidir.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* Algılama aşaması, belirli bir başlığın sunucu yanıtında bulunmadığını da kontrol edebilir. Bunun için, ilgili başlığın değerine `null` atanır.
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTP Yanıt Gövdesinin Kontrolü

![`body` parameter structure][img-body]

* Yanıt gövdesi, herhangi bir işaretçi içermelidir.
    
    ```
    - response:
      - body
    ```

* Yanıt gövdesi, belirli verileri içermelidir (burada `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "Örnek"
        Yanıt gövdesi, `STR_MARKER` veya `demo_string` alt dizgilerinden birini içermelidir.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTML İşaretlemesinin Kontrolü

![`html` parameter structure][img-html]

* HTML işaretlemesi, `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html
    ```

* Yanıt içindeki HTML etiketi, `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* Yanıt içindeki HTML etiketi, belirli verileri içermelidir (burada `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "Örnek"
        Yanıtın HTML işaretlemesi, `a` etiketini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* Yanıt içindeki HTML etiketi, belirtilen listedeki verilerden herhangi birini içermelidir (burada `value_#` düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - tag: 
            - value_1
            - …
            - value_R
    ```
    
    ??? info "Örnek"
        Yanıtın HTML işaretlemesi, aşağıdaki etiketlerden birini içermelidir: `a`, `img` veya `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* Yanıtın HTML özniteliği, `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML özniteliği, belirli verileri içermelidir (burada `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "Örnek"
        Yanıtın HTML özniteliği, ya alt dizi olarak `abc` içermeli ya da hesaplama işaretçisini bulundurmalıdır.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* Yanıtın HTML özniteliği, belirtilen listedeki verilerden herhangi birini içermelidir (burada `value_#` düzenli ifade olabilir):
    
    ```
    - response:
      - body:
        - html:
          - attribute: 
            - value_1
            - …
            - value_F
    ```
    
    ??? info "Örnek"
        HTML işaretlemesi, aşağıdaki özniteliklerden birini içermelidir: `src`, `id` veya `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "Kısaltılmış `attribute` Parametresi"
    `attribute` parametresi yerine, kısaltılmış sürümü — `attr` — kullanabilirsiniz.

* Yanıtın HREF bağlantısı, `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* Yanıtın HREF bağlantısı, belirli verileri içermelidir (burada `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "Örnek"
        HREF bağlantısı, DNS işaretçisini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    

* Yanıtın HREF bağlantısı, belirtilen listedeki verilerden herhangi birini içermelidir (burada `value_#` düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - href: 
            - value_1
            - …
            - value_J
    ```
    
    ??? info "Örnek"
        Yanıtın HREF bağlantısı, alt dizi olarak ya `google` ya da `cloudflare` içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* Yanıtın JavaScript token'ları, `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScript Tokenları"
        JavaScript token, `<script>` ve `</script>` etiketleri arasındaki herhangi bir JavaScript kodu parçasıdır.
        
        Örneğin, aşağıdaki betik `wlrm` değerine sahip bir token içerir:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* Yanıtın JavaScript token'ları, belirli verileri içermelidir (burada value bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "Örnek"
        JavaScript token, `wlrm` değerini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* Yanıtın JavaScript token'ları, belirtilen listedeki verilerden herhangi birini içermelidir (burada `value_#` düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - js: 
            - value_1
            - …
            - value_H
    ```
    
    ??? info "Örnek"
        JavaScript token, ya `wlrm` ya da `test` değerini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```