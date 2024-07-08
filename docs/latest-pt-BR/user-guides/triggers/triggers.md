# Trabalhando com gatilhos

Gatilhos são ferramentas usadas para configurar notificações personalizadas e reações a eventos. Usando gatilhos, você pode:

* Receber alertas sobre eventos importantes por meio das ferramentas que você usa para o seu fluxo de trabalho diário, por exemplo, via mensageiros corporativos ou sistemas de gerenciamento de incidentes.
* Bloquear endereços IP dos quais foram enviados um determinado número de solicitações ou vetores de ataque.
* Identificar [ataques comportamentais](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks) pelo número de solicitações enviadas a determinados pontos finais da API.
* Otimizar a lista de eventos [agrupando](../../about-wallarm/protecting-against-attacks.md#attack) hits originários do mesmo endereço IP em um só ataque.
* Monitorar o aumento de solicitações maliciosas detectadas pelos nós da Wallarm que podem indicar um ataque em andamento e tomar medidas oportunas, como bloquear manualmente os endereços IP dos atacantes, para mitigar a ameaça.

Você pode configurar todos os componentes do gatilho:

* **Condição**: evento do sistema para o qual você deseja ser notificado. Por exemplo: recebendo uma certa quantidade de ataques, endereço IP na lista negra e novo usuário adicionado à conta.
* **Filtros**: detalhes da condição. Por exemplo: tipos de ataque.
* **Reação**: ação que deve ser realizada se a condição e filtros especificados forem atendidos. Por exemplo: enviar a notificação para o Slack ou outro sistema configurado como a [integração](../settings/integrations/integrations-intro.md), bloquear endereço IP ou marcar solicitações como ataque de força bruta.

Os gatilhos são configurados na seção **Gatilhos** do Console Wallarm. A seção está disponível apenas para usuários com a função de **Administrador** [papel](../settings/users.md).

![Seção para configurar gatilhos](../../images/user-guides/triggers/triggers-section.png)

## Criando gatilhos

1. Clique no botão **Criar gatilho**.
2. [Escolha](#step-1-choosing-a-condition) condições.
3. [Adicione](#step-2-adding-filters) filtros.
4. [Adicione](#step-3-adding-reactions) reações.
5. [Salve](#step-4-saving-the-trigger) o gatilho.

### Etapa 1: Escolhendo uma condição

Uma condição é um evento de sistema para o qual deve ser notificado. As seguintes condições estão disponíveis para notificação:

* [Força bruta](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA](../../admin-en/configuration-guides/protecting-against-bola.md)
* [JWT fraco](trigger-examples.md#detect-weak-jwts)
* Número de [vetores de ataque (cargas maliciosas)](../../glossary-en.md#malicious-payload) (cargas experimentais baseadas em [expressões regulares personalizadas](../rules/regex-rule.md) não são contadas)
* Número de [ataques](../../glossary-en.md#attack) (ataques experimentais baseados em [expressões regulares personalizadas](../rules/regex-rule.md) não são contados)
* Número de [hits](../../glossary-en.md#hit) exceto por:

    * Hits experimentais detectados com base na [expressão regular personalizada](../rules/regex-rule.md). Hits não experimentais são contabilizados.
    * Hits não salvos na [amostra](../events/analyze-attack.md#sampling-of-hits).
* Número de incidentes
* IP na lista negra
* [Mudanças no estoque da API](../../api-discovery/overview.md#tracking-changes-in-api)
* Hits do mesmo IP, exceto aqueles de força bruta, navegação forçada, BOLA (IDOR), limite de recursos, bomba de dados e tipos de ataque de patch virtual
* Usuário adicionado

![Condições disponíveis](../../images/user-guides/triggers/trigger-conditions.png)

Escolha uma condição na interface do Console Wallarm e defina o limite inferior para a reação, se a configuração estiver disponível.

### Etapa 2: Adicionando filtros

Os filtros são usados para detalhar condições. Por exemplo, você pode configurar reações a ataques de certos tipos, como ataques de força bruta, injeções SQL e outros.

Os seguintes filtros estão disponíveis:

* **URI** (apenas para as condições **Força Bruta**, **Navegação Forçada** e **BOLA**): URI completa para a qual a solicitação foi enviada. URI pode ser configurado via [construtor de URL](../../user-guides/rules/rules.md#uri-constructor) ou [formulário de edição avançado](../../user-guides/rules/rules.md#advanced-edit-form).
* **Tipo** é um [tipo](../../attacks-vulns-list.md) de ataque detectado na solicitação ou uma tipo de vulnerabilidade para a qual a solicitação está direcionada.
* **Aplicativo** é o [aplicativo](../settings/applications.md) que recebe a solicitação ou no qual um incidente é detectado.
* **IP** é um endereço IP do qual a solicitação é enviada.

    O filtro espera apenas IPs únicos, não permitindo sub-redes, localizações e tipos de origem.
* **Domínio** é o domínio que recebe a solicitação ou no qual um incidente é detectado.
* **Status de resposta** é o código de resposta retornado à solicitação.
* **Alvo** é uma parte da arquitetura da aplicação que o ataque é direcionado ou na qual o incidente é detectado. Pode assumir os seguintes valores: `Servidor`, `Cliente`, `Banco de dados`.
* **Papel do usuário** é o papel do usuário adicionado. Pode assumir os seguintes valores: `Deploy`, `Analista`, `Admin`.

Escolha um ou mais filtros na interface do Console Wallarm e defina valores para eles.

![Filtros disponíveis](../../images/user-guides/triggers/trigger-filters.png)

### Etapa 3: Adicionando reações

Uma reação é uma ação que deve ser realizada se a condição especificada e os filtros forem atendidos. O conjunto de reações disponíveis depende da condição selecionada. As reações podem ser dos seguintes tipos:

* [Marcar as solicitações como ataque de força bruta ou navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md). As solicitações serão marcadas como ataques na lista de eventos, mas não serão bloqueadas. Para bloquear solicitações, você pode adicionar uma reação adicional: coloque o endereço IP na [lista negra](../ip-lists/denylist.md).
* [Marcar os pedidos como ataque BOLA](../../admin-en/configuration-guides/protecting-against-bola.md). As solicitações serão marcadas como ataques na lista de eventos, mas não serão bloqueadas. Para bloquear solicitações, você pode adicionar uma reação adicional: coloque o endereço IP na [lista negra](../ip-lists/denylist.md).
* [Registrar a vulnerabilidade JWT](trigger-examples.md#detect-weak-jwts).
* Adicionar IP à [lista negra](../ip-lists/denylist.md).
* Adicionar IP à [lista cinza](../ip-lists/graylist.md).
* Enviar uma notificação para o sistema SIEM ou URL Webhook configurado nas [integrações](../settings/integrations/integrations-intro.md).
* Enviar uma notificação para o mensageiro configurado nas [integrações](../settings/integrations/integrations-intro.md).

    !!! Aviso "Notificar sobre IPs da lista negra via messengers"
        Os gatilhos permitem o envio de notificações sobre os IPs da lista negra apenas para os sistemas SIEM ou URL de Webhook. Os mensageiros não estão disponíveis para a condição de gatilho **IP na lista negra**.
* [Agrupe os próximos hits em um único ataque](trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack) se a condição do gatilho for **Hits do mesmo IP**.

    O botão [**Marcar como positivo falso**](../events/false-attack.md#mark-an-attack-as-a-false-positive) e a opção de [verificação ativa](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) não estarão disponíveis para esses ataques.

Escolha uma ou mais reações na interface do Console Wallarm. As reações disponíveis para a condição estão localizadas em **Número de ataques**:

![Escolhendo uma integração](../../images/user-guides/triggers/select-integration.png)

### Etapa 4: Salvando o gatilho

1. Clique no botão **Criar** no diálogo modal de criação de gatilho.
2. Especifique o nome e a descrição do gatilho (se necessário) e clique no botão **Concluído**.

Se o nome do gatilho e a descrição não forem especificados, então o gatilho é criado com o nome `Novo gatilho por <nome_do_usuario>, <data_de_criação>` e uma descrição vazia.

## Gatilhos pré-configurados (gatilhos padrão)

As novas contas da empresa possuem os seguintes gatilhos pré-configurados (gatilhos padrão):

* Agrupar hits originados do mesmo IP em um único ataque

    O gatilho agrupa todos os [hits](../../glossary-en.md#hit) enviados do mesmo endereço IP em um único ataque na lista de eventos. Isso otimiza a lista de eventos e permite uma análise mais rápida dos ataques.

    Este gatilho é liberado quando um único endereço IP origina mais de 50 hits em 15 minutos. Apenas os hits enviados após exceder o limite são agrupados no ataque.

    Os hits podem ter diferentes tipos de ataque, cargas maliciosas e URLs. Esses parâmetros de ataque serão marcados com a tag `[múltiplo]` na lista de eventos.

    Devido aos diferentes valores dos parâmetros dos hits agrupados, o botão [Marcar como falso positivo](../events/false-attack.md#mark-an-attack-as-a-false-positive) estará indisponível para todo o ataque, mas você ainda poderá marcar certos hits como falsos positivos. [Verificação ativa do ataque](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) também estará indisponível.
    
    Os hits com os tipos de ataque Força Bruta, Navegação Forçada, Limite de Recursos, Bomba de Dados ou Patch Virtual não são considerados neste gatilho.
* Colocar o IP na lista cinza por 1 hora quando ele origina mais de 3 [cargas maliciosas](../../glossary-en.md#malicious-payload) diferentes em 1 hora.

    A [lista cinza](../ip-lists/graylist.md) é uma lista de endereços IP suspeitos processados pelo nó da seguinte maneira: se a lista cinza de IPs originar solicitações maliciosas, o nó os bloqueará, mas permitirá solicitações legítimas. Em contraste com a lista cinza, a [lista negra](../ip-lists/denylist.md) se refere a endereços IP que não têm permissão para acessar seus aplicativos - o nó bloqueia até o tráfego legítimo produzido por fontes na lista negra. A lista cinza de IP é uma das opções destinadas à redução de [falsos positivos](../../about-wallarm/protecting-against-attacks.md#false-positives).

    O gatilho é liberado em qualquer modo de filtragem de nó, para que ele adicione IPs à lista cinza independentemente do modo do nó.

    No entanto, o nó analisa a lista cinza apenas no modo de **bloqueio seguro**. Para bloquear solicitações maliciosas originadas por IPs na lista cinza, mude o [modo](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) do nó para bloqueio seguro, aprendendo suas características primeiro.

    Os hits com os tipos de ataque Força Bruta, Navegação Forçada, Limite de Recursos, Bomba de Dados ou Patch Virtual não são considerados neste gatilho.
* Detecte JWTs fracos

    [JSON Web Token (JWT)](https://jwt.io/) é um padrão de autenticação popular usado para trocar dados entre recursos como APIs de forma segura. A comprometimento da JWT é um objetivo comum de atacantes, pois quebrar mecanismos de autenticação oferece a eles acesso total a aplicativos da web e APIs. Quanto mais fracos os JWTs, maior a chance de eles serem comprometidos.

    Este gatilho permite que a Wallarm detecte automaticamente JWTs fracos nas solicitações que chegam e registre as [vulnerabilidades](../vulnerabilities.md) correspondentes.

Os gatilhos funcionam em todo o tráfego dentro de uma conta da empresa por padrão, mas você pode alterar qualquer configuração de gatilho.

## Desabilitando e excluindo gatilhos

* Para parar temporariamente de enviar notificações e reações aos eventos, você pode desabilitar o gatilho. Um gatilho desativado será exibido nas listas com gatilhos **Todos** e **Desativados**. Para reativar o envio de notificações e reações a eventos, a opção **Ativar** é usada.
* Para parar permanentemente de enviar notificações e reações aos eventos, você pode excluir o gatilho. A exclusão de um gatilho não pode ser desfeita. O gatilho será removido permanentemente da lista de gatilhos.

Para desativar ou excluir o gatilho, selecione uma opção apropriada no menu do gatilho e confirme a ação, se necessário.