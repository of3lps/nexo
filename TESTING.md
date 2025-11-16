# 🧪 Checklist de Testes - Nexo SaaS

## 🔐 Autenticação
- [ ] **Login** - `http://localhost:3000`
  - Email: `admin@demo.com`
  - Senha: `admin123`
- [ ] **Registro** - Criar novo usuário
- [ ] **Logout** - Sair da conta

## 🏠 Dashboard
- [ ] **Overview** - `http://localhost:3000/dashboard`
  - Estatísticas carregam
  - Atividades recentes
  - Eventos próximos
- [ ] **Navegação** - Sidebar funciona

## 👥 Comunidades
- [ ] **Listar** - `http://localhost:3000/dashboard/community`
- [ ] **Criar** - `http://localhost:3000/dashboard/create-community`
- [ ] **Gerenciar membros**

## 📅 Eventos
- [ ] **Listar** - `http://localhost:3000/dashboard/events`
- [ ] **Criar evento** - Modal funciona
- [ ] **Filtros** - All, Published, Drafts

## 📊 Analytics
- [ ] **Métricas** - `http://localhost:3000/dashboard/analytics`
- [ ] **Gráficos** - Carregam dados
- [ ] **Insights** - Recomendações

## 📢 Marketing
- [ ] **Campanhas** - `http://localhost:3000/dashboard/marketing`
- [ ] **Links de convite** - Gerar/copiar
- [ ] **Automações** - Listar workflows

## 🔧 APIs
- [ ] **GET /api/communities** - Lista comunidades
- [ ] **POST /api/communities** - Cria comunidade
- [ ] **GET /api/posts** - Lista posts
- [ ] **POST /api/posts** - Cria post
- [ ] **POST /api/upload** - Upload de arquivos

## 🏢 Multi-tenancy
- [ ] **Tenant demo** - Existe no banco
- [ ] **Isolamento** - Dados por tenant
- [ ] **Subdomínio** - `demo.localhost:3000` (precisa configurar hosts)

## ❌ Problemas Conhecidos
- [ ] Registro de usuários (Prisma Client)
- [ ] Upload de arquivos (diretório)
- [ ] Subdomínios locais (hosts file)

---

## 🚀 Como Testar

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:3000`

3. **Faça login:**
   - Email: `admin@demo.com`
   - Senha: `admin123`

4. **Teste cada seção** marcando ✅ ou ❌

5. **Reporte problemas** com prints/logs