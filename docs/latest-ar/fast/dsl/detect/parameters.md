[link-markers]:         markers.md

[img-oob]:              ../../../images/fast/dsl/en/phases/detect/oob.png
[img-response]:         ../../../images/fast/dsl/en/phases/detect/response.png
[img-http-status]:      ../../../images/fast/dsl/en/phases/detect/http-status.png
[img-headers]:          ../../../images/fast/dsl/en/phases/detect/headers.png
[img-body]:             ../../../images/fast/dsl/en/phases/detect/body.png
[img-html]:             ../../../images/fast/dsl/en/phases/detect/html.png

[anchor1]:      #oob

#   وصف المعلمات لمرحلة الكشف 

!!! warning "اكتشاف ثغرة خلال مرحلة الكشف"
    لكشف الثغرة في مرحلة الكشف باستخدام رد الخادم، يجب أن يحتوي الرد على أحد عناصر الرد الموصوفة في المعامل `response` أو أن يتم تنشيط أحد علامات DNS خارج النطاق الموصوفة في المعامل `oob` (يمكن الاطلاع على المعلومات المفصلة حول العلامات خارج النطاق [أدناه][anchor1]) ، وإلا، سيتم افتراض عدم العثور على أي ثغرات.

!!! info "منطق عمل العلامات"
    إذا كشفت مرحلة الكشف علامة من أي حمولة في استجابة الخادم، فإن الهجوم ناجح، مما يعني أنه تم استغلال الثغرة بنجاح. للاطلاع على المعلومات المفصلة حول تشغيل مرحلة الكشف مع العلامات، انتقل إلى هذا [الرابط][link-markers].

## تشغيل خارج النطاق (OOB)

يتحقق المعامل `oob` من تنشيط علامات خارج النطاق بواسطة طلب الاختبار.

![بنية المعامل `oob`][img-oob]

!!! info "اكتشاف علامة OOB في رد الخادم"
    إذا تم اكتشاف علامة OOB في استجابة الخادم، فسيتم افتراض وجود خلل في التطبيق المستهدف.

* إذا تم تحديد `oob` فقط، يجب أن يتوقع تنشيط واحدة على الأقل من علامات خارج النطاق.

    ```
    - oob 
    ```

* يمكنك أيضا تحديد النوع المحدد من علامة خارج النطاق للتحقق من تنشيطها.
    
    يجب أن يتوقع تنشيط واحد على اﻷقل من علامات `DNS_MARKER':

    ```
    - oob:
      - dns
    ```

    !!! info "العلامات OOB المتاحة"
        حاليًا، هناك فقط علامة خارج النطاق واحدة متاحة: `DNS_MARKER`.

!!! info "آلية هجوم خارج النطاق"
    آلية هجوم خارج النطاق (تحميل الموارد) تتوافق تمامًا مع اسمها. عند تنفيذ الهجوم، يجبر الفاعل الخبيث الخادم على تنزيل المحتوى الخبيث من المصدر الخارجي.

    على سبيل المثال، عند تنفيذ هجوم DNS خارج النطاق، يمكن للمنفذ تضمين اسم النطاق في الوسم `<img>` كما يلي: `<img src=http://vulnerable.example.com>`.

    عند استلام الطلب الخبيث، يحل الخادم اسم النطاق باستخدام DNS ويعالج المصدر الذي يتحكم فيه المنفذ.

##  رد

يتحقق هذا المعامل ما إذا كانت العناصر الضرورية موجودة في استجابة الخادم لطلب الاختبار. إذا تم العثور على واحدة على الأقل من هذه العناصر، فمن المفترض أن يكون قد تم اكتشاف ثغرة.

![بنية المعامل `response`][img-response]

* يجب أن تحتوي الاستجابة على أي علامة.

    ```
    - response
    ```

### التحقق من حالات HTTP

![بنية المعامل `HTTP Status`][img-http-status]

* يجب أن تحتوي الاستجابة على حالة HTTP معينة. 
    ```
    - response:
      - status: value
    ```
    
    ??? info "مثال"
        `- status: 500` — يجب أن تحتوي الحالة على القيمة `500`.

        `- status: '5\d\d'` — تغطي هذا العبارة العادية جميع الحالات `5xx`.

