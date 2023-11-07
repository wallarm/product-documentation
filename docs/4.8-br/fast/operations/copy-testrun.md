[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   Copiando uma Execução de Teste

!!! info "Dados Necessários"
    Para copiar uma execução de teste através de uma chamada de API, as seguintes informações são necessárias:
    
    * um token
    * um identificador de registro de teste existente

    Para copiar uma execução de teste via interface web, é necessário ter uma conta Wallarm.

    Você pode obter informações detalhadas sobre token e registros de teste [aqui][doc-tr-information].
    
    Os seguintes valores são usados como exemplos neste documento:

    * `token_Qwe12345` como um token.
    * `rec_0001` como um registro de teste.

Quando uma execução de teste é copiada, um [registro de teste][doc-testrecord] existente é reutilizado.

Este método de criação de execução de teste deve ser usado se for necessário testar uma aplicação alvo usando solicitações iniciais já gravadas.


##  Regras para Copiar uma Execução de Teste

As coisas a serem levadas em consideração ao copiar uma execução de teste são:
* Você pode especificar qualquer política de teste a ser usada por uma execução de teste copiada. Esta política pode ser diferente da política usada na execução de teste original.
* Você pode copiar execuções de teste nos seguintes estados: `failed`, `interrupted`, `passed`, `paused`, `running`. As descrições desses estados de execução de teste são fornecidas [aqui][doc-state-description]. 
* Não é possível copiar uma execução de teste usando um registro de teste vazio sem solicitações iniciais nele.
* Se algumas solicitações iniciais estão sendo gravadas em um registro de teste, esse registro não pode ser usado para copiar uma execução de teste.
 
    Se você tentar copiar uma execução de teste baseada em um registro de teste incompleto, receberá o código de erro `400` (`Bad Request`) do servidor de API e uma mensagem de erro semelhante a esta abaixo:

    ```
    {
        "status": 400,
        "body": {
            "test_record_id": {
            "error": "not_ready_for_cloning",
            "value": rec_0001
            }
        }
    }
    ```
    
    Não é possível copiar uma execução de teste da interface web a menos que o processo de gravação tenha sido interrompido.

##  Copiando uma Execução de Teste via API

Para copiar e executar uma execução de teste, envie a solicitação POST para a URL `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-copy-testrun.md"

Se o pedido ao servidor da API for bem sucedido, você receberá a resposta do servidor. A resposta fornece informações úteis, incluindo:

1.  `id`: o identificador de uma cópia da execução de teste (por exemplo, `tr_1234`).
    
    Você precisará do valor do parâmetro `id` para controlar o status de execução do teste.
    
2.  `state`: o estado da execução de teste.
    
    Uma nova execução de teste copiada está no estado `running`.
    
    Uma descrição completa de todos os valores do parâmetro `state` pode ser encontrada [aqui][doc-state-description].

    
##  Copiando uma Execução de Teste via Interface Web    

Para copiar e executar uma execução de teste através da interface web do portal Wallarm:
1.  Faça login no portal com sua conta Wallarm, então vá para a aba “Test runs”.
2.  Selecione uma execução de teste para copiar, depois abra o menu de ação à direita da execução de teste.
3.  Selecione a entrada do menu “Criar execução de teste similar”. 

    ![A entrada de menu “Criar execução de teste similar”][img-similar-tr-item]

4.  Selecione os seguintes itens na barra lateral que se abre:
    * o nome da cópia da execução de teste
    * a política a ser usada com a cópia da execução de teste
    * o nó no qual a cópia da execução de teste será executada
    
    ![A barra lateral “Execução de Teste”][img-similar-tr-sidebar]
    
    Você pode configurar configurações adicionais selecionando “Configurações avançadas” (se necessário):
    
--8<-- "../include/fast/test-run-adv-settings.md"
    
5.  Certifique-se de que a opção “Use baselines de `<o nome do registro de teste para reutilizar>`” esteja marcada.

    !!! info "Reutilizando um Registro de Teste"
        Note que é o nome do registro de teste que está exibido na opção, não o nome da execução de teste.
        
        O nome do registro de teste é frequentemente omitido: por exemplo, se [uma execução de teste é criada][doc-create-testrun] sem o parâmetro `test_record_name` especificado, então o nome do registro de teste é o mesmo do nome da execução do teste.
        
        A figura acima mostra o diálogo de cópia que menciona um registro de teste onde o nome não é equivalente ao nome da execução de teste que fez uso desse registro de teste no passado (o registro de teste `MY TEST RECORD` foi usado pela execução de teste `DEMO TEST RUN`). 

6.  Execute a execução de teste clicando no botão “Criar e executar”.     
