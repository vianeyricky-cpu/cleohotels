export const chatLanguages = [
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian' },
  { code: 'en', name: 'English', english: 'English' },
  { code: 'jv', name: 'Basa Jawa', english: 'Javanese (polite)' },
  { code: 'zh', name: '中文', english: 'Simplified Chinese' },
  { code: 'ja', name: '日本語', english: 'Japanese' },
  { code: 'ko', name: '한국어', english: 'Korean' },
  { code: 'ar', name: 'العربية', english: 'Arabic' },
  { code: 'ms', name: 'Bahasa Melayu', english: 'Malay' },
  { code: 'fr', name: 'Français', english: 'French' },
  { code: 'de', name: 'Deutsch', english: 'German' },
  { code: 'es', name: 'Español', english: 'Spanish' },
] as const;
export type ChatLanguage = typeof chatLanguages[number]['code'];
export function isChatLanguage(value: unknown): value is ChatLanguage {
  return chatLanguages.some(l => l.code === value);
}
const languageNames: [ChatLanguage, RegExp][] = [
  ['id', /\b(indonesia[n]?|indo)\b/i], ['en', /\b(english|inggris)\b/i],
  ['jv', /\b(jawa|javanese)\b/i], ['zh', /\b(mandarin|chinese|tionghoa)\b|中文/i],
  ['ja', /\b(jepang|japanese)\b|日本語/i], ['ko', /\b(korea[n]?)\b|한국어/i],
  ['ar', /\b(arab[ic]*)\b|العربية/i], ['ms', /\b(melayu|malay)\b/i],
  ['fr', /\b(french|prancis|français)\b/i], ['de', /\b(german|jerman|deutsch)\b/i],
  ['es', /\b(spanish|spanyol|español)\b/i],
];
export function requestedLanguage(message: string): ChatLanguage | undefined {
  const match = languageNames.find(([, pattern]) => pattern.test(message));
  if (!match) return;
  const remainder = message.replace(match[1], '').replace(/\b(bahasa|basa|in|dalam|please|ya|dong|saja)\b/gi, '').replace(/[\s?!.]+/g, '');
  if (!remainder) return match[0];
  if (/\b(staff?|resepsionis|receptionist)\b/i.test(message) && !/\b(jawab|balas|reply|respond|answer)\b/i.test(message)) return;
  if (/\b(jawab|balas|bicara|berbicara|ngomong|gunakan|pakai|ganti|rubah|ubah|switch|reply|respond|answer|speak|continue|use|nganggo|migunakaken)\b/i.test(message)) return match[0];
}
export function messageLanguage(message: string, fallback: ChatLanguage): ChatLanguage {
  if (/[\u3040-\u30ff]/.test(message)) return 'ja';
  if (/[\uac00-\ud7af]/.test(message)) return 'ko';
  if (/[\u0600-\u06ff]/.test(message)) return 'ar';
  if (/[\u4e00-\u9fff]/.test(message)) return 'zh';
  if (/\b(apa|bisa|rubah|ubah|ganti|kamar|berapa|saya|mau|ingin|tolong|terima kasih|fasilitas|alamat|pakai)\b/i.test(message)) return 'id';
  if (/\b(what|where|please|hello|thanks|how|could|would|rooms|facilities)\b/i.test(message)) return 'en';
  return fallback;
}
export function languageHelp(language: ChatLanguage): string {
  const text: Record<ChatLanguage, string> = {
    id: 'Tentu, dengan senang hati! Mau menggunakan bahasa apa? Saya bisa membantu informasi Cleo Hotels dalam bahasa Indonesia, English, Jawa, dan bahasa lainnya. Pilih melalui menu Bahasa atau langsung sebutkan, ya.',
    en: 'Of course, I’d be happy to! Which language would you prefer? You can choose in the Language menu or simply tell me, and we’ll continue chatting about Cleo Hotels in that language.',
    jv: 'Mesthi, kanthi seneng ati. Panjenengan kersa migunakaken basa menapa? Mangga pilih ing menu Language utawi sebataken basanipun.',
    zh: '当然可以！您希望使用哪种语言？请在 Language 菜单中选择，或直接告诉我，我很乐意为您介绍 Cleo Hotels。',
    ja: 'もちろんです！ご希望の言語を教えてください。Language メニューからも選べます。Cleo Hotels について喜んでご案内します。',
    ko: '물론입니다! 어떤 언어를 원하시나요? Language 메뉴에서 선택하시거나 말씀해 주세요. Cleo Hotels에 대해 친절히 안내해 드리겠습니다.',
    ar: 'بكل سرور! ما اللغة التي تفضلها؟ يمكنك اختيارها من قائمة Language أو إخباري بها، وسأساعدك بمعلومات فنادق Cleo.',
    ms: 'Sudah tentu! Bahasa apa yang anda inginkan? Pilih dalam menu Language atau beritahu saya, dan saya akan membantu mengenai Cleo Hotels.',
    fr: 'Bien sûr, avec plaisir ! Quelle langue préférez-vous ? Choisissez dans le menu Language ou dites-le-moi pour continuer notre échange sur Cleo Hotels.',
    de: 'Sehr gern! Welche Sprache bevorzugen Sie? Wählen Sie im Menü Language oder sagen Sie es mir, damit wir über Cleo Hotels weiterreden können.',
    es: '¡Por supuesto! ¿Qué idioma prefiere? Elíjalo en el menú Language o dígamelo y continuaremos conversando sobre Cleo Hotels.',
  };
  return text[language];
}
export const languageHelpQuestion = /^(?:bisa(?:kah)?|boleh(?:kah)?|can (?:you|we)|could (?:you|we))?\s*(?:tolong\s+)?(?:rubah|ubah|ganti|mengganti|change|switch)\s*(?:ke\s*)?(?:bahasa|language)(?:\s*(?:nya|lain|lainnya|please))?\s*[?!.]*$/i;
export function scopeReply(language: ChatLanguage): string {
  const replies: Record<ChatLanguage, string> = {
    id: 'Dengan senang hati saya membantu informasi Cleo Hotels Jemursari, Walikota Mustajab, dan Tunjungan. Untuk topik tersebut saya belum bisa membantu. Ada yang ingin ditanyakan tentang kamar, fasilitas, atau rencana menginap Anda?',
    en: 'I’m here to help with Cleo Hotels Jemursari, Walikota Mustajab and Tunjungan, so I can’t help with that topic. May I help with our rooms, facilities or your next stay instead?',
    jv: 'Kula saged mbiyantu informasi Cleo Hotels Jemursari, Walikota Mustajab, lan Tunjungan. Nyuwun pangapunten, topik menika wonten ing njawi layanan kula. Panjenengan kersa nyuwun pirsa babagan kamar utawi fasilitas?',
    zh: '我很乐意为您介绍 Cleo Hotels 的 Jemursari、Walikota Mustajab 和 Tunjungan 分店。这个话题不在我的服务范围内。您想了解客房、设施或住宿安排吗？',
    ja: 'Cleo Hotels の Jemursari、Walikota Mustajab、Tunjungan のご案内を担当しています。その話題にはお答えできませんが、客室や設備、ご宿泊についてお手伝いできます。',
    ko: 'Cleo Hotels의 Jemursari, Walikota Mustajab, Tunjungan 지점을 안내하고 있습니다. 해당 주제는 도와드리기 어렵지만 객실, 시설, 숙박 관련 질문은 기꺼이 도와드리겠습니다.',
    ar: 'يسعدني مساعدتك بمعلومات فنادق Cleo في Jemursari وWalikota Mustajab وTunjungan. هذا الموضوع خارج نطاق خدمتي. هل أساعدك بمعلومات الغرف أو المرافق أو إقامتك القادمة؟',
    ms: 'Saya sedia membantu tentang Cleo Hotels Jemursari, Walikota Mustajab dan Tunjungan. Topik itu di luar skop saya. Boleh saya bantu dengan bilik, kemudahan atau rancangan penginapan anda?',
    fr: 'Je vous accompagne pour Cleo Hotels Jemursari, Walikota Mustajab et Tunjungan. Ce sujet sort de mon domaine. Puis-je vous renseigner sur nos chambres, équipements ou votre prochain séjour ?',
    de: 'Gern helfe ich bei Cleo Hotels Jemursari, Walikota Mustajab und Tunjungan. Dieses Thema liegt außerhalb meines Bereichs. Möchten Sie mehr über Zimmer, Ausstattung oder Ihren Aufenthalt erfahren?',
    es: 'Con gusto le ayudo con Cleo Hotels Jemursari, Walikota Mustajab y Tunjungan. Ese tema queda fuera de mi ámbito. ¿Desea información sobre habitaciones, instalaciones o su próxima estancia?',
  };
  return replies[language];
}
export function greeting(language: ChatLanguage, branch?: string, now = new Date(), variant = 0): string {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false }).format(now));
  if (language === 'id') {
    const time = hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam';
    const welcome = [`Selamat ${time}! Selamat datang di Cleo Hotels.`, `Halo, selamat ${time}! Senang bisa membantu Anda.`, `Selamat ${time}! Sudah punya rencana menginap?`][variant % 3];
    return `${welcome} Saya Cleo AI, asisten virtual Anda.${branch ? ` Ada yang ingin ditanyakan tentang ${branch}?` : ' Mau mengenal cabang Jemursari, Walikota Mustajab, atau Tunjungan?'} Saya siap membantu soal kamar, fasilitas, promo, dan reservasi. Kita juga bisa berbincang dalam bahasa pilihan Anda.`;
  }
  if (language === 'en') {
    const time = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    return `${['Good '+time+'! Welcome to Cleo Hotels.', 'Hello! Lovely to have you here.', 'Welcome! Planning your next stay?'][variant % 3]} I’m Cleo AI, your virtual hotel assistant.${branch ? ` How can I help with ${branch}?` : ' Which location would you like to explore: Jemursari, Walikota Mustajab, or Tunjungan?'} Ask me about rooms, facilities, offers or booking, in your preferred language.`;
  }
  const intros: Record<Exclude<ChatLanguage, 'id' | 'en'>, string> = {
    jv: 'Sugeng rawuh ing Cleo Hotels! Kula Cleo AI, asisten virtual panjenengan. Mangga nyuwun pirsa babagan kamar, fasilitas, promo, utawi reservasi.',
    zh: '欢迎来到 Cleo Hotels！我是 Cleo AI，您的虚拟酒店助手。很高兴为您介绍客房、设施、优惠和预订。',
    ja: 'Cleo Hotels へようこそ！バーチャルアシスタントの Cleo AI です。客室、設備、キャンペーン、ご予約についてお気軽にご相談ください。',
    ko: 'Cleo Hotels에 오신 것을 환영합니다! 가상 호텔 도우미 Cleo AI입니다. 객실, 시설, 프로모션, 예약에 관해 편하게 물어보세요.',
    ar: 'أهلاً بك في فنادق Cleo! أنا Cleo AI، مساعدك الافتراضي. يسعدني مساعدتك بمعلومات الغرف والمرافق والعروض والحجز.',
    ms: 'Selamat datang ke Cleo Hotels! Saya Cleo AI, pembantu maya anda. Saya sedia membantu tentang bilik, kemudahan, promosi dan tempahan.',
    fr: 'Bienvenue chez Cleo Hotels ! Je suis Cleo AI, votre assistant virtuel. Je vous renseigne avec plaisir sur les chambres, les équipements, les offres et les réservations.',
    de: 'Willkommen bei Cleo Hotels! Ich bin Cleo AI, Ihr virtueller Hotelassistent. Gern helfe ich bei Fragen zu Zimmern, Ausstattung, Angeboten und Buchungen.',
    es: '¡Bienvenido a Cleo Hotels! Soy Cleo AI, su asistente virtual. Con gusto le ayudo con habitaciones, instalaciones, ofertas y reservas.',
  };
  return intros[language] + (branch ? ` (${branch})` : '');
}
