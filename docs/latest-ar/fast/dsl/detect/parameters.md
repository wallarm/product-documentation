[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   وصف معلمات مرحلة الكشف 

!!! warning "الكشف عن الضعف في مرحلة الكشف"
    للكشف عن الضعف في مرحلة الكشف باستخدام الرد من الخادم، من الضروري أن يحتوي الرد على أحد عناصر الاستجابة الموصوفة في المعلمة `response`، أو أن يتم تفعيل أحد علامات DNS خارج النطاق الموصوفة في المعلمة `oob` (راجع المعلومات المفصلة حول علامات خارج النطاق [أدناه][anchor1]). خلاف ذلك، سيعتبر أنه لم يتم العثور على أي ضعف.

!!! info "منطق تشغيل العلامات"
    إذا كشفت مرحلة الكشف عن علامة من أي حمولة في رد الخادم، فإن الهجوم ناجح، معنى ذلك أن الضعف تم استغلاله بنجاح. لمشاهدة المعلومات التفصيلية حول مرحلة الكشف المعملة مع العلامات، انتقل إلى هذا [الرابط][link-markers].

##  OOB

تفقد المعلمة `oob` تفعيل علامات خارج النطاق بواسطة الطلب التجريبي.

![structure of the `oob` parameter][img-oob]

!!! info "الكشف عن العلامة OOB في الرد من الخادم"
    إذا تم اكتشاف العلامة OOB في الرد من الخادم، فسيعتبر أن الضعف تم العثور عليه في التطبيق المستهدف. 

* إذا تم تحديد `oob` فقط، يتوقع تفعيل على الأقل واحدة من علامات خارج النطاق.
    
    ```
    - oob 
    ```
* يمكنك أيضًا تحديد النوع المحدد من علامة خارج النطاق للتحقق من تفعيلها.

    يتوقع تفعيل على الأقل واحدة من علامات `DNS_MARKER`:
    
    ```
    - oob:
      - dns
    ```

    !!! info "العلامات OOB المتاحة"
        حاليا، هناك علامة واحدة فقط خارج النطاق متاحة: `DNS_MARKER`.

!!! info "آلية هجوم خارج النطاق"
    تتوافق آلية هجوم خارج النطاق (تحميل الموارد) بالكامل مع اسمها. عند تنفيذ الهجوم، يجبر الخائن الخادم على تنزيل المحتوى الضار من المصدر الخارجي.
    
    على سبيل المثال، عند تنفيذ هجوم DNS خارج النطاق، يستطيع الخائن تضمين اسم النطاق في الوسم `<img>` كما يلي: `<img src=http://vulnerable.example.com>`.
    
    عند استلام الطلب الضار، يحل الخادم اسم النطاق باستخدام DNS ويعالج المورد الذي يتحكم فيه الخائن.

##  الرد

تتحقق هذه المعلمة من وجود العناصر الضرورية في الرد من الخادم على الطلب التجريبي. إذا تم العثور على واحدة على الأقل من هذه العناصر، فمن المفترض أن تم اكتشاف ضعف.

![structure of the `response` parameter][img-response]

* يجب أن يحتوي الرد على أي علامة.
    
    ```
    - response
    ```

### التحقق من حالات HTTP

![structure of the `HTTP Status` parameter][img-http-status]

* يجب أن يحتوي الرد على حالة HTTP معينة.
    ```
    - response:
      - status: value
    ```
    
    ??? info "Example"
        `- status: 500` — يجب أن يكون للحالة قيمة `500`.
            
        `- status: '5\d\d'` — يغطي هذا التعبير العادي كل حالات `5xx`.

* يجب أن يحتوي الرد على أي من حالات HTTP من القائمة.
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "Example"
        يجب أن تحتوي حالة HTTP على واحدة من القيم التالية: `500`, `404`, أي من حالات `2xx`.
            
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```    

### التحقق من رؤوس HTTP

![structure of the `headers` parameter][img-headers]

* يجب أن تحتوي رؤوس الرد على أي علامة.
    
    ```
    - response:
      - headers
    ```

* يجب أن تحتوي رؤوس الرد على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا).
    
    ```
    - response:
      - headers: value
    ```
    
    ??? info "Example"
        * يجب أن يحتوي واحد على الأقل من رؤوس HTTP على "qwerty" كجزء فرعي.
                
            ```
                - response:
                  - headers: "qwerty"
            ```
            
        * يغطي هذا التعبير العادي أي رأس به قيمة رقمية.
                
            ```
                - response:
                  - headers: '\d+'
            ```    
    
* يجب أن يحتوي الرأس المعين للرد على بيانات معينة (يمكن أن يكون `header_#` و`header_#_value` تعبيرات عادية).
    
    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "Example"
        يجب أن يحتوي رأس "Cookie" على البيانات "uid=123". جميع الرؤوس التي تبدأ بـ "X-" يجب ألا تحتوي على أي بيانات.
          
        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    
    
* يجب أن تحتوي الرؤوس المحددة للرد على بيانات من القائمة المحددة (يمكن أن يكون `header_#` و`header_#_value_#` تعبيرات عادية).

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
    
    ??? info "Example"
        يجب أن يحتوي رأس "Cookie" على واحدة من خيارات البيانات التالية: `"test=qwerty"`, `"uid=123"`. جميع الرؤوس التي تبدأ بـ "X-" يجب ألا تحتوي على أي بيانات.
            
        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```
    
* يمكن أيضا لمرحلة الكشف التحقق مما إذا كان رأس معين مفقودًا من الرد من الخادم. للقيام بذلك، قم بتعيين `null` لقيمة الرأس المعين.
    
    ```
    - response:
      - headers:
        - header_X: null
    ```

### التحقق من هيئة الرد HTTP

![structure of the `body` parameter][img-body]

* يجب أن تحتوي هيئة الرد على أي علامة.
    
    ```
    - response:
      - body
    ```

* يجب أن تحتوي هيئة الرد على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا).
    
    ```
    - response:
      - body: value
    ```
    
    ??? info "Example"
        يجب أن تحتوي هيئة الرد على الجملة الفرعية `STR_MARKER` أو `demo_string`.
            
        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### التحقق من الترميز HTML

![structure of the `html` parameter][img-html]

* يجب أن يحتوي الترميز HTML على `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html
    ```

* يجب أن يحتوي الوسم HTML في الرد على `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - tag
    ```

* يجب أن يحتوي الوسم HTML في الرد على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا).
    
    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "Example"
        يجب أن يحتوي ترميز HTML للرد على الوسم `а`.
            
        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* يجب أن يحتوي الوسم HTML في الرد على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` تعبيرًا عاديًا).
    
    ```
    - response:
      - body:
        - html:
          - tag: 
            - value_1
            - …
            - value_R
    ```
    
    ??? info "Example"
        يجب أن يحتوي ترميز HTML للرد على واحدة من الوسوم التالية: `а`, `img`, أو `tr`.
            
        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    
    
