/* ============================================
   AgroData - Inteligência Agrícola
   JavaScript Vanilla - Lógica Interativa
   ============================================ */

// ============================================
// GERENCIAMENTO DE DADOS (localStorage)
// ============================================

const STORAGE_KEY = 'agrodata_plantacoes';

function carregarPlantacoes() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarPlantacoes(plantacoes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantacoes));
    atualizarDashboard();
}

// ============================================
// DASHBOARD - ADICIONAR PLANTAÇÃO
// ============================================

document.getElementById('plantacaoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const plantacao = {
        id: Date.now(),
        nome: document.getElementById('nomePlantacao').value,
        tipo: document.getElementById('tipoCultura').value,
        area: parseFloat(document.getElementById('areaPlantacao').value),
        dataPlantio: document.getElementById('dataPlantio').value,
        rendimento: parseFloat(document.getElementById('rendimentoEsperado').value),
        custo: parseFloat(document.getElementById('custoTotal').value),
        dataCadastro: new Date().toLocaleDateString('pt-BR')
    };
    
    const plantacoes = carregarPlantacoes();
    plantacoes.push(plantacao);
    salvarPlantacoes(plantacoes);
    
    // Limpar formulário
    this.reset();
    
    // Mostrar mensagem de sucesso
    alert('Plantação adicionada com sucesso!');
    
    // Atualizar lista
    exibirPlantacoes();
});

// ============================================
// EXIBIR PLANTAÇÕES
// ============================================

function exibirPlantacoes() {
    const plantacoes = carregarPlantacoes();
    const container = document.getElementById('plantacoesList');
    
    if (plantacoes.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma plantação cadastrada. Adicione uma acima!</p>';
        return;
    }
    
    container.innerHTML = plantacoes.map(p => `
        <div class="plantacao-item">
            <div class="plantacao-header">
                <span class="plantacao-nome">${p.nome}</span>
                <span class="plantacao-status">Ativa</span>
            </div>
            <div class="plantacao-details">
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Tipo</span>
                    <span class="plantacao-detail-value">${p.tipo}</span>
                </div>
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Área</span>
                    <span class="plantacao-detail-value">${p.area} ha</span>
                </div>
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Rendimento</span>
                    <span class="plantacao-detail-value">${p.rendimento} kg/ha</span>
                </div>
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Custo</span>
                    <span class="plantacao-detail-value">R$ ${p.custo.toFixed(2)}</span>
                </div>
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Plantio</span>
                    <span class="plantacao-detail-value">${new Date(p.dataPlantio).toLocaleDateString('pt-BR')}</span>
                </div>
                <div class="plantacao-detail">
                    <span class="plantacao-detail-label">Cadastro</span>
                    <span class="plantacao-detail-value">${p.dataCadastro}</span>
                </div>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                <button class="btn-secondary" onclick="editarPlantacao(${p.id})">✏️ Editar</button>
                <button class="btn-secondary" onclick="deletarPlantacao(${p.id})" style="background: #E74C3C;">🗑️ Deletar</button>
            </div>
        </div>
    `).join('');
}

function deletarPlantacao(id) {
    if (confirm('Tem certeza que deseja deletar esta plantação?')) {
        const plantacoes = carregarPlantacoes();
        const filtradas = plantacoes.filter(p => p.id !== id);
        salvarPlantacoes(filtradas);
        exibirPlantacoes();
    }
}

function editarPlantacao(id) {
    alert('Funcionalidade de edição em desenvolvimento!');
}

// ============================================
// ATUALIZAR DASHBOARD
// ============================================

function atualizarDashboard() {
    const plantacoes = carregarPlantacoes();
    
    // Total de plantações
    document.getElementById('totalPlantacoes').textContent = plantacoes.length;
    
    // Área total
    const areaTotal = plantacoes.reduce((sum, p) => sum + p.area, 0);
    document.getElementById('areaTotalDisplay').textContent = areaTotal.toFixed(1);
    
    // Produção esperada
    const producaoTotal = plantacoes.reduce((sum, p) => sum + (p.area * p.rendimento / 1000), 0);
    document.getElementById('producaoEsperada').textContent = producaoTotal.toFixed(1);
    
    // Lucro estimado (receita - custos)
    const precoMedio = 0.50; // R$ por kg (padrão)
    const receita = plantacoes.reduce((sum, p) => sum + (p.area * p.rendimento * precoMedio / 1000), 0);
    const custos = plantacoes.reduce((sum, p) => sum + p.custo, 0);
    const lucro = receita - custos;
    document.getElementById('lucroEstimado').textContent = 'R$ ' + lucro.toFixed(2);
}

