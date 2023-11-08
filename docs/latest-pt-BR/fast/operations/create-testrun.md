[img-test-run-creation]:            ../../images/fast/operations/common/create-testrun/test-run-create.png
[img-testrun-adv-settings]:         ../../images/fast/operations/common/create-testrun/test-run-settings.png

[doc-token-information]:    internals.md#token
[doc-state-description]:    check-testrun-status.md
[doc-copying-testrun]:      copy-testrun.md
[doc-testrecord]:           internals.md#test-record

[link-stopping-recording-chapter]:  stop-recording.md
[link-create-policy]:               test-policy/general.md
[link-create-node]:                 create-node.md
[doc-inactivity-timeout]:           internals.md#test-run

#   Criando uma Execução de Teste

!!! info "Dados necessários"
    Para criar uma execução de teste por meio dos métodos da API, você precisa de um token.
    
    Para criar uma execução de teste via interface web, você precisa de uma conta Wallarm.
    
    Você pode obter informações detalhadas sobre o token [aqui][doc-token-information].
    
    O valor `token_Qwe12345` é utilizado como um exemplo de token neste documento.

Quando uma execução de teste está sendo criada, um novo [registro de teste][doc-testrecord] também é criado.

Este método de criação de execução de teste deve ser usado se for necessário testar uma aplicação alvo junto com a gravação de solicitações básicas.

## Criando uma Execução de Teste via API

Para criar uma execução de teste, envie a solicitação POST para a URL `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include-pt-BR/fast/operations/api-create-testrun.md"

Se a solicitação ao servidor da API for bem-sucedida, será apresentada a resposta do servidor. A resposta fornece informações úteis, incluindo:

1.  `id`: o identificador de uma nova execução de teste (por exemplo, `tr_1234`).
    
    Você precisará do valor do parâmetro id para realizar as seguintes ações, necessárias para integrar o FAST ao CI/CD:
    
    1.  Verificando se o nó FAST iniciou o processo de gravação.  
    2.  Parando o processo de gravação de solicitações básicas.
    3.  Aguardando pelo término dos testes de segurança do FAST.
    
2.  `state`: o estado da execução de teste.
    
    Uma nova execução de teste está no estado `running`.
    Uma descrição completa de todos os valores do parâmetro `state` pode ser encontrada [aqui][doc-state-description].
    
3.  `test_record_id`: o identificador de um novo registro de teste (por exemplo, `rec_0001`). Todas as solicitações básicas serão colocadas neste registro de teste.    

##  Criando uma Execução de Teste via Interface Web

Para criar uma execução de teste por meio da interface da sua conta Wallarm, siga as etapas abaixo:

1. Acesse a sua conta Wallarm > **Execuções de teste** por [este link](https://my.wallarm.com/testing/testruns) para a nuvem da UE ou por [este link](https://us1.my.wallarm.com/testing/testruns) para a nuvem dos EUA.

2. Clique no botão **Criar execução de teste**.

3. Insira o nome da sua execução de teste.

4. Selecione a política de teste no menu suspenso **Política de teste**. Para criar uma nova política de teste, siga estas [instruções][link-create-policy]. Além disso, você pode usar a política padrão.

5. Selecione o nó FAST no menu suspenso **Nó**. Para criar um nó FAST, siga estas [instruções][link-create-node].

    ![Criando execução de teste][img-test-run-creation]

6. Adicione **Configurações avançadas** se necessário. Este bloco de configurações inclui os seguintes pontos:

--8<-- "../include-pt-BR/fast/test-run-adv-settings.md"

    ![Configurações avançadas da execução de teste][img-testrun-adv-settings]

7.  Clique no botão **Criar e executar**.

## Reutilizando o registro de teste

Quando as solicitações são enviadas de uma fonte de solicitações para a aplicação alvo, e o [processo de gravação é interrompido][link-stopping-recording-chapter], é possível [reutilizar o registro de teste][doc-copying-testrun] com outras execuções de teste.