[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md#how-test-policy-influences-the-request-processing

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# Usando as Extensões FAST

## Conectando Extensões

Para usar as extensões criadas, você precisa conectá-las ao nó FAST.

Você pode fazer isso das seguintes maneiras:

* Coloque as extensões em um diretório e monte este diretório no contêiner Docker do nó FAST usando a opção `-v` do comando `docker run`.
    
    ```
    sudo docker run --name <nome do contêiner> --env-file=<arquivo com variáveis de ambiente> -v <diretório com extensões>:/opt/custom_extensions -p <porta de destino>:8080 wallarm/fast
    ```
    
    **Exemplo:**
    
    Execute o comando abaixo para lançar o nó FAST no contêiner Docker com os seguintes argumentos:

    1.  O nome do contêiner: `fast-node`.
    2.  O arquivo com variáveis de ambiente: `/home/user/fast.cfg`.
    3.  O caminho para o diretório de extensões FAST: `/home/user/extensions`.
    4.  A porta para a qual a porta `8080` do contêiner é publicada: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* Coloque as extensões em um repositório Git público e defina a variável de ambiente, que se refere ao repositório necessário, no contêiner Docker do nó FAST.
    
    Para fazer isso, execute o seguinte:
    
    1.  Adicione a variável `GIT_EXTENSIONS` ao arquivo que contém as variáveis de ambiente.

        **Exemplo:**
        
        Se suas extensões estão no repositório Git `https://github.com/wallarm/fast-detects`, defina a seguinte variável de ambiente:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  Execute o contêiner Docker do nó FAST usando o arquivo que contém as variáveis de ambiente, conforme segue:
        
        ```
        sudo docker run --name <nome do contêiner> --env-file=<arquivo com variáveis de ambiente> -p <porta de destino>:8080 wallarm/fast
        ```
        
        **Exemplo:**
        
        Execute o comando abaixo para lançar o nó FAST no contêiner Docker com os seguintes argumentos:

        1.  O nome do contêiner: `fast-node`.
        2.  O arquivo com variáveis de ambiente: `/home/user/fast.cfg`.
        3.  A porta para a qual a porta `8080` do contêiner é publicada: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include-pt-BR/fast/wallarm-api-host-note.md"

Se o nó FAST for iniciado com sucesso, ele gravará no console a seguinte saída, que informa sobre a conexão bem-sucedida com a Nuvem Wallarm e o número de extensões carregadas:

--8<-- "../include-pt-BR/fast/console-include/dsl/fast-node-run-ok.md"

Se ocorrer um erro durante a inicialização do nó, as informações do erro serão gravadas no console. A mensagem sobre o erro de sintaxe de extensão é mostrada no seguinte exemplo:

--8<-- "../include-pt-BR/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "Requisitos de localização das extensões"
    As extensões dos diretórios aninhados não serão conectadas (por exemplo, se a extensão estiver colocada no diretório `extensions/level-2/`). Dependendo do método de conexão escolhido, as extensões devem ser colocadas tanto na raiz do diretório que é montado no contêiner Docker do nó FAST quanto na raiz do repositório Git.

## Verificando a Operação das Extensões

Para verificar a operação das extensões [`mod-extension.yaml`][doc-mod-extension] e [`non-mod-extension.yaml`][doc-non-mod-extension] que foram criadas anteriormente, execute as seguintes ações:

1.  Conecte as extensões ao nó FAST, seguindo [os passos mencionados acima][anchor-connect-extension].

2.  Crie a política de teste. Esta será utilizada por todas as extensões FAST que estão conectadas ao nó FAST. Informações detalhadas sobre como as políticas de teste funcionam estão localizadas [aqui][doc-testpolicy].

    Lembre-se de que a extensão modificadora conectada altera o ponto `POST_JSON_DOC_HASH_email_value` em uma solicitação de linha de base, e a extensão não modificadora exige as permissões para trabalhar com o ponto `URI`.
    
    Portanto, para fazer ambas as extensões executarem durante uma única execução de teste, uma política de teste deve permitir o trabalho com:
    
    * parâmetros POST
    * o parâmetro URI
    
    ![Assistente de política de teste, guia “Pontos de inserção”][img-test-policy-insertion-points]
    
    Além disso, as extensões verificam se o aplicativo é vulnerável a um ataque SQLi; portanto, pode ser conveniente verificar o aplicativo para outras vulnerabilidades com os detecções do Wallarm FAST (por exemplo, RCE). Isso ajudará você a confirmar que a vulnerabilidade SQLi está sendo detectada com as extensões criadas em vez das detecções integradas FAST. 
    
    ![Assistente de política de teste, guia “Ataques para teste”][img-test-policy-attacks]
    
    A política de teste resultante deve parecer com:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  Crie uma execução de teste para o seu nó FAST com base na política de teste criada.
    
    ![Execução de teste][img-test-run]

4.  Aguarde até que o nó FAST escreva uma mensagem informativa no console semelhante a seguinte: `Recording baselines for TestRun#`. Isso significa que o nó FAST está pronto para gravar as solicitações de linha de base.<br>
--8<-- "../include-pt-BR/fast/console-include/dsl/fast-node-recording.md"

5.  Crie e envie uma solicitação POST com parâmetros aleatórios para a página de login do OWASP Juice Shop através do nó FAST, como mostrado no exemplo a seguir:
    
    ```
    curl --proxy http://<endereço IP do nó FAST> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    Você pode usar `curl` ou outros softwares para enviar a solicitação.
    
    !!! info "Parando o processo de gravação da solicitação de linha de base"
        Após enviar a solicitação de linha de base, é recomendável interromper o processo de gravação. Este procedimento é descrito [aqui][link-stop-recording].

6.  Na saída do console do nó FAST, você verá como:  

    * o aplicativo de destino é testado usando as detecções FAST integradas,
    * a extensão FAST modificadora executa os parâmetros POST na solicitação de linha de base, e
    * a extensão FAST não modificadora executa o parâmetro URI na solicitação de linha de base.
    --8<-- "../include-pt-BR/fast/console-include/dsl/fast-node-working.md"

    Você pode ver o log completo de processamento de solicitações abrindo as informações de execução de teste na interface web do Wallarm e clicando no link “Detalhes”.
    
    ![Informações detalhadas da execução de teste][img-testrun-details]
    
    ![Log completo de processamento de solicitações][img-log]

7.  Você também pode ver informações sobre as vulnerabilidades detectadas ao clicar no link que contém o número de problemas detectados, por exemplo, “2 problemas”. A página “Vulnerabilidades” será aberta.

    ![Vulnerabilidades na interface web do Wallarm][img-vulns]
    
    As colunas “Risco”, “Tipo” e “Título” conterão os valores que foram especificados na seção `meta-info` das extensões para aquelas vulnerabilidades que foram detectadas com a ajuda das extensões FAST.

8.  Você pode clicar em uma vulnerabilidade para visualizar informações detalhadas sobre ela, incluindo sua descrição (da seção `meta-info` do arquivo de extensão) e um exemplo da solicitação que a explora.

    Exemplo de informações sobre uma vulnerabilidade (detectada com a extensão modificadora):
    
    ![Informações detalhadas da vulnerabilidade][img-vuln-details-mod]
