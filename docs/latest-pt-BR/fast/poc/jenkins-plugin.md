[fast-node-token]:              ../operations/create-node.md
[fast-ci-mode-record]:          ci-mode-recording.md#environment-variables-in-recording-mode

[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

[jenkins-plugin-wallarm-fast]:   https://plugins.jenkins.io/wallarm-fast/

[jenkins-plugin-install]:       ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-install.png
[jenkins-plugin-record-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-record-params.png
[jenkins-plugin-playback-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-playback-params.png
[jenkins-manage-plugin]:        https://jenkins.io/doc/book/managing/plugins/
[fast-example-jenkins-plugin-result]:  ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-result.png
[fast-jenkins-cimode]:          examples/jenkins-cimode.md

# Integração do plugin Wallarm FAST com o Jenkins

!!! warning "Compatibilidade"
    Note que o plugin Wallarm FAST só funciona com projetos Freestyle do Jenkins.
    
    Se o seu projeto for do tipo Pipeline, então veja o [exemplo de integração com o Jenkins por meio do nó FAST][fast-jenkins-cimode].

## Passo 1: Instalando o Plugin

Instale o [plugin Wallarm FAST][jenkins-plugin-wallarm-fast] no projeto Jenkins usando o Gerenciador de Plugins. Há mais informações detalhadas sobre gerenciamento de plugins disponíveis na [documentação oficial do Jenkins][jenkins-manage-plugin].

![Instalação do plugin Wallarm FAST][jenkins-plugin-install]

Se houver problemas durante a instalação, construa o plugin manualmente.

??? info "Construção manual do plugin Wallarm FAST"
    Para construir o plugin Wallarm FAST manualmente, siga os passos abaixo:

    1. Certifique-se de que o [Maven](https://maven.apache.org/install.html) CLI está instalado.
    2. Execute os seguintes comandos:
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        Após a execução bem-sucedida dos comandos, o arquivo de plugin `wallarm-fast.hpi` será gerado no diretório `target`.

    3. Instale o plugin `wallarm-fast.hpi` usando as [instruções do Jenkins](https://jenkins.io/doc/book/managing/plugins/#advanced-installation).

## Passo 2: Adicionando as Etapas de Gravação e Teste

!!! info "Fluxo de trabalho configurado"
    As próximas instruções vão exigir que o fluxo de trabalho Jenkins esteja configurado de acordo com um dos seguintes pontos:

    * A automação de teste deve ser implementada. Neste caso, as etapas de [gravação de solicitação](#adicionando-a-etapa-de-gravação-de-solicitação) e [teste de segurança](#adicionando-a-etapa-de-teste-de-segurança) serão adicionadas.
    * A série de solicitações base deve ser gravada. Neste caso, a etapa de [teste de segurança](#adicionando-a-etapa-de-teste-de-segurança) será adicionada.

### Adicionando a Etapa de Gravação de Solicitações

Para adicionar a etapa de gravação de solicitações, selecione o modo `Gravar basicos` na **aba Construção** e configure as variáveis descritas abaixo. A etapa de gravação de solicitação deve ser adicionada **antes da etapa de teste de aplicativo automatizado**.

!!! warning "Network"
    Antes de gravar solicitações, certifique-se de que o plugin FAST e a ferramenta para teste automatizado estão na mesma rede.

??? info "Variáveis no modo de gravação"

    | Variable              | Value  | Required   |
    |--------------------   | --------  | -----------  |
    | `Token de API Wallarm`     | Um token da nuvem Wallarm. | Sim |
    | `Hospedeiro API Wallarm`      | O endereço do servidor de API Wallarm. <br>Valores permitidos: <br>`us1.api.wallarm.com` para o servidor na nuvem Wallarm EUA e <br>`api.wallarm.com` para o servidor na nuvem Wallarm EU.<br>O valor padrão é `us1.api.wallarm.com`. | Não |
    | `Hospedeiro da aplicação`      | O endereço da aplicação de teste. O valor pode ser um endereço IP ou um nome de domínio. | Sim |
    | `Porta da aplicação`      | A porta da aplicação de teste. O valor padrão é 8080. | Não |
    | `Porta Fast`   | A porta do nó FAST. | Sim |
    | `Tempo de inatividade`    | Se nenhuma solicitação base chegar ao nó FAST dentro desse intervalo, então o processo de gravação é parado junto com o nó FAST.<br>Intervalo de valores permitidos: de 1 segundo a 1 semana.<br>O valor deve ser passado em segundos.<br>Valor padrão: 600 segundos (10 minutos). | Não |
    | `Nome Fast`             | O nome do recipiente Docker do nó FAST. | Não |
    | `Versão Wallarm`       | A versão do nó FAST usado. | Não |
    | `Rede Docker local`  | A rede Docker onde o nó FAST é executado. | Não |
    | `IP Docker local`       | O endereço IP que será atribuído ao nó FAST em execução. | Não |
    | `Sem sudo`          | Se executar os comandos do nó FAST com os direitos do usuário que executou o nó FAST. Por padrão, comandos são executados com direitos de superusuário (via sudo). | Não |

**Exemplo de plugin configurado para gravação de teste:**

![Exemplo de configuração do plugin para gravar solicitações][jenkins-plugin-record-params]

Em segundo lugar, atualize a etapa de teste automatizado adicionando o nó FAST como um proxy.

O plugin FAST vai parar automaticamente a gravação de solicitações quando o teste for concluído.

### Adicionando a Etapa de Teste de Segurança

Para adicionar a etapa de teste de segurança, selecione o modo `Reprodução de base` na **aba Construção** e configure as variáveis descritas abaixo. 

Note que a aplicação deve já estar iniciada e disponível para teste **antes de executar o teste de segurança**.

!!! warning "Network"
    Antes do teste de segurança, certifique-se de que o plugin FAST e a aplicação estão na mesma rede.

??? info "Variáveis no modo de teste"

    | Variable              | Value  | Required   |
    |--------------------   | --------  | -----------  |
    | `Token de API Wallarm`     | Um token da nuvem Wallarm. | Sim |
    | `Hospedeiro API Wallarm`    | O endereço do servidor de API Wallarm. <br>Valores permitidos: <br>`us1.api.wallarm.com` para o servidor na nuvem Wallarm EUA e <br>`api.wallarm.com` para o servidor na nuvem Wallarm EU<br>O valor padrão é `us1.api.wallarm.com`. | Não |
    | `Hospedeiro da aplicação`      | O endereço da aplicação de teste. O valor pode ser um endereço IP ou um nome de domínio. | Sim |
    | `Porta da aplicação`      | A porta da aplicação de teste. O valor padrão é 8080. | Não |
    | `ID da política`   | [ID de política de teste](../operations/test-policy/overview.md).<br> O valor padrão é `0`-`Política de Teste Padrão`. | Não |
    | `ID do registro do teste`    | ID de registro de teste. Corresponde à [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>O valor padrão é o último registro de teste criado pelo nó FAST usado.| Não |
    | `RPS da execução de teste`   | Um limite no número de solicitações de teste (*RPS*, *solicitações por segundo*) para serem enviadas para a aplicação alvo.<br>Valor mínimo: `1`.<br>Valor máximo: `500`.<br>Valor padrão: `null` (RPS é ilimitado).| Não |
    | `Nome da execução de teste`   | O nome da execução de teste.<br>Por padrão, o valor será gerado automaticamente da data de criação da execução de teste.| Não |
    | `Descrição da execução de teste`   | A descrição da execução de teste.| Não |
    | `Parar no primeiro erro`   | Se parar o teste quando ocorrer um erro. | Não |
    | `Falhar na construção`   | Se terminar a construção com um erro quando vulnerabilidades são encontradas durante o teste de segurança. | Não |
    | `Excluir`   | A lista de extensões de arquivo para excluir do teste de segurança.<br>Para dividir extensões, o símbolo &#448; é usado.<br> Por padrão, não há exceções.| Não |
    | `Nome Fast`             | O nome do recipiente Docker do nó FAST. | Não |
    | `Versão Wallarm`       | A versão do nó FAST usado. | Não |
    | `Rede Docker local`  | A rede Docker onde o nó FAST é executado. | Não |
    | `IP Docker local`       | O endereço IP que será atribuído ao nó FAST em execução. | Não |
    | `Sem sudo`          | Se executar os comandos do nó FAST com os direitos do usuário que executou o nó FAST. Por padrão, comandos são executados com direitos de superusuário (via sudo). | Não |

    !!! warning "Execução do nó FAST"
        Note que se você adicionar no fluxo de trabalho tanto a etapa de gravação de solicitações quanto a etapa de teste de segurança, então os nomes dos recipientes Docker do nó FAST devem ser diferentes.

**Exemplo de plugin configurado para teste de segurança:**

![Exemplo de configuração do plugin para teste de segurança][jenkins-plugin-playback-params]

## Passo 3: Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido na interface do Jenkins.

![O resultado da execução do plugin FAST][fast-example-jenkins-plugin-result]

## Mais Exemplos

Você pode encontrar exemplos de integração do FAST ao fluxo de trabalho do CircleCI em nosso [GitHub][fast-examples-github].

!!! info "Dúvidas posteriores"
    Se você tiver perguntas relacionadas à integração do FAST, por favor [entre em contato conosco][mail-to-us].