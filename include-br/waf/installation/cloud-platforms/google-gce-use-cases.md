Dentre todas as [opções de implantação do Wallarm][platform] suportadas, é recomendada a implantação do Wallarm no Google Compute Engine (GCE) usando a imagem Docker nestes **casos de uso**:

* Se suas aplicações utilizam uma arquitetura de microserviços e já estão contêinerizadas e operacionais no GCE.
* Se você precisa de um controle mais detalhado sobre cada contêiner, a imagem Docker se destaca. Ela proporciona um nível maior de isolamento de recursos do que geralmente é possível com implantações tradicionais baseadas em VM.