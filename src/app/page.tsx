import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showText={true} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 px-4">
          마케팅 전문가와 자영업자를 연결하는 플랫폼
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 px-4">
          전문적인 마케팅 서비스로 당신의 비즈니스를 성장시키세요
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 sm:justify-center items-center">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
          >
            시작하기
          </Link>
          <Link 
            href="/projects" 
            className="w-full sm:w-auto border-2 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-border border-gradient bg-clip-text px-8 py-3 rounded-lg font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 hover:text-gray-800 transition-all duration-200 relative overflow-hidden text-center"
            style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899) border-box',
              border: '2px solid transparent'
            }}
          >
            프로젝트 둘러보기
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
        <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">자영업자님</h2>
          <p className="text-gray-600 mb-6">
            전문 마케터의 도움으로 매출을 늘리고 브랜드를 성장시키세요
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• 검증된 마케팅 전문가</li>
            <li>• 맞춤형 마케팅 전략</li>
            <li>• 합리적인 비용</li>
            <li>• 투명한 프로젝트 관리</li>
          </ul>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">마케팅 전문가님</h2>
          <p className="text-gray-600 mb-6">
            다양한 프로젝트에 참여하며 전문성을 발휘하세요
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• 다양한 마케팅 프로젝트</li>
            <li>• 유연한 근무 환경</li>
            <li>• 경쟁력 있는 보수</li>
            <li>• 포트폴리오 구축 기회</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">
          주요 서비스
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SNS 마케팅</h3>
            <p className="text-gray-600 text-sm lg:text-base">인스타그램, 페이스북 등 소셜미디어 마케팅</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">디지털 광고</h3>
            <p className="text-gray-600 text-sm lg:text-base">구글, 네이버 광고 운영 및 최적화</p>
          </div>
          <div className="text-center p-4 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">브랜딩</h3>
            <p className="text-gray-600 text-sm lg:text-base">브랜드 아이덴티티 구축 및 전략 수립</p>
          </div>
        </div>
      </div>
    </div>
  );
}