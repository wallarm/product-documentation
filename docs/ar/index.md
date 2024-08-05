---
hide:
- navigation
- toc
- feedback
---

# حماية واجهة برمجة التطبيقات من Wallarm

توفر حلول Wallarm حماية لواجهات برمجة التطبيقات، الخدمات المصغرة، وتطبيقات الويب ضد تهديدات OWASP API العشرة الأوائل،<br>إساءة استخدام API وغيرها من التهديدات الآلية دون الحاجة إلى تكوين قواعد يدويًا وبدقة عالية في تقليل الإيجابيات الخاطئة.

<div class="navigation">
<div class="navigation-card">
    <h3 class="icon-homepage quick-start-title">البداية السريعة</h3>
    <p><ul>
    <li><a href="./about-wallarm/overview/">نظرة عامة على Wallarm</a></li>
    <li><a href="./quickstart/getting-started/">البدء</a></li>
    <li><a href="./about-wallarm/subscription-plans/">خطط الاشتراك</a></li>
    <li><a href="./installation/supported-deployment-options/">أدلة النشر</a></li>
    <li><a href="./quickstart/attack-prevention-best-practices/">أفضل الممارسات</a></li>
    <li><a href="./demo-videos/overview/">أدلة الفيديو</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage dashboard-title">لوحات القيادة والتقارير</h3>
    <p><ul>
    <li><a href="./user-guides/dashboards/threat-prevention/">منع التهديدات</a></li>
    <li><a href="./user-guides/dashboards/api-discovery/">اكتشاف API</a></li>
    <li><a href="./user-guides/dashboards/owasp-api-top-ten/">أوائل OWASP API</a></li>
    <li><a href="./user-guides/search-and-filters/use-search/">الأحداث</a></li>
    <li><a href="./user-guides/search-and-filters/custom-report/">التقارير</a></li>
    <li><a href="./user-guides/settings/audit-log/">سجل النشاط</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title">اكتشاف API</h3>
    <p><ul>
    <li><a href="./api-discovery/overview/">استكشاف جرد API</a></li>
    <li><a href="./api-discovery/track-changes/">تتبع التغييرات في API</a></li>
    <li><a href="./api-discovery/risk-score/">درجة المخاطر للنقطة النهائية</a></li>
    <li><a href="./api-discovery/rogue-api/">API الظل، اليتيم، الزومبي</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent">حماية API</h3>
    <p><ul>
    <li><a href="./api-abuse-prevention/overview/">منع إساءة استخدام API</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bola/">حماية BOLA</a></li>
    <li><a href="./about-wallarm/credential-stuffing/">كشف سرقة الاعتمادات</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">سطح هجوم API</h3>
    <p><ul>
    <li><a href="./api-attack-surface/overview/">ملخص</a></li>
    <li><a href="./api-attack-surface/api-surface/">اكتشاف سطح API</a></li>
    <li><a href="./api-attack-surface/api-leaks/">اكتشاف تسربات API</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">الأصول والثغرات</h3>
    <p><ul>
    <li><a href="./user-guides/scanner/">الأصول المعرضة</a></li>
    <li><a href="./about-wallarm/detecting-vulnerabilities/">تقييم الضعف</a></li>
    <li><a href="./vulnerability-detection/active-threat-verification/overview/">التحقق من التهديدات النشطة</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-security-testing">اختبار أمان API</h3>
    <p><ul>
    <li><a href="./fast/openapi-security-testing/">اختبار أمان OpenAPI</a></li>
    <li><a href="./fast/">إطار لاختبار أمان API</a></li>
    <li><a href="./fast/operations/test-policy/fuzzer-intro/">Fuzzing API</a></li>
    <li><a href="./fast/dsl/intro/">DSL للكشف المخصص</a></li>
    <li><a href="./fast/poc/integration-overview/">التكامل في CI/CD</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage waap-waf-title">WAAP/WAF</h3>
    <p><ul>
    <li><a href="./about-wallarm/waap-overview/">نظرة عامة</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-ddos/">حماية DDoS</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bruteforce/">حماية القوة الغاشمة</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-forcedbrowsing/">حماية التصفح القسري</a></li>
    <li><a href="./user-guides/rules/rate-limiting/">تحديد معدل الطلبات</a></li>    
    <li><a href="./user-guides/rules/vpatch-rule/">الترقيع الافتراضي</a></li>
    <li><a href="./user-guides/rules/regex-rule/">المكتشفات المحددة من المستخدم</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage deployment-title">النشر</h3>
    <p><ul>
    <li><a href="./installation/supported-deployment-options/">جميع خيارات النشر</a></li>
    <li><a href="./installation/oob/overview/">خارج النطاق</a></li>
    <li><a href="./installation/supported-deployment-options/#public-clouds">السحابات العامة</a></li>
    <li><a href="./installation/supported-deployment-options/#kubernetes">Kubernetes</a></li>
    <li><a href="./installation/inline/overview/">داخل الخط</a></li>
    <li><a href="./installation/connectors/overview/">الموصلات</a></li>
    <li><a href="./installation/supported-deployment-options/#packages">الحزم</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage integration-title">التكاملات والتنبيهات</h3>
    <p><ul>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#email-and-messengers">البريد الإلكتروني والمراسلون</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#incident-and-task-management-systems">أنظمة إدارة الحوادث والمهام</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#siem-and-soar-systems">أنظمة SIEM و SOAR</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#log-management-systems">أنظمة إدارة السجلات</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#data-collectors">جامعي البيانات</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage user-management-title">إدارة المستخدمين</h3>
    <p><ul>
    <li><a href="./user-guides/settings/users/">نظرة عامة</a></li>
    <li><a href="./user-guides/settings/account/">ملف المستخدم</a></li>
    <li><a href="./user-guides/settings/api-tokens/">رموز API</a></li>
    <li><a href="./admin-en/configuration-guides/sso/intro/">SAML SSO</a></li>
    <li><a href="./admin-en/configuration-guides/ldap/ldap/"> باستخدام LDAP</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage operations-title">العمليات</h3>
    <p><ul>
    <li><a href="./admin-en/configure-wallarm-mode/">وضع الترشيح</a></li>
    <li><a href="./user-guides/settings/applications/">التطبيقات</a></li>
    <li><a href="./admin-en/configure-parameters-en/">عقد NGINX</a></li>
    <li><a href="./admin-en/using-proxy-or-balancer-en/">التقارير الصحيحة لعنوان IP للمستخدم النهائي</a></li>
    <li><a href="./admin-en/configuration-guides/allocate-resources-for-node/">تخصيص الموارد للعقدة</a></li>
    <li><a href="./admin-en/configure-logging/">سجلات عقدة الترشيح</a></li>
    <li><a href="./updating-migrating/what-is-new/">ترقية العقدة</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage references-title">المراجع</h3>
    <p><ul>
    <li><a href="./faq/ingress-installation/">الأسئلة الشائعة</a></li>
    <li><a href="./news/">سجل التغييرات والأخبار</a></li>
    <li><a href="./api/overview/">مرجع API Wallarm</a></li>
    <li><a href="./admin-en/managing/terraform-provider/">مزود Wallarm Terraform</a></li>
    <li><a href="./integrations-devsecops/verify-docker-image-signature/">التحقق من تواقيع صور Docker</a></li>
    </ul></p>
</div>

</div>