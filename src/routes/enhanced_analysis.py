#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ARQV30 Enhanced v2.0 - Enhanced Analysis Routes
Rotas aprimoradas com agentes psicológicos
"""

import os
import logging
import time
import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from services.enhanced_analysis_orchestrator import enhanced_orchestrator
from services.psychological_agents import psychological_agents
from database import db_manager
from routes.progress import get_progress_tracker, update_analysis_progress
from services.auto_save_manager import auto_save_manager, salvar_etapa, salvar_erro

logger = logging.getLogger(__name__)

# Cria blueprint
enhanced_analysis_bp = Blueprint('enhanced_analysis', __name__)

@enhanced_analysis_bp.route('/analyze_ultra_enhanced', methods=['POST'])
def analyze_ultra_enhanced():
    """Endpoint para análise ultra-aprimorada com agentes psicológicos"""
    
    try:
        start_time = time.time()
        logger.info("🚀 Iniciando análise ultra-aprimorada com agentes psicológicos")
        
        # Coleta dados da requisição
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'Dados não fornecidos',
                'message': 'Envie os dados da análise no corpo da requisição'
            }), 400
        
        # Validação básica
        if not data.get('segmento'):
            return jsonify({
                'error': 'Segmento obrigatório',
                'message': 'O campo "segmento" é obrigatório para análise'
            }), 400
        
        # Adiciona session_id se não fornecido
        if not data.get('session_id'):
            data['session_id'] = f"ultra_session_{int(time.time())}_{os.urandom(4).hex()}"
        
        session_id = data['session_id']
        auto_save_manager.iniciar_sessao(session_id)
        
        # Salva dados de entrada
        salvar_etapa("requisicao_ultra_enhanced", {
            "input_data": data,
            "timestamp": datetime.now().isoformat(),
            "ip_address": request.remote_addr
        }, categoria="analise_completa")
        
        # Inicia rastreamento de progresso
        progress_tracker = get_progress_tracker(session_id)
        
        def progress_callback(step: int, message: str, details: str = None):
            update_analysis_progress(session_id, step, message, details)
            salvar_etapa("progresso_ultra", {
                "step": step,
                "message": message,
                "details": details
            }, categoria="logs")
        
        # Executa análise ultra-aprimorada
        logger.info("🧠 Executando análise ultra-aprimorada com agentes psicológicos...")
        
        ultra_analysis = enhanced_orchestrator.execute_ultra_enhanced_analysis(
            data,
            session_id=session_id,
            progress_callback=progress_callback
        )
        
        # Salva resultado da análise
        salvar_etapa("ultra_analysis_resultado", ultra_analysis, categoria="analise_completa")
        
        # Marca progresso como completo
        progress_tracker.complete()
        
        # Salva no banco de dados
        try:
            db_record = db_manager.create_analysis({
                **data,
                **ultra_analysis,
                'analysis_type': 'ultra_enhanced_psychological',
                'session_id': session_id,
                'status': 'completed'
            })
            
            if db_record:
                ultra_analysis['database_id'] = db_record.get('id')
                ultra_analysis['local_files'] = db_record.get('local_files')
                logger.info(f"✅ Análise ultra-aprimorada salva: ID {db_record.get('id')}")
        except Exception as e:
            logger.error(f"❌ Erro ao salvar no banco: {e}")
            ultra_analysis['database_warning'] = f"Falha ao salvar: {str(e)}"
        
        # Calcula tempo de processamento
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Adiciona metadados finais
        ultra_analysis['metadata_final'] = {
            'processing_time_seconds': processing_time,
            'processing_time_formatted': f"{int(processing_time // 60)}m {int(processing_time % 60)}s",
            'request_timestamp': datetime.now().isoformat(),
            'session_id': session_id,
            'analysis_type': 'ultra_enhanced_psychological',
            'agentes_psicologicos': True,
            'analise_arqueologica': True,
            'densidade_persuasiva_alta': True,
            'arsenal_completo': True
        }
        
        # Salva resposta final
        salvar_etapa("resposta_ultra_final", ultra_analysis, categoria="analise_completa")
        
        logger.info(f"✅ Análise ultra-aprimorada concluída em {processing_time:.2f} segundos")
        
        return jsonify(ultra_analysis)
        
    except Exception as e:
        logger.error(f"❌ Erro crítico na análise ultra-aprimorada: {str(e)}", exc_info=True)
        
        return jsonify({
            'error': 'Erro na análise ultra-aprimorada',
            'message': str(e),
            'timestamp': datetime.now().isoformat(),
            'recommendation': 'Configure todas as APIs necessárias e tente novamente',
            'session_id': locals().get('session_id', 'unknown')
        }), 500

@enhanced_analysis_bp.route('/test_psychological_agents', methods=['POST'])
def test_psychological_agents():
    """Testa agentes psicológicos individualmente"""
    
    try:
        data = request.get_json()
        agent_name = data.get('agent', 'all')
        test_data = data.get('test_data', {
            'segmento': 'Produtos Digitais',
            'produto': 'Curso Online',
            'publico': 'Empreendedores'
        })
        
        if agent_name == 'all':
            # Testa todos os agentes
            results = {}
            for name, agent in psychological_agents.agents.items():
                try:
                    result = agent.execute_analysis(test_data)
                    results[name] = {
                        'success': True,
                        'result': result,
                        'status': result.get('status', 'unknown')
                    }
                except Exception as e:
                    results[name] = {
                        'success': False,
                        'error': str(e)
                    }
            
            return jsonify({
                'success': True,
                'agent_results': results,
                'total_agents': len(psychological_agents.agents),
                'successful_agents': len([r for r in results.values() if r['success']])
            })
        
        elif agent_name in psychological_agents.agents:
            # Testa agente específico
            agent = psychological_agents.agents[agent_name]
            result = agent.execute_analysis(test_data)
            
            return jsonify({
                'success': True,
                'agent': agent_name,
                'result': result,
                'status': result.get('status', 'unknown')
            })
        
        else:
            return jsonify({
                'error': 'Agente não encontrado',
                'available_agents': list(psychological_agents.agents.keys())
            }), 400
            
    except Exception as e:
        logger.error(f"Erro no teste de agentes: {e}")
        return jsonify({
            'error': 'Erro no teste de agentes psicológicos',
            'message': str(e)
        }), 500

@enhanced_analysis_bp.route('/get_agent_capabilities', methods=['GET'])
def get_agent_capabilities():
    """Retorna capacidades dos agentes psicológicos"""
    
    try:
        capabilities = {
            'arqueologist': {
                'name': 'ARQUEÓLOGO MESTRE DA PERSUASÃO',
                'mission': 'Escavar DNA completo da conversão',
                'layers': 12,
                'specialties': ['Análise forense', 'Métricas objetivas', 'Cronometragem precisa']
            },
            'visceral_master': {
                'name': 'MESTRE DA PERSUASÃO VISCERAL',
                'mission': 'Engenharia reversa psicológica profunda',
                'focus': ['Dores inconfessáveis', 'Desejos proibidos', 'Medos paralisantes'],
                'specialties': ['Avatar visceral', 'Linguagem interna', 'Segmentação psicológica']
            },
            'drivers_architect': {
                'name': 'ARQUITETO DE DRIVERS MENTAIS',
                'mission': 'Criar gatilhos psicológicos como âncoras',
                'arsenal': 19,
                'specialties': ['Drivers universais', 'Customização profunda', 'Sequenciamento estratégico']
            },
            'visual_director': {
                'name': 'DIRETOR SUPREMO DE EXPERIÊNCIAS',
                'mission': 'Transformar conceitos em experiências físicas',
                'categories': ['Destruidoras', 'Criadoras', 'Instaladoras', 'Provas'],
                'specialties': ['PROVIs impactantes', 'Roteiros completos', 'Orquestração visual']
            },
            'anti_objection': {
                'name': 'ESPECIALISTA EM PSICOLOGIA DE VENDAS',
                'mission': 'Arsenal psicológico anti-objeção',
                'coverage': ['3 universais', '5 ocultas'],
                'specialties': ['Neutralização', 'Scripts personalizados', 'Arsenal emergência']
            },
            'pre_pitch_architect': {
                'name': 'MESTRE DO PRÉ-PITCH INVISÍVEL',
                'mission': 'Orquestração de tensão psicológica',
                'phases': ['Emocional 70%', 'Lógica 30%'],
                'specialties': ['Sequência psicológica', 'Roteiros completos', 'Transições suaves']
            }
        }
        
        return jsonify({
            'success': True,
            'total_agents': len(capabilities),
            'agents': capabilities,
            'system_status': 'operational',
            'psychological_analysis_available': True
        })
        
    except Exception as e:
        logger.error(f"Erro ao obter capacidades: {e}")
        return jsonify({
            'error': 'Erro ao obter capacidades dos agentes',
            'message': str(e)
        }), 500