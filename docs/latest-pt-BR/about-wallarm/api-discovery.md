# Descobrindo inventário API <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

O módulo **API Discovery** da plataforma Wallarm [constrói](#habilita%C3%A7%C3%A3o-econfigura%C3%A7%C3%A3o-da-descoberta-da-api) o inventário da API REST do seu aplicativo com base no uso real da API. O módulo analisa continuamente as solicitações de tráfego real e constrói o inventário da API com base nos resultados da análise. Este artigo fornece uma visão geral da **API Discovery**: questões abordadas por ela, seu propósito e principais possibilidades.

Para obter informações sobre como usar o módulo de **API Discovery**, consulte o [guia do usuário](../api-discovery/exploring.md).

## Problemas resolvidos por API Discovery

**Construir um inventário atual e completo da API** é o principal problema que o módulo API Discovery está resolvendo.

Manter o inventário da API atualizado é uma tarefa difícil. Existem várias equipes que usam diferentes APIs e é comum que diferentes ferramentas e processos sejam usados para produzir a documentação da API. Como resultado, as empresas lutam para entender quais APIs elas têm, quais dados elas expõem e ter uma documentação atualizada da API.

Como o módulo API Discovery usa o tráfego real como fonte de dados, isso ajuda a obter uma documentação atualizada e completa da API, incluindo no inventário da API todos os pontos finais que estão processando efetivamente as solicitações.

**Conforme você descobre seu inventário de API com a Wallarm, você pode**:

* Ter uma visibilidade total de todo o patrimônio da API, incluindo a lista de APIs [externas e internas](#apis-externas-e-internas).
* Ver quais dados estão [entrando nas APIs](../api-discovery/exploring.md#params).
* Entender quais pontos finais são [mais prováveis](#pontua%C3%A7%C3%A3o-de-risco-do-ponto-de-extremidade) de ser um alvo de ataque.
* Ver as APIs mais atacadas nos últimos 7 dias.
* Filtrar apenas APIs atacadas, classificá-las por número de acertos.
* Filtrar APIs que consomem e transportam dados sensíveis.
* Encontrar APIs [sombra, órfãs e zumbis](#api-sombra-%C3%B3rf%C3%A3s-e-zumbis).
* [Baixar](../api-discovery/exploring.md#baixar-a-especifica%C3%A7%C3%A3o-openapi-oas-do-seu-invent%C3%A1rio-da-api) pontos finais descobertos como especificação no formato OpenAPI v3 e comparar com suas próprias especificações de API para encontrar pontos finais apresentados em suas especificações mas não descobertos pela Wallarm (pontos finais que não estão em uso, também conhecidos como "API zumbi").
* [Rastrear mudanças](#rastrear-mudan%C3%A7as-na-api) na API que ocorreram dentro do período de tempo selecionado.
* [Criar regras](../api-discovery/exploring.md#invent%C3%A1rio-de-api-e-regras) rapidamente para qualquer ponto final da API.
* Obter uma lista completa das solicitações maliciosas para qualquer ponto de extremidade da API.
* Fornecer aos seus desenvolvedores acesso ao inventário da API construída para revisão e download.

## Como funciona o API Discovery?

A API Discovery conta com estatísticas de solicitação e usa algoritmos sofisticados para gerar especificações de API atualizadas com base no uso real da API.

### Abordagem híbrida

API Discovery usa uma abordagem híbrida para conduzir a análise localmente e na nuvem. Esta abordagem permite um processo [centrado na privacidade](#seguran%C3%A7a-dos-dados-carregados-para-o-cloud-da-wallarm), onde os dados de solicitação e dados sensíveis são mantidos localmente enquanto utilizam o poder da nuvem para a análise das estatísticas:

1. O API Discovery analisa o tráfego legítimo localmente. A Wallarm analisa os pontos de extremidade para os quais as solicitações são feitas e quais parâmetros são passados.
1. De acordo com esses dados, as estatísticas são criadas e enviadas para o Nuvem.
1. A Nuvem Wallarm agrega as estatísticas recebidas e constrói uma [descrição da API](../api-discovery/exploring.md) em sua base.

    !!! info "Detecção de ruído"
        Solicitações raras ou únicas são [consideradas como ruído](#detec%C3%A7%C3%A3o-de-ru%C3%ADdo) e não incluídas no inventário da API.

### Detecção de ruído

O módulo API Discovery baseia a detecção de ruído nos dois principais parâmetros de tráfego:

* Estabilidade do Ponto Final - pelo menos 5 solicitações devem ser registradas em um período de 5 minutos a partir do momento da primeira solicitação ao ponto final.
* Estabilidade do Parâmetro - a ocorrência do parâmetro nas solicitações ao ponto final deve ser superior a 1%.

O inventário da API exibirá os pontos de extremidade e os parâmetros que excederam esses limites. O tempo necessário para construir o inventário completo da API depende da diversidade e intensidade do tráfego.

Além disso, o API Discovery realiza a filtragem das solicitações apoiado em outros critérios:

* Somente aquelas solicitações para as quais o servidor respondeu na faixa de 2xx são processadas.
* As solicitações que não estão de acordo com os princípios de design da API REST não são processados. Isso é feito controlando o parâmetro do cabeçalho `Content-Type` das respostas: se o parâmetro `Content-Type` não contiver `application` como um tipo e `json` como um subtipo, tal solicitação é considerada como não-API REST e é filtrada. Exemplo de resposta da API REST: `Content-Type: application/json;charset=utf-8`. Se o parâmetro não existir, a API Discovery analisa a solicitação.
* Campos padrão como `Accept` e similares são descartados.

### Elementos do inventário da API 

O inventário da API inclui os seguintes elementos:

* Pontos de extremidade da API
* Métodos de solicitação (GET, POST, e outros)
* Parâmetros obrigatórios e opcionais GET, POST, e cabeçalho, incluindo:
    * [Tipo/formato](#tipos-eformatos-de-par%C3%A2metro) de dados enviados em cada parâmetro
    * Presença e tipo de dados sensíveis (PII) transmitidos pelo parâmetro:

        * Dados técnicos como endereços IP e MAC
        * Credenciais de login como chaves secretas e senhas
        * Dados financeiros como números de cartões bancários
        * Dados médicos como número de licença médica
        * Informações de identificação pessoal (PII) como nome completo, número de passaporte ou Número de Seguro Social
    
    * Data e hora em que as informações do parâmetro foram atualizadas pela última vez.

### Tipos e formatos de parâmetro

A Wallarm analisa os valores que são passados em cada um dos parâmetros do ponto final e tenta determinar seu formato:

* Int32
* Int64
* Float
* Double
* Data
* Datetime
* Email
* IPv4
* IPv6
* UUID
* URI
* Nome do host
* Byte
* MAC

Se o valor no parâmetro não se enquadrar no formato específico de dados, então um dos tipos de dados comuns será especificado:

* Integer
* Number
* String
* Boolean

Para cada parâmetro, a coluna **Type** exibe:

* Formato de dados
* Se o formato não estiver definido - tipo de dados

Estes dados permitem verificar se os valores do formato esperado são passados em cada parâmetro. Inconsistências podem ser o resultado de um ataque ou de um scan da sua API, por exemplo:

* Os valores `String` são passados para o campo com `IP`
* Os valores `Double` são passados para o campo onde deve haver um valor não maior que `Int32`

### Visualização de amostra

Antes de comprar o plano de [assinatura](subscription-plans.md#subscription-plans) com a API Discovery, você pode visualizar os dados amostrais. Para fazer isso, na seção **API Discovery**, clique em **Explorar em um playground**.

![API Discovery – Amostra de Dados](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## Uso do inventário da API construída 

A secção **API Discovery** fornece muitas opções para o uso do inventário da API construída.

![Pontos de extremidade descobertos pela API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

Essas opções são:

* Pesquisa e filtros
* Capacidade de listar APIs internas e externas separadamente.
* Visualização de parâmetros de ponto de extremidade.
* Rastreamento de mudanças na API. 
* Navegação rápida para ataques relacionados a algum ponto final.
* Criação de regra personalizada para o ponto final específico.
* Download da especificação OpenAPI (OAS) para pontos finais individuais da API e uma API completa como arquivo `swagger.json`.

Saiba mais sobre as opções disponíveis no [Guia do usuário](../api-discovery/exploring.md).

## Pontuação de risco do ponto de extremidade

API Discovery calcula automaticamente uma **pontuação de risco** para cada ponto final do seu inventário da API. A pontuação de risco permite entender quais pontos finais têm maior probabilidade de ser um alvo de ataque e, portanto, devem ser o foco de seus esforços de segurança.

A pontuação de risco é composta por vários fatores, incluindo:

* Presença de [**vulnerabilidades ativas**](detecting-vulnerabilities.md) que podem resultar em acesso ou corrupção de dados não autorizados.
* Capacidade de **carregar arquivos para o servidor** - os pontos de extremidade são frequentemente alvo de ataques de [Execução Remota de Código (RCE)](../attacks-vulns-list.md#remote-code-execution-rce), onde arquivos com código malicioso são carregados para um servidor. Para proteger esses pontos de extremidade, as extensões e conteúdos dos arquivos carregados devem ser adequadamente validados conforme recomendado pelo [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).
* Presença de [**partes variáveis do caminho**](#variabilidade-nos-pontos-finais), como IDs do usuário, por exemplo `/api/artigos/autor/{parâmetro_X}`. Os atacantes podem manipular IDs de objetos e, no caso de autenticação de solicitação insuficiente, podem ler ou modificar os dados sensíveis do objeto ([**Ataques BOLA**](../admin-en/configuration-guides/protecting-against-bola.md)).
* Presença dos parâmetros com [**dados sensíveis**](#elementos-do-invent%C3%A1rio-da-api) - em vez de atacar diretamente as APIs, os atacantes podem roubar dados sensíveis e usá-los para acessar seus recursos de maneira imperceptível.
* Um **grande número de parâmetros** aumentando o número de direções de ataque.
* **Objetos XML ou JSON** passados na solicitação do ponto final podem ser usados pelos atacantes para transferir entidades externas XML maliciosas e injeções para o servidor.

!!! info "Configurando cálculo de pontuação de risco"
    Para adaptar a estimativa de pontuação de risco de acordo com sua compreensão da importância dos fatores, você pode [configurar](../api-discovery/exploring.md#configurar-o-c%C3%A1lculo-da-pontua%C3%A7%C3%A3o-de-risco) o peso de cada fator no cálculo da pontuação de risco e o método de cálculo.

[Aprenda como trabalhar com a pontuação de risco →](../api-discovery/exploring.md#trabalhar-com-a-pontua%C3%A7%C3%A3o-de-risco)

## Rastrear mudanças na API

Se você atualizar a API e a estrutura do tráfego for ajustada, API Discovery atualiza o inventário da API construída.

A empresa pode ter várias equipes, linguagens de programação diferentes e uma variedade de frameworks de linguagem. Assim, as mudanças podem chegar à API a qualquer momento de fontes diferentes, o que torna difícil controlá-las. Para os os diretores de segurança, é importante detectar as mudanças o mais rápido possível e analisá-las. Se perdidas, tais mudanças podem conter alguns riscos, por exemplo:

* A equipe de desenvolvimento pode começar a usar uma biblioteca de terceiros com uma API separada e eles não notificam os especialistas em segurança sobre isso. Dessa forma, a empresa obtém pontos finais que não são monitorados e não são verificados quanto a vulnerabilidades. Eles podem ser direções de ataque potenciais.
* Os dados PII começam a ser transferidos para o ponto de extremidade. Uma transferência não planejada de PII pode levar a uma violação da conformidade com os requisitos dos reguladores, bem como a riscos de reputação.
* O ponto de extremidade importante para a lógica de negócios (por exemplo, `/login`, `/order/{order_id}/payment/`) não é mais chamado.
* Outros parâmetros que não deveriam ser transferidos. Por exemplo, `is_admin` (alguém acessa o ponto de extremidade e tenta fazê-lo com direitos de administrador) começa a ser transferido para o ponto de extremidade.

Com o módulo **API Discovery** da Wallarm, você pode:

* Rastrear mudanças e verificar se elas não interrompem os processos de negócios atuais.
* Certificar-se de que não apareceram pontos de extremidade desconhecidos na infraestrutura que poderiam ser um vetor de ameaça potencial.
* Certificar-se de que PII e outros parâmetros inesperados não começaram a ser transferidos para os pontos de extremidade.
* Configurar notificações sobre mudanças em sua API por meio de [gatilhos](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory) com a condição **Mudanças na API**.

Aprenda como trabalhar com o recurso de rastreamento de mudanças no [Guia do usuário](../api-discovery/exploring.md#rastrear-mudan%C3%A7as-na-api).

## APIs externas e internas

Os pontos de extremidade acessíveis a partir da rede externa são as principais direções do ataque. Portanto, é importante ver o que está disponível do lado de fora e prestar atenção a esses pontos de extremidade em primeiro lugar.

A Wallarm divide automaticamente as APIs descobertas em externas e internas. O host com todos os seus pontos finais é considerado interno se estiver localizado em:

* Um endereço IP privado ou local
* Um domínio de nível superior genérico (por exemplo: localhost, dashboard, etc.)

Nos demais casos, os hosts são considerados externos.

Por padrão, é exibida uma lista com todos os hosts de API (externos e internos). No inventário da API construído, você pode visualizar suas APIs internas e externas separadamente. Para fazer isso, clique em **External** ou **Internal**.

## Variabilidade nos pontos finais

URLs podem incluir elementos diversos, como ID do usuário, como:

* `/api/artigos/autor/autor-a-0001`
* `/api/artigos/autor/autor-a-1401`
* `/api/artigos/autor/autor-b-1401`

O módulo **API Discovery** unifica esses elementos no formato `{parameter_X}` nos caminhos dos pontos finais; portanto, para o exemplo acima, você não terá 3 pontos finais, mas, em vez disso, haverá apenas um:

* `/api/artigos/autor/{parameter_X}`

Clique no ponto de extremidade para expandir seus parâmetros e ver qual tipo foi detectado automaticamente para o parâmetro diverso.

![API Discovery - Variabilidade no caminho](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Note que o algoritmo analisa o novo tráfego. Se em algum momento você ver endereços, que deveriam ser unificados mas isso não aconteceu ainda, aguarde. Assim que mais dados chegarem, o sistema unificará pontos finais que correspondam ao novo padrão encontrado com a quantidade apropriada de endereços correspondentes.

## Proteção automática contra BOLA

Ataques comportamentais, tais como [Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) exploram a vulnerabilidade do mesmo nome. Esta vulnerabilidade permite que um invasor acesse um objeto pelo seu identificador por meio de uma solicitação de API e leia ou modifique seus dados, contornando um mecanismo de autorização.

Potenciais alvos dos ataques BOLA são pontos de extremidade com variabilidade. A Wallarm pode descobrir automaticamente e proteger tais pontos de extremidade entre os explorados pelo módulo **API Discovery**.

Para habilitar a proteção automática BOLA, vá para a [Console Wallarm → **BOLA protection**](../user-guides/bola-protection.md) e mude a chave para o estado habilitado:

![Gatilho BOLA](../images/user-guides/bola-protection/trigger-enabled-state.png)

Cada ponto de extremidade protegido da API será destacado com o ícone correspondente no inventário da API, por exemplo:

![Gatilho BOLA](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

Você pode filtrar os pontos de extremidade da API pelo estado de proteção automática BOLA. O parâmetro correspondente está disponível sob o filtro **Others**.

## API sombra, órfãs e zumbis

API Discovery permite descobrir APIs rogue (sombra, órfãs e zumbis).

Uma **API sombra** refere-se a uma API não documentada que existe dentro da infraestrutura de uma organização sem a devida autorização ou supervisão. Eles colocam negócios em risco, pois os invasores podem explorá-los para acessar sistemas críticos, roubar dados valiosos ou interromper as operações. Além disso, é reforçado pelo fato de que as APIs geralmente atuam como guardiões de dados críticos e uma variedade de vulnerabilidades da API OWASP pode ser explorada para contornar a segurança da API.

Em termos de suas [especificações](../api-specification-enforcement/overview.md) da API enviadas, a API sombra é um ponto de extremidade apresentado no tráfego atual (detectado pela API Discovery) e não apresentado estruturas de composição de suas especificações.

Conforme você encontra APIs sombras com a Wallarm, pode atualizar suas especificações para incluir pontos de extremidade ausentes e realizar atividades adicionais de monitoramento e segurança para o seu inventário de API na sua íntegra.

Uma **API órfã** refere-se a uma API documentada que não recebe tráfego. A presença de APIs órfãs pode ser motivo para um processo de verificação. Isso envolve:

* Inspeção das configurações de tráfego da Wallarm para entender se o tráfego realmente não está sendo recebido, ou se ele simplesmente não é visível para os nós da Wallarm porque foram implantados de uma forma com a qual nem todo o tráfego passa por eles (isso pode ser roteamento de tráfego incorreto, ou outro Gateway Web foi colocado que foi esquecido de colocar o nó, e assim por diante).
* Determinar se certos aplicativos não devem receber nenhum tráfego nesses pontos finais específicos ou se é algum tipo de má configuração.
* Tomar a decisão sobre pontos de extremidade obsoletos: usado em versões de aplicativo anteriores e não usado no atual - eles devem ser excluídos da especificação para reduzir o esforço de verificação de segurança.

Uma **API zumbi** refere-se a APIs descontinuadas das quais todos presumem que foram desabilitadas, mas que na verdade ainda estão em uso. Seus riscos são semelhantes ao restante das API não documentadas (sombra), mas podem ser piores, pois o motivo para a desativação é muitas vezes os designs inseguros que são mais fáceis de quebrar.

Em termos de suas especificações de API carregadas, a API zumbi é um ponto de extremidade apresentado na versão anterior de sua especificação, não apresentado na versão atual (ou seja, havia uma intenção de deleção desse ponto final) mas ainda apresentado no tráfego atual (detectado pela API Discovery).

Encontrar API zumbi com a Wallarm pode ser o motivo para verificar novamente a configuração da API de seus aplicativos para realmente desativar tais pontos finais.

O módulo API Discovery automaticamente descobre APIs sombras, órfãs e zumbis comparando o inventário da API descoberto com as especificações fornecidas pelos clientes. Você carrega suas especificações de API na seção [**Especificações da API**](../api-specification-enforcement/overview.md) e o módulo automaticamente destaca pontos finais sombra, órfãs e zumbis.

![API Discovery - destacando e filtrando API rogue](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* [Saiba como carregar especificações para encontrar APIs rogue →](../api-specification-enforcement/overview.md#revelando-api-sombra-%C3%B3rf%C3%A3s-e-zumbis)
* [Saiba como exibir APIs rogue encontradas na seção API Discovery →](../api-discovery/exploring.md#exibindo-api-sombra-e-%C3%B3rf%C3%A3s)

## Segurança dos dados carregados para o Cloud da Wallarm

API Discovery analisa a maior parte do tráfego localmente. O módulo envia para o Cloud Wallarm apenas os pontos de extremidade descobertos, os nomes dos parâmetros e vários dados estatísticos (horário de chegada, seu número, etc.) Todos os dados são transmitidos por um canal seguro: antes de enviar as estatísticas para o Cloud Wallarm, o módulo API Discovery hash os valores dos parâmetros de solicitação usando o algoritmo [SHA-256](https://en.wikipedia.org/wiki/SHA-2).

No lado da nuvem, os dados de hash são usados para análise estatística (por exemplo, ao quantificar solicitações com parâmetros idênticos).

Outros dados (valores do ponto final, métodos de solicitação e nomes dos parâmetros) não são hasheados antes de serem enviados para o Cloud Wallarm, porque os hashes não podem ser restaurados para seu estado original, o que tornaria a construção do inventário da API impossível.

!!! warning "Importante"
    A Wallarm não envia os valores que são especificados nos parâmetros para o Cloud. Apenas o ponto de extremidade, os nomes dos parâmetros e as estatísticas sobre eles são enviados.

## Habilitação e configuração da descoberta da API

O pacote `wallarm-appstructure` está incluído em todas as [formas](../installation/supported-deployment-options.md) do nó Wallarm, exceto para os pacotes Debian 11.x e Ubuntu 22.04. Durante a implantação do nó, ele instala o módulo API Discovery, mas o mantém desabilitado por padrão.

Para habilitar e rodar API Discovery corretamente:

1. Certifique-se de que seu nó de Wallarm é da [versão compatível](../updating-migrating/versioning-policy.md#version-list).

    Para garantir que você sempre tenha acesso ao conjunto completo dos recursos da API Discovery, é recomendável verificar regularmente as atualizações do pacote `wallarm-appstructure` da seguinte maneira:


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. Certifique-se de que seu plano de [assinatura](subscription-plans.md#subscription-plans) inclui **API Discovery**. Para mudar o plano de assinatura, envie um pedido para [sales@wallarm.com](mailto:sales@wallarm.com).
1. Se você quiser habilitar API Discovery apenas para os aplicativos selecionados, certifique-se de que os aplicativos foram adicionados conforme descrito no artigo [Configuração de aplicativos](../user-guides/settings/applications.md).

    Se os aplicativos não estiverem configurados, as estruturas de todas as APIs são agrupadas em uma árvore.

1. Habilite API Discovery para os aplicativos necessários no Wallarm Console → **API Discovery** → **Configurar API Discovery**.

    ![API Discovery – Configurações](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "Acesso às configurações de API Discovery"
        Apenas os administradores da conta  Wallarm da sua empresa podem acessar as configurações da API Discovery. Entre em contato com o administrador se você não tiver esse acesso.

Assim que o módulo API Discovery for habilitado, ele iniciará a análise do tráfego e a construção do inventário da API. O inventário da API será exibido na seção **API Discovery** do Console Wallarm.

## Depuração da API Discovery

Para obter e analisar os logs da API Discovery, você pode usar os seguintes métodos:

* Se o nó Wallarm for instalado a partir de pacotes de origem: execute o utilitário padrão **journalctl** ou **systemctl** dentro da instância.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* Se o nó Wallarm for implantado a partir do contêiner Docker: leia o arquivo de log `/var/log/wallarm/appstructure.log` dentro do contêiner.
* Se o nó Wallarm for implantado como o controlador de Ingresso do Kubernetes: verifique o status do pod que executa os contêineres Tarantool e `wallarm-appstructure`. A status do pod deve ser **Running**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    Leia os logs do contêiner `wallarm-appstructure`:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```