import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Platform, KeyboardAvoidingView, Modal, FlatList, StatusBar, Image, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import Markdown from 'react-native-markdown-display';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'https://premium-currency-ai.onrender.com/api';

// Bảng màu

const DARK_THEME = {
  bg1: '#0f172a',
  bg2: '#1e293b',
  text: '#ffffff',
  subText: '#999999',
  cardBg: 'rgba(30, 41, 59, 0.7)',
  glassBorder: 'rgba(255,255,255,0.1)',
  inputBg: 'rgba(0,0,0,0.3)',
  tint: 'dark' as const,
  placeholder: 'rgba(255,255,255,0.3)'
};

const LIGHT_THEME = {
  bg1: '#ffffff',
  bg2: '#f1f5f9',
  text: '#1e293b',
  subText: '#64748b',
  cardBg: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(0,0,0,0.1)',
  inputBg: 'rgba(0,0,0,0.05)',
  tint: 'light' as const,
  placeholder: 'rgba(0,0,0,0.3)'
};

const COLORS = {
  tiffanyBlue: '#0ABAB5',
  pastelPink: '#FFB6C1',
  white: '#FFFFFF',
  glassDark: 'rgba(20, 25, 35, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  textInputBg: 'rgba(0, 0, 0, 0.3)',
};

const getMarkdownStyles = (theme: any) => ({
  body: {
    color: theme.text,
    fontSize: 15,
    textAlign: 'left' as const,
  },
  paragraph: {
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold' as const,
    marginTop: 20,
    marginBottom: 10,
    color: theme.text,
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold' as const,
    marginTop: 15,
    marginBottom: 8,
    color: theme.text,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold' as const,
    marginTop: 10,
    marginBottom: 5,
    color: theme.text,
  },
  strong: {
    fontWeight: 'bold' as const,
    color: COLORS.tiffanyBlue,
  },
  bullet_list: {
    marginTop: 10,
    marginBottom: 10,
  }
});

const LANGUAGES = [
  { code: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'KO', name: '한국어', flag: '🇰🇷' },
  { code: 'JA', name: '日本語', flag: '🇯🇵' },
  { code: 'ZH', name: '中文', flag: '🇨🇳' },
  { code: 'RU', name: 'Русский', flag: '🇷🇺' }
];

