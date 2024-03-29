# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira) هو برنامج إدارة مشاريع وتتبع القضايا الذي طورته Atlassian ويُستخدم على نطاق واسع. يمكنك ضبط Wallarm لإنشاء قضايا في Jira عند اكتشاف [الثغرات الأمنية](../../../glossary-en.md#vulnerability)، سواءً كانت جميعها أو فقط لمستويات الخطورة المختارة - عالية، متوسطة أو منخفضة.

## إعداد التكامل

في واجهة مستخدم Jira:

1. قم بإنشاء رمز API كما هو موضح [هنا](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token).
1. انسخ رمز API الذي تم إنشاؤه.

في واجهة مستخدم Wallarm:

1. افتح لوحة تحكم Wallarm → **التكاملات** → **Jira**.
1. أدخل اسم التكامل.
1. أدخل مضيف Jira (مثل، `https://company-x.atlassian.net/`).
1. أدخل بريد المستخدم في Jira، الذي يتطلبه Jira للمصادقة والذي سيُستخدم أيضًا لتحديد المُبلغ عن القضايا المُنشأة.
1. الصق رمز API المُنشأ. سيتم التحقق من البريد الإلكتروني والرمز للمصادقة على Wallarm عند مضيف Jira المحدد. عند النجاح، ستُدرج المساحات المتاحة لهذا المستخدم في Jira.
1. اختر مساحة Jira لإنشاء القضايا فيها. عند الاختيار، ستُدرج أنواع القضايا المدعومة في هذه المساحة.
1. اختر نوع قضية Jira التي ستنتمي إليها القضايا المُنشأة.
1. اختر أنواع الأحداث التي ستُحفز الإخطارات. يمكن اختيار جميع الثغرات الأمنية أو تلك الخاصة بمستويات خطورة معينة فقط.

    ![تكامل Jira](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. انقر على **اختبار التكامل** للتحقق من صحة الإعدادات، توفر سحابة Wallarm، وتنسيق الإخطار.

    اختبار إنشاء قضية Jira:

    ![اختبار إنشاء قضية Jira](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. انقر على **إضافة التكامل**.

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"