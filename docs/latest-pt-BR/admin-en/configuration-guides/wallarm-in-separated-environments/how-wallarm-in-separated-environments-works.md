# Como Funciona o Nó de Filtragem em Ambientes Separados

O aplicação pode ser implantada em diferentes ambientes: produção, homologação, teste, desenvolvimento, etc. Estas instruções fornecem informações sobre as maneiras sugeridas de gerenciar um nó de filtro para diferentes ambientes.

## O que é um Ambiente
A definição de um ambiente pode variar de empresa para empresa, e para o propósito desta instrução, a definição seguinte é usada.

Um **ambiente** é um conjunto ou subconjunto isolado de recursos computacionais que servem diferentes finalidades (como produção, homologação, teste, desenvolvimento, etc) e são gerenciados usando o mesmo ou diferentes conjuntos de políticas (em termos de configurações de rede/software, versões de software, monitoramento, gerenciamento de alterações, etc) pelas mesmas ou diferentes equipes (SRE, QA, Desenvolvimento, etc) de uma empresa.

Do ponto de vista das melhores práticas, é recomendado manter a configuração dos nós Wallarm sincronizada em todos os ambientes usados em um único produto vertical (estágios de desenvolvimento, teste, homologação e produção).

## Recursos Relevantes do Wallarm

Existem três principais recursos que permitem gerenciar diferentes configurações de nós de filtro para diferentes ambientes e realizar um lançamento gradual de alterações nos nós de filtro:

* [Identificação de recurso](#resource-identification)
* [Contas Wallarm separadas e sub-contas](#separate-wallarm-accounts-and-sub-accounts)
* [Modo de operação do nó de filtro](../../configure-wallarm-mode.md)

### Identificação de Recurso

Existem duas maneiras de configurar o nó de filtro para um ambiente específico usando a identificação:

* IDs únicos do Wallarm para cada ambiente,
* diferentes nomes de domínio URL dos ambientes (se ele já estiver configurado em sua arquitetura).

#### Identificação do Ambiente por ID

O conceito de Aplicações permite que você atribua diferentes IDs para diferentes ambientes protegidos, e gerencie as regras dos nós de filtro separadamente para cada ambiente.

Ao configurar um nó de filtro, você pode adicionar IDs do Wallarm para seus ambientes usando o conceito de Aplicações. Para configurar IDs:

1. Adicione os nomes dos ambientes e seus IDs em sua conta Wallarm → **Configurações** → seção **Aplicações**.

    ![Ambientes adicionados](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/added-applications.png)
2. Especifique a configuração do ID em um nó de filtro:

    * usando a diretiva [`wallarm_application`](../../configure-parameters-en.md#wallarm_application) para implementações Docker, Kubernetes lado a lado ou baseadas em Linux;
    * usando a anotação [`nginx.ingress.kubernetes.io/wallarm-application`](../../configure-kubernetes-en.md#ingress-annotations) para implementações do controlador NGINX Ingress do Kubernetes. Agora, ao criar uma nova regra de nó de filtro, é possível especificar que a regra será atribuída a um conjunto específico de IDs de aplicação. Sem o atributo, uma nova regra será automaticamente aplicada a todos os recursos protegidos em uma conta Wallarm.

![Criando regra para ID](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-id.png)

#### Identificação do Ambiente por Domínio

Se cada ambiente estiver usando diferentes nomes de domínio URL passados no cabeçalho `HOST` do pedido HTTP, então é possível usar os nomes de domínio como identificadores únicos de cada ambiente.

Para usar o recurso, adicione o ponteiro de cabeçalho `HOST` adequado para cada regra de nó de filtro configurada. No exemplo a seguir, a regra só será acionada para pedidos com o cabeçalho `HOST` igual a `dev.domain.com`:

![Criando regra para HOST](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/create-rule-for-host.png)

### Contas e Sub-contas Wallarm Separadas

Uma opção fácil para isolar a configuração do nó de filtro de diferentes ambientes é usar contas Wallarm separadas para cada ambiente ou grupo de ambientes. Esta prática recomendada é endossada por muitos fornecedores de serviços de nuvem, incluindo o Amazon AWS.

Para simplificar o gerenciamento de várias contas Wallarm, é possível criar uma conta `master` Wallarm lógica e atribuir outras contas Wallarm usadas como sub-contas à conta `master`. Desta maneira, um único conjunto de credenciais de UI do console e API pode ser usado para gerenciar todas as contas Wallarm pertencentes à sua organização.

Para ativar uma conta `master` e sub-contas, entre em contato com o [suporte técnico do Wallarm](mailto:support@wallarm.com). O recurso requer uma licença corporativa separada do Wallarm.

!!! aviso "Limitações conhecidas"
    * Todos os nós de filtragem conectados à mesma conta Wallarm receberão o mesmo conjunto de regras de filtragem de tráfego. Você ainda pode aplicar regras diferentes para diferentes aplicações usando [os IDs de aplicação apropriados ou cabeçalhos de pedido HTTP únicos](#resource-identification).
    * Se o nó de filtragem decidir bloquear automaticamente um endereço IP (por exemplo, por causa de três ou mais vetores de ataque detectados a partir do endereço IP) o sistema irá bloquear o IP para todas as aplicações em uma conta Wallarm.