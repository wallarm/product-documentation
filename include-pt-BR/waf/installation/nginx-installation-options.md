O processamento de solicitações no nó Wallarm é dividido em dois estágios:

* Processamento primário no módulo NGINX-Wallarm. O processamento não requer muita memória e pode ser colocado em servidores frontend sem alterar os requisitos do servidor.
* Análise estatística das solicitações processadas no módulo de pós-análise. A pós-análise requer muita memória, o que pode exigir alterações na configuração do servidor ou a instalação da pós-análise em um servidor separado.

Dependendo da arquitetura do sistema, os módulos NGINX-Wallarm e de pós-análise podem ser instalados no **mesmo servidor** ou em **servidores diferentes**.