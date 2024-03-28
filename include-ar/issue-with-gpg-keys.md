!!! warning "مشكلة في مفاتيح GPG الخاصة بـCentOS"
    إذا كنت قد أضفت مستودع Wallarm مسبقًاوواجهت خطأً يتعلق بصحة مفاتيح GPG الخاصة بـCentOS، يرجى اتباع الخطوات التالية:

    1. أزل المستودع المضاف باستخدام الأمر `yum remove wallarm-node-repo`.
    2. أضف المستودع باستخدام الأمر المناسب من اللسان العلوي المذكور أعلاه.

    رسائل الخطأ المحتملة:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] تعذر التحقق من توقيع repomd.xml لـ wallarm-node_2.14`
    * `فشل أحد المستودعات المُعدَّة (Wallarm Node لـ CentOS 7 - 2.14)، ولا يمتلك yum بيانات مخبأة كافية للمتابعة.`