يتفاعل عقد التصفية Wallarm مع سحابة Wallarm. تحتاج إلى ربط العقدة بالسحابة.

عند ربط العقدة بالسحابة، يمكنك تعيين اسم العقدة، الذي سيتم عرضه ضمن واجهة مستخدم Wallarm Console ووضع العقدة ضمن **مجموعة عقد** مناسبة (تُستخدم لتنظيم العقد بشكل منطقي في واجهة المستخدم).

![العقد المجمعة][img-grouped-nodes]

لربط العقدة بالسحابة، استخدم رمز Wallarm من [النوع المناسب][wallarm-token-types]:

=== "رمز API"

    1. افتح Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث عن رمز API بدور المصدر `Deploy` أو أنشئ واحداً.
    1. انسخ هذا الرمز.
    1. قم بتشغيل سكربت `register-node` على جهاز حيث قمت بتثبيت عقدة التصفية:

        === "السحابة الأمريكية"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "السحابة الأوروبية"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` هو القيمة المنسوخة لرمز API بدور `Deploy`.
        * الباراميتر `--labels 'group=<GROUP>'` يضع عقدتك ضمن مجموعة العقد `<GROUP>` (سواء القائمة أولا، وإن لم تكن موجودة، سيتم إنشاؤها). إذا كنت تثبت وحدات التصفية وتحليلات ما بعد بشكل منفصل، يُنصح بوضعها ضمن نفس المجموعة.

=== "رمز العقدة"

    1. افتح Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. قم بإحدى الخطوات التالية: 
        * أنشئ عقدة بنوع **عقدة Wallarm** وانسخ الرمز المُولد.
        * استخدم مجموعة عقد موجودة - انسخ الرمز باستخدام قائمة العقدة → **انسخ الرمز**.
    1. قم بتشغيل سكربت `register-node` على جهاز حيث قمت بتثبيت عقدة التصفية:

        === "السحابة الأمريكية"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "السحابة الأوروبية"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` هو القيمة المنسوخة لرمز العقدة. إذا كنت تثبت وحدات التصفية وتحليلات ما بعد بشكل منفصل، يُنصح بوضعها ضمن نفس المجموعة باستخدام نفس رمز العقدة.

* يمكنك إضافة الباراميتر `-n <HOST_NAME>` لتعيين اسم مخصص لنسخة عقدتك. اسم النسخة النهائي سيكون: `HOST_NAME_NodeUUID`.