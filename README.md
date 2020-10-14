# Wiz Commit Lint Schematic

Adicione lint de mensagens de commit, segundo a especificação [Conventional Commits](https://www.conventionalcommits.org/), ao seu projeto com apenas um comando!

## Uso

```bash
ng add @wizsolucoes/commit-lint
```

## Sobre
Este schematic instala os pacotes npm [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional) [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli) e [husky](https://www.npmjs.com/package/husky), cria o arquivo de configuração e adiciona o git hook de mensagem de commit ao seu arquivo package.json.

## Desenvolvimento, por onde começar
```bash
# Instalar as dependências
npm install

# Buildar schematic
npm run build

# Executar os testes
npm test
```

### Testando o schematic localmente
#### 1. Gere um distribuível do schematic

```bash
# Instalar as dependências
npm install

# Buildar schematic
npm run build

# Gerar tarball eg. wizsolucoes-commit-lint-1.0.1.tgz
npm pack
```

#### 2. Instale e execute o schematic no raiz de qualquer aplicação

```bash
# Instalar schematic
npm i --no-save ../path/to/commit-lint-schematic/wizsolucoes-commit-lint-1.0.1.tgz

# Executar schematic
ng g @wizsolucoes/commit-lint:ng-add
```
