[link-yaml]:            https://yaml.org/spec/1.2/spec.html
[link-ruby-regexp]:     http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-points]:          points/intro.md

# Visão geral do FAST DSL

O FAST fornece aos usuários uma linguagem específica de domínio (DSL) para descrever extensões. Agora você pode criar extensões personalizadas para detectar vulnerabilidades em seu aplicativo sem ter habilidades específicas de programação. O mecanismo de extensões permite a aplicação de uma lógica personalizada adicional para o processamento de solicitações de base e a busca de vulnerabilidades no aplicativo alvo.

As extensões FAST permitem a geração de testes de segurança que são construídos modificando os parâmetros selecionados em uma solicitação de base ou usando uma carga útil predefinida. Os testes de segurança gerados são então enviados ao aplicativo alvo. A resposta do aplicativo a esses testes é usada para concluir a presença ou ausência de vulnerabilidades no aplicativo alvo (as extensões FAST também definem o método de detecção de vulnerabilidades). 

As extensões são descritas utilizando YAML. Presumimos que você esteja familiarizado com a sintaxe e a estrutura do arquivo YAML. Para ver informações detalhadas, prossiga para este [link][link-yaml].

A lógica das extensões pode incluir elementos descritos com expressões regulares. As expressões FAST suportam apenas a sintaxe de expressão regular do idioma Ruby. Presume-se que você esteja familiarizado com a sintaxe da expressão regular do Ruby. Para ver informações detalhadas, prossiga para este [link][link-ruby-regexp].

--8<-- "../include/fast/cloud-note.md"

!!! info "Sintaxe para descrição dos elementos de solicitação"
    Ao criar uma extensão FAST, você precisa compreender a estrutura da solicitação HTTP enviada para o aplicativo e da resposta HTTP recebida do aplicativo para descrever corretamente os elementos de solicitação com os quais você precisa trabalhar usando os pontos.

    Para ver informações detalhadas, prossiga para este [link][link-points].
