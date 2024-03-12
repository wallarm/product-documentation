[access-wallarm-api-docs]: #your-own-client
[application-docs]:        ../user-guides/settings/applications.md

# أمثلة على طلبات واجهة برمجة تطبيقات Wallarm

التالي هو بعض الأمثلة على استخدام واجهة برمجة تطبيقات Wallarm. يمكنك أيضًا توليد أمثلة للكود عن طريق واجهة الاستخدام لمرجع واجهة برمجة التطبيقات لـ [السحاب الأمريكي](https://apiconsole.us1.wallarm.com/) أو [السحاب الأوروبي](https://apiconsole.eu1.wallarm.com/). يمكن للمستخدمين ذوي الخبرة استخدام وحدة التحكم الخاصة بمطور المتصفح ("علامة تبويب الشبكة") لمعرفة بسرعة أي نقاط النهاية لواجهة برمجة التطبيقات والطلبات التي يستخدمها واجهة المستخدم الخاصة بحساب Wallarm الخاص بك لجلب البيانات من واجهة برمجة التطبيقات العامة. للعثور على معلومات حول كيفية فتح وحدة التحكم الخاصة بالمطور، يمكنك استخدام وثائق المتصفح الرسمية ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## احصل على أول 50 هجومًا تم اكتشافهم في آخر 24 ساعة

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة محولًا إلى صيغة [وقت Unix](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-attacks-en.md"

## الحصول على عدد كبير من الهجمات (100 وأكثر)

لمجموعات الهجمات والضربات التي تحتوي على 100 سجل أو أكثر، من الأفضل استرجاعها بأجزاء أصغر بدلاً من جلب مجموعات البيانات الكبيرة دفعة واحدة، بهدف تحسين الأداء. تدعم نقاط نهاية واجهة برمجة تطبيقات Wallarm المناسبة الترقيم بناءً على المؤشر مع 100 سجل لكل صفحة.

تشمل هذه التقنية على إرجاع مؤشر لعنصر معين في مجموعة البيانات ثم في الطلبات اللاحقة، يعيد الخادم النتائج بعد المؤشر المعطى. لتمكين الترقيم بالمؤشر، قم بتضمين `"paging": true` في معاملات الطلب.

التالي هو أمثلة على استدعاءات واجهة برمجة التطبيقات لاسترجاع جميع الهجمات المكتشفة منذ `<TIMESTAMP>` باستخدام الترقيم بالمؤشر:

=== "السحاب الأوروبي"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "السحاب الأمريكي"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

يعيد هذا الطلب معلومات حول آخر 100 هجوم تم اكتشافه، مرتبة من الأحدث إلى الأقدم. بالإضافة إلى ذلك، يتضمن الرد معلمة `cursor` التي تحتوي على مؤشر للمجموعة التالية من 100 هجوم.

للحصول على الـ 100 هجوم التالية، استخدم نفس الطلب كما كان من قبل ولكن أدرج معلمة `cursor` مع قيمة المؤشر المنسوخة من رد الطلب السابق. هذا يسمح لواجهة برمجة التطبيقات بمعرفة من أين تبدأ في إرجاع المجموعة التالية من 100 هجوم من، مثلًا:

=== "السحاب الأوروبي"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "السحاب الأمريكي"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

للحصول على المزيد من صفحات النتائج، قم بتنفيذ الطلبات بما في ذلك معلمة `cursor` بالقيمة المنسوخة من الرد السابق.

فيما يلي مثال على كود Python لاسترجاع الهجمات باستخدام ترقيم المؤشر:

=== "السحاب الأوروبي"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # وقت UNIX

    url = "https://api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```
=== "السحاب الأمريكي"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # وقت UNIX

    url = "https://us1.api.wallarm.com/v2/objects/attack"
    headers = {
        "X-WallarmApi-Token": "<YOUR_TOKEN>",
        "X-WallarmAPI-Secret": "<YOUR_SECRET_KEY>",
        "Content-Type": "application/json",
    }
    payload = {
        "paging": True,
        "filter": {
            "clientid": [client_id],
            "vulnid": None,
            "time": [[ts, None]],
            "!state": "falsepositive",
        },
    }


    while True:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        cursor = data.get("cursor")
        if not cursor:
            break

        pp(data)
        payload["cursor"] = cursor
    ```

## احصل على أول 50 حادثة تم تأكيدها في آخر 24 ساعة

الطلب مشابه جدًا لمثال القائمة السابقة للهجمات؛ يتم إضافة مصطلح `"!vulnid": null` لهذا الطلب. يعلم هذا المصطلح واجهة برمجة التطبيقات بتجاهل كل الهجمات بدون معرّف الثغرة الأمنية المحدد، وهذه هي الطريقة التي يفرق بها النظام بين الهجمات والحوادث.

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة محولًا إلى صيغة [وقت Unix](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-incidents-en.md"

## احصل على أول 50 ثغرة أمنية بحالة "نشطة" خلال آخر 24 ساعة

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة محولًا إلى صيغة [وقت Unix](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## احصل على كل القواعد المكونة

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## احصل على شروط كل القواعد فقط

--8<-- "../include/api-request-examples/get-conditions.md"

## احصل على القواعد المرتبطة بشرط معين

للإشارة إلى شرط معين، استخدم معرفه - يمكنك الحصول عليه عند طلب شروط كل القواعد (انظر أعلاه).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## إنشاء تصحيح افتراضي لحظر كل الطلبات المرسلة إلى `/my/api/*`

--8<-- "../include/api-request-examples/create-rule-en.md"

## إنشاء تصحيح افتراضي لمعرّف نموذج تطبيق معين لحظر كل الطلبات المرسلة إلى `/my/api/*`

يجب أن يكون التطبيق [مكوّنًا](../user-guides/settings/applications.md) قبل إرسال هذا الطلب. حدد معرّف تطبيق موجود في `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## إنشاء قاعدة لاعتبار الطلبات ذات قيمة معينة لرأس الـ `X-FORWARDED-FOR` كهجمات

سيقوم الطلب التالي بإنشاء [مؤشر هجوم مخصص بناءً على التعبير النظامي](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`.

إذا كانت الطلبات إلى نطاق `MY.DOMAIN.COM` تحتوي على رأس HTTP `X-FORWARDED-FOR: 44.33.22.11` ، سيعتبر عقدة Wallarm هذه الطلبات أنها هجمات من قبل الماسح وتحظر الهجمات إذا تم ضبط [وضع التصفية](../admin-en/configure-wallarm-mode.md) المقابل.

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## إنشاء القاعدة لضبط وضع التصفية على المراقبة لتطبيق معين

سيقوم الطلب التالي بإنشاء [قاعدة ضبط العقدة لتصفية الحركة](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console) المتجهة إلى [التطبيق](../user-guides/settings/applications.md) بمعرّف `3` في وضع المراقبة.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## حذف القاعدة بمعرّفها

يمكنك نسخ معرّف القاعدة المراد حذفها عند [الحصول على كل القواعد المكونة](#get-all-configured-rules). بالإضافة إلى ذلك، تم إرجاع معرّف القاعدة في رد طلب إنشاء القاعدة، في معلمة الرد `id`.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## استدعاءات واجهة برمجة التطبيقات للحصول على معلومات، إضافة وحذف كائنات قائمة عناوين الـ IP

فيما يلي بعض الأمثلة على استدعاءات واجهة برمجة التطبيقات للحصول على معلومات، إضافة وحذف كائنات [قائمة عناوين الـ IP](../user-guides/ip-lists/overview.md).

### معاملات طلب واجهة برمجة التطبيقات

المعاملات التي يتم تمريرها في طلبات واجهة برمجة التطبيقات لقراءة وتغيير قوائم الـ IP:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### إضافة إلى القائمة الإدخالات من ملف `.csv`

لإضافة عناوين الـ IP أو الشبكات الفرعية من ملف `.csv` إلى القائمة، استخدم السكريبت