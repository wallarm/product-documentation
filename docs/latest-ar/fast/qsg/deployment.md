[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment/5-qsg-fast-inst-scheme.png
[img-fast-create-node]:         ../../images/fast/qsg/common/deployment/6-qsg-fast-inst-create-node.png   
[img-firefox-options]:          ../../images/fast/qsg/common/deployment/9-qsg-fast-inst-ff-options-window.png
[img-firefox-proxy-options]:    ../../images/fast/qsg/common/deployment/10-qsg-fast-inst-ff-proxy-options.png
[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

[link-https-google-gruyere]:    https://google-gruyere.appspot.com
[link-docker-docs]:             https://docs.docker.com/
[link-wl-console]:              https://us1.my.wallarm.com
[link-ssl-installation]:        ../ssl/intro.md

[wl-cloud-list]:    ../cloud-list.md
      
[anchor1]:  #1-install-the-docker-software              
[anchor2]:  #2-obtain-a-token-that-will-be-used-to-connect-your-fast-node-to-the-wallarm-cloud
[anchor3]:  #3-prepare-a-file-containing-the-necessary-environment-variables 
[anchor4]:  #4-deploy-the-fast-node-docker-container 
[anchor5]:  #5-configure-the-browser-to-work-with-the-proxy
[anchor6]:  #6-install-ssl-certificates 
    
    
# نشر عقدة FAST

ستقودك هذه الفصول خلال عملية تثبيت وتهيئة العقدة FAST الأولية. بعد إكمال جميع الخطوات الضرورية، ستمتلك عقدة FAST تعمل وتستمع على `localhost:8080`، جاهزة لتوجيه طلبات HTTP وHTTPS إلى تطبيق [Google Gruyere][link-https-google-gruyere]. سيتم تثبيت العقدة على جهازك بالإضافة إلى متصفح Mozilla Firefox.
    
!!! info "ملاحظة عن المتصفح المستخدم"
    يُقترح في الدليل استخدام متصفح Mozilla Firefox. ومع ذلك، يمكنك استخدام أي متصفح من اختيارك، بشرط أنك نجحت في تهيئته لإرسال كل حركة مرور HTTP وHTTPS إلى عقدة FAST.

![مخطط نشر عقدة FAST المستخدم][img-qsg-deployment-scheme]    
        
لتثبيت وتهيئة عقدة FAST، قم بما يلي:

1.  [تثبيت برمجيات Docker][anchor1].
2.  [الحصول على رمز سيستخدم لربط عقدة FAST الخاصة بك بسحابة Wallarm][anchor2].
3.  [إعداد ملف يحتوي على متغيرات البيئة الضرورية][anchor3].
4.  [نشر حاوية عقدة FAST Docker][anchor4].
5.  [تهيئة المتصفح للعمل مع البروكسي][anchor5].
6.  [تثبيت شهادات SSL][anchor6].
            
##  1.  تثبيت برمجيات Docker

قم بإعداد برمجيات Docker على جهازك. اطلع على [دليل التثبيت][link-docker-docs] الرسمي لمزيد من المعلومات.

يُقترح أن تستخدم نسخة Docker Community Edition (CE). ومع ذلك، يمكن استخدام أي نسخة من Docker.
    
    
##  2.  الحصول على رمز سيستخدم لربط عقدة FAST بسحابة Wallarm

1.  قم بتسجيل الدخول إلى [بوابة My Wallarm][link-wl-console] باستخدام حساب Wallarm الخاص بك.

    If you do not have one, then contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access.

2.  اختر علامة التبويب "العقد"، ثم انقر على زر **إنشاء عقدة FAST** (أو رابط **إضافة عقدة FAST**).

    ![إنشاء عقدة جديدة][img-fast-create-node]

3.  ستظهر نافذة حوار. أعطِ العقدة اسمًا ذا معنى واختر زر **إنشاء**. يقترح الدليل استخدام الاسم `DEMO NODE`.
    
4.  حرّك مؤشر الماوس فوق حقل **الرمز** للعقدة المُنشأة وانسخ القيمة.

    !!! info "ملاحظة حول الرمز"
        أيضًا يمكن استرداد الرمز عن طريق استدعاء API لـ Wallarm. ومع ذلك، هذا يتجاوز نطاق هذه الوثيقة. 
        
##  3.  إعداد ملف يحتوي على متغيرات البيئة الضرورية

من الضروري أن تقوم بتعيين العديد من متغيرات البيئة لتعمل عقدة FAST بشكل صحيح.

للقيام بذلك، قم بإنشاء ملف نصي وأضف إليه النص التالي:

```
WALLARM_API_TOKEN=<قيمة الرمز التي حصلت عليها في الخطوة 2>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

لقد قمت بتعيين متغيرات البيئة. يمكن وصف غرضها على النحو التالي:
* `WALLARM_API_TOKEN` — يعين قيمة الرمز المستخدمة لربط العقدة بسحابة Wallarm
* `ALLOWED_HOSTS` — يحد من نطاق الطلبات لإنشاء اختبار أمان منها؛ سيتم إنشاء اختبارات الأمان فقط من الطلبات الموجهة إلى النطاق `google-gruyere.appspot.com`، حيث يقيم التطبيق المستهدف.
    
!!! info "استخدام متغير البيئة `ALLOWED_HOSTS`"
    ليس من الضروري تحديد الاسم النطاقي بالكامل. يمكنك استخدام جزء منه (مثل `google-gruyere` أو `appspot.com`).

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  نشر حاوية عقدة FAST Docker

للقيام بهذا، نفّذ الأمر التالي:

```
docker run --name <الاسم> --env-file=<ملف متغيرات البيئة المُعد في الخطوة السابقة> -p <المنفذ المستهدف>:8080 wallarm/fast
```

يجب تقديم عدة وسائط للأمر:
    
* **`--name`** *`<الاسم>`*
        
    يحدد اسم حاوية Docker.
    
    يجب أن يكون فريدًا بين جميع أسماء الحاويات الحالية.
    
* **`--env-file=`** *`<ملف متغيرات البيئة المُعد في الخطوة السابقة>`*
    
    يحدد ملفًا يحتوي على جميع متغيرات البيئة لتصديرها إلى الحاوية.
    
    يجب تحديد مسار الملف الذي أنشأته في [الخطوة السابقة][anchor3].

* **`-p`** *`<المنفذ المستهدف>`* **`:8080`**
    
    يحدد منفذ مضيف Docker الذي يجب أن يُعين إليه منفذ 8080 للحاوية. لا يتوفر أي من منافذ الحاوية لمضيف Docker افتراضيًا. 
    
    للسماح بالوصول إلى منفذ معين للحاوية من مضيف Docker، يجب نشر منفذ الحاوية الداخلي إلى المنفذ الخارجي باستخدام وسيط `-p`. 
    
    يمكنك أيضًا نشر منفذ الحاوية إلى عنوان IP غير loopback على المضيف بتوفير الوسيط `-p <IP المضيف>:<المنفذ المستهدف>:8080` لجعله يمكن الوصول إليه من خارج مضيف Docker أيضًا.        

!!! info "مثال على أمر `docker run`"
    تنفيذ الأمر التالي سيشغل حاوية باسم `fast-node` باستخدام ملف متغيرات البيئة `/home/user/fast.cfg` وينشر منفذها إلى `localhost:8080`:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

إذا كان نشر الحاوية ناجحًا، سيتم تقديم إخراج وحدة التحكم مثل هذا:

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

الآن يجب أن يكون لديك عقدة FAST جاهزة للعمل متصلة بسحابة Wallarm. العقدة تستمع إلى الطلبات الواردة HTTP وHTTPS على `localhost:8080` بتعرفها على الطلبات الموجهة لنطاق `google-gruyere.appspot.com` كأساسية.
    
    
##  5.  تهيئة المتصفح للعمل مع البروكسي

قم بتهيئة المتصفح لتوجيه كل طلبات HTTP وHTTPS من خلال عقدة FAST.

لإعداد البروكسي في متصفح Mozilla Firefox، اتبع الخطوات التالية:

1.  افتح المتصفح. اختر "التفضيلات" من القائمة. اختر علامة التبويب "عام" وقم بالتمرير لأسفل إلى "إعدادات الشبكة". اختر زر **الإعدادات**.

    ![خيارات Mozilla Firefox][img-firefox-options]

2.  يجب أن تفتح نافذة "إعدادات الاتصال". اختر خيار **تكوين البروكسي يدويًا**. قم بتهيئة البروكسي بإدخال القيم التالية:

    * **`localhost`** كعنوان البروكسي HTTP و **`8080`** كمنفذ البروكسي HTTP. 
    * **`localhost`** كعنوان البروكسي SSL و **`8080`** كمنفذ البروكسي SSL.
        
    اختر زر **ОК** لتطبيق التغييرات التي قمت بها.

    ![إعدادات البروكسي لـ Mozilla Firefox][img-firefox-proxy-options]
    
    
##  6.  تثبيت شهادات SSL

أثناء العمل مع تطبيق [Google Gruyere][link-https-google-gruyere] عبر HTTPS، قد تواجه الرسالة التالية من المتصفح بخصوص انقطاع الاتصال الآمن:

![رسالة "اتصال غير آمن"][img-insecure-connection]

يجب إضافة شهادة SSL ذاتية التوقيع لعقدة FAST لتتمكن من التفاعل مع التطبيق الويب عبر HTTPS. للقيام بذلك، انتقل إلى هذا [الرابط][link-ssl-installation]، اختر متصفحك من القائمة، وقم بإجراء الإجراءات اللازمة الموصوفة. يقترح هذا الدليل أن تستخدم متصفح Mozilla Firefox.
        
بعد تشغيل وتهيئة عقدة FAST الخاصة بك، يجب أن تكون قد أكملت الآن جميع أهداف الفصل. في الفصل التالي، ستتعرف على ما هو مطلوب لإنشاء مجموعة من اختبارات الأمان بناءً على عدد قليل من الطلبات الأساسية.