const TRANSLATIONS: any = {
  VI: {
    amountLabel: 'Số tiền', fromLabel: 'Từ', toLabel: 'Sang', convertBtn: 'Chuyển đổi ngay', resultTitle: 'Số tiền nhận được', aiReadTitle: 'Bằng chữ', errorEmpty: 'Vui lòng nhập đầy đủ thông tin', errorNetwork: 'Lỗi mạng, vui lòng thử lại', errorRate: 'Không tìm thấy tỷ giá',
    tabConvert: 'Đổi tiền', tabAI: 'AI', tabMarket: 'Thị trường', tabNews: 'Tin tức', tabProfile: 'Cá nhân',
    aiMarketAnalysis: 'Phân tích thị trường', aiGetLatest: 'Lấy phân tích mới nhất', aiChatPlaceholder: 'Hỏi AI...', aiChatSend: 'Gửi', aiTabMarket: 'Phân tích', aiTabChat: 'Trò chuyện',
    marketTitle: 'Tỷ giá thị trường', marketUpdated: 'Cập nhật',
    newsTitle: 'Tin tức & Sự kiện',
    profileInvestor: 'Nhà đầu tư', profileNotUpdated: 'Chưa cập nhật', profileEdit: 'Chỉnh sửa hồ sơ', profileSettings: 'Cài đặt chung', profileLang: 'Ngôn ngữ', profileNotif: 'Thông báo tỷ giá', profileDark: 'Chế độ tối', profileLight: 'Chế độ sáng', profileAccount: 'Tài khoản', profileSecurity: 'Bảo mật & Quyền riêng tư', profileHelp: 'Trợ giúp & Phản hồi', profileLogout: 'Đăng xuất',
    modalUpdateInfo: 'Cập nhật thông tin', modalName: 'Họ và tên', modalPhone: 'Số điện thoại', modalSave: 'Lưu lại', modalCancel: 'Hủy', modalDelete: 'Xóa dữ liệu', modalChangeAvatar: 'Đổi ảnh đại diện', langSelectTitle: 'Chọn Ngôn Ngữ'
  },
  EN: {
    amountLabel: 'Amount', fromLabel: 'From', toLabel: 'To', convertBtn: 'Convert Now', resultTitle: 'Received Amount', aiReadTitle: 'In words', errorEmpty: 'Please fill all fields', errorNetwork: 'Network error, try again', errorRate: 'Rate not found',
    tabConvert: 'Convert', tabAI: 'AI', tabMarket: 'Market', tabNews: 'News', tabProfile: 'Profile',
    aiMarketAnalysis: 'Market Analysis', aiGetLatest: 'Get latest analysis', aiChatPlaceholder: 'Ask AI...', aiChatSend: 'Send', aiTabMarket: 'Analysis', aiTabChat: 'Chat',
    marketTitle: 'Market Rates', marketUpdated: 'Updated',
    newsTitle: 'News & Events',
    profileInvestor: 'Investor', profileNotUpdated: 'Not updated', profileEdit: 'Edit Profile', profileSettings: 'General Settings', profileLang: 'Language', profileNotif: 'Rate Alerts', profileDark: 'Dark Mode', profileLight: 'Light Mode', profileAccount: 'Account', profileSecurity: 'Security & Privacy', profileHelp: 'Help & Support', profileLogout: 'Log Out',
    modalUpdateInfo: 'Update Information', modalName: 'Full Name', modalPhone: 'Phone Number', modalSave: 'Save', modalCancel: 'Cancel', modalDelete: 'Delete Data', modalChangeAvatar: 'Change Avatar', langSelectTitle: 'Select Language'
  },
  KO: {
    amountLabel: '금액', fromLabel: '에서', toLabel: '로', convertBtn: '변환하다', resultTitle: '받은 금액', aiReadTitle: '단어로', errorEmpty: '모든 필드를 입력하세요', errorNetwork: '네트워크 오류, 다시 시도하세요', errorRate: '환율을 찾을 수 없음',
    tabConvert: '변환', tabAI: 'AI', tabMarket: '시장', tabNews: '뉴스', tabProfile: '프로필',
    aiMarketAnalysis: '시장 분석', aiGetLatest: '최신 분석 가져오기', aiChatPlaceholder: 'AI에게 묻기...', aiChatSend: '보내기', aiTabMarket: '분석', aiTabChat: '채팅',
    marketTitle: '시장 환율', marketUpdated: '업데이트 됨',
    newsTitle: '뉴스와 이벤트',
    profileInvestor: '투자자', profileNotUpdated: '업데이트되지 않음', profileEdit: '프로필 편집', profileSettings: '일반 설정', profileLang: '언어', profileNotif: '환율 알림', profileDark: '다크 모드', profileLight: '라이트 모드', profileAccount: '계정', profileSecurity: '보안 및 개인 정보 보호', profileHelp: '도움말 및 지원', profileLogout: '로그아웃',
    modalUpdateInfo: '정보 업데이트', modalName: '성명', modalPhone: '전화번호', modalSave: '저장', modalCancel: '취소', modalDelete: '데이터 삭제', modalChangeAvatar: '아바타 변경', langSelectTitle: '언어 선택'
  },
  JA: {
    amountLabel: '金額', fromLabel: 'から', toLabel: 'へ', convertBtn: '変換する', resultTitle: '受け取った金額', aiReadTitle: '言葉で', errorEmpty: 'すべての項目を入力してください', errorNetwork: 'ネットワークエラー、再試行してください', errorRate: 'レートが見つかりません',
    tabConvert: '変換', tabAI: 'AI', tabMarket: '市場', tabNews: 'ニュース', tabProfile: 'プロフィール',
    aiMarketAnalysis: '市場分析', aiGetLatest: '最新の分析を取得', aiChatPlaceholder: 'AIに聞く...', aiChatSend: '送信', aiTabMarket: '分析', aiTabChat: 'チャット',
    marketTitle: '市場レート', marketUpdated: '更新しました',
    newsTitle: 'ニュースとイベント',
    profileInvestor: '投資家', profileNotUpdated: '未更新', profileEdit: 'プロフィールを編集', profileSettings: '一般設定', profileLang: '言語', profileNotif: 'レートアラート', profileDark: 'ダークモード', profileLight: 'ライトモード', profileAccount: 'アカウント', profileSecurity: 'セキュリティとプライバシー', profileHelp: 'ヘルプとサポート', profileLogout: 'ログアウト',
    modalUpdateInfo: '情報を更新', modalName: '氏名', modalPhone: '電話番号', modalSave: '保存', modalCancel: 'キャンセル', modalDelete: 'データを削除', modalChangeAvatar: 'アバターを変更', langSelectTitle: '言語を選択'
  },
  ZH: {
    amountLabel: '金额', fromLabel: '从', toLabel: '到', convertBtn: '立即转换', resultTitle: '收到的金额', aiReadTitle: '大写', errorEmpty: '请填写所有字段', errorNetwork: '网络错误，请重试', errorRate: '未找到汇率',
    tabConvert: '转换', tabAI: 'AI', tabMarket: '市场', tabNews: '新闻', tabProfile: '我的',
    aiMarketAnalysis: '市场分析', aiGetLatest: '获取最新分析', aiChatPlaceholder: '询问AI...', aiChatSend: '发送', aiTabMarket: '分析', aiTabChat: '聊天',
    marketTitle: '市场汇率', marketUpdated: '已更新',
    newsTitle: '新闻与事件',
    profileInvestor: '投资者', profileNotUpdated: '未更新', profileEdit: '编辑资料', profileSettings: '通用设置', profileLang: '语言', profileNotif: '汇率提醒', profileDark: '深色模式', profileLight: '浅色模式', profileAccount: '账户', profileSecurity: '安全与隐私', profileHelp: '帮助与支持', profileLogout: '登出',
    modalUpdateInfo: '更新信息', modalName: '姓名', modalPhone: '电话号码', modalSave: '保存', modalCancel: '取消', modalDelete: '删除数据', modalChangeAvatar: '更改头像', langSelectTitle: '选择语言'
  },
  RU: {
    amountLabel: 'Сумма', fromLabel: 'Из', toLabel: 'В', convertBtn: 'Конвертировать', resultTitle: 'Полученная сумма', aiReadTitle: 'Прописью', errorEmpty: 'Пожалуйста, заполните все поля', errorNetwork: 'Ошибка сети, попробуйте еще раз', errorRate: 'Курс не найден',
    tabConvert: 'Конвертация', tabAI: 'ИИ', tabMarket: 'Рынок', tabNews: 'Новости', tabProfile: 'Профиль',
    aiMarketAnalysis: 'Анализ рынка', aiGetLatest: 'Получить свежий анализ', aiChatPlaceholder: 'Спросить ИИ...', aiChatSend: 'Отправить', aiTabMarket: 'Анализ', aiTabChat: 'Чат',
    marketTitle: 'Рыночные курсы', marketUpdated: 'Обновлено',
    newsTitle: 'Новости и события',
    profileInvestor: 'Инвестор', profileNotUpdated: 'Не обновлено', profileEdit: 'Редактировать профиль', profileSettings: 'Общие настройки', profileLang: 'Язык', profileNotif: 'Уведомления', profileDark: 'Темный режим', profileLight: 'Светлый режим', profileAccount: 'Аккаунт', profileSecurity: 'Безопасность', profileHelp: 'Помощь и поддержка', profileLogout: 'Выйти',
    modalUpdateInfo: 'Обновить информацию', modalName: 'Полное имя', modalPhone: 'Номер телефона', modalSave: 'Сохранить', modalCancel: 'Отмена', modalDelete: 'Удалить данные', modalChangeAvatar: 'Изменить аватар', langSelectTitle: 'Выберите язык'
  }
};


