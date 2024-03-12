# نظرة عامة على التكاملات

بروازتك ضد التهديدات العشرة الأولى لـ OWASP API وسوء استخدام API والتهديدات المؤتمتة، تذهب Wallarm خطوة أخرى في أمانك من خلال دمجها بسلاسة مع مجموعة واسعة من الأنظمة لإبقائك على اطلاع في الوقت الفعلي.

مع تكاملات Wallarm ستكون دائمًا على بينة عن الأحداث الحرجة، بما في ذلك:

* التنبيهات الفورية حول [النتائج المكتشفة](../../../user-guides/events/check-attack.md)، حتى تتمكن من اتخاذ إجراء فوري ضد التهديدات.
* التحديثات على الأحداث النظامية (التغييرات في [المستخدمين المسجلين](../../../user-guides/settings/users.md)، التكاملات، و[التطبيقات](../../../user-guides/settings/applications.md))، مما يضمن أنك دائمًا تمتلك السيطرة.
* التنبيه على التغييرات المهمة في ملف تعريف الأمان الخاص بك، مثل تغييرات [قواعدك](../../../user-guides/rules/rules.md) و [المثيرات](../../../user-guides/triggers/triggers.md).
* التحذيرات الفورية حول الضعف المحتمل في [بنية تكنولوجيا المعلومات المستخدمة](../../../about-wallarm/detecting-vulnerabilities.md) ومستويات مخاطرهم، حتى تتمكن من التصدي بشكل استباقي لأضعف النقاط في المنشأة.

قم بإدارة الميزة في قسم **التكاملات** من وحدة تحكم Wallarm، وقسم **المثيرات** لتكوين التنبيهات الإضافية لتكاملاتك.

![التكاملات](../../../images/user-guides/settings/integrations/integration-panel.png)

تتصل Wallarm بسهولة مع العديد من الأدوات والمنصات الحالية. عدد التكاملات مع نظام واحد ليس محدودًا.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## البريد الإلكتروني والمراسلات

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>البريد الإلكتروني</h3>
            <p>احصل على إشعارات على البريد الإلكتروني المحدد عند التسجيل وإشعارات البريد الإلكتروني الأضافية</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>أرسل إشعارات إلى القناة المختارة على Slack</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>التيليجرام</h3>
            <p>أضف bot Wallarm إلى التيليجرام وأرسل إليه الإشعارات</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>الفرق في مايكروسوفت</h3>
            <p>أرسل إشعارات إلى القناة المختارة في Microsoft Teams</p>
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
            <p>أرسل الحوادث إلى PagerDuty</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>قم بإعداد Wallarm لإنشاء القضايا في Jira</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>قم بإعداد Wallarm لإنشاء تذاكر المشاكل في ServiceNow</p>
        </a>
    </div>
</div>

## أنظمة SIEM و SOAR 

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>أرسل رسائل إلى Sumo Logic</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>أرسل التنبيهات إلى Splunk</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>أرسل إشعارات إلى InsightConnect</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>سجل الأحداث في Microsoft Azure Sentinel</p>
        </a>
    </div>
</div>

## أنظمة إدارة السجلات

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>أرسل الأحداث إلى خدمة Datadog Logs مباشرة أو عبر جمع البيانات الوسيطة</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>أرسل الأحداث إلى خدمة Datadog Logs مباشرة أو عبر جمع البيانات الوسيطة</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>التكامل الأصلي</h3>
            <p>أرسل السجلات إلى Datadog مباشرة</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>أرسل السجلات إلى Datadog عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>أرسل السجلات إلى Datadog عبر Logstash</p>
        </a>
    </div>
</div>

## مجمعات البيانات

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Fluentd أو استخدم Fluentd كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Logstash أو استخدم Logstash كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>اعد Wallarm لإرسال الملفات بالمعلومات حول النتائج المكتشفة إلى دلو Amazon S3 الخاص بك</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Fluentd أو استخدم Fluentd كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>التكامل الأصلي</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Fluentd نفسه</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>Fluentd كموصل بيانات وسيط</h3>
            <p>استخدم Fluentd كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>Fluentd كموصل بيانات وسيط</h3>
            <p>استخدم Fluentd كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>أرسل الإشعارات إلى Datadog عبر Fluentd</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Logstash أو استخدم Logstash كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>التكامل الأصلي</h3>
            <p>أرسل إشعارات الأحداث المكتشفة إلى Logstash نفسه</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>Logstash كموصل بيانات وسيط</h3>
            <p>استخدم Logstash كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>Logstash كموصل بيانات وسيط</h3>
            <p>استخدم Logstash كنظام وسيط للتكامل مع أنظمة أخرى</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Logstash</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>أرسل الإشعارات إلى Datadog عبر Logstash</p>
        </a>
    </div>    
</div>

## التكاملات عبر مجمعات البيانات

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Fluentd أو Logstash</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Fluentd أو Logstash</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Fluentd أو Logstash</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>أرسل الأحداث إلى خدمة Datadog Logs عبر Fluentd أو Logstash</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>أرسل السجلات إلى IBM QRadar عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>أرسل السجلات إلى Splunk Enterprise عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>أرسل الإشعارات إلى Micro Focus ArcSight Logger عبر Logstash</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>أرسل الأحداث إلى خدمة Datadog Logs عبر Fluentd أو Logstash</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>أرسل السجلات إلى Datadog عبر Fluentd</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>أرسل السجلات إلى Datadog عبر Logstash</p>
        </a>
    </div>
</div>

## الأنظمة الأخرى

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>الويب هوك</h3>
            <p>الموصل العام: أرسل إشعارات فورية إلى أي نظام يقبل الويب هوك الواردة عبر بروتوكول HTTPS</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>طلب التكامل</h3>
            <p>إذا لم يكن النظام الذي تبحث عنه موجودًا، فأعلمنا بذلك. سوف نتحقق من إمكانية التكامل ونتصل بك.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>