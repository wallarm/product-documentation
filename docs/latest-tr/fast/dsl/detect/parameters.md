[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

# Detect Fazı Parametreler açıklaması

!!! warning "Detect fazında bir açığın tespiti"
    Sunucunun yanıtını kullanarak detect fazında bir açığı tespit etmek için, ya yanıtın `response` parametresinde açıklanan yanıt unsurlarından birini içermesi veya `oob` parametresinde açıklanan Bant Dışı DNS markerlarından birinin tetiklenmesi (bant dışı markerlar hakkındaki detaylı bilgiye [aşağıdan][anchor1] bakınız) gereklidir. Aksi takdirde, hiçbir açık bulunmamış kabul edilir.

!!! info "Markerların işlem mantığı"
    Eğer Detect fazı sunucunun yanıtında herhangi bir yükten bir işaret bulursa, saldırı başarılı kabul edilir, yani açık başarıyla istismar edilmiştir. Markerlarınyla birlikte Detect fazının işleyiş hakkında ayrıntılı bilgiye bakmak için bu [linke][link-markers] tıklayınız.

##  OOB

`oob` parametresi, test isteğinin Bant Dışı Markerları tetiklemesini kontrol eder.

![`oob` parametre yapısı][img-oob]

!!! info "Sunucu yanıtında OOB marker'ının algılanması"
    Eğer OOB marker sunucunun yanıtında algılanırsa, hedef uygulamada bir açığın bulunduğu varsayılır. 

* Eğer sadece `oob` belirtilmişse, Bant Dışı Markerların en az birinin tetiklenmesi beklenir.
    
    ```
    - oob 
    ```

* Ayrıca, tetiklenmesi için kontrol edilecek Bant Dışı Marker'ın belirli bir türünü belirtebilirsiniz.
    
    En az bir `DNS_MARKER` markerının tetiklenmesi beklenir:
    
    ```
    - oob:
      - dns
    ```

    !!! info "Mevcut OOB marker'ları"
        Şu anda sadece bir Bant Dışı marker mevcut: `DNS_MARKER`.

!!! info "Bant Dışı saldırı mekanizması"
    Bant Dışı (kaynak yükü) saldırı mekanizması adını tam olarak karşılar. Saldırıyı gerçekleştirirken, suçlu sunucunun dış kaynaktan zararlı içeriği indirmesini zorlar.
    
    Örneğin, bir OOB DNS saldırısı gerçekleştirirken, suçlu domain adını aşağıdaki gibi `<img>` etiketine gömebilir: `<img src=http://vulnerable.example.com>`.
    
    Zararlı isteği aldığı zaman, sunucu domain adını DNS kullanarak çözer ve suçlunun kontrolünde olan kaynağa ulaşır.

##  Yanıt

Bu parametre sunucunun bir test isteği ile yanıtında gerekli öğelerin bulunup bulunmadığını kontrol eder. Eğer bu öğelerden en az biri bulunursa, bir açığın tespit edildiği varsayılır.

![`yanıt` parametre yapısı][img-response]

* Yanıt herhangi bir marker içermelidir.
    
    ```
    - response
    ```

### HTTP Durumlarını Kontrol Etme

![`HTTP Durum` parametre yapısı][img-http-status]

* Yanıt belirli bir HTTP durumu içermelidir.
    ```
    - response:
      - status: value
    ```
    
    ??? info "Örnek"
        `- status: 500` — durum `500` değerine sahip olmalı.
            
        `- status: '5\d\d'` — bu düzenli ifade tüm `5xx` durumlarını kapsar.

* Yanıt listedeki herhangi bir HTTP durumunu içermelidir.
    
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

### HTTP başlıklarının kontrolü

![`headers` parametre yapısı][img-headers]

* Yanıt başlıkları herhangi bir marker içermelidir.
    
    ```
    - response:
      - headers
    ```

* Yanıt başlıkları belirli bir veri içermelidir ( `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "Örnek"
        * HTTP başlıklarından en az biri `qwerty` alt dizesini içermeli.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * Bu düzenli ifade, sayısal değeri olan herhangi bir başlığı kapsar.
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* Belirli bir yanıt başlığı belirli bir veriyi içermelidir ( `header_#` ve `header_#_value` düzenli ifadeler olabilir).
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "Örnek"
        `Cookie` başlığı `uid=123` verisini içermeli. `X-` ile başlayan tüm başlıklar hiçbir veri içermemeli.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* Belirli yanıt başlıkları belirtilen listenin verilerini içermelidir ( `header_#` ve `header_#_value_#` düzenli ifadeler olabilir).

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
        `Cookie` başlığı aşağıdaki veri seçeneklerinden birini içermelidir: `"test=qwerty"`, `"uid=123"`. `X-` ile başlayan tüm başlıklar hiçbir veri içermemeli.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* Detect fazı ayrıca sunucunun yanıtından belirli bir başlığın eksik olup olmadığını da kontrol edebilir. Bunu yapmak için, belirli bir başlık değerine `null` atanır.
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### HTTP Yanıtının Gövdesini Kontrol Etme

![`body` parametre yapısı][img-body]

* Yanıtın gövdesi herhangi bir marker içermelidir.
    
    ```
    - response:
      - body
    ```

* Yanıtın gövdesi belirli bir veri içermelidir ( `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "Örnek"
        Yanıtın gövdesi `STR_MARKER` veya `demo_string` alt dizesini içermeli.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### HTML İşaretleme Kontrolü

![`html` parametre yapısı][img-html]

* HTML işaretleme `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html
    ```

* Yanıttaki HTML etiketi `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* Yanıttaki HTML etiketi belirli bir veri içermelidir ( `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "Örnek"
        Yanıtın HTML işaretleme kısmı `а` etiketini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* Yanıttaki HTML etiketi belirtilen listeden herhangi bir veri içermelidir ( `value_#` bir düzenli ifade olabilir).
    
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
        Yanıtın HTML işaretleme kısmı aşağıdaki etiketlerden birini içermelidir: `а`, `img`, ya da `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* Yanıttaki HTML özelliği `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* HTML özelliği belirli bir veri içermelidir ( `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "Örnek"
        HTML özelliği ya `abc` alt dizesini içermeli ya da hesaplama işaretçisi.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* Yanıttaki HTML özelliği belirtilen listeden herhangi bir veriyi içermelidir ( `value_#` bir düzenli ifade olabilir):
    
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
        HTML biçimlendirmesi aşağıdaki özniteliklerden birini içermelidir: `src`, `id`, ya da `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "`attribute` parametresinin kısaltılmış versiyonu"
    `attribute` parametresini kullanmak yerine, kısaltılmış versiyonu — `attr` kullanabilirsiniz.

* Yanıttaki HREF bağlantısı `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* Yanıttaki HREF bağlantısı belirli bir veri içermelidir ( `value` bir düzenli ifade olabilir).
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "Örnek"
        HREF bağlantısı DNS markerı içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* Yanıttaki HREF bağlantısı belirtilen listeden herhangi bir veriyi içermelidir ( `value_#` bir düzenli ifade olabilir).
    
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
        HREF bağlantısı yanıtı ya `google` ya da `cloudflare` alt dizesini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* Yanıttaki JavaScript belirteçleri `STR_MARKER` içermelidir.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "JavaScript belirteçleri"
        JavaScript belirteci, `<script>` ve `</script>` etiketleri arasında yatan herhangi bir JavaScript kodudur.
        
        Örneğin, aşağıdaki betik, `wlrm` değerine sahip bir belirteç içerir:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* Yanıttaki JavaScript belirteçleri belirli bir veri içermelidir (değer düzenli bir ifade olabilir).
    
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

* Yanıttaki JavaScript belirteçleri belirtilen listeden herhangi bir veriyi içermelidir ( `value_#` düzenli bir ifade olabilir).
    
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
        JavaScript belirteci ya `wlrm` ya da `test` değerini içermelidir.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```