// ============================================
// CALCULADORA - RENDIMENTO
// ============================================

function calcularRendimento() {
    const area = parseFloat(document.getElementById('calcArea').value) || 0;
    const rendimento = parseFloat(document.getElementById('calcRendimento').value) || 0;
    
    const producao = area * rendimento;
    document.getElementById('resultRendimento').textContent = producao.toLocaleString('pt-BR') + ' kg';
}

// ============================================
// CALCULADORA - LUCRO
// ============================================

function calcularLucro() {
    const producao = parseFloat(document.getElementById('calcProducao').value) || 0;
    const preco = parseFloat(document.getElementById('calcPreco').value) || 0;
    const custos = parseFloat(document.getElementById('calcCustos').value) || 0;
    
    const receita = producao * preco;
    const lucro = receita - custos;
    
    document.getElementById('resultReceita').textContent = 'R$ ' + receita.toFixed(2);
    document.getElementById('resultLucro').textContent = 'R$ ' + lucro.toFixed(2);
    
    // Mudar cor se lucro for negativo
    const resultLucro = document.getElementById('resultLucro');
    if (lucro < 0) {
        resultLucro.style.color = '#E74C3C';
    } else {
        resultLucro.style.color = '#27AE60';
    }
}

// ============================================
// CALCULADORA - EFICIÊNCIA HÍDRICA
// ============================================

function calcularEficiencia() {
    const agua = parseFloat(document.getElementById('calcAgua').value) || 0;
    const producao = parseFloat(document.getElementById('calcProducaoAgua').value) || 0;
    
    if (agua === 0) {
        alert('Insira a quantidade de água usada');
        return;
    }
    
    const eficiencia = producao / agua;
    document.getElementById('resultEficiencia').textContent = eficiencia.toFixed(2) + ' kg/mil L';
}

// ============================================
// HISTÓRICO - ESTATÍSTICAS
// ============================================

function atualizarHistorico() {
    const plantacoes = carregarPlantacoes();
    
    // Total
    document.getElementById('totalPlantacoesHist').textContent = plantacoes.length;
    
    // Área média
    if (plantacoes.length > 0) {
        const areaMedia = plantacoes.reduce((sum, p) => sum + p.area, 0) / plantacoes.length;
        document.getElementById('areaMedia').textContent = areaMedia.toFixed(1) + ' ha';
        
        // Rendimento médio
        const rendimentoMedio = plantacoes.reduce((sum, p) => sum + p.rendimento, 0) / plantacoes.length;
        document.getElementById('rendimentoMedio').textContent = rendimentoMedio.toFixed(0) + ' kg/ha';
    }
    
    // Lucro total
    const precoMedio = 0.50;
    const receita = plantacoes.reduce((sum, p) => sum + (p.area * p.rendimento * precoMedio / 1000), 0);
    const custos = plantacoes.reduce((sum, p) => sum + p.custo, 0);
    const lucroTotal = receita - custos;
    document.getElementById('lucroTotal').textContent = 'R$ ' + lucroTotal.toFixed(2);
    
    // Exibir histórico
    exibirHistorico();
}

