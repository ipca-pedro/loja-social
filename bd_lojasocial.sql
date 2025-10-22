-- Ativa a extensão para gerar IDs únicos (UUIDs), comum em plataformas como Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RF1: Autenticação e Controlo de Acessos
-- Tabela para os colaboradores dos SAS que vão usar a app Android
CREATE TABLE IF NOT EXISTS colaboradores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Guardar sempre a hash, nunca a password
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RF2: Gestão de Beneficiários
-- Tabela para os estudantes que recebem apoio
CREATE TABLE IF NOT EXISTS beneficiarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    num_estudante VARCHAR(50) UNIQUE,
    nif VARCHAR(9) UNIQUE,
    ano_curricular INT,
    curso VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    notas_adicionais TEXT, -- Para alergias, restrições, etc.
    estado VARCHAR(50) NOT NULL DEFAULT 'ativo', -- 'ativo', 'inativo' (para reativação)
    data_registo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RF5: Gestão de Campanhas
-- Tabela para registar campanhas de doação
CREATE TABLE IF NOT EXISTS campanhas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE
);

-- RF3: Gestão de Inventário (Parte 1: Categorias)
-- Tabela para agrupar produtos (ex: "Enlatados", "Higiene")
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- RF3: Gestão de Inventário (Parte 2: Definição do Produto)
-- Tabela que define o "tipo" de produto
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL, -- Se a categoria for apagada, o produto fica sem categoria
    descricao TEXT
);

-- RF3 & RF6: Gestão de Inventário (Parte 3: O Stock Real)
-- Tabela principal do inventário. Cada linha é um "lote" de um produto
CREATE TABLE IF NOT EXISTS stock_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id INT NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT, -- Não deixa apagar um produto se houver stock dele
    quantidade_inicial INT NOT NULL CHECK (quantidade_inicial > 0),
    quantidade_atual INT NOT NULL CHECK (quantidade_atual >= 0),
    data_entrada DATE NOT NULL DEFAULT CURRENT_DATE,
    data_validade DATE, -- Pode ser NULL para produtos não perecíveis
    campanha_id UUID REFERENCES campanhas(id) ON DELETE SET NULL, -- Proveniência (RF3)
    colaborador_id UUID NOT NULL REFERENCES colaboradores(id) -- Rastreabilidade (RF1)
);

-- RF4: Gestão de Entregas
-- Tabela para agendar e registar as entregas
CREATE TABLE IF NOT EXISTS entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiario_id UUID NOT NULL REFERENCES beneficiarios(id),
    colaborador_id UUID NOT NULL REFERENCES colaboradores(id), -- Quem registou/entregou
    data_agendamento DATE NOT NULL, -- RF4: "sem hora específica"
    estado VARCHAR(50) NOT NULL DEFAULT 'agendada', -- 'agendada', 'entregue', 'nao_entregue'
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RF4: Gestão de Entregas (Parte 2: Itens da Entrega)
-- Tabela de junção que diz quais "lotes" de stock saíram em cada entrega
CREATE TABLE IF NOT EXISTS detalhes_entrega (
    id SERIAL PRIMARY KEY,
    entrega_id UUID NOT NULL REFERENCES entregas(id) ON DELETE CASCADE, -- Se a entrega for apagada, estes registos também são
    stock_item_id UUID NOT NULL REFERENCES stock_items(id),
    quantidade_entregue INT NOT NULL CHECK (quantidade_entregue > 0)
);

-- RF7: Website Informativo (Formulário de Contacto)
CREATE TABLE IF NOT EXISTS mensagens_contacto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    data_rececao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT false
);

-------------------------------------------------------------------
-- PARTE "SUPER PODEROSA": LÓGICA DE NEGÓCIO AUTOMÁTICA (TRIGGERS)
-------------------------------------------------------------------

-- RF3: "Após a confirmação de uma entrega, o stock dos produtos correspondentes deve ser atualizado automaticamente."
-- 1. Criamos a FUNÇÃO que faz a lógica
CREATE OR REPLACE FUNCTION fn_atualizar_stock_apos_entrega()
RETURNS TRIGGER AS $$
DECLARE
    item_detalhe RECORD;
BEGIN
    -- Se o estado da entrega foi mudado PARA "entregue"
    IF NEW.estado = 'entregue' AND OLD.estado != 'entregue' THEN
        -- Itera por todos os itens associados a esta entrega
        FOR item_detalhe IN (SELECT * FROM detalhes_entrega WHERE entrega_id = NEW.id)
        LOOP
            -- Abate a quantidade do lote de stock correspondente
            UPDATE stock_items
            SET quantidade_atual = quantidade_atual - item_detalhe.quantidade_entregue
            WHERE id = item_detalhe.stock_item_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Criamos o TRIGGER que chama a função
