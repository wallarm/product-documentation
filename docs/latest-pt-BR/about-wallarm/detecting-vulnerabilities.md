[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# Detecção de vulnerabilidades

Devido a negligência ou informações inadequadas ao construir ou implementar um aplicativo, pode ser vulnerável a ataques. Neste artigo, você aprenderá como a plataforma Wallarm detecta vulnerabilidades de aplicativos, permitindo que você melhore a segurança do sistema.

## O que é uma vulnerabilidade?

Uma vulnerabilidade é um erro cometido por negligência ou informações inadequadas ao construir ou implementar um aplicativo. Uma vulnerabilidade pode ser explorada por um invasor para cruzar limites de privilégio (ou seja, realizar ações não autorizadas) dentro de um aplicativo.

## Métodos de detecção de vulnerabilidades

Ao digitalizar o aplicativo para vulnerabilidades ativas, a Wallarm envia solicitações com sinais de ataque para o endereço do aplicativo protegido e analisa as respostas do aplicativo. Se a resposta corresponder a um ou mais sinais de vulnerabilidade pré-definidos, a Wallarm registra uma vulnerabilidade ativa.

Por exemplo: se a resposta à solicitação enviada para ler o conteúdo do '/etc/passwd' retorna o conteúdo do '/etc/passwd', o aplicativo protegido é vulnerável aos ataques de Path Traversal. A Wallarm registrará a vulnerabilidade com um tipo apropriado.

Para detectar vulnerabilidades no aplicativo, a Wallarm envia solicitações com sinais de ataque usando os seguintes métodos:

* **Detecção passiva**: a vulnerabilidade foi encontrada devido ao incidente de segurança que ocorreu.
* **Verificação de ameaça ativa**: permite que você transforme os invasores em testers de penetração e descubra possíveis problemas de segurança a partir de sua atividade enquanto eles sondam seus aplicativos/APIs em busca de vulnerabilidades. Este módulo encontra possíveis vulnerabilidades sondando endpoints de aplicativos usando dados reais de ataque do tráfego. Por padrão, este método está desativado.
* **Scanner de vulnerabilidades**: os ativos expostos da empresa são examinados em busca de vulnerabilidades típicas.

### Detecção passiva

Com a detecção passiva, a Wallarm detecta uma vulnerabilidade devido ao incidente de segurança que ocorreu. Se uma vulnerabilidade do aplicativo foi explorada durante um ataque, a Wallarm registra o incidente de segurança e a vulnerabilidade explorada.

A detecção passiva de vulnerabilidades está ativada por padrão.

### Verificação de ameaças ativas <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

A Verificação de Ameaças Ativas da Wallarm transforma os invasores em seus próprios testers de penetração. Ele analisa as primeiras tentativas de ataque e, em seguida, explora outras maneiras pelas quais o mesmo ataque pode ser explorado. Isso expõe pontos fracos em seu ambiente que até mesmo os invasores originais não encontraram. [Leia mais](../vulnerability-detection/active-threat-verification/overview.md)

Os recursos da Verificação de Ameaças Ativas:

* **Testes em tempo real**: Utiliza dados de ataque ao vivo para identificar pontos fracos atuais e futuros, mantendo-o um passo à frente dos hackers.
* **Simulação segura e inteligente**: Ignora detalhes sensíveis de autenticação e remove o código prejudicial nos testes. Simula técnicas de ataque para máxima segurança, não arriscando danos reais.
* **Testes seguros em ambiente não produtivo**: Permite que você [execute checagens de vulnerabilidade em um ambiente de teste ou desenvolvimento](../vulnerability-detection/active-threat-verification/running-test-on-staging.md) usando dados reais de produção, mas sem os riscos como sobrecarga do sistema ou exposição de dados.

O módulo está desativado por padrão. Para ativá-lo:

1. Verifique se você tem um plano de assinatura **Advanced API Security** ativo. O módulo só está disponível neste plano.

    Se você estiver em um plano diferente, entre em contato com nossa [equipe de vendas](mailto:sales@wallarm.com) para fazer a transição para o necessário.
1. Acesse Wallarm Console → **Vulnerabilidades** → **Configure** seguindo o link para [US Cloud](https://us1.my.wallarm.com/vulnerabilities/active?configure=true) ou [EU Cloud](https://my.wallarm.com/vulnerabilities/active?configure=true), e alterne a chave **Verificação de ameaça ativa**.

Você tem ainda a capacidade de [ajustar ou personalizar o comportamento do módulo](../vulnerability-detection/active-threat-verification/enable-disable-active-threat-verification.md) para endpoints específicos.

### Scanner de Vulnerabilidades <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### Como funciona

Scanner de Vulnerabilidades verifica todos os ativos expostos da empresa à procura de vulnerabilidades típicas. O Scanner envia solicitações para endereços de aplicativos a partir de endereços IP fixos e adiciona o cabeçalho `X-Wallarm-Scanner-Info` às solicitações.

#### Configuração

* O Scanner pode ser [ativado ou desativado](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) no Wallarm Console → **Vulnerabilidades** → **Configure**. Por padrão, o Scanner está ativado.
* A lista de [vulnerabilidades que podem ser detectadas](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) pelo Scanner pode ser configurada em Wallarm Console → **Vulnerabilidades** → **Configure**. Por padrão, o Scanner de Vulnerabilidades detecta todas as vulnerabilidades disponíveis.
* O [limite de solicitações enviadas a partir do Scanner](../user-guides/scanner.md#limiting-vulnerability-scanning) pode ser configurado para cada ativo em Wallarm Console → **Scanner** → **Configure**.
* Se você usa instalações adicionais (software ou hardware) para filtrar e bloquear o tráfego automaticamente, recomenda-se que você configure uma lista de permissões com os endereços IP para o Scanner Wallarm. Isso permitirá que os componentes Wallarm escaneiem seus recursos em busca de vulnerabilidades sem problemas.

    * [Endereço IP do Scanner registrado na Wallarm US Cloud](../admin-en/scanner-addresses.md)
    * [Endereço IP do Scanner registrado na Wallarm EU Cloud](../admin-en/scanner-addresses.md)

    Se você não usa instalações adicionais, mas usa o Scanner Wallarm, você não precisa permitir manualmente os endereços IP do Scanner. A partir do nó Wallarm 3.0, os endereços IP do Scanner são automaticamente incluídos na lista de permissões.

## Falsos positivos

**Falso positivo** ocorre quando os sinais de ataque são detectados na solicitação legítima ou quando uma entidade legítima é qualificada como uma vulnerabilidade. [Mais detalhes sobre falsos positivos na detecção de ataques →](protecting-against-attacks.md#false-positives)

Falsos positivos na varredura de vulnerabilidades podem ocorrer devido às especificidades do aplicativo protegido. Respostas semelhantes a solicitações semelhantes podem indicar uma vulnerabilidade ativa em um aplicativo protegido e ser o comportamento esperado de outro aplicativo protegido.

Se detectado um falso positivo para uma vulnerabilidade, você pode adicionar uma marca apropriada à vulnerabilidade no Console Wallarm. Uma vulnerabilidade marcada como falso positivo será fechada e não será rechecada.

Se a vulnerabilidade detectada existir no aplicativo protegido, mas não puder ser corrigida, recomendamos a configuração da regra [**Criar um patch virtual**](../user-guides/rules/vpatch-rule.md). Esta regra permitirá bloquear ataques que exploram o tipo de vulnerabilidade detectada e eliminará o risco de um incidente.

## Gerenciando vulnerabilidades descobertas

Todas as vulnerabilidades detectadas são exibidas na seção Wallarm Console → **Vulnerabilidades**. Você pode gerenciar as vulnerabilidades através da interface da seguinte maneira:

* Visualizar e analisar vulnerabilidades
* Executar a verificação de status da vulnerabilidade: ainda ativo ou corrigido no lado do aplicativo
* Fechar vulnerabilidades ou marcá-las como falsos positivos

![Seção Vulnerabilidades](../images/user-guides/vulnerabilities/check-vuln.png)

Se você usar o módulo [**API Discovery**](../api-discovery/overview.md) da plataforma Wallarm, as vulnerabilidades serão vinculadas aos endpoints de API descobertos, por exemplo:

![API Discovery - Pontuação de Risco](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

Para mais informações sobre o gerenciamento de vulnerabilidades, consulte as instruções sobre [trabalho com vulnerabilidades](../user-guides/vulnerabilities.md).

## Notificações sobre vulnerabilidades descobertas

A Wallarm pode enviar notificações sobre vulnerabilidades descobertas. Ele permite que você esteja ciente das novas vulnerabilidades descobertas em seus aplicativos e responda a elas prontamente. Responder a vulnerabilidades inclui corrigi-las no lado do aplicativo, relatar falsos positivos e aplicar patches virtuais.

Para configurar notificações:

1. Crie a [integração nativa](../user-guides/settings/integrations/integrations-intro.md) com o sistema para enviar notificações (por exemplo, PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. No cartão de integração, selecione **Vulnerabilidades detectadas** na lista de eventos disponíveis.

Exemplo de notificação do Splunk sobre vulnerabilidade detectada:

```json
{
    summary:"[Mensagem de teste] [Test partner(BR)] Nova vulnerabilidade detectada",
    description:"Tipo de notificação: vuln

                Uma nova vulnerabilidade foi detectada em seu sistema.

                ID: 
                Título: Teste
                Domínio: exemplo.com
                Caminho: 
                Método: 
                Descoberto por: 
                Parâmetro: 
                Tipo: Info
                Ameaça: Média

                Mais detalhes: https://us1.my.wallarm.com/object/555


                Cliente: EmpresaTeste
                Nuvem: EUA
                ",
    details:{
        client_name:"EmpresaTeste",
        cloud:"EUA",
        notification_type:"vuln",
        vuln_link:"https://us1.my.wallarm.com/object/555",
        vuln:{
            domain:"exemplo.com",
            id:null,
            method:null,
            parameter:null,
            path:null,
            title:"Teste",
            discovered_by:null,
            threat:"Média",
            type:"Info"
        }
    }
}
```