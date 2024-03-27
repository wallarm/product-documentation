عقدة التصفية Wallarm تتفاعل مع Wallarm Cloud. تحتاج إلى ربط العقدة بالسحابة.

عند ربط العقدة بالسحابة، يمكنك تعيين اسم العقدة، الذي سيتم عرضه تحته في واجهة مستخدم Wallarm Console ووضع العقدة في **مجموعة العقد** المناسبة (تُستخدم لتنظيم العقد بطريقة منطقية في واجهة المستخدم).

![العقد المجمعة][img-grouped-nodes]

لربط العقدة بالسحابة، استخدم رمز Wallarm من [النوع المناسب][wallarm-token-types]:

=== "رمز API"

    1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/settings/api-tokens).
    1. ابحث عن رمز API بدور مصدر `Deploy` أو أنشئه.
    1. انسخ هذا الرمز.
    1. قم بتشغيل سكربت `register-node` على جهاز تثبت عليه عقدة التصفية:

        === "سحابة الولايات المتحدة"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "سحابة الاتحاد الأوروبي"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` هو القيمة المنسوخة لرمز API بدور `Deploy`.
        * الوسيط `--labels 'group=<GROUP>'` يضع عقدتك في مجموعة العقد `<GROUP>` (الموجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها).

=== "رمز العقدة"

    1. افتح Wallarm Console → **العقد** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes).
    1. قم بأحد الإجراءات التالية: 
        * أنشئ عقدة من نوع **عقدة Wallarm** وانسخ الرمز المولد.
        * استخدم مجموعة عقد موجودة - انسخ الرمز باستخدام قائمة العقدة → **انسخ الرمز**.
    1. قم بتشغيل سكربت `register-node` على جهاز تثبت عليه عقدة التصفية:

        === "سحابة الولايات المتحدة"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "سحابة الاتحاد الأوروبي"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` هو القيمة المنسوخة لرمز العقدة.

* يمكنك إضافة وسيط `-n <HOST_NAME>` لتعيين اسم مخصص لنموذج عقدتك. سيكون اسم النموذج النهائي: `HOST_NAME_NodeUUID`.