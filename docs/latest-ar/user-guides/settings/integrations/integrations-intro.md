# نظرة عامة على التكاملات

تعمل Wallarm على تعزيز أمانك واحدة خطوة أعلى عن طريق الاندماج بسلاسة مع مجموعة واسعة من النظم لتبقيك على اطلاع في الوقت الفعلي.

مع تكاملات Wallarm، ستبقى دائمًا على علم بالأحداث الهامة، بما في ذلك:

* التنبيهات الفورية حول الـ[hits المكتشفة](../../../user-guides/events/check-attack.md)، بحيث يمكنك اتخاذ إجراء فوري ضد التهديدات.
* التحديثات المتعلقة بأحداث النظام (التغييرات في المستخدمين المسجلين [المستخدمين](../../../user-guides/settings/users.md)، التكاملات، والتطبيقات [التطبيقات](../../../user-guides/settings/applications.md))، للتأكد من أنك دائمًا في السيطرة.
* الإعلام عن التغييرات الهامة في الملف الشخصي للأمان الخاص بك، مثل تغييرات قواعدك [القواعد](../../../user-guides/rules/rules.md) والمحفزات [المحفزات](../../../user-guides/triggers/triggers.md) الخاصة بك.
* التحذيرات المتجددة حول الثغرات الأمنية المحتملة [الثغرات الأمنية](../../../about-wallarm/detecting-vulnerabilities.md) في البنية التحتية الخاصة بك ومستويات الخطر الخاصة بها، بحيث يمكنك معالجة الضعف الأكثر خطورة بشكل احترافي.

يمكنك إدارة الميزة في قسم **التكاملات** من وحدة تحكم Wallarm وقسم **المحفزات** لتكوين التنبيهات الإضافية للتكاملات الخاصة بك.

![التكاملات](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarm تتصل بكل سلاسة بعدد من الأدوات والمنصات الموجودة. عدد التكاملات مع نظام واحد غير محدود.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## البريد الإلكتروني والرسائل

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>البريد الإلكتروني</h3>
            <p>احصل على إشعارات على البريد الإلكتروني المشار إليه عند التسجيل ورسائل إلكترونية إضافية</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>إرسال الإشعارات إلى القناة الخاصة Slack المحددة</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>أضف بوت Wallarm إلى Telegram وأرسل الإشعارات إليه</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>إرسال الإشعارات إلى القناة الخاصة Microsoft Teams المحددة</p>
        </a>
    </div>
</div>

## أنظمة إدارة الحوادث والمهام

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>قم بالتكامل عبر Opsgenie API</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>إرسال الحوادث إلى PagerDuty</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>قم بإعداد Wallarm لإنشاء قضايا في Jira</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>قم بإعداد Wallarm لإنشاء تذاكر المشاكل في ServiceNow</p>
        </a>
    </div>
</div>

## أنظمة SIEM وSOAR

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>إرسال الرسائل إلى Sumo Logic</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>إرسال التنبيهات إلى Splunk</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>إرسال الإشعارات إلى InsightConnect</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>قم بتسجيل الأحداث في Microsoft Azure Sentinel</p>
        </a>
    </div>
</div>

## أنظمة إدارة السجلات

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>إرسال الأحداث إلى خدمة Datadog Logs مباشرة أو من خلال جامعي البيانات الوسطاء</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>إرسال الأحداث إلى خدمة Datadog Logs مباشرة أو من خلال جامعي البيانات الوسطاء</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>التكامل الأصلي</h3>
            <p>إرسال سجلات الى Datadog مباشرة</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>إرسال السجلات إلى Datadog عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>إرسال السجلات إلى Datadog عبر Logstash</p>
        </a>
    </div>
</div>

## الجامعين للبيانات

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Fluentd أو استخدم Fluentd كنظام وسيط للتكامل مع النظم الأخرى</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Logstash أو استخدم Logstash كنظام وسيط للتكامل مع النظم الأخرى</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>قم بإعداد Wallarm لإرسال الملفات التي تحتوي على معلومات حول الhits المكتشفة إلى دلو Amazon S3 الخاص بك</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Fluentd أو استخدم Fluentd كنظام وسيط للتكامل مع الأنظمة الأخرى</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>التكامل الأصلي</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Fluentd نفسه</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>Fluentd كموصل بيانات وسيط </h3>
            <p>استخدم Fluentd كنظام وسيط للتكامل مع النظم الأخرى</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>Fluentd كموصل بيانات وسيط</h3>
            <p>استخدم Fluentd كنظام وسيط للتكامل مع الأنظمة الأخرى</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>إرسال الإشعارات الى Datadog عبر Fluentd</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Logstash أو استخدم Logstash كنظام وسيط للتكامل مع الأنظمة الأخرى</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>التكامل الأصلي</h3>
            <p>إرسال الإشعارات المكتشفة للأحداث الى Logstash نفسه</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>Logstash كموصل بيانات وسيط</h3>
            <p>استخدم Logstash كنظام وسيط للتكامل مع النظم الأخرى</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>Logstash كموصل بيانات وسيط</h3>
            <p>استخدم Logstash كنظام وسيط للتكامل مع الأنظمة الأخرى</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>إرسال الإشعارات الى Datadog عبر Logstash</p>
        </a>
    </div>    
</div>

## التكاملات عبر جامعي البيانات

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Fluentd أو Logstash</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Fluentd أو Logstash</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Fluentd أو Logstash</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>إرسال الأحداث الى خدمة Datadog Logs عبر Fluentd أو Logstash</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>إرسال السجلات الى IBM QRadar عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>إرسال السجلات الى Splunk Enterprise عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>إرسال الإشعارات الى Micro Focus ArcSight Logger عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>إرسال الأحداث الى خدمة Datadog Logs عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>إرسال السجلات الى Datadog عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>إرسال السجلات الى Datadog عبر Logstash</p>
        </a>
    </div>
</div>

## نظم أخرى

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>حلقات الوصل على الويب</h3>
            <p>موصل عام: ارسل الاشعارات الفورية الى اي نظام يقبل الويبhooks الواردة عبر بروتوكول HTTPS</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>طلب التكامل</h3>
            <p>إذا لم يكن النظام الذي تبحث عنه موجودًا، أخبرنا. سنتحقق من إمكانية التكامل ونتصل بك.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>