function exibirHistorico() {
    const plantacoes = carregarPlantacoes();
    const container = document.getElementById('historicoList');
    
    if (plantacoes.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum histórico disponível ainda.</p>';
        return;
    }
    
    container.innerHTML = plantacoes.map(p => {
        const producao = (p.area * p.rendimento / 1000).toFixed(1);
        const receita = (producao * 0.50).toFixed(2);
        const lucro = (receita - p.custo).toFixed(2);
        
        return `
            <div class="plantacao-item">
                <div class="plantacao-header">
                    <span class="plantacao-nome">${p.nome}</span>
                    <span class="plantacao-status">${p.dataCadastro}</span>
                </div>
                <div class="plantacao-details">
                    <div class="plantacao-detail">
                        <span class="plantacao-detail-label">Produção</span>
                        <span class="plantacao-detail-value">${producao} ton</span>
                    </div>
                    <div class="plantacao-detail">
                        <span class="plantacao-detail-label">Receita</span>
                        <span class="plantacao-detail-value">R$ ${receita}</span>
                    </div>
                    <div class="plantacao-detail">
                        <span class="plantacao-detail-label">Custos</span>
                        <span class="plantacao-detail-value">R$ ${p.custo.toFixed(2)}</span>
                    </div>
                    <div class="plantacao-detail">
                        <span class="plantacao-detail-label">Lucro</span>
                        <span class="plantacao-detail-value" style="color: ${lucro >= 0 ? '#27AE60' : '#E74C3C'}">R$ ${lucro}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// HISTÓRICO - EXPORTAR RELATÓRIO
// ============================================

function exportarRelatorio() {
    const plantacoes = carregarPlantacoes();
    
    if (plantacoes.length === 0) {
        alert('Nenhuma plantação para exportar!');
        return;
    }
    
    let relatorio = 'RELATÓRIO AGRODATA\n';
    relatorio += '==================\n\n';
    relatorio += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    plantacoes.forEach((p, i) => {
        const producao = (p.area * p.rendimento / 1000).toFixed(1);
        const receita = (producao * 0.50).toFixed(2);
        const lucro = (receita - p.custo).toFixed(2);
        
        relatorio += `${i + 1}. ${p.nome}\n`;
        relatorio += `   Tipo: ${p.tipo}\n`;
        relatorio += `   Área: ${p.area} ha\n`;
        relatorio += `   Rendimento: ${p.rendimento} kg/ha\n`;
        relatorio += `   Produção: ${producao} toneladas\n`;
        relatorio += `   Receita: R$ ${receita}\n`;
        relatorio += `   Custos: R$ ${p.custo.toFixed(2)}\n`;
        relatorio += `   Lucro: R$ ${lucro}\n\n`;
    });
    
    // Calcular totais
    const areaTotal = plantacoes.reduce((sum, p) => sum + p.area, 0);
    const producaoTotal = plantacoes.reduce((sum, p) => sum + (p.area * p.rendimento / 1000), 0);
    const receitaTotal = (producaoTotal * 0.50).toFixed(2);
    const custosTotal = plantacoes.reduce((sum, p) => sum + p.custo, 0);
    const lucroTotal = (receitaTotal - custosTotal).toFixed(2);
    
    relatorio += 'TOTAIS\n';
    relatorio += '------\n';
    relatorio += `Área Total: ${areaTotal.toFixed(1)} ha\n`;
    relatorio += `Produção Total: ${producaoTotal.toFixed(1)} toneladas\n`;
    relatorio += `Receita Total: R$ ${receitaTotal}\n`;
    relatorio += `Custos Total: R$ ${custosTotal.toFixed(2)}\n`;
    relatorio += `Lucro Total: R$ ${lucroTotal}\n`;
    
    // Criar e baixar arquivo
    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(relatorio));
    elemento.setAttribute('download', `agrodata_relatorio_${new Date().toISOString().split('T')[0]}.txt`);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
    
    alert('Relatório exportado com sucesso!');
}

// ============================================
// HISTÓRICO - LIMPAR TUDO
// ============================================

function limparHistorico() {
    if (confirm('Tem certeza que deseja deletar TODAS as plantações? Esta ação não pode ser desfeita!')) {
        localStorage.removeItem(STORAGE_KEY);
        atualizarDashboard();
        exibirPlantacoes();
        atualizarHistorico();
        alert('Todos os dados foram deletados!');
    }
}

// ============================================
// DICAS - EXPANDIR/COLAPSAR
// ============================================

function expandirDica(button) {
    const dicaExpandida = button.nextElementSibling;
    
    if (dicaExpandida.style.display === 'none') {
        dicaExpandida.style.display = 'block';
        button.textContent = 'Fechar';
    } else {
        dicaExpandida.style.display = 'none';
        button.textContent = 'Saiba Mais';
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    atualizarDashboard();
    exibirPlantacoes();
    atualizarHistorico();
});

// Atualizar dashboard a cada 5 segundos
setInterval(atualizarDashboard, 5000);
