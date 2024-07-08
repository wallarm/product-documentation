# Descoberta de API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

A seção **Descoberta de API** do console Wallarm permite gerenciar seu [inventário de API](../api-discovery/overview.md), além de ajustar detalhadamente sua descoberta. Este guia instrui como usar esta seção.

A seção só está disponível para usuários com os seguintes [papéis](../user-guides/settings/users.md#user-roles):

* **Administrador** e **Analista** podem visualizar e gerenciar os dados descobertos pelo módulo de descoberta de API e acessar a parte de configuração da descoberta de API.
  
    **Administrador Global** e **Analista Global** nas contas com o recurso de multilocação têm os mesmos direitos.
* **Desenvolvedor de API** pode visualizar e baixar os dados descobertos pelo módulo de descoberta de API. Este papel permite distinguir usuários cujas tarefas só requerem usar o Wallarm para obter dados reais sobre as APIs da empresa. Esses usuários não têm acesso a nenhuma outra seção do console do Wallarm, exceto **Descoberta de API** e **Configurações → Perfil**.

![Endpoints descobertos por API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "Visualização padrão: período de tempo, classificação e agrupamento"

    **Período de tempo**

    Cada vez que você abre a seção **Descoberta de API**:
    
    * Você vê o inventário real de suas APIs (todos os endpoints descobertos)
    * O filtro **Alterações desde** vai para o estado `Última semana`, o que significa:

        * Dos endpoints apresentados, os `Novo` e `Alterado` dentro desse período obterão [marcas](#tracking-changes-in-api) correspondentes.
        * Além disso, endpoints `Excluídos` dentro desse período serão exibidos

    Veja [este exemplo](#example) para entender o que a Descoberta de API exibe por padrão.

    Você pode selecionar manualmente outros períodos de tempo para serem considerados.

    **Classificação e agrupamento**

    Por padrão, os endpoints são classificados por nomes de host/endpoint (e agrupados por hosts). Se você classificar por **Hits** ou **Risco**, o agrupamento desaparece – para voltar ao padrão, clique na coluna de hosts/endpoint novamente.

## Filtrando endpoints

Entre uma ampla gama de filtros de endpoint de API, você pode escolher aqueles que correspondem ao propósito de sua análise, por exemplo:

* Apenas endpoints atacados que você pode classificar pelo número de hits.
* Encontre os endpoints que foram alterados ou recém-descobertos na última semana e que processam dados PII. Este tipo de solicitação pode ajudá-lo a ficar atualizado com mudanças críticas em suas APIs.
* Encontre os endpoints sendo usados para carregar dados em seu servidor pelas chamadas PUT ou POST. Como tais endpoints são alvos frequentes de ataques, eles devem ser bem protegidos. Usando este tipo de solicitação, você pode verificar se os endpoints são conhecidos pela equipe e estão bem protegidos contra ataques.
* Encontre os endpoints que processam os dados de cartões bancários dos clientes. Com esta solicitação, você pode verificar se os dados confidenciais são processados apenas por endpoints seguros.
* Encontre os endpoints de uma versão de API descontinuada (por exemplo, pesquisando `/v1`) e certifique-se de que eles não são usados pelos clientes.
* Encontre os endpoints mais vulneráveis caracterizados por processar dados sensíveis e vulnerabilidades ativas de alto nível de risco. A exploração de vulnerabilidades de alto risco permite aos atacantes realizar muitas ações maliciosas com o sistema, incluindo o roubo de dados sensíveis que o endpoint processa/armazena.

Todos os dados filtrados podem ser exportados no OpenAPI v3 para análise adicional.

## Visualizando parâmetros do endpoint

<a name="params"></a>Ao clicar no endpoint, você também pode encontrar os detalhes do endpoint, incluindo estatísticas de solicitação, parâmetros obrigatórios e opcionais com os tipos de dados relevantes:

![Parâmetros de solicitação descobertos pela Descoberta de API](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

Cada informação do parâmetro inclui:

* Nome do parâmetro e a parte da solicitação à qual este parâmetro pertence
* Informações sobre mudanças no parâmetro (novo, não usado)
* Presença e tipo de dados sensíveis (PII) transmitidos por este parâmetro, incluindo:

    * Dados técnicos como endereços IP e MAC
    * Credenciais de login como chaves secretas e senhas
    * Dados financeiros como números de cartão bancário
    * Dados médicos como número de licença médica
    * Informações pessoalmente identificáveis (PII) como nome completo, número de passaporte ou SSN

* [Tipo/formato](../api-discovery/overview.md#parameter-types-and-formats) de dados enviados neste parâmetro
* Data e hora da última atualização das informações do parâmetro

## Rastreando mudanças na API

Você pode verificar quais [mudanças ocorreram](../api-discovery/overview.md#tracking-changes-in-api) na API dentro do período de tempo especificado. Para fazer isso, a partir do filtro **Alterações desde**, selecione o período ou a data apropriada. As seguintes marcas serão exibidas na lista de endpoints:

* **Novo** para os endpoints adicionados à lista dentro do período.
* **Alterado** para os endpoints que têm parâmetros recém-descobertos ou parâmetros que obtiveram o status `Não usado` dentro do período. Nos detalhes do endpoint, tais parâmetros terão uma marca correspondente.

    * Um parâmetro recebe o status `Novo` se for descoberto dentro do período.
    * Um parâmetro recebe o status `Não usado` se não transmitir nenhum dado por 7 dias.
    * Se posteriormente o parâmetro no status `Não usado` transmitir dados novamente, ele perderá o status `Não usado`.

* **Não usado** para os endpoints que obtiveram o status `Não usado` dentro do período.

    * Um endpoint recebe o status `Não usado` se não for solicitado (com o código 200 na resposta) por 7 dias.
    * Se posteriormente o endpoint no status `Não usado` for solicitado (com o código 200 na resposta) novamente, ele perderá o status `Não usado`.

Observe que, independentemente do período selecionado, se nada estiver destacado com a marca **Novo**, **Alterado** ou **Não usado**, isso significa que não há mudanças na API para esse período.

![API Discovery - rastrear mudanças](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "Período padrão"
    Cada vez que você abre a seção **API Discovery**, o filtro **Alterações desde** vai para o estado `Última semana`, o que significa que apenas as mudanças ocorridas na última semana são destacadas.

Usar o filtro **Alterações desde** apenas destaca os endpoints alterados dentro do período selecionado, mas não filtra os endpoints sem mudanças.

O filtro **Mudanças na API** funciona de maneira diferente e mostra **apenas** os endpoints alterados dentro do período selecionado e filtra todos os demais.

<a name="example"></a>Vamos considerar o exemplo: digamos que sua API hoje tem 10 endpoints (eram 12, mas 3 deles foram marcados como não usados há 10 dias). 1 desses 10 foi adicionado ontem, 2 têm mudanças em seus parâmetros ocorridas há 5 dias para um e 10 dias para outro:

* Cada vez que você abrir a seção **API Discovery** hoje, o filtro **Alterações desde** vai para o estado `Última semana`; a página exibirá 10 endpoints, na coluna **Mudanças** 1 deles terá a marca **Novo**, e 1 terá a marca **Alterado**.
* Troque **Alterações desde** para `Últimas 2 semanas` - 13 endpoints serão exibidos, na coluna **Mudanças** 1 deles terá a marca **Novo**, 2 terão a marca **Alterado**, e 3 terão a marca **Não usado**.
* Defina **Mudanças na API** para `Endpoints não utilizados` - 3 endpoints serão exibidos, todos com a marca **Não usado**.
* Altere **Mudanças na API** para `Novos endpoints + Endpoints não utilizados` - 4 endpoints serão exibidos, 3 com a marca **Não usado**, e 1 com a marca **Novo**.
* Troque **Alterações desde** de volta para `Última semana` - 1 endpoint será exibido, ele terá a marca **Novo**.

## Trabalhando com pontuação de risco

A [pontuação de risco](../api-discovery/overview.md#endpoint-risk-score) permite entender quais endpoints têm maior probabilidade de ser alvo de um ataque e, portanto, devem ser o foco de seus esforços de segurança.

A pontuação de risco pode variar de `1` (menor) a `10` (maior):

| Valor | Nível de Risco | Cor |
| --------- | ----------- | --------- |
| 1 a 3 | Baixo | Cinza |
| 4 a 7 | Médio | Laranja |
| 8 a 10 | Alto | Vermelho |

* `1` significa que não há fatores de risco para este endpoint.
* A pontuação de risco não é exibida (`N/A`) para os endpoints não utilizados.
* Classifique por pontuação de risco na coluna **Risco**.
* Filtre por `Alto`, `Médio` ou `Baixo` usando o filtro **Pontuação de risco**.

!!! info "Configurando cálculo de pontuação de risco"
    Por padrão, o módulo Descoberta de API calcula automaticamente uma pontuação de risco para cada endpoint com base nos pesos dos fatores de risco comprovados. Para adaptar a estimativa de pontuação de risco à sua compreensão da importância dos fatores, você pode [configurar](#customizing-risk-score-calculation) o peso de cada fator e um método de cálculo de pontuação de risco.

Para entender o que causou a pontuação de risco para o endpoint e como reduzir o risco, vá para os detalhes do endpoint:

![API Discovery - Pontuação de risco](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## Monitorando ataques em endpoints de API

O número de ataques em endpoints de API nos últimos 7 dias é exibido na coluna **Hits**.

Você pode:

* Solicitar a exibição apenas de endpoints atacados selecionando em filtros: **Outros** → **Endpoints atacados**.
* Classificar pela coluna **Hits**.

Para ver ataques a algum endpoint, clique no número na coluna **Hits**:

![Endpoint de API - eventos abertos](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

A seção **Eventos** será exibida com o [filtro aplicado](../user-guides/search-and-filters/use-search.md):

```
attacks last 7 days endpoint_id:<SEU_ID_DE_ENDPOINT>
```

Você também pode copiar a URL de algum endpoint para a área de transferência e usá-la para pesquisar os eventos. Para fazer isso, no menu desse endpoint, selecione **Copiar URL**.

## Inventário de API e regras

Você pode criar rapidamente uma nova [regra personalizada](../user-guides/rules/rules.md) a partir de qualquer endpoint do inventário de API:

1. No menu deste endpoint, selecione **Criar regra**. A janela de criação de regra é exibida. O endereço do endpoint é analisado na janela automaticamente.
1. Na janela de criação de regra, especifique a informação da regra e, em seguida, clique em **Criar**.

![Criar regra a partir do endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## Exibindo API sombra, órfã e zumbi

O módulo **Descoberta de API** descobre automaticamente APIs desonestas (sombra, órfã e zumbi) comparando o trânsito registrado real com as [especificações fornecidas pelos clientes](../api-specification-enforcement/overview.md). Para exibir [APIs desonestas](../api-discovery/overview.md#shadow-orphan-and-zombie-apis) entre endpoints descobertos pelo Wallarm:

* Use o filtro **Comparar com...** para selecionar comparações de especificações - apenas para elas as APIs desonestas serão destacadas pelas marcas especiais na coluna **Problemas**.

    ![Descoberta de API - destacando e filtrando API desonesta](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* Use o filtro **APIs desonestas** para ver apenas APIs sombra, órfãs e/ou zumbis relacionadas às comparações selecionadas e filtre os demais endpoints.

O endpoint é definido como API sombra ou órfã como resultado da comparação do trânsito real com algumas especificações (pode haver várias). Eles serão listados nos detalhes do endpoint, na seção **Conflitos de especificação**. O endpoint é definido como zumbi como resultado da comparação das versões de especificação anteriores e atuais e do trânsito real.

APIs sombra também são exibidas entre os endpoints de maior risco no [Painel de Descoberta de API](../user-guides/dashboards/api-discovery.md).

## Baixar especificação OpenAPI (OAS) do seu inventário de API

A interface de usuário da Descoberta de API oferece a opção de baixar a especificação [OpenAPI v3](https://spec.openapis.org/oas/v3.0.0) de um endpoint de API individual ou de toda a API descoberta pelo Wallarm.

* O botão **Download OAS** na página do inventário de API retorna `swagger.json` para todo o inventário ou apenas os dados filtrados se algum filtro foi aplicado antes do download.

    Com os dados baixados, você pode identificar endpoints ausentes (API sombra) e endpoints não utilizados (API zumbi) em sua especificação em comparação com as descobertas do Wallarm.

    !!! warning "Informações do host da API no arquivo Swagger baixado"
        Se um inventário de API descoberto contém vários hosts de API, os endpoints de todos os hosts da API serão incluídos no arquivo Swagger baixado. Atualmente, as informações do host da API não estão incluídas no arquivo.

* O botão **Download OAS** no menu de um endpoint individual retorna `swagger.json` para o endpoint selecionado.

    Ao utilizar a especificação baixada com outras aplicações como o Postman, você pode conduzir testes de vulnerabilidade do endpoint e outros. Além disso, ele permite um exame mais detalhado das capacidades do endpoint para descobrir o processamento de dados sensíveis e a presença de parâmetros não documentados.

## Proteção automática contra BOLA

O Wallarm pode [descobrir e proteger automaticamente endpoints que são vulneráveis aos ataques BOLA](../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) entre os explorados pelo módulo **API Discovery**. Se a opção estiver ativada, os endpoints protegidos são destacados com o ícone correspondente no inventário de API, por exemplo:

![Gatilho BOLA](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

Você pode filtrar os endpoints de API pelo estado de proteção automática contra BOLA. O parâmetro correspondente está disponível no filtro **Outros**.

## Configurando Descoberta de API

Ao clicar no botão **Configurar Descoberta de API** na seção **Descoberta de API**, você prossegue para as opções de ajuste da descoberta de API, como escolher aplicativos para a descoberta de API e personalizar o cálculo da pontuação de risco.

### Escolhendo aplicativos para a Descoberta de API

Se a assinatura [Descoberta de API](../api-discovery/overview.md) foi adquirida para a conta da sua empresa, você pode ativar/desativar a análise de tráfego com a Descoberta de API em Console Wallarm → **Descoberta de API** → **Configurar Descoberta de API**.

Você pode ativar/desativar a Descoberta de API para todos os aplicativos ou apenas os selecionados.

![Descoberta de API – Configurações](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

Quando você adiciona um novo aplicativo em **Configurações** → **[Aplicações](settings/applications.md)**, ele é automaticamente adicionado à lista de aplicativos para descoberta de API no estado **desativado**.

### Personalizando cálculo de pontuação de risco

Você pode configurar o peso de cada fator no cálculo da [pontuação de risco](../api-discovery/overview.md#endpoint-risk-score) e o método de cálculo.

Padrões:

* Método de cálculo: `Use o peso mais alto de todos os critérios como pontuação de risco do endpoint`.
* Pesos de fator padrão:

    | Fator | Peso |
    | --- | --- |
    | Vulnerabilidades ativas | 9 |
    | Potencialmente vulnerável ao BOLA | 6 |
    | Parâmetros com dados sensíveis | 8 |
    | Número de parâmetros de consulta e corpo | 6 |
    | Aceita objetos XML / JSON | 6 |
    | Permite o carregamento de arquivos para o servidor | 6 |

Para alterar como a pontuação de risco é calculada:

1. Clique no botão **Configurar Descoberta de API** na seção **Descoberta de API**.
1. Selecione o método de cálculo: peso mais alto ou médio.
1. Se necessário, desative os fatores que você não deseja que afetem a pontuação de risco.
1. Defina o peso para os restantes.

    ![Configuração de Descoberta de API - Configuração de pontuação de risco](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. Salve as mudanças. O Wallarm recalcula a pontuação de risco para seus endpoints, de acordo com as novas configurações, em alguns minutos.