* يجب أن تحتوي الاستجابة على أي من حالات HTTP من القائمة.
    
    ```
    - response:
      - status:
        - value 1
        - …
        - value S
    ```
    
    ??? info "مثال"
        يجب أن تحتوي حالة HTTP على واحدة من القيم التالية: `500`, `404`, أي من الحالات `2xx`.
    
        ```
            - response:
              - status:
                - '500'
                - '404'
                - '2\d\d'
        ```   

### التحقق من رؤوس HTTP

![بنية المعامل `headers`][img-headers]

* يجب أن تحتوي رؤوس الاستجابة على أي علامة.

    ```
    - response:
      - headers
    ```

* يجب أن تحتوي رؤوس الاستجابة على بيانات معينة (يمكن أن تكون `value` عبارة عادية).

    ```
    - response:
      - headers: value
    ```
    
    ??? info "مثال"
        * يجب أن يحتوي واحد على الأقل من رؤوس HTTP على `qwerty` كما يلي:

            ```
                - response:
                  - headers: "qwerty"
            ```

        * تغطي هذه العبارة العادية جميع الرؤوس التي تحتوي على قيمة رقمية.

            ```
                - response:
                  - headers: '\d+'
            ```

* يجب أن يحتوي رأس الرد المعين على بيانات معينة (يمكن أن تكون `header_#` أو `header_#_value` عبارة عادية).

    ```
    - response:
      - headers:
        - header_1: header_1_value
        - …
        - header_N: header_N_value
    ```
    
    ??? info "مثال"
        يجب أن يحتوي الرأس `Cookie` على بيانات `uid=123`. يجب أن لا تحتوي جميع الرؤوس التي تبدأ بـ `X-` على أي بيانات.

        ```
            - response:
              - headers: 
                - "Cookie": "uid=123"
                - 'X-': ""
        ```    

* يجب أن تحتوي رؤوس الرد المعينة على البيانات من القائمة المحددة (يمكن أن تكون `header_#` أو `header_#_value_#` عبارة عادية).

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
    
    ??? info "مثال"
        يجب أن يحتوي الرأس `Cookie` على إحدى خيارات البيانات التالية: `"test=qwerty"`, `"uid=123"`. يجب أن لا تحتوي جميع الرؤوس التي تبدأ بـ `X-` على أي بيانات.

        ```
            - response:
              - headers: 
                - "Cookie": 
                  - "uid=123"
                  - "test=qwerty"
                - 'X-': "" 
        ```

* يمكن أيضًا لمرحلة الكشف التحقق مما إذا كان رأس معين غائبًا عن استجابة الخادم. للقيام بذلك، قم بتعيين `null` لقيمة الرأس المعينة.

    ```
    - response:
      - headers:
        - header_X: null
    ```

### التحقق من جسم الاستجابة الخادم HTTP

![بنية المعامل `body`][img-body]

* يجب أن يحتوي جسم الاستجابة على أي علامة.

    ```
    - response:
      - body
    ```

* يجب أن يحتوي جسم الاستجابة على بيانات معينة (يمكن أن تكون `value` عبارة عادية).

    ```
    - response:
      - body: value
    ```
    
    ??? info "مثال"
        يجب أن يحتوي جسم الاستجابة إما على `STR_MARKER` أو الجملة النصية `demo_string`.

        ```
            - response:
              - body: 'STR_MARKER'
              - body: 'demo_string'
        ```

### التحقق من البنية التحتية لـ HTML

![بنية المعامل `html`][img-html]

* يجب أن تحتوي البنية التحتية لـ HTML على `STR_MARKER`.

    ```
    - response:
      - body:
        - html
    ```

* يجب أن يحتوي HTML tag في الاستجابة على `STR_MARKER`.

    ```
    - response:
      - body:
        - html:
          - tag
    ```

* يجب أن يحتوي HTML tag في الاستجابة على بيانات معينة (يمكن أن تكون `value` عبارة عادية).

    ```
    - response:
      - body:
        - html:
          - tag: value
    ```
    
    ??? info "مثال"
        يجب أن تحتوي البنية التحتية لـ HTML للرد على الوسم `а`.

        ```
            - response:
              - body:
                - html:
                  - tag: 'a'
        ```

