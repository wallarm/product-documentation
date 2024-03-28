يقوم وحدة [منع إساءة استخدام API](../../about-wallarm/api-abuse-prevention.md) في Wallarm بتعبئة قائمة الرمادي أو قائمة الرفض أتوماتيكيًا بعناوين IP للبوتات الخبيثة.

يتم تمييز عناوين IP الخاصة بالبوتات ب**السبب** `Bot` وتفاصيل طبيعتها بما في ذلك [معدل الثقة](../../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works)، على سبيل المثال:

![عناوين IP للبوتات المدرجة في قائمة الرفض](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)