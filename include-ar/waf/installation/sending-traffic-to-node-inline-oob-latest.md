اعتمادًا على طريقة النشر المستخدمة، قم بإجراء الإعدادات التالية:

=== "مباشرة"
    قم بتحديث أهداف موازن الحمل لإرسال المرور إلى نسخة Wallarm. للتفاصيل، يرجى الرجوع إلى الوثائق الخاصة بموازن الحمل الخاص بك.

=== "خارج المسار"
    1. قم بتكوين وحدة خدمتك الويب أو الخادم الوكيل (على سبيل المثال، NGINX، Envoy) لنسخ المرور الوارد إلى عقدة Wallarm. للحصول على تفاصيل التكوين، نوصي بالرجوع إلى وثائق الوحدة الخدمية للويب أو الخادم الوكيل الخاص بك.

        داخل ال[رابط][web-server-mirroring-examples]، ستجد إعداد المثال لأشهر وحدات الخدمة الويبية والخوادم الوكيلة (NGINX، Traefik، Envoy).
    1. ضع الإعداد التالي في الملف `/etc/nginx/sites-enabled/default` على النسخة بالعقدة:

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # غير 222.222.222.22 إلى عنوان الخادم الناسخ
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        تعد التوجيهات `set_real_ip_from` و `real_ip_header` ضرورية ليتمكن منصة Wallarm من [عرض عناوين IP للمهاجمين][real-ip-docs].