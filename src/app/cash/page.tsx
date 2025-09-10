'use client';

import { useState } from 'react';
import { cashPackages, paymentMethods, cashBalances, cashTransactions } from '@/lib/data';
import { CashPackage, PaymentMethod } from '@/types';

export default function CashChargePage() {
  const [selectedPackage, setSelectedPackage] = useState<CashPackage | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'charge' | 'history'>('charge');
  
  // 현재 사용자 (샘플: 김마케팅)
  const currentUser = cashBalances[0];
  const userTransactions = cashTransactions.filter(t => t.userId === '1').slice(0, 10);

  const handlePackageSelect = (pkg: CashPackage) => {
    setSelectedPackage(pkg);
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (!selectedPackage || !selectedPayment) return;
    
    alert(`${selectedPackage.name} 충전이 완료되었습니다!\n결제 수단: ${selectedPayment.name}\n충전 금액: ${formatNumber(selectedPackage.amount + selectedPackage.bonusAmount)}원`);
    setShowPaymentModal(false);
    setSelectedPackage(null);
    setSelectedPayment(null);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'charge': return '💰';
      case 'spend': return '💸';
      case 'bonus': return '🎁';
      case 'refund': return '💚';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'charge': return 'text-blue-600';
      case 'spend': return 'text-red-600';
      case 'bonus': return 'text-green-600';
      case 'refund': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          마자영 캐시
        </h1>
        <p className="text-gray-600">견적 발송에 필요한 캐시를 충전하고 관리하세요</p>
      </div>

      {/* 현재 잔액 카드 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6 rounded-lg text-white mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-base sm:text-lg font-medium mb-2">현재 보유 캐시</h2>
            <p className="text-2xl sm:text-4xl font-bold">{formatNumber(currentUser.balance)}원</p>
            <p className="text-blue-100 text-sm mt-2">
              견적 {Math.floor(currentUser.balance / 2000)}회 발송 가능
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-blue-100">누적 사용</p>
            <p className="text-lg sm:text-xl font-semibold">{formatNumber(currentUser.totalSpent)}원</p>
            <p className="text-sm text-blue-100 mt-1">누적 충전</p>
            <p className="text-lg sm:text-xl font-semibold">{formatNumber(currentUser.totalEarned)}원</p>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('charge')}
          className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'charge'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💰 캐시 충전
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📊 사용 내역
        </button>
      </div>

      {activeTab === 'charge' ? (
        <div>
          {/* 충전 패키지 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">충전 패키지 선택</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {cashPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedPackage?.id === pkg.id
                      ? 'border-blue-500 bg-blue-50 transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  } ${pkg.isPopular ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      인기
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className="text-lg font-semibold mb-2">{pkg.name}</h4>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-blue-600">
                        {formatNumber(pkg.amount)}원
                      </p>
                      {pkg.bonusAmount > 0 && (
                        <p className="text-green-600 font-medium">
                          + 보너스 {formatNumber(pkg.bonusAmount)}원
                        </p>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    <div className="border-t pt-4">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(pkg.price)}원
                      </p>
                      {pkg.bonusAmount > 0 && (
                        <p className="text-sm text-green-600">
                          {Math.round((pkg.bonusAmount / pkg.price) * 100)}% 보너스
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 수단 선택 */}
          {selectedPackage && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">결제 수단 선택</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentSelect(method)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">선택한 패키지</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedPackage.name}</p>
                    <p className="text-sm text-blue-700">
                      {formatNumber(selectedPackage.amount)}원 
                      {selectedPackage.bonusAmount > 0 && 
                        ` + 보너스 ${formatNumber(selectedPackage.bonusAmount)}원`
                      }
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {formatNumber(selectedPackage.price)}원
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 사용 내역 */
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">캐시 사용 내역</h3>
            <p className="text-gray-600 text-sm">최근 거래 내역을 확인하세요</p>
          </div>
          
          <div className="p-6">
            {userTransactions.length > 0 ? (
              <div className="space-y-4">
                {userTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)}원
                      </p>
                      <p className="text-sm text-gray-600">
                        잔액: {formatNumber(transaction.balanceAfter)}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">거래 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 결제 모달 */}
      {showPaymentModal && selectedPackage && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">결제 확인</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedPackage.name}</p>
                <p className="text-2xl font-bold text-blue-600 my-2">
                  {formatNumber(selectedPackage.price)}원
                </p>
                <p className="text-sm text-gray-600">
                  충전 캐시: {formatNumber(selectedPackage.amount + selectedPackage.bonusAmount)}원
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">결제 수단</p>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <span className="text-xl">{selectedPayment.icon}</span>
                <span className="font-medium">{selectedPayment.name}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}