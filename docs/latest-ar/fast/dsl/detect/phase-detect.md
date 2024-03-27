[link-points]:      ../points/intro.md
[link-ext-logic]:   ../logic.md

[anchor1]:      parameters.md#oob
[anchor2]:      parameters.md#response
[anchor3]:      parameters.md#checking-the-http-statuses
[anchor4]:      parameters.md#checking-the-http-headers
[anchor5]:      parameters.md#checking-the-body-of-the-http-response
[anchor6]:      parameters.md#checking-the-html-markup

# مرحلة الكشف

!!! info "نطاق المرحلة"
    هذه المرحلة إجبارية لأي نوع امتداد FAST للتشغيل (يجب أن يحتوي ملف YAML على قسم `detect`).
  
    اقرأ عن أنواع الامتداد بالتفصيل [هنا][link-ext-logic].

!!! info "بناء جملة وصف عناصر الطلب"
    عند إنشاء امتداد FAST، تحتاج إلى فهم بنية طلب HTTP المرسل إلى التطبيق وبنية الاستجابة HTTP التي تُستقبل من التطبيق لتصف بشكل صحيح عناصر الطلب التي تحتاج للعمل معها باستخدام النقاط.

    لرؤية معلومات مفصلة، تابع إلى هذا [الرابط][link-points].

تحدد هذه المرحلة المعايير للبحث في استجابة الخادم لإجراء استنتاج حول ما إذا كانت ثغرة ما قد تم استغلالها بنجاح بواسطة طلب تجريبي.

قسم الكشف له البنية التالية:

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

يحتوي هذا القسم على مجموعة المعايير. كل معيار يصف عنصراً واحداً من الاستجابة. قد يحتوي بعض المعايير على صف من المعايير الأخرى كقيمة، مما يخلق هرمية.

قد يكون للمعيار الخصائص التالية:
* اختياري (يمكن أن يكون المعيار موجودًا أو غائبًا من الطلب). كل المعايير في قسم `detect` تلبي هذه الخاصية.
 
    !!! warning "ملاحظة على المعايير المطلوبة في قسم `detect`"
        على الرغم من أن كلا من معايير `oob` و `response` اختيارية، يجب أن يكون واحد منهما موجوداً في قسم `detect`. وإلا، لن تتمكن مرحلة الكشف من العمل. قد يحتوي قسم `detect` أيضًا على كلا من هذه المعايير.

* لا يملك قيمة محددة.  
    
    ??? info "مثال"
        ```
        - response
        ```    

* يملك قيمة واحدة محددة كنص أو رقم.
    
    ??? info "مثال"
        ```
        - status: 500
        ```

* لديه واحدة من قيم متعددة محددة كمصفوفة من النصوص أو الأرقام.
    
    ??? info "مثال"
        ```
            - status: 
                - 404
                - 500
        ```

* يحتوي على معايير أخرى كقيمة (تحدد المعايير كمصفوفة).
    
    ??? info "مثال"
        ```
            - headers: 
                - "Cookie": "example"
                - "User-Agent":
                    - "Mozilla"
                    - "Chrome"
        ```

القيم المقبولة لمعايير قسم الكشف موصوفة في الأقسام التالية:
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