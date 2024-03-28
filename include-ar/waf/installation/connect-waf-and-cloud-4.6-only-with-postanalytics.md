يلتقي عقدة تصفية Wallarm بسحابة Wallarm. تحتاج إلى توصيل العقدة بالسحابة.

عند توصيل العقدة بالسحابة، يمكنك تعيين اسم العقدة، الذي سيتم عرضه في واجهة مستخدم Wallarm Console ووضع العقدة في **مجموعة عقد** مناسبة (تُستخدم لتنظيم العقد منطقيًا في واجهة المستخدم).

![العقد المجمعة][img-grouped-nodes]

لتوصيل العقدة بالسحابة، استخدم رمز Wallarm من [النوع المناسب][wallarm-token-types]:

=== "رمز API"

    1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.
    1. شغِّل السكربت `register-node` على جهاز تقوم فيه بتثبيت عقدة التصفية:

        === "سحابة الولايات المتحدة"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "سحابة الاتحاد الأوروبي"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` هو القيمة المنسوخة لرمز API بدور `Deploy`.
        * المعامل `--labels 'group=<GROUP>'` يضع عقدتك في مجموعة العقد `<GROUP>` (الموجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها).

=== "رمز العقدة"

    1. افتح Wallarm Console → **العقد** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes).
    1. قم بواحد مما يلي: 
        * أنشئ عقدة من نوع **عقدة Wallarm** وانسخ الرمز الذي تم إنشاؤه.
        * استخدم مجموعة عقد موجودة - انسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.
    1. شغِّل السكربت `register-node` على جهاز تقوم فيه بتثبيت عقدة التصفية:

        === "سحابة الولايات المتحدة"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "سحابة الاتحاد الأوروبي"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` هي القيمة المنسوخة لرمز العقدة.

* يمكنك إضافة المعامل `-n <HOST_NAME>` لتعيين اسم مخصص لنسخة العقدة الخاصة بك. سيكون اسم النسخة النهائي هو: `HOST_NAME_NodeUUID`.