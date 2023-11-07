[link-points]:          points/intro.md
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-ext-logic]:       logic.md

[img-modify]:           ../../images/fast/dsl/common/phases/modify.png

# A Fase de Modificação

!!! info "Escopo da fase"
   Esta fase é usada em uma extensão de modificação e é opcional para sua operação (a seção `modify` pode estar ausente ou presente no arquivo YAML).

   Esta fase deve estar ausente do arquivo YAML da extensão não modificadora.
   
   Leia sobre os tipos de extensão em detalhes [aqui][link-ext-logic].

!!! info "Sintaxe de descrição dos elementos da solicitação"
   Ao criar uma extensão FAST, você precisa entender a estrutura da solicitação HTTP enviada para a aplicação e a da resposta HTTP recebida da aplicação para descrever corretamente os elementos da solicitação com os quais você precisa trabalhar usando os pontos.

   Para ver informações detalhadas, prossiga para este [link][link-points].
   
Esta fase modifica os valores dos parâmetros de uma solicitação baseline, se necessário. Note que você não pode adicionar um novo elemento que está ausente da solicitação baseline usando a fase de Modificação. Por exemplo, você não pode adicionar o cabeçalho HTTP `Cookie` se a solicitação baseline não o contém.

A seção `modify` no arquivo YAML da extensão contém uma matriz de pares `<chave: valor>`. Cada par descreve um certo elemento de solicitação (a chave) e os dados que devem ser inseridos neste elemento (o valor). A chave pode conter expressões regulares no [formato de expressões regulares Ruby][link-ruby-regexp]. Você não pode aplicar expressões regulares ao valor da chave.

Na fase de Modificação, você pode atribuir novos valores ao elemento ou excluir os dados do elemento.

* Se o valor da chave for definido, esse valor será atribuído ao elemento de solicitação baseline correspondente. Se não houver nenhum elemento correspondente à chave na solicitação baseline, nenhuma nova inserção de elemento será realizada.
    
    ??? info "Exemplo 1"
        `'HEADER_COOKIE_value': 'C=qwerty123'`

        ![Fase de modificação](../../images/fast/dsl/en/phases/modify.png)

* Se o valor da chave não estiver definido, o valor do elemento de solicitação baseline correspondente será excluído.
    
    ??? info "Exemplo"
        `'HEADER_COOKIE_value': ""`

??? info "Exemplo"
  No exemplo abaixo, a solicitação baseline será modificada da seguinte maneira:

  1.  O valor do cabeçalho `Content-Type` será substituído por `application/xml`.
  2.  O valor do parâmetro GET `uid` será excluído (o próprio parâmetro não será removido).

  ```
  modify:
  - "HEADER_CONTENT-TYPE_value": "application/xml"
  - "GET_uid_value": ""
  ```