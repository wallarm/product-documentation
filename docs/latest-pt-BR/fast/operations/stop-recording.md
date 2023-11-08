[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


# Parando o Processo de Gravação

!!! info "Dados necessários"
    Para parar a gravação via API, os seguintes dados são necessários:
    
    * um token
    * um identificador de execução de teste

    Para parar a gravação via interface web, você precisa de uma conta Wallarm.

    Você pode obter informações detalhadas sobre execução de teste e token [aqui][doc-about-tr-token].
    
    Os seguintes valores são usados como valores de exemplo neste documento:
    
    * `token_Qwe12345` como token.
    * `tr_1234` como identificador de uma execução de teste.

A necessidade de parar a gravação de solicitações de linha de base é descrita pelo [link][link-stop-explained]. 

## Parando o Processo de Gravação via API

Para parar o processo de gravação, envie a solicitação POST para a URL `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop`:

--8<-- "../include-pt-BR/fast/operations/api-stop-recording.md"

Se a solicitação ao servidor API for bem-sucedida, você receberá a resposta do servidor. A resposta fornece informações úteis, incluindo:
* o estado do processo de gravação (o valor do parâmetro `recording`).
* o identificador do registro de teste correspondente (o parâmetro `test_record_id`).

Se o valor do parâmetro for `false`, então a parada é bem-sucedida.

Se a parada for bem-sucedida, é possível usar o registro de teste com o identificador `test_record_id` para [copiar execuções de teste][doc-testrun-copying-api].

## Parando o Processo de Gravação via Interface Web 

Para parar o processo de gravação através da interface web, por favor, siga os passos abaixo:

1. Acesse sua conta Wallarm > **Test runs** por [este link](https://my.wallarm.com/testing/testruns) para a nuvem EU ou por [este link](https://us1.my.wallarm.com/testing/testruns) para a nuvem US.

2. Selecione a execução de teste para parar a gravação e abra o menu de ação.

3. Selecione **Parar gravação**.

    ![Parando a gravação via interface web][img-stop-recording-item]

O indicador REQ à esquerda da coluna **Baseline req.** será desligado quando a gravação for interrompida.

O ID do registro de teste é exibido na coluna **Nome do registro de teste/ID do registro de teste**.

Se necessário, você pode [copiar esta execução de teste][doc-testrun-copying-gui] usando a interface web e o novo teste reutilizará o registro de teste mencionado.
