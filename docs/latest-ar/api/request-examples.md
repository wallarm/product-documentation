[access-wallarm-api-docs]: #your-own-client
[application-docs]: ../user-guides/settings/applications.md

# أمثلة على طلب API من Wallarm

فيما يلي بعض أمثلة استخدام API من Wallarm. يمكنك أيضًا إنشاء أمثلة الرموز عبر واجهة المستخدم للإشارة إلى API لـ [السحابة الأمريكية](https://apiconsole.us1.wallarm.com/) أو [السحابة الأوروبية](https://apiconsole.eu1.wallarm.com/). يمكن للمستخدمين ذوي الخبرة أيضًا استخدام واجهة برمجة الطبيقات المطورة للمتصفح ("علامة التبويب الشبكة") لتعلم بسرعة أي نقاط الطرف والطلبات المستخدمة من واجهة المستخدم لحسابك في Wallarm لجمع البيانات من API العامة. يمكنك البحث عن معلومات حول كيفية فتح وحدة تحكم المطور باستخدام التوثيق الرسمي للمتصفح ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## احصل على الهجمات الـ50 الأولى التي تم اكتشافها في الـ 24 ساعة الماضية

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة وتحويله إلى تنسيق [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-attacks-en.md"

## الحصول على عدد كبير من الهجمات (100 وأكثر)

بالنسبة لمجموعات الهجمات والضربات التي تحتوي على 100 سجل أو أكثر ، من الأفضل استردادها بأجزاء أصغر بدلاً من جمع مجموعات البيانات الكبيرة في آن واحد، وذلك من أجل تحسين الأداء. وتدعم نقاط API العليا لـ Wallarm الصفحة بناءً على المؤشر مع 100 سجل لكل صفحة.

تتضمن هذه التقنية إعادة المؤشر إلى عنصر محدد في مجموعة البيانات ثم في الطلبات التالية ، يعيد الخادم النتائج بعد المؤشر المعطى. لتمكين ترتيب الصفحة بواسطة المؤشر، تضمين `"paging": true` في معلمات الطلب.

فيما يلي أمثلة لاستدعاءات API لاسترداد جميع الهجمات التي تم اكتشافها منذ `<TIMESTAMP>` باستخدام ترتيب الصفحة بواسطة المؤشر:

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```

يعود هذا الطلب بمعلومات حول الهجمات الـ100 الأخيرة المكتشفة، مرتبة من الأحدث إلى الأقدم. بالإضافة إلى ذلك، يتضمن الرد معلمة `cursor` التي تحتوي على مؤشر إلى المجموعة التالية من 100 هجوم.

لاسترداد الـ100 هجوم التالية، استخدم نفس الطلب مثل السابق ولكن قم بتضمين معلمة `cursor` مع قيمة المؤشر نسخ من رد الطلب السابق. يتيح هذا لواجهة برمجة التطبيقات معرفة أين تبدأ في إرجاع المجموعة التالية من 100 هجوم من ، على سبيل المثال:

=== "EU Cloud"
    ```bash
    curl -k 'https://api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
=== "US Cloud"
    ```bash
    curl -k 'https://us1.api.wallarm.com/v2/objects/attack' \
      -X POST \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'Content-Type: application/json' \
      -d '{"cursor":"<POINTER_FROM_PREVIOUS_RESPONSE>", "paging": true, "filter": {"clientid": [<YOUR_CLIENT_ID>], "vulnid": null, "time": [[<TIMESTAMP>, null]], "!state": "falsepositive"}}'
    ```
لاسترداد صفحات النتائج الأخرى، تنفيذ طلبات تضمن معلمة `cursor` مع القيمة نسخ من الرد السابق.

أدناه هو مثال لرمز Python لاسترداد الهجمات باستخدام ترتيب الصفحة بواسطة المؤشر:

=== "EU Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

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
=== "US Cloud"
    ```python
    import json
    from pprint import pprint as pp

    import requests


    client_id = <YOUR_CLIENT_ID>
    ts = <TIMESTAMP>  # UNIX time

    url = "https://us1.api.wallarm.com/v2/objects/attack"
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

## الحصول على الحوادث الـ50 الأولى المؤكدة في الـ 24 ساعة الماضية

الطلب مشابه جدًا للمثال السابق لقائمة الهجمات؛ يتم إضافة الحالة `"!vulnid": null` إلى هذا الطلب. توجه هذه الحالة للـ API لتجاهل جميع الهجمات التي لا تحتوي على معرف الثغرات الأمنية المحدد، وهكذا تميز النظام بين الهجمات والحوادث.

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة وتحويله إلى تنسيق [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-incidents-en.md"

## الحصول على الثغرات الأمنية الـ50 الأولى في الوضع "نشط" خلال الـ24 ساعة الماضية

يرجى استبدال `TIMESTAMP` بالتاريخ منذ 24 ساعة وتحويله إلى تنسيق [Unix Timestamp](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## الحصول على جميع القواعد المكونة

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## الحصول على الشروط فقط لجميع القواعد

--8<-- "../include/api-request-examples/get-conditions.md"

## الحصول على القواعد المرتبطة بشرط محدد

للإشارة إلى شرط معين ، استخدم معرفه - يمكنك الحصول عليه عند طلب شروط جميع القواعد (انظر أعلاه).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## قم بإنشاء التصحيح الافتراضي لمنع كل الطلبات المرسلة إلى `/my/api/*`

--8<-- "../include/api-request-examples/create-rule-en.md"

## إنشاء التصحيح الافتراضي لمعرف نموذج التطبيق المحدد لمنع كل الطلبات المرسلة إلى `/my/api/*`

يجب أن يكون التطبيق [مكوناً](../user-guides/settings/applications.md) قبل إرسال هذا الطلب. حدد معرف التطبيق الموجود في `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## أنشئ قاعدة للحساب بك أن الطلبات ذات القيمة المحددة للرأس `X-FORWARDED-FOR` هي هجمات

سيقوم الطلب التالي بإنشاء [مؤشر هجوم مخصص استنادًا إلى regexp](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`.

إذا كانت الطلبات إلى النطاق `MY.DOMAIN.COM` لديها رأس HTTP `X-FORWARDED-FOR: 44.33.22.11`, ستعتبر عقدة Wallarmهم كهجمات من الاسكانير وسوف تمنع الهجمات إذا تم تعيين الوضع الفلترة المقابل [filtration mode](../admin-en/configure-wallarm-mode.md).

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## أنشئ القاعدة التي تضبط وضع الفلترة على المراقبة للتطبيق المحدد

سيقوم الطلب التالي بإنشاء ال[قاعدة التي تضبط العقدة لتصفية الحركة](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console) المتجهة إلى [التطبيق](../user-guides/settings/applications.md) مع معرف `3` بوضع المراقبة.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## حذف القاعدة بمعرفها

يمكنك نسخ معرف القاعدة ليتم حذفه عند [الحصول على جميع القواعد المكونة](#get-all-configured-rules). كما تم إرجاع معرف القاعدة في استجابة لطلب إنشاء القاعدة ، في معلمة الاستجابة `id`.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## استدعاءات API للحصول على، وتعبئة وحذف كائنات قائمة الـ IP

أدناه بعض الأمثلة على استدعاءات API للحصول على، وتعبئة وحذف كائنات [قائمة الـ IP](../user-guides/ip-lists/overview.md).

### معلمات طلب API 

المعلمات التي يجب تمريرها في طلبات API لقراءة وتغيير قوائم الـ IP:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### إضافة إلى القائمة الإدخالات من ملف `.csv`

لإضافة IPs أو الشبكات الفرعية من ملف `.csv` إلى القائمة، استعمل النص البرمجي bash التالي:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### إضافة إلى القائمة IP واحدة أو شبكة فرعية

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### إضافة إلى القائمة العديد من الدول

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### إضافة إلى القائمة العديد من خدمات البروكسي

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### حذف كائن من قائمة الـ IP

يتم حذف الكائنات من قوائم الـ IP بواسطة معرفاتهم.

للحصول على معرف الكائن، اطلب محتويات قائمة الـ IP وانسخ `objects.id` من الكائن المطلوب من الاستجابة:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

عندما يكون لديك معرف الكائن، أرسل الطلب التالي لحذف الكائن من القائمة:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

يمكنك حذف أكثر من كائن في وقت واحد عن طريق تمرير معرفاتهم كمصفوفة في طلب الحذف.