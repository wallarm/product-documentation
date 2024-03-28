[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

# العمل مع مقاييس عُقدة الفلتر في Nagios

تأكد من أن Nagios يراقب حالة الخدمة المُنشأة مسبقًا بنجاح:
1. قم بتسجيل الدخول إلى واجهة ويب Nagios.
2. اذهب إلى صفحة الخدمات بالنقر على رابط "الخدمات".
3. تأكد من عرض خدمة `wallarm_nginx_abnormal` وأن حالتها "موافق":

    ![حالة الخدمة][img-nagios-service-status]

    
    !!! info "إجبار على التحقق من الخدمة"
        إذا لم تكن حالة الخدمة "موافق"، يمكنك إجبار التحقق من الخدمة لتأكيد حالتها.

        للقيام بذلك، انقر على اسم الخدمة في عمود "الخدمة"، ثم شغل التحقق بتحديد "إعادة جدولة التحقق القادم لهذه الخدمة" في قائمة "أوامر الخدمة" وإدخال البارامترات اللازمة.
    

4. عرض المعلومات المفصلة عن الخدمة بالنقر على الرابط باسمها في عمود "الحالة":

    ![معلومات مفصلة عن الخدمة][img-nagios-service-details]

    تأكد من أن قيمة المقياس المعروضة في Nagios (صف "بيانات الأداء") تتطابق مع الإخراج `wallarm-status` على عقدة الفلتر:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
 
5. قم بإجراء هجوم تجريبي على تطبيق تحميه عقدة الفلتر. للقيام بذلك، يمكنك إرسال طلب ضار إلى التطبيق إما باستخدام أداة curl أو متصفح.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
6. تأكد من أن قيمة "بيانات الأداء" في Nagios قد ازدادت وتتطابق مع القيمة التي يعرضها `wallarm-status` على عقدة الفلتر:

    --8<-- "../include/monitoring/wallarm-status-output-latest.md"

    ![قيمة بيانات الأداء المحدثة][img-nagios-service-perfdata-updated]

الآن، يتم عرض قيم المقياس `curl_json-wallarm_nginx/gauge-abnormal` لعقدة الفلتر في معلومات حالة الخدمة في Nagios.

!!! info "تصور البيانات في Nagios"
    بشكل افتراضي، يدعم Nagios Core فقط تتبع حالة الخدمة (`OK`, `WARNING`, `CRITICAL`). لتخزين وتصوير قيم المقاييس المحتواة في "بيانات الأداء"، يمكنك استخدام أدوات خارجية، مثل [PNP4Nagios][link-PNP4Nagios].