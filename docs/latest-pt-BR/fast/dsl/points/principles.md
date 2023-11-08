[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-yaml]:        https://yaml.org/spec/1.2/spec.html

# Princípios de Construção de Pontos

!!! warning "Palavras reservadas"
     Não utilize os seguintes nomes e chaves para os elementos de solicitação de linha de base, a fim de evitar colisões com as palavras reservadas:
         
     * Nomes e chaves que correspondam aos nomes dos analisadores
     * Nomes e chaves que correspondam aos nomes dos filtros
     * Nomes e chaves que correspondam às palavras de serviço `name` e `value`

Existem vários princípios universais na construção de pontos que devem ser considerados ao desenvolver uma extensão personalizada.

* Todos os pontos são tratados como expressões regulares.

    **Exemplo:**

    * O ponto `HEADER_A.*_value` refere-se ao cabeçalho com o nome que começa com `A` se tal cabeçalho estiver presente na solicitação.
    * O ponto `PATH_\d_value` refere-se às primeiras 10 partes do caminho URI da solicitação.

* As partes do ponto devem ser divididas usando o símbolo `_`.

    **Exemplo:** 

    `URI_value`.

* Os nomes dos analisadores e filtros devem ser adicionados ao ponto em letras maiúsculas.

    **Exemplo:** 

    `ACTION_EXT_value`.

* Os nomes dos elementos da solicitação devem ser adicionados ao ponto exatamente da mesma maneira que aparecem na solicitação de base.

    **Exemplo:** 

    Para a solicitação `GET http://example.com/login/?Uid=01234`, o ponto `GET_Uid_value` refere-se ao parâmetro de string de consulta `Uid`.
    
    !!! info "Escapando símbolos especiais"
        Alguns dos símbolos de serviço podem exigir escape quando usados em pontos. Para obter informações detalhadas, consulte a documentação sobre as [expressões regulares] da linguagem de programação Ruby[link-ruby].

* Um ponto pode ser colocado na extensão das seguintes maneiras:
    * rodeado pelos símbolos `"`. 
        
        **Exemplo:** 
        
        `"PATH_.*_value"`.
    
    * rodeado pelos símbolos `'`. 
        
        **Exemplo:** 
        
        `'GET_.*_value'`.
    
    * sem ser cercado por nenhum símbolo. 
        
        **Exemplo:** 
        
        `HEADER_.*_value`.
    
    !!! info "Rodeando pontos com símbolos"
        A sintaxe YAML define a diferença entre o uso de vários símbolos para cercar pontos. Para obter informações detalhadas, acesse este [link][link-yaml].

* Pontos divididos com o símbolo `,` e cercados pelos símbolos `[` e `]` são tratados como uma matriz de pontos.
    
    **Exemplo:** 
    
    `[GET_uid_value, GET_passwd_value]`.

* A palavra de serviço deve sempre estar presente no final do ponto para indicar se a extensão deve trabalhar com o nome ou o valor do elemento da solicitação. 
    * A palavra de serviço `name` deve ser especificada para trabalhar com o nome do elemento da solicitação. 
        
        A palavra de serviço `name` pode ser usada em conjunto com os seguintes filtros:
        
        * Xml_pi;
        * Xml_dtd_entity.
        
        **Exemplo:** 
        
        O ponto `POST_XML_XML_DTD_ENTITY_0_name` refere-se ao nome da primeira diretiva de esquema DTD especificada nos dados XML no corpo da solicitação.
    
    * A palavra de serviço `value` deve ser especificada para trabalhar com o valor do elemento da solicitação.
        
        A palavra de serviço `value` pode ser usada em conjunto com qualquer um dos filtros e analisadores FAST DSL disponíveis.
        
        **Exemplo:** 
        
        O ponto `PATH_0_value` refere-se ao valor da primeira parte do caminho URI da solicitação.