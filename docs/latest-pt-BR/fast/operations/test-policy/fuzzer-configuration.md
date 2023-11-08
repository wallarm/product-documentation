[img-enable-fuzzer]:            ../../../images/fast/operations/common/test-policy/fuzzer/fuzzer-slider.png
[img-manipulate-items]:         ../../../images/fast/operations/common/test-policy/fuzzer/manipulate-fuzzer-items.png
[img-anomaly-condition]:        ../../../images/fast/operations/common/test-policy/fuzzer/anomaly-condition.png
[img-not-anomaly-condition]:    ../../../images/fast/operations/common/test-policy/fuzzer/not-anomaly-condition.png
[img-stop-condition]:           ../../../images/fast/operations/common/test-policy/fuzzer/stop-condition.png

[link-ruby-regexp]:             http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html      

[anchor-payloads-section]:      #the-payloads-section
[anchor-anomaly-section]:       #the-consider-result-an-anomaly-if-response-section
[anchor-not-anomaly-section]:   #the-consider-result-not-an-anomaly-if-response-section
[anchor-stop-section]:          #the-stop-fuzzing-if-response-section

# Configuração do Fuzzer

!!! info "Habilitando o fuzzer"
    O fuzzer é desativado por padrão. Você pode ativá-lo na seção **Fuzz testing** do editor de políticas da sua conta Wallarm:
    
    ![Ativando fuzzer][img-enable-fuzzer]

    O alternador do fuzzer e o alternador **Use only custom DSL** na seção **Attacks to test** são mutuamente exclusivos.

    A política não suporta um fuzzer por padrão.

As configurações relacionadas ao fuzzer e à detecção de anomalias estão colocadas na seção **Fuzz testing** do editor de políticas.

Para testar a aplicação quanto a anomalias, o FAST analisa a resposta do aplicativo de destino a uma solicitação com uma carga útil contendo bytes anômalos. Dependendo das condições especificadas, a solicitação enviada pelo FAST será reconhecida como anômala ou não.

O editor de políticas em sua conta Wallarm permite que você:

* adicione cargas úteis clicando nos botões **Adicionar carga útil** e **Adicionar outra carga útil**
* adicione condições que afetam a operação do fuzzer clicando nos botões **Adicionar condição** e **Adicionar outra condição**
* delete cargas úteis e condições criadas clicando no símbolo «—» próximo a elas

![Gestão de carga útil e condição][img-manipulate-items]

Ao configurar condições, você pode usar os seguintes parâmetros:

* **Status**: código de resposta HTTPS
* **Tamanho**: comprimento da resposta em bytes
* **Tempo**: tempo de resposta em segundos
* **Diferença de tamanho**: diferença no comprimento da resposta à solicitação de linha de base original e FAST em bytes
* **Diferença de tempo**: diferença entre o tempo de resposta à solicitação de linha de base original e FAST em segundos
* **Diferença de DOM**: diferença no número de elementos DOM nas solicitações de linha de base original e FAST
* **Corpo**: [Expressão regular Ruby][link-ruby-regexp]. A condição é atendida se o corpo da resposta atender a esta expressão regular

Na seção [**Parar de fazer fuzzing se a resposta**][anchor-stop-section], os seguintes parâmetros também podem ser configurados:

* **Anomalias**: o número de anomalias detectadas
* **Erros de tempo limite**: o número de vezes em que não foi recebida resposta do servidor

Usando uma combinação desses parâmetros, você pode configurar as condições necessárias que afetam as operações do fuzzer (veja abaixo).

## Seção "Cargas Úteis"

Essa seção é usada para configurar uma ou mais cargas úteis.

Durante a inserção da carga útil, são especificados os seguintes dados:

* o tamanho da carga de 1 a 255 bytes
* em que valor a carga útil será inserida: o início, posição aleatória ou final

Durante a substituição da carga útil, são especificados os seguintes dados:

* o método de substituição: substituir um segmento aleatório no valor - primeiros bytes `M`, últimos bytes `M`, ou string inteira
* o tamanho da carga `M` de 1 a 255 bytes


## Seção "Considerar Resultado uma Anomalia se Resposta"

Se a resposta do aplicativo atender a todas as condições configuradas na seção **Considerar resultado uma anomalia se resposta**, então uma anomalia é considerada encontrada.

**Exemplo:**

Se o corpo da resposta atende à expressão regular `.*SQLITE_ERROR.*`, então considere que a solicitação FAST enviada causou uma anomalia:

![Exemplo de condição][img-anomaly-condition]

!!! info "Comportamento padrão"
    Se não houver condições configuradas nesta seção, o fuzzer detectará a resposta do servidor com parâmetros anormalmente diferentes da resposta à requisição de baseline. Por exemplo, um longo tempo de resposta do servidor pode ser uma razão para detectar a resposta do servidor como anômala.

## Seção "Considerar o resultado não uma anomalia se resposta"

Se a resposta do aplicativo atender a todas as condições configuradas na seção **Considerar resultado não uma anomalia se resposta**, então uma anomalia é considerada não localizada.

**Exemplo:**

Se o código de resposta for inferior a `500`, então considere que a solicitação FAST enviada não causou uma anomalia:

![Exemplo de condição][img-not-anomaly-condition]

## A seção "Pare de fazer fuzzing se resposta"

Se a resposta do aplicativo, o número de anomalias detectadas ou o número de erros de tempo limite satisfizer todas as condições configuradas na seção **Pare de fazer fuzzing se resposta**, então o fuzzer para de procurar por anomalias.

**Exemplo:**

O fuzzing será interrompido se mais de duas anomalias forem detectadas. Em cada anomalia, você pode ter qualquer número de bytes anômalos individuais que não seja igual a dois.

![Exemplo de condição][img-stop-condition]

!!! info "Comportamento padrão"
    Se as condições para parar o processo de fuzzing não estiverem configuradas, o fuzzer verificará todos os 255 bytes anômalos. Se uma anomalia for detectada, cada byte individual na carga útil será interrompido.
