import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Building, DollarSign, CheckCircle, Star, Facebook, Instagram, Linkedin, ArrowRight, Users, Shield, TrendingUp, MessageCircle, Clock, AlertCircle, Award, Eye } from 'lucide-react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { authService } from './services/authService';
import { propertyService } from './services/propertyService';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
  estimatedValue: string;
  stayAsTenant: string;
}

function LandingPage() {

  const [showViewersBalloon, setShowViewersBalloon] = useState(true);

  useEffect(() => {
    if (!showViewersBalloon) {
      const timer = setTimeout(() => {
        setShowViewersBalloon(true);
      }, 45000); // Reaparece após 60 segundos
      return () => clearTimeout(timer);
    }
  }, [showViewersBalloon]);

  const navigate = useNavigate();


  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    propertyType: '',
    estimatedValue: '',
    stayAsTenant: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [viewersCount, setViewersCount] = useState(47);
  const [spotsLeft, setSpotsLeft] = useState(8);

  // Simular contadores dinâmicos para criar urgência
  React.useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(35, Math.min(65, newCount));
      });
    }, 8000);

    const spotsInterval = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev > 3 && Math.random() > 0.8) {
          return prev - 1;
        }
        return prev;
      });
    }, 45000);

    return () => {
      clearInterval(interval);
      clearInterval(spotsInterval);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Salvar no Firebase
    propertyService.addProperty(formData)
      .then(() => {
        console.log('Propriedade cadastrada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar propriedade:', error);
      });

    setShowConfirmation(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        propertyType: '',
        estimatedValue: '',
        stayAsTenant: ''
      });
    }, 3000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Olá! Tenho interesse em vender meu imóvel e continuar morando nele. Gostaria de mais informações sobre o serviço da Nuimóvel.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Botão WhatsApp Flutuante */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Barra de Urgência no Topo */}
      <div className="bg-gradient-to-r from-purple-600 to-green-500 text-white text-center py-2 text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>⚡ OFERTA LIMITADA: Apenas {spotsLeft} vagas restantes para avaliação gratuita este mês!</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Nuimóvel</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('formulario')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Avaliar Meu Imóvel
              </button>
              <button
                onClick={() => scrollToSection('depoimentos')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Depoimentos
              </button>

              <button
                onClick={goToAdmin}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Contato
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-purple-50 to-green-50 relative">
        {/* Balão Flutuante de Visualizações - Adicione a condicional */}
        {showViewersBalloon && (
          <div className="fixed bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl z-50 animate-fade-in">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{viewersCount} pessoas visualizando</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <button
                onClick={() => setShowViewersBalloon(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fechar balão"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {/* Seta do balão */}
            <div className="absolute -bottom-2 left-4 w-4 h-4 transform rotate-45 bg-white/90 backdrop-blur-sm"></div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge de Credibilidade */}
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-green-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="h-4 w-4 mr-2" />
              Mais de 500 imóveis vendidos com sucesso
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Venda seu imóvel e
              <span className="bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent"> continue morando nele</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              <strong>EXCLUSIVO:</strong> A Nuimóvel oferece uma solução inovadora que apenas 3% das imobiliárias no Brasil conhecem:
              você vende seu imóvel, recebe o valor à vista e pode continuar morando no local como inquilino.
              <span className="bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent font-semibold">Transforme seu patrimônio em liquidez sem perder seu lar.</span>
            </p>

            {/* Elementos de Prova Social */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>✅ Processo 100% seguro e legal</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>✅ Avaliação gratuita em 24h</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>✅ Sem taxas ocultas</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('formulario')}
                className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce"
              >
                🚀 QUERO MINHA AVALIAÇÃO GRATUITA
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={openWhatsApp}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </button>
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Como Funciona
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Alerta de Escassez */}
          <div className="bg-gradient-to-r from-red-50 to-red-50 border-l-4 border-red-400 p-4 mb-12 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-red-800">
                  <strong>ATENÇÃO:</strong> Devido à alta demanda, estamos aceitando apenas {spotsLeft} novos cadastros este mês.
                  <span className="font-semibold"> Garante já sua vaga!</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona Nosso Método Exclusivo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Um processo <strong>simples, rápido e transparente</strong> para transformar seu imóvel em dinheiro
              <span className="block text-sm text-blue-600 mt-2">⏱️ Processo completo em até 30 dias</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-green-200 transition-colors">
                <Building className="h-10 w-10 text-purple-600" />
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Avalie seu Imóvel
              </h3>
              <p className="text-gray-600">
                Preencha nosso formulário em <strong>menos de 3 minutos</strong>.
                É rápido, fácil e <strong>sem compromisso</strong>. Receba sua avaliação em 24h!
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-green-200 group-hover:to-purple-200 transition-colors">
                <TrendingUp className="h-10 w-10 text-green-700" />
              </div>
              <div className="bg-gradient-to-r from-green-500 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Avaliação e Proposta
              </h3>
              <p className="text-gray-600">
                Nossa equipe de <strong>especialistas certificados</strong> faz uma avaliação profissional
                e apresenta uma proposta de compra <strong>justa e competitiva em até 48h</strong>.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-green-200 transition-colors">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Venda com Garantia de Locação
              </h3>
              <p className="text-gray-600">
                Finalizamos a venda e você <strong>recebe o valor à vista</strong>. Pode continuar
                morando no imóvel como inquilino com <strong>contrato garantido por até 10 anos</strong>.
              </p>
            </div>
          </div>

          {/* Garantia */}
          <div className="bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-200 rounded-xl p-8 mt-12 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🛡️ Garantia de Satisfação Total
            </h3>
            <p className="text-gray-700 text-lg">
              Se não ficar 100% satisfeito com nossa proposta, <strong>devolvemos seu tempo</strong>
              e você não paga absolutamente nada. Sem letras miúdas, sem pegadinhas.
            </p>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="formulario" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Timer de Urgência 
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-green-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock className="h-4 w-4 mr-2" />
              ⏰ Oferta válida apenas hoje - Avaliação gratuita (valor normal: R$ 500)
            </div>*/}

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 Receba Sua Avaliação Gratuita Agora
            </h2>
            <p className="text-xl text-gray-600">
              Preencha os dados abaixo e nossa equipe entrará em contato <strong>em até 2 horas</strong>
              <span className="block text-sm bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent mt-2">✅ Mais de 500 proprietários já confiaram em nós</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {showConfirmation ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Parabéns! Avaliação solicitada com Sucesso!
                </h3>
                <p className="text-gray-600">
                  Nossa equipe entrará em contato <strong>nas próximas 2 horas</strong> para dar continuidade ao processo.
                  <span className="block mt-2 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent font-semibold">Você acabou de dar o primeiro passo para transformar seu patrimônio!</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço do Imóvel *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo do Imóvel *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                      <option value="sobrado">Sobrado</option>
                      <option value="cobertura">Cobertura</option>
                      <option value="sitio">Sítio</option>
                      <option value="comercial">Comercial</option>
                      <option value="terreno">Terreno</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Estimado *
                    </label>
                    <select
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione a faixa</option>
                      <option value="ate-200k">Até R$ 200.000</option>
                      <option value="200k-400k">R$ 200.000 - R$ 400.000</option>
                      <option value="400k-600k">R$ 400.000 - R$ 600.000</option>
                      <option value="600k-1m">R$ 600.000 - R$ 1.000.000</option>
                      <option value="1m-2m">R$ 1.000.000 - R$ 2.000.000</option>
                      <option value="acima-2m">Acima de R$ 2.000.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tem interesse em continuar morando no imóvel como inquilino? *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stayAsTenant"
                        value="sim"
                        checked={formData.stayAsTenant === 'sim'}
                        onChange={handleInputChange}
                        required
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      Sim
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stayAsTenant"
                        value="nao"
                        checked={formData.stayAsTenant === 'nao'}
                        onChange={handleInputChange}
                        required
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      Não
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-green-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  🚀 QUERO MINHA AVALIAÇÃO GRATUITA AGORA
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Seus dados estão 100% seguros conosco. Não compartilhamos com terceiros.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              💬 O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              <strong>98% de satisfação</strong> - Confiança e satisfação em cada negócio
              <span className="block text-sm bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent mt-2">⭐ Mais de 500 famílias já transformaram seus imóveis em dinheiro</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "A Nuimóvel foi a solução perfeita para minha situação. Consegui vender meu apartamento
                e continuar morando nele. O processo foi transparente e a equipe muito profissional.
                <strong>Recebi R$ 450.000 à vista e continuo morando aqui!</strong> Recomendo para quem busca liquidez sem perder o lar."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Silva</h4>
                  <p className="text-gray-600">Apartamento em São Paulo - SP</p>
                  <p className="text-sm bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent font-medium">✅ Verificado - Cliente real</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "Precisava de dinheiro para investir no meu negócio, mas não queria me mudar.
                A Nuimóvel tornou isso possível. Vendi minha casa, recebi o valor à vista e
                continuo morando aqui com minha família. <strong>Em 20 dias estava tudo resolvido!</strong> Excelente serviço!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">João Santos</h4>
                  <p className="text-gray-600">Casa em Rio de Janeiro - RJ</p>
                  <p className="text-sm bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent font-medium">✅ Verificado - Cliente real</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Final */}
          <div className="bg-gradient-to-r from-purple-600 to-green-500 rounded-xl p-8 text-center text-white mt-12">
            <h3 className="text-2xl font-bold mb-4">
              🎯 Pronto para Transformar Seu Imóvel em Dinheiro?
            </h3>
            <p className="text-xl mb-6">
              Junte-se a mais de 500 proprietários que já confiaram na Nuimóvel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('formulario')}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                📝 Avaliar Meu Imóvel Agora
              </button>
              <button
                onClick={openWhatsApp}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                💬 Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Home className="h-8 w-8 text-purple-400 mr-2" />
                <span className="text-2xl font-bold">Nuimóvel</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transformamos patrimônio em liquidez sem você perder seu lar.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-purple-400 mr-3" />
                  <a href="mailto:lucasdelimamartinezz@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                    lucasdelimamartinezz@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-gray-400">(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-gray-400">São Paulo - SP</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Venda com permanência</li>
                <li>Avaliação de imóveis</li>
                <li>Consultoria imobiliária</li>
                <li>Contratos de locação</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LGPD
                  </a>
                </li>
                <li>
                  <a
                    onClick={goToAdmin}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Área do Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nuimóvel. Todos os direitos reservados. | CRECI: 12345-J</p>
            <p className="text-sm mt-2">🏆 Empresa certificada e regulamentada pelo CRECI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import type { User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          user ? (
            <AdminDashboard onLogout={() => setUser(null)} />
          ) : (
            <AdminLogin onLoginSuccess={() => { }} />
          )
        }
      />
    </Routes>
  );
}



export default App;