CREATE TRIGGER trg_on_entrega_concluida
AFTER UPDATE ON entregas
FOR EACH ROW
WHEN (NEW.estado = 'entregue' AND OLD.estado IS DISTINCT FROM NEW.estado)
EXECUTE FUNCTION fn_atualizar_stock_apos_entrega();


-------------------------------------------------------------------
-- PARTE "SUPER PODEROSA": VIEW SEGURA PARA O WEBSITE (RF7)
-------------------------------------------------------------------

-- RF7: "Apresentar os produtos... sem exibir as quantidades exatas."
-- Esta VIEW (tabela virtual) pré-calcula os dados para o website
-- A sua API (GET /api/public/stock) só precisa de fazer "SELECT * FROM public_stock_summary"
CREATE OR REPLACE VIEW public_stock_summary AS
SELECT
    cat.nome AS categoria,
    prod.nome AS produto,
    -- Conta quantos "lotes" (registos) existem, mas NÃO a soma das quantidades
    COUNT(DISTINCT si.produto_id) AS disponibilidade,
    -- Mostra a data de validade mais próxima para esse produto
    MIN(si.data_validade) AS validade_proxima
FROM stock_items si
JOIN produtos prod ON si.produto_id = prod.id
JOIN categorias cat ON prod.categoria_id = cat.id
WHERE
    si.quantidade_atual > 0 -- Só mostra produtos que realmente existem em stock
    AND (si.data_validade IS NULL OR si.data_validade > CURRENT_DATE) -- Só mostra produtos válidos
GROUP BY
    cat.nome, prod.nome
ORDER BY
    cat.nome, prod.nome;




-------------------------------------------------------------------
-- DADOS INICIAIS (SEED DATA)
-------------------------------------------------------------------

-- 1. Categorias (Mantidas)
INSERT INTO categorias (nome) VALUES
('Enlatados'),
('Massas e Arroz'),
('Higiene Pessoal'),
('Limpeza'),
('Outros')
ON CONFLICT (nome) DO NOTHING;

-- 2. Produtos (Mantidos + Adicionados)
INSERT INTO produtos (nome, categoria_id, descricao) VALUES
('Atum em Óleo', (SELECT id FROM categorias WHERE nome = 'Enlatados'), 'Lata de atum em óleo vegetal'),
('Feijão Enlatado', (SELECT id FROM categorias WHERE nome = 'Enlatados'), 'Lata de feijão cozido'),
('Salsichas Lata', (SELECT id FROM categorias WHERE nome = 'Enlatados'), 'Lata de 8 salsichas'),
('Esparguete', (SELECT id FROM categorias WHERE nome = 'Massas e Arroz'), 'Pacote de 500g'),
('Arroz Agulha', (SELECT id FROM categorias WHERE nome = 'Massas e Arroz'), 'Pacote de 1kg'),
('Gel de Banho', (SELECT id FROM categorias WHERE nome = 'Higiene Pessoal'), 'Frasco de 500ml'),
('Pasta de Dentes', (SELECT id FROM categorias WHERE nome = 'Higiene Pessoal'), 'Tubo de 75ml'),
('Shampoo', (SELECT id FROM categorias WHERE nome = 'Higiene Pessoal'), 'Frasco de 250ml'),
('Detergente Loiça', (SELECT id FROM categorias WHERE nome = 'Limpeza'), 'Garrafa de 1L'),
('Lixívia', (SELECT id FROM categorias WHERE nome = 'Limpeza'), 'Garrafa de 2L'),
('Caderno A4', (SELECT id FROM categorias WHERE nome = 'Outros'), 'Caderno pautado'),
('Caneta Azul', (SELECT id FROM categorias WHERE nome = 'Outros'), NULL)
ON CONFLICT (nome) DO NOTHING;

-- 3. Colaboradores (Atualizado)
-- Hash de exemplo para 'password123' (NÃO SEGURO!)
INSERT INTO colaboradores (nome, email, password_hash) VALUES
('Admin Loja Social', 'admin@lojasocial.pt', '$2a$12$LELwvJsqqyM9Ikqfw3EWXut80a4irOwq.xuZhxEloTdQebeeZmPOu'),
('Voluntário A', 'voluntario.a@ipca.pt', '$2a$12$LELwvJsqqyM9Ikqfw3EWXut80a4irOwq.xuZhxEloTdQebeeZmPOu')
ON CONFLICT (email) DO NOTHING;

