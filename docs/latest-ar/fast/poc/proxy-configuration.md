[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   ضبط قواعد الوكيل

!!! warning "انتباه"
    قم بتنفيذ الخطوات الموضحة في هذا الفصل فقط في حالة نشر عقدة FAST عبر [واجهة برمجة التطبيقات][doc-node-deployment-api] أو عبر [وضع السجّل في وضع CI][doc-fast-recording-mode].

اضبط مصدر طلباتك لاستخدام عقدة FAST كوكيل HTTP لجميع الطلبات المرسلة نحو التطبيق المستهدف.

باعتماد على كيفية تفاعل بنيتك التحتية لـCI/CD مع حاوية Docker الخاصة بعقدة FAST، يمكنك تحديد العقدة بإحدى الوسائل التالية:
* عنوان IP.
* اسم النطاق.

!!! info "مثال"
    إذا كان أداة اختبارك تعمل كحاوية Docker على Linux، يمكنك تمرير متغير البيئة التالي إلى الحاوية لتمكين الوكيل لجميع طلبات HTTP من تلك الحاوية عبر عقدة FAST:
    
    ```
    HTTP_PROXY=http://<اسم عقدة FAST أو عنوان IP>:<المنفذ>
    ```