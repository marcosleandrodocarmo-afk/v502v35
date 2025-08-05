/**
 * ARQV30 Enhanced v2.0 - Enhanced Analysis Manager
 * Sistema aprimorado de análise com agentes psicológicos
 */

class EnhancedAnalysisManager {
    constructor() {
        this.currentAnalysis = null;
        this.progressTracker = null;
        this.psychologicalAgents = [
            'arqueologist',
            'visceral_master', 
            'drivers_architect',
            'visual_director',
            'anti_objection',
            'pre_pitch_architect'
        ];
        
        this.init();
    }
    
    init() {
        console.log('🧠 Enhanced Analysis Manager inicializado');
        this.setupEventListeners();
        this.loadAgentCapabilities();
    }
    
    setupEventListeners() {
        // Form submission
        const form = document.getElementById('enhancedAnalysisForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-enhanced')) {
                this.switchTab(e.target);
            }
        });
        
        // Accordion toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.accordion-header-enhanced')) {
                this.toggleAccordion(e.target.closest('.accordion-enhanced'));
            }
        });
        
        // Agent testing
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-test-agent]')) {
                const agentName = e.target.closest('[data-test-agent]').dataset.testAgent;
                this.testPsychologicalAgent(agentName);
            }
        });
    }
    
    async loadAgentCapabilities() {
        try {
            const response = await fetch('/api/get_agent_capabilities');
            const data = await response.json();
            
            if (data.success) {
                this.displayAgentCapabilities(data.agents);
            }
        } catch (error) {
            console.error('Erro ao carregar capacidades dos agentes:', error);
        }
    }
    
    displayAgentCapabilities(agents) {
        const container = document.getElementById('agentCapabilities');
        if (!container) return;
        
        container.innerHTML = `
            <div class="psychological-section">
                <div class="section-header">
                    <div class="section-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div>
                        <h3 class="section-title">Agentes Psicológicos Especializados</h3>
                        <p class="section-subtitle">Sistema de análise arqueológica com 6 agentes especializados</p>
                    </div>
                </div>
                
                <div class="grid-enhanced grid-2">
                    ${Object.entries(agents).map(([key, agent]) => `
                        <div class="agent-card">
                            <div class="agent-name">${agent.name}</div>
                            <div class="agent-mission">${agent.mission}</div>
                            <div class="agent-specialties">
                                ${agent.specialties.map(specialty => `
                                    <span class="badge-enhanced badge-info">${specialty}</span>
                                `).join('')}
                            </div>
                            <button class="btn-secondary-enhanced mt-4" data-test-agent="${key}">
                                <i class="fas fa-test-tube"></i>
                                Testar Agente
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Adiciona session_id único
        data.session_id = `ultra_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            this.showProgress();
            this.startProgressTracking(data.session_id);
            
            const response = await fetch('/api/analyze_ultra_enhanced', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.currentAnalysis = result;
                this.displayEnhancedResults(result);
                this.hideProgress();
            } else {
                throw new Error(result.message || 'Erro na análise');
            }
            
        } catch (error) {
            console.error('Erro na análise:', error);
            this.showError(error.message);
            this.hideProgress();
        }
    }
    
    showProgress() {
        const progressArea = document.getElementById('progressArea');
        if (progressArea) {
            progressArea.style.display = 'block';
            progressArea.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    hideProgress() {
        const progressArea = document.getElementById('progressArea');
        if (progressArea) {
            setTimeout(() => {
                progressArea.style.display = 'none';
            }, 2000);
        }
    }
    
    async startProgressTracking(sessionId) {
        this.progressTracker = setInterval(async () => {
            try {
                const response = await fetch(`/api/get_progress/${sessionId}`);
                const data = await response.json();
                
                if (data.success) {
                    this.updateProgress(data.progress);
                    
                    if (data.progress.is_complete) {
                        clearInterval(this.progressTracker);
                    }
                }
            } catch (error) {
                console.error('Erro no tracking de progresso:', error);
            }
        }, 2000);
    }
    
    updateProgress(progress) {
        // Atualiza barra de progresso
        const progressFill = document.querySelector('.progress-fill-enhanced');
        if (progressFill) {
            progressFill.style.width = `${progress.percentage}%`;
        }
        
        // Atualiza texto do step
        const currentStep = document.getElementById('currentStepEnhanced');
        if (currentStep) {
            currentStep.textContent = progress.current_message;
        }
        
        // Atualiza contador
        const stepCounter = document.getElementById('stepCounterEnhanced');
        if (stepCounter) {
            stepCounter.textContent = `${progress.current_step}/${progress.total_steps}`;
        }
        
        // Atualiza tempo estimado
        const estimatedTime = document.getElementById('estimatedTimeEnhanced');
        if (estimatedTime) {
            const minutes = Math.floor(progress.estimated_remaining / 60);
            const seconds = Math.floor(progress.estimated_remaining % 60);
            estimatedTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    displayEnhancedResults(analysis) {
        const resultsArea = document.getElementById('resultsArea');
        if (!resultsArea) return;
        
        resultsArea.style.display = 'block';
        resultsArea.innerHTML = this.generateEnhancedResultsHTML(analysis);
        resultsArea.scrollIntoView({ behavior: 'smooth' });
        
        // Ativa funcionalidades interativas
        this.activateInteractiveFeatures();
    }
    
    generateEnhancedResultsHTML(analysis) {
        return `
            <div class="results-enhanced">
                <div class="results-header-enhanced">
                    <div class="results-title-enhanced">
                        <i class="fas fa-microscope"></i>
                        Análise Arqueológica Ultra-Detalhada Concluída
                    </div>
                    <div class="results-actions-enhanced">
                        <button class="btn-secondary-enhanced" onclick="enhancedAnalysis.downloadPDF()">
                            <i class="fas fa-file-pdf"></i>
                            Relatório PDF
                        </button>
                        <button class="btn-secondary-enhanced" onclick="enhancedAnalysis.saveJSON()">
                            <i class="fas fa-download"></i>
                            Dados JSON
                        </button>
                        <button class="btn-secondary-enhanced" onclick="location.reload()">
                            <i class="fas fa-plus"></i>
                            Nova Análise
                        </button>
                    </div>
                </div>
                
                <div class="results-content-enhanced">
                    ${this.generateTabsHTML(analysis)}
                    ${this.generateTabContentHTML(analysis)}
                </div>
            </div>
        `;
    }
    
    generateTabsHTML(analysis) {
        const tabs = [
            { id: 'overview', label: 'Visão Geral', icon: 'fas fa-chart-line' },
            { id: 'archaeological', label: 'Análise Arqueológica', icon: 'fas fa-search' },
            { id: 'avatar', label: 'Avatar Visceral', icon: 'fas fa-user-secret' },
            { id: 'drivers', label: 'Drivers Mentais', icon: 'fas fa-brain' },
            { id: 'provis', label: 'Provas Visuais', icon: 'fas fa-eye' },
            { id: 'objections', label: 'Anti-Objeção', icon: 'fas fa-shield-alt' },
            { id: 'prepitch', label: 'Pré-Pitch', icon: 'fas fa-theater-masks' },
            { id: 'metrics', label: 'Métricas Forenses', icon: 'fas fa-chart-bar' }
        ];
        
        return `
            <div class="tabs-enhanced">
                <div class="tab-list-enhanced">
                    ${tabs.map((tab, index) => `
                        <button class="tab-enhanced ${index === 0 ? 'active' : ''}" 
                                data-tab="${tab.id}">
                            <i class="${tab.icon}"></i>
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    generateTabContentHTML(analysis) {
        return `
            <div class="tab-content-enhanced">
                <div class="tab-pane-enhanced active" data-tab-content="overview">
                    ${this.generateOverviewHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="archaeological">
                    ${this.generateArchaeologicalHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="avatar">
                    ${this.generateAvatarHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="drivers">
                    ${this.generateDriversHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="provis">
                    ${this.generateProvisHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="objections">
                    ${this.generateObjectionsHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="prepitch">
                    ${this.generatePrePitchHTML(analysis)}
                </div>
                
                <div class="tab-pane-enhanced" data-tab-content="metrics">
                    ${this.generateMetricsHTML(analysis)}
                </div>
            </div>
        `;
    }
    
    generateOverviewHTML(analysis) {
        const metadata = analysis.metadata_ultra_enhanced || {};
        const forensics = analysis.metricas_forenses_detalhadas || {};
        
        return `
            <div class="psychological-section">
                <h3>📊 Visão Geral da Análise Arqueológica</h3>
                
                <div class="metrics-enhanced">
                    <div class="metric-card-enhanced">
                        <div class="metric-value-enhanced">${metadata.agentes_psicologicos_utilizados?.length || 0}</div>
                        <div class="metric-label-enhanced">Agentes Psicológicos</div>
                    </div>
                    
                    <div class="metric-card-enhanced">
                        <div class="metric-value-enhanced">${metadata.camadas_analise || 0}</div>
                        <div class="metric-label-enhanced">Camadas Analisadas</div>
                    </div>
                    
                    <div class="metric-card-enhanced">
                        <div class="metric-value-enhanced">${forensics.densidade_persuasiva || 0}</div>
                        <div class="metric-label-enhanced">Densidade Persuasiva</div>
                    </div>
                    
                    <div class="metric-card-enhanced">
                        <div class="metric-value-enhanced">${forensics.score_geral_persuasao || 0}%</div>
                        <div class="metric-label-enhanced">Score Persuasão</div>
                    </div>
                </div>
                
                <div class="alert-enhanced alert-success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Análise Arqueológica Concluída!</strong>
                        <p>Sistema de agentes psicológicos executou análise ultra-detalhada com ${metadata.densidade_persuasiva || 0} elementos persuasivos identificados.</p>
                    </div>
                </div>
                
                ${analysis.relatorio_arqueologico ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-scroll"></i>
                            </div>
                            <h4 class="card-title-enhanced">Relatório Arqueológico</h4>
                        </div>
                        <div class="code-enhanced">
                            ${analysis.relatorio_arqueologico.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateArchaeologicalHTML(analysis) {
        const archaeological = analysis.agentes_psicologicos_detalhados?.arqueologist || {};
        
        return `
            <div class="psychological-section">
                <h3>🔬 Análise Arqueológica - 12 Camadas Profundas</h3>
                
                <div class="agent-card">
                    <div class="agent-name">ARQUEÓLOGO MESTRE DA PERSUASÃO</div>
                    <div class="agent-mission">Escavação do DNA completo da conversão</div>
                </div>
                
                ${archaeological.analise_arqueologica ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-search"></i>
                            </div>
                            <h4 class="card-title-enhanced">DNA da Conversão Escavado</h4>
                        </div>
                        <div class="card-content">
                            <p><strong>Camadas Analisadas:</strong> ${archaeological.analise_arqueologica.camadas_analisadas || 0}</p>
                            <div class="mt-4">
                                <h5>Insights Escavados:</h5>
                                <ul class="list-enhanced">
                                    ${(archaeological.analise_arqueologica.insights_escavados || []).map(insight => `
                                        <li class="list-item-enhanced">
                                            <i class="fas fa-gem list-icon-enhanced"></i>
                                            <span class="list-content-enhanced">${insight}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${archaeological.analise_arqueologica?.metricas_forenses ? `
                    <div class="forensic-metrics">
                        <h4>📊 Métricas Forenses Objetivas</h4>
                        <div class="forensic-grid">
                            <div class="forensic-item">
                                <div class="forensic-value">${archaeological.analise_arqueologica.metricas_forenses.densidade_informacional || 0}</div>
                                <div class="forensic-label">Densidade Informacional</div>
                            </div>
                            <div class="forensic-item">
                                <div class="forensic-value">${archaeological.analise_arqueologica.metricas_forenses.elementos_numericos || 0}</div>
                                <div class="forensic-label">Elementos Numéricos</div>
                            </div>
                            <div class="forensic-item">
                                <div class="forensic-value">${(archaeological.analise_arqueologica.metricas_forenses.intensidade_linguistica || 0).toFixed(1)}%</div>
                                <div class="forensic-label">Intensidade Linguística</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateAvatarHTML(analysis) {
        const visceral = analysis.agentes_psicologicos_detalhados?.visceral_master || {};
        const avatar = visceral.avatar_visceral || {};
        
        return `
            <div class="psychological-section">
                <h3>👤 Avatar Visceral - Engenharia Reversa Psicológica</h3>
                
                <div class="agent-card">
                    <div class="agent-name">MESTRE DA PERSUASÃO VISCERAL</div>
                    <div class="agent-mission">Mergulho profundo em dores, desejos e medos</div>
                </div>
                
                ${avatar.nome_ficticio ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-user-secret"></i>
                            </div>
                            <h4 class="card-title-enhanced">${avatar.nome_ficticio}</h4>
                        </div>
                        <div class="card-content">
                            ${avatar.perfil_demografico_visceral ? `
                                <div class="mb-6">
                                    <h5>🎭 Perfil Demográfico Visceral</h5>
                                    <div class="grid-enhanced grid-2">
                                        ${Object.entries(avatar.perfil_demografico_visceral).map(([key, value]) => `
                                            <div class="info-item">
                                                <strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong>
                                                <span>${value}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${avatar.feridas_abertas ? `
                                <div class="mb-6">
                                    <h5>🩸 Feridas Abertas (Dores Inconfessáveis)</h5>
                                    <ul class="list-enhanced">
                                        ${avatar.feridas_abertas.map(dor => `
                                            <li class="list-item-enhanced">
                                                <i class="fas fa-heart-broken list-icon-enhanced" style="color: var(--accent-error);"></i>
                                                <span class="list-content-enhanced">${dor}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${avatar.sonhos_proibidos ? `
                                <div class="mb-6">
                                    <h5>✨ Sonhos Proibidos (Desejos Secretos)</h5>
                                    <ul class="list-enhanced">
                                        ${avatar.sonhos_proibidos.map(desejo => `
                                            <li class="list-item-enhanced">
                                                <i class="fas fa-star list-icon-enhanced" style="color: var(--accent-warning);"></i>
                                                <span class="list-content-enhanced">${desejo}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${avatar.demonios_internos ? `
                                <div class="mb-6">
                                    <h5>👹 Demônios Internos (Medos Paralisantes)</h5>
                                    <ul class="list-enhanced">
                                        ${avatar.demonios_internos.map(medo => `
                                            <li class="list-item-enhanced">
                                                <i class="fas fa-skull list-icon-enhanced" style="color: var(--accent-error);"></i>
                                                <span class="list-content-enhanced">${medo}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateDriversHTML(analysis) {
        const drivers = analysis.drivers_mentais_arsenal_completo || [];
        
        return `
            <div class="psychological-section">
                <h3>🧠 Arsenal de Drivers Mentais Customizados</h3>
                
                <div class="agent-card">
                    <div class="agent-name">ARQUITETO DE DRIVERS MENTAIS</div>
                    <div class="agent-mission">Gatilhos psicológicos como âncoras emocionais</div>
                </div>
                
                <div class="alert-enhanced alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Arsenal dos 19 Drivers Universais</strong>
                        <p>${drivers.length} drivers mentais customizados criados para máximo impacto psicológico.</p>
                    </div>
                </div>
                
                <div class="grid-enhanced">
                    ${drivers.map((driver, index) => `
                        <div class="driver-card">
                            <div class="driver-name">DRIVER ${index + 1}: ${driver.nome || 'Driver Mental'}</div>
                            <div class="driver-trigger">
                                <strong>Gatilho Central:</strong> ${driver.gatilho_central || 'N/A'}
                            </div>
                            
                            ${driver.definicao_visceral ? `
                                <div class="mb-4">
                                    <strong>Definição Visceral:</strong>
                                    <p>${driver.definicao_visceral}</p>
                                </div>
                            ` : ''}
                            
                            ${driver.roteiro_ativacao ? `
                                <div class="accordion-enhanced">
                                    <div class="accordion-header-enhanced">
                                        <div class="accordion-title-enhanced">
                                            <i class="fas fa-play-circle"></i>
                                            Roteiro de Ativação
                                        </div>
                                        <i class="fas fa-chevron-down accordion-icon-enhanced"></i>
                                    </div>
                                    <div class="accordion-content-enhanced">
                                        ${driver.roteiro_ativacao.pergunta_abertura ? `
                                            <div class="mb-4">
                                                <strong>Pergunta de Abertura:</strong>
                                                <div class="driver-script">"${driver.roteiro_ativacao.pergunta_abertura}"</div>
                                            </div>
                                        ` : ''}
                                        
                                        ${driver.roteiro_ativacao.historia_analogia ? `
                                            <div class="mb-4">
                                                <strong>História/Analogia:</strong>
                                                <div class="driver-script">${driver.roteiro_ativacao.historia_analogia}</div>
                                            </div>
                                        ` : ''}
                                        
                                        ${driver.roteiro_ativacao.comando_acao ? `
                                            <div class="mb-4">
                                                <strong>Comando de Ação:</strong>
                                                <div class="driver-script">"${driver.roteiro_ativacao.comando_acao}"</div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${driver.frases_ancoragem ? `
                                <div class="mt-4">
                                    <strong>Frases de Ancoragem:</strong>
                                    <ul class="list-enhanced">
                                        ${driver.frases_ancoragem.map(frase => `
                                            <li class="list-item-enhanced">
                                                <i class="fas fa-anchor list-icon-enhanced"></i>
                                                <span class="list-content-enhanced">"${frase}"</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    generateProvisHTML(analysis) {
        const provas = analysis.provas_visuais_arsenal_completo || [];
        
        return `
            <div class="psychological-section">
                <h3>🎭 Arsenal de Provas Visuais Instantâneas (PROVIs)</h3>
                
                <div class="agent-card">
                    <div class="agent-name">DIRETOR SUPREMO DE EXPERIÊNCIAS</div>
                    <div class="agent-mission">Transformar conceitos abstratos em experiências físicas</div>
                </div>
                
                <div class="alert-enhanced alert-warning">
                    <i class="fas fa-eye"></i>
                    <div>
                        <strong>Sistema Completo de PROVIs</strong>
                        <p>${provas.length} provas visuais criadas para destruir objeções e instalar crenças.</p>
                    </div>
                </div>
                
                <div class="grid-enhanced">
                    ${provas.map((prova, index) => `
                        <div class="provi-card">
                            <div class="provi-name">${prova.nome || `PROVI ${index + 1}`}</div>
                            
                            <div class="mb-4">
                                <strong>Conceito-Alvo:</strong> ${prova.conceito_alvo || 'N/A'}
                            </div>
                            
                            <div class="provi-experiment">
                                <strong>Experimento:</strong>
                                <p>${prova.experimento || 'Descrição do experimento visual'}</p>
                            </div>
                            
                            ${prova.materiais ? `
                                <div class="mt-4">
                                    <strong>Materiais Necessários:</strong>
                                    <ul class="list-enhanced">
                                        ${prova.materiais.map(material => `
                                            <li class="list-item-enhanced">
                                                <i class="fas fa-tools list-icon-enhanced"></i>
                                                <span class="list-content-enhanced">${material}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${prova.roteiro_completo ? `
                                <div class="accordion-enhanced">
                                    <div class="accordion-header-enhanced">
                                        <div class="accordion-title-enhanced">
                                            <i class="fas fa-script"></i>
                                            Roteiro Completo
                                        </div>
                                        <i class="fas fa-chevron-down accordion-icon-enhanced"></i>
                                    </div>
                                    <div class="accordion-content-enhanced">
                                        ${Object.entries(prova.roteiro_completo).map(([fase, script]) => `
                                            <div class="mb-3">
                                                <strong>${fase.toUpperCase()}:</strong>
                                                <div class="driver-script">${script}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    generateObjectionsHTML(analysis) {
        const antiObj = analysis.sistema_anti_objecao_ultra || {};
        
        return `
            <div class="psychological-section">
                <h3>🛡️ Sistema Anti-Objeção Psicológico Completo</h3>
                
                <div class="agent-card">
                    <div class="agent-name">ESPECIALISTA EM PSICOLOGIA DE VENDAS</div>
                    <div class="agent-mission">Arsenal psicológico para neutralizar todas as objeções</div>
                </div>
                
                ${antiObj.objecoes_universais ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h4 class="card-title-enhanced">Objeções Universais</h4>
                        </div>
                        <div class="card-content">
                            ${Object.entries(antiObj.objecoes_universais).map(([tipo, objecao]) => `
                                <div class="accordion-enhanced">
                                    <div class="accordion-header-enhanced">
                                        <div class="accordion-title-enhanced">
                                            <i class="fas fa-exclamation-triangle"></i>
                                            ${tipo.toUpperCase()}: ${objecao.objecao || 'Objeção'}
                                        </div>
                                        <i class="fas fa-chevron-down accordion-icon-enhanced"></i>
                                    </div>
                                    <div class="accordion-content-enhanced">
                                        <div class="mb-4">
                                            <strong>Raiz Emocional:</strong>
                                            <p>${objecao.raiz_emocional || 'N/A'}</p>
                                        </div>
                                        
                                        <div class="mb-4">
                                            <strong>Contra-Ataque:</strong>
                                            <div class="driver-script">${objecao.contra_ataque || 'N/A'}</div>
                                        </div>
                                        
                                        ${objecao.scripts_personalizados ? `
                                            <div>
                                                <strong>Scripts Personalizados:</strong>
                                                <ul class="list-enhanced">
                                                    ${objecao.scripts_personalizados.map(script => `
                                                        <li class="list-item-enhanced">
                                                            <i class="fas fa-quote-left list-icon-enhanced"></i>
                                                            <span class="list-content-enhanced">"${script}"</span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${antiObj.arsenal_emergencia ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-first-aid"></i>
                            </div>
                            <h4 class="card-title-enhanced">Arsenal de Emergência</h4>
                        </div>
                        <div class="card-content">
                            <ul class="list-enhanced">
                                ${antiObj.arsenal_emergencia.map(script => `
                                    <li class="list-item-enhanced">
                                        <i class="fas fa-fire list-icon-enhanced" style="color: var(--accent-error);"></i>
                                        <span class="list-content-enhanced">"${script}"</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generatePrePitchHTML(analysis) {
        const prePitch = analysis.pre_pitch_invisivel_ultra || {};
        
        return `
            <div class="psychological-section">
                <h3>🎯 Pré-Pitch Invisível - Orquestração Psicológica</h3>
                
                <div class="agent-card">
                    <div class="agent-name">MESTRE DO PRÉ-PITCH INVISÍVEL</div>
                    <div class="agent-mission">Sinfonia de tensão psicológica que prepara a venda</div>
                </div>
                
                ${prePitch.orquestracao_emocional ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-music"></i>
                            </div>
                            <h4 class="card-title-enhanced">Orquestração Emocional</h4>
                        </div>
                        <div class="card-content">
                            ${prePitch.orquestracao_emocional.sequencia_psicologica ? `
                                <div class="timeline-enhanced">
                                    ${prePitch.orquestracao_emocional.sequencia_psicologica.map((fase, index) => `
                                        <div class="timeline-item-enhanced">
                                            <div class="timeline-marker-enhanced">${index + 1}</div>
                                            <div class="timeline-content-enhanced">
                                                <h5>${fase.fase?.toUpperCase() || `FASE ${index + 1}`}</h5>
                                                <p><strong>Objetivo:</strong> ${fase.objetivo || 'N/A'}</p>
                                                <p><strong>Duração:</strong> ${fase.duracao || 'N/A'}</p>
                                                ${fase.narrativa ? `
                                                    <div class="driver-script mt-3">
                                                        ${fase.narrativa}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${prePitch.roteiro_completo ? `
                    <div class="card-enhanced">
                        <div class="card-header-enhanced">
                            <div class="card-icon-enhanced">
                                <i class="fas fa-script"></i>
                            </div>
                            <h4 class="card-title-enhanced">Roteiro Completo</h4>
                        </div>
                        <div class="card-content">
                            ${Object.entries(prePitch.roteiro_completo).map(([secao, conteudo]) => `
                                <div class="accordion-enhanced">
                                    <div class="accordion-header-enhanced">
                                        <div class="accordion-title-enhanced">
                                            <i class="fas fa-play"></i>
                                            ${secao.toUpperCase()}
                                        </div>
                                        <i class="fas fa-chevron-down accordion-icon-enhanced"></i>
                                    </div>
                                    <div class="accordion-content-enhanced">
                                        ${typeof conteudo === 'object' ? `
                                            ${Object.entries(conteudo).map(([key, value]) => `
                                                <div class="mb-3">
                                                    <strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong>
                                                    <div class="driver-script">${value}</div>
                                                </div>
                                            `).join('')}
                                        ` : `
                                            <div class="driver-script">${conteudo}</div>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateMetricsHTML(analysis) {
        const forensics = analysis.metricas_forenses_detalhadas || {};
        
        return `
            <div class="psychological-section">
                <h3>📊 Métricas Forenses Detalhadas</h3>
                
                <div class="forensic-metrics">
                    <h4>🎯 Densidade Persuasiva</h4>
                    <div class="forensic-grid">
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.densidade_persuasiva?.argumentos_logicos || 0}</div>
                            <div class="forensic-label">Argumentos Lógicos</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.densidade_persuasiva?.argumentos_emocionais || 0}</div>
                            <div class="forensic-label">Argumentos Emocionais</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.densidade_persuasiva?.ratio_promessa_prova || '1:1'}</div>
                            <div class="forensic-label">Ratio Promessa/Prova</div>
                        </div>
                    </div>
                </div>
                
                <div class="forensic-metrics">
                    <h4>🔥 Intensidade Emocional</h4>
                    <div class="forensic-grid">
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.intensidade_emocional?.medo || 0}/10</div>
                            <div class="forensic-label">Medo</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.intensidade_emocional?.desejo || 0}/10</div>
                            <div class="forensic-label">Desejo</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.intensidade_emocional?.urgencia || 0}/10</div>
                            <div class="forensic-label">Urgência</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.intensidade_emocional?.aspiracao || 0}/10</div>
                            <div class="forensic-label">Aspiração</div>
                        </div>
                    </div>
                </div>
                
                <div class="forensic-metrics">
                    <h4>🛡️ Cobertura de Objeções</h4>
                    <div class="forensic-grid">
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.cobertura_objecoes?.universais_cobertas || 0}/3</div>
                            <div class="forensic-label">Universais Cobertas</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.cobertura_objecoes?.ocultas_identificadas || 0}/5</div>
                            <div class="forensic-label">Ocultas Identificadas</div>
                        </div>
                        <div class="forensic-item">
                            <div class="forensic-value">${forensics.cobertura_objecoes?.arsenal_emergencia || 0}</div>
                            <div class="forensic-label">Arsenal Emergência</div>
                        </div>
                    </div>
                </div>
                
                ${forensics.densidade_persuasiva?.gatilhos_cialdini ? `
                    <div class="forensic-metrics">
                        <h4>⚡ Gatilhos de Cialdini</h4>
                        <div class="forensic-grid">
                            ${Object.entries(forensics.densidade_persuasiva.gatilhos_cialdini).map(([gatilho, valor]) => `
                                <div class="forensic-item">
                                    <div class="forensic-value">${valor}</div>
                                    <div class="forensic-label">${gatilho.charAt(0).toUpperCase() + gatilho.slice(1)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="alert-enhanced ${forensics.arsenal_completo ? 'alert-success' : 'alert-warning'}">
                    <i class="fas fa-${forensics.arsenal_completo ? 'check-circle' : 'exclamation-triangle'}"></i>
                    <div>
                        <strong>Arsenal ${forensics.arsenal_completo ? 'Completo' : 'Parcial'}</strong>
                        <p>Score Geral de Persuasão: ${forensics.score_geral_persuasao || 0}%</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    switchTab(tabElement) {
        const tabId = tabElement.dataset.tab;
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-enhanced').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-pane-enhanced').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Show selected tab content
        const targetPane = document.querySelector(`[data-tab-content="${tabId}"]`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }
    
    toggleAccordion(accordionElement) {
        accordionElement.classList.toggle('open');
    }
    
    async testPsychologicalAgent(agentName) {
        try {
            const testData = {
                agent: agentName,
                test_data: {
                    segmento: 'Produtos Digitais',
                    produto: 'Curso Online',
                    publico: 'Empreendedores'
                }
            };
            
            const response = await fetch('/api/test_psychological_agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showModal(`Teste do Agente ${agentName}`, `
                    <div class="alert-enhanced alert-success">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <strong>Agente funcionando!</strong>
                            <p>Status: ${result.status}</p>
                        </div>
                    </div>
                    <div class="code-enhanced">
                        ${JSON.stringify(result.result, null, 2)}
                    </div>
                `);
            } else {
                throw new Error(result.message || 'Erro no teste');
            }
            
        } catch (error) {
            this.showModal(`Erro no Teste`, `
                <div class="alert-enhanced alert-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <strong>Erro no teste do agente</strong>
                        <p>${error.message}</p>
                    </div>
                </div>
            `);
        }
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-enhanced';
        modal.innerHTML = `
            <div class="modal-content-enhanced">
                <div class="modal-header-enhanced">
                    <h3 class="modal-title-enhanced">${title}</h3>
                    <button class="modal-close-enhanced" onclick="this.closest('.modal-enhanced').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body-enhanced">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    activateInteractiveFeatures() {
        // Ativa tooltips
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.classList.add('tooltip-enhanced');
        });
        
        // Ativa animações de entrada
        document.querySelectorAll('.card-enhanced, .psychological-section').forEach(element => {
            element.classList.add('fade-in');
        });
    }
    
    async downloadPDF() {
        if (!this.currentAnalysis) {
            this.showError('Nenhuma análise disponível para download');
            return;
        }
        
        try {
            const response = await fetch('/api/generate_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentAnalysis)
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analise_arqueologica_${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Erro ao gerar PDF');
            }
        } catch (error) {
            this.showError('Erro ao baixar PDF: ' + error.message);
        }
    }
    
    saveJSON() {
        if (!this.currentAnalysis) {
            this.showError('Nenhuma análise disponível para salvar');
            return;
        }
        
        const dataStr = JSON.stringify(this.currentAnalysis, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise_arqueologica_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert-enhanced alert-error';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong>Erro</strong>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedAnalysis = new EnhancedAnalysisManager();
});