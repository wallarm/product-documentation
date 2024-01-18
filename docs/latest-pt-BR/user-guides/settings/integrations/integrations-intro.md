# Visão geral das integrações

Sendo seu escudo contra as 10 principais ameaças da API OWASP, o abuso de API e ameaças automatizadas, a Wallarm leva sua segurança um passo adiante, integrando-se perfeitamente a uma ampla gama de sistemas para mantê-lo informado em tempo real.

Com as integrações da Wallarm, você sempre ficará informado sobre eventos críticos, incluindo:

* Alertas instantâneos sobre [hits detectados](../../../user-guides/events/check-attack.md), para que você possa tomar medidas imediatas contra as ameaças.
* Atualizações sobre eventos do sistema (mudanças em [usuários](../../../user-guides/settings/users.md) registrados, integrações e [aplicações](../../../user-guides/settings/applications.md)), garantindo que você esteja sempre no controle.
* Notificação sobre mudanças importantes em seu perfil de segurança, como suas mudanças em [regras](../../../user-guides/rules/intro.md) e [gatilhos](../../../user-guides/triggers/triggers.md).
* Avisos oportunos sobre possíveis [vulnerabilidades](../../../about-wallarm/detecting-vulnerabilities.md) em sua infraestrutura e seus níveis de risco, para que você possa abordar proativamente as fraquezas mais perigosas.

Gerencie o recurso na seção **Integrações** do Console Wallarm e na seção **Gatilhos** para configurar alertas adicionais para suas integrações.

![Integrações](../../../images/user-guides/settings/integrations/integration-panel.png)

A Wallarm se conecta facilmente a uma série de ferramentas e plataformas existentes. O número de integrações com um sistema não é limitado.

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

## Email e mensageiros

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>Receba notificações no email indicado no momento do registro e emails adicionais</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>Envie notificações para o canal Slack selecionado</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>Adicione o bot da Wallarm ao Telegram e envie notificações para ele</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>Envie notificações para o canal Microsoft Teams selecionado</p>
        </a>
    </div>
</div>

## Sistemas de gerenciamento de incidentes e tarefas

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsgenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsgenie.png" />
            <h3>Opsgenie</h3>
            <p>Integre através da API do Opsgenie</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>Envie incidentes para o PagerDuty</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Configure a Wallarm para criar problemas no Jira</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Configure a Wallarm para criar tickets de problemas no ServiceNow</p>
        </a>
    </div>
</div>

## Sistemas SIEM e SOAR

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Envie mensagens para o Sumo Logic</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Envie alertas para o Splunk</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>Envie notificações para o InsightConnect</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Registre eventos no Microsoft Azure Sentinel</p>
        </a>
    </div>
</div>

## Sistemas de gerenciamento de logs

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../datadog/">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Envie eventos para o serviço Datadog Logs</p>
        </a>
    </div>
</div>

## Coletor de dados

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../fluentd/">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Envie notificações de eventos detectados para o Fluentd</p>
        </a>
        <a class="do-card" href="../logstash/">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Envie notificações de eventos detectados para o Logstash</p>
        </a>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Configure o Wallarm para enviar arquivos com informações sobre hits detectados para seu bucket Amazon S3</p>
        </a>
    </div>
</div>

## Outros sistemas

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Conector universal: envie notificações instantâneas para qualquer sistema que aceite webhooks de entrada via protocolo HTTPS</p>
        </a>
        <a class="do-card" href="mailto:sales@wallarm.com?subject=Solicitação%20de%20integração%20entre%20Wallarm%20e%20<SYSTEM>&body=Olá%20equipe%20de%20vendas%20da%20Wallarm%2C%0ANo%20Wallarm%2C%20a%20integração%20com%20<SYSTEM>%20não%20está%20presente%2C%20apesar%20da%20capacidade%20de%20integrar%20com%20este%20sistema%20seria%20benéfica%20para%20nós.%0A%0ASeríamos%20gratos%20se%20você%20pudesse%20considerar%20a%20viabilidade%20técnica%20desta%20integração%20e%20estamos%20prontos%20para%20agendar%20uma%20chamada%20com%20você%20para%20discutir%20nossos%20requisitos%20em%20detalhes.%0A%0AEsperamos%20sua%20resposta.">
            <img class="non-zoomable" src="../../../../images/integration-icons/other-system.svg" />
            <h3>Solicitar integração</h3>
            <p>Se não houver sistema que você está procurando, informe-nos. Vamos verificar a possibilidade da integração e entrar em contato com você.</p>
        </a>
    </div>
</div>

<script src="/supported-platforms.min.js?v=1"></script>