* يجب أن يحتوي السمة HTML للرد على `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* يجب أن تحتوي السمة HTML على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا).
    
    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "Example"
        يجب أن تحتوي سمة HTML للرد إما على `abc` كجزء فرعي أو على العلامة الحسابية.
            
        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ```    

* يجب أن تحتوي سمة HTML للرد على أي من البيانات من القائمة المحددة (يمكن أن تكون `value_#` تعبيرًا عاديًا ):

    ```
    - response:
      - body:
        - html:
          - attribute: 
            - value_1
            - …
            - value_F
    ```
    
    ??? info "Example"
        يجب أن يحتوي ترميز HTML على واحدة من السمات التالية: `src`, `id`, أو `style`.
            
        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ```    

!!! info "النسخة المختصرة صمة"
    بدلاً من استخدام معلمة `attribute`، يمكنك استخدام النسخة المختصرة — `attr`.

* يجب أن تحتوي الرابط HREF للرد على `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - href
    ```

* يجب أن يحتوي الرابط HREF للرد على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا ).
    
    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "Example"
        يجب أن يحتوي الرابط HREF على العلامة DNS.
            
        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    
    
* يجب أن يحتوي الرابط HREF للرد على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` تعبيرًا عاديًا):
    
    ```
    - response:
      - body:
        - html:
          - href: 
            - value_1
            - …
            - value_J
    ```
    
    ??? info "Example"
        يجب أن يحتوي الرابط HREF للرد إما على "google" أو "cloudflare" كجزء فرعي.
            
        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```


* يجب أن تحتوي الرموز JavaScript للرد على `STR_MARKER`.
    
    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "الرموز JavaScript"
        الرمز JavaScript هو أي سكريبت كود JavaScript يقع ضمن الوسوم `<script>` و `</script>`.
        
        على سبيل المثال، يحتوي السكريبت التالي على رمز يحتوي على القيمة `wlrm`:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* يجب أن تحتوي الرموز JavaScript للرد على بيانات معينة (يمكن أن تكون القيمة تعبيرًا عاديًا).
    
    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "Example"
        يجب أن يحتوي الرمز JavaScript على القيمة `wlrm`.
            
        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```

* يجب أن تحتوي الرموز JavaScript للرد على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` تعبيرًا عاديًا).
    
    ```
    - response:
      - body:
        - html:
          - js: 
            - value_1
            - …
            - value_H
    ```
    
    ??? info "Example"
        يجب أن يحتوي الرمز JavaScript إما على القيمة `wlrm` أو القيمة `test`.
            
        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```