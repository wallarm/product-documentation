[img-test-scheme]:                  ../../images/fast/qsg/en/test-preparation/12-qsg-fast-test-prep-scheme.png
[img-google-gruyere-startpage]:     ../../images/fast/qsg/common/test-preparation/13-qsg-fast-test-prep-gruyere.png
[img-policy-screen]:                ../../images/fast/qsg/common/test-preparation/14-qsg-fast-test-prep-policy-screen.png
[img-wizard-general]:               ../../images/fast/qsg/common/test-preparation/15-qsg-fast-test-prep-policy-wizard-general.png
[img-wizard-insertion-points]:      ../../images/fast/qsg/common/test-preparation/16-qsg-fast-test-prep-policy-wizard-ins-points.png

[link-previous-chapter]:            deployment.md
[link-https-google-gruyere]:        https://google-gruyere.appspot.com
[link-https-google-gruyere-start]:  https://google-gruyere.appspot.com/start
[link-wl-console]:                  https://us1.my.wallarm.com

[doc-policy-in-detail]:             ../operations/test-policy/overview.md

[gl-element]:                       ../terms-glossary.md#baseline-request-element
[gl-testpolicy]:                    ../terms-glossary.md#test-policy

[anchor1]:  #1-prepare-the-baseline-request                       
[anchor2]:  #2-create-a-test-policy-targeted-at-xss-vulnerabilities
    
    
#   ضبط البيئة للإختبار

هذا الفصل هيقودك على طريقة تكوين FAST لإكتشاف ثغرات XSS في تطبيق Google Gruyere. عند إتمامك لجميع الخطوات اللازمة، هتكون جاهز تبعت طلب HTTPS أساسي من خلال عقدة FAST للعثور على ثغرات XSS.

لتوليد مجموعة اختبارات الأمان، FAST من Wallarm يحتاج للآتي:
* عقدة FAST موزعة، بتبعت طلبات أساسية
* اتصال عقدة FAST بسحابة Wallarm
* طلب أساسي
* سياسة اختبار

إنت قمت بنجاح بتوزيع عقدة FAST وربطتها بالسحابة في [الفصل السابق][link-previous-chapter]. في هذا الفصل هتركز على إنشاء [سياسة اختبار][gl-testpolicy] وطلب أساسي.

![مخطط الاختبار المستخدم][img-test-scheme]

!!! info "إنشاء سياسة اختبار"
    يُنصح بشدة بإنشاء سياسة مخصصة لكل تطبيق هدف تحت الاختبار. ومع ذلك، يمكنك الاستعانة بالسياسة الافتراضية التي تُنشأ تلقائياً بواسطة سحابة Wallarm. هذا الوثيقة هتقودك على طريقة إنشاء سياسة مخصصة، بينما السياسة الافتراضية خارج نطاق هذا الدليل.
    
لضبط البيئة للاختبار، قم بالتالي:

1.  [إعداد الطلب الأساسي][anchor1]
2.  [إنشاء سياسة الاختبار الموجهة نحو ثغرات XSS][anchor2]
    
!!! info "تطبيق الهدف"
    المثال الحالي بيستخدم [Google Gruyere][link-https-google-gruyere] كتطبيق هدف. لو كنت هترتب الطلب الأساسي لتطبيقك المحلي، يرجى استخدام عنوان IP لجهاز يشغِّل هذا التطبيق بدلاً من عنوان Google Gruyere.
    
    للحصول على عنوان IP، يمكنك استخدام أدوات مثل `ifconfig` أو `ip addr`.
        
##  1.  إعداد الطلب الأساسي

1.  الطلب الأساسي موجه نحو تطبيق [Google Gruyere][link-https-google-gruyere]، يجب عليك أولاً إنشاء نسخة معزولة من التطبيق. ثم يجب الحصول على معرف فريد للنسخة.
    
    للقيام بذلك، انتقل لهذا [الرابط][link-https-google-gruyere-start]. سيتم إعطاؤك معرف نسخة Google Gruyere، والذي يجب عليك نسخه. إقرأ شروط الخدمة واختر زر **أوافق وابدأ**.
    
    ![صفحة بداية Google Gruyere][img-google-gruyere-startpage]

    سيتم تشغيل نسخة مُعزولة من Google Gruyere. وستكون متاحة لك بالعنوان التالي:
    
    `https://google-gruyere.appspot.com/<معرف نسختك>/`

2.  قم بإنشاء الطلب الأساسي إلى نسختك من تطبيق Google Gruyere. يُقترح في الدليل استخدام طلب شرعي.

    الطلب كالآتي:

    ```
    https://google-gruyere.appspot.com/<معرف نسختك>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "مثال على طلب"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  إنشاء سياسة الاختبار الموجهة نحو ثغرات XSS

1.  قم بتسجيل الدخول إلى [بوابة My Wallarm][link-wl-console] باستخدام الحساب الذي أنشأته [سابقاً][link-previous-chapter].

2.  اختر تبويب "سياسات الاختبار" واضغط زر **إنشاء سياسة اختبار**.

    ![إنشاء سياسة اختبار][img-policy-screen]

3.  في تبويب "عام"، ضع اسم ووصف معبِّر للسياسة. يُقترح في هذا الدليل استخدام الاسم `DEMO POLICY`.

    ![معالج سياسة الاختبار: تبويب "عام".][img-wizard-general]

4.  في تبويب "نقاط الإدخال"، حدد [عناصر الطلب الأساسي][gl-element] المؤهلة للمعالجة أثناء عملية توليد طلبات مجموعة الاختبار الأمني. يكفي لأغراض هذا الدليل السماح بمعالجة جميع معاملات GET. للسماح بذلك، يُرجى إضافة التعبير `GET_.*` في كتلة "أين تشمل". عند إنشاء سياسة، FAST يسمح تلقائياً بمعالجة بعض المعاملات. يمكنك حذفها باستخدام رمز «-».

    ![معالج سياسة الاختبار: تبويب "نقاط الإدخال".][img-wizard-insertion-points]

5.  في تبويب "الهجمات للاختبار"، اختر نوع واحد من الهجمات لاستغلال الثغرة في التطبيق الهدف - XSS.

6.  تأكد أن معاينة السياسة في العمود الأقصى يمينًا تظهر كالآتي:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  اختر زر **حفظ** لحفظ السياسة.

8.  عد لقائمة سياسات الاختبار بالضغط على زر **العودة إلى سياسات الاختبار**.
    
    
!!! info "تفاصيل سياسة الاختبار"
    المعلومات التفصيلية عن سياسات الاختبار متاحة بالرابط [الرابط][doc-policy-in-detail].

الآن يجب أن تكون قد أكملت جميع أهداف الفصل، بامتلاك طلب HTTPS أساسي لتطبيق Google Gruyere وسياسة الاختبار الموجهة نحو ثغرات XSS.