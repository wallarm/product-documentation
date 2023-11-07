# Recomendações para Configuração do Nó de Filtragem para Ambientes Separados

Você já aprendeu [como os nós de filtragem Wallarm funcionam em ambientes separados](how-wallarm-in-separated-environments-works.md). Para que os nós funcionem conforme descrito, aprenda as recomendações sobre a configuração de nós em ambientes separados a partir deste artigo.

## Processo Inicial de Implantação da Proteção Wallarm

Se você realizar o lançamento inicial da proteção Wallarm para ambientes, recomenda-se que você use a seguinte abordagem (você pode ajustá-la conforme necessário):

1. Saiba sobre as opções disponíveis de implantação do nó Wallarm [aqui](../../../installation/supported-deployment-options.md).
2. Se necessário, saiba sobre as opções disponíveis para gerenciar separadamente a configuração do nó de filtragem para seus ambientes. Você pode encontrar essa informação [aqui](how-wallarm-in-separated-environments-works.md#relevant-wallarm-features).
3. Implante nós de filtragem Wallarm em seus ambientes não produtivos com o modo de filtragem definido para `monitoramento`.
4. Saiba como operar, dimensionar e monitorar a solução Wallarm; confirme a estabilidade do novo componente de rede.
5. Implante nós de filtragem Wallarm em seu ambiente de produção com o modo de filtragem definido para `monitoramento`.
6. Implemente o gerenciamento de configuração adequado e os processos de monitoramento para o novo componente Wallarm.
7. Mantenha o fluxo de tráfego através dos nós de filtragem em todos os seus ambientes, incluindo testes e produção, por 7-14 dias para dar tempo ao backend baseado na nuvem Wallarm para aprender sobre o seu aplicativo.
8. Ative o modo de filtragem `bloqueio` em todos os seus ambientes não produtivos e use testes automatizados ou manuais para confirmar que o aplicativo protegido está funcionando conforme o esperado.
9. Ative o modo de filtragem `bloqueio` no ambiente de produção. Usando os métodos disponíveis, confirme que o aplicativo está funcionando conforme o esperado.

!!! info
    Para configurar o modo de filtragem, use estas [instruções](../../configure-wallarm-mode.md).

## Implantação Gradual de Novas Alterações do Nó Wallarm

De tempos em tempos, podem ser necessárias mudanças em sua infraestrutura Wallarm existente. Dependendo da política de gerenciamento de mudanças de sua organização, você pode ser solicitado a testar todas as mudanças potencialmente arriscadas em um ambiente não produtivo e, em seguida, aplicar as mudanças no seu ambiente de produção.

As seguintes abordagens são recomendadas para testar e alterar gradualmente a configuração de diferentes componentes e recursos Wallarm:
* [Configuração de baixo nível dos nós de filtragem Wallarm em todos os formatos](#low-level-onfiguration-of-wallarm-filtering-nodes-in-all-form-factors)
* [Configuração das regras do nó Wallarm](#configuration-of-wallarm-node-rules)

### Configuração de Baixo Nível dos Nós de Filtragem Wallarm em Todos os Formatos

A configuração de baixo nível dos nós de filtragem é realizada via variáveis de ambiente Docker, arquivo de configuração NGINX fornecido, parâmetros do controlador Ingress Kubernetes, etc. A forma de configuração depende da [opção de implantação](../../../installation/supported-deployment-options.md).

A configuração de baixo nível pode ser facilmente gerenciada separadamente para diferentes ambientes do cliente usando seus processos existentes de gerenciamento de mudanças para recursos de infraestrutura.

### Configuração das Regras do Nó Wallarm

Como cada registro de regra pode ser associado a um [conjunto diferente](how-wallarm-in-separated-environments-works.md#resource-identification) de IDs de instâncias de aplicativo ou cabeçalhos de solicitação `HOST`, as seguintes opções são recomendadas:

* Primeiro aplique uma nova configuração a um ambiente de teste ou desenvolvimento, verifique a funcionalidade e, em seguida, aplique a mudança para o ambiente de produção.
* Use a regra `Criar indicador de ataque baseado em regexp` no modo `Experimental`. Este modo permite que a regra seja implantada diretamente no ambiente de produção sem o risco de bloquear erroneamente solicitações válidas do usuário final.

    ![Criando regra experimental](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/define-attack-experimental.png)

* Use a regra `Definir modo de filtragem` para controlar o modo de filtragem Wallarm para ambientes e solicitações específicos. Esta regra oferece flexibilidade adicional na forma como a proteção Wallarm pode ser implantada gradualmente para proteger novos endpoints e outros recursos em diferentes ambientes. Por padrão, o valor de [`wallarm_mode`](../../configure-parameters-en.md#wallarm_mode) é usado dependendo da configuração de [`wallarm_mode_allow_override`](../../configure-parameters-en.md#wallarm_mode_allow_override).

    ![Criando uma regra para substituir o modo de filtragem](../../../images/admin-guides/configuration-guides/waf-in-separate-environments/rule-overwrite-filtering-mode.png)