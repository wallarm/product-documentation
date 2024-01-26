---
description: Wallarm's (FAST) é uma ferramenta projetada para identificar vulnerabilidades em aplicações web gerando e executando testes de segurança automatizados.
---

[link-agreements]:      agreements.md

# Visão Geral do Wallarm FAST

O Framework do Wallarm para Testes de Segurança de API (FAST) é uma ferramenta construída com o propósito de permitir que você revele vulnerabilidades em aplicações web gerando e executando testes de segurança de maneira automática. Injeções SQL e XSS são exemplos de tais vulnerabilidades.

Um nó FAST, que redireciona as solicitações HTTP e HTTPS para a aplicação alvo, é um componente central da solução. Ele intercepta solicitações para a aplicação alvo e constrói um conjunto de testes de segurança modificando as solicitações originais. Isso é possível devido à incorporação de técnicas de fuzzing e uma base de conhecimento de vulnerabilidades diretamente no nó FAST. O nó pode obter consultas de uma ampla gama de fontes. Por exemplo, um conjunto de testes automatizados existente poderia servir como a fonte de consulta para o FAST.

Uma política de teste define os parâmetros do processo de geração de testes de segurança. Essas políticas são criadas usando Wallarm Cloud, outro componente da solução. A nuvem fornece ao usuário uma interface para criar políticas de teste, gerenciar o processo de execução do teste e observar os resultados do teste.

Depois de preparar o conjunto de testes de segurança, o nó FAST executará o conjunto de testes enviando as solicitações para a aplicação alvo e fornecerá uma conclusão sobre a existência de certas vulnerabilidades.

Dadas as capacidades de automatização combinadas com a base de conhecimento de vulnerabilidades incorporada, o FAST é uma ferramenta adequada para DevOps, especialistas em segurança, desenvolvedores de software e engenheiros de QA. Com o FAST, é possível usar o conhecimento profundo dos especialistas em segurança para construir políticas de testes de segurança, enquanto fornece aos desenvolvedores sem experiência no campo da segurança uma maneira de automatizar a geração e execução de testes de segurança. Portanto, ambos os grupos de membros da equipe poderiam se comunicar de maneira eficaz de maneira assíncrona entre si. A arquitetura FAST permite integrar os processos de geração e execução de testes de segurança no processo CI/CD existente, para que a qualidade geral do software em desenvolvimento possa ser aumentada.

--8<-- "../include-pt-BR/fast/cloud-note-readme.md"

!!! info "Convenções de formatação de texto"
    Este guias contêm uma variedade de strings de texto e comandos que precisam ser inseridos ou executados para obter o resultado desejado. Para sua conveniência, todos eles são formatados de acordo com as convenções de formatação de texto. Para ver as convenções, prossiga para este [link][link-agreements].

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/Me4o4v7dPyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>