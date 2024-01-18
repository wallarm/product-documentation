# Entegrasyonlara Genel Bakış

OWASP API İlk 10 tehditlere, API istismarlarına ve otomatik tehditlere karşı kalkanınız olan Wallarm, gerçek zamanlı olarak bilgilendirebilmek adına çok çeşitli sistemlerle sorunsuzca entegrasyon yaparak güvenliğinizi bir adım daha ileri taşır.

Wallarm'ın entegrasyonları sayesinde, kritik olaylar hakkında her zaman bilgi sahibi olursunuz:

* [Tespit edilen hitlere](../../../user-guides/events/check-attack.md) ilişkin anlık uyarılar, böylece tehditlere karşı hemen eyleme geçebilirsiniz.
* Sistem olaylarına (kayıtlı [kullanıcılarda](../../../user-guides/settings/users.md), entegrasyonlarda ve [uygulamalarda](../../../user-guides/settings/applications.md) yapılan değişiklikler) dair güncellemeler, böylece daima kontrol sahibi olursunuz.
* Güvenlik profilinizdeki önemli değişiklikler, örneğin [kurallarınızın](../../../user-guides/rules/intro.md) ve [tetikleyicilerinizin](../../../user-guides/triggers/triggers.md) değişmesi hakkında bilgi alırsınız.
* Altyapınızdaki olası [zafiyetler](../../../about-wallarm/detecting-vulnerabilities.md) ve risk seviyeleri hakkında zamanında uyarılar, böylece en tehlikeli zayıflıkları öncelikli olarak ele alabilirsiniz.

Özelliği, Wallarm Konsolu'ndaki **Entegrasyonlar** bölümünde yönetin ve entegrasyonlarınız için ek uyarılar yapılandırmak için **Tetikleyiciler** bölümünü kullanın.

![Entegrasyonlar](../../../images/user-guides/settings/integrations/integration-panel.png)

Wallarm, birçok mevcut araç ve platformla sorunsuzca bağlanır. Bir sisteme entegrasyonlarla ilgili herhangi bir sınırlama yoktur.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Email ve mesajlaşma uygulamaları

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>Kayıt esnasında belirtilen email ve ek email'lere bildirimler alın</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>Seçili Slack kanalına bildirimler gönderin</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>Wallarm botunu Telegram'a ekleyin ve ona bildirimler gönderin</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>Seçili Microsoft Teams kanalına bildirimler gönderin</p>
        </a>
    </div>
</div>

## Olay ve görev yönetim sistemleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Opsgenie API aracılığıyla entegrasyonu sağlayın</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>Olayları PagerDuty'ya gönderin</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Wallarm'ı, Jira'da sorun oluşturacak şekilde ayarlayın</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Wallarm'ı, ServiceNow'da sorun bileti oluşturacak şekilde ayarlayın</p>
        </a>
    </div>
</div>

## SIEM ve SOAR sistemleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Bildirimleri Sumo Logic'e gönderin</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Uyarıları Splunk'e gönderin</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>Bildirimleri InsightConnect'e gönderin</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Microsoft Azure Sentinel'de olayları tutun</p>
        </a>
    </div>
</div>

## Log yönetim sistemleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../datadog/">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Olayları Datadog Logs servisine gönderin</p>
        </a>
    </div>
</div>

## Veri kolektörleri

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../fluentd/">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Tespit edilen olaylara dair bildirimleri Fluentd'e gönderin</p>
        </a>
        <a class="do-card" href="../logstash/">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Tespit edilen olaylara dair bildirimleri Logstash'e gönderin</p>
        </a>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Wallarm'ı, tespit edilen hitlere dair bilgileri Amazon S3 bucket'ınıza göndermek üzere ayarlayın</p>
        </a>
    </div>
</div>

## Diğer sistemler

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Evrensel bağlantı: Anlık bildirimleri HTTPS protokolü üzerinden gelen web kancalarını kabul edebilecek herhangi bir sisteme gönderin</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Request%20for%20integration%20between%20Wallarm%20and%20<SYSTEM>&body=Hello%20Wallarm%20Sales%20Team%2C%0AIn%20Wallarm%2C%20the%20integration%20with%20<SYSTEM>%20is%20not%20presented%2C%20although%20the%20ability%20to%20integrate%20with%20this%20system%20would%20be%20benefitial%20for%20us.%0A%0AWe%20would%20be%20grateful%20if%20you%20could%20consider%20the%20technical%20feasibility%20of%20this%20integration%20and%20are%20ready%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20our%20requirements%20in%20detail.%0A%0AWe%20are%20looking%20forward%20to%20your%20response.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Entegrasyon Talebi</h3>
            <p>Aramış olduğunuz sistem yoksa, bize bildirin. Bu entegrasyonun olasılığını kontrol ederiz ve sizinle iletişime geçeriz.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>