* يجب أن يحتوي HTML tag في الاستجابة على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` عبارة عادية).

    ```
    - response:
      - body:
        - html:
          - tag: 
            - value_1
            - …
            - value_R
    ```
    
    ??? info "مثال"
        يجب أن تحتوي البنية التحتية لـ HTML للرد على واحدة من الوسوم التالية: `а`, `img`, أو `tr`.

        ```
            - response:
              - body:
                - html:
                  - tag:
                    - 'a'
                    - 'img'
                    - 'tr'
        ```    

* يجب أن يحتوي السمة HTML for response على `STR_MARKER`.

    ```
    - response:
      - body:
        - html:
          - attribute
    ```

* يجب أن تحتوي السمة HTML على بيانات معينة (يمكن أن تكون `value` a regular expression).

    ```
    - response:
      - body:
        - html:
          - attribute: value
    ```
    
    ??? info "مثال"
        يجب أن تحتوي السمة HTML for response إما على `abc` كما يلي أو الحساب marker.

        ```
            - response:
              - body:
                - html:
                  - attribute: '(abc|CALC_MARKER)'
        ``` 

* يجب أن تحتوي السمة HTML of the response على أي البيانات من القائمة المحددة (يمكن أن تكون `value_#` a regular expression):

    ```
    - response:
      - body:
        - html:
          - attribute: 
            - value_1
            - …
            - value_F
    ```
    
    ??? info "مثال"
        يجب أن تحتوي البنية التحتية for the HTML على واحدة من السمات التالية: `src`, `id`, أو `style`.

        ```
            - response:
              - body:
                - html:
                  - attribute:
                    - 'src'
                    - 'id'
                    - 'style'
        ``` 

!!! info "النسخة المختصرة من المعامل `attribute`"
    بدلاً من استخدام المعامل `attribute` ، يمكنك استخدام النسخة المختصرة - `attr`.

* يجب أن تحتوي الوصلة HREF of the response على `STR_MARKER`.

    ```
    - response:
      - body:
        - html:
          - href
    ```

* يجب أن تحتوي الوصلة HREF of the response على بيانات معينة (يمكن أن تكون `value` a regular expression).

    ```
    - response:
      - body:
        - html:
          - href: value
    ```
    
    ??? info "مثال"
        يجب أن تحتوي الوصلة HREF DNS marker.

        ```
            - response:
              - body:
                - html:
                  - href: 'DNS_MARKER'
        ```    

* يجب أن تحتوي الوصلة HREF of the response على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` a regular expression).

    ```
    - response:
      - body:
        - html:
          - href: 
            - value_1
            - …
            - value_J
    ```
    
    ??? info "مثال"
        يجب أن تحتوي الوصلة HREF of the response إما على `google` أو `cloudflare` كما يلي.

        ```
            - response:
              - body:
                - html:
                  - href:
                    - 'google'
                    - 'cloudflare'
        ```

* يجب أن تحتوي الرموز JavaScript for the response على `STR_MARKER`.

    ```
    - response:
      - body:
        - html:
          - js
    ```
    
    !!! info "Tokens JavaScript"
        الرمز JavaScript هو أي كود برمجي JavaScript يقع بين الوسوم `<script>` و `</script>`.

        على سبيل المثال، يحتوي البرنامج النصي التالي على رمز بقيمة `wlrm`:
        
        ```
        <body>
            <script>
            s='123'; 
            wlrm=1;
            </script>
        </body>
        ```

* يجب أن تحتوي الرموز JavaScript of the response على بيانات معينة (قد يكون القيمة a regular expression).

    ```
    - response:
      - body:
        - html:
          - js: value
    ```
    
    ??? info "مثال"
        يجب أن يحتوي الرمز JavaScript على القيمة `wlrm`.

        ```
            - response:
              - body:
                - html:
                  - js: 'wlrm'
        ```    

* يجب أن تحتوي الرموز JavaScript of the response على أي بيانات من القائمة المحددة (يمكن أن تكون `value_#` a regular expression).

    ```
    - response:
      - body:
        - html:
          - js: 
            - value_1
            - …
            - value_H
    ```
    
    ??? info "مثال"
        يجب أن يحتوي الرمز JavaScript إما على القيمة `wlrm` أو `test`.

        ```
            - response:
              - body:
                - html:
                  - js:
                    - 'wlrm'
                    - 'test'
        ```