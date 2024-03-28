[img-collectd-nagios]: ../../images/monitoring/collectd-nagios.png

[link-nagios]: https://www.nagios.org/
[link-nagios-core]: https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]: https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]: https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]: https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]: https://collectd.org/documentation/manpages/collectd-nagios.1.shtml
[link-nrpe-readme]: https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]: https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]: ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]: available-metrics.md#number-of-requests
[doc-unixsock]: fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]: #7-add-commands-to-the-nrpe-service-configuration-file-on-the-filter-node-to-get-the-required-metrics

# تصدير مقاييس الى نظام تابعيت Nagios عبر الأداة `collectd-nagios`

هذا المستند يقدم مثالًا على تصدير مقاييس العقدة المرشحة إلى نظام الرصد [Nagios][link-nagios] (يُفضل استخدام نسخة [Nagios Core][link-nagios-core]؛ ومع ذلك، فإن هذا المستند مناسب لأي إصدار من Nagios) باستخدام الأداة [`collectd-nagios`][link-collectd-nagios].

!!! info "الافتراضات والمتطلبات"
    *   يجب تكوين الخدمة `collectd` لتعمل من خلال مقبس النطاق العالمي Unix (انظر [هنا][doc-unixsock] للتفاصيل).
    *   يتم افتراض أنك بالفعل قمت بتثبيت الإصدار الأساسي من Nagios.
        
        إذا لم يكن الأمر كذلك، قم بتثبيت Nagios Core (على سبيل المثال، اتبع هذه [التعليمات][link-nagios-core-install]).
    
        يمكنك استخدام نسخة أخرى من Nagios إذا لزم الأمر (على سبيل المثال، Nagios XI).
        
        سيتم استخدام مصطلح "Nagios" فيما يلي للإشارة إلى أي إصدار من Nagios، ما لم يُذكر خلاف ذلك.
        
    *   يجب أن يكون لديك القدرة على الاتصال بالعقدة المرشحة والمضيف Nagios (على سبيل المثال، عبر بروتوكول SSH)، والعمل تحت حساب `root` أو حساب آخر مع حقوق المستخدم الخارق.
    *   يجب أن يتم تثبيت خدمة [Nagios Remote Plugin Executor][link-nrpe-docs] (التي سيتم الإشارة إليها باسم *NRPE* في heel الخلافة بفيروس نقص المناعة البشرية، المثال) يجب أن يتم تثبيتها على العقدة المرشحة.

##  سير العمل كمثال

--8<-- "../include/monitoring/metric-example.md"

![سير العمل كمثال][img-collectd-nagios]

تم استخدام نظام التنفيذ الآتي في هذا المستند:

*   العقدة المرشحة Wallarm تم تنفيذها على مضيف يمكن الوصول إليه عبر عنوان IP `10.0.30.5` واسم النطاق المؤهل بالكامل `node.example.local`.
*   تم تثبيت Nagios على مضيف منفصل يمكن الوصول إليه عبر عنوان IP`10.0.30.30`.