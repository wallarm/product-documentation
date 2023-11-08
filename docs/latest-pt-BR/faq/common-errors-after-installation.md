# Erros após a instalação do nó Wallarm

Se ocorrerem alguns erros após a instalação do nó Wallarm, verifique este guia de solução de problemas para solucioná-los. Se você não encontrou detalhes relevantes aqui, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

## Falha nos cenários de download de arquivo

Se seus cenários de download de arquivos falharem após a instalação de um nó de filtro, o problema está no tamanho da solicitação ultrapassando o limite definido na diretiva `client_max_body_size` no arquivo de configuração da Wallarm.

Altere o valor em `client_max_body_size` na diretiva `location` para o endereço que aceita os uploads de arquivos. Mudar apenas o valor de `location` protege a página principal de receber solicitações grandes.

Altere o valor em `client_max_body_size`:

1. Abra para edição o arquivo de configuração no diretório `/etc/nginx-wallarm`.
2. Insira o novo valor:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` é o endereço que aceita os uploads de arquivos.

A descrição detalhada da diretiva está disponível na [documentação oficial do NGINX](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## Como corrigir os erros "não foi possível verificar a assinatura para wallarm-node", "yum não possui dados suficientes em cache para continuar", "as assinaturas não puderam ser verificadas"?

Se as chaves GPG para pacotes RPM ou DEB da Wallarm estiverem expiradas, você pode receber as seguintes mensagens de erro:

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] a assinatura repomd.xml não pôde ser verificada para wallarm-node_3.6

Um dos repositórios configurados falhou (Wallarm Node para CentOS 7 - 3.6),
e o yum não possui dados suficientes em cache para continuar.

W: Erro GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: As seguintes assinaturas
não puderam ser verificadas porque a chave pública não está disponível: NO_PUBKEY 1111FQQW999
E: O repositório 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' não está assinado.
N: Atualizar a partir de tal repositório não pode ser feito de forma segura e, portanto, é desabilitado por padrão.
N: Consulte a manpage apt-secure(8) para detalhes sobre a criação de repositório e configuração do usuário.
```

Para corrigir o problema no **Debian ou Ubuntu**, siga as etapas:

1. Importe novas chaves GPG para os pacotes Wallarm:

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. Atualize os pacotes Wallarm:

	```bash
	sudo apt update
	```

Para corrigir o problema no **CentOS**, siga as etapas:

1. Remova o repositório adicionado anteriormente:

	```bash
	sudo yum remove wallarm-node-repo
	```
2. Limpe o cache:

	```bash
	sudo yum clean all
	```
3. Adicione um novo repositório usando o comando apropriado para as versões do CentOS e do nó Wallarm:

	=== "CentOS 7.x ou Amazon Linux 2.0.2021x e inferior"
		```bash

		# Nó de filtragem e módulo pós-analítico da versão 4.4
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# Nó de filtragem e módulo pós-analítico da versão 4.6
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm

		# Nó de filtragem e módulo pós-analítico da versão 4.8
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
		```
	=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
		```bash

		# Nó de filtragem e módulo pós-analítico da versão 4.4
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# Nó de filtragem e módulo pós-analítico da versão 4.6
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm

		# Nó de filtragem e módulo pós-analítico da versão 4.8
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
		```		
4. Se necessário, confirme a ação.

## Por que o nó de filtragem não bloqueia ataques quando opera no modo de bloqueio (`wallarm_mode block`)?

Usar a diretiva `wallarm_mode` é apenas um dos vários métodos de configuração do modo de filtragem de tráfego. Alguns desses métodos de configuração têm uma prioridade maior do que o valor da diretiva `wallarm_mode`.

Se você configurou o modo de bloqueio via `wallarm_mode block`, mas o nó de filtragem da Wallarm não bloqueia ataques, certifique-se de que o modo de filtragem não está sendo substituído usando outros métodos de configuração:

* Usando a [regra **Configurar modo de filtragem**](../user-guides/rules/wallarm-mode-rule.md)
* Na [seção **Geral** do Console Wallarm](../user-guides/settings/general.md)

[Mais detalhes sobre métodos de configuração do modo de filtragem →](../admin-en/configure-parameters-en.md)