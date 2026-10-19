import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { securityStore } from './src/db/store.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ==========================================
  // API Endpoints
  // ==========================================

  // 1. Health & Statistics
  app.get('/api/health', (req, res) => {
    const vulns = securityStore.getVulnerabilities();
    const suggestions = securityStore.getSuggestions();
    const categories = securityStore.getCategories();
    res.json({
      status: 'online',
      appName: 'Security X',
      database: 'PostgreSQL-Ready Engine',
      stats: {
        totalVulnerabilities: vulns.length,
        totalSuggestions: suggestions.length,
        pendingSuggestions: suggestions.filter(s => s.status === 'pending').length,
        categoriesCount: categories.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Categories
  app.get('/api/categories', (req, res) => {
    try {
      const categories = securityStore.getCategories();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar categorias', details: err.message });
    }
  });

  // 3. Vulnerabilities (Catalog & Search)
  app.get('/api/vulnerabilities', (req, res) => {
    try {
      const { q, category, severity } = req.query;
      const vulns = securityStore.getVulnerabilities(
        q as string | undefined,
        category as string | undefined,
        severity as string | undefined
      );
      res.json(vulns);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar vulnerabilidades', details: err.message });
    }
  });

  app.get('/api/vulnerabilities/:id', (req, res) => {
    try {
      const vuln = securityStore.getVulnerabilityById(req.params.id);
      if (!vuln) {
        return res.status(404).json({ error: 'Vulnerabilidade não encontrada' });
      }
      res.json(vuln);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar vulnerabilidade', details: err.message });
    }
  });

  // 4. Admin CRUD for Vulnerabilities
  app.post('/api/vulnerabilities', (req, res) => {
    try {
      const {
        title,
        category_id,
        severity,
        short_summary,
        detailed_description,
        practical_example,
        mitigation,
        cwe_id,
        owasp_reference,
        attack_vector,
        impact_scope,
      } = req.body;

      if (!title || !short_summary || !detailed_description) {
        return res.status(400).json({ error: 'Título, resumo e descrição detalhada são obrigatórios.' });
      }

      const created = securityStore.createVulnerability({
        title,
        category_id: category_id || 'owasp-top10',
        severity: severity || 'Medium',
        short_summary,
        detailed_description,
        practical_example: practical_example || 'Exemplo prático em elaboração.',
        mitigation: mitigation || 'Boas práticas de código seguro e validação de entradas.',
        cwe_id: cwe_id || 'CWE-Generico',
        owasp_reference: owasp_reference || 'OWASP Community',
        attack_vector: attack_vector || 'Aplicação Web / Rede',
        impact_scope: impact_scope || 'Segurança da Informação',
      });

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar fragilidade', details: err.message });
    }
  });

  app.put('/api/vulnerabilities/:id', (req, res) => {
    try {
      const updated = securityStore.updateVulnerability(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Vulnerabilidade não encontrada para atualização' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar fragilidade', details: err.message });
    }
  });

  app.delete('/api/vulnerabilities/:id', (req, res) => {
    try {
      const deleted = securityStore.deleteVulnerability(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Vulnerabilidade não encontrada para exclusão' });
      }
      res.json({ success: true, message: 'Fragilidade removida com sucesso' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir fragilidade', details: err.message });
    }
  });

  // 5. Suggestions (Student Community Flow)
  app.get('/api/suggestions', (req, res) => {
    try {
      const { status } = req.query;
      const suggestions = securityStore.getSuggestions(status as string | undefined);
      res.json(suggestions);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar sugestões', details: err.message });
    }
  });

  app.post('/api/suggestions', (req, res) => {
    try {
      const { term_title, category_id, severity, description, example, student_name, student_email } = req.body;

      if (!term_title || !description) {
        return res.status(400).json({ error: 'Título do termo e descrição explicativa são obrigatórios.' });
      }

      const created = securityStore.createSuggestion({
        term_title,
        category_id: category_id || 'owasp-top10',
        severity: severity || 'Medium',
        description,
        example: example || '',
        student_name: student_name || 'Estudante Anônimo',
        student_email: student_email || '',
      });

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao enviar sugestão', details: err.message });
    }
  });

  app.patch('/api/suggestions/:id/status', (req, res) => {
    try {
      const { status, admin_notes } = req.body;
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido (pending, approved ou rejected).' });
      }

      const updated = securityStore.updateSuggestionStatus(req.params.id, status, admin_notes);
      if (!updated) {
        return res.status(404).json({ error: 'Sugestão não encontrada' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar status da sugestão', details: err.message });
    }
  });

  app.post('/api/suggestions/:id/approve-to-vuln', (req, res) => {
    try {
      const vuln = securityStore.convertSuggestionToVulnerability(req.params.id, req.body);
      if (!vuln) {
        return res.status(404).json({ error: 'Sugestão não encontrada para conversão' });
      }
      res.status(201).json({ success: true, vulnerability: vuln });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao aprovar sugestão como vulnerabilidade', details: err.message });
    }
  });

  // 6. PostgreSQL Database Export & Migration Endpoint
  app.get('/api/database/export-sql', (req, res) => {
    try {
      const dump = securityStore.generatePostgresDump();
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="security_x_postgresql_dump.sql"');
      res.send(dump);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao exportar SQL', details: err.message });
    }
  });

  // ==========================================
  // Vite Integration (Dev vs Prod)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Security X] Servidor full-stack ativo na porta ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Falha crítica ao iniciar o servidor:', err);
  process.exit(1);
});
