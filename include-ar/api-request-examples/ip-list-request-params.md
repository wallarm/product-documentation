| الباراميتر | الوصف |
| --------- | ----------- |
| `X-WallarmApi-Token` | الرمز اللازم لـ[الوصول إلى واجهة برمجة تطبيقات Wallarm][access-wallarm-api-docs]، انسخه من واجهة Wallarm → **الإعدادات** → **رموز API**. |
| `clientid` | مُعرف الحساب في سحابة Wallarm لإضافة/قراءة قائمة الـIP. |
| `ip_rule.list` | نوع قائمة الـIP لإضافة العناصر، يمكن أن يكون: `black` (لقائمة الحظر)، `white` (لقائمة السماح)، `gray` (لقائمة الرمادية). |
| `ip_rule.rule_type` | نوع العناصر المُضافة إلى القائمة:<ul><li>`ip_range` في حالة إضافة عناوين IPs أو شبكات فرعية معينة</li><li>`country` في حالة إضافة دول أو مناطق</li><li>`proxy_type` في حالة إضافة خدمات البروكسي (`VPN`، `SES`، `PUB`، `WEB`، `TOR`)</li><li>`datacenter` لأنواع المصادر الأخرى (`rackspace`، `tencent`، `plusserver`، `ovh`، `oracle`، `linode`، `ibm`، `huawei`، `hetzner`، `gce`، `azure`، `aws`، `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | IP أو شبكة فرعية لإضافتها إلى القائمة، مثل `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(لقيم `rule_type` الأخرى) | إحدى الخيارات:<ul><li>إذا كان `rule_type:"country"` - مصفوفة من الدول بـ[صيغة ISO-3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)، مثل `["AX","AL"]`.</li><li>إذا كان `rule_type:"proxy_type"` - مصفوفة من خدمات البروكسي، مثل `["VPN","PUB"]`.</li><li>إذا كان `rule_type:"datacenter"` - مصفوفة من أنواع المصادر الأخرى، مثل `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | مصفوفة من [مُعرفات التطبيقات][application-docs] للسماح أو تقييد الوصول لعناوين IP، مثل `[3,4]` لمُعرفات التطبيقات 3 و 4 أو `[0]` لجميع التطبيقات.
| `ip_rule.expired_at` | تاريخ [الطابع الزمني لـUnix](https://www.unixtimestamp.com/) لإزالة عناوين IP من القائمة. القيمة القصوى هي للأبد (`33223139044`). |
| `reason` | سبب السماح أو تقييد الوصول لعناوين IP. |
| `force` | إذا كان `true` وبعض العناصر المُحددة في الطلب موجودة بالفعل في قائمة الـIP، السكربت سيقوم بالكتابة فوقها. |