-- 4. Campanhas (Mantidas)
INSERT INTO campanhas (nome, descricao, data_inicio, data_fim) VALUES
('Campanha Natal Solidário 2024', 'Recolha de bens alimentares e brinquedos', '2024-11-15', '2024-12-20'),
('Recolha Material Escolar 2025', 'Angariação de material para o início do ano letivo', '2025-08-20', '2025-09-10')
ON CONFLICT (nome) DO NOTHING;

-- 5. Beneficiários (Adicionados)
INSERT INTO beneficiarios (nome_completo, num_estudante, nif, ano_curricular, curso, email, telefone, notas_adicionais, estado) VALUES
('João Silva', 'a12345', '123456789', 2, 'Engenharia Informática', 'a12345@ipca.pt', '912345678', 'Alergia a frutos secos', 'ativo'),
('Maria Pereira', 'a54321', '987654321', 1, 'Gestão', 'a54321@ipca.pt', '923456789', NULL, 'ativo'),
('Carlos Santos', 'a11223', '112233445', 3, 'Design Gráfico', 'a11223@ipca.pt', NULL, 'Restrições alimentares: vegetariano', 'ativo'),
('Ana Costa', 'a33221', '554433221', 2, 'Solicitadoria', 'a33221@ipca.pt', '961234567', NULL, 'inativo') -- Exemplo inativo
ON CONFLICT (num_estudante) DO NOTHING;
ON CONFLICT (nif) DO NOTHING;
ON CONFLICT (email) DO NOTHING;

-- 6. Stock Items (Expandido)
DO $$
DECLARE
    colab_admin_id UUID;
    colab_vol_id UUID;
    cat_enlatados INT;
    cat_massas INT;
    cat_higiene INT;
    cat_outros INT;
    prod_atum INT;
    prod_feijao INT;
    prod_salsichas INT;
    prod_arroz INT;
    prod_shampoo INT;
    prod_caderno INT;
    prod_caneta INT;
    campanha_natal_id UUID;
    campanha_material_id UUID;

    -- Variáveis para guardar IDs dos stock_items para as entregas
    stock_atum_1 UUID;
    stock_atum_2 UUID;
    stock_arroz_1 UUID;
    stock_caderno_1 UUID;
    stock_caneta_1 UUID;

    -- Variáveis para guardar IDs dos beneficiários e entregas
    benef_joao_id UUID;
    benef_maria_id UUID;
    entrega_joao_id UUID;
    entrega_maria_id UUID;

