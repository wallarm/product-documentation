| الباراميتر | الشرح |
| --------- | ----------- |
| `X-WallarmApi-Token` | الرمز للدخول على [واجهة برمجة تطبيقات Wallarm][access-wallarm-api-docs]، يمكن نسخه من لوحة تحكم Wallarm → **الإعدادات** → **رموز واجهة برمجة التطبيقات**. |
| `clientid` | مُعرف حساب في Wallarm Cloud لإضافة/قراءة قائمة الآي بي.
| `ip_rule.list` | نوع قائمة الآي بي لإضافة العناصر، يمكن أن تكون: `black` (لقائمة الحظر)، `white` (لقائمة السماح)، `gray` (للقائمة الرمادية). |
| `ip_rule.rule_type` | نوع العناصر لإضافتها إلى القائمة:<ul><li>`ip_range` إذا تمت إضافة آي بي معينة أو شبكات فرعية</li><li>`country` إذا تمت إضافة دول أو مناطق</li><li>`proxy_type` إذا تمت إضافة خدمات البروكسي (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` لأنواع مصادر أخرى (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | آي بي أو شبكة فرعية لإضافتها إلى القائمة، مثلاً `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(لقيم `rule_type` الأخرى) | إحدى الخيارات:<ul><li>إذا كان `rule_type:"country"` - مصفوفة من الدول في [صيغة ISO-3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)، مثلاً `["AX","AL"]`.</li><li>إذا كان `rule_type:"proxy_type"` - مصفوفة من خدمات البروكسي، مثلاً `["VPN","PUB"]`.</li><li>إذا كان `rule_type:"datacenter"` - مصفوفة من أنواع المصادر الأخرى، مثلاً `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | مصفوفة من [مُعرفات التطبيقات][application-docs] للسماح أو تقييد الوصول للآي بي، مثلاً `[3,4]` لمُعرفات التطبيقات 3 و 4 أو `[0]` لجميع التطبيقات.
| `ip_rule.expired_at` | تاريخ [الطابع الزمني Unix](https://www.unixtimestamp.com/) لإزالة الآي بي من القائمة. القيمة القصوى هي للأبد (`33223139044`).
| `reason` | السبب للسماح أو تقييد الوصول للآي بي.
| `force` | إذا كان `true` وبعض العناصر المحددة في الطلب موجودة بالفعل في قائمة الآي بي، سيتم الكتابة فوقها. |