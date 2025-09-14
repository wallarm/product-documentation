[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   Detect Aşaması Parametrelerinin Açıklaması

!!! warning "Detect aşamasında bir güvenlik açığının tespiti"
    Sunucu yanıtını kullanarak Detect aşamasında bir güvenlik açığını tespit etmek için, yanıtın `response` parametresinde açıklanan yanıta ait öğelerden birini içermesi veya `oob` parametresinde açıklanan Out-of-Band DNS işaretleyicilerinden birinin tetiklenmesi gerekir (Out-of-Band işaretleyiciler hakkında ayrıntılı bilgi için [aşağıda][anchor1] bakın). Aksi takdirde, herhangi bir güvenlik açığı bulunmadığı varsayılacaktır.

!!! info "İşaretleyicilerin çalışma mantığı"
    Detect aşaması sunucunun yanıtında herhangi bir yükten bir işaretleyici tespit ederse, saldırı başarılıdır; yani güvenlik açığı başarıyla istismar edilmiştir. Detect aşamasının işaretleyicilerle çalışma detaylarını görmek için bu [bağlantı][link-markers] üzerinden ilerleyin.

##  OOB

`oob` parametresi, test isteği tarafından Out-Of-Band işaretleyicilerinin tetiklenmesini kontrol eder. 

![`oob` parametresinin yapısı][img-oob]

!!! info "Sunucu yanıtında OOB işaretleyicisinin tespiti"
    OOB işaretleyicisi sunucu yanıtında tespit edilirse, hedef uygulamada bir güvenlik açığı bulunduğu varsayılacaktır. 

* Yalnızca `oob` belirtilirse, Out-of-Band işaretleyicilerinden en az birinin tetiklenmesi beklenir.
    
    ```
    - oob 
    ```

* Tetiklenmesini kontrol etmek için Out-of-Band işaretleyicisinin tam türünü de belirtebilirsiniz.
    
    En az bir `DNS_MARKER` işaretleyicisinden birinin tetiklenmesi beklenir:
    
    ```
    - oob:
      - dns
    ```

    !!! info "Mevcut OOB işaretleyicileri"
        Şu anda yalnızca bir Out-of-Band işaretleyici mevcuttur: `DNS_MARKER`.

!!! info "Out-of-Band saldırı mekanizması"
    Out-of-Band (kaynak yükleme) saldırı mekanizması adını tam olarak yansıtır. Saldırı gerçekleştirilirken, kötü niyetli kişi sunucuyu dış kaynaktan kötü amaçlı içerik indirmeye zorlar.
    
    Örneğin, bir OOB DNS saldırısı gerçekleştirirken, kötü niyetli kişi alan adını `<img>` etiketine şu şekilde gömebilir: `<img src=http://vulnerable.example.com>`.
    
    Sunucu kötü amaçlı isteği aldıktan sonra alan adını DNS kullanarak çözümler ve kötü niyetli kişi tarafından kontrol edilen kaynağa erişir.

##  Yanıt

Bu parametre, test isteğine sunucunun yanıtında gerekli öğelerin bulunup bulunmadığını kontrol eder. Bu öğelerden en az biri bulunursa, bir güvenlik açığının tespit edildiği varsayılır.

![`response` parametresinin yapısı][img-response]

* Yanıt herhangi bir işaretleyici içermelidir.
    
    ```
    - response
    ```

### HTTP Durumlarının Kontrolü

![`HTTP Status` parametresinin yapısı][img-http-status]

* Yanıt belirli bir HTTP durumu içermelidir.
    ```
    - response:
      - status: value
    ```
    
    ??? info "Örnek"
        `- status: 500` — durumun değeri `500` olmalıdır.
            
        `- status: '5\d\d'` — bu düzenli ifade, tüm `5xx` durumlarını kapsar.

* Yanıt listedeki HTTP durumlarından herhangi birini içermelidir.
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "Örnek"
        HTTP durumu aşağıdaki değerlerden birini içermelidir: `500`, `404`, herhangi bir `2xx` durumu.
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### HTTP Başlıklarının Kontrolü

![`headers` parametresinin yapısı][img-headers]

* Yanıt başlıkları herhangi bir işaretleyici içermelidir.
    
    ```
    - response:
      - headers
    ```

* Yanıt başlıkları belirli verileri içermelidir (`value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "Örnek"
        * HTTP başlıklarından en az biri alt dizi olarak `qwerty` içermelidir.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * Bu düzenli ifade, sayısal değere sahip herhangi bir başlığı kapsar.
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* Belirli bir yanıt başlığı belirli verileri içermelidir (`header_#` ve `header_#_value` düzenli ifade olabilir).
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "Örnek"
        `Cookie` başlığı `uid=123` verisini içermelidir. `X-` ile başlayan tüm başlıklar herhangi bir veri içermemelidir.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* Belirli yanıt başlıkları, belirtilen listeden verileri içermelidir (`header_#` ve `header_#_value_#` düzenli ifade olabilir).

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
        `Cookie` başlığı aşağıdaki veri seçeneklerinden birini içermelidir: `"test=qwerty"`, `"uid=123"`. `X-` ile başlayan tüm başlıklar herhangi bir veri içermemelidir.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* Detect aşaması ayrıca belirli bir başlığın sunucu yanıtında bulunup bulunmadığını da kontrol edebilir. Bunu yapmak için, ilgili başlığın değerine `null` atayın.
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTP Yanıt Gövdesinin Kontrolü

![`body` parametresinin yapısı][img-body]

* Yanıt gövdesi herhangi bir işaretleyici içermelidir.
    
    ```
    - response:
      - body
    ```

* Yanıt gövdesi belirli verileri içermelidir (`value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "Örnek"
        Yanıt gövdesi `STR_MARKER` veya `demo_string` alt dizisini içermelidir.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTML İşaretlemesinin Kontrolü

![`html` parametresinin yapısı][img-html]

* HTML işaretlemesi `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html
    ```

* Yantıda yer alan HTML etiketi `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* Yantıda yer alan HTML etiketi belirli verileri içermelidir (`value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "Örnek"
        Yanıtın HTML işaretlemesi `a` etiketini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* Yantıda yer alan HTML etiketi, belirtilen listeden herhangi bir veriyi içermelidir (`value_#` bir düzenli ifade olabilir).
    
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
        Yanıtın HTML işaretlemesi aşağıdaki etiketlerden birini içermelidir: `a`, `img` veya `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* Yanıtın HTML özniteliği `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML özniteliği belirli verileri içermelidir (`value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "Örnek"
        Yanıtın HTML özniteliği ya alt dizi olarak `abc` ya da hesaplama işaretleyicisini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* Yanıtın HTML özniteliği, belirtilen listeden herhangi bir veriyi içermelidir (`value_#` bir düzenli ifade olabilir):
    
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
        HTML işaretlemesi aşağıdaki özniteliklerden birini içermelidir: `src`, `id` veya `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "`attribute` parametresinin kısaltılmış sürümü"
    `attribute` parametresi yerine kısaltılmış sürüm olan `attr` kullanılabilir.

* Yanıtın HREF bağlantısı `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* Yanıtın HREF bağlantısı belirli verileri içermelidir (`value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "Örnek"
        HREF bağlantısı DNS işaretleyicisini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* Yanıtın HREF bağlantısı, belirtilen listeden herhangi bir veriyi içermelidir (`value_#` bir düzenli ifade olabilir).
    
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
        HREF bağlantısı alt dizi olarak `google` veya `cloudflare` içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* Yanıtın JavaScript belirteçleri `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScript belirteçleri"
        JavaScript belirteci, `<script>` ve `</script>` etiketleri arasında bulunan herhangi bir JavaScript kodudur.
        
        Örneğin, aşağıdaki betik `wlrm` değerine sahip bir belirteç içerir:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* Yanıtın JavaScript belirteçleri belirli verileri içermelidir (değer bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "Örnek"
        JavaScript belirteci `wlrm` değerini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* Yanıtın JavaScript belirteçleri, belirtilen listeden herhangi bir veriyi içermelidir (`value_#` bir düzenli ifade olabilir).
    
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
        JavaScript belirteci `wlrm` veya `test` değerlerinden birini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```   