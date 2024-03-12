[img-nagios-service-status]:            ../../images/monitoring/nagios-service-status.png
[img-nagios-service-details]:           ../../images/monitoring/nagios-service-details-1.png
[img-nagios-service-perfdata-updated]:  ../../images/monitoring/nagios-service-details-2.png

[link-PNP4Nagios]:                      http://www.pnp4nagios.org/doku.php?id=pnp-0.4:start

#   العمل مع مقاييس عقدة التصفية في ناجيوس

تأكد من أن ناجيوس يراقب بنجاح حالة الخدمة التي تم إنشاؤها مسبقًا:
1.  قم بتسجيل الدخول إلى واجهة ويب ناجيوس.
2.  انتقل إلى صفحة الخدمات بالنقر على رابط "الخدمات".
3.  تأكد من أن خدمة `wallarm_nginx_abnormal` تظهر ولديها حالة "موافق":

    ![حالة الخدمة][img-nagios-service-status]

    
    !!! info "فرض فحص الخدمة"
        إذا لم تكن الخدمة بحالة "موافق"، يمكنك فرض فحص للخدمة لتأكيد حالتها.
        
        للقيام بذلك، انقر على اسم الخدمة في عمود "الخدمة"، ثم قم بتشغيل الفحص باختيار "جدولة الفحص التالي لهذه الخدمة" في قائمة "أوامر الخدمة" وإدخال الباراميترات اللازمة.    
    

4.  قم بعرض معلومات مفصلة عن الخدمة بالنقر على الرابط باسمها في عمود "الحالة":

    ![معلومات مفصلة عن الخدمة][img-nagios-service-details]

    تأكد من أن قيمة المقياس المعروضة في ناجيوس (صف "بيانات الأداء") تتطابق مع إخراج `wallarm-status` على عقدة التصفية:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
 
5.  قم بتنفيذ هجوم تجريبي على تطبيق محمي بواسطة عقدة التصفية. للقيام بذلك، يمكنك إرسال طلب ضار إلى التطبيق إما بواسطة أداة curl أو متصفح.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
6.  تأكد من أن قيمة "بيانات الأداء" في ناجيوس قد زادت وتتطابق مع القيمة المعروضة بواسطة `wallarm-status` على عقدة التصفية:

    --8<-- "../include/monitoring/wallarm-status-output-latest.md"

    ![قيمة بيانات الأداء المحدثة][img-nagios-service-perfdata-updated]

الآن يتم عرض قيم مقياس `curl_json-wallarm_nginx/gauge-abnormal` لعقدة التصفية في معلومات حالة الخدمة في ناجيوس.

!!! info "تصور بيانات ناجيوس"
    بشكل افتراضي، ناجيوس كور لا يدعم سوى تتبع حالة الخدمة (`موافق`, `تحذير`, `حرج`). لتخزين وتصور قيم المقاييس الموجودة في "بيانات الأداء"، يمكنك استخدام أدوات الطرف الثالث، على سبيل المثال، [PNP4Nagios][link-PNP4Nagios].