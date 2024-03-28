# استكشاف الأخطاء وإصلاحها في تارانتول

تقدم الأقسام أدناه المعلومات حول الأخطاء الشائعة في تشغيل تارانتول وكيفية تصحيحها.

## كيف يمكنني حل مشكلة "وصول إلى الحد الأقصى للقراءة التمهيدية"؟

في ملف `/var/log/wallarm/tarantool.log` أو `/opt/wallarm/var/log/wallarm/tarantool-out.log` [اعتمادًا على طريقة تثبيت العقدة](../admin-en/configure-logging.md)، قد تواجه أخطاء مثل:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

هذه المشكلة ليست حرجة، لكن كثرة مثل هذه الأخطاء قد تقلل من أداء الخدمة.

لحل المشكلة:

1. انتقل إلى مجلد `/usr/share/wallarm-tarantool/init.lua` → ملف `box.cfg`.
1. ضع أحد الخيار التالية:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

يحدد المعلم `readahead` حجم الذاكرة العازلة المسبقة القراءة المرتبطة باتصال عميل. كلما زاد الحجم، زادت الذاكرة التي يستهلكها اتصال نشط وزادت الطلبات التي يمكن قراءتها من ذاكرة نظام التشغيل في استدعاء نظام واحد. اطّلع على مزيد من التفاصيل في [التوثيق](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead) الخاص بتارانتول.

## كيف يمكنني حل مشكلة "وصول إلى الحد الأقصى لـ net_msg_max"؟

في ملف `/var/log/wallarm/tarantool.log` أو `/opt/wallarm/var/log/wallarm/tarantool-out.log` [اعتمادًا على طريقة تثبيت العقدة](../admin-en/configure-logging.md)، قد تواجه أخطاء مثل:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

لحل المشكلة، زد قيمة `net_msg_max` (القيمة الافتراضية `768`):

1. انتقل إلى مجلد `/usr/share/wallarm-tarantool/init.lua` → ملف `box.cfg`.
1. زد قيمة `net_msg_max`، على سبيل المثال:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

لمنع تأثير تكلفة الألياف على النظام بأكمله، يقيد المعلم `net_msg_max` عدد الرسائل التي تعالجها الألياف. اقرأ التفاصيل حول استخدام `net_msg_max` في [التوثيق](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max) الخاص بتارانتول.