# Atlassian Jira

[Jira](https://www.atlassian.com/software/jira) هو برنامج إدارة مشاريع وتتبع الأخطاء المستخدم على نطاق واسع والذي طورته Atlassian. يمكنك ضبط Wallarm لإنشاء مشكلات في Jira عند اكتشاف [ثغرات](../../../glossary-en.md#vulnerability)، سواء كانت جميع الثغرات أو فقط لمستويات المخاطر المحددة - عالية، متوسطة أو منخفضة.

## إعداد التكامل

في واجهة Jira: 

1. قم بإنشاء رمز API كما هو موضح [هنا](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token).
1. انسخ رمز API الذي تم إنشاؤه.

في واجهة Wallarm:

1. افتح وحدة تحكم Wallarm → **التكاملات** → **Jira**.
1. أدخل اسم التكامل.
1. أدخل مضيف Jira (على سبيل المثال، `https://company-x.atlassian.net/`).
1. أدخل بريد الكتروني لمستخدم Jira، الذي يتطلبه Jira للمصادقة وكذلك سيتم استخدامه لتحديد المبلغ عن المشكلات المنشأة.
1. الصق رمز API الذي تم إنشاؤه. سيتم التحقق من البريد الإلكتروني والرمز للمصادقة في مضيف Jira المحدد. عند النجاح، سيتم سرد الأماكن المتاحة لهذا المستخدم Jira.
1. اختر مساحة Jira لإنشاء المشكلات فيها. عند الاختيار، سيتم سرد أنواع المشكلات المدعومة في هذه المساحة.
1. اختر نوع مشكلة Jira التي ستنتمي إليها المشكلات المنشأة.
1. اختر أنواع الأحداث لتحفيز الإشعارات. يمكن اختيار كل الثغرات أو فقط من مستويات المخاطر المحددة.

    ![تكامل Jira](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. انقر **تجربة التكامل** للتحقق من صحة التكوين، توفر وحدة Wallarm Cloud، وصيغة الإشعار.

    تجربة إنشاء مشكلة Jira:

    ![تجربة إنشاء مشكلة Jira](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. انقر **إضافة تكامل**.

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعاملات التكامل الخاطئة

--8<-- "../include/integrations/integration-not-working.md"