# Entegrasyonlara Genel Bakış

OWASP API Top 10 tehditlerine, API suistimaline ve otomatik tehditlere karşı kalkanınız olurken Wallarm, gerçek zamanlı olarak haberdar kalmanızı sağlamak için geniş bir yelpazedeki sistemlerle sorunsuz biçimde entegre olarak güvenliğinizi bir adım öteye taşır.

Wallarm entegrasyonlarıyla aşağıdakiler dahil kritik olaylardan her zaman haberdar olursunuz:

* Tehditlere karşı derhal harekete geçebilmeniz için [tespit edilen Hits](../../../user-guides/events/check-attack.md) hakkında anlık uyarılar.
* Kontrolün daima sizde olmasını sağlayacak sistem olayı güncellemeleri (kayıtlı [users](../../../user-guides/settings/users.md), entegrasyonlar ve [applications](../../../user-guides/settings/applications.md) üzerindeki değişiklikler).
* Güvenlik profilinizdeki önemli değişikliklere ilişkin bildirimler; örneğin [rules](../../../user-guides/rules/rules.md) ve [triggers](../../../user-guides/triggers/triggers.md) değişiklikleri.
* Altyapınızdaki olası [zafiyetler](../../../about-wallarm/detecting-vulnerabilities.md) ve bunların risk seviyeleri hakkında zamanında uyarılar; böylece en tehlikeli zayıflıkları proaktif olarak ele alabilirsiniz.

Bu özelliği Wallarm Console içindeki Integrations bölümünden yönetin; entegrasyonlarınız için ek uyarıları yapılandırmak üzere Triggers bölümünü kullanın.