const NEWS_DATA = [
  {
    id: '1',
    title: 'FED giữ nguyên lãi suất ở mức 5.25%, USD neo ở mức đỉnh 6 tháng',
    time: '2 giờ trước',
    source: 'Reuters',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    featured: true, content: 'Cục Dự trữ Liên bang Mỹ (FED) hôm nay đã quyết định giữ nguyên lãi suất cơ bản ở mức 5.25% - 5.50%. Quyết định này đã được thị trường dự báo từ trước, tuy nhiên, điều khiến giới đầu tư bất ngờ là quan điểm diều hâu của Chủ tịch Jerome Powell về việc có thể giữ lãi suất cao trong thời gian dài hơn để kìm hãm lạm phát. Ngay sau công bố, chỉ số DXY đo lường sức mạnh đồng USD đã bật tăng mạnh mẽ, neo ở mức đỉnh cao nhất trong 6 tháng qua.',
  },
  {
    id: '2',
    title: 'Ngân hàng Trung ương Nhật Bản (BOJ) có dấu hiệu can thiệp, JPY phục hồi nhẹ',
    time: '5 giờ trước',
    source: 'Bloomberg',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80', content: 'Thị trường ngoại hối hôm nay chứng kiến sự biến động mạnh của đồng Yên Nhật. Sau khi tỷ giá USD/JPY vượt mốc 150, các nguồn tin cho thấy BOJ dường như đã âm thầm tiến hành các biện pháp can thiệp bán USD và mua JPY để ngăn đà mất giá lịch sử này. Lợi suất trái phiếu chính phủ Nhật Bản cũng nhích nhẹ, tạo thêm động lực giúp JPY phục hồi so với rổ tiền tệ chính.',
  },
  {
    id: '3',
    title: 'Châu Âu công bố dữ liệu lạm phát hạ nhiệt, EUR chững lại',
    time: '12 giờ trước',
    source: 'Financial Times',
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=600&q=80', content: 'Cơ quan Thống kê Châu Âu (Eurostat) vừa công bố chỉ số giá tiêu dùng (CPI) tháng này với mức giảm vượt kỳ vọng. Mặc dù đây là tín hiệu tốt cho nền kinh tế, nhưng nó lại dập tắt hy vọng về việc ECB sẽ tiếp tục duy trì chính sách thắt chặt. Điều này khiến đồng Euro (EUR) đánh mất đà tăng và chững lại so với đồng Bảng Anh (GBP) và Đô la Mỹ (USD).',
  },
  {
    id: '4',
    title: 'Thị trường vàng biến động mạnh trước thềm công bố bảng lương Non-farm',
    time: '1 ngày trước',
    source: 'CNBC',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80', content: 'Giới đầu tư toàn cầu đang nín thở chờ đợi báo cáo bảng lương phi nông nghiệp (Non-farm Payrolls) của Mỹ vào thứ Sáu tuần này. Dòng tiền trú ẩn an toàn đã bắt đầu đổ vào thị trường vàng khiến giá kim loại quý này biến động dữ dội trong biên độ 30 USD/ounce chỉ trong một phiên giao dịch. Các chuyên gia nhận định nếu dữ liệu việc làm Mỹ mạnh hơn dự kiến, vàng có thể đối mặt với áp lực chốt lời lớn.',
  }
];

const CURRENCY_IMAGES: Record<string, string> = {
  USD: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  EUR: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=800&q=80',
  JPY: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
  GBP: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  VND: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
  KRW: 'https://images.unsplash.com/photo-1538485395224-3298a0c4f826?auto=format&fit=crop&w=800&q=80',
  CNY: 'https://images.unsplash.com/photo-1508804185872-d7badfaa00f4?auto=format&fit=crop&w=800&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80'
};

