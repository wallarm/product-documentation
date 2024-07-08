# Configurando o limite de taxa

A falta de limitação de taxa está incluída na lista dos riscos de segurança API mais graves do [OWASP API Top 10 2019](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md). Sem medidas adequadas de limitação de taxa, as APIs são vulneráveis a ataques como negação de serviço (DoS), força bruta e excesso de uso da API. Este artigo explica como proteger sua API e usuários com a regra de regulamentação de limite de taxa do Wallarm.

O Wallarm fornece a regra **Definir limite de taxa** para ajudar a prevenir tráfego excessivo para sua API. Esta regra permite que você especifique o número máximo de conexões que podem ser feitas para um determinado escopo, garantindo também que as solicitações de entrada sejam distribuídas de maneira uniforme. Se uma solicitação exceder o limite definido, o Wallarm a rejeita e retorna o código que você selecionou na regra.

O Wallarm examina vários parâmetros de solicitação, como cookies ou campos JSON, que permitem limitar as conexões não apenas com base no endereço IP de origem, mas também em identificadores de sessão, nomes de usuário ou endereços de e-mail. Este nível adicional de granularidade permite aperfeiçoar a segurança geral de uma plataforma com base em qualquer dado de origem.

## Criando e aplicando a regra

Para definir e aplicar o limite de taxa:

1. Vá para Wallarm Console → **Regras** → **Adicionar regra**.
1. Em **Se a solicitação é**, [descreva](rules.md#branch-description) o escopo para aplicar a regra.
1. Em **Depois**, escolha **Definir limite de taxa** e defina um limite desejado para conexões com seu escopo:

    * Número máximo para as solicitações por segundo ou minuto.
    * **Estouro** - número máximo de solicitações excessivas para serem armazenadas em buffer uma vez que o RPS/RPM especificado é excedido e a ser processado uma vez que a taxa volte ao normal. `0` por padrão.

        Se o valor for diferente de `0`, você pode controlar se deseja manter o RPS/RPM definido entre a execução de solicitações excessivas em buffer.
        
        **Sem atraso** indica o processamento simultâneo de todas as solicitações excedentes em buffer, sem o atraso do limite de taxa. **Atraso** implica o processamento simultâneo do número especificado de solicitações excessivas, as demais são processadas com atraso definido em RPS/RPM.
    
    * **Código de resposta** - código a ser retornado em resposta a solicitações rejeitadas. `503` por padrão.
1. Em **Nesta parte da solicitação**, especifique os pontos de solicitação para os quais você deseja definir limites. O Wallarm restringirá solicitações que tenham os mesmos valores para os parâmetros de solicitação selecionados.

    Todos os pontos disponíveis são descritos [aqui](request-processing.md), você pode escolher aqueles que correspondem ao seu caso de uso específico, por exemplo:
    
    * `remote_addr` para limitar conexões por IP de origem
    *  `json` → `json_doc` → `hash` → `api_key` para limitar conexões pelo parâmetro do corpo JSON `api_key`

    !!! info "Restrições no comprimento do valor"
        O comprimento máximo permitido dos valores dos parâmetros pelos quais você mede os limites é de 8000 símbolos.
1. Aguarde a [compilação da regra ser concluída](rules.md).

## Exemplos de regras

<!-- ### Limitando conexões de IP para prevenir ataques DoS no endpoint da API

Suponha que você tenha uma seção na IU que retorna uma lista de usuários, com um limite de 200 usuários por página. Para buscar a página, a IU envia uma solicitação ao servidor usando a seguinte URL: `https://example-domain.com/api/users?page=1&size=200`.

No entanto, um invasor pode explorar isso alterando o parâmetro `size` para um número excessivamente grande (por exemplo, 200.000), o que pode sobrecarregar o banco de dados e causar problemas de desempenho. Isso é conhecido como um ataque DoS (Negação de Serviço), onde a API se torna inoperante e incapaz de lidar com mais solicitações de qualquer cliente.

Limitar as conexões ao endpoint ajuda a prevenir esses ataques. Você pode limitar o número de conexões ao endpoint para 1000 por minuto. Isso assume que, em média, 200 usuários são solicitados 5 vezes por minuto. A regra especifica que esse limite se aplica a cada IP tentando acessar o endpoint dentro de um minuto. O [ponto](request-processing.md) `remote_address` é usado para identificar o endereço IP do solicitante.

![Exemplo](../../images/user-guides/rules/rate-limit-for-200-users.png) -->

### Limitando conexões por IP para garantir alta disponibilidade da API

Suponha que a API REST de uma empresa de saúde permita que os médicos enviem informações do paciente por meio de uma solicitação POST para o endpoint `/patients` do host `https://example-host.com`. Este endpoint contém informações pessoais de saúde sensíveis, e é importante garantir que não seja abusado ou sobrecarregado por um grande número de solicitações.

Limitar as conexões por IP dentro de um determinado período de tempo especificamente para o endpoint `/patients` poderia prevenir isso. Isso garante a estabilidade e disponibilidade do endpoint para todos os médicos, ao mesmo tempo que protege a segurança das informações do paciente, evitando ataques de DoS.

Por exemplo, o limite pode ser definido para 5 solicitações POST por minuto para cada endereço IP da seguinte forma:

![Exemplo](../../images/user-guides/rules/rate-limit-by-ip-for-patients.png)

### Limitando conexões por sessões para prevenir ataques de força bruta nos parâmetros de autenticação

Ao aplicar a limitação de taxa às sessões do usuário, você pode restringir tentativas de força bruta para encontrar JWTs reais ou outros parâmetros de autenticação para obter acesso não autorizado a recursos protegidos. Por exemplo, se o limite de taxa for definido para permitir apenas 10 solicitações por minuto por sessão, um invasor que tenta descobrir um JWT válido fazendo várias solicitações com diferentes valores de token atingirá rapidamente o limite de taxa e suas solicitações serão rejeitadas até que o período de limite de taxa expire.

Suponha que seu aplicativo atribua a cada sessão de usuário um ID único e o reflita no cabeçalho `X-SESSION-ID`. O endpoint da API na URL `https://example.com/api/login` aceita solicitações POST que incluem um JWT do tipo Bearer no cabeçalho `Authorization`. Para esse cenário, a regra que limita as conexões por sessões parecerá assim:

![Exemplo](../../images/user-guides/rules/rate-limit-for-jwt.png)

A [regexp](rules.md#condition-type-regex) usada para o valor `Authorization` é ``^Bearer\s+([a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-_]+)$`.

Se você usa JWT (JSON Web Tokens) para gerenciar as sessões do usuário, pode ajustar a regra para [descriptografar](request-processing.md#jwt) o JWT e extrair o ID da sessão de seu payload da seguinte maneira:

![Exemplo](../../images/user-guides/rules/rate-limit-for-session-in-jwt.png)

### Limitação de taxa baseada em User-Agent para prevenir ataques nos endpoints da API

Vamos supor que você tenha uma versão antiga do seu aplicativo que tem algumas vulnerabilidades de segurança conhecidas que permitem aos invasores forçar a API do endpoint `https://example-domain.com/login` usando a versão vulnerável do aplicativo. Normalmente, o cabeçalho `User-Agent` é usado para passar versões de navegador / aplicativo. Para prevenir o ataque de força bruta através da antiga versão do aplicativo, você pode implementar uma limitação de taxa baseada em `User-Agent`.

Por exemplo, você pode definir um limite de 10 solicitações por minuto para cada `User-Agent`. Se um `User-Agent` específico estiver fazendo mais de 10 solicitações distribuídas uniformemente por minuto, solicitações adicionais desse `User-Agent` são rejeitadas até que um novo período se inicie.

![Exemplo](../../images/user-guides/rules/rate-limit-by-user-agent.png)

<!-- ### Limitação de taxa baseada em endpoint para prevenir ataques DoS

A limitação de taxa também pode envolver a definição de um limite para o número de solicitações que podem ser feitas a um endpoint específico dentro de um período de tempo especificado, como 60 solicitações por minuto. Se um cliente exceder esse limite, solicitações adicionais são rejeitadas.

Isso ajuda a prevenir ataques DoS e garante que o aplicativo permaneça disponível para usuários legítimos. Também pode ajudar a reduzir a carga no servidor, melhorar o desempenho geral do aplicativo e prevenir outras formas de abuso ou uso indevido do aplicativo.

Nesse caso específico, a regra de limitação de taxa é aplicada às conexões por URI, o que significa que o Wallarm identifica automaticamente solicitações repetidas direcionadas a um único endpoint. Veja um exemplo de como essa regra funcionaria para todos os endpoints do host `https://example.com`:

* Limite: 60 solicitações por minuto (1 solicitação por segundo)
* Estouro: permitir até 20 solicitações por minuto (que pode ser útil se houver um pico súbito de tráfego)
* Sem atraso: processa 20 solicitações excessivas simultaneamente, sem o atraso do limite de taxa entre as solicitações
* Código de resposta: rejeita solicitações que excedem o limite e o estouro com o código 503
* O Wallarm identifica solicitações repetidas direcionadas a um único endpoint pelo [ponto](request-processing.md) `uri` 

    !!! info "Parâmetros de consulta não estão incluídos na URI"
        Essa regra limita solicitações direcionadas a qualquer caminho do domínio especificado que não contém parâmetros de consulta.

![Exemplo](../../images/user-guides/rules/rate-limit-by-uri.png) -->

### Limitando conexões por IDs de cliente para prevenir sobrecarga do servidor

Vamos considerar um serviço da web que fornece acesso aos dados de pedidos de clientes para uma plataforma de comércio eletrônico. A limitação de taxa por ID de cliente pode ajudar a prevenir que os clientes façam muitos pedidos em um curto período de tempo, o que pode sobrecarregar a gestão de estoque e a realização de pedidos.

Por exemplo, a regra que limita cada cliente por 10 solicitações POST por minuto para `https://example-domain.com/orders` pode parecer assim. Este exemplo considera que o ID do cliente é [passado](request-processing.md#json_doc) no objeto do corpo JSON `data.customer_id`.

![Exemplo](../../images/user-guides/rules/rate-limit-by-customer-id.png)

## Limitações e peculiaridades

O recurso de limitação de taxa tem as seguintes limitações e peculiaridades:

* A regra de limitação de taxa é suportada por todas as [formas de implantação do Wallarm](../../installation/supported-deployment-options.md) exceto pela imagem Docker baseada em Envoy.
* O comprimento máximo permitido dos valores dos parâmetros pelos quais você mede os limites é de 8000 símbolos.
* Se você tem vários nós Wallarm e o tráfego de entrada em cada nó atende à regra de limite de taxa, eles são limitados independentemente.
* Quando várias regras de limite de taxa se aplicam a solicitações de entrada, a regra com o menor limite de taxa é usada para limitar as solicitações.
* Se uma solicitação de entrada não tiver o ponto especificado na seção de regra **Nesta parte da solicitação**, então essa regra não é aplicada como limitação para essa solicitação.
* Se o seu servidor web estiver configurado para limitar conexões (por exemplo, usando o módulo NGINX [`ngx_http_limit_req_module`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)) e você também aplicar a regra do Wallarm, o servidor web rejeita as solicitações pelas regras configuradas, mas o Wallarm não.
* O Wallarm não salva solicitações que excedem o limite de taxa, apenas as rejeita retornando o código escolhido na regra. A exceção são solicitações com [sinais de ataque](../../about-wallarm/protecting-against-attacks.md) - elas são registradas pelo Wallarm mesmo se forem rejeitadas pela regra de limitação de taxa.