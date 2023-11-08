# Modelo de segurança de responsabilidade compartilhada para dados de clientes

A Wallarm se baseia em um modelo de segurança de responsabilidade compartilhada. Nesse modelo, todas as partes (Wallarm e seus clientes) têm diferentes áreas de responsabilidades quando se trata da segurança dos dados dos clientes, incluindo qualquer Informação de Identificação Pessoal (PII) e Dados do Portador do Cartão.

A Wallarm é uma solução híbrida (parte software e parte SaaS) com dois principais componentes em diferentes áreas de responsabilidades:

* Software **nó de filtragem Wallarm**, implantado em sua infraestrutura e gerenciado por você. O componente de nó Wallarm é responsável por filtrar solicitações de usuários finais, enviar solicitações seguras para seu aplicativo e bloquear solicitações mal-intencionadas. O nó Wallarm passa o tráfego e toma a decisão localmente se uma solicitação é mal-intencionada ou não. O tráfego NÃO é espelhado para a Wallarm Cloud para análise.
* **Nuvem Wallarm**, um componente de nuvem gerenciado pela Wallarm, é responsável por receber metainformações sobre solicitações processadas e ataques detectados pelos nós de filtragem; bem como gerar regras de filtragem específicas do aplicativo e torná-las disponíveis para os nós baixarem. Wallarm Console e API pública fornecem a você a capacidade de ver relatórios de segurança e eventos individuais; gerenciar regras de filtragem de tráfego, usuários do Wallarm Console, integrações externas, etc.

![Esquema de Responsabilidades](../images/shared-responsibility.png)

## Responsabilidades da Wallarm

A Wallarm é responsável pelos seguintes pontos:

* A segurança e disponibilidade dos ambientes de nuvem Wallarm, a segurança do código do nó de filtragem Wallarm e dos sistemas internos da Wallarm.

    Isso inclui, mas não se limita a: conserto de servidor, operação dos serviços necessários para fornecer o serviço de nuvem Wallarm, teste de vulnerabilidade, registro e monitoramento de eventos de segurança, gerenciamento de incidentes, monitoramento operacional e suporte 24/7. Wallarm também é responsável por gerenciar as configurações de firewall do servidor e perímetro (grupos de segurança) dos ambientes de nuvem Wallarm.

* Atualizando o componente de nó de filtragem Wallarm periodicamente. Note que a aplicação dessas atualizações é responsabilidade do cliente.

* Fornecer a você uma cópia do último relatório de auditoria Wallarm SOC 2 Tipo II, se solicitado.

## Responsabilidades do cliente

Os clientes Wallarm são responsáveis pelos seguintes pontos:

* Implementação de controles internos sólidos e consistentes em relação ao acesso geral ao sistema de TI e à adequação do uso do sistema para todos os componentes internos associados à Wallarm, incluindo o nó de filtragem Wallarm e Wallarm Cloud.

* Prática de remoção de contas de usuário para qualquer usuário que tenha sido demitido e que antes esteve envolvido em quaisquer funções ou atividades materiais associadas aos serviços da Wallarm.

* Configurando as [regras de mascaramento de dados](../user-guides/rules/sensitive-data-rule.md) apropriadas para qualquer dado sensível que possa sair do perímetro de segurança do cliente e seja enviado para a Wallarm Cloud como parte do relatório de solicitações mal-intencionadas detectadas.

* Garantir que as transações para as organizações clientes relacionadas aos serviços da Wallarm sejam apropriadamente autorizadas, e que as transações sejam seguras, oportunas e completas.

* Notificar a Wallarm de maneira oportuna sobre quaisquer alterações no pessoal diretamente envolvido com os serviços prestados pela Wallarm. Esse pessoal pode estar envolvido em funções financeiras, técnicas ou administrativas auxiliares diretamente associadas aos serviços fornecidos pela Wallarm.

* Atualizar os nós de filtragem com novas atualizações de software lançadas pela Wallarm de maneira oportuna.

* Desenvolver e, se necessário, implementar um plano de continuidade de negócios e recuperação de desastres (BCDRP) que ajudará na continuação dos serviços fornecidos pela Wallarm.

## Mascaramento de dados sensíveis

Como acontece com qualquer serviço de terceiros, é importante que um cliente Wallarm entenda quais dados do cliente são enviados para a Wallarm e tenha certeza de que os dados sensíveis nunca chegarão à Wallarm Cloud. Recomenda-se que os clientes Wallarm com PCI DSS, GDPR e outros requisitos mascarem dados sensíveis usando regras especiais.

Os únicos dados transmitidos dos nós de filtragem para a Wallarm Cloud que podem incluir detalhes sensíveis são informações sobre solicitações mal-intencionadas detectadas. É altamente improvável que uma solicitação mal-intencionada contenha dados sensíveis. No entanto, a abordagem recomendada é mascarar campos de solicitação HTTP que possam conter PII ou detalhes de cartão de crédito, como `token`, `senha`, `chave_api`, `email`, `numero_cartão`, etc. Usar essa abordagem garantirá que os campos de informação especificados nunca saiam do seu perímetro de segurança.

Você pode aplicar uma regra especial chamada **Mascarar dados sensíveis** para especificar quais campos (no URI da solicitação, cabeçalhos ou corpo) devem ser omitidos ao enviar informações de ataque de um nó de filtragem para a Wallarm Cloud. Para obter informações adicionais sobre o mascaramento de dados, consulte o [documento](../user-guides/rules/sensitive-data-rule.md) ou entre em contato com a [equipe de suporte da Wallarm](mailto:request@wallarm.com).