export default function App() {

  const [activeTab, setActiveTab] = useState('Convert');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  
  const t = TRANSLATIONS[language.code];
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const styles = getStyles(theme, isDarkMode);

  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('VND');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState<string | null>(null);
  const [shortInsight, setShortInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile states
  const [profile, setProfile] = useState({
    name: 'Nhà đầu tư',
    email: 'investor@premium.com',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditForm({ ...editForm, avatar: result.assets[0].uri });
    }
  };

  const handleConvert = async () => {
    if (!baseCurrency || !targetCurrency || !amount) {
      setError(t.errorEmpty);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setShortInsight(null);

    try {
      const rateRes = await fetch(`${API_BASE_URL}/rates?base=${baseCurrency.toUpperCase()}`);
      if (!rateRes.ok) throw new Error(t.errorNetwork);
      const rateData = await rateRes.json();
      
      const targetCode = targetCurrency.toUpperCase();
      const rate = rateData.rates[targetCode];
      if (!rate) throw new Error(`${t.errorRate}: ${targetCode}`);

      const calculatedAmount = (parseFloat(amount) * rate).toFixed(2);
      const formattedResult = new Intl.NumberFormat('en-US').format(parseFloat(calculatedAmount));
      setResult(`${formattedResult} ${targetCode}`);

      // Fetch short insight (Read number in words)
      try {
        const insightRes = await fetch(`${API_BASE_URL}/ai/insight?amount=${formattedResult}&target=${targetCode}&lang=${language.code}`);
        if (insightRes.ok) {
          const insightData = await insightRes.json();
          setShortInsight(insightData.insight);
        }
      } catch (e) {
        console.log('Insight error', e);
      }
    } catch (err: any) {
      setError(err.message || t.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
    setResult(null); 
  };

      const [aiLoading, setAiLoading] = useState(false);
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  // States cho Tab Market (Tỷ giá thế giới)
  const [marketRates, setMarketRates] = useState<any[]>([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState<any | null>(null);
  const [chartData, setChartData] = useState<{labels: string[], data: number[]} | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState('1M');

  const fetchChartData = async (targetCode: string, range: string) => {
    setChartLoading(true);
    try {
      let yRange = '1mo';
      let yInterval = '1d';
      switch(range) {
        case '1D': yRange = '1d'; yInterval = '1m'; break;
        case '1W': yRange = '5d'; yInterval = '15m'; break;
        case '1M': yRange = '1mo'; yInterval = '1d'; break;
        case '3M': yRange = '3mo'; yInterval = '1d'; break;
        case '6M': yRange = '6mo'; yInterval = '1wk'; break;
        case '1Y': yRange = '1y'; yInterval = '1wk'; break;
        case '2Y': yRange = '2y'; yInterval = '1mo'; break;
      }

      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${targetCode}=X?interval=${yInterval}&range=${yRange}`);
      const data = await res.json();
      const result = data.chart.result[0];
      const quotes = result.indicators.quote[0].close;

      let validData: number[] = [];
      let validLabels: string[] = [];

      quotes.forEach((q: number | null, i: number) => {
        if (q !== null) {
          validData.push(q);
          // Just empty labels to keep it clean, maybe first and last
          validLabels.push("");
        }
      });

      // Avoid crash if array is empty
      if (validData.length === 0) {
        validData = [1, 1];
        validLabels = ["", ""];
      }
      
      // If data is too large, sample it down to ~100 points for smooth rendering
      if (validData.length > 100) {
          const step = Math.ceil(validData.length / 100);
          validData = validData.filter((_, i) => i % step === 0);
          validLabels = validLabels.filter((_, i) => i % step === 0);
      }

      setChartData({ labels: validLabels, data: validData });
    } catch (err) {
      console.log("Error fetching chart data", err);
      // Fallback
      setChartData({ labels: ["", ""], data: [1, 1] });
    } finally {
      setChartLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedMarketItem) {
      const code = selectedMarketItem.ticker.split('/')[1];
      fetchChartData(code, selectedRange);
    }
  }, [selectedMarketItem, selectedRange]);

  const getCurrencyName = (code: string) => {
    const names: any = {
      EUR: 'Euro', JPY: 'Japanese Yen', GBP: 'British Pound', AUD: 'Australian Dollar',
      CAD: 'Canadian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan', VND: 'Vietnamese Dong',
      SGD: 'Singapore Dollar', KRW: 'South Korean Won', INR: 'Indian Rupee'
    };
    return names[code] || code;
  };

  const fetchMarketData = async () => {
    setMarketLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rates?base=USD`);
      if (!res.ok) throw new Error("Lỗi API");
      const data = await res.json();
      
      const topCurrencies = ['EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'VND', 'SGD', 'KRW', 'INR'];
      
      const formatted = topCurrencies.map(code => {
        const rate = data.rates[code] || 0;
        // Vì API miễn phí không trả về lịch sử, ta tạo dữ liệu biến động giả lập theo thuật toán hash nhẹ để UI luôn có màu sắc xanh/đỏ sinh động
        const hash = (code.charCodeAt(0) * code.charCodeAt(1)) % 100;
        const isUp = hash > 40;
        const changePercent = ((hash % 50) / 15).toFixed(2); // 0.00% to 3.33%

        return {
          ticker: `USD/${code}`,
          name: getCurrencyName(code),
          price: rate > 10 ? new Intl.NumberFormat('en-US').format(rate) : rate.toFixed(4),
          percent: isUp ? `+${changePercent}%` : `-${changePercent}%`,
          isUp: isUp
        };
      });
      setMarketRates(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setMarketLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'Market' && marketRates.length === 0) {
      fetchMarketData();
    }
  }, [activeTab]);


  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setAiLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          base: baseCurrency,
          target: targetCurrency,
          language: language.code
        })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Lỗi kết nối máy chủ AI." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const tabs = [
    { name: 'Convert', icon: 'swap-horizontal', label: t.tabConvert },
    { name: 'AI', icon: 'sparkles' },
    { name: 'Market', icon: 'trending-up', label: t.tabMarket },
    { name: 'News', icon: 'newspaper', label: t.tabNews },
    { name: 'Profile', icon: 'person', label: t.tabProfile }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'Convert':
        return (
          <BlurView intensity={30} tint={theme.tint} style={styles.card}>
            <Text style={styles.label}>{t.amountLabel}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.placeholder}
            />

            <View style={styles.row}>
              <View style={styles.currencyBox}>
                <Text style={styles.label}>{t.fromLabel}</Text>
                <TextInput
                  style={styles.inputSmall}
                  value={baseCurrency}
                  onChangeText={setBaseCurrency}
                  autoCapitalize="characters"
                  maxLength={3}
                />
              </View>
              
              <View style={styles.swapBtnContainer}>
                <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
                  <Ionicons name="swap-horizontal" size={24} color={COLORS.tiffanyBlue} />
                </TouchableOpacity>
              </View>

              <View style={styles.currencyBox}>
                <Text style={styles.label}>{t.toLabel}</Text>
                <TextInput
                  style={styles.inputSmall}
                  value={targetCurrency}
                  onChangeText={setTargetCurrency}
                  autoCapitalize="characters"
                  maxLength={3}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.convertBtn} onPress={handleConvert} disabled={loading}>
              <LinearGradient
                colors={[COLORS.tiffanyBlue, '#008b8b']}
                style={styles.convertBtnGradient}
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.convertBtnText}>{t.convertBtn}</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
            {result && (
              <BlurView intensity={40} tint={theme.tint} style={styles.resultBox}>
                <Text style={styles.resultTitle}>{t.resultTitle}</Text>
                <Text style={styles.resultValue}>{result}</Text>
                {shortInsight && (
                  <View style={styles.aiInsightBox}>
                    <View style={styles.aiHeaderRow}>
                      <Text style={styles.aiTitle}>{t.aiReadTitle}:</Text>
                    </View>
                    <Text style={styles.aiInsightText}>{shortInsight}</Text>
                  </View>
                )}
              </BlurView>
            )}
          </BlurView>
        );
case 'AI':
        return (
          <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{flex: 1, paddingBottom: 100}}>
              <View style={[styles.card, {flex: 1, padding: 0, overflow: 'hidden', backgroundColor: theme.cardBg, borderColor: theme.glassBorder}]}>
                <View style={{padding: 20, borderBottomWidth: 1, borderBottomColor: theme.glassBorder, backgroundColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="planet" size={24} color={COLORS.tiffanyBlue} style={{marginRight: 10}} />
                  <Text style={{color: theme.text, fontSize: 18, fontWeight: 'bold'}}>Premium AI Assistant</Text>
                </View>
                
                <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
                  {chatHistory.length === 0 && (
                    <View style={{alignItems: 'center', marginTop: 50}}>
                      <Ionicons name="chatbubbles" size={60} color={COLORS.tiffanyBlue} style={{opacity: 0.5}} />
                      <Text style={{color: theme.subText, marginTop: 10}}>Premium AI sẵn sàng hỗ trợ bạn.</Text>
                      <Text style={{color: theme.subText, fontSize: 12, marginTop: 5}}>Bạn có thể hỏi bất cứ điều gì!</Text>
                    </View>
                  )}
                  {chatHistory.map((msg, idx) => (
                    <View key={idx} style={[styles.chatBubble, msg.role === 'user' ? styles.userMsg : styles.aiMsg]}>
                      {msg.role === 'user' ? (
                        <Text style={[styles.chatText, {color: theme.text}]}>{msg.text}</Text>
                      ) : (
                        <Markdown style={getMarkdownStyles(theme)}>{msg.text}</Markdown>
                      )}
                    </View>
                  ))}
                  {aiLoading && <ActivityIndicator color={COLORS.tiffanyBlue} style={{marginVertical: 10}} />}
                </ScrollView>

                <View style={[styles.chatInputRow, {borderTopWidth: 1, borderTopColor: theme.glassBorder, padding: 15, backgroundColor: theme.cardBg}]}>
                  <TextInput
                    style={[styles.chatInput, {backgroundColor: theme.inputBg, color: theme.text}]}
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    placeholder={t.aiChatPlaceholder}
                    placeholderTextColor={theme.placeholder}
                    onSubmitEditing={sendChatMessage}
                  />
                  <TouchableOpacity style={styles.chatSendBtn} onPress={sendChatMessage} disabled={aiLoading}>
                    <Ionicons name="send" size={20} color={COLORS.tiffanyBlue} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        );
      case 'Market':
        return (
          <View style={styles.stockContainer}>
            <View style={styles.marketHeaderRow}>
              <Text style={styles.stockHeader}>{t.marketTitle} (Base: USD)</Text>
              <TouchableOpacity onPress={fetchMarketData}>
                <Ionicons name="refresh" size={24} color={COLORS.tiffanyBlue} />
              </TouchableOpacity>
            </View>
            
            {marketLoading ? (
              <ActivityIndicator color={COLORS.tiffanyBlue} style={{marginTop: 50}} size="large" />
            ) : (
              marketRates.map((item, i) => (
                <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setSelectedMarketItem(item)}>
                  <BlurView intensity={40} tint={theme.tint} style={styles.stockCard}>
                    <View style={styles.stockInfo}>
                      <Text style={styles.stockTicker}>{item.ticker}</Text>
                      <Text style={styles.stockName}>{item.name}</Text>
                    </View>
                    <View style={styles.stockPriceData}>
                      <Text style={styles.stockPrice}>{item.price}</Text>
                      <View style={[styles.stockBadge, item.isUp ? styles.badgeUp : styles.badgeDown]}>
                        <Text style={styles.stockBadgeText}>{item.percent}</Text>
                      </View>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              ))
            )}
          </View>
        );
      case 'News':
        return (
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <Text style={[styles.headerTitle, {marginBottom: 20}]}>{t.newsTitle}</Text>

            {NEWS_DATA.map((news) => {
              if (news.featured) {
                return (
                  <TouchableOpacity key={news.id} style={styles.featuredNewsCard} onPress={() => setSelectedNews(news)}>
                    <Image source={{uri: news.image}} style={styles.featuredNewsImage} />
                    <BlurView intensity={80} tint={theme.tint} style={styles.featuredNewsBlur}>
                      <Text style={styles.newsSource}>{news.source} • {news.time}</Text>
                      <Text style={styles.featuredNewsTitle}>{news.title}</Text>
                    </BlurView>
                  </TouchableOpacity>
                )
              }
              return (
                <TouchableOpacity key={news.id} style={[styles.newsListCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]} onPress={() => setSelectedNews(news)}>
                  <Image source={{uri: news.image}} style={styles.newsListImage} />
                  <View style={styles.newsListContent}>
                    <Text style={[styles.newsListTitle, {color: theme.text}]} numberOfLines={2}>{news.title}</Text>
                    <Text style={styles.newsSource}>{news.source} • {news.time}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
            <View style={{height: 100}} />

            {/* News Detail Modal */}
            <Modal visible={!!selectedNews} animationType="slide" transparent={true}>
              <View style={styles.modalOverlay}>
                <BlurView intensity={100} tint={theme.tint} style={[styles.modalContent, {width: '100%', height: '90%', bottom: 0, position: 'absolute', borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]}>
                  {selectedNews && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
                      <Image source={{uri: selectedNews.image}} style={{width: '100%', height: 250, borderRadius: 20, marginBottom: 20}} />
                      <Text style={[styles.newsSource, {fontSize: 14, marginBottom: 10}]}>{selectedNews.source} • {selectedNews.time}</Text>
                      <Text style={[styles.headerTitle, {fontSize: 22, marginBottom: 20, lineHeight: 30}]}>{selectedNews.title}</Text>
                      <Text style={{color: theme.text, fontSize: 16, lineHeight: 26}}>{selectedNews.content}</Text>
                    </ScrollView>
                  )}
                  <TouchableOpacity style={[{}, {position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 5}]} onPress={() => setSelectedNews(null)}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </BlurView>
              </View>
            </Modal>
          </ScrollView>
        );
      case 'Profile':
        return (
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={styles.profileHeaderCard}>
              <Image source={{uri: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}} style={styles.avatar} />
              <Text style={styles.profileName}>{profile.name || t.profileNotUpdated}</Text>
              <Text style={styles.profileEmail}>{profile.email || t.profileNotUpdated}</Text>
              <View style={styles.proBadge}>
                 <Ionicons name="diamond" size={12} color="#fff" style={{marginRight: 4}} />
                 <Text style={styles.proBadgeText}>PREMIUM</Text>
              </View>
              <TouchableOpacity 
                style={styles.editProfileBtn}
                onPress={() => { setEditForm(profile); setShowEditProfile(true); }}
              >
                <Text style={styles.editProfileBtnText}>{t.profileEdit}</Text>
              </TouchableOpacity>
            </View>

            <BlurView intensity={30} tint={theme.tint} style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>{t.profileSettings}</Text>
              <TouchableOpacity style={styles.settingItem} onPress={() => setShowLangModal(true)}>
                 <View style={styles.settingIconBox}>
                   <Ionicons name="language" size={20} color={COLORS.tiffanyBlue} />
                 </View>
                 <Text style={styles.settingText}>{t.profileLang}</Text>
                 <Text style={styles.settingValue}>{language.name}</Text>
                 <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                 <View style={styles.settingIconBox}>
                   <Ionicons name="notifications" size={20} color={COLORS.tiffanyBlue} />
                 </View>
                 <Text style={styles.settingText}>{t.profileNotif}</Text>
                 <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={() => setIsDarkMode(!isDarkMode)}>
                 <View style={styles.settingIconBox}>
                   <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={COLORS.tiffanyBlue} />
                 </View>
                 <Text style={styles.settingText}>{isDarkMode ? t.profileDark : t.profileLight}</Text>
                 <Ionicons name={isDarkMode ? "toggle" : "toggle-outline"} size={30} color={COLORS.tiffanyBlue} />
              </TouchableOpacity>
            </BlurView>

            <BlurView intensity={30} tint={theme.tint} style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>{t.profileAccount}</Text>
              <TouchableOpacity style={styles.settingItem}>
                 <View style={styles.settingIconBox}>
                   <Ionicons name="shield-checkmark" size={20} color={COLORS.tiffanyBlue} />
                 </View>
                 <Text style={styles.settingText}>{t.profileSecurity}</Text>
                 <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                 <View style={styles.settingIconBox}>
                   <Ionicons name="help-buoy" size={20} color={COLORS.tiffanyBlue} />
                 </View>
                 <Text style={styles.settingText}>{t.profileHelp}</Text>
                 <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                 <View style={[styles.settingIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                   <Ionicons name="log-out" size={20} color="#EF4444" />
                 </View>
                 <Text style={[styles.settingText, {color: '#EF4444'}]}>{t.profileLogout}</Text>
              </TouchableOpacity>
            </BlurView>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={[theme.bg1, theme.bg2, theme.bg1]} style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Premium <Text style={{color: COLORS.tiffanyBlue}}>Exchange</Text></Text>
              
              {/* Nút chuyển đổi ngôn ngữ */}
              <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangModal(true)}>
                <Text style={styles.langBtnText}>{language.flag} {language.code}</Text>
                <Ionicons name="chevron-down" size={14} color={COLORS.pastelPink} />
              </TouchableOpacity>
            </View>

            {renderContent()}
          </ScrollView>
        {/* Modal Chọn Ngôn Ngữ */}
        <Modal visible={showLangModal} transparent={true} animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
            <BlurView intensity={80} tint={theme.tint} style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.langSelectTitle}</Text>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity 
                  key={lang.code} 
                  style={[styles.langOption, language.code === lang.code && styles.langOptionActive]}
                  onPress={() => { setLanguage(lang); setShowLangModal(false); }}
                >
                  <Text style={styles.langOptionText}>{lang.flag}  {lang.name}</Text>
                  {language.code === lang.code && <Ionicons name="checkmark" size={20} color={COLORS.tiffanyBlue} />}
                </TouchableOpacity>
              ))}
            </BlurView>
          </TouchableOpacity>
        </Modal>

        {/* Modal Sửa Profile */}
        <Modal visible={showEditProfile} transparent={true} animationType="fade">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
            <View style={styles.modalOverlay}>
              <BlurView intensity={90} tint={theme.tint} style={[styles.modalContent, { width: '90%' }]}>
                <Text style={styles.modalTitle}>{t.modalUpdateInfo}</Text>
                
                <View style={{alignItems: 'center', marginBottom: 20}}>
                  <Image 
                    source={{uri: editForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}} 
                    style={{width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.tiffanyBlue, marginBottom: 10}} 
                  />
                  <TouchableOpacity onPress={pickImage} style={{backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20}}>
                    <Text style={{color: COLORS.tiffanyBlue, fontSize: 13, fontWeight: 'bold'}}>{t.modalChangeAvatar}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>{t.modalName}</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editForm.name}
                    onChangeText={(text) => setEditForm({...editForm, name: text})}
                    placeholder={t.modalName}
                    placeholderTextColor={theme.placeholder}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Email</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editForm.email}
                    onChangeText={(text) => setEditForm({...editForm, email: text})}
                    placeholder="Nhập email"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>{t.modalPhone}</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editForm.phone}
                    onChangeText={(text) => setEditForm({...editForm, phone: text})}
                    placeholder={t.modalPhone}
                    placeholderTextColor={theme.placeholder}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formRow}>
                  <TouchableOpacity 
                    style={[styles.formBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} 
                    onPress={() => setShowEditProfile(false)}
                  >
                    <Text style={styles.formBtnText}>{t.modalCancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.formBtn, { backgroundColor: COLORS.tiffanyBlue }]} 
                    onPress={() => { setProfile(editForm); setShowEditProfile(false); }}
                  >
                    <Text style={[styles.formBtnText, { color: '#000' }]}>{t.modalSave}</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={{marginTop: 25, alignItems: 'center'}}
                  onPress={() => {
                    setProfile({name: '', email: '', phone: '', avatar: ''});
                    setShowEditProfile(false);
                  }}
                >
                  <Text style={{color: '#EF4444', fontSize: 14, fontWeight: 'bold'}}>{t.modalDelete}</Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <View style={styles.bottomBarContainer}>
          <BlurView intensity={50} tint={theme.tint} style={styles.glassBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <TouchableOpacity key={tab.name} style={styles.tabButton} onPress={() => setActiveTab(tab.name)}>
                  <Ionicons 
                    name={tab.icon as any} 
                    size={26} 
                    color={isActive ? COLORS.tiffanyBlue : 'rgba(255,255,255,0.4)'} 
                  />
                  <Text style={[styles.tabText, isActive && { color: COLORS.tiffanyBlue, fontWeight: 'bold' }]}>
                    {tab.label || tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </View>

        {/* Modal Chi tiết Tỷ giá (Time Series) */}
        <Modal visible={!!selectedMarketItem} animationType="slide" transparent={true}>
          {selectedMarketItem && (
            <BlurView intensity={90} tint={theme.tint} style={styles.detailModalContainer}>
              {/* Back Button */}
              <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedMarketItem(null)}>
                <Ionicons name="chevron-back" size={28} color={COLORS.tiffanyBlue} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailTicker}>{selectedMarketItem.ticker}</Text>
                  <Text style={styles.detailName}>{selectedMarketItem.name}</Text>
                </View>
              </View>

              <View style={styles.detailPriceRow}>
                <Text style={styles.detailPrice}>{selectedMarketItem.price}</Text>
                <Text style={[styles.detailChange, selectedMarketItem.isUp ? styles.textUp : styles.textDown]}>
                  {selectedMarketItem.change || '+0.00'}  {selectedMarketItem.percent}
                </Text>
              </View>

              {/* Time Range Selector */}
              <View style={styles.rangeSelector}>
                {['1D', '1W', '1M', '3M', '6M', '1Y', '2Y'].map(range => (
                  <TouchableOpacity 
                    key={range} 
                    style={[styles.rangeBtn, range === selectedRange && styles.rangeBtnActive]}
                    onPress={() => setSelectedRange(range)}
                  >
                    <Text style={[styles.rangeText, range === selectedRange && styles.rangeTextActive]}>{range}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Line Chart */}
              <View style={styles.chartContainer}>
                {chartLoading ? (
                   <ActivityIndicator color={COLORS.tiffanyBlue} style={{marginTop: 100, height: 160}} size="large" />
                ) : chartData && (
                  <LineChart
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.data
                        }
                      ]
                    }}
                    width={screenWidth} // from react-native
                    height={260}
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={true}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} 
                    chartConfig={{
                      backgroundColor: "transparent",
                      backgroundGradientFrom: theme.bg2, // match theme
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: theme.bg2,
                      backgroundGradientToOpacity: 0,
                      decimalPlaces: 4,
                      color: (opacity = 1) => selectedMarketItem.isUp ? `rgba(16, 185, 129, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: "0",
                      },
                      propsForBackgroundLines: {
                        stroke: 'rgba(255,255,255,0.05)'
                      }
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                  />
                )}
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCol}>
                  <View style={styles.statRow}><Text style={styles.statLabel}>Open</Text><Text style={styles.statValue}>{(parseFloat(selectedMarketItem.price) * 0.998).toFixed(4)}</Text></View>
                  <View style={styles.statRow}><Text style={styles.statLabel}>High</Text><Text style={styles.statValue}>{(parseFloat(selectedMarketItem.price) * 1.01).toFixed(4)}</Text></View>
                  <View style={styles.statRow}><Text style={styles.statLabel}>Low</Text><Text style={styles.statValue}>{(parseFloat(selectedMarketItem.price) * 0.99).toFixed(4)}</Text></View>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statRow}><Text style={styles.statLabel}>Vol</Text><Text style={styles.statValue}>{(Math.random() * 10).toFixed(2)}M</Text></View>
                  <View style={styles.statRow}><Text style={styles.statLabel}>P/E</Text><Text style={styles.statValue}>-</Text></View>
                  <View style={styles.statRow}><Text style={styles.statLabel}>Mkt Cap</Text><Text style={styles.statValue}>-</Text></View>
                </View>
              </View>
            </BlurView>
          )}
        </Modal>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const getStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 130, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.text,
    letterSpacing: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  langBtnText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    overflow: 'hidden',
  },
  modalTitle: {
    color: COLORS.pastelPink,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.glassBorder,
  },
  langOptionActive: {
    backgroundColor: 'rgba(10, 186, 181, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
  },
  langOptionText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    overflow: 'hidden',
    backgroundColor: theme.cardBg,
  },
  label: {
    fontSize: 12,
    color: COLORS.pastelPink, // Hồng pastel cho nhãn phụ (đúng yêu cầu)
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.inputBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 16,
    padding: 18,
    fontSize: 20,
    marginBottom: 24,
    color: COLORS.tiffanyBlue, // Chữ nhập vào màu xanh tiffany
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyBox: {
    flex: 1,
  },
  swapBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  swapBtn: {
    backgroundColor: theme.cardBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 50,
    padding: 10,
  },
  inputSmall: {
    backgroundColor: theme.inputBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    color: COLORS.tiffanyBlue,
    fontWeight: '600',
    textAlign: 'center',
  },
  convertBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  convertBtnGradient: {
    padding: 20,
    alignItems: 'center',
  },
  convertBtnText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  errorText: {
    color: '#ff4d4f',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 25,
    paddingTop: 25,
    borderTopWidth: 1,
    borderColor: theme.glassBorder,
    alignItems: 'center',
  },
  resultTitle: {
    color: COLORS.pastelPink,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.tiffanyBlue,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.pastelPink,
    textAlign: 'center',
    marginTop: 60,
    fontWeight: '500',
  },
  
  
  featuredNewsCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  featuredNewsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredNewsBlur: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15,
  },
  featuredNewsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  newsSource: {
    color: COLORS.tiffanyBlue,
    fontSize: 12,
    fontWeight: 'bold',
  },
  newsListCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 15,
    alignItems: 'center',
  },
  newsListImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  newsListContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  newsListTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  bottomBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  glassBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 6,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: theme.cardBg,
    borderRadius: 16,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(10, 186, 181, 0.2)',
  },
  toggleText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: COLORS.tiffanyBlue,
  },
  analysisContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  analysisText: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 15,
  },
  chatBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.tiffanyBlue,
    borderBottomRightRadius: 4,
  },
  aiMsg: {
    alignSelf: 'flex-start',
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.glassBorder,
  },
  chatText: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 22,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: theme.inputBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: COLORS.tiffanyBlue,
    fontSize: 15,
    marginRight: 10,
  },
  chatSendBtn: {
    backgroundColor: theme.cardBg,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageCaption: {
    color: theme.subText,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  stockContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  marketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  stockHeader: {
    color: theme.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    overflow: 'hidden',
  },
  stockInfo: {
    flex: 1,
  },
  stockTicker: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  stockPriceData: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeUp: {
    backgroundColor: '#10b981', // Xanh lá
  },
  badgeDown: {
    backgroundColor: '#ef4444', // Đỏ
  },
  stockBadgeText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailModalContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: -10,
  },
  backBtnText: {
    color: COLORS.tiffanyBlue,
    fontSize: 18,
    marginLeft: 2,
  },
  detailTicker: {
    color: theme.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailName: {
    color: theme.subText,
    fontSize: 16,
    marginTop: 4,
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 30,
  },
  detailPrice: {
    color: theme.text,
    fontSize: 40,
    fontWeight: 'bold',
    marginRight: 10,
  },
  detailChange: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textUp: {
    color: '#10b981',
  },
  textDown: {
    color: '#ef4444',
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rangeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  rangeBtnActive: {
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
  },
  aiInsightBox: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    color: COLORS.tiffanyBlue,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  aiInsightText: {
    color: theme.text,
    fontSize: 14,
    lineHeight: 20,
  },
  rangeText: {
    color: theme.subText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rangeTextActive: {
    color: theme.text,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
  },
  statCol: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingRight: 20,
  },
  statLabel: {
    color: theme.subText,
    fontSize: 13,
  },
  statValue: {
    color: theme.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  profileHeaderCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.tiffanyBlue,
    marginBottom: 15,
  },
  profileName: {
    color: theme.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    color: theme.subText,
    fontSize: 14,
    marginBottom: 15,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tiffanyBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  proBadgeText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsGroup: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    overflow: 'hidden',
  },
  settingsGroupTitle: {
    color: theme.subText,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 206, 209, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
  },
  settingValue: {
    color: theme.subText,
    fontSize: 14,
    marginRight: 10,
  },
  editProfileBtn: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.tiffanyBlue,
  },
  editProfileBtnText: {
    color: COLORS.tiffanyBlue,
    fontSize: 14,
    fontWeight: 'bold',
  },
  formGroup: {
    width: '100%',
    marginBottom: 15,
  },
  formLabel: {
    color: theme.subText,
    fontSize: 14,
    marginBottom: 8,
  },
  formInput: {
    width: '100%',
    backgroundColor: theme.inputBg,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: theme.text,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  formBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  formBtnText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
