[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


# تكوين قواعد البروكسي

!!! warning "انتباه"
    قم بتنفيذ الخطوات الموضحة في هذا الفصل فقط إذا تم نشر عقدة FAST إما عبر [API][doc-node-deployment-api] أو عبر [وضع التسجيل CI Mode][doc-fast-recording-mode].

قم بتكوين مصدر طلبك لاستخدام عقدة FAST كبروكسي HTTP لجميع الطلبات الموجهة نحو التطبيق الهدف.

اعتمادًا على الطريقة التي تتفاعل بها بنية CI/CD الخاصة بك مع حاوية Docker لعقدة FAST، يمكنك مخاطبة العقدة بإحدى الوسائل التالية:
* عنوان IP.
* اسم النطاق.

!!! info "مثال"
    إذا كان أداة الاختبار تعمل كحاوية Docker على Linux، يمكنك تمرير المتغير البيئي التالي إلى الحاوية لتمكين التوجيه الوكيلي لجميع طلبات HTTP من تلك الحاوية عبر عقدة FAST:
    
    ```
    HTTP_PROXY=http://<اسم أو عنوان IP عقدة FAST>:<المنفذ>
    ```