![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarm, mevcut birçok araç ve platformla zahmetsizce bağlantı kurar. Tek bir sistemle yapılabilecek entegrasyon sayısı sınırlı değildir.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## E-posta ve mesajlaşma uygulamaları

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>Kayıt sırasında belirtilen e-postaya ve ek e-posta adreslerine bildirim alın</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>Seçili Slack kanalına bildirim gönderin</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>Wallarm botunu Telegram'a ekleyin ve bildirimleri ona gönderin</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>Seçili Microsoft Teams kanalına bildirim gönderin</p>
        </a>
    </div>
</div>

## Olay ve görev yönetim sistemleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Opsgenie API üzerinden entegre edin</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>Olayları PagerDuty'ye gönderin</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Wallarm'ı Jira'da kayıtlar oluşturacak şekilde yapılandırın</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Wallarm'ı ServiceNow'da destek kayıtları oluşturacak şekilde yapılandırın</p>
        </a>
    </div>
</div>

## SIEM ve SOAR sistemleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Mesajları Sumo Logic'e gönderin</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Uyarıları Splunk'a gönderin</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>Bildirimleri InsightConnect'e gönderin</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Olayları Microsoft Azure Sentinel'de kaydedin</p>
        </a>
    </div>
</div>

## Günlük yönetim sistemleri

<div class="do-section">
    <div class="do-main">
        <div id="datadog" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Olayları Datadog Logs servisine doğrudan veya ara veri toplayıcıları üzerinden gönderin</p>
        </div>
    </div>
    <div class="do-nested" data-for="datadog">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Olayları Datadog Logs servisine doğrudan veya ara veri toplayıcıları üzerinden gönderin</p>
        </div>
        <a class="do-card" href="../datadog/">
            <h3>Yerel entegrasyon</h3>
            <p>Günlükleri doğrudan Datadog'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Günlükleri Fluentd aracılığıyla Datadog'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Günlükleri Logstash aracılığıyla Datadog'a gönderin</p>
        </a>
    </div>
</div>

## Veri toplayıcılar

<div class="do-section">
    <div class="do-main">
        <div id="fluentd" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Tespit edilen olayların bildirimlerini Fluentd sistemine gönderin veya diğer sistemlerle entegrasyon için Fluentd'yi ara sistem olarak kullanın</p>
        </div>
        <div id="logstash" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Tespit edilen olayların bildirimlerini Logstash sistemine gönderin veya diğer sistemlerle entegrasyon için Logstash'i ara sistem olarak kullanın</p>
        </div>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Tespit edilen Hits hakkındaki bilgileri içeren dosyaları Amazon S3 bucket'ınıza göndermek için Wallarm'ı yapılandırın</p>
        </a>
    </div>
    <div class="do-nested" data-for="fluentd">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Tespit edilen olayların bildirimlerini Fluentd sistemine gönderin veya diğer sistemlerle entegrasyon için Fluentd'yi ara sistem olarak kullanın</p>
        </div>
        <a class="do-card" href="../fluentd/">
            <h3>Yerel entegrasyon</h3>
            <p>Tespit edilen olayların bildirimlerini doğrudan Fluentd'ye gönderin</p>
        </a>
        <div id="fluentd-intermediate" class="do-card">
            <h3>Ara veri bağlayıcısı olarak Fluentd</h3>
            <p>Diğer sistemlerle entegrasyon için Fluentd'yi ara sistem olarak kullanın</p>
        </div>
    </div>
    <div class="do-nested" data-for="fluentd-intermediate">
        <div class="do-card">
            <h3>Ara veri bağlayıcısı olarak Fluentd</h3>
            <p>Diğer sistemlerle entegrasyon için Fluentd'yi ara sistem olarak kullanın</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Günlükleri Fluentd aracılığıyla IBM QRadar'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Günlükleri Fluentd aracılığıyla Splunk Enterprise'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Fluentd aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Bildirimleri Fluentd aracılığıyla Datadog'a gönderin</p>
        </a>
    </div>
    <div class="do-nested" data-for="logstash">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Tespit edilen olayların bildirimlerini Logstash sistemine gönderin veya diğer sistemlerle entegrasyon için Logstash'i ara sistem olarak kullanın</p>
        </div>
        <a class="do-card" href="../logstash/">
            <h3>Yerel entegrasyon</h3>
            <p>Tespit edilen olayların bildirimlerini doğrudan Logstash'e gönderin</p>
        </a>
        <div id="logstash-intermediate" class="do-card">
            <h3>Ara veri bağlayıcısı olarak Logstash</h3>
            <p>Diğer sistemlerle entegrasyon için Logstash'i ara sistem olarak kullanın</p>
        </div>
    </div>
    <div class="do-nested" data-for="logstash-intermediate">
        <div class="do-card">
            <h3>Ara veri bağlayıcısı olarak Logstash</h3>
            <p>Diğer sistemlerle entegrasyon için Logstash'i ara sistem olarak kullanın</p>
        </div>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Günlükleri Logstash aracılığıyla IBM QRadar'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Günlükleri Logstash aracılığıyla Splunk Enterprise'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Logstash aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Bildirimleri Logstash aracılığıyla Datadog'a gönderin</p>
        </a>
    </div>    
</div>

## Veri toplayıcılar aracılığıyla entegrasyonlar

<div class="do-section">
    <div class="do-main">
        <div id="ibm-qradar" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>Günlükleri Fluentd veya Logstash aracılığıyla IBM QRadar'a gönderin</p>
        </div>
        <div id="splunk-enterprise" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>Günlükleri Fluentd veya Logstash aracılığıyla Splunk Enterprise'a gönderin</p>
        </div>
        <div id="arcsight-logger" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Fluentd veya Logstash aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </div>
        <div id="datadogp" class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Olayları Fluentd veya Logstash aracılığıyla Datadog Logs servisine gönderin</p>
        </div>
    </div>
    <div class="do-nested" data-for="ibm-qradar">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/ibm-qradar.png" />
            <h3>IBM QRadar</h3>
            <p>Günlükleri Fluentd veya Logstash aracılığıyla IBM QRadar'a gönderin</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-qradar/">
            <h3>Wallarm → Fluentd → IBM QRadar</h3>
            <p>Günlükleri Fluentd aracılığıyla IBM QRadar'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-qradar/">
            <h3>Wallarm → Logstash → IBM QRadar</h3>
            <p>Günlükleri Logstash aracılığıyla IBM QRadar'a gönderin</p>
        </a>
    </div>
    <div class="do-nested" data-for="splunk-enterprise">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk Enterprise</h3>
            <p>Günlükleri Fluentd veya Logstash aracılığıyla Splunk Enterprise'a gönderin</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-splunk/">
            <h3>Wallarm → Fluentd → Splunk Enterprise</h3>
            <p>Günlükleri Fluentd aracılığıyla Splunk Enterprise'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-splunk/">
            <h3>Wallarm → Logstash → Splunk Enterprise</h3>
            <p>Günlükleri Logstash aracılığıyla Splunk Enterprise'a gönderin</p>
        </a>
    </div>
    <div class="do-nested" data-for="arcsight-logger">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/arcsight-logger.png" />
            <h3>Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Fluentd veya Logstash aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-arcsight-logger/">
            <h3>Wallarm → Fluentd → Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Fluentd aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/logstash-arcsight-logger/">
            <h3>Wallarm → Logstash → Micro Focus ArcSight Logger</h3>
            <p>Bildirimleri Logstash aracılığıyla Micro Focus ArcSight Logger'a gönderin</p>
        </a>
    </div>
    <div class="do-nested" data-for="datadogp">
        <div class="do-card">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Olayları Fluentd veya Logstash aracılığıyla Datadog Logs servisine gönderin</p>
        </div>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Fluentd → Datadog</h3>
            <p>Günlükleri Fluentd aracılığıyla Datadog'a gönderin</p>
        </a>
        <a class="do-card" href="../webhook-examples/fluentd-logstash-datadog/">
            <h3>Wallarm → Logstash → Datadog</h3>
            <p>Günlükleri Logstash aracılığıyla Datadog'a gönderin</p>
        </a>
    </div>
</div>

## Diğer sistemler

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Evrensel bağlayıcı: HTTPS protokolü üzerinden gelen webhooks kabul eden herhangi bir sisteme anlık bildirimler gönderin</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Entegrasyon talep edin</h3>
            <p>Aradığınız sistem yoksa bize bildirin. Entegrasyonun mümkün olup olmadığını kontrol eder ve sizinle iletişime geçeriz.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>