BEGIN
    -- Obter IDs dos colaboradores
    SELECT id INTO colab_admin_id FROM colaboradores WHERE email = 'admin@lojasocial.pt';
    SELECT id INTO colab_vol_id FROM colaboradores WHERE email = 'voluntario.a@ipca.pt';

    -- Obter IDs das categorias
    SELECT id INTO cat_enlatados FROM categorias WHERE nome = 'Enlatados';
    SELECT id INTO cat_massas FROM categorias WHERE nome = 'Massas e Arroz';
    SELECT id INTO cat_higiene FROM categorias WHERE nome = 'Higiene Pessoal';
    SELECT id INTO cat_outros FROM categorias WHERE nome = 'Outros';

    -- Obter IDs dos produtos
    SELECT id INTO prod_atum FROM produtos WHERE nome = 'Atum em Óleo';
    SELECT id INTO prod_feijao FROM produtos WHERE nome = 'Feijão Enlatado';
    SELECT id INTO prod_salsichas FROM produtos WHERE nome = 'Salsichas Lata';
    SELECT id INTO prod_arroz FROM produtos WHERE nome = 'Arroz Agulha';
    SELECT id INTO prod_shampoo FROM produtos WHERE nome = 'Shampoo';
    SELECT id INTO prod_caderno FROM produtos WHERE nome = 'Caderno A4';
    SELECT id INTO prod_caneta FROM produtos WHERE nome = 'Caneta Azul';

    -- Obter IDs das campanhas
    SELECT id INTO campanha_natal_id FROM campanhas WHERE nome = 'Campanha Natal Solidário 2024';
    SELECT id INTO campanha_material_id FROM campanhas WHERE nome = 'Recolha Material Escolar 2025';

    -- Inserir Stock Items (só se os IDs necessários foram encontrados)
    IF colab_admin_id IS NOT NULL AND prod_atum IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_atum, 50, 48, '2026-10-31', colab_admin_id, campanha_natal_id) RETURNING id INTO stock_atum_1; -- Lote 1 Atum (já saiu 2)
    END IF;
    IF colab_vol_id IS NOT NULL AND prod_atum IS NOT NULL THEN
         INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_atum, 30, 25, '2027-03-15', colab_vol_id, NULL) RETURNING id INTO stock_atum_2; -- Lote 2 Atum (já saiu 5)
    END IF;

    IF colab_admin_id IS NOT NULL AND prod_arroz IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_arroz, 100, 90, NULL, colab_admin_id, NULL) RETURNING id INTO stock_arroz_1; -- Arroz (já saiu 10)
    END IF;

    IF colab_vol_id IS NOT NULL AND prod_feijao IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_feijao, 60, 60, '2026-05-20', colab_vol_id, NULL); -- Feijão
    END IF;
    IF colab_admin_id IS NOT NULL AND prod_salsichas IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_salsichas, 40, 40, CURRENT_DATE + INTERVAL '1 month', colab_admin_id, NULL); -- Salsichas (perto de expirar)
    END IF;
     IF colab_admin_id IS NOT NULL AND prod_shampoo IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_shampoo, 20, 20, NULL, colab_admin_id, NULL); -- Shampoo (sem validade)
    END IF;

    -- Stock de material escolar
     IF colab_vol_id IS NOT NULL AND prod_caderno IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_caderno, 15, 10, NULL, colab_vol_id, campanha_material_id) RETURNING id INTO stock_caderno_1; -- Cadernos (já sairam 5)
    END IF;
     IF colab_vol_id IS NOT NULL AND prod_caneta IS NOT NULL THEN
        INSERT INTO stock_items (produto_id, quantidade_inicial, quantidade_atual, data_validade, colaborador_id, campanha_id) VALUES
        (prod_caneta, 50, 40, NULL, colab_vol_id, campanha_material_id) RETURNING id INTO stock_caneta_1; -- Canetas (já sairam 10)
    END IF;


    -- 7. Entregas (Exemplo)
    -- Obter IDs dos beneficiários
    SELECT id INTO benef_joao_id FROM beneficiarios WHERE num_estudante = 'a12345';
    SELECT id INTO benef_maria_id FROM beneficiarios WHERE num_estudante = 'a54321';

    -- Inserir Entregas
    IF benef_joao_id IS NOT NULL AND colab_admin_id IS NOT NULL THEN
        INSERT INTO entregas (beneficiario_id, colaborador_id, data_agendamento, estado) VALUES
        (benef_joao_id, colab_admin_id, CURRENT_DATE - INTERVAL '2 days', 'entregue') RETURNING id INTO entrega_joao_id; -- Entrega passada e concluída
    END IF;

    IF benef_maria_id IS NOT NULL AND colab_vol_id IS NOT NULL THEN
        INSERT INTO entregas (beneficiario_id, colaborador_id, data_agendamento, estado) VALUES
        (benef_maria_id, colab_vol_id, CURRENT_DATE + INTERVAL '3 days', 'agendada') RETURNING id INTO entrega_maria_id; -- Entrega futura agendada
    END IF;

    -- 8. Detalhes Entrega (Exemplo para a entrega do João)
    -- Assumindo que os IDs de stock foram guardados nas variáveis
    IF entrega_joao_id IS NOT NULL AND stock_atum_1 IS NOT NULL AND stock_arroz_1 IS NOT NULL THEN
        INSERT INTO detalhes_entrega (entrega_id, stock_item_id, quantidade_entregue) VALUES
        (entrega_joao_id, stock_atum_1, 2), -- Saíram 2 latas de atum do lote 1
        (entrega_joao_id, stock_arroz_1, 5); -- Saíram 5 kgs de arroz do lote 1
    END IF;
     -- Detalhes para uma hipotética entrega anterior de Maria (para justificar stock baixo)
     -- Note que não precisamos da entrega_id real, só precisamos dos stock_item_id
     IF stock_atum_2 IS NOT NULL AND stock_arroz_1 IS NOT NULL AND stock_caderno_1 IS NOT NULL AND stock_caneta_1 IS NOT NULL THEN
         -- Simular abate de stock que teria ocorrido em entregas anteriores (sem criar a entrega em si)
         -- Estes UPDATES são redundantes se a entrega que os causou fosse criada e marcada como 'entregue'
         -- Mas como queremos apenas dados dummy de stock já usado, fazemos update direto
         -- UPDATE stock_items SET quantidade_atual = 25 WHERE id = stock_atum_2; -- já definido no insert
         -- UPDATE stock_items SET quantidade_atual = 90 WHERE id = stock_arroz_1; -- já definido no insert
         UPDATE stock_items SET quantidade_atual = 10 WHERE id = stock_caderno_1; -- -5
         UPDATE stock_items SET quantidade_atual = 40 WHERE id = stock_caneta_1; -- -10
     END IF;


END $$;